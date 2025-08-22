# Claude Agent System 🤖

Transform your AI coding assistant into a productive development partner. The Claude Agent System provides structured workflows that capture your standards, your stack, and the unique details of your codebase.

## 🚀 Quick Setup (One Command)

### Unix/Linux/macOS:
```bash
curl -sSL https://raw.githubusercontent.com/Kasempiternal/Claude-Agent-System/main/setup-claude-agent-system.sh | bash
```

### Windows (PowerShell):
```powershell
iwr -useb https://raw.githubusercontent.com/Kasempiternal/Claude-Agent-System/main/setup-claude-agent-system.ps1 | iex
```

## ✨ Key Features

### 🎯 Universal Entry Point: `/systemcc`
Just describe what you want to build - the system handles the rest:
```bash
/systemcc "implement user authentication with JWT"

# 🆕 NEW: Project Management Mode with CCPM Integration
/systemcc --pm "build complete e-commerce checkout system"
```
**NEW**: Now with Lyra AI prompt optimization and CCPM integration! Your requests are automatically enhanced for maximum clarity and complete code delivery, with optional parallel execution for 3x faster development.

### 🪄 Specialized Workflows Now Integrated

**🆕 CCPM Integration** - Parallel execution with GitHub/GitLab or local PM (automatic)
**Agent OS** - Professional project setup (automatic)
**AI Dev Tasks** - Build features with PRDs (automatic)
**Complete System** - 6-agent validation (automatic)
**Orchestrated** - Quick 3-agent workflow (automatic)
**Phase-Based** - Large context management (automatic)

### 🔍 Auto-Adaptation (Built-in)
The system automatically detects and adapts to your tech stack on first use - no manual commands needed!

### 🤖 Fully Automated Intelligence
- **Simple tasks** → Streamlined 3-agent workflow (automatic)
- **Complex features** → Comprehensive 6-agent system (automatic)
- **Large contexts** → Phase-based execution (automatic)
- **🆕 Parallel work** → CCPM integration with GitHub/GitLab (automatic)
- **Smart routing** → No manual decisions or commands needed

### 🧠 Context-Aware Execution
- Monitors token usage and project size
- Automatically switches to phase-based approach when needed
- Maintains quality in large codebases
- Reduces context usage by 60-80%

## 🎯 Usage - ONE Command for Everything

After setup, there's only **ONE** command you need to know:

```bash
/systemcc "describe what you want to build"
```

That's it! The system automatically:
- ✅ Analyzes your project (first time only)
- ✅ Optimizes your request with Lyra AI
- ✅ Selects the best workflow internally
- ✅ Executes everything end-to-end
- ✅ No more manual commands needed!

### Examples:
```bash
/systemcc "fix the login button color"           # → Auto-selected: Quick workflow
/systemcc "add user authentication system"       # → Auto-selected: Complete system
/systemcc "build analytics dashboard"            # → Auto-selected: AI Dev Tasks
/systemcc "refactor entire payment module"       # → Auto-selected: Phase-based

# 🆕 NEW: Project Management Mode (CCPM Integration)
/systemcc --pm "implement microservices architecture"  # → GitHub/GitLab parallel execution
/systemcc --pm "build real-time chat system"           # → Local PM if no Git hosting
```

## 🔍 Smart Codebase Analysis (First Run Only)

On first use, `/systemcc` automatically analyzes your project in **4-5 seconds**:

**🔧 What It Detects:**
- **Tech Stack**: Language, framework, dependencies (`package.json`, `requirements.txt`, etc.)
- **Conventions**: Naming patterns, file structure, testing approach
- **Commands**: Your actual `npm test`, `pytest`, `rails test` commands
- **Project Type**: Web app, API, AI/ML, mobile, etc.

**🧠 Smart Adaptation:**
- Uses YOUR build/test/lint commands automatically
- Follows YOUR naming conventions (PascalCase, snake_case, etc.)
- Speaks YOUR stack language (React hooks, Django views, Rails controllers)
- Remembers everything for future sessions (never repeats analysis)

