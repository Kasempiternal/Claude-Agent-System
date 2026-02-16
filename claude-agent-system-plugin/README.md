# Claude Agent System Plugin

A Claude Code plugin that spawns parallel agent swarms to plan, implement, and review code — from multi-task batch sprints to single-task deep orchestration.

## Skills

### `/zk` - Intelligent Router
Analyzes your request and **auto-routes** to the best execution mode — no manual skill selection needed. Uses a deterministic decision tree to pick between `/pcc`, `/pcc-opus`, and `/hydra`.

```bash
/zk add a button to the settings page          # → PCC (simple, clear scope)
/zk refactor the payment processing system      # → PCC-Opus (keyword + risk domain)
/zk fix auth; add dashboard; update API         # → Hydra (3 independent tasks)
```

Best for:
- When you don't want to think about which skill to use
- Any implementation task — ZK picks the right mode for you

> **Escape hatch**: You can always bypass ZK and invoke `/pcc`, `/pcc-opus`, or `/hydra` directly.

### `/hydra` - Multi-Task Parallel Swarm Coordinator
Submit **N tasks at once**. Hydra plans them together, detects cross-task file conflicts, then deploys implementation swarms in dependency-ordered **waves** — fully parallel where files don't overlap, sequentially ordered where they do.

> **Requires Agent Teams**: Hydra uses the experimental Agent Teams feature (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` in `~/.claude/settings.json`). It will check for this setting on startup and guide you through enabling it if needed.

> **⚠️ High Token Usage Warning**: Hydra uses Anthropic's **Agent Teams** feature (currently in beta). It spawns multiple Opus-level agents in parallel swarms, which can result in **very high token consumption**. Recommended only for **MAX plan** subscribers.

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
Deploys **6 parallel review agents** to analyze code, then **automatically fixes** CRITICAL and MAJOR findings with your approval. Fully self-contained - no external plugin dependencies.

```bash
/review                  # Review all uncommitted changes (default)
/review staged           # Review only staged changes
/review src/auth.ts      # Review specific file(s)
/review "auth module"    # Review files matching a description
```

Review agents deployed (all 6 run in parallel):

| Agent | Focus |
|-------|-------|
| Bug & Logic Reviewer | Security vulnerabilities, crashes, logic errors, resource leaks |
| Project Guidelines Reviewer | Style conventions, CLAUDE.md standards, best practices |
| Silent Failure Hunter | Swallowed exceptions, bad fallbacks, inadequate error handling |
| Comment Analyzer | Stale docs, misleading comments, missing documentation |
| Type Design Analyzer | Encapsulation, invariant expression, type safety |
| Test Coverage Analyzer | Test gaps, missing edge cases, test quality |

Features:
- **Self-contained agents** - all 6 agents defined as `.md` files in `.claude/agents/`, no external plugins needed
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
- Automatic workflow selection (streamlined, full validation, phase-based, PRD-based)
- Triple code review
- Complete end-to-end execution

## Installation

```bash
/plugin marketplace add Kasempiternal/Claude-Agent-System
/plugin install pcc
```

## Skill Comparison

| Skill | Use Case | Agents | Modifies Code? |
|-------|----------|--------|----------------|
| `/zk` | Auto-routes to best mode | Router only (delegates to pcc/pcc-opus/hydra) | Via delegated skill |
| `/hydra` | Multi-task parallel swarms | Opus scouts + analyst teammates + wave-based Opus implementers (Agent Teams) | Yes |
| `/pcc-opus` | Max quality orchestration | Opus scouts (2-6) + Opus implementers (2-6) | Yes |
| `/pcc` | Parallel orchestration | Sonnet scouts (2-6) + Opus implementers (2-6) | Yes |
| `/review` | Code review & analysis + fix | 6 review agents + 1-4 fix agents | Only if opted in |
| `/systemcc` | Any implementation task - auto-routes | Auto-selected | Yes |

## How It Works

### `/zk` Flow

1. **Analyze** - Walks a 4-step decision tree against the user's request
2. **Route** - First matching rule wins:
   - **Step 1**: Multiple independent deliverables? → Hydra
   - **Step 2**: Scale word + broad noun ("entire codebase")? → Hydra
   - **Step 3**: High-stakes keyword + qualifying signal? → PCC-Opus
   - **Step 4**: Everything else → PCC (default)
3. **Delegate** - Invokes the selected skill with the original task unchanged

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
2. **Load Agents** - Reads 6 agent definition files from `.claude/agents/review-*.md`
3. **Review Swarm** - 6 specialized agents launch in parallel (same wall-clock time as 1)
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
