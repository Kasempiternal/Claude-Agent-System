# CLAUDE.md - Claude Agent System

This file provides project-specific guidance to Claude Code when working in this repository.

## Project Overview

This is the Claude Agent System repository - a comprehensive multi-agent workflow system for structured development. 

## How to Use This System

### Quick Start
1. **First, read** `README-AGENT-SYSTEM.md` to understand workflow selection
2. **For complex tasks**: Use the complete-system workflow (`/planner`, `/executer`, etc.)
3. **For simple tasks**: Use the orchestrated workflow (`/orchestrated`)

### Workflow Files Location
- **Complete System**: `complete-system/` directory contains all agent documentation
- **Orchestrated Only**: `orchestrated-only/` directory contains streamlined workflow
- **Git Workflows**: `create-worktree.md` and `wt-alias-setup.md` for branch management

## Agent System Commands

### Full Workflow (Complex Tasks)
```bash
/planner "describe your problem or idea"  # Strategic analysis
/executer   # Implementation based on Phase 1
/verifier   # Code quality validation
/tester     # Functional testing
/documenter # Documentation updates
/updater    # Version control
```

### Streamlined Workflow (Simple Tasks)
```bash
/orchestrated "implement simple feature"
```

### Git Worktree Management
```bash
/create-worktree feature-name  # Creates new worktree and branch
```

## Important Files

- `README-AGENT-SYSTEM.md` - Main guide for choosing workflow complexity
- `complete-system/` - Full six-agent workflow documentation
  - `claude-agents-workflow.md` - System overview
  - `planner-agent.md` - Strategic planning
  - `executer-agent.md` - Implementation
  - `verifier-agent.md` - Quality assurance
  - `tester-agent.md` - Testing protocols
  - `documenter-agent.md` - Documentation patterns
- `orchestrated-only/m-orchestrated-dev.md` - Streamlined workflow
- `create-worktree.md` - Git worktree workflow
- `wt-alias-setup.md` - Bash alias configuration

## Development Guidelines

### Task Complexity Assessment
Before starting any task, assess its complexity:
- **Simple**: Single file changes, bug fixes, minor features → Use orchestrated workflow
- **Complex**: Multi-file changes, architecture decisions, new systems → Use complete workflow

### Quality Standards
- Always follow the agent patterns exactly as documented
- Run appropriate validation for the task complexity
- Document learnings and patterns discovered
- Use git worktrees for feature development

### Workflow Integration
The agent system is designed to:
1. Ensure consistent quality across all development
2. Capture knowledge and patterns systematically
3. Prevent common mistakes through structured processes
4. Scale appropriately to task complexity

## Notes
- This system emphasizes quality over speed
- Each agent has specific responsibilities - respect the boundaries
- The global CLAUDE.md at `~/.claude/CLAUDE.md` provides general guidelines
- This project-specific file takes precedence for workflow selection