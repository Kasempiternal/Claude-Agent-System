#!/bin/bash

# Claude Agent System Setup Script
# This script automatically sets up the Claude Agent System in any project

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
REPO_URL="https://github.com/Kasempiternal/Claude-Agent-System"
TEMP_DIR="/tmp/claude-agent-system-$$"

echo -e "${BLUE}🤖 Claude Agent System Setup${NC}"
echo -e "${BLUE}================================${NC}"

# Function to print status
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${YELLOW}ℹ${NC} $1"
}

# Check if we're in a git repository
if git rev-parse --git-dir > /dev/null 2>&1; then
    PROJECT_ROOT=$(git rev-parse --show-toplevel)
    print_status "Detected git repository at: $PROJECT_ROOT"
else
    PROJECT_ROOT=$(pwd)
    print_info "Not in a git repository. Using current directory: $PROJECT_ROOT"
fi

# Create .claude directory structure if it doesn't exist
CLAUDE_DIR="$PROJECT_ROOT/.claude"
if [ ! -d "$CLAUDE_DIR" ]; then
    mkdir -p "$CLAUDE_DIR"
    print_status "Created .claude directory"
else
    print_info ".claude directory already exists"
fi

# Create additional directories for new features
mkdir -p "$CLAUDE_DIR/agents"
print_info "Creating agents directory for reviewers..."

# Clone the Claude Agent System repository to temp directory
print_info "Cloning Claude Agent System repository..."
if git clone --quiet "$REPO_URL" "$TEMP_DIR" 2>/dev/null; then
    print_status "Repository cloned successfully"
else
    print_error "Failed to clone repository"
    exit 1
fi

# Create complete directory structure in .claude
mkdir -p "$CLAUDE_DIR/commands"
mkdir -p "$CLAUDE_DIR/middleware" 
mkdir -p "$CLAUDE_DIR/workflows"
mkdir -p "$CLAUDE_DIR/complete-system"
mkdir -p "$CLAUDE_DIR/orchestrated-only"
mkdir -p "$CLAUDE_DIR/phase-based-workflow"

# Copy all core system files
print_info "Installing core system files..."

# Copy commands directory (including new modular systemcc structure)
if [ -d "$TEMP_DIR/commands" ]; then
    cp -r "$TEMP_DIR/commands/"* "$CLAUDE_DIR/commands/" 2>/dev/null || true
    # Ensure systemcc modules are copied
    if [ -d "$TEMP_DIR/commands/systemcc" ]; then
        mkdir -p "$CLAUDE_DIR/commands/systemcc"
        cp -r "$TEMP_DIR/commands/systemcc/"* "$CLAUDE_DIR/commands/systemcc/" 2>/dev/null || true
        print_status "Commands installed (including modular systemcc)"
    else
        print_status "Commands installed"
    fi
fi

# Copy middleware directory (CRITICAL - contains Lyra AI, analysis, memory systems, AND enforcement)
if [ -d "$TEMP_DIR/middleware" ]; then
    cp -r "$TEMP_DIR/middleware/"* "$CLAUDE_DIR/middleware/" 2>/dev/null || true
    print_status "Middleware installed (Lyra AI, analysis, memory systems, workflow enforcement)"
fi

# Copy agents directory (NEW - contains code reviewers)
# Note: Agents are in the root .claude/agents in the repo structure
if [ -d "$TEMP_DIR/Claude-Agent-System/.claude/agents" ]; then
    cp -r "$TEMP_DIR/Claude-Agent-System/.claude/agents/"* "$CLAUDE_DIR/agents/" 2>/dev/null || true
    print_status "Code review agents installed (Senior, Lead, Architect)"
elif [ -d "$TEMP_DIR/.claude/agents" ]; then
    cp -r "$TEMP_DIR/.claude/agents/"* "$CLAUDE_DIR/agents/" 2>/dev/null || true
    print_status "Code review agents installed (Senior, Lead, Architect)"
fi

# Copy complete workflows directory structure
if [ -d "$TEMP_DIR/workflows" ]; then
    cp -r "$TEMP_DIR/workflows/"* "$CLAUDE_DIR/workflows/" 2>/dev/null || true
    print_status "Complete workflow system installed"
    # Check specifically for post-execution review
    if [ -d "$TEMP_DIR/workflows/post-execution-review" ]; then
        print_status "Post-execution triple review system installed"
    fi
