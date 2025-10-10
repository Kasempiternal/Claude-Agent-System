# Claude Agent System

**Turn Claude into your personal development team.** One command handles everything - from planning through implementation to deployment, with automatic code review and continuous learning.

**Current Version:** 2.1.0 | [View Changelog](CHANGELOG.md)

## 🎉 What's New in v2.1.0

### Build Configuration Auto-Detection (NEW)
The system now automatically detects and applies your project's build rules:
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

### Enhanced Analysis Engine
Upgraded from 5 to **8 dimensions**:
- Added: Code Minimalism (modify vs create)
- Added: Security Sensitivity (auth/database detection)
- Added: Pattern Reusability (leverage existing code)

[See full changelog →](CHANGELOG.md)

---

## 🚀 Quick Setup

**One command installs everything (macOS/Linux):**

```bash
curl -sSL https://raw.githubusercontent.com/Kasempiternal/Claude-Agent-System/main/setup-claude-agent-system.sh | bash
```

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

# Project management mode
/systemcc --pm "build e-commerce checkout system"  
# ↳ Creates GitHub/GitLab issues → Parallel development

# Force batch optimization (NEW)
/systemcc --batch "create CRUD for users, posts, comments"
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
The system analyzes your request across 8 dimensions:
1. **Code Minimalism** - Can we modify existing code vs creating new?
2. **Technical Complexity** - Algorithm sophistication, API integrations
3. **Scope Impact** - Files affected, system-wide changes
4. **Risk Assessment** - Breaking changes, security implications
5. **Context Load** - Memory usage, token requirements
6. **Time Pressure** - Urgency indicators, deadline sensitivity
7. **Security Sensitivity** - Authentication, database, encoding operations
8. **Pattern Reusability** - Existing patterns to leverage

Then automatically picks the right workflow. No manual selection needed.

**Supports all major languages and frameworks**

## The Decision Engine - How It Actually Works

Here's what happens when you run `/systemcc`:

