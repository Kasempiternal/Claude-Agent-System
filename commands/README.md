# Claude Agent System Commands

This directory contains the implementation documentation for all custom commands in the Claude Agent System.

## Available Commands

### `/systemcc` - Unified System Command
Automatically analyzes your task and selects the appropriate workflow (complete-system or orchestrated-only).

**Usage**: `/systemcc "your task description"`

**Benefits**:
- No need to manually decide between workflows
- Optimizes for task complexity
- Maintains quality standards

[Full documentation](./systemcc.md)

### `/taskit` - Phase-Based Task Execution
Breaks complex tasks into focused phases for optimal context usage and quality.

**Usage**: `/taskit "complex task description"`

**Benefits**:
- 60-80% reduction in context usage
- 2-3x improvement in code quality
- Clear progress tracking
- Structured documentation

[Full documentation](./taskit.md)

### Other Commands

- `/planner` - Start complete-system workflow (Phase 1)
- `/executer` - Continue complete-system workflow (Phase 2)
- `/verifier` - Quality validation (Phase 3)
- `/tester` - Functional testing (Phase 4)
- `/documenter` - Documentation updates (Phase 5)
- `/updater` - Version control (Phase 6)
- `/orchestrated` - Run streamlined 3-agent workflow
- `/create-worktree` - Create git worktree for feature

## Command Selection Guide

```
Is your task complex or simple?
│
├─ Not sure? → Use /systemcc (auto-decides)
│
├─ Very complex (1+ hours)? → Use /taskit
│
├─ Complex? → Use /planner (complete-system)
│
└─ Simple? → Use /orchestrated
```

## Examples

See [examples.md](./examples.md) for detailed scenarios and use cases.

## Implementation Notes

These command files serve as documentation for Claude Code. When a user types a command, Claude Code reads the corresponding .md file and executes the documented workflow.