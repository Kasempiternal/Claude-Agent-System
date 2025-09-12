# IMPLEMENTATION STEPS MODULE

## Execution Order

After detection and Lyra optimization, follow these steps:

### 1. Memory Bank Initialization
```
- Check for ClaudeFiles/memory/CLAUDE-activeContext.md
- If exists:
  → Load previous session context
  → Update with current date/task
- If not exists:
  → Initialize memory bank structure
  → Create core memory files

- Load relevant memory:
  → Read CLAUDE-patterns.md for known patterns
  → Check CLAUDE-troubleshooting.md for solutions
  → Review CLAUDE-decisions.md for architecture
```

### 2. Security Pre-Scan (Optional)
```
- If --secure flag or suspicious input detected:
  → Run PromptSecure-Ultra scanner
  → Check for injection attempts
  → Decode any encoded content
  → Block if CRITICAL risk found
  → Warn if HIGH risk detected
```

### 3. First-Run Detection
```
- Check for ClaudeFiles/.analysis-status file
- If not exists:
  → Display: "🔍 First time in this project - running analysis first..."
  → Execute lightweight project analysis
  → Create .analysis-status with project info
  → Update memory bank with project structure
  → Display: "✅ Analysis complete! Now proceeding with your task..."
- If exists:
  → Skip analysis and proceed normally
```

### 4. Context Analysis
```
- Check current context size (tokens)
- Count loaded files and their sizes
- Evaluate project size (file count)
- Assess conversation history length
- Predict context growth for the task
```

### 5. Task Analysis (Using Optimized Prompt)
```
- Parse the optimized task description
- Check for keywords indicating complexity
- Evaluate scope indicators
- Consider risk factors
- Estimate time requirements
- Analyze for parallel execution opportunities
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

### 8. Memory Bank Persistence
```
After workflow completion:
- Save session summary to activeContext.md
- Document discovered patterns
- Record architectural decisions
- Update troubleshooting database
- Document CCPM recommendations and user choices
- Run memory-bank-synchronizer if needed
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

## Next Steps

Continue to specialized modules:
- `05-EXAMPLES.md` for workflow examples
- `06-DECISION-ENGINE.md` for advanced logic
- `07-ERROR-HANDLING.md` for edge cases