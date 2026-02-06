# Claude Agent System Plugin

A Claude Code plugin with intelligent workflow orchestration and parallel agent coordination.

## Skills

### `/systemcc` - Intelligent Workflow Router
The **only command you need**. Auto-analyzes task complexity, risk, and scope to select and execute the optimal workflow automatically.

```bash
/systemcc fix the login bug
/systemcc refactor the authentication system
/systemcc migrate all models to new ORM
```

Features:
- 3-dimensional task analysis (complexity, risk, scope)
- Automatic workflow selection
- Security scan auto-detection
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
Deploys **6 parallel Anthropic review agents** to analyze code without modifying it. Opt-in simplification phase.

```bash
/review                  # Review all uncommitted changes
/review staged           # Review only staged changes
/review src/auth.ts      # Review specific file(s)
```

Agents deployed:
- Bug & Logic Reviewer (security, crashes, logic errors)
- Project Guidelines Reviewer (style, CLAUDE.md standards)
- Silent Failure Hunter (swallowed errors, bad fallbacks)
- Comment Analyzer (stale docs, misleading comments)
- Type Design Analyzer (encapsulation, invariants)
- Test Coverage Analyzer (gaps, edge cases)

Features:
- Health score (0-10) with severity breakdown
- Cross-agent correlation (related findings grouped)
- Deduplicated, prioritized consolidated report
- Opt-in simplification phase (user must confirm)

## Installation

```bash
/plugin marketplace add Kasempiternal/Claude-Agent-System
/plugin install pcc
```

## Skill Comparison

| Skill | Use Case | Agents | Modifies Code? |
|-------|----------|--------|----------------|
| `/systemcc` | Any task - auto-routes | Auto-selected | Yes |
| `/pcc` | Parallel orchestration | Sonnet scouts + Opus implementers (2-6 each) | Yes |
| `/pcc-opus` | Max quality orchestration | Opus scouts + Opus implementers (2-6 each) | Yes |
| `/review` | Code review & analysis | 6 parallel review agents + 2 optional simplifiers | Only if opted in |

## How PCC Works

1. **Task Understanding** - Clarifies the task with you
2. **Parallel Exploration** - Spawns 2-6 scout agents
3. **Synthesis** - Combines findings
4. **Plan Creation** - Creates detailed implementation plan
5. **User Review** - You edit and approve
6. **Parallel Implementation** - Spawns 2-6 Opus agents
7. **Verification** - Tests and code review
8. **Simplification** - Cleans up code
9. **Final Report** - Summarizes everything

## How SystemCC Works

1. **Analysis** - Analyzes complexity, risk, scope
2. **Selection** - Auto-selects optimal workflow
3. **Execution** - Runs all phases automatically
4. **Review** - Triple code review
5. **Complete** - Brief summary

## License

MIT