**📚 Supports All Major Stacks:**
Python • JavaScript/TypeScript • Ruby • Java • Go • Rust • PHP • C#

## 🧠 /systemcc Intelligence Engine - Complete Thinking Tree

Here's the comprehensive decision-making process that happens when you invoke `/systemcc`:

```
User: /systemcc [--pm] "your task"
         │
         ▼
┌─────────────────────────────────────┐
│  1. MEMORY BANK INITIALIZATION      │
├─────────────────────────────────────┤
│ • Load ClaudeFiles/memory/*.md      │
│ • Restore previous context          │
│ • Check patterns & decisions        │
│ • Review troubleshooting database   │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  2. SECURITY PRE-SCAN (Optional)    │
├─────────────────────────────────────┤
│ IF --secure flag OR suspicious:     │
│ • Run PromptSecure-Ultra            │
│ • Decode Base64/URL/HTML/Unicode    │
│ • Check injection patterns          │
│   ├─ CRITICAL → Block execution 🛑  │
│   ├─ HIGH → Require confirmation ⚠️ │
│   └─ SAFE → Continue ✅             │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  3. FIRST-RUN DETECTION             │
├─────────────────────────────────────┤
│ Check: ClaudeFiles/.analysis-status │
│   ├─ NOT EXISTS:                    │
│   │  • Run project analysis         │
│   │  • Create .analysis-status      │
│   │  • Update memory bank           │
│   └─ EXISTS: Skip to next step      │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  4. LYRA AI PROMPT OPTIMIZATION     │
├─────────────────────────────────────┤
│ Apply 4-D Methodology:              │
│ • DECONSTRUCT - Extract intent      │
│ • DIAGNOSE - Find gaps              │
│ • DEVELOP - Add specifications      │
│ • DELIVER - Craft final prompt      │
│                                      │
│ Mode Selection:                      │
│   ├─ Simple task → BASIC mode       │
│   └─ Complex task → DETAIL mode     │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  5. 🆕 EXPLICIT PM FLAG CHECK        │
├─────────────────────────────────────┤
│ IF --pm flag explicitly provided:   │
│                                      │
│ Check Git Hosting:                   │
│ ├─ GitLab: glab cli + native Epics  │
│ ├─ GitHub: gh cli + extensions      │
│ └─ None: Local PM mode              │
│                                      │
│ → Skip to CCPM Integration ✨       │
│                                      │
│ ELSE:                                │
│   └─ Continue to standard analysis  │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  6. CONTEXT SIZE ANALYSIS           │
├─────────────────────────────────────┤
│ Check Current Context:               │
│ • Token count: [X] tokens           │
│ • Loaded files: [N] files           │
│ • Project size: [M] total files     │
│                                      │
│ Decision Points:                     │
│   ├─ > 30,000 tokens → Phase-based  │
│   ├─ > 10 files loaded → Phase-based│
│   └─ < Thresholds → Continue        │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  7. TASK COMPLEXITY ANALYSIS        │
├─────────────────────────────────────┤
│ Evaluate Task Characteristics:       │
│ • Scope: Single/Multi-file          │
│ • Type: Bug/Feature/Refactor        │
│ • Risk: Security/Breaking changes   │
│ • Time: Minutes/Hours estimate      │
│ • Parallel Potential: High/Med/Low  │
│                                      │
│ Complexity Score: [1-10]            │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  8. 🔄 RESTORED WORKFLOW MATRIX     │
├─────────────────────────────────────┤
│ PRIORITY 1: Context Override        │
│ ┌─────────────────────────┐         │
│ │ Context > 30k tokens OR │──→ PHASE│
│ │ Files loaded > 10       │    BASED│
│ └─────────────────────────┘         │
│                                      │
│ PRIORITY 2: Pattern Matching        │
│ ┌─────────────────────────┐         │
│ │ "setup", "initialize"   │──→ AGENT│
│ │ "standards", "project"  │    OS   │
│ └─────────────────────────┘         │
│                                      │
│ ┌─────────────────────────┐         │
│ │ "build", "feature"      │──→ AI   │
│ │ "product", "user story" │    DEV  │
│ └─────────────────────────┘         │
│                                      │
│ PRIORITY 3: Complexity Score        │
│ ┌─────────────────────────┐         │
│ │ Score > 5 OR High Risk  │──→ COMP │
│ │                         │    LETE │
│ └─────────────────────────┘         │
│                                      │
│ ┌─────────────────────────┐         │
│ │ Score < 4 & Low Risk    │──→ ORCH │
│ │                         │    ESTR │
│ └─────────────────────────┘         │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  9. 🆕 CCPM WORKFLOW EXECUTION      │
├─────────────────────────────────────┤
│ IF CCPM Selected:                    │
│                                      │
│ ┌─ GITLAB MODE (BEST!) ─────┐       │
│ │ Native Epic Creation →     │       │
│ │ Advanced Issue Boards →    │       │
│ │ Task Decomposition →       │       │
│ │ Parallel Agent Deployment →│       │
│ │ Superior Progress Tracking │       │
│ └────────────────────────────┘       │
│                                      │
│ ┌─ GITHUB MODE ─────────────┐       │
│ │ Environment Detection →    │       │
│ │ Epic Creation (extension) →│       │
│ │ Task Decomposition →       │       │
│ │ Parallel Agent Deployment →│       │
│ │ Real-time Progress Sync    │       │
│ └────────────────────────────┘       │
│                                      │
│ ┌─ LOCAL PM MODE ───────────┐       │
│ │ Local PM Structure →       │       │
│ │ Epic & Task Creation →     │       │
│ │ Parallel Simulation →      │       │
│ │ Progress Dashboard →       │       │
│ │ Velocity Analytics         │       │
│ └────────────────────────────┘       │
│                                      │
│ Expected: 3x speed improvement      │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  10. 💡 CCPM RECOMMENDATION CHECK   │
├─────────────────────────────────────┤
│ After workflow selection:            │
│                                      │
│ IF ccpm_would_be_beneficial():       │
│   ┌─ SHOW RECOMMENDATION ──┐        │
│   │ "This task has 3        │        │
│   │ independent components  │        │
│   │ that could benefit from │        │
│   │ parallel execution.     │        │
│   │                         │        │
│   │ Use CCPM? (y/n)"        │        │
│   └─────────┬───────────────┘        │
│             │                        │
│   ┌─ IF YES ▼───────────────┐        │
│   │ → Switch to CCPM        │        │
│   └─────────────────────────┘        │
│                                      │
│   ┌─ IF NO ─────────────────┐        │
│   │ → Continue with         │        │
│   │   selected workflow     │        │
│   └─────────────────────────┘        │
│                                      │
│ ELSE: Continue normally              │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  11. WORKFLOW EXECUTION             │
├─────────────────────────────────────┤
│ Execute Selected Workflow:           │
│                                      │
│ ┌─ CCPM INTEGRATION ────────┐       │
│ │ Environment Detection →    │       │
│ │ Epic Creation → Parallel   │       │
│ │ Execution → Progress Track │       │
│ └────────────────────────────┘       │
│                                      │
│ ┌─ AGENT OS ────────────────┐       │
│ │ Analyze→Architect→Build→  │       │
│ │ Document→Test→Deploy       │       │
│ └────────────────────────────┘       │
│                                      │
│ ┌─ AI DEV TASKS ────────────┐       │
│ │ Create PRD→Generate Tasks→ │       │
│ │ Process Each Task→Complete │       │
│ └────────────────────────────┘       │
│                                      │
│ ┌─ PHASE-BASED ─────────────┐       │
│ │ Decompose→Execute Phases→  │       │
│ │ Integrate→Validate         │       │
│ └────────────────────────────┘       │
│                                      │
│ ┌─ COMPLETE (6 Agents) ─────┐       │
│ │ PLANNER→EXECUTER→VERIFIER→│       │
│ │ TESTER→DOCUMENTER→UPDATER  │       │
│ └────────────────────────────┘       │
│                                      │
│ ┌─ ORCHESTRATED (3 Agents) ─┐       │
│ │ Orchestrator→Developer→    │       │
│ │ Reviewer→Complete          │       │
│ └────────────────────────────┘       │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  12. SMART USER INTERACTIONS        │
├─────────────────────────────────────┤
│ ONLY pause for:                      │
│ • Specifications needed              │
│ • Technical choices (DB type)       │
│ • Feature clarifications            │
│ • Missing context                   │
│ • 🆕 CCPM recommendations (y/n)     │
│                                      │
│ NEVER ask to run commands!          │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  13. MEMORY BANK UPDATE             │
├─────────────────────────────────────┤
│ After completion:                    │
│ • Update activeContext.md           │
│ • Document new patterns             │
│ • Record decisions made             │
│ • Add troubleshooting solutions     │
│ • 🆕 Update PM progress tracking    │
│ • Run memory-bank-synchronizer      │
└────────────┬────────────────────────┘
             │
             ▼
        ✅ TASK COMPLETE

```

