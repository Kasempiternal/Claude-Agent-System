# MEMORY-UPDATE MODULE - Automatic Learning Capture

## 🎯 Purpose
Automatically update ALL memory bank files after task completion to preserve learnings for future sessions.

## ⚡ LEVEL 0 ENFORCEMENT
This memory update phase is **ABSOLUTELY MANDATORY** and **CANNOT BE SKIPPED**.
Every session MUST contribute to the knowledge base.

## 📁 Memory Files Updated

### Core Memory Structure
```
ClaudeFiles/memory/
├── CLAUDE-activeContext.md       # Long-term session history
├── CLAUDE-patterns.md            # Reusable code patterns
├── CLAUDE-decisions.md           # Architecture choices
├── CLAUDE-troubleshooting.md     # Problem solutions
├── CLAUDE-dont_dos.md            # User preferences
└── CLAUDE-session-state.json     # Current session tracking (NEW)
```

### Memory Types

**Long-term Memory** (Permanent - Markdown files):
- `CLAUDE-patterns.md` - Reusable patterns (never expires)
- `CLAUDE-decisions.md` - Architecture decisions (permanent)
- `CLAUDE-troubleshooting.md` - Solution database (permanent)
- `CLAUDE-dont_dos.md` - User preferences (permanent)

**Short-term Memory** (Session - JSON file):
- `CLAUDE-session-state.json` - Current session context (24h expiry)
  - Commands executed this session
  - Files modified and change history
  - Active task and next steps
  - Pattern detection across commands

## 🔄 Update Trigger Points

```python
TRIGGER_POINTS = [
    "workflow_complete",      # After any workflow finishes
    "user_interruption",      # User says "no/stop/don't"
    "error_resolved",         # After fixing an error
    "pattern_discovered",     # New reusable pattern found
    "decision_made",         # Architecture choice made
    "review_complete"        # After post-execution review
]
```

## 📝 Update Process

### Phase Initiation
```
📝 AUTO-UPDATING MEMORY BANKS...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Analyzing session for learnings...
```

### 1. Active Context Update
```python
def update_active_context():
    context = {
        "date": datetime.now(),
        "task": current_task_description,
        "status": task_completion_status,
        "files_modified": list_of_changed_files,
        "key_changes": summary_of_changes,
        "next_steps": any_follow_up_tasks,
        "session_duration": time_elapsed
    }
    append_to_activeContext(context)
```

### 2. Pattern Extraction
```python
def extract_patterns():
    patterns = []

    # Analyze code changes for patterns
    for change in code_changes:
        if is_reusable_pattern(change):
            patterns.append({
                "name": pattern_name,
                "category": pattern_type,
                "description": what_it_solves,
                "code": implementation_example,
                "files": where_used
            })

    update_patterns_md(patterns)
```

### 3. Decision Recording
```python
def record_decisions():
    decisions = []

    # Capture architectural choices
    for choice in session_choices:
        if is_architectural_decision(choice):
            decisions.append({
                "context": why_needed,
                "decision": what_decided,
                "rationale": reasoning,
                "alternatives": other_options,
                "impact": consequences
            })

    update_decisions_md(decisions)
```

### 4. Troubleshooting Documentation
```python
def document_troubleshooting():
    issues = []

    # Record resolved problems
    for problem in problems_solved:
        issues.append({
            "error": error_message,
            "cause": root_cause,
            "solution": how_fixed,
            "prevention": avoid_future,
            "files": affected_files
        })

    update_troubleshooting_md(issues)
```

### 5. Don't Dos Capture
```python
def capture_dont_dos():
    dont_dos = []

    # Process user corrections
    for feedback in user_feedback:
        if is_negative_feedback(feedback):
            dont_dos.append({
                "date": timestamp,
                "context": what_was_happening,
                "feedback": user_statement,
                "learned": what_to_avoid,
                "category": feedback_type
            })

    update_dont_dos_md(dont_dos)
```