fi

# Copy legacy directories for backward compatibility
cp -r "$TEMP_DIR/complete-system/"* "$CLAUDE_DIR/complete-system/" 2>/dev/null || true
cp -r "$TEMP_DIR/orchestrated-only/"* "$CLAUDE_DIR/orchestrated-only/" 2>/dev/null || true
cp -r "$TEMP_DIR/phase-based-workflow/"* "$CLAUDE_DIR/phase-based-workflow/" 2>/dev/null || true

# Agent OS is now integrated into workflows/agent-os/
# No separate .agent-os directory needed

# Copy important documentation files
cp "$TEMP_DIR/README-AGENT-SYSTEM.md" "$CLAUDE_DIR/" 2>/dev/null || true
cp "$TEMP_DIR/CLAUDE-FILES-ORGANIZATION.md" "$CLAUDE_DIR/" 2>/dev/null || true
cp "$TEMP_DIR/setup-claudefiles.sh" "$CLAUDE_DIR/" 2>/dev/null || true
cp "$TEMP_DIR/SYSTEMCC-OVERRIDE.md" "$CLAUDE_DIR/" 2>/dev/null || true
cp "$TEMP_DIR/commands/COMMAND-HOOKS.md" "$CLAUDE_DIR/commands/" 2>/dev/null || true

print_status "All system components installed"

# Setup .claude/files directory structure (hidden from git)
print_info "Setting up .claude/files directory structure..."
mkdir -p "$PROJECT_ROOT/.claude/files/documentation"
mkdir -p "$PROJECT_ROOT/.claude/files/tests/results"
mkdir -p "$PROJECT_ROOT/.claude/files/tests/bugs"
mkdir -p "$PROJECT_ROOT/.claude/files/workflows"
mkdir -p "$PROJECT_ROOT/.claude/files/temp"
mkdir -p "$PROJECT_ROOT/.claude/files/memory"

# Initialize memory bank system
print_info "Initializing memory bank system..."
# Try multiple possible locations for memory files
if [ -d "$TEMP_DIR/Claude-Agent-System/ClaudeFiles/memory" ]; then
    cp -r "$TEMP_DIR/Claude-Agent-System/ClaudeFiles/memory/"* "$PROJECT_ROOT/.claude/files/memory/" 2>/dev/null || true
    print_status "Memory bank system initialized from ClaudeFiles"
elif [ -d "$TEMP_DIR/ClaudeFiles/memory" ]; then
    cp -r "$TEMP_DIR/ClaudeFiles/memory/"* "$PROJECT_ROOT/.claude/files/memory/" 2>/dev/null || true
    print_status "Memory bank system initialized"
elif [ -d "$TEMP_DIR/.claude/files/memory" ]; then
    cp -r "$TEMP_DIR/.claude/files/memory/"* "$PROJECT_ROOT/.claude/files/memory/" 2>/dev/null || true
    print_status "Memory bank system initialized"
else
    # Create basic memory files if they don't exist in source
    cat > "$PROJECT_ROOT/.claude/files/memory/CLAUDE-activeContext.md" << 'EOF'
# CLAUDE-activeContext.md
*Current Session State and Progress Tracking*

## Current Session
**Date**: $(date +%Y-%m-%d)
**Primary Task**: [Current task will be updated automatically]
**Status**: Initialized

## Active Goals
- [Goals will be tracked automatically]

## Recent Context
- Project initialized with Claude Agent System
- Memory bank system ready for learning

---
*This file maintains continuity across Claude sessions. Updates automatically.*
EOF

    cat > "$PROJECT_ROOT/.claude/files/memory/CLAUDE-patterns.md" << 'EOF'
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
EOF

    cat > "$PROJECT_ROOT/.claude/files/memory/CLAUDE-decisions.md" << 'EOF'
# CLAUDE-decisions.md
*Architecture Decisions and Rationale*

## Decision Log
- [Architecture decisions will be recorded automatically]

## Technology Choices
- [Tech stack decisions will be tracked]

---
*This file maintains a record of important project decisions.*
EOF

    cat > "$PROJECT_ROOT/.claude/files/memory/CLAUDE-troubleshooting.md" << 'EOF'
# CLAUDE-troubleshooting.md
*Common Issues and Proven Solutions*

## Known Issues
- [Common problems and solutions will be recorded]

