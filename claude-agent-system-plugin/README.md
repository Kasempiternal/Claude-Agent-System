# Claude Agent System Plugin

A Claude Code plugin that spawns parallel agent swarms to plan, implement, and review code — from multi-task batch sprints to single-task deep orchestration.

## Skills

### `/zk` - Intelligent Router
Analyzes your request and **auto-routes** to the best execution mode — no manual skill selection needed. Uses a deterministic decision tree to pick between `/legion`, `/hydra`, `/pcc-opus`, and `/pcc`.

```bash
/zk build a complete todo app from scratch      # -> Legion (holistic project, iterative)
/zk add a button to the settings page           # -> PCC (simple, clear scope)
/zk refactor the payment processing system      # -> PCC-Opus (keyword + risk domain)
/zk fix auth; add dashboard; update API         # -> Hydra (3 independent tasks)
```

Best for:
- When you don't want to think about which skill to use
- Any implementation task — ZK picks the right mode for you

> **Escape hatch**: You can always bypass ZK and invoke `/legion`, `/pcc`, `/pcc-opus`, or `/hydra` directly.

### `/legion` - Iterative Swarm Loop `BETA`
Submit a **holistic project description**. Legion deploys a full agent swarm each iteration — scouts, CTO analyst, wave-based implementers, verifiers — then checks if the project is complete. It keeps iterating autonomously until everything is built, the max iteration limit is hit, or progress stalls.

> **Requires Agent Teams**: Legion uses the experimental Agent Teams feature (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` in `~/.claude/settings.json`). It will check for this setting on startup and guide you through enabling it if needed.

> **Very High Token Usage Warning**: Legion runs **multiple iterations** of agent swarms. Each iteration spawns 5-30 Opus agents. Recommended only for **MAX plan** subscribers.

```bash
/legion build a complete todo app with local storage from scratch
/legion create an e-commerce platform with auth, cart, and checkout --max-iterations 8
/legion implement the full API layer end to end --checkpoint
```

Best for:
- Building complete features or applications from scratch
- Projects that need multiple rounds of build-test-fix
- When you want autonomous completion without manual re-runs

Features:
- **Autonomous iteration loop** — keeps deploying swarms until the project is done
- **Master task list** — living checkbox document, updated each iteration by the CTO analyst
- **Iteration scaling** — iteration 1 is heavy (15-30 agents), iteration 2+ is light (5-12 agents)
- **Circuit breaker** — stops after 2 consecutive iterations with no progress
- **Checkpoint mode** (`--checkpoint`) — optional pause between iterations for user approval
- **Configurable max iterations** (`--max-iterations N`, default 5)
- **Post-loop simplification** — module-grouped code cleanup after project completion

### `/hydra` - Multi-Task Parallel Swarm Coordinator
Submit **N tasks at once**. Hydra plans them together, detects cross-task file conflicts, then deploys implementation swarms in dependency-ordered **waves** — fully parallel where files don't overlap, sequentially ordered where they do.

> **Requires Agent Teams**: Hydra uses the experimental Agent Teams feature (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` in `~/.claude/settings.json`). It will check for this setting on startup and guide you through enabling it if needed.

> **High Token Usage Warning**: Hydra uses Anthropic's **Agent Teams** feature (currently in beta). It spawns multiple Opus-level agents in parallel swarms, which can result in **very high token consumption**. Recommended only for **MAX plan** subscribers.

```bash
/hydra add auth; build dashboard; fix payments
/hydra 1. refactor models 2. add API endpoints 3. update tests
```

Best for:
- Multiple independent tasks in the same project
- Batch implementation sprints
- When tasks might share files (Hydra detects and resolves conflicts)

Features:
- **Agent Teams powered** — uses TeamCreate, TaskCreate/TaskUpdate/TaskList, SendMessage for structured coordination
- **Cross-task file conflict analysis** — builds a DAG of file ownership at plan time
- **Wave-based execution** — parallel where safe, sequential where files overlap
- **Shared scout pool** — Opus scouts explore for all N tasks simultaneously
- **Per-task plans + coordination file** — editable before implementation
- **Module-grouped simplification** — ensures cross-task code consistency
- **Full lifecycle management** — creates team, tracks tasks, shuts down teammates, cleans up

### `/pcc-opus` - PCC Opus Edition
Uses **Opus scouts** AND **Opus implementers** for maximum quality.

```bash
/pcc-opus refactor the entire payment processing system
```

Best for:
- Critical production systems
- Complex architectural changes
- Unfamiliar codebases

### `/pcc` - Parallel Claude Coordinator
Uses **Sonnet scouts** for fast exploration and **Opus agents** for implementation.

```bash
/pcc implement user authentication with JWT tokens
```

Best for:
- Most development tasks
- Cost-conscious workflows
- When exploration speed matters

### `/review` - Code Review Swarm
Deploys **7 parallel review agents** to analyze code, then **automatically fixes** CRITICAL and MAJOR findings with your approval. Uses official Anthropic review plugin agents when available, with bundled fallback agents for standalone use.

```bash
/review                  # Review all uncommitted changes (default)
/review staged           # Review only staged changes
/review src/auth.ts      # Review specific file(s)
/review "auth module"    # Review files matching a description
```

Review agents deployed (all 7 run in parallel):

| Agent | Focus |
|-------|-------|
| Bug & Logic Reviewer | Security vulnerabilities, crashes, logic errors, resource leaks |
| Code Reviewer | Code quality, readability, maintainability, best practices |
| Project Guidelines Reviewer | Style conventions, CLAUDE.md standards, best practices |
| Silent Failure Hunter | Swallowed exceptions, bad fallbacks, inadequate error handling |
| Comment Analyzer | Stale docs, misleading comments, missing documentation |
| Type Design Analyzer | Encapsulation, invariant expression, type safety |
| Test Coverage Analyzer | Test gaps, missing edge cases, test quality |

Features:
- **7 review agents** — bundled as `.md` files, with official Anthropic plugin fallback
- **Health score** (0-10) with severity-weighted formula
- **Cross-agent correlation** - related findings from different agents grouped together
- **Deduplicated report** - orchestrator merges overlapping findings
- **Agent verdicts table** - quick pass/fail per agent
- **Opt-in fix phase** - parallel fix agents resolve CRITICAL and MAJOR findings (you choose: fix critical+major, fix all, or report only)

### `/systemcc` - Auto-Routing Workflow Selector
The catch-all convenience command. Auto-analyzes task complexity, risk, and scope to select and execute the optimal workflow automatically.

```bash
/systemcc fix the login bug
/systemcc refactor the authentication system
/systemcc migrate all models to new ORM
```

Features:
- 3-dimensional task analysis (complexity, risk, scope)
- Two-phase decision engine with confidence scoring
- Lyra AI prompt optimization
- Build configuration auto-detection and enforcement
- Automatic workflow selection and execution
- Triple code review (Senior Engineer, Lead Engineer, Architect)

## Installation

```bash
/plugin marketplace add Kasempiternal/Claude-Agent-System
/plugin install cas
```

## Skill Comparison

| Skill | Use Case | Agents | Modifies Code? |
|-------|----------|--------|----------------|
| `/zk` | Auto-routes to best mode | Router only (delegates to legion/hydra/pcc-opus/pcc) | Via delegated skill |
| `/legion` `BETA` | Iterative project completion | Opus scouts + CTO + wave-based Opus implementers, looped (Agent Teams) | Yes |
| `/hydra` | Multi-task parallel swarms | Opus scouts + analyst teammates + wave-based Opus implementers (Agent Teams) | Yes |
| `/pcc-opus` | Max quality orchestration | Opus scouts (2-6) + Opus implementers (2-6) | Yes |
| `/pcc` | Parallel orchestration | Sonnet scouts (2-6) + Opus implementers (2-6) | Yes |
| `/review` | Code review & analysis + fix | 7 review agents + 1-4 fix agents | Only if opted in |
| `/systemcc` | Any implementation task - auto-routes | Auto-selected | Yes |

## How It Works

### `/zk` Flow

