# PCC - Parallel Claude Coordinator

A Claude Code plugin that orchestrates complex development tasks using parallel agent exploration and implementation.

## Skills

### `/pcc` - Standard Mode
Uses **Sonnet scouts** for fast, cost-efficient exploration and **Opus agents** for implementation.

Best for:
- Most development tasks
- When exploration speed matters
- Cost-conscious workflows

### `/pcc-opus` - Opus Edition
Uses **Opus scouts** AND **Opus implementers** for maximum quality at every stage.

Best for:
- Critical production systems
- Complex architectural changes
- Unfamiliar or poorly-documented codebases
- Tasks where exploration quality directly impacts success

## How It Works

1. **Task Understanding** - Clarifies the task with you
2. **Parallel Exploration** - Spawns 2-6 scout agents to explore the codebase
3. **Synthesis** - Combines findings into a unified understanding
4. **Clarification** - Asks targeted questions if needed
5. **Plan Creation** - Creates a detailed implementation plan
6. **User Review** - You edit and approve the plan
7. **Parallel Implementation** - Spawns 2-6 Opus agents to implement
8. **Verification** - Runs tests and code review
9. **Simplification** - Cleans up the code
10. **Final Report** - Summarizes everything

## Installation

```bash
/plugin marketplace add Kasempiternal/Claude-Agent-System
/plugin install pcc
```

## Usage

```bash
# Standard mode (Sonnet scouts)
/pcc implement user authentication with JWT tokens

# Opus edition (Opus scouts)
/pcc-opus refactor the entire payment processing system
```

## Key Principles

- **Orchestrator, not implementer** - The main agent coordinates, never codes directly
- **Maximum parallelism** - Independent work streams run simultaneously
- **User control** - You review and edit the plan before implementation
- **Quality through delegation** - Specialized agents handle each concern

## Agent Summary

| Phase | pcc | pcc-opus |
|-------|-----|----------|
| Exploration | Sonnet (2-6) | Opus (2-6) |
| Implementation | Opus (2-6) | Opus (2-6) |
| Testing | Auto | Auto |
| Review | Auto | Auto |
| Simplification | Auto (2-6) | Auto (2-6) |

## License

MIT
