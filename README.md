# Claude Agent System

**Turn Claude into your personal development team.** One command handles everything - from planning through implementation to deployment, with automatic code review and continuous learning.

**Current Version:** 3.0.0 | [View Changelog](CHANGELOG.md)

## 🎉 What's New in v3.0.0

### Progressive Disclosure & Context Optimization (NEW)
The system now intelligently manages context to handle larger codebases efficiently:
- **Smart Loading** - Automatically loads MINIMAL, STANDARD, or FULL context based on task complexity
- **20-30% Context Reduction** - Handles more complex tasks within context limits
- **On-Demand Upgrades** - Seamlessly loads more detail when needed during execution
- **Zero Configuration** - Works automatically, optimizes transparently

### Enhanced Checkpoint System (NEW)
Never lose progress again with automatic execution state snapshots:
- **Auto-Checkpoints** - Created at phase transitions, before risky operations
- **Error Recovery** - Resume from interruptions with full context restoration
- **Session Continuity** - Continue work seamlessly across sessions
- **Manual Snapshots** - Create checkpoints on demand for critical points

### Build Configuration Auto-Detection
The system automatically detects and applies your project's build rules:
- **Auto-scans** Makefile, CI/CD files, linting configs
- **Extracts** formatting rules (black, prettier, isort)
- **Applies** linting standards (flake8, eslint, mypy)
- **Ensures** all generated code passes your pipeline on first commit

No configuration needed - just have a Makefile or CI/CD file, and systemcc automatically follows your team's standards!

[See full changelog →](CHANGELOG.md)

---

## 🎉 What's New in v2.0.0 (Still NEW!)

### Triple Code Review System
Every task now gets reviewed by 3 specialized experts in parallel (5 min max):
- **Senior Engineer** - Code quality & best practices
- **Lead Engineer** - Architecture & scalability
- **Architect** - System integration & patterns

Critical issues are auto-fixed immediately.

### Automatic Memory Updates
The system now learns from every session automatically:
- Captures patterns, decisions, and solutions
- **NEW:** `dont_dos.md` - Remembers what you DON'T want
- Updates after every task completion
- No manual memory management needed

### Simplified Analysis Engine
Streamlined to **3 core dimensions**:
- **Complexity**: simple / moderate / complex
- **Risk**: low / high
- **Scope**: single-file / multi-file / system-wide

[See full changelog →](CHANGELOG.md)

---

## 🚀 Quick Setup

**One command installs everything (macOS/Linux):**

```bash
# Install for current project
curl -sSL https://raw.githubusercontent.com/Kasempiternal/Claude-Agent-System/main/setup-claude-agent-system.sh | bash

# Install GLOBALLY (available in ALL projects)
curl -sSL https://raw.githubusercontent.com/Kasempiternal/Claude-Agent-System/main/setup-claude-agent-system.sh | bash -s -- --global
```

### Global vs Local Installation

| Feature | Local (default) | Global (`--global`) |
|---------|----------------|---------------------|
| Available in | Current project only | All projects |
| Install location | `./.claude/` | `~/.claude/` |
| CLAUDE.md created | Yes | No (use per-project) |
| Memory bank | Per-project | Shared |
| Use case | Project-specific config | Always-available commands |

**Tip:** Use `--global` if you want `/systemcc` available everywhere, then add project-specific CLAUDE.md as needed.

## How It Works

### Just one command:

```bash
/systemcc "what you want to do"
```

The system then:
1. **Shows detection confirmation** - Immediate feedback that command was recognized
2. **Analyzes your project** - Deep scan on first use, cached for future
3. **Optimizes the request** - AI enhancement for clarity and completeness
4. **Detects build configuration** - Auto-scans Makefile/CI/CD for code standards (NEW)
5. **Selects best workflow** - Picks between 3-agent, 6-agent, or specialized flows
6. **Executes automatically** - All phases run without manual intervention
7. **Reviews the code** - 3 parallel reviewers check quality (NEW)
8. **Updates memory** - Learns from every session for continuous improvement (NEW)
9. **Shows brief summary** - What changed and why, no fluff

### What's Actually Happening

The system uses multiple specialized workflows. You don't pick - it does:
- **Simple fixes** → 3-agent streamlined workflow
- **Complex features** → 6-agent comprehensive validation
- **Web projects** → ASCII wireframe first, then code
- **Large codebases** → Phase-based execution for memory management
- **New projects** → Full initialization and setup
## 📝 Real Examples

