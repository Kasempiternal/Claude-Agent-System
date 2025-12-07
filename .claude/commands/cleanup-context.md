# /cleanup-context

## Purpose
Context optimization specialist for reducing token usage during long sessions. Helps manage context efficiently when working on complex tasks.

## Usage
```bash
/cleanup-context
```

## Features
- Identifies stale context from conversation
- Suggests which files can be unloaded
- Recommends context optimization strategies
- Helps manage large codebase navigation

## When to Use
- After long development sessions
- When context is filling up
- Before starting a new unrelated task
- When working in large codebases

## Implementation Instructions

When this command is invoked:

1. **Analyze Current Context**
   - Count loaded files and their sizes
   - Identify which files are actively being used
   - Find stale references from earlier in session

2. **Suggest Optimizations**
   ```
   📊 Context Analysis

   Active files (keep):
   - src/main.ts - Recently modified
   - src/utils.ts - Referenced by main.ts

   Stale files (can unload):
   - old-component.tsx - Not referenced since start
   - legacy-utils.js - No longer relevant

   Recommendations:
   - Consider starting fresh session for unrelated task
   - Use /taskit for large multi-phase work
   ```

3. **Provide Options**
   - Continue with optimized context
   - Start fresh session (recommended for new tasks)
   - Use phase-based workflow for complex tasks

## Integration with /systemcc

The `/systemcc` command automatically uses phase-based execution (`/taskit`) when:
- Current context > 30k tokens
- Project has 100+ files
- Task touches 5+ modules

This prevents context overflow automatically.

## Tips

1. **Start fresh for new topics** - Don't carry over context from unrelated work
2. **Use /taskit for big tasks** - Phase-based execution manages context automatically
3. **Close unused files** - Don't keep files open "just in case"
4. **Focus on one concern** - Complete one task before starting another

---
*Efficient context management for optimal performance*