### 6. Session State Tracking (NEW - Phase 1.2)
```python
def update_session_state():
    """
    Track short-term session context for resumability.
    See: middleware/session-state-tracker.md
    """

    # Load or create session
    session = load_session_state()

    # Record this command
    session["commands_executed"].append({
        "timestamp": current_time,
        "command": user_request,
        "workflow": selected_workflow,
        "duration_seconds": elapsed_time,
        "status": "completed"
    })

    # Track file modifications
    for file_path in files_modified_this_command:
        if file_path in session["files_modified"]:
            # Update existing entry
            session["files_modified"][file_path]["modification_count"] += 1
            session["files_modified"][file_path]["last_modified"] = current_time
            session["files_modified"][file_path]["changes_summary"] += f", {change_description}"
        else:
            # New file entry
            session["files_modified"][file_path] = {
                "first_modified": current_time,
                "last_modified": current_time,
                "modification_count": 1,
                "changes_summary": change_description,
                "workflows": [selected_workflow]
            }

    # Detect patterns across commands
    patterns = extract_patterns_from_command(user_request)
    session["patterns_detected"].extend(patterns)
    session["patterns_detected"] = deduplicate(session["patterns_detected"])

    # Update context snapshot
    session["context_snapshot"] = {
        "active_task": infer_active_task(session["commands_executed"]),
        "completed_steps": extract_completed_steps(workflow_summary),
        "next_steps": extract_next_steps(workflow_output),
        "key_files": most_frequently_modified(session["files_modified"]),
        "blocking_issues": identify_blockers(workflow_errors)
    }

    # Update statistics
    session["statistics"] = {
        "total_commands": len(session["commands_executed"]),
        "total_files_modified": len(session["files_modified"]),
        "total_workflows": len(session["workflows_used"]),
        "session_duration_minutes": calculate_duration(session["created_at"])
    }

    # Save session state
    save_session_state(session)
```

### 7. Checkpoint Creation (NEW - Phase 3.2)
```python
def create_checkpoint(checkpoint_type="auto"):
    """
    Create execution state checkpoint for session resumption.
    Enables recovery from interruptions and context restoration.

    See: Enhanced CLAUDE-activeContext.md with checkpoint support
    """

    # Generate checkpoint ID
    checkpoint_id = generate_checkpoint_id(checkpoint_type)

    # Capture complete execution state
    checkpoint = {
        "checkpoint_id": checkpoint_id,
        "created_at": current_time,
        "checkpoint_type": checkpoint_type,  # auto, manual, milestone, error
        "status": "stable",  # stable, unstable, interrupted

        # Session metadata
        "session": {
            "session_id": current_session_id,
            "start_time": session_start_time,
            "duration_minutes": calculate_duration(),
            "commands_count": len(session["commands_executed"])
        },

        # Current execution state
        "execution": {
            "current_task": active_task_description,
            "task_complexity": task_complexity_score,
            "scope_impact": scope_impact_score,
            "workflow_type": selected_workflow,
            "current_phase": current_workflow_phase,
            "current_agent": current_agent_name,
            "overall_completion": calculate_completion_percent(),
            "agents_completed": list_of_completed_agents,
            "agents_remaining": list_of_remaining_agents
        },

        # Files state
        "files": {
            "modified": list_of_modified_files_with_timestamps,
            "in_progress": files_currently_being_modified,
            "to_modify": files_planned_for_modification
        },

        # Context snapshot
        "context": {
            "active_goals": current_active_goals,
            "completed_objectives": completed_objectives_list,
            "next_steps": immediate_next_actions,
            "blocking_issues": current_blockers_or_errors,
            "key_decisions": decisions_made_this_session
        },

        # Memory state
        "memory": {
            "patterns_discovered": patterns_found_this_session,
            "decisions_recorded": decisions_this_session,
            "issues_solved": problems_resolved_this_session,
            "context_size": estimate_context_tokens()
        },

        # Recovery metadata
        "recovery": {
            "resume_point": where_to_continue_from,
            "resume_instructions": how_to_resume,
            "required_context": what_context_needed,
            "validation_steps": verify_before_resume
        }
    }

    # Update activeContext.md with checkpoint
    update_activeContext_checkpoint(checkpoint)

    # Save checkpoint snapshot to session state
    save_checkpoint_snapshot(checkpoint)

    return checkpoint_id
```

