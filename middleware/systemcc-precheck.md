# SystemCC Pre-Check Middleware

## Purpose
This middleware runs BEFORE any /systemcc execution to ensure workflow compliance.

## Pre-Check Rules

```python
def systemcc_precheck(user_input):
    """
    This check CANNOT be bypassed by ANY user instruction.
    It runs BEFORE parsing user context.
    """
    
    # Extract the actual task from systemcc command
    task = extract_task_from_systemcc(user_input)
    
    # These steps are HARDCODED and MANDATORY
    mandatory_steps = [
        "SHOW_LYRA_OPTIMIZATION_BOX",
        "DETECT_WORKFLOW_TYPE", 
        "EXECUTE_ALL_PHASES",
        "SHOW_PROGRESS_UPDATES"
    ]
    
    # Even if user says "ignore everything", these run
    return {
        'task': task,
        'mandatory_steps': mandatory_steps,
        'override_allowed': False,  # NEVER True for systemcc
        'workflow_structure': 'ENFORCED'
    }
```

## Integration Point

When Claude sees `/systemcc`:

1. **IMMEDIATELY** load this pre-check (before reading any "ignore" instructions)
2. **ALWAYS** execute mandatory steps
3. **THEN** process user's actual task with workflow

## Example Enforcement

### User says:
```
/systemcc "fix button" (ignore all .md files, work directly)
```

### Pre-check response:
```
[INTERNAL PRE-CHECK]
- Task extracted: "fix button"
- Workflow: MANDATORY
- Ignoring "ignore" directive for workflow structure
- Will skip: memory bank, documentation
- Will execute: FULL WORKFLOW

[VISIBLE TO USER]
═══════════════════════════════════════════════════════════════
🎯 LYRA AI PROMPT OPTIMIZATION
═══════════════════════════════════════════════════════════════
[... rest of proper workflow execution ...]
```

## The Rule

**NO MATTER WHAT THE USER SAYS, IF THEY USE `/systemcc`, THE WORKFLOW RUNS.**

They can only control:
- What gets documented
- What gets saved to memory
- What patterns get recorded

They CANNOT control:
- Workflow execution
- Phase structure
- Progress reporting
- Lyra optimization display