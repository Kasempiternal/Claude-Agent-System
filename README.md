# Claude Agent System

A comprehensive multi-agent workflow system for AI-assisted development with Claude Code. Features intelligent context management, automatic workflow selection, and phase-based execution for complex tasks.

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

## 📚 Documentation

- [Setup Guide](SETUP.md) - Detailed setup instructions
- [Command Examples](commands/examples.md) - Real-world usage examples
- [Phase-Based Workflow](phase-based-workflow/README.md) - Deep dive into phases
- [System Overview](README-AGENT-SYSTEM.md) - Complete system documentation

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Inspired by best practices in AI-assisted development
- Built for the Claude Code community
- Special thanks to all contributors

## 🔗 Links

- [Repository](https://github.com/Kasempiternal/Claude-Agent-System)
- [Issues](https://github.com/Kasempiternal/Claude-Agent-System/issues)
- [Discussions](https://github.com/Kasempiternal/Claude-Agent-System/discussions)

---

**Made with ❤️ for better AI-assisted development**