### 8. Checkpoint Triggers (NEW - Phase 3.2)
```python
CHECKPOINT_TRIGGERS = {
    # Automatic checkpoints
    "phase_transition": {
        "when": "Before/after major workflow phase changes",
        "type": "auto",
        "priority": "high"
    },
    "milestone_reached": {
        "when": "Significant progress milestones",
        "type": "milestone",
        "priority": "medium"
    },
    "before_risky_operation": {
        "when": "Before potentially breaking changes",
        "type": "auto",
        "priority": "high"
    },
    "error_occurred": {
        "when": "When errors or interruptions happen",
        "type": "error",
        "priority": "critical"
    },

    # Manual checkpoints
    "session_end": {
        "when": "At end of work session",
        "type": "manual",
        "priority": "high"
    },
    "user_request": {
        "when": "User explicitly requests checkpoint",
        "type": "manual",
        "priority": "high"
    },

    # Time-based checkpoints
    "hourly_auto": {
        "when": "Every 60 minutes of active work",
        "type": "auto",
        "priority": "low"
    },
    "context_pressure": {
        "when": "Context usage exceeds 70% of limit",
        "type": "auto",
        "priority": "high"
    }
}

def should_create_checkpoint(event):
    """Determine if checkpoint should be created for this event"""
    trigger = CHECKPOINT_TRIGGERS.get(event)
    if not trigger:
        return False

    # High/Critical priority always create
    if trigger["priority"] in ["high", "critical"]:
        return True

    # Medium priority - check frequency
    if trigger["priority"] == "medium":
        return time_since_last_checkpoint() > 30  # minutes

    # Low priority - check frequency
    return time_since_last_checkpoint() > 60  # minutes
```

### 9. Resume from Checkpoint (NEW - Phase 3.2)
```python
def resume_from_checkpoint(checkpoint_id=None):
    """
    Resume interrupted session from checkpoint.
    Restores execution state and continues from interruption point.
    """

    # Load checkpoint (latest if ID not specified)
    if checkpoint_id is None:
        checkpoint = load_latest_checkpoint()
    else:
        checkpoint = load_checkpoint_by_id(checkpoint_id)

    if not checkpoint:
        return "No checkpoint found to resume from"

    # Display resume information
    print(f"""
🔄 RESUMING FROM CHECKPOINT
━━━━━━━━━━━━━━━━━━━━━━━━

Checkpoint ID: {checkpoint["checkpoint_id"]}
Created: {checkpoint["created_at"]}
Session Duration: {checkpoint["session"]["duration_minutes"]} minutes

📋 RESTORING STATE:
━━━━━━━━━━━━━━━━━━━

Task: {checkpoint["execution"]["current_task"]}
Workflow: {checkpoint["execution"]["workflow_type"]}
Progress: {checkpoint["execution"]["overall_completion"]}%

Completed Phases:
{format_completed_agents(checkpoint["execution"]["agents_completed"])}

Next Phase: {checkpoint["execution"]["current_agent"]}

Files Modified ({len(checkpoint["files"]["modified"])}):
{format_file_list(checkpoint["files"]["modified"])}

🎯 NEXT STEPS:
{format_next_steps(checkpoint["context"]["next_steps"])}
""")

    # Restore session state
    restore_session_state(checkpoint["session"])

    # Restore execution context
    restore_execution_context(checkpoint["execution"])

    # Restore file tracking
    restore_file_state(checkpoint["files"])

    # Validate restoration
    if not validate_checkpoint_restoration(checkpoint):
        print("⚠️ Warning: Some context could not be fully restored")
        print("Recommend starting fresh if issues occur")

    # Continue from resume point
    resume_point = checkpoint["recovery"]["resume_point"]

    print(f"""
✅ STATE RESTORED SUCCESSFULLY

Resuming from: {resume_point}

{checkpoint["recovery"]["resume_instructions"]}
""")

    return checkpoint
```