```
User: /systemcc [--pm] [--debug] [--secure] "your request"
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
│  🏃 EXPLICIT FLAG PROCESSING        │
├─────────────────────────────────────┤
│ Check command flags:                │
│                                     │
│ IF --pm flag explicitly provided:   │
│   🚀 CCPM INTEGRATION MODE          │
│   │                                 │
│   ├─ Detect Git hosting:            │
│   │  ├─ GitLab: glab CLI + native Epics │
│   │  ├─ GitHub: gh CLI + extensions │
│   │  └─ None: Local PM mode         │
│   │                                 │
│   ├─ Analyze parallel potential:    │
│   │  • Independent task components  │
│   │  • Estimated time savings      │
│   │  • Resource requirements       │
│   │                                 │
│   └─ → Skip to CCPM Execution ✨   │
│                                     │
│ ELSE: Continue to standard analysis │
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
│  🧮 8-DIMENSIONAL ANALYSIS ENGINE   │
├─────────────────────────────────────┤
│ Score task across eight dimensions: │
│                                     │
│ 1️⃣ CODE MINIMALISM [0.0-1.0]:      │
│    • Modify vs create analysis      │
│    • Existing code leverage         │
│    • Minimal change approach        │
│    Keywords: "fix", "update",       │
│             "modify", "change"      │
│                                     │
│ 2️⃣ TECHNICAL COMPLEXITY [0.0-1.0]: │
│    • Algorithm sophistication       │
│    • API integration requirements   │
│    • Framework-specific patterns    │
│    • Database schema changes        │
│    • Security implementation        │
│    Keywords: "algorithm", "API", "auth", │
│             "security", "crypto"    │
│                                     │
│ 3️⃣ SCOPE IMPACT [0.0-1.0]:         │
│    • File modification prediction   │
│    • Cross-service dependencies     │
│    • Integration touchpoints        │
│    • Breaking change potential      │
│    Keywords: "refactor", "system",  │
│             "architecture", "migrate"│
│                                     │
│ 4️⃣ RISK ASSESSMENT [0.0-1.0]:      │
│    • Data integrity risks           │
│    • Security vulnerability intro   │
│    • Performance impact potential   │
│    • Production stability risk      │
│    Keywords: "critical", "production", │
│             "database", "payment"   │
│                                     │
│ 5️⃣ CONTEXT LOAD [0.0-1.0]:         │
│    • Token requirement estimation   │
│    • Memory usage prediction        │
│    • Processing complexity          │
│    • Multi-file coordination needs  │
│                                     │
│ 6️⃣ TIME PRESSURE [0.0-1.0]:        │
│    • Urgency keyword detection      │
│    • Deadline sensitivity           │
│    • Critical path identification   │
│    Keywords: "urgent", "ASAP", "fix", │
│             "broken", "down"        │
│                                     │
│ 7️⃣ SECURITY SENSITIVITY [0.0-1.0]: │
│    • Authentication/authorization   │
│    • Database operations            │
│    • Data encoding/decoding         │
│    • API security requirements      │
│    Keywords: "auth", "login", "jwt", │
│             "password", "encrypt"   │
│                                     │
│ 8️⃣ PATTERN REUSABILITY [0.0-1.0]:  │
│    • Existing pattern detection     │
│    • Code reuse opportunities       │
│    • Historical success patterns    │
│    • Team conventions leverage      │
│                                     │
│ Enhanced Pattern Recognition:       │
│ • Historical success patterns       │
│ • Tech stack-specific adjustments   │
│ • User preference weighting         │
│ • Error pattern avoidance           │
│                                     │
│ Final Composite Score: [0.0-1.0]    │
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
┌─────────────────────────────────────┐
│  💡 CCPM SMART RECOMMENDATIONS     │
├─────────────────────────────────────┤
│ Post-selection parallel analysis:   │
│                                     │
│ Parallel Benefit Calculator:        │
│ • Independent task components: [N]   │
│ • Estimated serial time: [T] mins   │
│ • Parallel potential: [P] factor    │
│ • Resource availability check       │
│                                     │
│ Recommendation Triggers:            │
│ ├─ Complexity score > 6 AND time > 60min │
│ ├─ Independent components ≥ 3       │
│ ├─ Keywords: "parallel", "concurrent" │
│ └─ Multi-system integration detected│
│                                     │
│ IF parallel_benefit > 0.65:         │
│ ┌─────────────────────────────────┐ │
│ │ 💡 SHOW SMART RECOMMENDATION:   │ │
│ │                                 │ │
│ │ "This task has [N] independent  │ │
│ │  components that could benefit  │ │
│ │  from batch optimization.        │ │
│ │                                 │ │
│ │  Expected benefits:             │ │
│ │  • Reduced tool switching      │ │
│ │  • Better progress tracking     │ │
│ │  • Parallel quality assurance  │ │
│ │                                 │ │
│ │  Switch to CCPM? (y/n)"         │ │
│ │                                 │ │
│ │  ├─ YES → 🚀 Switch to CCPM     │ │
│ │  └─ NO → Continue selected      │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ELSE: Execute selected workflow     │
└────────────┬────────────────────────┘
             │
             ▼
        🚀 WORKFLOW EXECUTION
             │
   ┌─────────┼─────────┐
   ▼         ▼         ▼
┌─────┐ ┌─────┐ ┌─────────┐
│CCMP │ │ANTI │ │STANDARD │
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

### 🚀 Project Management Integration (CCPM)

For larger projects, use the `--pm` flag to activate Critical Chain Project Management:

```bash
/systemcc --pm "build e-commerce checkout system"

🔍 Analyzing project scope...
📋 Creating Epic: E-commerce Checkout System
   ├─ Issue #1: Payment gateway integration
   ├─ Issue #2: Shopping cart state management  
   ├─ Issue #3: Checkout form validation
   └─ Issue #4: Order confirmation system

🚀 Deploying parallel agents to GitHub Issues...
📈 Expected completion: More efficient with batch optimization
```

**Git Platform Support:**
- **GitLab**: Native Epics + Issue Boards (best experience!)
- **GitHub**: Issues + Epic extensions
- **Local**: Built-in project management system

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

### 🧠 8-Dimensional Task Analysis
Behind the simple `/systemcc` command, the system evaluates every request across eight dimensions:

```
📊 ANALYSIS DIMENSIONS:
├─ Code Minimalism: Modify vs create, minimal changes
├─ Technical Complexity: Algorithm sophistication, API integrations
├─ Scope Impact: Files affected, system-wide changes
├─ Risk Assessment: Breaking changes, security implications
├─ Context Load: Memory usage, token requirements
├─ Time Pressure: Urgency indicators, deadline sensitivity
├─ Security Sensitivity: Auth, database, encoding operations
└─ Pattern Reusability: Existing patterns to leverage
```

**Smart Pattern Recognition:**
- Learns from your past projects and preferences
- Adapts to your tech stack conventions automatically
- Improves workflow selection through usage feedback
- Remembers your testing patterns and coding style

### 🔍 Debug Mode - See the AI's Thinking

Want to understand how the system made its decision? Use debug mode:

```bash
/systemcc --debug "add user authentication"

🧠 ANALYSIS RESULTS:
├─ Complexity Score: 8.2/10 (High - JWT, OAuth, password hashing)
├─ Scope Impact: 7.5/10 (Multiple files: auth, middleware, database)
├─ Risk Level: 6.8/10 (Security-critical functionality)
├─ Context Load: 5.2/10 (Medium - manageable token usage)
└─ Time Pressure: 3.0/10 (No urgency keywords detected)

🎯 DECISION: Complete 6-Agent System
   Confidence: 94% (High complexity + security risk)
   Alternative considered: AI Dev Tasks (72% confidence)

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
    ├── pm/                   # Project management (CCPM mode)
    └── documentation/        # Generated docs and reports
```

### 🎯 Smart Context Management

The system automatically handles context size to prevent token overflow:

**Small Projects** (< 10,000 tokens)
- Loads entire codebase for full context
- Single-pass execution with complete awareness

**Medium Projects** (10,000 - 30,000 tokens) 
- Strategic file loading based on task relevance
- Multi-pass execution with focused context windows

**Large Projects** (> 30,000 tokens)
- Automatic phase-based workflow activation
- Intelligent context switching between phases
- Maintains consistency across large codebases

### 🔄 Memory Bank System

The system learns and remembers:

```
ClaudeFiles/memory/
├── CLAUDE-activeContext.md    # Current session state
├── CLAUDE-patterns.md         # Your coding patterns
├── CLAUDE-decisions.md        # Architecture decisions made
├── CLAUDE-troubleshooting.md  # Solutions to past issues
├── CLAUDE-dont_dos.md         # What NOT to do (NEW)
└── CLAUDE-temp.md            # Working scratch pad
```

This enables:
- **Consistency**: Follows your established patterns
- **Speed**: Doesn't re-analyze known project structure
- **Quality**: Learns from past mistakes and successes
- **Context**: Maintains session continuity
- **Preferences**: Remembers what you DON'T want (captured from corrections)

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
- `/systemcc --pm "your task"` - Project management mode
- `/systemcc --debug "your task"` - Show AI decision-making process

**⚠️ Workflow Enforcement:** The `/systemcc` command's automated workflow (Lyra optimization → workflow selection → phase execution → review → memory update) is MANDATORY and cannot be skipped, ensuring consistent quality across all tasks.

**Utility Commands:**
- `/help` - Show all commands
- `/analyzecc` - Manual project analysis (first run auto-triggers this)

**Advanced Options:**
- `/systemcc --secure "task"` - Enhanced security scanning
- `/systemcc --pm --dashboard` - Refresh project management dashboard

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