## Solution Database
- [Proven fixes will be stored for reuse]

---
*This file builds a knowledge base of solutions.*
EOF

    cat > "$PROJECT_ROOT/.claude/files/memory/CLAUDE-dont_dos.md" << 'EOF'
# CLAUDE-dont_dos.md
*User Preferences and Things to Avoid*

## What NOT to Do
- Don't create summary documents unless explicitly requested
- Don't be verbose in explanations - keep it brief
- Don't create files that weren't requested

## User Feedback Log
- [User corrections will be captured automatically when you say "no", "stop", or "don't"]

---
*This file learns what you DON'T want, improving with every correction.*
EOF
    print_status "Basic memory bank files created (including dont_dos)"
fi

print_status "ClaudeFiles directory structure created"

# Create or update CLAUDE.md
CLAUDE_MD_PATH="$PROJECT_ROOT/CLAUDE.md"
if [ ! -f "$CLAUDE_MD_PATH" ]; then
    print_info "Creating CLAUDE.md..."
    cat > "$CLAUDE_MD_PATH" << 'EOF'
# CLAUDE.md - Claude Agent System Configuration

This project uses the Claude Agent System with 10/10 code quality standards, advanced decision engines, and persistent memory.

## THE ONLY COMMAND YOU NEED

```bash
/systemcc "describe what you want to do"
```

⚠️ **MANDATORY WORKFLOW**: The /systemcc command ALWAYS follows its automated workflow process.
📁 **MODULAR STRUCTURE**: The systemcc command uses modular documentation in `.claude/commands/systemcc/` for improved reliability.

The system automatically:
- 🎯 Shows immediate detection feedback ("SYSTEMCC DETECTED")
- 🔍 Shows Lyra AI prompt optimization (ALWAYS displayed)
- 📋 **NEW**: Detects build configuration (Makefile, CI/CD, linters, formatters)
- 🎯 Optimizes your request with Lyra AI intelligence
- 🧠 Selects optimal workflow using advanced decision engines
- 🔄 Executes ALL phases automatically (CANNOT be skipped)
- 🔍 Runs triple code review (Senior, Lead, Architect) in parallel
- 📝 Auto-updates memory banks after every task
- 🚫 Learns what you DON'T want from corrections
- ✅ **NEW**: Ensures all code follows your pipeline/build rules
- 📊 Shows progress updates throughout execution
- ⚡ Executes everything with comprehensive error handling
- 💾 Learns and remembers patterns across sessions
- 🛡️ Maintains 10/10 code quality with robust validation

## Intelligent Decision System

The enhanced decision engine uses:
- **Technical Complexity Analysis** - Pattern-based complexity scoring
- **Scope Impact Assessment** - Multi-dimensional scope evaluation  
- **Risk Factor Detection** - Comprehensive risk analysis
- **Context Load Management** - Smart context growth prediction
- **Time Pressure Recognition** - Urgency-aware workflow selection

Workflow selection:
- **Simple fixes** → Streamlined 3-agent workflow (low complexity/risk)
- **Complex features** → Complete 6-agent validation (high complexity/risk)
- **Large codebases** → Phase-based execution (high context load)
- **Feature development** → PRD-based structured approach
- **Critical tasks** → Enhanced validation with comprehensive testing

## Memory Bank System

Your project now has persistent memory in `.claude/files/memory/`:
- **activeContext.md** - Current session state
- **patterns.md** - Code conventions and patterns
- **decisions.md** - Architecture decisions
- **troubleshooting.md** - Solutions database
- **dont_dos.md** - What NOT to do (learns from your corrections)

## File Organization

All Claude-generated files are organized in `.claude/files/`:
- `documentation/` - All documentation
- `tests/` - Test results and bug reports
- `workflows/` - Task plans and summaries
- `memory/` - Persistent learning system
- `temp/` - Temporary working files

## Quality Assurance System

The system maintains 10/10 code quality through:
- **Input Validation** - Comprehensive parameter validation and sanitization
- **Error Handling** - Robust error handling with graceful fallbacks
- **Performance Optimization** - Early termination and caching strategies
- **Constants Management** - Centralized configuration system
- **Logging Integration** - Debug and error logging for transparency
- **Type Safety** - Enhanced type validation and conversion

## Available Commands

- `/systemcc` - Universal entry point with intelligent routing (ALL YOU NEED)
- `/help` - Show all available commands
- `/analyzecc` - Manual project re-analysis (rarely needed)

