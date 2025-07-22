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

# Create .claude directory if it doesn't exist
CLAUDE_DIR="$PROJECT_ROOT/.claude"
if [ ! -d "$CLAUDE_DIR" ]; then
    mkdir -p "$CLAUDE_DIR"
    print_status "Created .claude directory"
else
    print_info ".claude directory already exists"
fi

# Clone the Claude Agent System repository to temp directory
print_info "Cloning Claude Agent System repository..."
if git clone --quiet "$REPO_URL" "$TEMP_DIR" 2>/dev/null; then
    print_status "Repository cloned successfully"
else
    print_error "Failed to clone repository"
    exit 1
fi

# Create subdirectories in .claude
mkdir -p "$CLAUDE_DIR/commands"
mkdir -p "$CLAUDE_DIR/complete-system"
mkdir -p "$CLAUDE_DIR/orchestrated-only"
mkdir -p "$CLAUDE_DIR/phase-based-workflow"

# Copy command files
print_info "Installing command files..."
cp -r "$TEMP_DIR/commands/"* "$CLAUDE_DIR/commands/" 2>/dev/null || true
cp -r "$TEMP_DIR/complete-system/"* "$CLAUDE_DIR/complete-system/" 2>/dev/null || true
cp -r "$TEMP_DIR/orchestrated-only/"* "$CLAUDE_DIR/orchestrated-only/" 2>/dev/null || true
cp -r "$TEMP_DIR/phase-based-workflow/"* "$CLAUDE_DIR/phase-based-workflow/" 2>/dev/null || true

# Copy Agent OS files if they exist
if [ -d "$TEMP_DIR/.agent-os" ]; then
    cp -r "$TEMP_DIR/.agent-os" "$CLAUDE_DIR/" 2>/dev/null || true
    print_status "Agent OS files installed"
fi

# Copy important documentation files
cp "$TEMP_DIR/README-AGENT-SYSTEM.md" "$CLAUDE_DIR/" 2>/dev/null || true
cp "$TEMP_DIR/CLAUDE-FILES-ORGANIZATION.md" "$CLAUDE_DIR/" 2>/dev/null || true
cp "$TEMP_DIR/setup-claudefiles.sh" "$CLAUDE_DIR/" 2>/dev/null || true

print_status "Command files installed"

# Run ClaudeFiles setup
print_info "Setting up ClaudeFiles directory structure..."
if [ -f "$CLAUDE_DIR/setup-claudefiles.sh" ]; then
    chmod +x "$CLAUDE_DIR/setup-claudefiles.sh"
    cd "$PROJECT_ROOT" && bash "$CLAUDE_DIR/setup-claudefiles.sh" > /dev/null 2>&1
    print_status "ClaudeFiles directory structure created"
else
    print_info "ClaudeFiles setup script not found - manual setup may be required"
fi

# Create or update CLAUDE.md
CLAUDE_MD_PATH="$PROJECT_ROOT/CLAUDE.md"
if [ ! -f "$CLAUDE_MD_PATH" ]; then
    print_info "Creating CLAUDE.md..."
    cat > "$CLAUDE_MD_PATH" << 'EOF'
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

## File Organization

This project uses the ClaudeFiles directory structure for all AI-generated content.
All non-code files created by Claude agents will be organized in `ClaudeFiles/`.
See `.claude/CLAUDE-FILES-ORGANIZATION.md` for details.

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
    
    if ! grep -q "^ClaudeFiles/$" "$GITIGNORE_PATH"; then
        if [ "$ADDED_ITEMS" = false ]; then
            echo "" >> "$GITIGNORE_PATH"
            echo "# Claude Agent System" >> "$GITIGNORE_PATH"
        fi
        echo "ClaudeFiles/" >> "$GITIGNORE_PATH"
        echo "!ClaudeFiles/documentation/learnings/" >> "$GITIGNORE_PATH"
        echo "!ClaudeFiles/documentation/project/" >> "$GITIGNORE_PATH"
        print_status "Added ClaudeFiles to .gitignore"
    else
        print_info "ClaudeFiles already in .gitignore"
    fi
else
    print_info "No .gitignore file found - consider adding .claude/ and ClaudeFiles/ to version control exclusions"
fi

# Create a quick reference file
cat > "$CLAUDE_DIR/QUICK_START.md" << 'EOF'
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

## Auto-Adaptation

- `/analyzecc` - Analyze project and adapt to your tech stack
  - Auto-detects Python/AI, JavaScript/React, Ruby/Rails, etc.
  - Updates all commands to match your project

## Manual Commands (Power Users)

- `/taskit` - Force phase-based execution
- `/orchestrated` - Force simple workflow
- `/planner` - Start complete system manually
- `/help` - Show all commands

## Context Management

The system automatically detects when context is getting large and switches to phase-based execution to maintain quality.

## File Organization

All Claude-generated files are organized in the `ClaudeFiles/` directory:
- `ClaudeFiles/documentation/` - All documentation
- `ClaudeFiles/tests/` - Test results and bug reports
- `ClaudeFiles/workflows/` - Workflow files and summaries
- `ClaudeFiles/temp/` - Temporary working files

See `.claude/CLAUDE-FILES-ORGANIZATION.md` for complete details.

Happy coding! 🚀
EOF

# Clean up
rm -rf "$TEMP_DIR"
print_status "Cleaned up temporary files"

# Final summary
echo ""
echo -e "${GREEN}✨ Claude Agent System setup complete!${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Open your project in Claude Code"
echo "2. Use ${GREEN}/systemcc \"your task\"${NC} to get started"
echo "3. Use ${GREEN}/help${NC} to see all available commands"
echo ""
echo -e "${BLUE}Files created:${NC}"
echo "  - $CLAUDE_DIR/ (command system)"
echo "  - $CLAUDE_MD_PATH (project configuration)"
echo "  - $CLAUDE_DIR/QUICK_START.md (quick reference)"
echo "  - ClaudeFiles/ (organized output directory)"
echo ""
echo -e "${YELLOW}Tip:${NC} The system will automatically manage context and choose the best workflow for you!"