# SYSTEMCC COMMAND - MODULE INDEX

Modules load **progressively** based on task complexity to optimize context usage.

## Module Loading Order

### PROGRESSIVE LOADING
**Loading levels**:
- **MINIMAL**: Simple tasks - load headers/summaries only
- **STANDARD**: Moderate tasks - load core sections
- **FULL**: Complex tasks - load complete documentation

**Process**:
1. Assess task complexity from user request
2. Load `middleware/progressive-loader.md` for loading logic
3. Load modules at appropriate detail level
4. Apply progressive loading markers during reads

### LEVEL 0 - CRITICAL (Load First)
| Module | Purpose |
|--------|---------|
| `01-CRITICAL-DETECTION.md` | Detection feedback message |
| `02-LYRA-OPTIMIZATION.md` | Lyra AI prompt optimization |
| `03-BUILD-CONFIG.md` | Build/pipeline configuration |

### LEVEL 1 - CORE WORKFLOW
| Module | Purpose |
|--------|---------|
| `04-WORKFLOW-SELECTION.md` | Workflow decision matrix |
| `05-IMPLEMENTATION-STEPS.md` | Execution flow and steps |

### LEVEL 2 - REFERENCE
| Module | Purpose |
|--------|---------|
| `06-EXAMPLES.md` | Workflow examples |
| `07-DECISION-ENGINE.md` | 3-dimension decision logic |
| `08-ERROR-HANDLING.md` | Error recovery strategies |
| `09-PARALLEL.md` | Batch operations |

### LEVEL 3 - POST-EXECUTION
| Module | Purpose |
|--------|---------|
| `10-POST-REVIEW.md` | Triple code review system |
| `11-MEMORY-UPDATE.md` | Memory bank updates |

### LEVEL 4 - OPTIMIZATION
| Module | Purpose |
|--------|---------|
| `12-PROGRESSIVE-DISCLOSURE.md` | Context optimization and loading levels |

## Quick Reference

### The ONLY Command Users Need
```bash
/systemcc "what you want done"
```

### What Happens (In Order)
1. **Detection** - "SYSTEMCC DETECTED" message
2. **Lyra** - Optimize prompt
3. **Build Config** - Apply project rules
4. **Analysis** - 3-dimension assessment
5. **Selection** - Choose workflow
6. **Execution** - Run with progress
7. **Review** - Triple code review
8. **Memory** - Update learnings
9. **Summary** - Brief completion message

### Critical Rules
- **ALWAYS** show detection feedback first
- **ALWAYS** show Lyra optimization
- **NEVER** ask user to run another command
- **NEVER** expose agent commands to user
- **COMPLETE** everything in one flow

## Workflows Available

| Workflow | Use Case |
|----------|----------|
| `orchestrated` | Simple tasks (3-agent) |
| `complete_system` | Complex tasks (6-agent) |
| `plan-opus` | Large scope (phase-based) |
| `aidevtasks` | Feature development (PRD) |
| `anti-yolo-web` | Web app development |
| `agetos` | Project initialization |

## Integration

Links to parent files:
- `CLAUDE.md` - Project instructions
- `middleware/lyra-universal.md` - Lyra system
- `middleware/simplified-decision-engine.md` - Decision logic

## Troubleshooting

**If SYSTEMCC is being ignored:**
1. Check detection message appears
2. Verify all modules loaded
3. Check CLAUDE.md is being read

**If workflow selection fails:**
1. Check 04-WORKFLOW-SELECTION.md
2. Use fallback in 08-ERROR-HANDLING.md