```bash
# Simple fixes → Fast 3-agent workflow
/systemcc "fix the login button color"

# Complex features → Full 6-agent system  
/systemcc "add user authentication with JWT"

# Web projects → Automatic wireframing first
/systemcc "create contact form page"
# ↳ Shows ASCII wireframe → You approve → Builds HTML/CSS/JS

# Batch operations → Auto-detected
/systemcc "create CRUD for users, posts, comments"
# ↳ Groups operations → Reduced tool switching
```

## What Makes This Different

### Build Configuration Auto-Detection (NEW)
No more pipeline failures! The system automatically:
- **Scans** your Makefile, CI/CD files, and linting configs
- **Extracts** formatting rules (black, prettier, isort with exact flags)
- **Applies** linting standards (flake8, eslint, mypy with your ignores)
- **Ensures** all generated code passes your pipeline on first commit

Example: If your Makefile has `black --line-length 100`, all Python code will automatically use 100-character lines. Works with Python, JavaScript, Go, and more!

### Triple Code Review (NEW)
After implementation, three specialized reviewers run in parallel:
- **Senior Engineer** - Checks code quality, best practices, clean code
- **Lead Engineer** - Reviews architecture, technical debt, scalability
- **Architect** - Validates system integration, enterprise patterns

All three run simultaneously (5 minutes max). Critical issues are auto-fixed immediately.

### Continuous Learning System (NEW)
The system remembers everything:
- **Your patterns** - Coding style, naming conventions, preferences
- **Your decisions** - Architecture choices, technology selections
- **Your "don'ts"** - What you DON'T want (captured when you say "no" or "stop")
- **Solutions** - Fixes to problems for future reference

Every session makes it smarter. It learns what you want AND what you don't want.

### Anti-YOLO Web Development
For web projects, it creates an ASCII wireframe first:
- See the layout before any code is written
- Approve or request changes while it's cheap
- Then generates the exact HTML/CSS/JS
- Drastically reduces revision cycles

### Intelligent Workflow Selection
The system analyzes your request across 3 core dimensions:
1. **Complexity** - Simple fix or complex architecture change?
2. **Risk** - Low-risk styling or high-risk security changes?
3. **Scope** - Single file, multiple files, or system-wide?

Then automatically picks the right workflow. No manual selection needed.

**Supports all major languages and frameworks**

## The Decision Engine - How It Actually Works

Here's what happens when you run `/systemcc`:

```
User: /systemcc [--debug] [--secure] "your request"
         │
         ▼
┌─────────────────────────────────────┐
│  🧠 MEMORY BANK INITIALIZATION      │
├─────────────────────────────────────┤
│ Load ClaudeFiles/memory/*.md:       │
│ • CLAUDE-activeContext.md  ← Session state │
│ • CLAUDE-patterns.md       ← Your coding style │
│ • CLAUDE-decisions.md      ← Past architecture │
│ • CLAUDE-troubleshooting.md ← Known solutions │
│                                     │
│ Check .analysis-status:             │
│ ├─ EXISTS → Load cached analysis    │
│ └─ MISSING → Schedule first-run scan│
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  🔒 SECURITY PRE-SCAN (Optional)    │
├─────────────────────────────────────┤
│ IF --secure flag OR suspicious patterns: │
│                                     │
│ Scan for injection patterns:        │
│ • Base64/URL/HTML encoding          │
│ • SQL injection attempts            │
│ • Command injection patterns        │
│ • Path traversal attempts           │
│                                     │
│ Risk Assessment:                    │
│ ├─ CRITICAL (>0.9) → 🛑 Block execution │
│ ├─ HIGH (0.7-0.9) → ⚠️ Require confirmation │
│ └─ SAFE (<0.7) → ✅ Continue        │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  🎯 LYRA AI PROMPT OPTIMIZATION     │
├─────────────────────────────────────┤
│ Apply 4-D Enhancement Methodology:  │
│                                     │
│ 1. DECONSTRUCT:                     │
│    • Extract core intent            │
│    • Identify task components       │
│    • Parse technical requirements   │
│                                     │
│ 2. DIAGNOSE:                        │
│    • Find specification gaps        │
│    • Detect ambiguous requirements  │
│    • Assess feasibility            │
│                                     │
│ 3. DEVELOP:                         │
│    • Add missing technical details  │
│    • Suggest best practices        │
│    • Include error handling        │
│                                     │
│ 4. DELIVER:                         │
│    • Craft optimized final prompt   │
│    • Select enhancement mode:       │
│    │  ├─ BASIC (simple tasks)       │
│    │  └─ DETAIL (complex features)  │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  📋 BUILD CONFIG DETECTION (NEW)    │
├─────────────────────────────────────┤
│ Auto-scan for build configurations: │
│                                     │
│ File Detection:                     │
│ • Makefile, .gitlab-ci.yml          │
│ • .github/workflows/*.yml           │
│ • pyproject.toml, package.json      │
│ • .pre-commit-config.yaml           │
│                                     │
│ Extract Rules:                      │
│ • Formatters: black, prettier       │
│ • Linters: flake8, eslint, mypy     │
│ • Test requirements & coverage      │
│                                     │
│ IF config detected:                 │
│ └─ → Apply rules to all code ✅     │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  📊 CONTEXT SIZE ANALYSIS          │
├─────────────────────────────────────┤
│ Analyze current project state:      │
│                                     │
│ Token Analysis:                     │
│ • Current context: [X] tokens       │
│ • Loaded files: [N] files           │
│ • Project size: [M] total files     │
│ • Estimated growth: [Y] tokens      │
│                                     │
│ Memory Pressure Check:              │
│ • Available context window          │
│ • Required context for task         │
│ • Buffer for responses              │
│                                     │
│ Decision Matrix:                    │
│ ├─ >30,000 tokens → 🔄 Force Phase-Based │
│ ├─ >15,000 + complex → 🔄 Consider Phase-Based │
│ ├─ >10 files loaded → 🔄 Phase-Based candidate │
│ └─ <Thresholds → ✅ Continue standard │
│                                     │
│ IF Phase-Based triggered:           │
│ └─ → Jump to Phase-Based Execution  │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  ⚡ PARALLEL OPTIMIZATION ANALYSIS  │
├─────────────────────────────────────┤
│ Detect batch operation potential:   │
│                                     │
│ Component Independence:             │
│ • Scan for independent modules      │
│ • Identify non-conflicting files    │
│ • Group similar operations          │
│                                     │
│ Batch Potential:                   │
│ ├─ High: Many similar operations    │
│ ├─ Medium: Some grouping possible   │
│ └─ Low: Sequential recommended      │
│                                     │
│ Batch Opportunities:                │
│ • Multi-file creation/editing       │
│ • Background shell commands         │
│ • Independent test generation       │
│                                     │
│ IF batch_potential == 'high':      │
│ └─ → Enable batch optimization mode │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  🧮 3-DIMENSIONAL ANALYSIS          │
├─────────────────────────────────────┤
│ Score task across three dimensions: │
│                                     │
│ 1️⃣ COMPLEXITY:                      │
│    • Simple: fix, update, typo      │
│    • Moderate: feature, add         │
│    • Complex: architecture, refactor│
│                                     │
│ 2️⃣ RISK:                            │
│    • Low: styling, docs, config     │
│    • High: security, database, auth │
│                                     │
│ 3️⃣ SCOPE:                           │
│    • Single: one file mentioned     │
│    • Multi: multiple files          │
│    • System: "all", "entire", etc.  │
│                                     │
│ Decision Confidence: [0.0-1.0]      │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  🔍 WEB PROJECT DETECTION          │
├─────────────────────────────────────┤
│ Scan for web project indicators:    │
│                                     │
│ Keyword Analysis:                   │
│ • UI/UX: "form", "modal", "page",   │
│         "component", "dashboard"    │
│ • Layout: "wireframe", "design",    │
│          "layout", "responsive"     │
│ • Technologies: "HTML", "CSS", "JS",│
│                "React", "Vue"       │
│                                     │
│ File Pattern Detection:             │
│ • package.json (Node.js projects)   │
│ • *.html, *.css, *.js files        │
│ • React/Vue/Angular indicators      │
│ • Frontend framework configs       │
│                                     │
│ Framework Recognition:              │
│ • React/Next.js/Gatsby             │
│ • Vue.js/Nuxt.js                   │
│ • Angular/Svelte                   │
│ • Bootstrap/Tailwind/Material-UI   │
│                                     │
│ Web Confidence Score: [0.0-1.0]     │
│                                     │
│ IF Web Score > 0.7:                 │
│ └─ → 🎨 Anti-YOLO Web Workflow      │
│                                     │
│ ELSE: Continue to workflow matrix   │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  ⚖️ ENHANCED WORKFLOW MATRIX        │
├─────────────────────────────────────┤
│ Multi-factor decision algorithm:    │
│                                     │
│ 🟥 PRIORITY 1: Context Override    │
│ ┌─────────────────────────────────┐ │
│ │ Context > 30,000 tokens    OR   │ │
│ │ Files loaded > 10          OR   │ │
│ │ Project size > 1000 files       │ │
│ │ [Override Confidence: 0.95]     │ │
│ │ ↓                               │ │
│ │ → 📚 PHASE-BASED EXECUTION      │ │
│ └─────────────────────────────────┘ │
│                                     │
│ 🟨 PRIORITY 2: Pattern Recognition │
│ ┌─────────────────────────────────┐ │
│ │ Keywords: "setup", "initialize", │ │
│ │          "project", "scaffold"  │ │
│ │ + Composite Score > 0.7         │ │
│ │ [Pattern Confidence: 0.84]      │ │
│ │ ↓                               │ │
│ │ → 🎯 AGENT OS WORKFLOW          │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ Keywords: "build", "feature",    │ │
│ │          "product", "requirement"│ │
│ │ + Composite Score > 0.6         │ │
│ │ [Pattern Confidence: 0.78]      │ │
│ │ ↓                               │ │
│ │ → 📋 AI DEV TASKS WORKFLOW      │ │
│ └─────────────────────────────────┘ │
│                                     │
│ 🟦 PRIORITY 3: Complexity Scoring  │
│ ┌─────────────────────────────────┐ │
│ │ Composite Score > 0.7      OR   │ │
│ │ Risk Assessment > 0.5      OR   │ │
│ │ Technical Complexity > 0.8      │ │
│ │ [High Confidence: 0.91]         │ │
│ │ ↓                               │ │
│ │ → 🏭 COMPLETE 6-AGENT SYSTEM    │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ Composite Score < 0.4      AND  │ │
│ │ Risk Assessment < 0.3      AND  │ │
│ │ Scope Impact < 0.5              │ │
│ │ [Efficiency Confidence: 0.89]   │ │
│ │ ↓                               │ │
│ │ → 🔧 ORCHESTRATED 3-AGENT       │ │
│ └─────────────────────────────────┘ │
│                                     │
│ 🟪 DEFAULT: High-Quality Fallback  │
│ ┌─────────────────────────────────┐ │
│ │ When uncertainty > 0.3:         │ │
│ │ → 🏭 COMPLETE SYSTEM (Safe)     │ │
│ │ [Conservative Confidence: 0.87] │ │
│ └─────────────────────────────────┘ │
└────────────┬────────────────────────┘
             │
             ▼
        🚀 WORKFLOW EXECUTION
             │
   ┌─────────┼─────────┐
   ▼         ▼         ▼
┌─────┐ ┌─────┐ ┌─────────┐
│BATCH│ │ANTI │ │STANDARD │
│MODE │ │YOLO │ │WORKFLOWS│
└─────┘ └─────┘ └─────────┘
```

