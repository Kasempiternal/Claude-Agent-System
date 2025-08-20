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

# Create complete directory structure in .claude
$subdirs = @("commands", "middleware", "workflows", "complete-system", "orchestrated-only", "phase-based-workflow")
foreach ($dir in $subdirs) {
    $path = Join-Path $CLAUDE_DIR $dir
    if (!(Test-Path $path)) {
        New-Item -ItemType Directory -Path $path | Out-Null
    }
}

# Copy all core system files
Write-Info "Installing core system files..."

# Copy commands directory
if (Test-Path "$TEMP_DIR\commands") {
    Copy-Item -Path "$TEMP_DIR\commands\*" -Destination "$CLAUDE_DIR\commands\" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Success "Commands installed"
}

# Copy middleware directory (CRITICAL - contains Lyra AI, analysis, memory systems)
if (Test-Path "$TEMP_DIR\middleware") {
    Copy-Item -Path "$TEMP_DIR\middleware\*" -Destination "$CLAUDE_DIR\middleware\" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Success "Middleware installed (Lyra AI, analysis, memory systems)"
}

# Copy complete workflows directory structure
if (Test-Path "$TEMP_DIR\workflows") {
    Copy-Item -Path "$TEMP_DIR\workflows\*" -Destination "$CLAUDE_DIR\workflows\" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Success "Complete workflow system installed"
}

# Copy legacy directories for backward compatibility
Copy-Item -Path "$TEMP_DIR\complete-system\*" -Destination "$CLAUDE_DIR\complete-system\" -Recurse -Force -ErrorAction SilentlyContinue
Copy-Item -Path "$TEMP_DIR\orchestrated-only\*" -Destination "$CLAUDE_DIR\orchestrated-only\" -Recurse -Force -ErrorAction SilentlyContinue
Copy-Item -Path "$TEMP_DIR\phase-based-workflow\*" -Destination "$CLAUDE_DIR\phase-based-workflow\" -Recurse -Force -ErrorAction SilentlyContinue

# Copy documentation files
Copy-Item -Path "$TEMP_DIR\README-AGENT-SYSTEM.md" -Destination "$CLAUDE_DIR\" -Force -ErrorAction SilentlyContinue
Copy-Item -Path "$TEMP_DIR\CLAUDE-FILES-ORGANIZATION.md" -Destination "$CLAUDE_DIR\" -Force -ErrorAction SilentlyContinue

Write-Success "All system components installed"

# Setup ClaudeFiles directory structure
Write-Info "Setting up ClaudeFiles directory structure..."
$claudeFilesPath = Join-Path $PROJECT_ROOT "ClaudeFiles"
$claudeFilesSubdirs = @("documentation", "tests\results", "tests\bugs", "workflows", "temp", "memory")
foreach ($dir in $claudeFilesSubdirs) {
    $path = Join-Path $claudeFilesPath $dir
    if (!(Test-Path $path)) {
        New-Item -ItemType Directory -Path $path -Force | Out-Null
    }
}

