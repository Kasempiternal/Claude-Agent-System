# /help - Claude Agent System Help

## Quick Start

**Just use `/systemcc "your task"`** - It automatically selects the best workflow for you!

## All Available Commands

### 🎯 Primary Commands

#### `/systemcc` - Universal Entry Point (RECOMMENDED)
Analyzes your task and automatically selects the optimal workflow.
- Detects large contexts and routes to phase-based approach
- Chooses between complete-system, orchestrated, or taskit
- No manual decision needed

```bash
/systemcc "implement user authentication"
```

#### `/taskit` - Phase-Based Execution
Breaks complex tasks into focused phases for optimal context management.
- Best for tasks > 1 hour or large codebases
- Reduces context by 60-80%
- Maintains quality across all phases

```bash
/taskit "refactor entire payment system"
```

### 🔧 Workflow Commands

#### `/orchestrated` - Streamlined 3-Agent Workflow
Quick execution for simple tasks.
- Agent O: Orchestrator
- Agent D: Developer  
- Agent R: Reviewer

```bash
/orchestrated "fix button styling"
```

#### Complete System (6 Sequential Agents)
For complex tasks requiring thorough validation:
1. `/planner` - Strategic analysis
2. `/executer` - Implementation
3. `/verifier` - Quality check
4. `/tester` - Functional testing
5. `/documenter` - Documentation
6. `/updater` - Version control

### 🔍 Other Commands

#### `/epct` - Explore, Plan, Code, Test
For tasks requiring research and exploration.

#### `/create-worktree` - Git Worktree
Creates new branch in separate worktree.

## Decision Guide

```
Don't know which to use?
    ↓
Use /systemcc - it decides for you!

Manual selection:
- Very complex (1hr+) → /taskit
- Complex → /planner (complete system)
- Simple → /orchestrated
- Need research → /epct
```

## Context Management

`/systemcc` automatically uses `/taskit` when:
- Current context > 30k tokens
- Project has 100+ files
- Task touches 5+ modules
- Estimated time > 60 minutes

## Examples

See `/help examples` or check `commands/examples.md` for detailed scenarios.

## Tips

1. **Always start with `/systemcc`** unless you have specific needs
2. **Large codebase?** Let systemcc route to taskit automatically
3. **Context getting large?** systemcc will detect and handle it
4. **Power user?** Use specific commands directly

## Learn More

- `commands/README.md` - Command overview
- `commands/examples.md` - Detailed examples
- `phase-based-workflow/README.md` - Phase-based methodology
- `README-AGENT-SYSTEM.md` - Complete system guide