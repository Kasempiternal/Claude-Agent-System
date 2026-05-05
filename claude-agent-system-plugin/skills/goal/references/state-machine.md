# /goal — state machine, guards, schema, troubleshooting

> **⚠ DEV / TESTING PHASE.** This skill has only been validated by script-level smoke tests. No end-to-end run inside a real Claude Code session has been performed. Behavior described below is by design, not yet observed. Test in a throwaway project before relying on `/goal` for real work. Disarm a runaway loop with `/goal clear` or `rm .cas/goals/active.json`.

## Status enum

| Status | Set by | Terminal? | Notes |
|---|---|---|---|
| `active` | user (`create`, `resume`) | no | Hook will force continuations. |
| `paused` | user (`pause`) | no | Hook is silent. `resume` to reactivate. |
| `achieved` | model | yes | Model edited state file when goal complete. |
| `abandoned` | hook (livelock/max-iter/ceiling) or model | yes | Reason stored in `history[].reason`. |
| `cleared` | user (`clear`) | yes | State immediately archived; active.json removed. |

There is no `max_reached` status — hitting `maxIterations` maps to `abandoned` with `reason: "max iterations reached"`.

## Transitions

```
            create
              │
              ▼
       ┌──────────┐  pause   ┌──────────┐
       │  active  │ ───────► │  paused  │
       │          │ ◄─────── │          │
       └────┬─────┘  resume  └─────┬────┘
            │                      │
            │ (hook)               │ (clear)
            │                      ▼
            ▼                  archived
      ┌─────────────┬──────────────┐
      │ achieved    │  abandoned   │
      │ (model)     │  (hook/model)│
      └─────────────┴──────────────┘
                    │
                    │ /goal clear
                    ▼
                archived
```

## Guard clauses (Stop hook order)

The Stop hook applies these in order. First match wins.

1. **No state file** → silent exit. Most projects have no goal.
2. **status != active** → silent exit. Paused or terminal goals are not pursued.
3. **iterations >= maxIterations × 2 (absolute ceiling)** → flip `abandoned`, silent exit. Belt-and-suspenders against future Claude Code changes that might let other guards misfire. Unreachable in normal flow because guard #4 fires first.
4. **iterations >= maxIterations** → flip `abandoned` with reason `"max iterations reached"`, silent exit.
5. **last assistant turn had no tool calls** → flip `abandoned` with reason `"livelock guard: no tool calls in last turn"`, silent exit. This catches the most common autonomous-agent failure mode (talking instead of acting) without needing an external evaluator.
6. **iterations % yieldEvery == 0** (and `yieldEvery > 0`) → silent exit, status stays `active`. Returns control to the prompt so the user can type `/goal pause | status | clear`. Next user message resumes pursuit.
7. **else** → emit `{"decision":"block","reason":"<continuation directive>"}`, exit 0. Claude takes another turn.

The `stop_hook_active` field from Stop hook stdin is **deliberately not used** as an early-exit. Exiting on it would cap pursuit at one continuation. The four guard clauses above (absolute ceiling, max-iter, no-tool-calls, yield-every) are the livelock controls instead.

The codex "queued user input" guard is **not implementable** — Claude Code's Stop hook payload doesn't expose queued input. Dropped.

## Schema reference

### `.cas/goals/active.json` (durable)

```json
{
  "objective":     "string (1..2000 chars)",
  "status":        "active | paused | achieved | abandoned | cleared",
  "iterations":    0,
  "maxIterations": 50,
  "yieldEvery":    5,
  "createdAt":     "ISO-8601",
  "updatedAt":     "ISO-8601",
  "history": [
    { "at": "ISO-8601", "event": "created|paused|resumed|completed|abandoned|cleared", "reason": "optional string" }
  ]
}
```

### `.cas/goals/.runtime.json` (transient — should be gitignored)

```json
{
  "sessionId":      "Claude session id (best-effort)",
  "transcriptPath": "path to current session transcript",
  "lastTickAt":     "ISO-8601"
}
```

## Authority split (codex parity)

- **User-only**: `create`, `pause`, `resume`, `clear`, max-iter changes (via re-create).
- **Model-only**: mark `achieved`, mark `abandoned` (with reason).
- **Hook-only**: flip to `abandoned` (with reason: max iterations / livelock guard / absolute ceiling).

The model **must not** set status to `paused` or `cleared` directly. Those are reserved.

## Troubleshooting

### "/goal didn't auto-continue"

Check the conditions in order:

1. Is `.cas/goals/active.json` present and `status: "active"`? `cat .cas/goals/active.json`
2. Did the last assistant turn make any tool calls? If not, the livelock guard fired — see `history[]` for `"livelock guard: no tool calls in last turn"`.
3. Was this iteration a yield tick? With default `yieldEvery: 5`, every 5th tick exits silent — type any message to resume.
4. Is the Stop hook registered? Look at `~/.claude/plugins/cache/claude-agent-system/cas/<version>/hooks/hooks.json` for a `Stop` array entry.
5. Did the hook crash? Check `~/.claude/hooks-logs/<today>.jsonl` for an entry with `hook: "goal-continuation"`.

### "/goal pause didn't take effect"

Pause writes to `active.json` synchronously. The next Stop tick will see `status: "paused"` and exit silent. If pursuit is mid-turn when you invoke pause, the current turn finishes first, then pause kicks in on the next tick.

### "I want continuous pursuit with no yield windows"

`/goal <objective> --yield-every 0`

### "Hook timeout exceeded"

Transcript reads are capped at 5 MB. If the hook still times out, file a bug — likely a runaway parse loop. The hook is designed to stay well under 10s for any session size.

## Known limitations vs codex

- **Per-project, not per-thread.** Claude Code has no equivalent thread DB. One active goal per project directory.
- **No model-facing tools.** Codex registers `create_goal`/`update_goal` as model tools. We use direct JSON edits to the state file. Functionally equivalent.
- **No queued-input guard.** Stop hook payload doesn't expose this; dropped.
- **No token budget.** Codex enforces a per-goal token cap; we rely on max-iter, no-tool-calls, and the absolute ceiling instead.
