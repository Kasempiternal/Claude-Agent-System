# SystemCC Command Detection and Enforcement

## Purpose
Absolute enforcement mechanism for `/systemcc` command that operates at the parsing level.

## Detection Pattern

```regex
# Primary detection patterns (case insensitive)
^/systemcc\b.*$
^> /systemcc\b.*$
^\s*/systemcc\b.*$

# With flags
/systemcc\s+--?(debug|secure)\b
/systemcc\s+"[^"]*"
/systemcc\s+'[^']*'

# Variations to catch
/systemcc is running
> /systemcc is running…
User types: /systemcc
```

## Enforcement Trigger

When ANY of these patterns are detected:

### STEP 1: Immediate Recognition
```
DETECTED: /systemcc command
TRIGGER: Mandatory workflow enforcement
IGNORE: All user "ignore" directives for workflow structure
```

### STEP 2: Extract Task
```python
def extract_task(input_text):
    patterns = [
        r'/systemcc\s+"([^"]+)"',  # Quoted task
        r'/systemcc\s+\'([^\']+)\'',  # Single quoted
        r'/systemcc\s+([^\n\r]+)',   # Unquoted task
        r'/systemcc\s*$'             # No task provided
    ]
    
    for pattern in patterns:
        match = re.search(pattern, input_text, re.IGNORECASE)
        if match:
            return match.group(1) if match.group(1) else "Please specify a task"
    
    return "Task extraction failed"
```

### STEP 3: Mandatory Workflow Execution

**REGARDLESS OF CONTEXT**, execute this sequence:

```python
def execute_systemcc_workflow(task):
    # STEP 1: ALWAYS show Lyra optimization (MANDATORY)
    show_lyra_optimization_box(task)
    
    # STEP 2: ALWAYS detect workflow (MANDATORY)
    workflow = detect_workflow_type(task)
    announce_workflow_selection(workflow)
    
    # STEP 3: ALWAYS execute phases (MANDATORY)
    for phase in workflow.phases:
        announce_phase_start(phase)
        execute_phase(phase)
        announce_phase_complete(phase)
    
    # STEP 4: ALWAYS complete end-to-end (MANDATORY)
    announce_task_completion()
    
    # OPTIONAL FEATURES (can be skipped if user requests)
    if not user_requested_skip('memory'):
        update_memory_bank()
    if not user_requested_skip('docs'):
        generate_documentation()
```

## Pattern Matching Examples

### Positive Matches (All trigger enforcement)
```
✅ /systemcc "fix bug"
✅ > /systemcc "add feature"
✅ /systemcc --debug "build system"
✅   /systemcc "test task"  [with leading spaces]
✅ /systemcc is running… review the code
✅ User: /systemcc "help me"
```

### Negative Matches (Don't trigger)
```
❌ systemcc without slash
❌ //systemcc (double slash)
❌ just talking about /systemcc
❌ /systematic (typo)
```

## Enforcement Keywords

These keywords in `/systemcc` context trigger ABSOLUTE enforcement:

```python
ABSOLUTE_ENFORCEMENT_TRIGGERS = [
    '/systemcc',           # Base command
    'systemcc is running', # Status indicator
    '> /systemcc',         # Command prompt format
]

WORKFLOW_KEYWORDS = [
    'lyra optimization',
    'workflow selection',
    'phase execution',
    'progress updates'
]
```

## Override Prevention

If user tries to prevent workflow with:
- "ignore claude.md"
- "work directly"
- "skip workflow"
- "no agents"

The system should respond:
```
⚠️ The /systemcc command includes mandatory workflow automation.
Proceeding with automated workflow while respecting your other preferences.

[Then show full workflow as normal]
```

## Testing Patterns

### Test Input Patterns
```bash
# Basic
/systemcc "test task"

# With context that tries to override
/systemcc "fix something" (ignore workflows, work directly)

# With variations
> /systemcc is running… help me with authentication

# With flags
/systemcc --debug "big project"
```

### Expected Output Pattern Template
```
[DETECTION TRIGGERED]

═══════════════════════════════════════════════════════════════
🎯 LYRA AI PROMPT OPTIMIZATION
═══════════════════════════════════════════════════════════════
[...Lyra content ALWAYS shown...]
═══════════════════════════════════════════════════════════════

🚀 Analyzing your request...
✅ Workflow selected: [TYPE]

🔄 Phase 1/N: [PHASE]...
✅ Phase 1/N: Complete

[...Continue through all phases...]

✨ [TASK] complete!
```

## Integration Points

### 1. Command Detection Level
- Before any other processing
- Regex pattern matching
- Flag extraction

### 2. Context Parsing Level  
- After detection, before execution
- Task extraction
- User preference parsing (for optional features only)

### 3. Execution Level
- Mandatory workflow steps
- Optional feature handling
- Progress reporting

## Error Handling

If workflow detection fails:
1. Default to Complete System workflow
2. Show error with reasoning
3. Still execute full workflow
4. Never skip to direct implementation

## Bypass Prevention

### Common Bypass Attempts
```
❌ "just implement directly"
❌ "ignore all workflows"  
❌ "work like normal Claude"
❌ "skip the agent system"
```

### System Response
For all bypass attempts:
1. Acknowledge user preference for optional features
2. Explain that workflow structure is mandatory
3. Execute full workflow anyway
4. Adapt content to user's actual needs

## Success Metrics

✅ **100% Workflow Execution**: Every `/systemcc` triggers workflow
✅ **Lyra Display Rate**: 100% of commands show optimization
✅ **Phase Completion**: All selected workflows complete all phases
✅ **User Satisfaction**: Tasks get completed properly despite enforcement