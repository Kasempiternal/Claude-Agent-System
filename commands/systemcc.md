# /systemcc - Master Command Router

**CRITICAL: ALL modules in `commands/systemcc/` MUST be loaded for proper operation.**

## Module Loading Order

### Load ALL modules from `commands/systemcc/` directory:

| # | Module | Purpose |
|---|--------|---------|
| 1 | `00-INDEX.md` | Module overview |
| 2 | `01-CRITICAL-DETECTION.md` | Detection feedback (LEVEL 0) |
| 3 | `02-LYRA-OPTIMIZATION.md` | Lyra AI optimization (LEVEL 0) |
| 4 | `03-BUILD-CONFIG.md` | Build configuration (LEVEL 0) |
| 5 | `04-WORKFLOW-SELECTION.md` | Workflow decision matrix |
| 6 | `05-IMPLEMENTATION-STEPS.md` | Execution flow |
| 7 | `06-EXAMPLES.md` | Workflow examples |
| 8 | `07-DECISION-ENGINE.md` | 3-dimension decision logic |
| 9 | `08-ERROR-HANDLING.md` | Error recovery |
| 10 | `09-PARALLEL.md` | Batch operations |
| 11 | `10-POST-REVIEW.md` | Code review system |
| 12 | `11-MEMORY-UPDATE.md` | Memory bank updates |

## Quick Summary

The `/systemcc` command is the ONLY command users need. It:
- Shows immediate detection feedback
- Optimizes requests with Lyra AI
- Detects and applies build/pipeline configuration rules
- Auto-selects the best workflow using 3-dimension analysis
- Executes everything automatically
- Completes tasks end-to-end

## Execution Order

```
1. IMMEDIATE: Detection message
   "SYSTEMCC DETECTED - Command acknowledged"

2. ALWAYS: Lyra optimization
   [Formatted optimization display]

3. AUTO: Build configuration (if present)
   [Display detected formatters, linters, rules]

4. AUTO: 3-dimension analysis
   [Complexity, Risk, Scope assessment]

5. AUTO: Select and execute workflow
   [Progress through all phases]

6. AUTO: Code review
   [Triple review system]

7. COMPLETE: Summary
   "Task complete!"
```

## Enforcement Levels

### LEVEL 0 - ABSOLUTE (Cannot be overridden)
- Detection feedback
- Lyra optimization display
- Build configuration application
- Automatic workflow execution
- Complete end-to-end flow

### What Users See
- Detection confirmation
- Lyra optimization
- Build configuration rules (if detected)
- Progress updates
- Completion summary

### What Users NEVER See
- Agent commands
- Manual workflow instructions
- "Run X next" prompts
- Internal routing logic

## Module Details

| Category | Modules |
|----------|---------|
| Detection | `01-CRITICAL-DETECTION.md` |
| Optimization | `02-LYRA-OPTIMIZATION.md` |
| Build Config | `03-BUILD-CONFIG.md` |
| Selection | `04-WORKFLOW-SELECTION.md`, `07-DECISION-ENGINE.md` |
| Execution | `05-IMPLEMENTATION-STEPS.md`, `09-PARALLEL.md` |
| Reference | `06-EXAMPLES.md`, `08-ERROR-HANDLING.md` |
| Post-Execution | `10-POST-REVIEW.md`, `11-MEMORY-UPDATE.md` |

## Integration

Links with:
- `CLAUDE.md` - Core project instructions
- `middleware/lyra-universal.md` - Lyra system
- `middleware/simplified-decision-engine.md` - Decision logic
- `middleware/build-config-detector.md` - Build detection

## Remember

**User types:** `/systemcc "any task"`
**Claude does:** EVERYTHING automatically

That's it. No other commands needed.