## Advanced Features

### Decision Engine Transparency
- Real-time workflow selection reasoning
- 5-dimensional task analysis scoring
- Alternative workflow suggestions with confidence levels
- Performance metrics and optimization feedback

### Quality Standards
- All code changes validated for syntax and logic
- Comprehensive error handling with fallback mechanisms
- Performance-optimized with early termination strategies
- Production-ready robustness and reliability

## Project-Specific Configuration

Add your project-specific guidelines below:

### Code Style Preferences
- [Your coding standards will be learned and enforced automatically]

### Testing Requirements  
- [Test commands will be detected and validated automatically]

### Build Commands
- [Build/lint commands will be configured with quality checks]

## Build Configuration Auto-Detection

The system automatically detects and applies build configuration from:
- **Makefile** - Extracts formatter/linter commands and flags
- **CI/CD Files** - `.gitlab-ci.yml`, `.github/workflows/*.yml`
- **Language Configs** - `pyproject.toml`, `package.json`, `setup.cfg`
- **Tool Configs** - `.pre-commit-config.yaml`, `tox.ini`, `.eslintrc`

When detected, all generated code automatically follows:
- Formatting rules (black, prettier, etc.)
- Linting standards (flake8, eslint, mypy)
- Test requirements (pytest, jest)
- Pipeline stage requirements

See `Makefile.example` for a sample configuration.

## Learn More

- `.claude/commands/help.md` - Complete command reference
- `.claude/CLAUDE-FILES-ORGANIZATION.md` - File organization details
- `.claude/files/memory/` - Your project's learning system
EOF
    print_status "Created CLAUDE.md"
else
    print_info "CLAUDE.md already exists - skipping creation"
    print_info "You may want to add the following to your CLAUDE.md:"
    echo -e "${YELLOW}"
    echo "## Claude Agent System"
    echo "This project uses the Claude Agent System. Use /systemcc \"your task\" to get started."
    echo "See .claude/commands/help.md for available commands."
    echo -e "${NC}"
fi

# Add .claude and ClaudeFiles to .gitignore if they don't exist
GITIGNORE_PATH="$PROJECT_ROOT/.gitignore"
if [ -f "$GITIGNORE_PATH" ]; then
    ADDED_ITEMS=false
    
    if ! grep -q "^\.claude/$" "$GITIGNORE_PATH"; then
        if [ "$ADDED_ITEMS" = false ]; then
            echo "" >> "$GITIGNORE_PATH"
            echo "# Claude Agent System" >> "$GITIGNORE_PATH"
            ADDED_ITEMS=true
        fi
        echo ".claude/" >> "$GITIGNORE_PATH"
        print_status "Added .claude to .gitignore"
    else
        print_info ".claude already in .gitignore"
    fi
    
    if ! grep -q "^.claude/files/$" "$GITIGNORE_PATH"; then
        if [ "$ADDED_ITEMS" = false ]; then
            echo "" >> "$GITIGNORE_PATH"
            echo "# Claude Agent System" >> "$GITIGNORE_PATH"
        fi
        echo ".claude/files/" >> "$GITIGNORE_PATH"
        echo "!.claude/files/documentation/learnings/" >> "$GITIGNORE_PATH"
        echo "!.claude/files/documentation/project/" >> "$GITIGNORE_PATH"
        print_status "Added ClaudeFiles to .gitignore"
    else
        print_info "ClaudeFiles already in .gitignore"
    fi
else
    print_info "No .gitignore file found - consider adding .claude/ and .claude/files/ to version control exclusions"
fi

# Create a quick reference file
cat > "$CLAUDE_DIR/QUICK_START.md" << 'EOF'
# Claude Agent System - Quick Start (10/10 Code Quality)

## Primary Command

Just use: `/systemcc "describe what you want to do"`

The enhanced system automatically:
1. **8-Dimensional Analysis** - Evaluates technical complexity, scope impact, risk factors, context load, time pressure, code minimalism, security, and pattern reusability
2. **Build Configuration Detection** - Automatically detects and applies Makefile, CI/CD, and linting rules
3. **Intelligent Routing** - Selects optimal workflow based on sophisticated decision algorithms
4. **Quality Assurance** - Validates all inputs, handles errors gracefully, and maintains production standards
5. **Performance Optimization** - Uses early termination, caching, and efficient pattern matching
6. **Transparent Reasoning** - Provides detailed decision explanations and alternative suggestions

