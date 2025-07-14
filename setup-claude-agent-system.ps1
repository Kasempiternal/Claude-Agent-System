# Claude Agent System Setup Script for Windows
# This script automatically sets up the Claude Agent System in any project

$ErrorActionPreference = "Stop"

# Configuration
$REPO_URL = "https://github.com/Kasempiternal/Claude-Agent-System"
$TEMP_DIR = Join-Path $env:TEMP "claude-agent-system-$(Get-Random)"

# Colors
function Write-Success { Write-Host "✓ $args" -ForegroundColor Green }
function Write-Error { Write-Host "✗ $args" -ForegroundColor Red }
function Write-Info { Write-Host "ℹ $args" -ForegroundColor Yellow }
function Write-Header { Write-Host $args -ForegroundColor Blue }

Write-Header "🤖 Claude Agent System Setup"
Write-Header "================================"

# Check if we're in a git repository
try {
    $PROJECT_ROOT = git rev-parse --show-toplevel 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Detected git repository at: $PROJECT_ROOT"
    } else {
        throw
    }
} catch {
    $PROJECT_ROOT = Get-Location
    Write-Info "Not in a git repository. Using current directory: $PROJECT_ROOT"
}

# Create .claude directory if it doesn't exist
$CLAUDE_DIR = Join-Path $PROJECT_ROOT ".claude"
if (!(Test-Path $CLAUDE_DIR)) {
    New-Item -ItemType Directory -Path $CLAUDE_DIR | Out-Null
    Write-Success "Created .claude directory"
} else {
    Write-Info ".claude directory already exists"
}

# Clone the Claude Agent System repository to temp directory
Write-Info "Cloning Claude Agent System repository..."
try {
    git clone --quiet $REPO_URL $TEMP_DIR 2>$null
    Write-Success "Repository cloned successfully"
} catch {
    Write-Error "Failed to clone repository"
    exit 1
}

# Create subdirectories in .claude
$subdirs = @("commands", "complete-system", "orchestrated-only", "phase-based-workflow")
foreach ($dir in $subdirs) {
    $path = Join-Path $CLAUDE_DIR $dir
    if (!(Test-Path $path)) {
        New-Item -ItemType Directory -Path $path | Out-Null
    }
}

# Copy files
Write-Info "Installing command files..."
try {
    Copy-Item -Path "$TEMP_DIR\commands\*" -Destination "$CLAUDE_DIR\commands\" -Recurse -Force -ErrorAction SilentlyContinue
    Copy-Item -Path "$TEMP_DIR\complete-system\*" -Destination "$CLAUDE_DIR\complete-system\" -Recurse -Force -ErrorAction SilentlyContinue
    Copy-Item -Path "$TEMP_DIR\orchestrated-only\*" -Destination "$CLAUDE_DIR\orchestrated-only\" -Recurse -Force -ErrorAction SilentlyContinue
    Copy-Item -Path "$TEMP_DIR\phase-based-workflow\*" -Destination "$CLAUDE_DIR\phase-based-workflow\" -Recurse -Force -ErrorAction SilentlyContinue
    Copy-Item -Path "$TEMP_DIR\README-AGENT-SYSTEM.md" -Destination "$CLAUDE_DIR\" -Force -ErrorAction SilentlyContinue
    Write-Success "Command files installed"
} catch {
    Write-Info "Some files may not have been copied (this is normal)"
}

