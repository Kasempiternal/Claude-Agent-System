# Claude Agent System Plugin

A Claude Code plugin with intelligent workflow orchestration, parallel agent coordination, and automated code review.

## Skills

### `/systemcc` - Intelligent Workflow Router
The **only command you need** for implementation tasks. Auto-analyzes task complexity, risk, and scope to select and execute the optimal workflow automatically.

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

### `/pcc` - Parallel Claude Coordinator
Uses **Sonnet scouts** for fast exploration and **Opus agents** for implementation.

```bash
/pcc implement user authentication with JWT tokens
```

Best for:
- Most development tasks
- Cost-conscious workflows
- When exploration speed matters

### `/pcc-opus` - PCC Opus Edition
Uses **Opus scouts** AND **Opus implementers** for maximum quality.

```bash
/pcc-opus refactor the entire payment processing system
```

Best for:
- Critical production systems
- Complex architectural changes
- Unfamiliar codebases

### `/review` - Code Review Swarm
Deploys **6 parallel Anthropic review agents** to analyze code without modifying it. The only skill focused purely on analysis - no implementation.

```bash
/review                  # Review all uncommitted changes (default)
/review staged           # Review only staged changes
/review src/auth.ts      # Review specific file(s)
/review "auth module"    # Review files matching a description
```

Review agents deployed (all 6 run in parallel):

| Agent | Focus |
|-------|-------|
| Bug & Logic Reviewer | Security vulnerabilities, crashes, logic errors, code quality |
| Project Guidelines Reviewer | Style conventions, CLAUDE.md standards, best practices |
| Silent Failure Hunter | Swallowed exceptions, bad fallbacks, inadequate error handling |
| Comment Analyzer | Stale docs, misleading comments, missing documentation |
| Type Design Analyzer | Encapsulation, invariant expression, type safety |
| Test Coverage Analyzer | Test gaps, missing edge cases, test quality |

Features:
- **Health score** (0-10) with severity-weighted formula
- **Cross-agent correlation** - related findings from different agents grouped together
- **Deduplicated report** - orchestrator merges overlapping findings
- **Agent verdicts table** - quick pass/fail per agent
- **Opt-in simplification** - 2 parallel simplification agents (only if you approve)

## Installation

```bash
/plugin marketplace add Kasempiternal/Claude-Agent-System
/plugin install pcc
```

## Skill Comparison

| Skill | Use Case | Agents | Modifies Code? |
|-------|----------|--------|----------------|
| `/systemcc` | Any implementation task - auto-routes | Auto-selected | Yes |
| `/pcc` | Parallel orchestration | Sonnet scouts (2-6) + Opus implementers (2-6) | Yes |
| `/pcc-opus` | Max quality orchestration | Opus scouts (2-6) + Opus implementers (2-6) | Yes |
| `/review` | Code review & analysis | 6 review agents + 2 optional simplifiers | Only if opted in |

## How It Works

### `/systemcc` Flow

1. **Detection** - Acknowledges command, shows Lyra AI optimization
2. **Analysis** - Two-phase decision engine scores complexity, risk, scope
3. **Selection** - Routes to optimal workflow with confidence scoring
4. **Execution** - Runs all phases automatically
5. **Review** - Triple code review (Senior Engineer, Lead Engineer, Architect)
6. **Complete** - Summary with session learnings

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
2. **Review Swarm** - 6 specialized agents launch in parallel (same wall-clock time as 1)
3. **Synthesis** - Orchestrator deduplicates, cross-references, and scores findings
4. **Report** - Consolidated findings by severity (CRITICAL > MAJOR > MINOR) with health score
5. **Simplification** (opt-in) - If issues found, offers 2 parallel simplification agents

## License

MIT
