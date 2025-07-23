# Claude Agent Unified System

## Overview

The Claude Agent System has evolved into a unified platform that integrates multiple specialized workflows under one intelligent router. This document explains the unified architecture and how all components work together.

## Core Components

### 1. Universal Lyra AI Optimization (`middleware/lyra-universal.md`)
- **Purpose**: Enhances ALL prompts before execution
- **Applies to**: Every command in the system
- **Method**: 4-D methodology (Deconstruct, Diagnose, Develop, Deliver)
- **Result**: Clear, complete specifications for any workflow

### 2. Master Router (`/systemcc`)
- **Purpose**: Intelligent workflow selection
- **Features**:
  - Auto-detects task type and complexity
  - Routes to most appropriate workflow
  - Supports manual override with `--workflow` flag
  - Context-aware decision making

### 3. Integrated Workflows

#### Agent OS (`/agetos`)
- Project initialization and setup
- Coding standards establishment
- Development workflow configuration
- Team convention documentation

#### AI Dev Tasks (`/aidevtasks`)
- PRD-based feature development
- Clarifying questions for requirements
- Hierarchical task decomposition
- One-task-at-a-time execution
- Automatic git commits

#### Complete System (6 Agents)
- PLANNER: Strategic analysis
- EXECUTER: Implementation
- VERIFIER: Quality checks
- TESTER: Functional validation
- DOCUMENTER: Knowledge capture
- UPDATER: Version control

#### Orchestrated (3 Agents)
- Quick execution for simple tasks
- Integrated planning, development, review
- Single-pass implementation

#### Phase-Based (`/taskit`)
- Large context management
- Task decomposition into phases
- 60-80% context reduction
- Maintains quality across phases

## Workflow Selection Logic

```
User Input → Lyra Optimization → SystemCC Analysis →

IF project setup/standards → Agent OS
ELIF feature from scratch → AI Dev Tasks  
ELIF context > 30k tokens → Phase-Based
ELIF complex validation needed → Complete System
ELSE → Orchestrated
```

## Directory Structure

```
Claude-Agent-System/
├── middleware/
│   └── lyra-universal.md     # Universal AI optimization
├── workflows/
│   ├── agent-os/             # Project initialization
│   ├── ai-dev-tasks/         # PRD development
│   ├── complete-system/      # 6-agent workflow
│   ├── orchestrated-only/    # 3-agent workflow
│   └── phase-based-workflow/ # Context management
├── commands/
│   ├── systemcc.md          # Master router
│   ├── agetos.md            # Agent OS direct
│   ├── aidevtasks.md        # PRD workflow direct
│   ├── taskit.md            # Phase-based direct
│   ├── orchestrated.md      # Quick workflow
│   └── [agent commands]     # Individual agents
└── ClaudeFiles/             # Organized output

```

## Usage Patterns

### 1. Default (Recommended)
```bash
/systemcc "your task description"
```
Let the system choose the best workflow.

### 2. Force Specific Workflow
```bash
/systemcc --workflow=agetos "setup project"
/systemcc --workflow=aidevtasks "build feature"
/systemcc --workflow=taskit "large refactor"
```

### 3. Direct Access
```bash
/agetos init
/aidevtasks create-prd
/taskit "complex task"
/planner "analyze problem"
/orchestrated "quick fix"
```

## Key Benefits

1. **Unified Entry Point** - One command for everything
2. **Intelligent Routing** - Always uses the right tool
3. **Universal Enhancement** - All prompts optimized
4. **Flexibility** - Direct access when needed
5. **Backward Compatible** - Existing commands work
6. **Context Efficient** - Handles any size project
7. **Quality Assured** - Right validation level

## Integration Points

- **Lyra → Everything**: All commands enhanced
- **Agent OS → Standards**: Feeds into all workflows
- **AI Dev Tasks → Agents**: Can hand off to validation
- **Phase-Based → Any**: Can wrap any workflow
- **Git Integration**: Consistent across all

## Best Practices

1. **Start with `/systemcc`** unless you know exactly what you need
2. **Trust the routing** - It's based on extensive patterns
3. **Use `--workflow` sparingly** - Only when you know better
4. **Let Lyra optimize** - Never bypass the enhancement
5. **Review suggestions** - The system explains its choices

## Future Extensibility

The unified architecture allows easy addition of new workflows:
1. Add to `workflows/` directory
2. Create command in `commands/`
3. Update systemcc routing logic
4. Integrate with Lyra middleware

This unified system represents the evolution of AI-assisted development - intelligent, adaptive, and comprehensive.