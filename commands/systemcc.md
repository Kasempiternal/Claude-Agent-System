# /systemcc - Master Command Router

⚠️ **CRITICAL: This is a modular command. ALL modules in `commands/systemcc/` MUST be loaded for proper operation.**

## 🚨 MANDATORY MODULE LOADING

**This file has been split into focused modules to prevent being ignored due to length.**

### Load ALL modules from `commands/systemcc/` directory:

1. **`00-INDEX.md`** - Module overview and loading order
2. **`01-CRITICAL-DETECTION.md`** - Detection feedback (LEVEL 0)
3. **`02-LYRA-OPTIMIZATION.md`** - Lyra AI optimization (LEVEL 0)
4. **`03-BUILD-CONFIG.md`** - Build/pipeline configuration detection (LEVEL 0) (NEW)
5. **`04-WORKFLOW-SELECTION.md`** - Workflow decision matrix
6. **`05-IMPLEMENTATION-STEPS.md`** - Execution flow
7. **`06-EXAMPLES.md`** - All workflow examples
8. **`07-DECISION-ENGINE.md`** - Decision logic
9. **`08-ERROR-HANDLING.md`** - Error recovery
10. **`09-PARALLEL-OPTIMIZER.md`** - Batch optimization
11. **`10-PARALLEL-EXECUTION.md`** - Batch execution

## Quick Summary

The `/systemcc` command is the ONLY command users need. It:
- Shows immediate detection feedback
- Optimizes requests with Lyra AI
- **NEW:** Detects and applies build/pipeline configuration rules
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

3. NEW: Detect and show build configuration (if present)
   📋 BUILD CONFIGURATION DETECTED
   [Display detected formatters, linters, and rules]

4. AUTO: Select and execute workflow
   [Progress through all phases automatically]

5. COMPLETE: Finish entire task
   ✨ Task complete!
```

## Enforcement Levels

### LEVEL 0 - ABSOLUTE (Cannot be overridden)
- Detection feedback
- Lyra optimization display
- Build configuration detection and application
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

For complete implementation details, see:
- **Detection**: `systemcc/01-CRITICAL-DETECTION.md`
- **Optimization**: `systemcc/02-LYRA-OPTIMIZATION.md`
- **Build Config**: `systemcc/03-BUILD-CONFIG.md`
- **Selection**: `systemcc/04-WORKFLOW-SELECTION.md`
- **Execution**: `systemcc/05-IMPLEMENTATION-STEPS.md`
- **Examples**: `systemcc/06-EXAMPLES.md`
- **Logic**: `systemcc/07-DECISION-ENGINE.md`
- **Errors**: `systemcc/08-ERROR-HANDLING.md`
- **Batch Opt**: `systemcc/09-PARALLEL-OPTIMIZER.md`
- **Batch Exec**: `systemcc/10-PARALLEL-EXECUTION.md`

## Integration

Links with:
- `CLAUDE.md` - Core project instructions
- `SYSTEMCC-OVERRIDE.md` - Enforcement rules
- `middleware/lyra-universal.md` - Lyra system
- `middleware/build-config-detector.md` - Build configuration detection
- `middleware/workflow-enforcement.md` - Workflow rules

## Remember

**User types:** `/systemcc "any task"`
**Claude does:** EVERYTHING automatically

That's it. No other commands needed.