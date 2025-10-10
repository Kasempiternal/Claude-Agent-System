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
├── CLAUDE-activeContext.md     # Current session state
├── CLAUDE-patterns.md          # Reusable code patterns
├── CLAUDE-decisions.md         # Architecture choices
├── CLAUDE-troubleshooting.md   # Problem solutions
└── CLAUDE-dont_dos.md          # User preferences (NEW)
```

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

### 5. Don't Dos Capture (NEW)
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

## 📝 Final Output (BRIEF)

After memory update, show ONLY:
```markdown
✅ TASK COMPLETE
━━━━━━━━━━━━━━

What was done:
• Added authentication system
• Implemented JWT tokens
• Created login/logout endpoints

Session learnings captured for future use.
```

**DO NOT**:
- Create summary documents
- Generate extensive reports
- Explain obvious changes
- Be verbose

## 🔗 Related Components
- `middleware/memory-auto-updater.md`
- `ClaudeFiles/memory/CLAUDE-*.md`
- `10-POST-REVIEW.md`

---

*Every session makes the system smarter. No learning is lost.*