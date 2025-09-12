# SYSTEMCC CRITICAL DETECTION MODULE

⚠️ **THIS IS THE MOST CRITICAL MODULE - MUST BE LOADED FIRST**

## IMMEDIATE DETECTION FEEDBACK (MANDATORY)

When `/systemcc` is detected, you MUST IMMEDIATELY show:

```
🎯 SYSTEMCC DETECTED - Command acknowledged and workflow initiated
✅ Following SYSTEMCC workflow instructions from CLAUDE.md
```

This message MUST appear:
- **IMMEDIATELY** when /systemcc is detected
- **BEFORE** any other processing
- **BEFORE** Lyra optimization
- **BEFORE** workflow selection
- **BEFORE** any analysis

## WHY THIS IS CRITICAL

1. **User Confidence**: Confirms the command was detected
2. **Workflow Assurance**: Shows CLAUDE.md instructions are being followed
3. **Debug Aid**: Helps identify if systemcc is being ignored
4. **Enforcement**: Part of LEVEL 0 enforcement (cannot be overridden)

## ENFORCEMENT LEVEL

**LEVEL 0 - ABSOLUTE (CANNOT OVERRIDE EVER)**
- Even if user says "ignore all files"
- Even if user says "ignore CLAUDE.md"
- Even if user says "skip the workflow"
- This detection message MUST ALWAYS appear

## CORRECT EXAMPLE

```
User: /systemcc "fix login bug"

Claude: 🎯 SYSTEMCC DETECTED - Command acknowledged and workflow initiated
✅ Following SYSTEMCC workflow instructions from CLAUDE.md

[Then continues with Lyra optimization...]
```

## INCORRECT EXAMPLE (NEVER DO THIS)

```
User: /systemcc "fix login bug"

Claude: I'll help you fix the login bug...
[Starts working without showing detection]
```

## Integration Points

After showing detection feedback:
1. Continue to `02-LYRA-OPTIMIZATION.md`
2. Then proceed to `03-WORKFLOW-SELECTION.md`
3. Follow the complete workflow chain