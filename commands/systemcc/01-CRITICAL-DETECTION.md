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

## Pattern Detection Display (NEW - Phase 1.3)

After showing the mandatory detection message, run pattern detection and display results (if patterns found):

```
🎯 SYSTEMCC DETECTED - Command acknowledged and workflow initiated
✅ Following SYSTEMCC workflow instructions from CLAUDE.md

🔍 ANALYZING REQUEST...

💡 PATTERN DETECTED: 🔒 Authentication
   Recommendation: Complete system workflow with security validation
```

### Pattern Detection Rules

1. **Run pattern detection** using `middleware/pattern-detector.md`:
   - Analyze user request keywords
   - Check loaded file paths
   - Review session history (if available)

2. **Display if patterns found** (confidence > 0.3):
   - Single pattern: Show pattern name and recommendation
   - Multiple patterns: Show top 2-3 patterns with confidence
   - No patterns: Skip display (continue silently)

3. **Non-blocking**: Pattern detection is informational only
   - Provides hints for workflow selection
   - Enables security features if needed
   - Never blocks or delays the workflow

### Display Examples

**High Confidence (Single Pattern)**:
```
💡 PATTERN DETECTED: 🔒 Authentication
   Recommendation: Complete system workflow with security validation
```

**Multiple Patterns**:
```
💡 PATTERNS DETECTED:
   • 🔒 Authentication (high confidence)
   • 💾 Database (medium confidence)
   Recommendation: Complete system workflow
```

**Low/No Confidence**:
```
[No display - proceed silently to Lyra optimization]
```

### Integration with Session State

If session state exists, display session context BEFORE pattern detection:

```
🎯 SYSTEMCC DETECTED - Command acknowledged and workflow initiated
✅ Following SYSTEMCC workflow instructions from CLAUDE.md

📋 SESSION CONTEXT (Active for 2h 15m)
🎯 Current Focus: User authentication system
✅ Completed: 2 tasks | 📝 Modified: 3 files

🔍 ANALYZING REQUEST...

💡 PATTERN DETECTED: 🔒 Authentication
   Recommendation: Complete system workflow with security validation
   Note: Continuing authentication work from earlier session
```

## Hook Execution (Phase 2.2)

After showing the mandatory detection message, execute UserPromptSubmit hooks:

```python
# Show detection message first (MANDATORY)
print("🎯 SYSTEMCC DETECTED - Command acknowledged and workflow initiated")
print("✅ Following SYSTEMCC workflow instructions from CLAUDE.md")

# Build context for hooks
context = {
    "user_request": user_request,
    "loaded_files": get_loaded_files(),
    "session_state": load_session_state(),
    "working_directory": os.getcwd(),
    "timestamp": datetime.now().isoformat()
}

# Execute UserPromptSubmit hooks
hook_results = execute_hooks("UserPromptSubmit", context)

# Display session context if exists
if "session_state" in context and context["session_state"]:
    display_session_context(context["session_state"])

# Display hook results
print("\n🔍 ANALYZING REQUEST...\n")

for result in hook_results:
    if result["status"] == "success" and "display_message" in result.get("data", {}):
        message = result["data"]["display_message"]
        if message:
            print(message)
            print()

# Store workflow hints for Phase 4
workflow_hints = aggregate_workflow_hints(hook_results)
```

### Expected Hook Results

**auto-pattern-detection** (priority 10):
- Detects patterns in user request
- Suggests optimal workflow
- Enables security scanning if needed
- Displays: "💡 PATTERN DETECTED: ..."

**context-analyzer** (priority 15):
- Analyzes loaded files
- Determines working domain
- Detects tech stack
- Displays: "📁 CONTEXT: ..."

## Integration Points

After showing detection feedback and executing hooks:
1. Pass `workflow_hints` to `04-WORKFLOW-SELECTION.md`
2. Continue to `02-LYRA-OPTIMIZATION.md`
3. Then proceed to `03-BUILD-CONFIG.md`
4. Then `04-WORKFLOW-SELECTION.md` (uses workflow hints)
5. Follow the complete workflow chain