# IMPLEMENTATION STEPS MODULE

## Execution Order

After detection and Lyra optimization, follow these steps:

### 1. Security Pre-Scan (Auto-Enabled)
```
- Automatically enabled if detected:
  → Database/SQL keywords (query, migration, schema, etc.)
  → Authentication/authorization terms (login, password, jwt, etc.)
  → Encoding/decoding operations (base64, serialize, etc.)
  → API operations with data handling
- When triggered:
  → Display: "🔐 Security scan auto-enabled: [reason]"
  → Run PromptSecure-Ultra scanner
  → Check for injection attempts
  → Decode any encoded content
  → Block if CRITICAL risk found
  → Warn if HIGH risk detected
  → Proceed with extra validation layers
```

### 3. First-Run Detection & Analysis
```
- Analyze the project structure if not already familiar
- Display: "🔬 Analyzing project..."
- Execute project analyzer
- Extract patterns and conventions
- Display: "✅ Analysis complete! Ready to proceed..."
```

### 4. Context Analysis
```
- Check current context size (tokens)
- Count loaded files and their sizes
- Evaluate project size (file count)
- Assess conversation history length
- Predict context growth for the task
```

### 5. Task Analysis (3-Dimensional Analysis)
```
- Parse the optimized task description
- Run 3-dimensional analysis for workflow selection:
  1. Technical Complexity (simple fix vs architecture change)
  2. Risk Factor (breaking changes, production impact)
  3. Scope Impact (single file vs entire system)
- Additional factors considered internally:
  - Code Minimalism Score (can we modify vs create?)
  - Context Load (current token usage)
  - Time Pressure (urgency indicators)
  - Security Sensitivity (auth, database, encoding) 🔐
  - Pattern Reusability (existing patterns to leverage) ♻️
- Display analysis scores to user
- Select workflow based on complexity × risk × scope
```

### 5a. Batch Optimization Analysis (NEW)
```
- Identify independent components
- Determine batch operation potential
- Group similar operations
- Check for MultiEdit opportunities
- Plan batched execution if beneficial
```

### 6. Specification Gathering (When Needed)
```
- Use middleware/specification-gatherer.md
- Collect all requirements upfront
- Show only relevant question categories
- Provide smart defaults
- Pass complete specs to workflow
```

### 7. Workflow Execution

**CRITICAL: Execute ALL phases automatically!**

#### Sequential Mode (Default)
```
🔄 Phase 1/N: [Phase name]...
[Work on phase]
✅ Phase 1/N: Complete

🔄 Phase 2/N: [Phase name]...
[Work on phase]
✅ Phase 2/N: Complete

[Continue through ALL phases]

✨ Task complete!
```

#### Batch Mode (When Beneficial)
```
⚡ BATCH OPTIMIZATION ACTIVE
Identified [X] similar operations to group

🔄 Batch Operation: [Component Group]
├─ file1.js
├─ file2.js  
├─ file3.js
└─ file4.js
✅ [X] files created/modified in single operation

🔄 Background Tasks: [If applicable]
├─ npm install (background)
├─ build process (background)
└─ Monitoring output...

✨ Task complete with optimized execution
```

### 8. Post-Execution Triple Review (NEW)
```
🔍 POST-EXECUTION REVIEW INITIATED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ Running 3 parallel code reviews...

[PARALLEL EXECUTION - 5 minutes max]
├─ 👨‍💻 Senior Engineer: Code quality review
├─ 👩‍💼 Lead Engineer: Architecture review
└─ 🏗️ Architect: System integration review

Review Results:
- If all PASS → Continue to memory update
- If issues found → Auto-fix critical issues
- Display brief summary of findings
```

### 9. Memory Bank Auto-Update (ENHANCED)
```
📝 AUTO-UPDATING MEMORY BANKS...
━━━━━━━━━━━━━━━━━━━━━━━━━━━

Automatic updates to ALL memory files:
- ✅ CLAUDE-activeContext.md → Session summary
- ✅ CLAUDE-patterns.md → New patterns discovered
- ✅ CLAUDE-decisions.md → Architecture choices
- ✅ CLAUDE-troubleshooting.md → Issues resolved
- ✅ CLAUDE-dont_dos.md → User corrections captured

Memory sync complete! Learnings preserved.
```

### 10. Final Summary (BRIEF & CLEAR)
```
✅ TASK COMPLETE
━━━━━━━━━━━━━━━

What changed:
• [Brief point 1 - what was added/modified]
• [Brief point 2 - why it was needed]
• [Brief point 3 - key improvement]

[NO DOCUMENT CREATION unless user requested]
[NO VERBOSE EXPLANATIONS]
[JUST THE FACTS]
```

## User Interaction Rules

### ONLY Ask User For:
- **Specifications**: "Which authentication method do you prefer?"
- **Clarifications**: "Should this work on mobile devices?"
- **Decisions**: "Database choice: PostgreSQL or MySQL?"
- **Context**: "What's your current API structure?"

### NEVER Ask User To:
- Run another command
- Execute a specific agent
- Continue with next phase
- Choose workflow manually

## Progress Updates

Show real-time progress:
```
🚀 Analyzing your request...
✅ Workflow selected: [Type]
🔄 Phase 1/6: Strategic analysis...
✅ Phase 1/6: Complete
🔄 Phase 2/6: Implementation...
```

## Error Handling

If workflow cannot be determined:
1. Present analysis to user
2. Ask for workflow preference
3. Provide recommendation based on partial analysis

## Completion

After all phases complete:
```
✨ Task complete!

📊 Summary:
- Files modified: [count]
- Tests passed: [status]
- Documentation updated: [status]

📁 Key changes:
- [Change 1]
- [Change 2]
- [Change 3]
```

## Interruption Handling (NEW)

When user interrupts with "no", "stop", "don't do that":
```
1. IMMEDIATELY STOP current action
2. Capture feedback to CLAUDE-dont_dos.md:
   - Context of what was being done
   - Exact user statement
   - What to avoid in future
3. Acknowledge: "Got it! I'll remember not to [action]"
4. Ask: "What would you prefer instead?"
5. Update memory banks with preference
```

## Next Steps

Continue to specialized modules:
- `05-EXAMPLES.md` for workflow examples
- `06-DECISION-ENGINE.md` for advanced logic
- `07-ERROR-HANDLING.md` for edge cases
- `10-POST-REVIEW.md` for review system (NEW)
- `11-MEMORY-UPDATE.md` for auto-updates (NEW)