## Examples

```bash
# Simple fix (auto-detects low complexity/risk)
/systemcc "fix typo in login page"

# Complex feature (auto-detects high complexity, triggers comprehensive validation)
/systemcc "implement user authentication with OAuth"

# Large refactoring (auto-detects high context load, uses phase-based execution)
/systemcc "refactor all API endpoints to use new pattern"

# Critical task (auto-detects risk factors, uses enhanced validation)
/systemcc "urgent: fix production database connection issue"
```

## Intelligent Features

### Decision Engine Transparency
- Real-time scoring across 8 dimensions
- Build configuration auto-detection and application
- Confidence levels and alternative workflow suggestions
- Performance metrics and optimization feedback
- Detailed reasoning for all workflow selections

### Quality Assurance
- Comprehensive input validation and sanitization
- Robust error handling with graceful fallbacks
- Performance-optimized execution with early termination
- Production-ready robustness and reliability

## Auto-Adaptation

- `/analyzecc` - Deep project analysis with quality standards
  - Auto-detects tech stack with enhanced pattern recognition
  - Configures quality checks and validation rules
  - Updates all commands with optimized parameters

## Manual Commands (Power Users)

- `/taskit` - Force phase-based execution with quality validation
- `/orchestrated` - Force streamlined workflow with error handling
- `/planner` - Start complete system with comprehensive validation
- `/help` - Show enhanced command system

## Advanced Context Management

The system uses intelligent context load prediction:
- Monitors token usage and file complexity in real-time
- Predicts context growth using statistical models
- Automatically switches to phase-based execution when needed
- Maintains optimal performance through smart resource management

## File Organization

All Claude-generated files are organized in the `.claude/files/` directory:
- `.claude/files/documentation/` - All documentation
- `.claude/files/tests/` - Test results and bug reports
- `.claude/files/workflows/` - Workflow files and summaries
- `.claude/files/temp/` - Temporary working files

See `.claude/CLAUDE-FILES-ORGANIZATION.md` for complete details.

Happy coding! 🚀
EOF

# Clean up
rm -rf "$TEMP_DIR"
print_status "Cleaned up temporary files"

# Final summary
echo ""
echo -e "${GREEN}✨ Claude Agent System setup complete! (10/10 Code Quality)${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Open your project in Claude Code"
echo "2. Use ${GREEN}/systemcc \"your task\"${NC} to get started with intelligent workflow selection"
echo "3. Use ${GREEN}/help${NC} to see all available commands"
echo ""
echo -e "${BLUE}Complete system installed:${NC}"
echo "  - $CLAUDE_DIR/commands/ (intelligent command system)"
echo "  - $CLAUDE_DIR/middleware/ (advanced decision engines, Lyra AI, quality systems)"
echo "  - $CLAUDE_DIR/workflows/ (complete workflow system)"
echo "  - $CLAUDE_MD_PATH (enhanced project configuration)"
echo "  - .claude/files/memory/ (persistent learning system)"
echo "  - .claude/files/ (organized output with quality validation)"
echo ""
echo -e "${BLUE}Quality Features:${NC}"
echo "  ✅ 8-dimensional decision engine with complexity analysis"
echo "  ✅ Build configuration auto-detection (Makefile, CI/CD, linters)"
echo "  ✅ Triple code review system (Senior, Lead, Architect)"
echo "  ✅ Automatic memory updates after every task"
echo "  ✅ Learns what you DON'T want from corrections"
echo "  ✅ Pipeline-ready code generation (follows your build rules)"
echo "  ✅ MANDATORY workflow enforcement for /systemcc command"
echo "  ✅ Comprehensive error handling and input validation"
echo "  ✅ Performance optimization with early termination"
echo "  ✅ Production-ready robustness and reliability"
echo "  ⚠️ Workflow structure (Lyra → build config → phases → review → memory) CANNOT be skipped"
echo ""
echo -e "${YELLOW}Tip:${NC} The enhanced system automatically analyzes task complexity, manages context, and selects optimal workflows!"
echo -e "${YELLOW}New:${NC} Build configuration detector ensures all code follows your pipeline rules automatically!"
echo -e "${YELLOW}New:${NC} Batch optimizer groups similar operations to reduce tool switching overhead!"