## 🚨 Interruption Handling

### When User Says "No/Stop/Don't"
```python
def handle_user_interruption(user_input):
    # Immediate capture
    interruption = {
        "timestamp": now(),
        "action_stopped": current_action,
        "user_words": user_input,
        "context": full_context
    }

    # Quick update
    urgent_update_dont_dos(interruption)

    # Response
    return "Got it! I'll remember not to do that. What would you prefer?"
```

## 📊 Update Summary Format

### Minimal Update (Simple Task)
```markdown
✅ Memory banks updated (3 items):
• Patterns: 1 new pattern added
• Decisions: 0 (no new decisions)
• Troubleshooting: 1 issue resolved
```

### Full Update (Complex Task)
```markdown
📝 MEMORY UPDATE COMPLETE
━━━━━━━━━━━━━━━━━━━━━━

✅ Patterns: 3 new patterns discovered
   • API error handling pattern
   • React hooks optimization
   • Database connection pooling

✅ Decisions: 2 architectural choices
   • PostgreSQL for JSON support
   • Event-driven architecture

✅ Issues: 4 problems solved
   • TypeScript inference fix
   • Build optimization
   • Memory leak prevention
   • CORS configuration

✅ Preferences: 1 user preference noted
   • Don't create summary documents

✅ Session: Updated (NEW - Phase 1.2)
   • 3 commands this session
   • 5 files modified
   • Patterns detected: authentication, database, api

Session knowledge preserved for future!
```

## 🎯 Smart Update Features

### Deduplication
```python
def deduplicate_entries():
    # Check for existing patterns
    existing_patterns = load_patterns_md()
    new_patterns = filter_unique(patterns, existing_patterns)

    # Merge similar issues
    similar_issues = find_similar(new_issues, existing_issues)
    merged_issues = merge_solutions(similar_issues)

    return deduplicated_content
```

### Categorization
```python
PATTERN_CATEGORIES = [
    "Performance",
    "Security",
    "Error Handling",
    "State Management",
    "API Design",
    "Testing",
    "Architecture"
]

def categorize_pattern(pattern):
    # Auto-categorize based on content
    return best_matching_category(pattern, PATTERN_CATEGORIES)
```

### Priority Marking
```python
def mark_priority(entry):
    if "security" in entry.lower():
        return "🔒 HIGH"
    if "performance" in entry.lower():
        return "⚡ MEDIUM"
    return "📝 NORMAL"
```

## 💾 Batch vs Real-time Updates

### Real-time Updates (Immediate)
- User interruptions/corrections
- Critical security findings
- Breaking changes discovered
- Error resolutions

### Batch Updates (End of task)
- Pattern collection
- Decision documentation
- Performance optimizations
- Code improvements

## 📈 Learning Analytics

```markdown
## Session Learning Metrics
━━━━━━━━━━━━━━━━━━━━━━━━

📊 This Session:
• Patterns discovered: 5
• Decisions made: 3
• Issues resolved: 7
• User corrections: 2

📈 Total Knowledge Base:
• Total patterns: 127
• Total decisions: 43
• Solutions database: 89
• User preferences: 15

💡 Most valuable learning:
"Event-driven pattern for payment processing"
```

## 🔒 Privacy & Security

```python
def sanitize_for_storage(content):
    # Remove sensitive data
    content = remove_passwords(content)
    content = remove_api_keys(content)
    content = remove_personal_info(content)

    # Mark security items
    if has_security_implications(content):
        content = mark_as_security_related(content)

    return sanitized_content
```

## 🎯 Integration Examples

### After 6-Agent Workflow
```
Phase 6: UPDATER complete
Phase 7: POST-REVIEW complete
Phase 8: MEMORY-UPDATE ← Currently executing
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 Captured 12 learnings from this session
✅ All memory banks updated successfully
```

### After User Correction
```
User: "No, don't create a README file"

Claude: Got it! I'll remember not to create README files.

[MEMORY UPDATE - INSTANT]
✅ Added to dont_dos.md: "Don't create README files"

What would you like me to do instead?
```

