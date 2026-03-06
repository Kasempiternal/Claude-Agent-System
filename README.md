# Claude Agent System

**Turn Claude into your personal development team.** Plugin skills that handle everything — from deep planning through implementation to code review, with parallel agent swarms and automatic quality gates.

> **v7.8.0 — Legion Orchestration Overhaul**
>
> Legion gets three releases of improvements: mandatory hardening round that runs on every project (v7.6.0), verification strategy system with confidence levels (v7.7.0), and wave state files with three-tier compression and fix tracking (v7.8.0). Circuit breaker is now smarter — uses progress scoring (0-10) instead of simple task counts, and tolerates 3 zero-progress iterations before stalling.
>
> The Claude Agent System is distributed exclusively as a **Claude Code plugin**. If you previously installed via the legacy setup script, uninstall the old files first:
> ```bash
> rm -rf .claude/commands .claude/workflows .claude/middleware .claude/agents
> /plugin marketplace add Kasempiternal/Claude-Agent-System
> /plugin install cas
> ```

## Quick Start

```bash
/plugin marketplace add Kasempiternal/Claude-Agent-System
/plugin install cas
```

Done! You now have 9 skills: `/zk`, `/legion`, `/pcc`, `/pcc-opus`, `/hydra`, `/review`, `/systemcc`, `/setup-swarm`, and `/setup-hooks`.

---

## Anti-Vibe Coding Philosophy

**"Vibe coding"** = typing a prompt, accepting whatever the AI outputs, hoping it works.

**This system is the opposite.** Every skill enforces structure:

| What Vibe Coding Does | What This System Does |
|-----------------------|-----------------------|
| Blindly accepts AI output | Parallel code review agents |
| No validation | Build config detection + linting enforcement |
| No learning | Session memory - learns your patterns and mistakes |
| No quality gates | Decision engines with complexity/risk/scope analysis |
| Hope it works | Post-execution validation + auto-fix critical issues |

---

# Skills

## `/zk` - Intelligent Router

The smart entry point. Analyzes your request and **auto-routes** to the best execution mode — no manual skill selection needed.

```bash
/zk "what you want to do"
```

### How It Works

ZK walks a deterministic 5-step decision tree:

| Step | Condition | Routes To |
|------|-----------|-----------|
| 0 | Holistic project needing iterative completion? | `/legion` |
| 1 | Multiple independent deliverables? | `/hydra` |
| 2 | Scale word + broad noun ("entire codebase")? | `/hydra` |
| 3 | High-stakes keyword + qualifying signal? | `/pcc-opus` |
| 4 | Everything else (default) | `/pcc` |

### Examples

```bash
/zk build a complete todo app from scratch      # -> Legion (holistic project, iterative)
/zk add a button to the settings page           # -> PCC (simple, clear scope)
/zk refactor the payment processing system      # -> PCC-Opus (keyword + risk domain)
/zk migrate all models to SwiftData             # -> PCC-Opus ("migrate" always qualifies)
/zk fix auth; add dashboard; update API         # -> Hydra (3 independent tasks)
/zk modernize the entire codebase               # -> Hydra (scale + broad scope)
```

**Escape hatch**: You can always bypass ZK and invoke `/legion`, `/pcc`, `/pcc-opus`, or `/hydra` directly.

---

## `/pcc` and `/pcc-opus` - Parallel Claude Coordinator

An orchestrator that spawns agent swarms for exploration and implementation.

```bash
/pcc "implement user authentication with JWT tokens"
/pcc-opus "refactor the entire payment processing system"
```

### Two Variants

| Variant | Scouts | Implementers | Best For |
|---------|--------|-------------|----------|
| `/pcc` | **Sonnet** (fast, cost-efficient) | **Opus** (high quality) | Most tasks |
| `/pcc-opus` | **Opus** (maximum depth) | **Opus** (high quality) | Critical systems, unfamiliar codebases |

### How PCC Works

1. **Task Understanding** - Clarifies the task with you
2. **Parallel Exploration** - Spawns 2-6 scout agents to map the codebase
3. **Synthesis** - Combines findings into unified understanding
4. **Clarification** - Asks questions if multiple valid approaches exist
5. **Plan Creation** - Creates editable plan at `.claude/plans/{task}.md`
6. **User Review** - You edit and approve the plan before any code is written
7. **Parallel Implementation** - Spawns 2-6 Opus agents working simultaneously
8. **Verification** - Tests and code review
9. **Simplification** - 2-6 parallel agents clean up the code
10. **Final Report** - Summarizes everything

