# Claude Agent System Guide

## Overview

This repository contains a structured multi-agent workflow system designed to help Claude work effectively on development projects. The system provides two workflow approaches depending on the complexity and scope of the task at hand.

## Workflow Selection Guide

### Use `complete-system/` for:
- **Large-scale projects** requiring comprehensive planning and architecture
- **Complex features** with multiple components and dependencies
- **Critical implementations** needing thorough verification and testing
- **Projects requiring extensive documentation** and knowledge capture
- **Multi-phase development** with intricate requirements
- **High-risk changes** that could impact system stability
- **Cross-functional features** affecting multiple system areas

Examples:
- Building a new authentication system
- Implementing a complex data visualization dashboard
- Refactoring core application architecture
- Creating a new API with multiple endpoints
- Developing a real-time collaboration feature

### Use `orchestrated-only/` for:
- **Small, focused tasks** with clear scope
- **Quick fixes** and minor improvements
- **Simple feature additions** with minimal dependencies
- **Routine maintenance** tasks
- **Straightforward bug fixes**
- **Documentation updates** only
- **Configuration changes**

Examples:
- Adding a single UI component
- Fixing a specific bug
- Updating configuration files
- Adding a utility function
- Making style adjustments
- Simple refactoring of a single file

## How to Use

### For Complex Tasks (complete-system)
When working on complex projects, follow the full six-agent workflow:

```bash
# 1. Start with strategic analysis
/planner "implement user authentication with OAuth providers"

# 2. Build the solution
/executer

# 3. Verify code quality
/verifier

# 4. Test functionality
/tester

# 5. Document patterns and learnings
/documenter

# 6. Commit changes
/updater
```

### For Simple Tasks (orchestrated-only)
For simpler tasks, use the streamlined orchestrated workflow:

```bash
# Use the orchestrated approach directly
/orchestrated "add dark mode toggle to header"
```

## Decision Criteria

Ask yourself these questions to determine which system to use:

1. **Scope**: Does this touch multiple files/components? → complete-system
2. **Risk**: Could this break existing functionality? → complete-system
3. **Complexity**: Does this require architectural decisions? → complete-system
4. **Time**: Will this take more than 30 minutes? → complete-system
5. **Testing**: Does this need comprehensive testing? → complete-system
6. **Documentation**: Will others need to understand this implementation? → complete-system

If you answered "yes" to any of the above, use the complete-system workflow.

## Important Notes

- Always err on the side of using complete-system for uncertain cases
- The orchestrated-only approach still maintains quality but with less overhead
- Both systems follow the same core principles of quality and maintainability
- You can switch between systems based on task requirements

## Additional Tools

This repository also includes specialized tools for development workflows:
- `create-worktree.md` - Git worktree creation and management
- Additional workflow tools as they are developed

Remember: The goal is to match the process complexity to the task complexity, ensuring efficiency without sacrificing quality.