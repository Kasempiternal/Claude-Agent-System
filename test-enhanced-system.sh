#!/bin/bash

# Test script for enhanced Claude Agent System features
# Run this after setup to verify all components are installed correctly

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "Testing Enhanced Claude Agent System Installation..."
echo "===================================================="

ERRORS=0
WARNINGS=0

# Function to check if file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $2"
        return 0
    else
        echo -e "${RED}✗${NC} $2"
        ERRORS=$((ERRORS + 1))
        return 1
    fi
}

# Function to check if directory exists
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $2"
        return 0
    else
        echo -e "${RED}✗${NC} $2"
        ERRORS=$((ERRORS + 1))
        return 1
    fi
}

# Check core directories
echo ""
echo "Checking Core Directories:"
check_dir ".claude" "Main Claude directory"
check_dir ".claude/commands" "Commands directory"
check_dir ".claude/commands/systemcc" "Modular systemcc directory"
check_dir ".claude/middleware" "Middleware directory"
check_dir ".claude/workflows" "Workflows directory"
check_dir ".claude/agents" "Agents directory (NEW)"

# Check new review agents
echo ""
echo "Checking Code Review Agents (NEW):"
check_file ".claude/agents/code-reviewer-senior.md" "Senior Engineer reviewer"
check_file ".claude/agents/code-reviewer-lead.md" "Lead Engineer reviewer"
check_file ".claude/agents/code-reviewer-architect.md" "Architect reviewer"

# Check post-execution review workflow
echo ""
echo "Checking Post-Execution Review Workflow (NEW):"
check_dir ".claude/workflows/post-execution-review" "Post-execution review directory"
check_file ".claude/workflows/post-execution-review/triple-review-orchestrator.md" "Triple review orchestrator"

# Check systemcc modules
echo ""
echo "Checking Systemcc Modules:"
check_file ".claude/commands/systemcc/00-INDEX.md" "Module index"
check_file ".claude/commands/systemcc/04-IMPLEMENTATION-STEPS.md" "Implementation steps"
check_file ".claude/commands/systemcc/10-POST-REVIEW.md" "Post-review module (NEW)"
check_file ".claude/commands/systemcc/11-MEMORY-UPDATE.md" "Memory update module (NEW)"

# Check memory bank
echo ""
echo "Checking Memory Bank System:"
check_dir ".claude/files/memory" "Memory bank directory"
check_file ".claude/files/memory/CLAUDE-activeContext.md" "Active context"
check_file ".claude/files/memory/CLAUDE-patterns.md" "Patterns"
check_file ".claude/files/memory/CLAUDE-decisions.md" "Decisions"
check_file ".claude/files/memory/CLAUDE-troubleshooting.md" "Troubleshooting"
check_file ".claude/files/memory/CLAUDE-dont_dos.md" "Don't dos (NEW)"

# Check middleware
echo ""
echo "Checking Enhanced Middleware:"
check_file ".claude/middleware/memory-auto-updater.md" "Memory auto-updater (NEW)"

# Check main files
echo ""
echo "Checking Main Configuration:"
check_file "CLAUDE.md" "Main Claude configuration"

# Check for ClaudeFiles alternative location
echo ""
echo "Checking ClaudeFiles (alternative location):"
if [ -d "ClaudeFiles/memory" ]; then
    echo -e "${YELLOW}⚠${NC} Found ClaudeFiles/memory - consider migrating to .claude/files/memory"
    WARNINGS=$((WARNINGS + 1))
fi

# Summary
echo ""
echo "===================================================="
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ All enhanced features installed successfully!${NC}"
    echo ""
    echo "New features ready to use:"
    echo "  • Triple code review (Senior, Lead, Architect)"
    echo "  • Automatic memory updates after each task"
    echo "  • User preference learning (dont_dos.md)"
    echo "  • Post-execution quality validation"
    echo ""
    echo "To get started, use: /systemcc \"your task\""
else
    echo -e "${RED}❌ Found $ERRORS missing components${NC}"
    echo ""
    echo "Please run the setup script again:"
    echo "  curl -sSL https://raw.githubusercontent.com/Kasempiternal/Claude-Agent-System/main/setup-claude-agent-system.sh | bash"
fi

if [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}⚠ $WARNINGS warnings found (non-critical)${NC}"
fi

exit $ERRORS