# Create or update CLAUDE.md
$CLAUDE_MD_PATH = Join-Path $PROJECT_ROOT "CLAUDE.md"
if (!(Test-Path $CLAUDE_MD_PATH)) {
    Write-Info "Creating CLAUDE.md..."
    @'
# CLAUDE.md - Project Configuration

This project uses the Claude Agent System for AI-assisted development.

## Quick Start

Use `/systemcc "your task description"` to get started. The system will automatically:
- Analyze your task complexity
- Detect context size and project scale
- Route to the appropriate workflow

## Available Commands

- `/systemcc` - Universal entry point (RECOMMENDED)
- `/taskit` - Phase-based execution for complex tasks
- `/orchestrated` - Quick workflow for simple tasks
- `/help` - Show all available commands

## How It Works

The system automatically selects the best approach:
- **Large contexts** → Routes to phase-based execution
- **Complex tasks** → Uses complete 6-agent system
- **Simple tasks** → Uses streamlined 3-agent workflow

## Project-Specific Notes

Add your project-specific guidelines below:

### Code Style
- [Add your code style preferences]

### Testing Requirements
- [Add your testing requirements]

### Build Commands
- [Add your build/lint/test commands]

## Learn More

See `.claude/commands/help.md` for detailed command documentation.
'@ | Out-File -FilePath $CLAUDE_MD_PATH -Encoding UTF8
    Write-Success "Created CLAUDE.md"
} else {
    Write-Info "CLAUDE.md already exists - skipping creation"
    Write-Info "You may want to add the following to your CLAUDE.md:"
    Write-Host ""
    Write-Host "## Claude Agent System" -ForegroundColor Yellow
    Write-Host "This project uses the Claude Agent System. Use /systemcc `"your task`" to get started." -ForegroundColor Yellow
    Write-Host "See .claude/commands/help.md for available commands." -ForegroundColor Yellow
    Write-Host ""
}

# Add .claude to .gitignore if it doesn't exist
$GITIGNORE_PATH = Join-Path $PROJECT_ROOT ".gitignore"
if (Test-Path $GITIGNORE_PATH) {
    $gitignoreContent = Get-Content $GITIGNORE_PATH
    if ($gitignoreContent -notcontains ".claude/") {
        Add-Content $GITIGNORE_PATH "`n# Claude Agent System`n.claude/"
        Write-Success "Added .claude to .gitignore"
    } else {
        Write-Info ".claude already in .gitignore"
    }
} else {
    Write-Info "No .gitignore file found - consider adding .claude/ to version control exclusions"
}

# Create a quick reference file
@'
# Claude Agent System - Quick Start

## Primary Command

Just use: `/systemcc "describe what you want to do"`

The system will automatically:
1. Analyze your task
2. Check context size
3. Evaluate project complexity
4. Choose the optimal workflow

## Examples

```bash
# Simple fix
/systemcc "fix typo in login page"

# Complex feature
/systemcc "implement user authentication with OAuth"

# Large refactoring (auto-uses phases)
/systemcc "refactor all API endpoints to use new pattern"
```

## Manual Commands (Power Users)

- `/taskit` - Force phase-based execution
- `/orchestrated` - Force simple workflow
- `/planner` - Start complete system manually
- `/help` - Show all commands

## Context Management

The system automatically detects when context is getting large and switches to phase-based execution to maintain quality.

Happy coding! 🚀
'@ | Out-File -FilePath (Join-Path $CLAUDE_DIR "QUICK_START.md") -Encoding UTF8

# Clean up
Remove-Item -Path $TEMP_DIR -Recurse -Force
Write-Success "Cleaned up temporary files"

# Final summary
Write-Host ""
Write-Host "✨ Claude Agent System setup complete!" -ForegroundColor Green
Write-Host ""
Write-Header "Next steps:"
Write-Host "1. Open your project in Claude Code"
Write-Host "2. Use " -NoNewline; Write-Host "/systemcc `"your task`"" -ForegroundColor Green -NoNewline; Write-Host " to get started"
Write-Host "3. Use " -NoNewline; Write-Host "/help" -ForegroundColor Green -NoNewline; Write-Host " to see all available commands"
Write-Host ""
Write-Header "Files created:"
Write-Host "  - $CLAUDE_DIR\ (command system)"
Write-Host "  - $CLAUDE_MD_PATH (project configuration)"
Write-Host "  - $CLAUDE_DIR\QUICK_START.md (quick reference)"
Write-Host ""
Write-Host "Tip: " -NoNewline -ForegroundColor Yellow
Write-Host "The system will automatically manage context and choose the best workflow for you!"