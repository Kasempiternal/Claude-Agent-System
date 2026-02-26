# Claude Agent System

**Turn Claude into your personal development team.** Plugin skills that handle everything — from deep planning through implementation to code review, with parallel agent swarms and automatic quality gates.

> **v7.3.0 — Shared Governance: Risk Tiers, Anti-Patterns & Recovery**
>
> Hydra and Legion now share a governance layer (`skills/shared/`) with risk tier classification (T0-T3), multi-agent anti-pattern rules, and recovery procedures for stuck agents, partial rollbacks, budget overruns, and context pressure. Analysts assign tiers, verifiers scale depth by tier, and orchestrators follow recovery procedures instead of abandoning failed work.
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

Done! You now have 7 skills: `/zk`, `/legion`, `/pcc`, `/pcc-opus`, `/hydra`, `/review`, and `/systemcc`.

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

> **Requires Agent Teams**: Legion uses the experimental Agent Teams feature (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` in `~/.claude/settings.json`). It will check for this setting on startup and guide you through enabling it if needed.

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
4. **CTO Analysis** - CTO analyst creates master task list, decomposes project into modules and waves
5. **User Confirmation** - You review the CTO's plan, then confirm
6. **Iteration Loop** - The core autonomous loop:
   - Iteration 1: full wave-based implementation (Hydra-scale)
   - Iteration 2+: delta scouts -> CTO updates task list -> targeted implementation
   - Each iteration: verify -> assess completion -> loop or exit
   - Exit: all P1 tasks done + tests pass, OR max iterations, OR stall detected
7. **Simplification** - Module-grouped cleanup (only if project completed)
8. **Final Report & Cleanup** - Iteration log, final task status, shutdown, clean up

### Features

- **Autonomous iteration loop** — keeps deploying swarms until the project is done
- **Master task list** — living checkbox document, updated each iteration by the CTO analyst
- **Risk tier classification** — every task gets a tier (T0-T3) with tier-scaled verification depth
- **Recovery procedures** — stuck agent replacement, partial rollback, budget overrun protection, context pressure conservation
- **Anti-pattern validation** — catches coordinator-implements-code, redundant agents, file overlap, scope drift
- **Iteration scaling** — iteration 1 is heavy (15-30 agents), iteration 2+ is light (5-12 agents)
- **Circuit breaker** — stops after 2 consecutive iterations with no progress
- **Checkpoint mode** (`--checkpoint`) — optional pause between iterations for user approval
- **Configurable max iterations** (`--max-iterations N`, default 5)
- **Post-loop simplification** — module-grouped code cleanup after project completion

---

## `/hydra` - Multi-Task Parallel Swarm

Submit **N tasks at once**. Hydra plans them together, detects cross-task file conflicts, then deploys implementation swarms in dependency-ordered **waves** — fully parallel where files don't overlap, sequentially ordered where they do.

> **Requires Agent Teams**: Hydra uses the experimental Agent Teams feature (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` in `~/.claude/settings.json`). It will check for this setting on startup and guide you through enabling it if needed.

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