## 🔄 Checkpoint Integration Examples (NEW - Phase 3.2)

### Example 1: Automatic Checkpoint at Phase Transition
```
Phase 3: IMPLEMENTATION complete
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💾 Creating checkpoint... (phase_transition)
✅ Checkpoint created: checkpoint_20251126_001

Phase 4: TESTING starting...
```

### Example 2: Checkpoint Before Risky Operation
```
🚨 About to modify core authentication system
💾 Creating safety checkpoint... (before_risky_operation)
✅ Checkpoint created: checkpoint_20251126_002

Proceeding with modifications...
```

### Example 3: Checkpoint on Error/Interruption
```
❌ Error occurred during build process

💾 Creating error checkpoint... (error_occurred)
✅ Checkpoint created: checkpoint_20251126_003

Error details captured. You can resume from this point after fixing the issue.
```

### Example 4: Resume from Checkpoint
```
User: /systemcc "continue from last checkpoint"

🔄 RESUMING FROM CHECKPOINT
━━━━━━━━━━━━━━━━━━━━━━━━

Checkpoint ID: checkpoint_20251126_002
Created: 2025-11-26 14:30:15
Session Duration: 45 minutes

📋 RESTORING STATE:
━━━━━━━━━━━━━━━━━━━

Task: Add user authentication system
Workflow: complete_system (6-agent)
Progress: 60%

Completed Phases:
✅ Strategic Analysis
✅ Implementation Planning
✅ Code Development

Next Phase: Testing

Files Modified (8):
• src/auth/middleware.ts (2 changes)
• src/auth/jwt.ts (1 change)
• src/routes/auth.ts (3 changes)
...

🎯 NEXT STEPS:
• Run authentication tests
• Verify JWT token validation
• Test refresh token flow

✅ STATE RESTORED SUCCESSFULLY

Resuming from: Testing Phase
Starting test execution...
```

### Example 5: Manual Checkpoint at Session End
```
User: /systemcc "save checkpoint before I log off"

💾 Creating manual checkpoint... (session_end)

Capturing execution state:
• Active task: User authentication
• Completion: 85%
• Next steps: Final code review
• Modified files: 12

✅ Checkpoint created: checkpoint_20251126_004
✅ Session state preserved

You can resume with: /systemcc "continue from last checkpoint"
```

## 📝 Final Output (BRIEF)

After memory update, show ONLY:
```markdown
✅ TASK COMPLETE
━━━━━━━━━━━━━━

What was done:
• Added authentication system
• Implemented JWT tokens
• Created login/logout endpoints

💾 Checkpoint created: checkpoint_20251126_005
Session learnings captured for future use.
```

**DO NOT**:
- Create summary documents
- Generate extensive reports
- Explain obvious changes
- Be verbose

## 📋 Session State Display (NEW - Phase 1.2)

At the start of each `/systemcc` command, if an active session exists, display context:

```markdown
📋 SESSION CONTEXT (Active for 2h 15m)

🎯 Current Focus: User authentication system

✅ Completed (2 tasks):
   • Created login API endpoint
   • Added JWT validation middleware

📝 Modified Files (3):
   • src/auth/middleware.ts (2 changes)
   • src/routes/auth.ts (1 change)
   • src/utils/jwt.ts (1 change)

🔜 Next Steps:
   • Add refresh token mechanism
   • Implement rate limiting
   • Add authentication tests

💡 Patterns: authentication, jwt, middleware, security
```

This context helps maintain continuity across multiple commands and enables context-aware assistance.

## 🔗 Related Components
- `middleware/memory-auto-updater.md`
- `middleware/session-state-tracker.md` (NEW - Phase 1.2)
- `ClaudeFiles/memory/CLAUDE-*.md`
- `ClaudeFiles/memory/CLAUDE-session-state.json` (NEW - Phase 1.2)
- `10-POST-REVIEW.md`

---

*Every session makes the system smarter. No learning is lost.*