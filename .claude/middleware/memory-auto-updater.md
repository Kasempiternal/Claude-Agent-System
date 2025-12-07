# Session Learning Middleware

## 🎯 Purpose
Capture and apply learnings within the current session to improve subsequent interactions.

## 🔄 Trigger Points

Automatically triggered:
1. **After workflow completion** - Apply task learnings to session
2. **On user interruption** - Capture "don't do that" feedback
3. **On error/failure** - Remember troubleshooting solutions
4. **On pattern discovery** - Note reusable patterns
5. **On architectural decision** - Record design choices

## 📝 Session Learning Structure

### Within Session Context
```python
session_learnings = {
    "patterns": [],      # Discovered patterns
    "decisions": [],     # Choices made and rationale
    "dont_dos": [],      # User corrections/preferences
    "solutions": []      # Issues resolved
}
```

## 🚀 Execution Flow

```
Task Complete → Analyze Session → Extract Learnings → Apply to Session
```

## 📝 Learning Templates

### Pattern Detection
```python
def detect_patterns(code_changes):
    patterns = []

    # Check for common patterns
    if "async/await" in code_changes:
        patterns.append({
            "name": "Async Handler Pattern",
            "category": "Concurrency",
            "example": code_changes["async_example"]
        })

    return patterns
```

### User Feedback Processing
```python
def process_user_feedback(user_message):
    dont_keywords = [
        "don't", "stop", "no", "not like that",
        "wrong", "avoid", "never", "skip"
    ]

    if any(keyword in user_message.lower() for keyword in dont_keywords):
        return {
            "type": "negative_feedback",
            "message": user_message,
            "context": get_current_context()
        }

    return None
```

## 🎯 Smart Learning Rules

### 1. Apply Immediately
- User corrections
- Critical errors
- Security issues

### 2. Session Persistence
- Keep learnings in conversation context
- Apply to subsequent tasks in session
- No persistent file creation

## 🚨 Interruption Handling

When user interrupts with correction:

```python
def handle_interruption(user_input, current_action):
    # Immediate capture in session
    feedback = {
        "action_interrupted": current_action,
        "user_statement": user_input,
        "learned": classify_feedback(user_input)
    }

    # Apply to session context
    session.add_learning(feedback)

    return "Got it! I'll remember not to do that."
```

## 📊 Session Summary Format

### Brief Update
```markdown
✅ TASK COMPLETE
• Completed: [What was done]
• Learned: [Key takeaway if any]
Ready for next task!
```

## 🎯 Integration with systemcc

Session learning is applied automatically:

```
Phase N: Session Learning (AUTO)
━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 Applying learnings to session...
✅ Patterns: 3 noted for this session
✅ Preferences: 0 new corrections
Session context updated!
```

## 🔒 Key Principles

1. **Session-only**: Learnings apply within current conversation
2. **No files created**: All learning is in-memory
3. **Immediate application**: Corrections applied right away
4. **Lightweight**: Minimal overhead

---

*Making every interaction in the session smarter.*