### 🎨 Special: Anti-YOLO Web Workflow

When you request web development, the system automatically activates the revolutionary **Anti-YOLO Method**:

```
User: /systemcc "create a contact form"

🎨 Creating ASCII Wireframe:
┌─ Contact Us ─────────────────────────┐
│ Get in touch with our team           │
├─────────────────────────────────────┤
│ Name:     [________________]         │
│ Email:    [________________]         │ 
│ Subject:  [▼ General Inquiry]        │
│ Message:  [________________]         │
│           [________________]         │
│           [________________]         │
│ ──────────────────────────────────── │
│ [Submit Message] [Clear Form]        │
└─────────────────────────────────────┘

✋ Does this layout look right? 
   Type 'yes' to build HTML/CSS, or request changes.

User: yes

✅ Perfect! Building production code...
   [Generates HTML/CSS/JS matching wireframe exactly]
```

**Why This Works:**
- **90% fewer revisions** - Fix layout in wireframe stage (cheap) not code stage (expensive)
- **Token efficient** - ASCII uses 10x fewer tokens than HTML mockups
- **No surprises** - See exactly what you'll get before any code is written

## 🏗️ What Workflows Are Available

The system automatically chooses from these battle-tested workflows:

### 🎨 Anti-YOLO Web (Automatic for HTML/CSS/JS)
- ASCII wireframe creation → approval → HTML implementation
- Perfect for UI components, forms, dashboards, landing pages

