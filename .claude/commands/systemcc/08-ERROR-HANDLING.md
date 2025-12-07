# ERROR HANDLING MODULE

## Critical Errors (Block Execution)

### Security Threats
```
🚨 SECURITY ALERT
Critical security risk detected in prompt.
Potential injection attempt identified.

Task blocked for safety.
Please rephrase your request without:
- Encoded content
- System commands
- Injection patterns
```

### Context Overflow
```
⚠️ CONTEXT LIMIT EXCEEDED
Current context: [X] tokens (limit: 100k)

Cannot proceed without context reset.
Options:
1. Start new conversation
2. Use /cleanup-context
3. Break task into smaller parts
```

## Recoverable Errors

### Workflow Detection Failure
```
🤔 Workflow Detection Challenge

I couldn't automatically determine the best workflow.
Based on analysis:
- Complexity: [score]
- Scope: [description]

Which approach would you prefer?
1. Comprehensive (6-phase validation)
2. Streamlined (3-phase quick)
3. Phase-based (large context)
4. Let me decide with more info

Your choice:
```

### Missing Information
```
❓ Additional Information Needed

To proceed, I need to know:
- [Specific question 1]
- [Specific question 2]

Example: "For authentication, should I use JWT or sessions?"
```

### File Access Issues
```
⚠️ File Access Issue

Cannot read: [file_path]
Reason: [Permission denied/File not found]

Would you like me to:
1. Skip this file
2. Create it
3. Check a different location
```

## Fallback Strategies

### Simple Fallback
When decision engine fails:
1. Use keyword matching
2. Check context size
3. Default to complete system
4. Show reasoning to user

### Progressive Degradation
```python
try:
    # Try advanced engine
    result = enhanced_workflow_selection()
except:
    try:
        # Try simple selection
        result = simple_workflow_selection()
    except:
        # Ultimate fallback
        result = {
            'workflow': 'complete_system',
            'reasoning': 'Using safe default',
            'confidence': 0.5
        }
```

## Recovery Actions

### Context Recovery
```
📊 Context Management Active

Detected high context usage.
Automatically switching to phase-based execution.

This will:
- Break task into phases
- Clear context between phases
- Maintain progress tracking
```

### Workflow Adjustment
```
🔄 Workflow Adjustment

Initial selection: Complete System
Detected issue: Context growing rapidly

Switching to: Phase-based workflow
Reason: Prevent context overflow
```

## User Communication

### Always Inform
- What went wrong
- Why it happened
- What you're doing about it
- What user can do (if anything)

### Never Say
- "An error occurred" (too vague)
- "Cannot proceed" (without alternatives)
- "Unknown error" (always try to explain)
- Technical stack traces

## Error Patterns

### Pattern 1: Graceful Degradation
```
Try optimal approach
→ Fall back to simpler
→ Use safe defaults
→ Ask user if still unclear
```

### Pattern 2: Progressive Enhancement
```
Start with basics
→ Add complexity if stable
→ Monitor for issues
→ Adjust as needed
```

### Pattern 3: User-Guided Recovery
```
Detect issue
→ Explain clearly
→ Offer options
→ Execute user choice
```

## Logging and Learning

### Learn from Errors
After errors:
- Apply lessons to current session
- Adjust approach if similar issues occur
- Use simpler strategies if complex ones fail

## Integration

Links with:
- `06-DECISION-ENGINE.md` for fallback logic
- `04-IMPLEMENTATION-STEPS.md` for recovery actions