### 📊 Decision Priority Hierarchy (Restored & Enhanced)

1. **🔴 CRITICAL OVERRIDE**: Security threats → Block immediately
2. **🟠 CONTEXT OVERRIDE**: >30k tokens → Force phase-based
3. **🟡 PATTERN MATCH**: Keywords found → Specific workflow
4. **🟢 COMPLEXITY SCORE**: Calculate → Select best fit
5. **🆕 💡 CCPM RECOMMENDATION**: Smart suggestions when beneficial
6. **🔵 DEFAULT**: When uncertain → Complete system

### 🎯 Corrected Workflow Selection Logic

```
IF security_risk == CRITICAL:
    → ABORT

ELIF --pm flag explicitly provided:
    → CCPM INTEGRATION (skip recommendation, go direct)
    IF gitlab_available:
        → CCPM GITLAB MODE (BEST experience - native Epics!)
    ELIF github_available:
        → CCPM GITHUB MODE (excellent experience with extensions)
    ELSE:
        → CCPM LOCAL MODE (parallel simulation)

ELIF context_tokens > 30000 OR files_loaded > 10:
    → PHASE-BASED (/taskit)

ELIF keywords in ["setup", "initialize", "standards"]:
    → AGENT OS (/agetos)

ELIF keywords in ["build", "feature", "product"]:
    → AI DEV TASKS (/aidevtasks)

ELIF complexity_score > 5 OR risk == HIGH:
    → COMPLETE SYSTEM (6 agents)

ELIF complexity_score < 4 AND risk == LOW:
    → ORCHESTRATED (3 agents)

ELSE:
    → COMPLETE SYSTEM (default safe choice)

# 💡 CCPM SMART RECOMMENDATIONS (After workflow selection)
IF ccpm_would_be_beneficial(task_analysis):
    → SHOW RECOMMENDATION PROMPT
    → ASK USER CONFIRMATION
    → IF YES: Switch to CCPM
    → IF NO: Continue with selected workflow
```

