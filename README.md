# Claude Agent System

**Turn Claude into your personal development team.** Powerful commands that handle everything - from deep planning through implementation to code review, with automatic quality gates and continuous learning.

## Quick Start

Choose your installation method:

| Method | Best For | Commands You Get |
|--------|----------|------------------|
| **Plugin** | Quick install, easy updates | `/zk`, `/systemcc`, `/pcc`, `/pcc-opus`, `/hydra`, `/review` |
| **Script** | Full system with all modules | `/systemcc`, `/plan-opus`, + workflows |

### Option 1: Plugin Install (Recommended)

```bash
/plugin marketplace add Kasempiternal/Claude-Agent-System
/plugin install pcc
```

Done! You now have `/zk`, `/systemcc`, `/pcc`, `/pcc-opus`, `/hydra`, and `/review`.

### Option 2: Script Install (Full System)

**macOS/Linux:**
```bash
# Install for current project
curl -sSL https://raw.githubusercontent.com/Kasempiternal/Claude-Agent-System/main/setup-claude-agent-system.sh | bash

# Install globally (available in ALL projects)
curl -sSL https://raw.githubusercontent.com/Kasempiternal/Claude-Agent-System/main/setup-claude-agent-system.sh | bash -s -- --global
```

**Windows (PowerShell):**
```powershell
# Install for current project
irm https://raw.githubusercontent.com/Kasempiternal/Claude-Agent-System/main/setup-claude-agent-system.ps1 | iex

# Install globally
.\setup-claude-agent-system.ps1 -Global
```

This installs the full system with all 13 systemcc modules, workflows, and middleware.

---

## Anti-Vibe Coding Philosophy

**"Vibe coding"** = typing a prompt, accepting whatever the AI outputs, hoping it works.

**This system is the opposite.** Both commands enforce structure:

| What Vibe Coding Does | What This System Does |
|-----------------------|-----------------------|
| Blindly accepts AI output | Triple code review (3 parallel reviewers) |
| No validation | Build config detection + linting enforcement |
| No learning | Session memory - learns your patterns and mistakes |
| No quality gates | Decision engine with complexity/risk/scope analysis |
| Hope it works | Post-execution validation + auto-fix critical issues |

---

# The `/zk` Command (Plugin)

The smart entry point. Analyzes your request and **auto-routes** to the best execution mode — no manual skill selection needed.

```bash
/zk "what you want to do"
```

## How It Works

ZK walks a deterministic 4-step decision tree:

| Step | Condition | Routes To |
|------|-----------|-----------|
| 1 | Multiple independent deliverables? | `/hydra` |
| 2 | Scale word + broad noun ("entire codebase")? | `/hydra` |
| 3 | High-stakes keyword + qualifying signal? | `/pcc-opus` |
| 4 | Everything else (default) | `/pcc` |

## Examples

```bash
/zk add a button to the settings page          # → PCC (simple, clear scope)
/zk refactor the payment processing system      # → PCC-Opus (keyword + risk domain)
/zk migrate all models to SwiftData             # → PCC-Opus ("migrate" always qualifies)
/zk fix auth; add dashboard; update API         # → Hydra (3 independent tasks)
/zk modernize the entire codebase               # → Hydra (scale + broad scope)
```

**Escape hatch**: You can always bypass ZK and invoke `/pcc`, `/pcc-opus`, or `/hydra` directly.

---

# The `/systemcc` Command

The main command. Handles everything automatically with built-in quality gates.

```bash
/systemcc "what you want to do"
```

## How It Works

When you run `/systemcc`, the system:

1. **Analyzes your project** - Scans structure, tech stack, and conventions (cached for instant startup)
2. **Optimizes your request** - AI enhancement for clarity and completeness
3. **Detects build configuration** - Auto-scans Makefile/CI/CD for code standards
4. **Selects the best workflow** - Picks between 3-agent, 6-agent, or specialized flows
5. **Executes automatically** - All phases run without manual intervention
6. **Reviews the code** - 3 parallel reviewers check quality
7. **Shows a brief summary** - What changed and why

## Examples

