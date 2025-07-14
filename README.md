# Claude Agent System 🤖

A comprehensive multi-agent workflow system for AI-assisted development with Claude Code. Features intelligent context management, automatic workflow selection, and phase-based execution for complex tasks.

> A curated collection and customization of innovative Claude AI workflows, patterns, and methodologies discovered on the Claude AI Reddit community. This repository represents the best practices and creative solutions developed by the community for working effectively with Claude.

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

### 1. **Automatic Workflow Selection** (`/systemcc`)
- Analyzes task complexity and context size
- Automatically routes to the best workflow
- No manual decision-making needed

### 2. **Context-Aware Execution**
- Detects when context is getting large (>30k tokens)
- Automatically switches to phase-based approach
- Maintains quality in large codebases

### 3. **Phase-Based Development** (`/taskit`)
- Breaks complex tasks into focused phases
- Reduces context usage by 60-80%
- Prevents quality degradation

### 4. **Multiple Workflow Options**
- **Complete System**: 6-agent workflow for complex tasks
- **Orchestrated**: 3-agent workflow for simple tasks
- **Phase-Based**: For very complex or large-context tasks

### 5. **Agent Specialization**
Each agent has a specific role and responsibility, ensuring focused expertise:
- **PLANNER**: Root cause analysis and solution architecture
- **EXECUTER**: Clean code implementation
- **VERIFIER**: Quality and compliance checking
- **TESTER**: Functional validation
- **DOCUMENTER**: Knowledge capture
- **UPDATER**: Version control management

### 6. **Quality Gates**
Built-in checkpoints prevent common issues:
- Type safety verification
- Error handling validation
- Accessibility compliance
- Performance optimization
- Security best practices

## 🎯 Usage

After setup, just use:
```
/systemcc "describe what you want to build"
```

The system automatically:
- ✅ Analyzes your task
- ✅ Checks context size
- ✅ Evaluates project scale
- ✅ Selects optimal workflow

### Examples

```bash
# Simple fix (auto-selects orchestrated workflow)
/systemcc "fix typo in header"

# Complex feature (auto-selects complete system)
/systemcc "implement OAuth authentication"

# Large refactoring (auto-selects phase-based)
/systemcc "refactor all API endpoints to new pattern"
```

### Manual Workflow Selection

**For Complex Tasks** (multi-file changes, architecture decisions, critical features):
```bash
/planner "implement OAuth authentication system"
/executer
/verifier
/tester
/documenter
/updater
```

**For Simple Tasks** (bug fixes, minor features, single-file changes):
```bash
/orchestrated "add dark mode toggle to header"
```

**Alternative: EPCT Workflow** (Explore, Plan, Code, Test):
```bash
/epct "refactor database connection logic"
# Follows a four-phase approach: Explore → Plan → Code → Test
```

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Task Complexity Analysis                  │
└────────────────┬───────────────────┬────────────────────────┘
                 │                   │
        Complex Tasks           Simple Tasks
                 │                   │
                 ▼                   ▼