### 🆕 CCPM Smart Recommendations

**CCPM Automatically Activates when:**
- `--pm` flag is explicitly used (no questions asked)

**CCPM Gets Recommended when:**
- Complexity score >6 AND estimated time >60 minutes
- Multiple independent components (3+) detected
- Keywords: "parallel", "concurrent", "multiple systems"
- High parallel potential identified

**User Always Chooses:**
```
💡 CCPM RECOMMENDATION:
This task has 3 independent components that could benefit from 
parallel execution and project management tracking.

Benefits: 3x faster development, better progress tracking

Do you want to use CCPM for this task? (y/n)
If no, I'll use the standard [WorkflowName] workflow.
```

**Git Hosting Support:**
- **🦊 GitLab**: Full integration with native Epics and Issue Boards (SUPERIOR experience!)
- **🐙 GitHub**: Full integration with Issues and gh-sub-issue extension  
- **📁 None**: Local PM system with 60-70% of CCPM benefits

**🎯 GitLab Answer**: If user has GitLab instead of GitHub, CCPM falls back to Local PM mode (60-70% of benefits through local project management system).

### 🔍 Corrected Decision Factors

| Factor | Weight | Triggers |
|--------|--------|----------|
| **Context Size** | 40% | >30k tokens = Phase-based |
| **Task Keywords** | 30% | Specific patterns = Specific workflow |
| **Complexity Score** | 20% | 1-3: Simple, 4-6: Medium, 7-10: Complex |
| **Security Risk** | 10% | Any risk = More validation |
| **🆕 CCPM Recommendations** | Post-Selection | Smart suggestions when beneficial |
| **🆕 --pm Flag** | Override | Direct to CCPM (no questions) |

