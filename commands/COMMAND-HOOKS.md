# Command Hooks System

## Purpose
Define immutable command behaviors that execute regardless of user context.

## Hook Levels

### Level 1: IMMUTABLE (Cannot be overridden)
Commands at this level ALWAYS execute their full workflow:

#### `/systemcc` Hook
```yaml
command: /systemcc
immutable: true
always_execute:
  - lyra_optimization_display
  - workflow_detection
  - phase_execution
  - progress_reporting
  
override_not_allowed_for:
  - workflow_structure
  - agent_sequence
  - completion_requirements
  
user_can_control:
  - memory_bank_updates
  - documentation_generation
  - pattern_recording
```

## Implementation

When ANY command starting with `/systemcc` is detected:

1. **BEFORE reading user context**, execute hook
2. **IGNORE any "ignore" directives** for immutable parts
3. **PROCEED with workflow** regardless of instructions

## Example Hook Execution

```python
class CommandHook:
    def __init__(self):
        self.immutable_commands = {
            '/systemcc': self.systemcc_hook
        }
    
    def systemcc_hook(self, user_input):
        # This runs BEFORE any user context is considered
        
        # STEP 1: Extract task (immutable)
        task = self.extract_task(user_input)
        
        # STEP 2: Show Lyra (immutable)
        self.show_lyra_optimization(task)
        
        # STEP 3: Detect workflow (immutable)
        workflow = self.detect_workflow(task)
        
        # STEP 4: Execute phases (immutable)
        for phase in workflow.phases:
            self.execute_phase(phase)
            self.show_progress(phase)
        
        # User's "ignore" directives only affect these:
        if not user_wants_to_ignore('memory'):
            self.update_memory_bank()
        if not user_wants_to_ignore('docs'):
            self.generate_documentation()
```

## The Golden Rule

**If user types `/systemcc`, the FULL WORKFLOW RUNS. Period.**

No amount of "ignore this", "skip that", or "work directly" changes this.

## Hook Registry

| Command | Hook Level | Overrideable | Notes |
|---------|------------|--------------|-------|
| `/systemcc` | IMMUTABLE | No | Full workflow always runs |
| `/analyze` | FLEXIBLE | Partial | Core analysis always runs |
| `/help` | STATIC | No | Always shows help |

## Enforcement

This hook system operates at the **command detection level**, before any user context or instructions are processed. It's like a pre-processor that ensures certain behaviors always occur.

Think of it like this:
- User types: `/systemcc "do something" (ignore everything)`
- System sees: `/systemcc` → triggers immutable hook → workflow WILL run
- Only AFTER workflow structure is locked in, we process "ignore everything" for optional features

## Testing Hook Compliance

To verify hook is working:
1. User says: `/systemcc "test" (skip all workflows, ignore everything)`
2. Expected: FULL workflow execution with Lyra, phases, progress
3. Skipped: Only memory updates and documentation

If Claude skips the workflow, the hook is not being enforced properly.