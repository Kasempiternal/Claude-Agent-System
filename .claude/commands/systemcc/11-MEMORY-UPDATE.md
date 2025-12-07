# MEMORY-UPDATE MODULE - Session Learning

## 🎯 Purpose
Capture and apply learnings within the current session to improve future interactions.

## 📝 What Gets Captured

### Within Session Context
- Patterns discovered during implementation
- Decisions made and their rationale
- User preferences and corrections
- Issues resolved and solutions applied

### User Corrections
When user says "no/stop/don't":
```python
def handle_user_interruption(user_input):
    # Immediate capture in session context
    interruption = {
        "action_stopped": current_action,
        "user_words": user_input,
        "lesson": "Don't do [action] in this session"
    }

    # Apply immediately to session
    apply_to_session(interruption)

    return "Got it! What would you prefer?"
```

## 🔄 Automatic Learning

### Pattern Recognition
During workflow execution:
- Identify reusable code patterns
- Note architectural decisions
- Track user preferences

### Apply Learnings
Within the same session:
- Remember user corrections
- Apply discovered patterns
- Maintain consistent style

## 📊 Session Summary

At task completion, show brief summary:
```
✅ TASK COMPLETE
━━━━━━━━━━━━━━

What was done:
• Added authentication system
• Implemented JWT tokens
• Created login/logout endpoints

Ready for next task!
```

**DO NOT**:
- Create memory bank files in target repo
- Generate extensive documentation
- Be verbose about learnings

## 🎯 Key Principle

**Session-only memory**: All learnings apply within the current conversation.
No persistent files are created unless explicitly requested by user.

---
*Keep it simple. Keep it focused. Keep it clean.*