### 🔧 Orchestrated (3-Agent System)
- **Orchestrator**: Plans and coordinates
- **Developer**: Implements the solution  
- **Reviewer**: Quality checks and testing
- Perfect for: Bug fixes, simple features, refactoring

### 🏭 Complete System (6-Agent Validation)
- **Planner**: Strategic analysis and architecture
- **Executer**: Implementation and coding
- **Verifier**: Logic and integration testing
- **Tester**: Quality assurance and edge cases
- **Documenter**: Code documentation and guides
- **Updater**: Version control and deployment
- Perfect for: New features, complex changes, critical systems

### 📚 Phase-Based (Large Codebase Handler)
- Breaks massive tasks into focused phases
- Maintains context quality across large projects
- Perfect for: Enterprise codebases, major refactors, system migrations

### 🎯 Agent OS (Project Setup)
- **Analyzer**: Assesses current project state
- **Architect**: Designs standards and structure
- **Builder**: Implements foundation
- **Documenter**: Creates project documentation
- Perfect for: New project setup, standards implementation

### 📋 AI Dev Tasks (PRD-Based Development)
- **PRD Creation**: Requirements and specifications
- **Task Generation**: Detailed work breakdown
- **Implementation**: Feature building with validation
- Perfect for: Product features, user stories, MVP development

## 🔬 Advanced Features

### 🧠 3-Dimensional Task Analysis
Behind the simple `/systemcc` command, the system evaluates every request across three dimensions:

```
📊 ANALYSIS DIMENSIONS:
├─ Complexity: simple / moderate / complex
├─ Risk: low / high
└─ Scope: single-file / multi-file / system-wide
```

**Smart Pattern Recognition:**
- Simple keyword matching for fast decisions
- Clear decision table for predictable routing
- Learns from your preferences over time

### 🔍 Debug Mode - See the AI's Thinking

Want to understand how the system made its decision? Use debug mode:

```bash
/systemcc --debug "add user authentication"

🧠 ANALYSIS RESULTS:
├─ Complexity: complex (auth, security keywords)
├─ Risk: high (authentication detected)
└─ Scope: multi (auth, middleware, database)

🎯 DECISION: Complete 6-Agent System
   Confidence: 85% (High complexity + high risk)
   Security scan: enabled

🚀 Executing Complete System workflow...
```

### 📁 Project Structure Created

When installed, the system adds this organized structure:

```
your-project/
├── .claude/                    # Agent system (auto git-ignored)
│   ├── commands/              # Command definitions
│   │   └── systemcc/         # Modular systemcc documentation
│   │       ├── 01-CRITICAL-DETECTION.md
│   │       ├── 02-LYRA-OPTIMIZATION.md
│   │       ├── 10-POST-REVIEW.md      # NEW: Review system
│   │       ├── 11-MEMORY-UPDATE.md    # NEW: Auto-updates
│   │       └── ... (11 total modules)
│   ├── agents/                # NEW: Code reviewers
│   │   ├── code-reviewer-senior.md
│   │   ├── code-reviewer-lead.md
│   │   └── code-reviewer-architect.md
│   ├── workflows/             # All workflow implementations
│   │   ├── anti-yolo-web/     # ASCII wireframing
│   │   ├── complete-system/   # 6-agent validation
│   │   ├── orchestrated/      # 3-agent streamlined
│   │   ├── phase-based/       # Large codebase handling
│   │   ├── agent-os/          # Project setup
│   │   ├── ai-dev-tasks/      # PRD-based development
│   │   └── post-execution-review/  # NEW: Triple review
│   └── middleware/            # AI optimization systems
│       └── memory-auto-updater.md  # NEW: Memory updates
├── CLAUDE.md                  # Your project's AI instructions
├── test-enhanced-system.sh    # NEW: Verify installation
└── ClaudeFiles/              # AI-generated content
    ├── memory/               # Learning and patterns
    │   ├── CLAUDE-activeContext.md
    │   ├── CLAUDE-patterns.md
    │   ├── CLAUDE-decisions.md
    │   ├── CLAUDE-troubleshooting.md
    │   └── CLAUDE-dont_dos.md     # NEW: User preferences
    ├── wireframes/           # ASCII wireframes (web projects)
    └── documentation/        # Generated docs and reports
```

### 🎯 Smart Context Management with Progressive Disclosure (v3.0)

The system automatically handles context size with intelligent progressive loading:

**Automatic Loading Levels:**
- **MINIMAL** (60% reduction) - Simple tasks load only headers & signatures
- **STANDARD** (30% reduction) - Medium tasks load summaries & key patterns
- **FULL** (0% reduction) - Complex tasks load complete documentation

**How It Works:**
```
Task: "fix button color" → MINIMAL loading (simple fix)
Task: "add user authentication" → STANDARD loading (new feature)
Task: "refactor authentication system" → FULL loading (complex change)
```

**Smart Features:**
- Analyzes task complexity automatically (no configuration)
- Upgrades loading level on-demand if more context needed
- Monitors context budget and optimizes in real-time
- Pattern-based pre-loading for related modules

**Project Size Handling:**

**Small Projects** (< 10,000 tokens)
- Loads entire codebase for full context
- Single-pass execution with complete awareness

**Medium Projects** (10,000 - 30,000 tokens)
- Strategic file loading based on task relevance
- Progressive loading reduces overhead by 30%
- Multi-pass execution with focused context windows

**Large Projects** (> 30,000 tokens)
- Automatic phase-based workflow activation
- Progressive loading + intelligent context switching
- Maintains consistency across large codebases
- Checkpoint system prevents context loss

### 🔄 Memory Bank System with Checkpoints (v3.0)

The system learns and remembers:

```
ClaudeFiles/memory/
├── CLAUDE-activeContext.md    # Session state + checkpoints (ENHANCED v3.0)
├── CLAUDE-patterns.md         # Your coding patterns
├── CLAUDE-decisions.md        # Architecture decisions made
├── CLAUDE-troubleshooting.md  # Solutions to past issues
├── CLAUDE-dont_dos.md         # What NOT to do
└── CLAUDE-temp.md            # Working scratch pad
```

**Enhanced Features (v3.0):**

**Checkpoint System:**
- **Auto-checkpoints** at phase transitions, before risky operations
- **Error checkpoints** when interruptions occur
- **Manual checkpoints** on user request or session end
- **Full state capture**: execution state, files, context, next steps

**Checkpoint Recovery:**
```bash
# Resume from last checkpoint
/systemcc "continue from last checkpoint"

# System automatically restores:
✓ Task state and progress
✓ Modified files list
✓ Next action items
✓ Full execution context
```

**Traditional Benefits:**
- **Consistency**: Follows your established patterns
- **Speed**: Doesn't re-analyze known project structure
- **Quality**: Learns from past mistakes and successes
- **Context**: Maintains session continuity across interruptions (NEW)
- **Preferences**: Remembers what you DON'T want (captured from corrections)
- **Recovery**: Resume from any interruption point (NEW)

## ✅ Installation Verification

After running the setup script, verify all components are installed:

```bash
./test-enhanced-system.sh
```

This checks for:
- Core directories and workflows
- Triple code review agents (Senior, Lead, Architect)
- Post-execution review system
- Memory bank files (including new dont_dos.md)
- All systemcc modules

If any components are missing, the script shows exactly what needs to be fixed.

## 🛠️ Available Commands

**Primary Command:**
- `/systemcc "your task"` - Does everything automatically (includes review + memory updates)
- `/systemcc --debug "your task"` - Show AI decision-making process
- `/systemcc --secure "task"` - Enhanced security scanning

**⚠️ Workflow Enforcement:** The `/systemcc` command's automated workflow (Lyra optimization → workflow selection → phase execution → review → memory update) is MANDATORY and cannot be skipped, ensuring consistent quality across all tasks.

**Utility Commands:**
- `/help` - Show all commands
- `/analyzecc` - Manual project analysis (first run auto-triggers this)

## 🤝 Contributing

This project represents collective wisdom from the Claude AI community. Contributions welcome!

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 🙏 Community-Driven

Built from real-world experiences shared by developers in r/ClaudeAI:

- [Anti-YOLO Method](https://www.reddit.com/r/ClaudeAI/comments/1n1941k/the_antiyolo_method_why_i_make_claude_draw_ascii/) - ASCII wireframing for web projects
- [Phase-based development](https://www.reddit.com/r/ClaudeAI/comments/1lw5oie/how_phasebased_development_made_claude_code_10x/) - Large codebase handling
- [Multi-agent workflows](https://www.reddit.com/r/ClaudeAI/comments/1lqn9ie/my_current_claude_code_sub_agents_workflow/) - Team-based development

**Agent OS Integration** adapted from [buildermethods.com/agent-os](https://buildermethods.com/agent-os)

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

**Made with ❤️ by the Claude AI Community**

*The Promise: Not just to code efficiently, but to code better. Ship quality code on the first try, not the fifth.*
