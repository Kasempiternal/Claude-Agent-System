# Claude Agent System

**Turn Claude into your personal development team.** Two powerful commands that handle everything - from deep planning through implementation to deployment, with automatic code review and continuous learning.

## The Two Commands

This system provides **two main commands**, each designed for different workflows:

| Command | Purpose | Best For |
|---------|---------|----------|
| `/systemcc` | Automatic everything | Most tasks - let the AI decide the approach |
| `/plan-opus` | Deep planning with control | Complex features where you want to review the plan first |

```bash
# Let the system handle everything automatically
/systemcc "add user authentication"

# Get a detailed plan first, review it, then execute
/plan-opus "refactor the entire payment system"
```

---

## Quick Start

### Installation

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

### Usage

```bash
/systemcc "what you want to do"
```

That's it. The system handles everything automatically.

---

## How It Works

When you run `/systemcc`, the system:

1. **Analyzes your project** - Scans structure, tech stack, and conventions (cached for instant startup)
2. **Optimizes your request** - AI enhancement for clarity and completeness
3. **Detects build configuration** - Auto-scans Makefile/CI/CD for code standards
4. **Selects the best workflow** - Picks between 3-agent, 6-agent, or specialized flows
5. **Executes automatically** - All phases run without manual intervention
6. **Reviews the code** - 3 parallel reviewers check quality
7. **Shows a brief summary** - What changed and why

### Examples

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

---

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

---

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

---

## Commands

**Primary:**
```bash
/systemcc "your task"              # Does everything automatically
/systemcc --debug "your task"      # Show AI decision-making process
/systemcc --secure "task"          # Enhanced security scanning
```

**Cache Control:**
```bash
/systemcc --reanalyze "task"       # Force fresh analysis (ignore cache)
/systemcc --clear-cache            # Clear cache for current repo
```

**Planning:**
```bash
/plan-opus "task description"      # Deep planning with parallel exploration
```

**Utility:**
```bash
/help                              # Show all commands
/analyzecc                         # Manual project analysis
```

---

## The `/plan-opus` Command

### Why We Built This

Claude Code has a native "plan mode" (`/plan`), but the community discovered a limitation: **it uses Haiku as the code scout**. While Haiku is efficient and fast, it's also the least capable model in the Claude family. For complex codebases, you may want your smartest model doing the exploration.

`/plan-opus` was created to give you **more control over the planning process** with configurable models:

| Aspect | Native Plan Mode | `/plan-opus` |
|--------|------------------|--------------|
| Scout Model | Haiku (2-3 agents) | Sonnet by default (2-6 agents, configurable to Opus) |
| Plan Visibility | Shown to user | Written to editable file |
| User Approval | Yes, before execution | Yes, with ability to edit the plan file |
| Parallelization | Limited (Claude Code rarely parallelizes) | Aggressive (multiple agents per phase) |
| Implementation | Sequential | 2-6 parallel Opus agents |
| Post-Cleanup | None | 2-6 code simplifier agents |

### Configurable Scout Model

By default, scouts use **Sonnet** to balance intelligence and token cost. But if you want maximum exploration quality, you can switch scouts to **Opus**.

Edit `.claude/commands/plan-opus.md`, line 30:

```markdown
# Default (token-efficient):
...using the Task tool with `subagent_type='Explore'` and `model='sonnet'`

# Maximum quality (change 'sonnet' to 'opus'):
...using the Task tool with `subagent_type='Explore'` and `model='opus'`
```

**Why Sonnet is the default**: Running 2-6 Opus scouts + 2-6 Opus implementers + 2-6 Opus simplifiers can consume significant tokens. Sonnet scouts are smart enough for exploration while keeping costs reasonable. Switch to Opus scouts only for particularly complex codebases.

### How It Works

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

### The Plan File

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

### When to Use Each Command

| Situation | Use This |
|-----------|----------|
| Quick fixes, bug fixes | `/systemcc` |
| Simple features | `/systemcc` |
| Complex refactors | `/plan-opus` |
| Architecture changes | `/plan-opus` |
| When you want to see the plan first | `/plan-opus` |
| When you trust the AI to decide | `/systemcc` |

### Example Usage

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

## Project Structure

When installed, the system adds this structure:

```
your-project/
└── .claude/
    ├── commands/              # Command definitions
    │   └── systemcc/          # Modular systemcc modules
    ├── agents/                # Code reviewers
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

---

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

## Installation Options

| Feature | Local (default) | Global (`--global`) |
|---------|----------------|---------------------|
| Available in | Current project only | All projects |
| Install location | `./.claude/` | `~/.claude/` |
| Use case | Project-specific setup | Always-available commands |

**Tip:** Use `--global` if you want `/systemcc` available everywhere.

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

---

**Made with love by the Claude AI Community**

*Ship quality code on the first try, not the fifth.*