┌─────────────────────────┐ ┌──────────────────────┐
│   Complete System       │ │  Orchestrated Only   │
│   (6 Agents)           │ │   (3 Agents)         │
├─────────────────────────┤ ├──────────────────────┤
│ 1. PLANNER             │ │ • Agent O (Orchestr) │
│ 2. EXECUTER            │ │ • Agent D (Dev)      │
│ 3. VERIFIER            │ │ • Agent R (Review)   │
│ 4. TESTER              │ └──────────────────────┘
│ 5. DOCUMENTER          │
│ 6. UPDATER             │
└─────────────────────────┘
```

## 📁 What Gets Installed

```
your-project/
├── .claude/                    # Agent system files (git-ignored)
│   ├── commands/              # All command implementations
│   ├── complete-system/       # 6-agent workflow docs
│   ├── orchestrated-only/     # 3-agent workflow docs
│   ├── phase-based-workflow/  # Phase-based execution
│   └── QUICK_START.md        # Quick reference
└── CLAUDE.md                  # Project configuration
```

## 🛠️ Available Commands

- `/systemcc` - Universal entry point (RECOMMENDED)
- `/taskit` - Force phase-based execution
- `/orchestrated` - Force simple workflow
- `/planner` → `/executer` → `/verifier` → `/tester` → `/documenter` → `/updater` - Complete system
- `/epct` - Explore, Plan, Code, Test workflow
- `/help` - Show all commands

## 🧠 How It Works

### Context Management
The system monitors:
- Current conversation token count
- Number of loaded files
- Project size (file count)
- Task complexity

When context exceeds thresholds, it automatically uses phase-based execution to maintain quality.

### Workflow Selection Logic
```
IF context > 30k tokens OR files > 10 → Phase-based (/taskit)
ELIF estimated_time > 60 min → Phase-based (/taskit)
ELIF complexity_score > 5 → Complete System
ELSE → Orchestrated
```

### Decision Matrix

| Criteria | Complete System | Orchestrated |
|----------|----------------|--------------|
| Files affected | Multiple | Single |
| Architecture changes | Yes | No |
| Risk level | High | Low |
| Time estimate | >30 min | <30 min |
| Testing needs | Comprehensive | Basic |
| Documentation | Extensive | Minimal |

## 🛠️ Example Use Cases

### Complex Task Example: E-commerce Checkout System
```bash
/planner "Design and implement a secure checkout flow with payment processing"
# Creates detailed WORK.md with phases for:
# - Payment gateway integration
# - Security implementation
# - User flow design
# - Error handling
# - Testing strategy

/executer  # Implements based on Phase 1
/verifier  # Ensures PCI compliance, security standards
/tester    # Tests all payment scenarios
/documenter # Captures payment patterns for reuse
/updater   # Commits with detailed change log
```

### Simple Task Example: Add Loading Spinner
```bash
/orchestrated "Add loading spinner to data fetch operations"
# Orchestrated workflow handles:
# - Component creation
# - Integration
# - Basic testing
# - Commit
```

## 📚 Documentation

- [Setup Guide](SETUP.md) - Detailed setup instructions
- [Command Examples](commands/examples.md) - Real-world usage examples
- [Phase-Based Workflow](phase-based-workflow/README.md) - Deep dive into phases
- [System Overview](README-AGENT-SYSTEM.md) - Complete system documentation
- **Complete System Guide**: See `complete-system/claude-agents-workflow.md` for detailed agent descriptions
- **Setup Instructions**: Check `claude-code-setup-guide.md` for configuring Claude Code
- **Workflow Selection**: Read `README-AGENT-SYSTEM.md` for detailed decision criteria

## 🌍 Community and Contributing

This repository is a living collection of community wisdom from r/ClaudeAI. We welcome contributions that enhance these workflows or add new patterns.

### How to Contribute
1. Test your workflow patterns thoroughly
2. Document with clear examples
3. Follow existing formatting conventions
4. Submit via pull request with detailed description
5. Fork the repository
6. Create your feature branch (`git checkout -b feature/amazing-feature`)
7. Commit your changes (`git commit -m 'Add amazing feature'`)
8. Push to the branch (`git push origin feature/amazing-feature`)
9. Open a Pull Request

### Credits
Special thanks to the r/ClaudeAI Reddit community for developing and sharing these innovative approaches to working with Claude AI. This collection represents the collective intelligence of developers pushing the boundaries of AI-assisted development.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Inspired by best practices in AI-assisted development
- Built for the Claude Code community
- Special thanks to all contributors
- Special thanks to the r/ClaudeAI Reddit community for developing and sharing these innovative approaches

## 🔗 Links

- [Repository](https://github.com/Kasempiternal/Claude-Agent-System)
- [Issues](https://github.com/Kasempiternal/Claude-Agent-System/issues)
- [Discussions](https://github.com/Kasempiternal/Claude-Agent-System/discussions)

## 🔄 Updates and Maintenance

This repository is actively maintained and updated with new patterns as they emerge from the community. Check back regularly for new workflows and improvements.

---

**Remember**: The goal is not just to code faster, but to code better. These workflows ensure quality, maintainability, and knowledge preservation while optimizing for the appropriate level of process overhead.

*"Fix it right the first time"* - The guiding principle of the Claude Agent System

**Made with ❤️ for better AI-assisted development**