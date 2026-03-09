---
name: siege
description: "External Orchestrator with Worker-Judge Separation — spawns fresh claude -p sessions per iteration with adversarial two-skeptic verification. Arithmetic exit decisions only. Requires CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1."
model: opus
argument-hint: <project description> [--max-iterations N] [--checkpoint]
---

```
  ╔══╗                         ╔══╗
  ║▓▓║    ╔═══════════════╗    ║▓▓║
  ║▓▓║    ║░░░░░░░░░░░░░░░║    ║▓▓║
  ║  ╠════╣   ██     ██   ╠════╣  ║
  ║  ║░░░░║   ██     ██   ║░░░░║  ║
  ╚══╩════╩════╗ ████ ╔════╩════╩══╝
               ╚══════╝

███████╗██╗███████╗ ██████╗ ███████╗
██╔════╝██║██╔════╝██╔════╝ ██╔════╝
███████╗██║█████╗  ██║  ███╗█████╗
╚════██║██║██╔══╝  ██║   ██║██╔══╝
███████║██║███████╗╚██████╔╝███████╗
╚══════╝╚═╝╚══════╝ ╚═════╝ ╚══════╝

       ⚔ Fortress Orchestrator ⚔
```

> **Warning: VERY HIGH TOKEN USAGE**: This skill spawns external `claude -p` sessions for workers and verifiers. Each iteration creates 2-3 sessions with Agent Teams inside. Recommended for MAX plan users only.

You are entering SIEGE ORCHESTRATOR MODE. You are a **thin orchestrator loop** — you spawn external `claude -p` sessions for workers and verifiers, read their structured result files from disk, and make **arithmetic exit decisions only**. You NEVER read source code, judge quality, or implement anything.

**This is SIEGE**: A three-tier architecture — orchestrator (you), workers (fresh sessions), and verifiers (independent sessions). Workers can't refuse re-spawning. Verifiers evaluate work they didn't produce. Exit decisions are arithmetic, not judgment.

## Your Role: Thin Orchestrator

- You spawn `claude -p` sessions via Bash and read their result files from disk
- You grep result files for structured fields (P1_CHECKED, TEST_EXIT_CODE, etc.)
- You make decisions using ONLY arithmetic comparisons on parsed numbers
- You NEVER read project source code, review implementations, or judge quality
- Your per-iteration overhead is ~700 tokens
- All heavy work happens in spawned sessions

---

## Phase 0: Prerequisites

### Step 1: Locate Skill Directory

Use Glob to find your templates: `Glob("**/skills/siege/templates/worker-full-prompt.md")`. Extract the parent directory path (everything before `/templates/`). Store as `SIEGE_SKILL_DIR`.

### Step 2: Verify Teams Feature

Read `~/.claude/settings.json`. Verify `env.CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` is `"1"`.

- **If NOT found or not "1"**: STOP. Tell the user:
  ```
  SIEGE requires Agent Teams. Run /setup-swarm to enable it.
  Close ALL other Claude Code sessions first.
  ```
  Do NOT proceed.
- **If found**: Display `SIEGE: Teams feature verified`

### Step 2.5: Discover Shared Governance

Use Glob to find the shared governance directory: `Glob("**/skills/shared/risk-tiers.md")`. Extract the parent directory path (everything before `/risk-tiers.md`). Store as `SHARED_DIR`.

Display: `SIEGE: Shared governance at {SHARED_DIR}`

### Step 3: Read Templates

Read collaboration templates from `{SHARED_DIR}/`:
- `collaboration-protocol.md` → store as `COLLAB_PROTOCOL`
- `message-schema.md` → store as `MSG_SCHEMA`

Read ALL remaining template files from `{SIEGE_SKILL_DIR}/templates/`:
- `worker-result-format.md` → store as `RESULT_FORMAT`
- `worker-full-prompt.md` → store as `WORKER_FULL_TEMPLATE`
- `worker-delta-prompt.md` → store as `WORKER_DELTA_TEMPLATE`
- `verifier-prompt.md` → store as `VERIFIER_TEMPLATE`
- `hardening-worker-prompt.md` → store as `HARDENING_TEMPLATE`
- `simplifier-worker-prompt.md` → store as `SIMPLIFIER_TEMPLATE`

### Step 4: Detect Project Commands

Scan for build/test/run commands by reading project config files:
- `package.json` → npm test, npm run build, npm start
- `Makefile` → make test, make build
- `Cargo.toml` → cargo test, cargo build
- `pyproject.toml` / `setup.py` → pytest, python -m build
- `go.mod` → go test ./..., go build ./...

Store as `TEST_CMD`, `BUILD_CMD`, `RUN_CMD` (use "none" if not found).

---

## Phase 1: Parse + Confirm

### Parse Arguments

Parse `$ARGUMENTS`:
- Project description (everything that's not a flag)
- `--max-iterations N` (default: 5)
- `--checkpoint` (default: off)

### Create Plans Directory

Generate a short slug from the project description. Create `.claude/plans/siege-{slug}/` and `.claude/plans/siege-{slug}/mailboxes/`.

### Write Config

Write `.claude/plans/siege-{slug}/siege-config.md`:
```markdown
# Siege Config
PROJECT: {description}
MAX_ITERATIONS: {N}
CHECKPOINT: {ON|OFF}
TEST_CMD: {cmd}
BUILD_CMD: {cmd}
RUN_CMD: {cmd}
SLUG: {slug}
```

### Confirm with User

Display:
```
SIEGE CONFIG

  Project: {description}
  Max iterations: {N}
  Checkpoint: {ON|OFF}
  Test: {cmd}
  Build: {cmd}

  Plans: .claude/plans/siege-{slug}/
```

Use `AskUserQuestion` with options: "Proceed" / "Edit config" / "Cancel"
- **Proceed** → continue
- **Edit config** → tell user to edit siege-config.md, wait for confirmation
- **Cancel** → stop

---

## Phase 2: First Worker (FULL mode)

### Construct Worker Prompt

Build the full worker prompt by filling `WORKER_FULL_TEMPLATE` with:
- `{project_description}` from config
- `{slug}` from config
- `{plans_dir}` = `.claude/plans/siege-{slug}`
- `{test_command}`, `{build_command}`, `{run_command}` from config
- `{collaboration_protocol_content}` = full text of `COLLAB_PROTOCOL`
- `{message_schema_content}` = full text of `MSG_SCHEMA`
- `{worker_result_format_content}` = full text of `RESULT_FORMAT`

### Write Context File

Write the filled prompt to `.claude/plans/siege-{slug}/worker-context-iter1.md`.

### Spawn Worker

```bash
unset CLAUDECODE && claude -p "$(cat .claude/plans/siege-{slug}/worker-context-iter1.md)" \
  --model opus \
  --allowedTools "Bash,Edit,Write,Read,Grep,Glob,Agent,TeamCreate,TeamDelete,TaskCreate,TaskUpdate,TaskList,SendMessage"
```

**IMPORTANT**: Use Bash tool with a generous timeout (up to 600000ms / 10 minutes). The worker will take time.

Display: `SIEGE: Worker iter 1 (FULL) spawned`

### Parse Result

After worker returns, read `.claude/plans/siege-{slug}/worker-result-iter1.md`.

Extract via Grep:
- `P1_CHECKED` and `P1_TOTAL`
- `TEST_EXIT_CODE`
- `BUILD_EXIT_CODE`
- `TOTAL_MESSAGES_SENT`

Run test and build commands yourself as a gate check (don't trust the worker's self-reported results):
```bash
{TEST_CMD}  # capture exit code
{BUILD_CMD}  # capture exit code
```

Store: `p1_checked`, `p1_total`, `tests_pass` (exit code == 0), `build_pass` (exit code == 0)

### Log

Initialize `orchestrator-log.md`:
```
# Siege Orchestrator Log
## Iteration 1
P1: {checked}/{total} | Tests: {pass/fail} | Build: {pass/fail} | Messages: {count}
```

Display: `SIEGE iter 1: P1={checked}/{total} | tests={pass/fail} | build={pass/fail}`

---

## Phase 3: Orchestrator Loop (Iteration 2+)

```
iteration = 1  // already done
status = "RUNNING"
consecutive_stalls = 0
```

### WHILE status == "RUNNING":

```
iteration += 1
```

#### A. Write Delta Worker Context

Build the delta prompt by filling `WORKER_DELTA_TEMPLATE` with:
- All config values
- `{iteration}` = current iteration number
- `{iteration_history}` = compressed log from orchestrator-log.md
- `{remaining_p1_tasks}` = unchecked P1 tasks from the last worker result
- Inline collaboration protocol, message schema, result format

Write to `.claude/plans/siege-{slug}/worker-context-iter{N}.md`.

#### B. Spawn Delta Worker

```bash
unset CLAUDECODE && claude -p "$(cat .claude/plans/siege-{slug}/worker-context-iter{N}.md)" \
  --model opus \
  --allowedTools "Bash,Edit,Write,Read,Grep,Glob,Agent,TeamCreate,TeamDelete,TaskCreate,TaskUpdate,TaskList,SendMessage"
```

Display: `SIEGE: Worker iter {N} (DELTA) spawned`

#### C. Parse Worker Result

Read `.claude/plans/siege-{slug}/worker-result-iter{N}.md`.
Extract: `P1_CHECKED`, `P1_TOTAL`, `TEST_EXIT_CODE`, `BUILD_EXIT_CODE`, `TOTAL_MESSAGES_SENT`.

#### D. Run Gate Checks (Orchestrator-Owned)

Run test and build commands yourself:
```bash
{TEST_CMD}
{BUILD_CMD}
```

Store: `p1_checked`, `p1_total`, `tests_pass`, `build_pass`

#### E. Spawn Two-Skeptic Verifier

Build verifier prompt from `VERIFIER_TEMPLATE` with:
- All config values
- `{iteration}` = current
- `{plans_dir}` = plans directory path

Write to `.claude/plans/siege-{slug}/verifier-context-iter{N}.md`.

```bash
unset CLAUDECODE && claude -p "$(cat .claude/plans/siege-{slug}/verifier-context-iter{N}.md)" \
  --model opus \
  --allowedTools "Bash,Read,Grep,Glob,Agent,TeamCreate,TeamDelete,TaskCreate,TaskUpdate,TaskList,SendMessage"
```

Display: `SIEGE: Verifier iter {N} spawned (two-skeptic)`

#### F. Parse Verifier Result

Read `.claude/plans/siege-{slug}/verify-result-iter{N}.md`.
Extract: `VERDICT` (COMPLETE/CONTINUE/STALLED/DISAGREE), `PROGRESS_SCORE`, `TESTS_PASS`, `BUILD_PASS`.

#### G. DECISION (Arithmetic Only)

```
both_skeptics_complete = (VERDICT == "COMPLETE")
p1_done = (p1_checked == p1_total)
progress_score = parsed PROGRESS_SCORE

IF p1_done AND tests_pass AND build_pass AND both_skeptics_complete AND iteration >= 3:
  status = "COMPLETE"

ELIF iteration >= max_iterations:
  status = "MAX_REACHED"

ELIF progress_score == 0:
  consecutive_stalls += 1
  IF consecutive_stalls >= 2:
    status = "STALLED"

ELSE:
  consecutive_stalls = 0
  // Keep RUNNING
```

**CRITICAL**: These are the ONLY exit conditions. No judgment. No "looks good enough." Pure arithmetic.

Note on DISAGREE: If verifier verdict is DISAGREE, treat as CONTINUE (don't exit). The disagreement details are in the verify-result file for the user's reference.

#### H. Checkpoint

IF checkpoint mode is ON AND status == "RUNNING":
  Use `AskUserQuestion`: "SIEGE iter {N} complete. P1: {done}/{total}, tests: {p/f}. Continue?" with options ["Yes", "No, stop here"]
  If "No" → status = "MAX_REACHED"

#### I. Log

Append to `.claude/plans/siege-{slug}/orchestrator-log.md`:
```
## Iteration {N}
P1: {checked}/{total} | Tests: {pass/fail} | Build: {pass/fail} | Skeptics: {verdict} | Progress: {score}/10
```

#### J. Display

```
SIEGE iter {N}: progress={score}/10 | P1:{done}/{total} | tests:{p/f} | skeptics:{verdict}
```

---

## Phase 4: Hardening Round (Always)

**Always runs** regardless of exit status.

### Construct Hardening Prompt

Fill `HARDENING_TEMPLATE` with:
- All config values
- `{final_status}` = status from the loop
- `{iteration_history}` = full orchestrator log

Write to `.claude/plans/siege-{slug}/hardening-context.md`.

### Spawn Hardening Worker

```bash
unset CLAUDECODE && claude -p "$(cat .claude/plans/siege-{slug}/hardening-context.md)" \
  --model opus \
  --allowedTools "Bash,Edit,Write,Read,Grep,Glob,Agent,TeamCreate,TeamDelete,TaskCreate,TaskUpdate,TaskList,SendMessage"
```

Display: `SIEGE: Hardening worker spawned`

### Parse Result

Read `.claude/plans/siege-{slug}/hardening-result.md`.
Extract: `CRITICAL`, `MAJOR`, `MINOR`, `FIXED`, `NOT_FIXABLE`, `TEST_EXIT_CODE`.

---

## Phase 5: Simplification (Always)

### Collect Modified Files

Grep all `worker-result-iter*.md` and `hardening-result.md` for `Files Modified` sections. Build the combined list.

### Construct Simplifier Prompt

Fill `SIMPLIFIER_TEMPLATE` with:
- Config values
- `{modified_files_list}` = combined file list

Write to `.claude/plans/siege-{slug}/simplifier-context.md`.

### Spawn Simplifier Worker

```bash
unset CLAUDECODE && claude -p "$(cat .claude/plans/siege-{slug}/simplifier-context.md)" \
  --model opus \
  --allowedTools "Bash,Edit,Write,Read,Grep,Glob,Agent,TeamCreate,TeamDelete,TaskCreate,TaskUpdate,TaskList,SendMessage"
```

Display: `SIEGE: Simplifier worker spawned`

### Final Gate Check

After simplifier completes, run tests and build one final time:
```bash
{TEST_CMD}
{BUILD_CMD}
```

---

## Phase 6: Final Report

```
SIEGE {status}

  Project: {name}
  Iterations: {count} of {max}
  Status: {COMPLETE | MAX_REACHED | STALLED}

  -- Iteration Log --
  Iter 1: P1={done}/{total} | tests={p/f} | build={p/f}
  Iter 2: P1={done}/{total} | tests={p/f} | skeptics={verdict} | progress={score}/10
  ...

  -- Final Task Status --
  P1: {done}/{total} | P2: {done}/{total} | P3: {done}/{total}
  Tests: {PASS/FAIL} | Build: {PASS/FAIL}

  -- Two-Skeptic Summary --
  Last verdict: {verdict}
  Challenges exchanged: {count}
  {If DISAGREE on any iteration: note which iterations had disagreements}

  -- Hardening Round --
  Findings: {critical}/{major}/{minor}
  Fixed: {count} | Not fixable: {count}

  -- Simplification --
  Files simplified: {count}

  -- Collaboration Metrics (cumulative) --
  Total messages: {sum across all worker iterations}
  Interface proposals: {sum}
  Blockers raised: {sum}

  {If COMPLETE:}
  All P1 tasks verified by independent skeptics. Tests pass. Build clean.

  {If MAX_REACHED:}
  Remaining: {count} unchecked P1 tasks. Run /siege again to continue.

  {If STALLED:}
  Stall detected: {consecutive_stalls} iterations with zero progress.

  -- Plans --
  Master task list: .claude/plans/siege-{slug}/project-tasks.md
  Orchestrator log: .claude/plans/siege-{slug}/orchestrator-log.md
```

---

## 4-Layer Anti-Premature-Exit

| Layer | Mechanism | Check |
|-------|-----------|-------|
| 1. Objective Gates | Orchestrator runs test/build via Bash | `exit_code == 0` |
| 2. Checkbox Arithmetic | Grep P1 checked/total from result file | `p1_checked == p1_total` |
| 3. Two-Skeptic Debate | Two independent verifiers must AGREE | `VERDICT == "COMPLETE"` |
| 4. Hard Rules | All conditions AND'd together + `iter >= 3` | Boolean AND |

COMPLETE = `p1_done AND tests_pass AND build_pass AND both_skeptics_complete AND iteration >= 3`

No single condition alone can trigger exit. No judgment. No "looks good."

---

## Critical Rules

1. **YOU ARE A THIN LOOP** — spawn sessions, read result files, do arithmetic. That's it.
2. **NEVER READ SOURCE CODE** — you don't know what the project looks like. Workers and verifiers handle all code.
3. **ARITHMETIC DECISIONS ONLY** — compare numbers. No "this seems done." No judgment calls.
4. **SPAWN FRESH SESSIONS** — every worker/verifier is a new `claude -p` process. They can't refuse.
5. **ORCHESTRATOR-OWNED GATES** — YOU run test/build commands as independent verification. Don't just trust worker self-reports.
6. **MINIMUM 3 ITERATIONS** — iteration 1-2 can NEVER produce COMPLETE. At least one full cycle of worker+verifier is needed after the initial build.
7. **HARDENING ALWAYS RUNS** — even on STALLED
8. **SIMPLIFICATION ALWAYS RUNS** — even on STALLED
9. **TEMPLATES ARE INLINED** — worker prompts contain the full collaboration protocol, message schema, and result format. No external file references in spawned sessions.
10. **~700 TOKENS PER ITERATION** — keep your overhead minimal. All analysis happens in spawned sessions.
11. **CHECKPOINT RESPECTS USER** — if `--checkpoint` is set, always pause between iterations
12. **LOG EVERYTHING** — append to orchestrator-log.md after every iteration
13. **UNSET CLAUDECODE** — all `claude -p` spawn commands MUST be prefixed with `unset CLAUDECODE &&`. The parent session sets this env var to prevent re-entrant launches; child workers inherit it and refuse to start without the unset.
