# CLAUDE Don't Dos - User Preferences & Avoidances

## 🚫 Purpose
This file tracks what NOT to do based on user feedback, interruptions, and corrections. When the user says "no", "stop", "don't do that", or "that's not correct", the feedback is captured here for future reference.

## 📋 Categories

### Code Style Preferences - What to Avoid
<!-- User-specific coding patterns they don't want -->

### Documentation - What NOT to Create
- **Don't create summary documents** unless explicitly requested
- **Don't create README files** unless user asks for them
- **Don't generate extensive documentation** after task completion
- **Keep completion messages short and clear**

### Workflow Preferences - What to Skip
<!-- Workflow steps or agents the user doesn't want -->

### Communication Style - What to Avoid
- **Don't be verbose** - Keep explanations brief and to the point
- **Don't create unnecessary files** - Only what's needed for the task
- **Don't explain obvious things** - User understands their project

### Technical Decisions - What NOT to Use
<!-- Technologies, libraries, or patterns to avoid -->

### Error Patterns - Common Misunderstandings
<!-- Patterns where Claude misunderstood requirements -->

## 🔄 Learning History

### Session Feedback Log
<!-- Automatically updated when user corrects Claude -->

#### Entry Template:
```
Date: [YYYY-MM-DD]
Context: [What was being worked on]
User Feedback: [Exact correction or "don't" statement]
Learned: [What to avoid in future]
---
```

## 🎯 Quick Reference - Top Don'ts

1. **Don't create summary documents after completing tasks**
2. **Don't be verbose in explanations**
3. **Don't create files that weren't requested**
4. **Don't skip the memory update phase**
5. **Don't ignore user interruptions**

## 📊 Pattern Recognition

### Frequently Avoided Actions
- Creating unnecessary documentation: ████████████ (12 times)
- Verbose explanations: ██████████ (10 times)
- Unwanted file creation: ████████ (8 times)

### User Preference Indicators
Keywords that signal "don't do this":
- "no"
- "stop"
- "don't"
- "not like that"
- "that's wrong"
- "not correct"
- "I don't want"
- "skip"
- "avoid"
- "never"

## 💡 Integration Notes

This file is automatically checked:
1. **Before starting any task** - Load preferences
2. **During interruptions** - Capture new don'ts
3. **After task completion** - Update with session learnings
4. **In decision making** - Avoid known don'ts

## 🔗 Related Memory Files
- `CLAUDE-patterns.md` - What TO do (positive patterns)
- `CLAUDE-decisions.md` - Architecture decisions
- `CLAUDE-troubleshooting.md` - Problem solutions
- `CLAUDE-activeContext.md` - Current session state

---
*Last Updated: [Auto-updated by system]*
*Total Don'ts Captured: 0*
*Most Recent Learning: [None yet]*