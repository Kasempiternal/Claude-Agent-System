# Claude Agent System - Quick Setup

## 🚀 One-Line Setup

### For Unix/Linux/macOS:
```bash
curl -sSL https://raw.githubusercontent.com/Kasempiternal/Claude-Agent-System/main/setup-claude-agent-system.sh | bash
```

### For Windows (PowerShell):
```powershell
iwr -useb https://raw.githubusercontent.com/Kasempiternal/Claude-Agent-System/main/setup-claude-agent-system.ps1 | iex
```

## What Does It Do?

The setup script automatically:

1. **Creates `.claude/` directory** in your project
2. **Downloads all command files** from the Claude Agent System
3. **Creates/updates `CLAUDE.md`** with project configuration
4. **Adds `.claude/` to `.gitignore`** to keep it local
5. **Sets up the `/systemcc` command** as your universal entry point

## After Setup

Simply use:
```
/systemcc "describe what you want to build"
```

The system will:
- Analyze your task complexity
- Check your context size
- Detect your project scale
- Automatically choose the best workflow

## Manual Setup (Alternative)

If you prefer manual setup:

1. Clone the repository:
   ```bash
   git clone https://github.com/Kasempiternal/Claude-Agent-System /tmp/cas
   ```

2. Create `.claude` directory in your project:
   ```bash
   mkdir -p .claude
   ```

3. Copy the necessary files:
   ```bash
   cp -r /tmp/cas/commands .claude/
   cp -r /tmp/cas/complete-system .claude/
   cp -r /tmp/cas/orchestrated-only .claude/
   cp -r /tmp/cas/phase-based-workflow .claude/
   cp /tmp/cas/README-AGENT-SYSTEM.md .claude/
   ```

4. Create `CLAUDE.md` in your project root with basic configuration

## Features After Setup

- **Context-Aware Routing**: Automatically uses phase-based approach for large contexts
- **Intelligent Workflow Selection**: No manual decision needed
- **Quality Preservation**: Maintains high quality even in large codebases
- **Simple Commands**: Just `/systemcc` for everything

## Troubleshooting

### "git: command not found"
The setup requires Git. Install it first:
- macOS: `brew install git`
- Ubuntu/Debian: `sudo apt install git`
- Windows: Download from [git-scm.com](https://git-scm.com)

### "curl: command not found"
- macOS: Comes pre-installed
- Ubuntu/Debian: `sudo apt install curl`
- Windows: Use the PowerShell command instead

### Permission denied
Run with appropriate permissions:
```bash
sudo bash -c "$(curl -sSL https://raw.githubusercontent.com/Kasempiternal/Claude-Agent-System/main/setup-claude-agent-system.sh)"
```

## Next Steps

1. Run the setup script
2. Open your project in Claude Code
3. Use `/systemcc "your task"`
4. Let the system handle the complexity!

## Learn More

- See `/help` after setup for all commands
- Check `.claude/QUICK_START.md` for examples
- Visit the [repository](https://github.com/Kasempiternal/Claude-Agent-System) for full documentation