---

## `/legion` - Iterative Swarm Loop `BETA`

Submit a **holistic project description**. Legion deploys a full agent swarm each iteration — scouts, CTO analyst, wave-based implementers, verifiers — then checks if the project is complete. It keeps iterating autonomously until everything is built, the max iteration limit is hit, or progress stalls.

> **Requires Agent Teams**: Run `/setup-swarm` to enable this automatically. ⚠️ Close all other Claude Code sessions first — editing `settings.json` while other sessions run can crash them.

> **Very High Token Usage Warning**: Legion runs **multiple iterations** of agent swarms. Each iteration spawns 5-30 Opus agents. Recommended only for **MAX plan** subscribers.

```bash
/legion build a complete todo app with local storage from scratch
/legion create an e-commerce platform with auth, cart, and checkout --max-iterations 8
/legion implement the full API layer end to end --checkpoint
```

### Best For

- Building complete features or applications from scratch
- Projects that need multiple rounds of build-test-fix
- When you want autonomous completion without manual re-runs

### How Legion Works

0. **Prerequisites Check** - Verifies `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`
1. **Project Parse** - Parses holistic project description, extracts `--max-iterations` and `--checkpoint` flags
2. **Team Init** - Creates team + structural phase tasks
3. **Full Exploration** - Opus scout teammates explore the entire project scope
4. **CTO Analysis** - CTO analyst creates master task list with verification strategy, decomposes project into modules and waves
5. **User Confirmation** - You review the CTO's plan, then confirm
6. **Iteration Loop** - The core autonomous loop:
   - Iteration 1: full wave-based implementation (Hydra-scale), wave state files written after each wave
   - Iteration 2+: delta scouts -> CTO updates task list -> scaled implementation (agents sized to remaining P1 work)
   - Each iteration: verify (with confidence levels) -> assess completion (progress score 0-10) -> loop or exit
   - Exit: all P1 tasks done + tests pass, OR max iterations, OR 3 consecutive zero-progress iterations
7. **Hardening Round** - Mandatory defensive review: scouts find bugs/gaps, fix agents resolve them, verifier confirms no regressions (always runs regardless of exit status)
8. **Simplification** - Module-grouped cleanup (always runs)
9. **Final Report & Cleanup** - Iteration log with progress scores, hardening results, final task status, shutdown

### Features

- **Autonomous iteration loop** — keeps deploying swarms until the project is done
- **Master task list** — living checkbox document, updated each iteration by the CTO analyst
- **Verification strategy** — CTO defines test/build/run commands and verification chain per project type
- **Risk tier classification** — every task gets a tier (T0-T3) with tier-scaled verification depth
- **Wave state files** — each wave writes a state file to disk for reliable cross-wave context
- **Three-tier compression** — context management scales from full fidelity to conservation mode as iterations grow
- **Fix tracking** — tracks fix attempts per task, defers after 2 failures, escalates to user after 2 deferred iterations
- **Mandatory hardening round** — post-loop defensive review with scouts, fix agents, and regression verification (always runs)
- **Recovery procedures** — stuck agent replacement, partial rollback, budget overrun protection
- **Anti-pattern validation** — catches coordinator-implements-code, redundant agents, file overlap, scope drift
- **Iteration scaling** — iteration 1 is heavy (15-30 agents), iteration 2+ scales to remaining P1 work (5-12 agents)
- **Progress scoring** — completion assessment returns a 0-10 score; bug fixes and test additions count as progress
- **Circuit breaker** — stops after 3 consecutive iterations with zero progress score
- **Checkpoint mode** (`--checkpoint`) — optional pause between iterations for user approval
- **Configurable max iterations** (`--max-iterations N`, default 5)
- **Post-loop simplification** — module-grouped code cleanup (always runs)

---

## `/hydra` - Multi-Task Parallel Swarm

Submit **N tasks at once**. Hydra plans them together, detects cross-task file conflicts, then deploys implementation swarms in dependency-ordered **waves** — fully parallel where files don't overlap, sequentially ordered where they do.

> **Requires Agent Teams**: Run `/setup-swarm` to enable this automatically. ⚠️ Close all other Claude Code sessions first — editing `settings.json` while other sessions run can crash them.

> **High Token Usage Warning**: Hydra spawns multiple Opus-level agents in parallel swarms, which can result in **very high token consumption**. Recommended only for **MAX plan** subscribers.

```bash
/hydra add auth; build dashboard; fix payments
/hydra 1. refactor models 2. add API endpoints 3. update tests
```

### Best For

- Multiple independent tasks in the same project
- Batch implementation sprints
- When tasks might share files (Hydra detects and resolves conflicts)

### How Hydra Works

1. **Prerequisites Check** - Verifies `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`
2. **Task Parsing** - Splits input into N discrete tasks
3. **Team Init** - Creates team + tasks for all N items
4. **Parallel Exploration** - Shared pool of Opus scout teammates explores for all N tasks
5. **Delegated Synthesis** - Analyst teammate writes N plans + coordination file, resolves conflicts
6. **User Review** - You review summary + plan files, then confirm
7. **Wave Implementation** - Per wave: analyst prepares specs, orchestrator spawns impl agents
8. **Per-Wave Verification** - Tests after each wave; global integration check after all waves
9. **Simplification** - Module-grouped cleanup across all task boundaries
10. **Final Report & Cleanup** - Per-task status, shutdown teammates, clean up

### Features

- **Agent Teams powered** — structured coordination with TeamCreate, TaskCreate, SendMessage
- **Cross-task file conflict analysis** — builds a DAG of file ownership at plan time
- **Wave-based execution** — parallel where safe, sequential where files overlap
- **Risk tier classification** — every task gets a tier (T0-T3) with tier-scaled verification depth
- **Recovery procedures** — stuck agent replacement and partial rollback on verification failure
- **Anti-pattern validation** — catches redundant agents, file overlap, sequential deps in same wave
- **Shared scout pool** — Opus scouts explore for all N tasks simultaneously
- **Per-task plans + coordination file** — editable before implementation
- **Module-grouped simplification** — ensures cross-task code consistency

---

## `/review` - Code Review Swarm

Deploys **7 parallel review agents** to analyze your code, then **automatically fixes** CRITICAL and MAJOR findings with your approval. Uses official Anthropic review plugin agents when available, with bundled fallback agents for standalone use.

```bash
/review                  # Review all uncommitted changes (default)
/review staged           # Review only staged changes
/review src/auth.ts      # Review specific file(s)
/review "auth module"    # Review files matching a description
```

### Review Agents

All 7 agents run in parallel (same wall-clock time as running one):

| Agent | What It Checks |
|-------|---------------|
| Bug & Logic Reviewer | Security vulnerabilities, crashes, logic errors, resource leaks |
| Code Reviewer | Code quality, readability, maintainability, best practices |
| Project Guidelines Reviewer | Style conventions, CLAUDE.md standards, best practices |
| Silent Failure Hunter | Swallowed exceptions, bad fallbacks, inadequate error handling |
| Comment Analyzer | Stale docs, misleading comments, missing documentation |
| Type Design Analyzer | Encapsulation, invariant expression, type safety |
| Test Coverage Analyzer | Test gaps, missing edge cases, test quality |

### What You Get

The orchestrator synthesizes all 7 agent reports into a consolidated review:

- **Health score** (0-10) with severity-weighted formula
- **Agent verdicts table** - quick pass/fail per agent
- **Deduplicated findings** - overlapping issues merged, multi-agent flags boost confidence
- **Cross-agent correlation** - related findings from different agents grouped together
- **Severity-prioritized** - CRITICAL > MAJOR > MINOR

### Fix Phase (Opt-In)

If CRITICAL or MAJOR findings are found, the system asks how you want to proceed:

- **Fix CRITICAL and MAJOR** (default) - parallel fix agents resolve high-severity findings
- **Fix ALL** - also addresses MINOR findings (style, comments, naming)
- **Report only** - keep the report without modifying code

Fix agents are grouped by file (exclusive ownership, no conflicts) and make minimum changes to resolve each finding. `/review` never modifies code without your explicit consent.

### Optional: Official Anthropic Agents

`/review` works standalone with bundled agents, but installing these official plugins enhances the analysis:

```bash
/plugin install pr-review-toolkit@claude-plugins-official
/plugin install code-simplifier@claude-plugins-official
```

---

## `/systemcc` - Auto-Routing Workflow Selector

The catch-all convenience command. Auto-analyzes task complexity, risk, and scope to select and execute the optimal workflow automatically.

```bash
/systemcc "what you want to do"
```

### How It Works

1. **Lyra AI Optimization** - Enhances your request with the 4-D methodology
2. **Build Config Detection** - Scans Makefile, CI/CD, linters and applies rules
3. **Two-Phase Decision Engine** - Domain detection first, then complexity scoring
4. **Automatic Execution** - Runs all phases without manual intervention
5. **Triple Code Review** - 3 parallel reviewers check quality
6. **Summary** - What changed and why

### Features

- 3-dimensional task analysis (complexity, risk, scope)
- Two-phase decision engine with confidence scoring
- Lyra AI prompt optimization (4-D methodology)
- Build configuration auto-detection and enforcement
- Automatic workflow selection and execution
- Triple code review (Senior Engineer, Lead Engineer, Architect)

---

## `/setup-swarm` - Agent Teams Setup

Enables the `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` env var in your `~/.claude/settings.json`. Required before using `/hydra` or `/legion`.

```bash
/setup-swarm
```

> ⚠️ **Close all other Claude Code sessions first** — editing `settings.json` while other sessions are running can crash or corrupt those sessions. The skill will warn you about this before making changes.

- **Run once** — the setting persists across all projects and sessions
- **Non-destructive** — merges into existing settings without overwriting
- **Restart required** — Claude Code needs a restart after the change

---

## `/setup-hooks` - Safety Hooks Installer

Installs **PreToolUse hooks** into your `~/.claude/settings.json` that intercept risky actions and prompt you before proceeding.

```bash
/setup-hooks
```

### Available Hooks

| Hook | What It Catches |
|------|----------------|
| **push-guard** | Any `git push` or `gh pr create` — commits are allowed freely |
| **dangerous-commands** | `rm -rf ~/`, `dd` to disk, `git reset --hard`, `curl \| sh`, fork bombs, etc. |
| **protect-secrets** | `.env` files, SSH keys, AWS creds, secret variables, exfiltration attempts |

All hooks use **`"ask"` mode** — Claude pauses and shows you a yes/no prompt instead of silently blocking. Approve when you asked for the action, deny when Claude acts autonomously.

- **Run once** — hooks persist in your settings across all projects and sessions
- **Selective install** — choose which hooks you want during setup
- **Non-destructive** — merges into existing settings without overwriting
- **Audit logging** — all intercepted actions logged to `~/.claude/hooks-logs/`

> Based on [karanb192/claude-code-hooks](https://github.com/karanb192/claude-code-hooks), modified to use `"ask"` instead of `"deny"`.

---

# When to Use Each Skill

| Situation | Use This |
|-----------|----------|
| **Don't want to choose** — let the system pick | `/zk` |
| Build a complete project from scratch | `/legion` |
| Single well-defined task | `/pcc` |
| Critical systems, unfamiliar codebases | `/pcc-opus` |
| Multiple independent tasks at once | `/hydra` (or `/zk` auto-detects) |
| Code review before committing | `/review` |
| Want auto-routing with Lyra AI optimization | `/systemcc` |
| Enable Agent Teams for Hydra/Legion | `/setup-swarm` (run once) |
| Prevent Claude from pushing without permission | `/setup-hooks` (run once) |

---

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## Community

The `/systemcc` skill was partially inspired by ideas shared in the community:

- [Anti-YOLO Method](https://www.reddit.com/r/ClaudeAI/comments/1n1941k/the_antiyolo_method_why_i_make_claude_draw_ascii/) - ASCII wireframing for web projects
- [Phase-based development](https://www.reddit.com/r/ClaudeAI/comments/1lw5oie/how_phasebased_development_made_claude_code_10x/) - Large codebase handling
- [Multi-agent workflows](https://www.reddit.com/r/ClaudeAI/comments/1lqn9ie/my_current_claude_code_sub_agents_workflow/) - Team-based development
- [Agent OS](https://buildermethods.com/agent-os) - Project initialization framework

All other skills (`/zk`, `/legion`, `/pcc`, `/pcc-opus`, `/hydra`, `/review`) are original.

---

## License

MIT License - see [LICENSE](LICENSE) for details.
