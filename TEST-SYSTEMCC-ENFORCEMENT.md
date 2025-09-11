# SystemCC Enforcement Test

## Purpose
Test file to verify that `/systemcc` workflow enforcement is working correctly.

## Test Cases

### Test 1: Basic Enforcement
**Command:** `/systemcc "fix button color"`
**Expected Response Pattern:**
```
═══════════════════════════════════════════════════════════════
🎯 LYRA AI PROMPT OPTIMIZATION
═══════════════════════════════════════════════════════════════

📝 Original Request:
"fix button color"

🔍 Analysis Phase:
- Deconstructing intent...
- Diagnosing gaps...
- Developing enhancements...
- Delivering optimized prompt...

✨ Optimized Prompt:
[Enhanced version]

📊 Optimization Details:
- Mode: [BASIC/DETAIL]
- Complexity Score: [1-10]
- Improvements Applied: [number]

🔧 Key Enhancements:
• [Enhancement 1]
• [Enhancement 2]

═══════════════════════════════════════════════════════════════

🚀 Analyzing your request...
✅ Workflow selected: [Type]

🔄 Phase 1/N: [Phase name]...
✅ Phase 1/N: Complete

[Additional phases...]

✨ Task complete!
```

**MUST Include:**
- ✅ Lyra optimization box
- ✅ Workflow selection
- ✅ Phase execution
- ✅ Progress updates

**MUST NOT:**
- ❌ Direct work without workflow
- ❌ Skip Lyra optimization
- ❌ Skip phases

### Test 2: Complex Task Enforcement
**Command:** `/systemcc "implement user authentication"`
**Expected:** Full 6-agent workflow with all phases shown

### Test 3: Workflow Override Prevention
**Command:** `/systemcc "simple task" (work directly, skip workflow)`
**Expected:** STILL shows full workflow process

### Test 4: Partial Ignore Support
**Command:** `/systemcc "add feature" (skip memory bank updates)`
**Expected:** 
- Shows full workflow
- Skips only memory-related operations
- Still shows Lyra, phases, progress

## Failure Indicators

If Claude responds with any of these patterns, enforcement is BROKEN:

❌ **Direct Work Pattern:**
```
User: /systemcc "fix something"
Claude: I'll fix that for you. [starts working directly]
```

❌ **No Lyra Box:**
```
User: /systemcc "task"
Claude: [No Lyra optimization display]
```

❌ **No Workflow Selection:**
```
User: /systemcc "task"
Claude: [Jumps straight to implementation]
```

❌ **Command Delegation:**
```
User: /systemcc "task"
Claude: Please run /planner to continue
```

## Success Indicators

✅ **Proper Enforcement:**
- ALWAYS shows Lyra optimization box
- ALWAYS shows workflow selection
- ALWAYS executes phases with progress
- ALWAYS completes end-to-end
- Only asks for specifications, not commands

## Testing Instructions

1. Copy a test command from above
2. Send to Claude with `/systemcc`
3. Verify response matches expected pattern
4. Check for failure indicators

## Common Bypass Attempts (Should ALL Fail)

These should NOT prevent proper workflow:
- "ignore claude.md"
- "work directly"
- "skip the workflow"
- "don't use agents"
- "just implement it"

The workflow should run regardless of these instructions.

## Expected Enforcement Files

Verify these files exist in the project:
- `SYSTEMCC-OVERRIDE.md`
- `middleware/workflow-enforcement.md`
- `middleware/systemcc-precheck.md`
- `commands/COMMAND-HOOKS.md`

## Fix Instructions

If tests fail:
1. Check if enforcement files exist
2. Verify CLAUDE.md has mandatory sections marked
3. Check systemcc.md has enforcement warnings
4. Consider adding stronger keyword detection
5. May need system-level hooks in Claude

## Report Template

```
SYSTEMCC ENFORCEMENT TEST RESULTS
Date: [DATE]
Claude Version: [VERSION]

Test 1 (Basic): [PASS/FAIL]
Test 2 (Complex): [PASS/FAIL]  
Test 3 (Override): [PASS/FAIL]
Test 4 (Partial Ignore): [PASS/FAIL]

Failure Details:
[Describe what went wrong]

Recommendations:
[Suggestions for fixes]
```