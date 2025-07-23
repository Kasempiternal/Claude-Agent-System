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
**NEW**: Now with Lyra AI prompt optimization! Your requests are automatically enhanced for maximum clarity and complete code delivery.

### 🔍 Auto-Adaptation: `/analyzecc`
Automatically detects and adapts to your tech stack:
```bash
/analyzecc
# Detects Python/AI, JavaScript/React, Ruby/Rails, etc.
# Updates all commands to match your project
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