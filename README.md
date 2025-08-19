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
```
**NEW**: Now with Kase AI prompt optimization! Your requests are automatically enhanced for maximum clarity and complete code delivery.

### 🪄 Specialized Workflows Now Integrated

**Agent OS** - Professional project setup:
```bash
/agetos init  # Complete project initialization
```

**AI Dev Tasks** - Build features with PRDs:
```bash
/aidevtasks "build notification system"  # Structured development
```

### 🔍 Auto-Adaptation: `/analyzecc`
Detects and adapts to your tech stack:
```bash
/analyzecc  # Auto-configures for your language/framework
```

### 📊 Intelligent Workflow Selection
- **Simple tasks** → Streamlined 3-agent workflow
- **Complex features** → Comprehensive 6-agent system
- **Large contexts** → Phase-based execution
- **Automatic routing** → No manual decisions needed

### 🧠 Context-Aware Execution
- Monitors token usage and project size
- Automatically switches to phase-based approach when needed
- Maintains quality in large codebases
- Reduces context usage by 60-80%

## 🎯 Usage

After setup, you have two main commands:

### 1. Analyze Your Project (First Time)
```bash
/analyzecc
```
This adapts the system to your specific tech stack.

### 2. Start Building
```bash
/systemcc "what you want to build"
```
The system automatically selects the best workflow.

## 🔄 /systemcc Decision Flow - Complete Cascade

Here's the complete decision-making cascade that happens when you invoke `/systemcc`:

```
User: /systemcc "your task"
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
│  4. KASE AI PROMPT OPTIMIZATION     │
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
│  5. CONTEXT SIZE ANALYSIS           │
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
│  6. TASK COMPLEXITY ANALYSIS        │
├─────────────────────────────────────┤
│ Evaluate Task Characteristics:       │
│ • Scope: Single/Multi-file          │
│ • Type: Bug/Feature/Refactor        │
│ • Risk: Security/Breaking changes   │
│ • Time: Minutes/Hours estimate      │
│                                      │
│ Complexity Score: [1-10]            │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  7. WORKFLOW SELECTION MATRIX       │
├─────────────────────────────────────┤
│ Pattern Detection & Routing:         │
│                                      │
│ ┌─────────────────────────┐         │
│ │ Keywords Found?          │         │
│ └────────┬────────────────┘         │
│          │                           │
│   ┌──────▼──────┐                   │
│   │ "setup"     │──→ AGENT OS       │
│   │ "initialize"│    (/agetos)      │
│   │ "standards" │                   │
│   └─────────────┘                   │
│                                      │
│   ┌─────────────┐                   │
│   │ "build"     │──→ AI DEV TASKS   │
│   │ "feature"   │    (/aidevtasks)  │
│   │ "product"   │                   │
│   └─────────────┘                   │
│                                      │
│   ┌─────────────┐                   │
│   │ Context     │──→ PHASE-BASED    │
│   │ > 30k tokens│    (/taskit)      │
│   │ > 5 modules │                   │
│   └─────────────┘                   │
│                                      │
│   ┌─────────────┐                   │
│   │ Complexity  │──→ COMPLETE       │
│   │ Score > 5   │    (6 agents)     │
│   │ High risk   │                   │
│   └─────────────┘                   │
│                                      │
│   ┌─────────────┐                   │
│   │ Simple task │──→ ORCHESTRATED   │
│   │ Score < 4   │    (3 agents)     │
│   │ Low risk    │                   │
│   └─────────────┘                   │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  8. USER CONFIRMATION               │
├─────────────────────────────────────┤
│ Display Analysis:                    │
│ • Task: [description]                │
│ • Complexity: [High/Med/Low]        │
│ • Workflow: [selected]              │
│ • Reason: [why this workflow]       │
│                                      │
│ "Ready to proceed? (yes/adjust)"    │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  9. WORKFLOW EXECUTION              │
├─────────────────────────────────────┤
│ Selected Workflow Runs:              │
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
│  10. SMART USER INTERACTIONS        │
├─────────────────────────────────────┤
│ ONLY pause for:                      │
│ • Specifications needed              │
│ • Technical choices (DB type)       │
│ • Feature clarifications            │
│ • Missing context                   │
│                                      │
│ NEVER ask to run commands!          │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  11. MEMORY BANK UPDATE             │
├─────────────────────────────────────┤
│ After completion:                    │
│ • Update activeContext.md           │
│ • Document new patterns             │
│ • Record decisions made             │
│ • Add troubleshooting solutions     │
│ • Run memory-bank-synchronizer      │
└────────────┬────────────────────────┘
             │
             ▼
        ✅ TASK COMPLETE

```

### 📊 Decision Priority Hierarchy

1. **🔴 CRITICAL OVERRIDE**: Security threats → Block immediately
2. **🟠 CONTEXT OVERRIDE**: >30k tokens → Force phase-based
3. **🟡 PATTERN MATCH**: Keywords found → Specific workflow
4. **🟢 COMPLEXITY SCORE**: Calculate → Select best fit
5. **🔵 DEFAULT**: When uncertain → Complete system

### 🎯 Workflow Selection Logic

```
IF security_risk == CRITICAL:
    → ABORT

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
```

### 🔍 Key Decision Factors

| Factor | Weight | Triggers |
|--------|--------|----------|
| **Context Size** | 40% | >30k tokens = Phase-based |
| **Task Keywords** | 30% | Specific patterns = Specific workflow |
| **Complexity Score** | 20% | 1-3: Simple, 4-6: Medium, 7-10: Complex |
| **Security Risk** | 10% | Any risk = More validation |

## 🏗️ System Architecture

The Claude Agent System includes three workflow modes:

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

## 📁 What Gets Installed

```
your-project/
├── .claude/                    # Agent system (git-ignored)
│   ├── commands/              # Available commands
│   ├── complete-system/       # 6-agent workflow
│   ├── orchestrated-only/     # 3-agent workflow
│   └── phase-based-workflow/  # Phase execution
├── CLAUDE.md                  # Project config
└── ClaudeFiles/              # AI-generated files
```

## 🛠️ Available Commands

- `/systemcc` - Universal entry point (RECOMMENDED)
- `/analyzecc` - Adapt to your tech stack
- `/taskit` - Phase-based execution
- `/orchestrated` - Simple workflow
- `/help` - Show all commands

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

1. **Zero Configuration** - Works with any project
2. **Quality First** - Built-in best practices
3. **Context Efficient** - Handles large codebases
4. **Stack Aware** - Speaks your language
5. **Community Driven** - Best practices from r/ClaudeAI

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

**Remember**: The goal is not just to code faster, but to code better. Ship quality code on the first try, not the fifth.

*Made with ❤️ by the Claude AI Community*

![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/Kasempiternal/Claude-Agent-System?utm_source=oss&utm_medium=github&utm_campaign=Kasempiternal%2FClaude-Agent-System&labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews)