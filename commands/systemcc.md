# /systemcc - Master Command Router

⚠️ **CRITICAL: This is a modular command. ALL modules in `commands/systemcc/` MUST be loaded for proper operation.**

## 🚨 MANDATORY MODULE LOADING

**This file has been split into focused modules to prevent being ignored due to length.**

### Load ALL modules from `commands/systemcc/` directory:

1. **`00-INDEX.md`** - Module overview and loading order
2. **`01-CRITICAL-DETECTION.md`** - Detection feedback (LEVEL 0)
3. **`02-LYRA-OPTIMIZATION.md`** - Lyra AI optimization (LEVEL 0)
4. **`03-WORKFLOW-SELECTION.md`** - Workflow decision matrix
5. **`04-IMPLEMENTATION-STEPS.md`** - Execution flow
6. **`05-EXAMPLES.md`** - All workflow examples
7. **`06-DECISION-ENGINE.md`** - Decision logic
8. **`07-ERROR-HANDLING.md`** - Error recovery
9. **`08-PARALLEL-OPTIMIZER.md`** - Batch optimization (NEW)
10. **`09-PARALLEL-EXECUTION.md`** - Batch execution (NEW)

## Quick Summary

The `/systemcc` command is the ONLY command users need. It:
- Shows immediate detection feedback
- Optimizes requests with Lyra AI
- **NEW:** Detects batch operation opportunities
- Auto-selects the best workflow + optimization
- Executes everything automatically with batching where beneficial
- Completes tasks end-to-end

## Critical Execution Order

When `/systemcc` is invoked:

```
1. IMMEDIATE: Show detection message
   🎯 SYSTEMCC DETECTED - Command acknowledged and workflow initiated
   ✅ Following SYSTEMCC workflow instructions from CLAUDE.md

2. ALWAYS: Show Lyra optimization box
   [Full formatted optimization display]

3. AUTO: Select and execute workflow
   [Progress through all phases automatically]

4. COMPLETE: Finish entire task
   ✨ Task complete!
```

## Enforcement Levels

### LEVEL 0 - ABSOLUTE (Cannot be overridden)
- Detection feedback
- Lyra optimization display
- Automatic workflow execution
- Complete end-to-end flow

### What Users See
- Detection confirmation
- Lyra optimization
- Progress updates
- Completion summary

### What Users NEVER See
- Agent commands
- Manual workflow instructions
- "Run X next" prompts
- Internal routing logic

## Module Details

For complete implementation details, see:
- **Detection**: `systemcc/01-CRITICAL-DETECTION.md`
- **Optimization**: `systemcc/02-LYRA-OPTIMIZATION.md`
- **Selection**: `systemcc/03-WORKFLOW-SELECTION.md`
- **Execution**: `systemcc/04-IMPLEMENTATION-STEPS.md`
- **Examples**: `systemcc/05-EXAMPLES.md`
- **Logic**: `systemcc/06-DECISION-ENGINE.md`
- **Errors**: `systemcc/07-ERROR-HANDLING.md`

## Integration

Links with:
- `CLAUDE.md` - Core project instructions
- `SYSTEMCC-OVERRIDE.md` - Enforcement rules
- `middleware/lyra-universal.md` - Lyra system
- `middleware/workflow-enforcement.md` - Workflow rules

## Remember

**User types:** `/systemcc "any task"`
**Claude does:** EVERYTHING automatically

That's it. No other commands needed.