```bash
# Simple fixes - Fast 3-agent workflow
/systemcc "fix the login button color"

# Complex features - Full 6-agent system
/systemcc "add user authentication with JWT"

# Web projects - Automatic wireframing first
/systemcc "create contact form page"
# Shows ASCII wireframe -> You approve -> Builds HTML/CSS/JS

# Batch operations - Auto-detected
/systemcc "create CRUD for users, posts, comments"
# Groups operations -> Reduced tool switching
```

## Command Options

```bash
/systemcc "your task"              # Standard execution
/systemcc --debug "your task"      # Show AI decision-making process
/systemcc --secure "task"          # Enhanced security scanning
/systemcc --reanalyze "task"       # Force fresh analysis (ignore cache)
/systemcc --clear-cache            # Clear cache for current repo
```

## Key Features

### Intelligent Workflow Selection

The system analyzes your request across three dimensions:
- **Complexity** - Simple fix or complex architecture change?
- **Risk** - Low-risk styling or high-risk security changes?
- **Scope** - Single file, multiple files, or system-wide?

Then automatically picks the right workflow. No manual selection needed.

### Build Configuration Auto-Detection

The system automatically detects and applies your project's build rules:
- **Scans** Makefile, CI/CD files, linting configs
- **Extracts** formatting rules (black, prettier, isort)
- **Applies** linting standards (flake8, eslint, mypy)
- **Ensures** all generated code passes your pipeline on first commit

If your Makefile has `black --line-length 100`, all Python code automatically uses 100-character lines.

### Triple Code Review

After implementation, three specialized reviewers run in parallel:
- **Senior Engineer** - Checks code quality, best practices, clean code
- **Lead Engineer** - Reviews architecture, technical debt, scalability
- **Architect** - Validates system integration, enterprise patterns

All three run simultaneously (5 minutes max). Critical issues are auto-fixed immediately.

### Persistent Analysis Cache

Project analysis is cached in `~/.claude/cache/` for instant startup across sessions:
- **First run** - Full analysis, cached to disk
- **Subsequent runs** - Loads cache in milliseconds
- **Auto-refresh** - Cache invalidates on git commits or major file changes
- **Zero pollution** - No files created in your repository

```
First run:  🔍 Analyzing... (5-10 seconds) → 💾 Cached
Next runs:  ✅ Loaded cache (instant)
After git commit: 🔄 Refreshing cache...
```

### Session-Based Learning

Within each session, the system learns:
- **Your patterns** - Coding style, naming conventions, preferences
- **Your decisions** - Architecture choices, technology selections
- **Your corrections** - What you DON'T want (captured when you say "no" or "stop")

### Progressive Context Management

The system intelligently manages context to handle larger codebases:
- **MINIMAL loading** (60% reduction) - Simple tasks load only headers & signatures
- **STANDARD loading** (30% reduction) - Medium tasks load summaries & key patterns
- **FULL loading** - Complex tasks load complete documentation
- **Auto-checkpoints** - Never lose progress, resume from interruptions

### Anti-YOLO Web Development

For web projects, the system creates an ASCII wireframe first:

```
/systemcc "create a contact form"

Creating ASCII Wireframe:
┌─ Contact Us ─────────────────────────┐
│ Get in touch with our team           │
├─────────────────────────────────────┤
│ Name:     [________________]         │
│ Email:    [________________]         │
│ Subject:  [▼ General Inquiry]        │
│ Message:  [________________]         │
│           [________________]         │
│ ──────────────────────────────────── │
│ [Submit Message] [Clear Form]        │
└─────────────────────────────────────┘

Does this layout look right?
Type 'yes' to build HTML/CSS, or request changes.
```

**Why this works:**
- 90% fewer revisions - Fix layout in wireframe stage (cheap) not code stage (expensive)
- Token efficient - ASCII uses 10x fewer tokens than HTML mockups
- No surprises - See exactly what you'll get before any code is written

## Available Workflows

The system automatically chooses from these workflows:

### Orchestrated (3-Agent System)
- **Orchestrator** - Plans and coordinates
- **Developer** - Implements the solution
- **Reviewer** - Quality checks and testing

Best for: Bug fixes, simple features, refactoring