## 🏗️ Enhanced System Architecture

The Claude Agent System now includes **seven workflow modes**:

### 🆕 CCPM Integration (NEW!)
For parallel execution and project management:

**🦊 GitLab Mode (BEST Experience!):**
- **Native Epic Creation** - Built-in Epic functionality (superior to GitHub)
- **Advanced Issue Boards** - Professional project management
- **Issue Hierarchy** - Epic → Issue → Task relationships
- **Multi-Agent Deployment** - True parallel execution
- **Superior Tracking** - Real-time progress via native features
- **Result**: 3x faster development + best UX

**🐙 GitHub Mode:**
- **Epic Creation** - Structured feature breakdown via extensions
- **Task Decomposition** - Parallel-safe work units
- **Multi-Agent Deployment** - True parallel execution
- **Real-time Sync** - Progress tracking via Issues
- **Result**: 3x faster development

**📁 Local PM Mode:**
- **Epic Management** - Comprehensive PRD creation
- **Task Simulation** - Parallel execution simulation
- **Progress Dashboard** - Real-time status tracking
- **Velocity Analytics** - Performance measurements
- **Result**: 60-70% efficiency improvement

### Complete System (6 Agents)
For complex, multi-file changes:
1. **PLANNER** - Strategic analysis
2. **EXECUTER** - Implementation
3. **VERIFIER** - Quality checks
4. **TESTER** - Validation
5. **DOCUMENTER** - Knowledge capture
6. **UPDATER** - Version control

### Orchestrated Workflow (3 Agents)
For simple, focused tasks:
- **Orchestrator** - Coordination
- **Developer** - Implementation
- **Reviewer** - Quality assurance

### Phase-Based Execution
For very large or complex tasks:
- Breaks work into focused phases
- Maintains context quality
- Enables massive refactoring

### Agent OS Integration
For project setup and standards:
- **Analyzer** - Project assessment
- **Architect** - Standards design
- **Builder** - Implementation
- **Documenter** - Knowledge capture

### AI Dev Tasks
For PRD-based feature development:
- **PRD Creation** - Requirements gathering
- **Task Generation** - Work breakdown
- **Implementation** - Feature building

## 📁 What Gets Installed

```
your-project/
├── .claude/                    # Agent system (git-ignored)
│   ├── commands/              # Available commands
│   ├── complete-system/       # 6-agent workflow
│   ├── orchestrated-only/     # 3-agent workflow
│   ├── phase-based-workflow/  # Phase execution
│   ├── 🆕 ccmp-integration/   # CCPM workflow system
│   ├── agent-os/              # Project setup workflow
│   └── ai-dev-tasks/          # PRD-based development
├── CLAUDE.md                  # Project config
├── 🆕 .github/ISSUE_TEMPLATE/ # GitHub integration (if GitHub)
│   ├── ccpm-epic.md           # Epic issue template
│   └── ccpm-task.md           # Task issue template
└── ClaudeFiles/              # AI-generated files
    ├── memory/               # Memory bank system
    ├── workflows/            # Workflow outputs
    ├── 🆕 pm/                # Project management
    │   ├── epics/           # Epic definitions
    │   ├── issues/          # Task tracking
    │   ├── progress/        # Analytics
    │   └── dashboard.md     # Live status
    └── documentation/        # All documentation
```

## 🛠️ Available Commands

### Primary Command (All You Need):
- **`/systemcc`** - Universal entry point that handles EVERYTHING automatically
- **🆕 `/systemcc --pm`** - Project Management mode with CCPM integration

### Internal Workflows (Auto-Selected by /systemcc):
- **🆕 CCPM Integration** - Parallel execution with GitHub/GitLab or local PM
- Agent OS - Project setup and standards
- AI Dev Tasks - PRD-based feature development  
- Phase-Based - Large context management
- Complete System - 6-agent validation
- Orchestrated - Quick 3-agent execution

### Utility Commands:
- `/help` - Show all commands
- `/analyzecc` - Manual project analysis (rarely needed)
- **🆕 `/systemcc --pm --dashboard`** - Refresh PM dashboard (when using CCPM)

## 🚀 Supported Tech Stacks

The system automatically adapts to:
- **Python**: AI/ML, Django, Flask, FastAPI
- **JavaScript**: React, Vue, Angular, Node.js
- **Ruby**: Rails, Sinatra
- **Java**: Spring, Maven, Gradle
- **Go**: Gin, Echo, Fiber
- **Rust**: Cargo, Actix, Rocket
- **PHP**: Laravel, Symfony
- **C#**: .NET Core, ASP.NET

## 🌟 Why Claude Agent System?

1. **One Command Does Everything** - No need to learn multiple commands
2. **Fully Automated** - Smart workflow selection and execution
3. **Quality First** - Built-in best practices and validation
4. **Context Efficient** - Handles large codebases intelligently
5. **Stack Aware** - Auto-adapts to your tech stack
6. **Community Driven** - Best practices from r/ClaudeAI

## 🤝 Contributing

This project represents collective wisdom from the Claude AI community. Contributions are welcome!

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 🙏 Acknowledgments

### Community-Driven Development
This system was born from real-world experiences and insights shared by the Claude AI community on Reddit. Special thanks to the following discussions that shaped this project:

- [Insights after one month of Claude Code max usage](https://www.reddit.com/r/ClaudeAI/comments/1msk88r/insights_after_one_month_of_claude_code_max/) - Real-world usage patterns and optimization strategies
- [My current Claude Code sub-agents workflow](https://www.reddit.com/r/ClaudeAI/comments/1lqn9ie/my_current_claude_code_sub_agents_workflow/) - Multi-agent workflow foundations
- [How phase-based development made Claude Code 10x better](https://www.reddit.com/r/ClaudeAI/comments/1lw5oie/how_phasebased_development_made_claude_code_10x/) - Phase-based execution methodology
- [How we 10x'd our dev speed with Claude Code](https://www.reddit.com/r/ClaudeAI/comments/1mc80q8/how_we_10xd_our_dev_speed_with_claude_code_and/) - Performance optimization techniques
- [20 years of software engineering experience with Claude](https://www.reddit.com/r/ClaudeAI/comments/1m1efu0/as_an_software_egineer_with_20_years_of_experience/) - Professional development patterns

What started as a personal compilation test evolved into a daily-use tool through the collective wisdom of experienced developers sharing their workflows and discoveries.

### Agent OS Integration
The Agent OS framework integrated into this system comes from:
- **Original Source**: [buildermethods.com/agent-os](https://buildermethods.com/agent-os)
- **Tutorial**: [YouTube - Agent OS Walkthrough](https://www.youtube.com/watch?v=CTMyzeKKb0o&t)
- **Note**: We've adapted Agent OS to work seamlessly with our multi-agent system, including modifications for language-agnostic support and integration with our `/analyzecc` command.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🔗 Links

- [Repository](https://github.com/Kasempiternal/Claude-Agent-System)
- [Issues](https://github.com/Kasempiternal/Claude-Agent-System/issues)
- [Discussions](https://github.com/Kasempiternal/Claude-Agent-System/discussions)

---

## 💡 Key Insight

**The system evolved from manual multi-agent commands to full automation.** 

**Before**: Users had to run `/analyze`, `/planner`, `/executer`, `/verifier`, etc. manually  
**Now**: Just use `/systemcc "your goal"` and everything happens automatically!

**Remember**: The goal is not just to code faster, but to code better. Ship quality code on the first try, not the fifth.

*Made with ❤️ by the Claude AI Community*

![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/Kasempiternal/Claude-Agent-System?utm_source=oss&utm_medium=github&utm_campaign=Kasempiternal%2FClaude-Agent-System&labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews)