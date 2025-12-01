# /help - Claude Agent System Help

## Quick Start

**Just use `/systemcc "your task"`** - It automatically selects the best workflow for you!

## All Available Commands

### 🎯 Master Router

#### `/systemcc` - Unified System Entry Point (RECOMMENDED)
Intelligent router with Lyra AI optimization that selects the best workflow:
- **Agent OS** - Project initialization and standards
- **AI Dev Tasks** - PRD-based feature development
- **Phase-Based** - Large context management
- **Complete System** - 6-agent validation workflow
- **Orchestrated** - Quick 3-agent execution

```bash
/systemcc "implement user authentication"  # Auto-selects workflow
/systemcc --workflow=agetos "setup project"  # Force specific workflow
```

#### `/taskit` - Phase-Based Execution
Breaks complex tasks into focused phases for optimal context management.
- Best for tasks > 1 hour or large codebases
- Reduces context by 60-80%
- Maintains quality across all phases
- See `workflows/phase-based-workflow/taskit.md` for details

```bash
/taskit "refactor entire payment system"
```

### 🚀 Specialized Workflows

#### `/agetos` - Agent OS Project Standards
Comprehensive project initialization and standardization.
- Setup coding standards and conventions
- Configure development tools and workflows
- Establish team practices

```bash
/agetos init  # Full project setup
/agetos analyze  # Analyze current state
```

#### `/aidevtasks` - PRD-Based Development
Structured feature development with requirements.
- Create Product Requirement Documents
- Generate hierarchical task lists
- Implement with approval checkpoints

```bash
/aidevtasks "build notification system"
/aidevtasks create-prd "user dashboard"
```

### 🔧 Core Workflows

#### `/orchestrated` - Streamlined 3-Agent Workflow
Quick execution for simple tasks.
- Agent O: Orchestrator
- Agent D: Developer  
- Agent R: Reviewer

```bash
/orchestrated "fix button styling"
```

#### Complete System (6 Sequential Agents)
For complex tasks requiring thorough validation, `/systemcc` automatically runs:
1. Strategic analysis phase
2. Implementation phase
3. Quality verification phase
4. Functional testing phase
5. Documentation phase
6. Version control phase

### 🛠️ Workflow Access

All workflows are accessed through `/systemcc` which automatically:
- Detects task complexity
- Selects appropriate workflow
- Runs all agents sequentially
- No manual agent commands needed

### 📝 Planning Command

#### `/plan-opus` - Deep Planning with Parallel Exploration
Creates detailed implementation plans using Claude Opus for complex tasks.
- Spawns parallel Explore agents for thorough codebase analysis
- Generates comprehensive plan files for user review
- Requires explicit user approval before implementation
- Perfect for complex features requiring careful analysis

```bash
/plan-opus "implement user authentication with OAuth2"
/plan-opus "refactor database layer for better performance"
```

**Workflow:**
1. Task Understanding - Clarify requirements
2. Parallel Exploration - Multiple agents explore architecture, features, dependencies, tests
3. Hypothesis Verification - Read and verify findings
4. Plan Creation - Generate detailed plan in `~/.claude/plans/`
5. User Confirmation - Wait for approval before implementing
6. Plan Re-read - Respect user's edits, then implement

### 🔍 Utility Commands

#### `/analyzecc` - Auto-Adapt to Your Stack
Analyzes your project and adapts the agent system to your tech stack.
- Detects language, frameworks, and tools
- Updates agent commands to match your stack
- Perfect for Python AI/ML, React, Rails, etc.

```bash
/analyzecc
```

#### `/epct` - Explore, Plan, Code, Test
For tasks requiring research and exploration.

#### `/create-worktree` - Git Worktree
Creates new branch in separate worktree.

## Decision Guide

```
Don't know which to use?
    ↓
Use /systemcc - it intelligently routes for you!

Automatic routing:
- Project setup → Agent OS (/agetos)
- Feature building → AI Dev Tasks (/aidevtasks) 
- Large context → Phase-based (/taskit)
- Complex validation → Complete system
- Quick fixes → Orchestrated

Manual override:
/systemcc --workflow=[agetos|aidevtasks|taskit|complete|orchestrated]
```

## Context Management

`/systemcc` automatically uses `/taskit` when:
- Current context > 30k tokens
- Project has 100+ files
- Task touches 5+ modules
- Estimated time > 60 minutes

## Examples

See `/help examples` or check `commands/examples.md` for detailed scenarios.

## 🎯 Key Features

### Universal Lyra Optimization
ALL commands now use AI prompt enhancement:
- Transforms vague requests into detailed specs
- Ensures complete code delivery
- Optimizes for each workflow type

### Intelligent Routing
`/systemcc` analyzes:
- Task complexity and type
- Current context size
- Project characteristics
- Best workflow selection

## Tips

1. **Always start with `/systemcc`** for intelligent routing
2. **Building features?** Let it route to AI Dev Tasks
3. **New project?** It'll suggest Agent OS
4. **Large context?** Automatic phase-based execution
5. **Know what you want?** Use direct commands

## File Organization

All Claude-generated files are automatically organized in the `ClaudeFiles/` directory:
- `ClaudeFiles/documentation/` - Learnings, project docs, features
- `ClaudeFiles/tests/` - Test results, bug reports, performance metrics
- `ClaudeFiles/workflows/` - Task plans, phase outcomes, summaries
- `ClaudeFiles/temp/` - Working files like WORK.md

See `CLAUDE-FILES-ORGANIZATION.md` for complete details.

## Learn More

- `commands/README.md` - Command overview
- `commands/examples.md` - Detailed examples
- `phase-based-workflow/README.md` - Phase-based methodology
- `README-AGENT-SYSTEM.md` - Complete system guide
- `CLAUDE-FILES-ORGANIZATION.md` - File organization system