### Complete System (6-Agent Validation)
- **Planner** - Strategic analysis and architecture
- **Executer** - Implementation and coding
- **Verifier** - Logic and integration testing
- **Tester** - Quality assurance and edge cases
- **Documenter** - Code documentation and guides
- **Updater** - Version control and deployment

Best for: New features, complex changes, critical systems

### Phase-Based (Large Codebase Handler)
- Breaks massive tasks into focused phases
- Maintains context quality across large projects
- Checkpoint system prevents context loss

Best for: Enterprise codebases, major refactors, system migrations

### Agent OS (Project Setup)
- **Analyzer** - Assesses current project state
- **Architect** - Designs standards and structure
- **Builder** - Implements foundation
- **Documenter** - Creates project documentation

Best for: New project setup, standards implementation

### AI Dev Tasks (PRD-Based Development)
- **PRD Creation** - Requirements and specifications
- **Task Generation** - Detailed work breakdown
- **Implementation** - Feature building with validation

Best for: Product features, user stories, MVP development

### Anti-YOLO Web
- ASCII wireframe creation → approval → HTML implementation

Best for: UI components, forms, dashboards, landing pages

## The Decision Engine

Here's what happens behind the scenes when you run `/systemcc`:

```
User: /systemcc "your request"
         │
         ▼
┌─────────────────────────────────────┐
│  PROJECT ANALYSIS                   │
│  Analyze structure, detect patterns │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  SECURITY PRE-SCAN (if needed)      │
│  Check for injection, block threats │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  LYRA AI PROMPT OPTIMIZATION        │
│  Deconstruct → Diagnose → Develop   │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  BUILD CONFIG DETECTION             │
│  Makefile, CI/CD, linters           │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  3-DIMENSIONAL ANALYSIS             │
│  Complexity × Risk × Scope          │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  WORKFLOW SELECTION                 │
│  Pick best workflow for the task    │
└────────────┬────────────────────────┘
             │
             ▼
        EXECUTION
             │
   ┌─────────┼─────────┐
   ▼         ▼         ▼
┌─────┐ ┌─────┐ ┌─────────┐
│BATCH│ │ANTI │ │STANDARD │
│MODE │ │YOLO │ │WORKFLOWS│
└─────┘ └─────┘ └─────────┘
```

## Debug Mode

Want to see how the system makes decisions?

```bash
/systemcc --debug "add user authentication"

ANALYSIS RESULTS:
├─ Complexity: complex (auth, security keywords)
├─ Risk: high (authentication detected)
└─ Scope: multi (auth, middleware, database)

DECISION: Complete 6-Agent System
   Confidence: 85% (High complexity + high risk)
   Security scan: enabled

Executing Complete System workflow...
```

---

# The `/plan-opus` Command

For when you want explicit control over the planning process.

```bash
/plan-opus "task description"
```

## Why This Command Exists

Claude Code has a native "plan mode" (`/plan`), but the community discovered a limitation: **it uses Haiku as the code scout**. While Haiku is efficient and fast, it's also the least capable model in the Claude family. For complex codebases, you may want smarter models doing the exploration.

`/plan-opus` was created to give you **more control over the planning process** with configurable models:

| Aspect | Native Plan Mode | `/plan-opus` |
|--------|------------------|--------------|
| Scout Model | Haiku (2-3 agents) | Sonnet by default (2-6 agents, configurable to Opus) |
| Plan Visibility | Shown to user | Written to editable `.md` file |
| User Approval | Yes, before execution | Yes, with ability to edit the plan first |
| Parallelization | Limited (Claude Code rarely parallelizes) | Aggressive (multiple agents per phase) |
| Implementation | Sequential | 2-6 parallel Opus agents |
| Post-Cleanup | None | 2-6 code simplifier agents |

## Configurable Scout Model

By default, scouts use **Sonnet** to balance intelligence and token cost. But if you want maximum exploration quality, you can switch scouts to **Opus**.

Edit `.claude/commands/plan-opus.md`, line 30:

```markdown
# Default (token-efficient):
...using the Task tool with `subagent_type='Explore'` and `model='sonnet'`

# Maximum quality (change 'sonnet' to 'opus'):
...using the Task tool with `subagent_type='Explore'` and `model='opus'`
```

