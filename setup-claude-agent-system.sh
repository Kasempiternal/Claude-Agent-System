#!/bin/bash

# Claude Agent System Setup Script
# Installs the /systemcc command system for Claude Code

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

echo -e "${BLUE}Claude Agent System Setup${NC}"
echo -e "${BLUE}==========================${NC}"

# Function to print status
print_status() {
    echo -e "${GREEN}[OK]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_info() {
    echo -e "${YELLOW}[INFO]${NC} $1"
}

# Parse command line arguments
GLOBAL_INSTALL=false
for arg in "$@"; do
    case $arg in
        --global|-g)
            GLOBAL_INSTALL=true
            shift
            ;;
        --help|-h)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --global, -g    Install globally to ~/.claude/ (available in all projects)"
            echo "  --help, -h      Show this help message"
            echo ""
            echo "Without --global, installs to the current project's .claude/ directory"
            exit 0
            ;;
    esac
done

# Determine installation directory
if [ "$GLOBAL_INSTALL" = true ]; then
    CLAUDE_DIR="$HOME/.claude"
    print_status "Global installation mode: Installing to $CLAUDE_DIR"
    print_info "Commands will be available in ALL projects"
else
    # Check if we're in a git repository
    if git rev-parse --git-dir > /dev/null 2>&1; then
        PROJECT_ROOT=$(git rev-parse --show-toplevel)
        print_status "Detected git repository at: $PROJECT_ROOT"
    else
        PROJECT_ROOT=$(pwd)
        print_info "Not in a git repository. Using current directory: $PROJECT_ROOT"
    fi
    CLAUDE_DIR="$PROJECT_ROOT/.claude"
fi

# Create .claude directory structure
mkdir -p "$CLAUDE_DIR/commands"
mkdir -p "$CLAUDE_DIR/middleware"
mkdir -p "$CLAUDE_DIR/workflows"
mkdir -p "$CLAUDE_DIR/agents"
print_status "Created .claude directory structure"

# Clone the repository
print_info "Downloading Claude Agent System..."
if git clone --quiet --depth 1 "$REPO_URL" "$TEMP_DIR" 2>/dev/null; then
    print_status "Repository downloaded"
else
    print_error "Failed to download repository"
    exit 1
fi

# Copy core system files from .claude/ directory (source of truth)
print_info "Installing system files..."

# Copy from .claude/ subdirectory (the authoritative source)
if [ -d "$TEMP_DIR/.claude/commands" ]; then
    cp -r "$TEMP_DIR/.claude/commands/"* "$CLAUDE_DIR/commands/" 2>/dev/null || true
    print_status "Commands installed"
fi

if [ -d "$TEMP_DIR/.claude/middleware" ]; then
    cp -r "$TEMP_DIR/.claude/middleware/"* "$CLAUDE_DIR/middleware/" 2>/dev/null || true
    print_status "Middleware installed"
fi

if [ -d "$TEMP_DIR/.claude/workflows" ]; then
    cp -r "$TEMP_DIR/.claude/workflows/"* "$CLAUDE_DIR/workflows/" 2>/dev/null || true
    print_status "Workflows installed"
fi

if [ -d "$TEMP_DIR/.claude/agents" ]; then
    cp -r "$TEMP_DIR/.claude/agents/"* "$CLAUDE_DIR/agents/" 2>/dev/null || true
    print_status "Agents installed"
fi

# Copy important files
cp "$TEMP_DIR/.claude/SYSTEMCC-OVERRIDE.md" "$CLAUDE_DIR/" 2>/dev/null || true
cp "$TEMP_DIR/.claude/QUICK_START.md" "$CLAUDE_DIR/" 2>/dev/null || true

# Create ~/.claude/ directories for caching and temp files
mkdir -p "$HOME/.claude/cache"
mkdir -p "$HOME/.claude/checkpoints"
mkdir -p "$HOME/.claude/temp"
print_status "Created cache, checkpoints, and temp directories"

# Clean up
rm -rf "$TEMP_DIR"
print_status "Cleaned up temporary files"

# Final summary
echo ""
echo -e "${GREEN}Claude Agent System installed!${NC}"
echo ""
if [ "$GLOBAL_INSTALL" = true ]; then
    echo -e "${BLUE}Global installation complete${NC}"
    echo "   /systemcc is now available in ALL projects!"
else
    echo -e "${BLUE}Project installation complete${NC}"
    echo "   /systemcc is available in this project"
fi
echo ""
echo -e "${BLUE}Usage:${NC}"
echo "   /systemcc \"describe what you want to do\""
echo ""
echo -e "${BLUE}Installed to:${NC}"
echo "   $CLAUDE_DIR/commands/"
echo "   $CLAUDE_DIR/middleware/"
echo "   $CLAUDE_DIR/workflows/"
echo ""
echo -e "${BLUE}Data directories:${NC}"
echo "   ~/.claude/cache/       (persistent analysis cache)"
echo "   ~/.claude/checkpoints/ (session resumption)"
echo "   ~/.claude/temp/        (auto-deleted after workflow)"
echo ""
echo -e "${YELLOW}Tip:${NC} The system caches analysis per-repo for instant startup!"