# Initialize memory bank system
Write-Info "Initializing memory bank system..."
$memoryPath = Join-Path $claudeFilesPath "memory"
if (Test-Path "$TEMP_DIR\ClaudeFiles\memory") {
    Copy-Item -Path "$TEMP_DIR\ClaudeFiles\memory\*" -Destination $memoryPath -Recurse -Force -ErrorAction SilentlyContinue
    Write-Success "Memory bank system initialized"
} else {
    # Create basic memory files if they don't exist in source
    $currentDate = Get-Date -Format "yyyy-MM-dd"
    
    @"
# CLAUDE-activeContext.md
*Current Session State and Progress Tracking*

## Current Session
**Date**: $currentDate
**Primary Task**: [Current task will be updated automatically]
**Status**: Initialized

## Active Goals
- [Goals will be tracked automatically]

## Recent Context
- Project initialized with Claude Agent System
- Memory bank system ready for learning

---
*This file maintains continuity across Claude sessions. Updates automatically.*
"@ | Out-File -FilePath (Join-Path $memoryPath "CLAUDE-activeContext.md") -Encoding UTF8

    @'
# CLAUDE-patterns.md
*Established Code Patterns and Conventions*

## Detected Patterns
- [Code patterns will be learned automatically]

## Naming Conventions
- [Will be detected from codebase analysis]

## Architecture Patterns
- [Will be identified during development]

---
*This file learns and remembers your coding patterns.*
'@ | Out-File -FilePath (Join-Path $memoryPath "CLAUDE-patterns.md") -Encoding UTF8

    @'
# CLAUDE-decisions.md
*Architecture Decisions and Rationale*

## Decision Log
- [Architecture decisions will be recorded automatically]

## Technology Choices
- [Tech stack decisions will be tracked]

---
*This file maintains a record of important project decisions.*
'@ | Out-File -FilePath (Join-Path $memoryPath "CLAUDE-decisions.md") -Encoding UTF8

    @'
# CLAUDE-troubleshooting.md
*Common Issues and Proven Solutions*

## Known Issues
- [Common problems and solutions will be recorded]

## Solution Database
- [Proven fixes will be stored for reuse]

---
*This file builds a knowledge base of solutions.*
'@ | Out-File -FilePath (Join-Path $memoryPath "CLAUDE-troubleshooting.md") -Encoding UTF8

    Write-Success "Basic memory bank files created"
}

Write-Success "ClaudeFiles directory structure created"

# Create or update CLAUDE.md
$CLAUDE_MD_PATH = Join-Path $PROJECT_ROOT "CLAUDE.md"
if (!(Test-Path $CLAUDE_MD_PATH)) {
    Write-Info "Creating CLAUDE.md..."
    @'
# CLAUDE.md - Claude Agent System Configuration

This project uses the Claude Agent System with full automation, intelligent analysis, and persistent memory.

## THE ONLY COMMAND YOU NEED

```bash
/systemcc "describe what you want to do"
```

The system automatically:
- 🔍 Analyzes your codebase (first run only)
- 🎯 Optimizes your request with Lyra AI
- 🧠 Selects the best workflow internally
- ⚡ Executes everything end-to-end
- 💾 Remembers patterns for future sessions

## Smart Automation

The system automatically chooses:
- **Simple fixes** → Quick 3-agent workflow
- **Complex features** → Complete 6-agent validation
- **Large codebases** → Phase-based execution
- **New features** → PRD-based development

## Memory Bank System

Your project now has persistent memory in `ClaudeFiles/memory/`:
- **activeContext.md** - Current session state
- **patterns.md** - Code conventions and patterns
- **decisions.md** - Architecture decisions
- **troubleshooting.md** - Solutions database

## File Organization

All Claude-generated files are organized in `ClaudeFiles/`:
- `documentation/` - All documentation
- `tests/` - Test results and bug reports
- `workflows/` - Task plans and summaries
- `memory/` - Persistent learning system
- `temp/` - Temporary working files

## Available Commands

- `/systemcc` - Universal entry point (ALL YOU NEED)
- `/help` - Show all available commands
- `/analyzecc` - Manual project re-analysis (rarely needed)

## Project-Specific Configuration

Add your project-specific guidelines below:

### Code Style Preferences
- [Your coding standards will be learned automatically]

### Testing Requirements  
- [Test commands will be detected automatically]

### Build Commands
- [Build/lint commands will be configured automatically]

## Learn More

- `.claude/commands/help.md` - Complete command reference
- `.claude/CLAUDE-FILES-ORGANIZATION.md` - File organization details
- `ClaudeFiles/memory/` - Your project's learning system
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
Write-Header "Complete system installed:"
Write-Host "  - $CLAUDE_DIR\commands\ (all commands)"
Write-Host "  - $CLAUDE_DIR\middleware\ (Lyra AI, analysis, memory systems)"
Write-Host "  - $CLAUDE_DIR\workflows\ (complete workflow system)"
Write-Host "  - $CLAUDE_MD_PATH (project configuration)"
Write-Host "  - ClaudeFiles\memory\ (persistent learning system)"
Write-Host "  - ClaudeFiles\ (organized output directory)"
Write-Host ""
Write-Host "Tip: " -NoNewline -ForegroundColor Yellow
Write-Host "The system will automatically manage context and choose the best workflow for you!"