1. **Analyze** - Walks a 5-step decision tree against the user's request
2. **Route** - First matching rule wins:
   - **Step 0**: Holistic project needing iterative completion? -> Legion
   - **Step 1**: Multiple independent deliverables? -> Hydra
   - **Step 2**: Scale word + broad noun ("entire codebase")? -> Hydra
   - **Step 3**: High-stakes keyword + qualifying signal? -> PCC-Opus
   - **Step 4**: Everything else -> PCC (default)
3. **Delegate** - Invokes the selected skill with the original task unchanged

### `/legion` Flow

0. **Prerequisites Check** - Reads `~/.claude/settings.json`, verifies `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`
1. **Project Parse** - Parses holistic project description, extracts `--max-iterations` and `--checkpoint` flags
2. **Team Init** - `TeamCreate` + `TaskCreate` for structural phases
3. **Full Exploration** - Opus scout teammates explore the entire project scope (once)
4. **CTO Analysis** - CTO analyst creates master task list, decomposes project into modules and waves
5. **User Confirmation** - You review the CTO's plan, then confirm
6. **Iteration Loop** - The core autonomous loop:
   - Iteration 1: full wave-based implementation (Hydra-scale)
   - Iteration 2+: delta scouts -> CTO updates task list -> targeted implementation
   - Each iteration: verify -> assess completion -> loop or exit
   - Exit: all P1 tasks done + tests pass, OR max iterations, OR stall detected
7. **Simplification** - Module-grouped cleanup (only if project completed)
8. **Final Report & Cleanup** - Iteration log, final task status, shutdown, `TeamDelete`

### `/hydra` Flow

0. **Prerequisites Check** - Reads `~/.claude/settings.json`, verifies `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`
1. **Task Parsing** - Splits input into N discrete tasks
2. **Team Init** - `TeamCreate` + `TaskCreate` for all N tasks and phase-tracking tasks
3. **Parallel Exploration** - Shared pool of Opus scout teammates explores for all N tasks
4. **Delegated Synthesis** - `analyst-synthesis` teammate reads scout reports, writes N plans + coordination.md, resolves conflicts, sends compressed summary back to orchestrator
5. **Clarification** - Batched questions across all tasks (using analyst summary)
6. **User Review** - You review summary + plan files, then confirm
7. **Wave Implementation** - Per wave: `analyst-wave-prep` teammate reads plans and returns agent specs; orchestrator spawns impl agents from specs
8. **Per-Wave Verification** - Tests after each wave; global integration check after all waves
9. **Simplification** - Module-grouped cleanup across all task boundaries
10. **Final Report & Cleanup** - Per-task status, shutdown teammates, `TeamDelete`

### `/pcc` and `/pcc-opus` Flow

1. **Task Understanding** - Clarifies the task with you
2. **Parallel Exploration** - Spawns 2-6 scout agents (Sonnet or Opus)
3. **Synthesis** - Combines findings into unified understanding
4. **Clarification** - Asks questions if multiple approaches exist
5. **Plan Creation** - Creates editable `.claude/plans/{task}.md`
6. **User Review** - You edit and approve the plan
7. **Parallel Implementation** - Spawns 2-6 Opus agents
8. **Verification** - Tests and code review
9. **Simplification** - Parallel cleanup agents
10. **Final Report** - Summarizes everything

### `/review` Flow

1. **Scope Detection** - Determines what to review (uncommitted changes, staged, files, or description)
2. **Load Agents** - Reads 7 agent definition files (official Anthropic plugin agents preferred, bundled fallbacks available)
3. **Review Swarm** - 7 specialized agents launch in parallel (same wall-clock time as 1)
4. **Synthesis** - Orchestrator deduplicates, cross-references, and scores findings
5. **Report** - Consolidated findings by severity (CRITICAL > MAJOR > MINOR) with health score
6. **Fix Findings** (opt-in) - Parallel fix agents resolve CRITICAL/MAJOR issues (grouped by file, exclusive ownership)

### `/systemcc` Flow

1. **Detection** - Acknowledges command, shows Lyra AI optimization
2. **Analysis** - Two-phase decision engine scores complexity, risk, scope
3. **Selection** - Routes to optimal workflow with confidence scoring
4. **Execution** - Runs all phases automatically
5. **Review** - Triple code review (Senior Engineer, Lead Engineer, Architect)
6. **Complete** - Summary with session learnings

## License

MIT
