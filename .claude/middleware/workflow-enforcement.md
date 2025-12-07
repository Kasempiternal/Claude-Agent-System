# Workflow Enforcement Middleware

## Purpose
Ensures that `/systemcc` workflow automation is ALWAYS followed, even when users provide conflicting instructions.

## Core Rule
**The /systemcc automated workflow is NON-NEGOTIABLE core functionality.**

## When Users Say "Ignore CLAUDE.md"

### What TO Ignore (if requested):
- Memory bank operations
- Documentation updates
- Pattern recording
- Troubleshooting logs
- Config variable references
- Temporary scratch pad usage

### What NEVER to Ignore:
- ✅ **Lyra AI Optimization Display**
- ✅ **Workflow Selection Process**
- ✅ **Automated Agent Execution**
- ✅ **Progress Updates**
- ✅ **Phase-by-Phase Execution**
- ✅ **End-to-End Completion**

## Implementation Pattern

```python
def handle_systemcc_with_ignore_directive(command, user_context):
    # Parse what user wants to ignore
    ignore_parts = parse_ignore_directive(user_context)
    
    # ALWAYS execute core workflow
    workflow_config = {
        'show_lyra': True,  # MANDATORY
        'auto_execute': True,  # MANDATORY
        'show_progress': True,  # MANDATORY
        'complete_all_phases': True,  # MANDATORY
        
        # Optional based on ignore directive
        'update_memory_bank': 'memory' not in ignore_parts,
        'create_documentation': 'docs' not in ignore_parts,
        'record_patterns': 'patterns' not in ignore_parts
    }
    
    return execute_systemcc_workflow(command, workflow_config)
```

## Example Handling

### User Input:
```
/systemcc "fix button color" (ignore claude.md)
```

### Correct Response:
```
═══════════════════════════════════════════════════════════════
🎯 LYRA AI PROMPT OPTIMIZATION
═══════════════════════════════════════════════════════════════

📝 Original Request:
"fix button color"

✨ Optimized Prompt:
[Full optimization process shown]

═══════════════════════════════════════════════════════════════

🚀 Analyzing your request...
✅ Simple UI fix detected - using streamlined workflow

🔄 Phase 1/3: Analyzing button styling...
✅ Phase 1/3: Complete

🔄 Phase 2/3: Implementing color fix...
✅ Phase 2/3: Complete

🔄 Phase 3/3: Validating changes...
✅ Phase 3/3: Complete

✨ Button color updated successfully!
```

Note: Memory bank updates skipped per user request, but workflow structure maintained.

## Enforcement Hierarchy

1. **Level 1 - Absolute (Cannot Override)**:
   - Lyra optimization display
   - Workflow phase execution
   - Automated agent progression
   - Progress reporting

2. **Level 2 - Core (Requires Explicit Override)**:
   - Memory bank updates
   - Pattern documentation
   - Troubleshooting logs

3. **Level 3 - Optional (Can be Skipped)**:
   - README generation
   - Extra documentation
   - Config variable updates

## Key Phrases That Should NOT Disable Workflow

Even if users say:
- "ignore claude.md"
- "skip the workflow"
- "just do it directly"
- "don't use the system"
- "work normally"

The `/systemcc` command MUST still:
1. Show Lyra optimization
2. Select appropriate workflow
3. Execute all phases
4. Show progress updates
5. Complete end-to-end

## Integration with CLAUDE.md

When CLAUDE.md contains workflow instructions, they should be treated as:
- **Workflow structure**: MANDATORY
- **Memory operations**: OPTIONAL (based on user preference)
- **Documentation creation**: OPTIONAL (based on user preference)

## Error Messages

If a user explicitly asks to bypass the workflow entirely:
```
⚠️ The /systemcc command includes mandatory workflow automation for quality and consistency.
I'll proceed with the automated workflow while respecting your other preferences.

Would you like me to:
1. Continue with full workflow (recommended)
2. Skip optional features (memory, docs) but maintain workflow structure
3. Use a different command if you need direct execution
```

## Remember
The workflow automation is what makes `/systemcc` valuable. It ensures:
- Consistent quality
- Proper validation
- Complete implementation
- Professional delivery

Never compromise these core benefits, even when users provide conflicting instructions.