**Why Sonnet is the default**: Running 2-6 Opus scouts + 2-6 Opus implementers + 2-6 Opus simplifiers can consume significant tokens. Sonnet scouts are smart enough for exploration while keeping costs reasonable. Switch to Opus scouts only for particularly complex codebases.

## How It Works

`/plan-opus` follows an orchestrator pattern - Opus coordinates everything but delegates actual work to specialized agents:

```
/plan-opus "your complex task"
         │
         ▼
┌─────────────────────────────────────┐
│  Phase 1: TASK UNDERSTANDING        │
│  Clarify requirements if needed     │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  Phase 2: PARALLEL EXPLORATION      │
│  2-6 Sonnet scouts explore codebase │
│  (Architecture, Features, Tests...) │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  Phase 3: SYNTHESIS                 │
│  Combine findings, verify key files │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  Phase 4: PLAN CREATION             │
│  Write detailed plan to file        │
│  .claude/plans/{task-slug}.md       │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  Phase 5: YOUR REVIEW               │
│  ⏸️  STOPS HERE - You edit the plan │
│  Confirm when ready to proceed      │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  Phase 6: PARALLEL IMPLEMENTATION   │
│  2-6 Opus agents work in parallel   │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  Phase 7: VERIFICATION              │
│  Tests + Code review                │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  Phase 8: SIMPLIFICATION            │
│  2-6 agents clean up the code       │
└─────────────────────────────────────┘
```

## The Plan File

Unlike automatic workflows, `/plan-opus` creates an actual file you can review and edit:

```markdown
# Implementation Plan: Add User Authentication

Created: 2024-01-15
Status: PENDING APPROVAL

## Summary
Add JWT-based authentication with login, logout, and session management.

## Parallelization Strategy

| Stream | Focus | Files | Can Parallel With |
|--------|-------|-------|-------------------|
| Stream A | Database | migrations/, models/ | B, C |
| Stream B | API Routes | routes/auth.ts | A, C |
| Stream C | Middleware | middleware/auth.ts | A, B |

## Implementation Phases
...

---
**USER: Please review this plan. Edit any section directly, then confirm to proceed.**
```

You can:
- Edit the plan directly in your editor
- Add or remove phases
- Change file assignments
- Adjust the parallelization strategy
- Then confirm to execute

## Example Usage

```bash
# Complex feature - want to review the plan
/plan-opus "add real-time notifications with WebSocket"

# System creates plan at .claude/plans/add-real-time-notifications.md
# You review, maybe edit the WebSocket library choice
# You confirm
# 4 Opus agents implement in parallel
# Done!
```

---

# The `/pcc` and `/pcc-opus` Commands (Plugin)

Parallel Claude Coordinator - an orchestrator that spawns agent swarms for exploration and implementation.

```bash
/pcc "implement user authentication with JWT tokens"
/pcc-opus "refactor the entire payment processing system"
```

## Two Variants

| Variant | Scouts | Implementers | Best For |
|---------|--------|-------------|----------|
| `/pcc` | **Sonnet** (fast, cost-efficient) | **Opus** (high quality) | Most tasks |
| `/pcc-opus` | **Opus** (maximum depth) | **Opus** (high quality) | Critical systems, unfamiliar codebases |

## How PCC Works

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

**Key difference from `/plan-opus`**: PCC is a plugin skill with dynamic agent counts (2-6 based on complexity), while `/plan-opus` is a script-install command with similar capabilities.

---

# The `/review` Command (Plugin)

Deploys 6 parallel review agents to analyze your code, then **automatically fixes** CRITICAL and MAJOR findings with your approval. Fully self-contained - no external plugin dependencies.

```bash
/review                  # Review all uncommitted changes (default)
/review staged           # Review only staged changes
/review src/auth.ts      # Review specific file(s)
/review "auth module"    # Review files matching a description
```

## Review Agents

All 6 agents run in parallel (same wall-clock time as running one), defined as `.md` files in `.claude/agents/`:

| Agent | What It Checks |
|-------|---------------|
| Bug & Logic Reviewer | Security vulnerabilities, crashes, logic errors, resource leaks |
| Project Guidelines Reviewer | Style conventions, CLAUDE.md standards, best practices |
| Silent Failure Hunter | Swallowed exceptions, bad fallbacks, inadequate error handling |
| Comment Analyzer | Stale docs, misleading comments, missing documentation |
| Type Design Analyzer | Encapsulation, invariant expression, type safety |
| Test Coverage Analyzer | Test gaps, missing edge cases, test quality |

## What You Get

The orchestrator synthesizes all 6 agent reports into a consolidated review:

- **Health score** (0-10) with severity-weighted formula
- **Agent verdicts table** - quick pass/fail per agent
- **Deduplicated findings** - overlapping issues merged, multi-agent flags boost confidence
- **Cross-agent correlation** - related findings from different agents grouped together
- **Severity-prioritized** - CRITICAL > MAJOR > MINOR

## Fix Phase (Opt-In)

If CRITICAL or MAJOR findings are found, the system asks how you want to proceed:

- **Fix CRITICAL and MAJOR** (default) - parallel fix agents resolve high-severity findings
- **Fix ALL** - also addresses MINOR findings (style, comments, naming)
- **Report only** - keep the report without modifying code

Fix agents are grouped by file (exclusive ownership, no conflicts) and make minimum changes to resolve each finding. `/review` never modifies code without your explicit consent.

---

# When to Use Each Command

| Situation | Use This |
|-----------|----------|
| **Don't want to choose** — let the system pick | `/zk` |
| Quick fixes, bug fixes | `/systemcc` |
| Simple features | `/systemcc` or `/pcc` |
| Most everyday tasks | `/zk` or `/systemcc` |
| Multiple independent tasks at once | `/hydra` (or `/zk` auto-detects) |
| Complex refactors | `/pcc-opus` (or `/zk` auto-detects) |
| Architecture changes | `/plan-opus` or `/pcc-opus` |
| When you want to see/edit the plan first | `/plan-opus` or `/pcc` |
| Code review before committing | `/review` |
| Audit code quality without changing anything | `/review` |
| Pre-PR review with health scoring | `/review` |

---

## Project Structure

When installed, the system adds this structure:

```
your-project/
└── .claude/
    ├── commands/              # Command definitions
    │   └── systemcc/          # Modular systemcc modules
    ├── agents/                # Code reviewers and simplifiers
    ├── workflows/             # Workflow implementations
    │   ├── anti-yolo-web/
    │   ├── complete-system/
    │   ├── orchestrated-only/
    │   ├── phase-based-workflow/
    │   ├── agent-os/
    │   └── ai-dev-tasks/
    └── middleware/            # AI optimization systems
```

Data is stored separately in your home directory (never in your project):

```
~/.claude/
├── cache/                     # Persistent analysis cache (per-repo)
├── checkpoints/               # Session resumption data
└── temp/                      # Workflow temp files (auto-deleted)
```

---

## Installation Options

| Feature | Local (default) | Global (`--global`) |
|---------|----------------|---------------------|
| Available in | Current project only | All projects |
| Install location | `./.claude/` | `~/.claude/` |
| Use case | Project-specific setup | Always-available commands |

**Tip:** Use `--global` if you want `/systemcc` available everywhere.

---

## Other Commands

```bash
/help                              # Show all available commands
/analyzecc                         # Manual project analysis
```

---

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## Community

Built from real-world experiences shared by developers:

- [Anti-YOLO Method](https://www.reddit.com/r/ClaudeAI/comments/1n1941k/the_antiyolo_method_why_i_make_claude_draw_ascii/) - ASCII wireframing for web projects
- [Phase-based development](https://www.reddit.com/r/ClaudeAI/comments/1lw5oie/how_phasebased_development_made_claude_code_10x/) - Large codebase handling
- [Multi-agent workflows](https://www.reddit.com/r/ClaudeAI/comments/1lqn9ie/my_current_claude_code_sub_agents_workflow/) - Team-based development
- [Agent OS](https://buildermethods.com/agent-os) - Project initialization framework

---

## License

MIT License - see [LICENSE](LICENSE) for details.
