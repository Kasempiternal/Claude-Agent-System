# GPT Architect

`/gpt-architect` makes Claude Code the architect and GPT workers the execution layer. Claude plans, decomposes, routes, integrates, and signs off; every delegable coding **and investigation** task goes to GPT-5.6 Sol, Terra, or Luna through the Codex MCP server.

Workers use the user's logged-in ChatGPT subscription—no OpenAI API key, proxy, or change to Claude's OAuth/subscription. The Codex MCP calls serialize, so the bundled CLIs supply true parallel fan-out and DAG execution.

## Install

Install the CAS plugin normally; its hook registrations invoke bundled files through `${CLAUDE_PLUGIN_ROOT}/skills/gpt-architect/...`. For a standalone local installation, run:

```bash
./claude-agent-system-plugin/skills/gpt-architect/install.sh
```

The installer copies the skill, four hooks, and four CLIs to `~/.claude` / `~/.local/bin`, backs up files before replacement, makes executable files executable, and prints the required `settings.json` hook JSON. With `jq`, it also makes a timestamped backup and idempotently merges the hook entries.

## Use

```text
/gpt-architect on                 # all projects and sessions
/gpt-architect on session         # current Claude session only
/gpt-architect on here /path/repo # current directory tree only
/gpt-architect status
/gpt-architect off
```

`on` activates a global flag; `on session` and `on here` use session/path registries. While active, the `Agent` tool is denied so Claude routes delegable work to Codex workers. `gpt: <task>` is also available as a direct worker lane, even when architect mode is off.

## Architecture

```text
User request
    │
Claude Code: architect — plan, route, integrate, verify
    │  Codex MCP (serial): one blocking worker / reply thread
    ├─ gpt-run: independent workers as background shell tasks
    └─ gpt-fleet: dependency DAG, waves, report injection
              │
      Codex CLI logged in with ChatGPT subscription
              │
      GPT-5.6 Sol / Terra / Luna workers
```

## Routing: first match wins

1. Security, concurrency, performance regression, or tricky refactor → Sol/high.
2. One exceptionally hard coherent problem → Sol/xhigh; use max only after evidence that xhigh was insufficient.
3. Known multi-stage work → `gpt-fleet`, routing each node independently.
4. Unknown dynamic decomposition of three or more subproblems → one Sol/ultra worker.
5. Reasoning-heavy bug, flaky test hunt, or PR review → Terra/high.
6. Mechanical change → Luna/low; investigation/summarization → Luna/medium.
7. Clear, low-risk, at-most-two-file change → Luna/medium.
8. Everything else → Terra/high.

Run `${CLAUDE_PLUGIN_ROOT}/skills/gpt-architect/bin/gpt-quota -s` before each plugin wave (or `gpt-quota -s` from `PATH` standalone). At 90% 5-hour usage, do not dispatch; from 70% to 90%, avoid Sol/long workers. Never run Sol xhigh/max/ultra concurrently.

## Lanes and caps

| Lane | Use it for | Limit |
|---|---|---|
| `mcp__codex__codex` | One blocking call or a `codex-reply` iteration | MCP calls serialize |
| `gpt-run` | Two or more independent tasks | Max 4 workers; same-repo writers default to 1 |
| `gpt-fleet` | A known multi-stage dependency DAG | `max_parallel` defaults to 4 |

Read-only workers may use all four slots. Allow two same-repository writers only with explicit, non-overlapping path ownership; never overlap files, shared configuration, lockfiles, schemas, migrations, generated outputs, or repository-wide formatters. More than two writers need separate worktrees and a later integration stage.

```bash
${CLAUDE_PLUGIN_ROOT}/skills/gpt-architect/bin/gpt-run -m terra -e high -s ws -C "$PWD" -n feature <<'EOF'
OBJECTIVE: Implement the scoped feature.
VERIFY: Run the focused test suite.
FINAL MESSAGE FORMAT: <=15 lines — did/files/verified/risks.
EOF
```

When `CLAUDE_PLUGIN_ROOT` is unset for a standalone installation, use `gpt-run`, `gpt-fleet`,
`gpt-watch`, and `gpt-quota` from `PATH` instead.

```json
{"name":"review","cwd":"/absolute/repo","max_parallel":2,"workers":[
  {"name":"audit","model":"luna","effort":"medium","sandbox":"ro","prompt":"Audit. FINAL MESSAGE FORMAT: <=15 lines."},
  {"name":"verify","model":"terra","effort":"high","sandbox":"ro","after":["audit"],"prompt":"Review: {{final:audit}}"}
]}
```

## CLI reference

| Command | Purpose |
|---|---|
| `gpt-run` | One `codex exec` worker; accepts model, effort, sandbox, cwd, name, and `-r` resume thread ID. |
| `gpt-fleet <spec.json>` | Runs a dependency DAG; `after` gates nodes and enables `{{final:name}}` injection. |
| `gpt-quota [-s]` | Reads current 5-hour/weekly ChatGPT quota from recent Codex rollouts. |
| `gpt-watch` | Color-coded live tail of active Codex worker rollout files. |

`gpt-run` resolves Codex in this order: `$CODEX_BIN`, `codex` on `PATH`, then `/opt/homebrew/bin/codex`; it exits with a clear diagnostic if none is available.

## Requirements

- The plugin registers the Codex MCP entry automatically. You must install the Codex CLI and authenticate it with a ChatGPT account by running `codex login`.
- Current Claude Code.
- `bash`, `python3`, and `node`.
- macOS only for the optional completion notifications in the direct lane and fleet.

The MCP entry ships with the plugin; the Codex CLI and its ChatGPT authentication are external prerequisites.
