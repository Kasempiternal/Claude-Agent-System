# CLAUDE.md - Claude Agent System
This file provides project-specific guidance to Claude Code when working in this repository.

## AI Guidance

* To save main context space, for code searches, inspections, troubleshooting or analysis, use code-searcher subagent where appropriate - giving the subagent full context background for the task(s) you assign it.
* After receiving tool results, carefully reflect on their quality and determine optimal next steps before proceeding. Use your thinking to plan and iterate based on this new information, and then take the best next action.
* For maximum efficiency, whenever you need to perform multiple independent operations, invoke all relevant tools simultaneously rather than sequentially.
* Before you finish, please verify your solution
* Do what has been asked; nothing more, nothing less.
* NEVER create files unless they're absolutely necessary for achieving your goal.
* ALWAYS prefer editing an existing file to creating a new one.
* NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.
* When you update or modify core context files, also update memory bank documentation

## Memory Bank System

This project uses a structured memory bank system with specialized context files. Always check these files for relevant information before starting work:

### Core Context Files

* **ClaudeFiles/memory/CLAUDE-activeContext.md** - Current session state, goals, and progress
* **ClaudeFiles/memory/CLAUDE-patterns.md** - Established code patterns and conventions
* **ClaudeFiles/memory/CLAUDE-decisions.md** - Architecture decisions and rationale
* **ClaudeFiles/memory/CLAUDE-troubleshooting.md** - Common issues and proven solutions
* **ClaudeFiles/memory/CLAUDE-config-variables.md** - Configuration variables reference (if exists)
* **ClaudeFiles/memory/CLAUDE-temp.md** - Temporary scratch pad (only read when referenced)

**Important:** Always reference the active context file first to understand what's currently being worked on and maintain session continuity.

### Memory Bank Updates

When working on tasks:
1. Read relevant memory files at start
2. Update activeContext.md with progress
3. Document new patterns in patterns.md
4. Record decisions in decisions.md
5. Add solutions to troubleshooting.md

## Project Overview
This is the Claude Agent System repository - a comprehensive multi-agent workflow system for structured development with persistent memory and enterprise security features. 

## How to Use This System

### THE ONLY COMMAND YOU NEED:

**`/systemcc "your task"`** - That's it! Claude handles EVERYTHING automatically.

### 🚀 FULLY AUTOMATED - NO MORE MANUAL COMMANDS!

**You will NEVER need to run**: `/analyze`, `/planner`, `/executer`, `/verifier`, `/tester`, `/documenter`, `/updater`, `/orchestrated`, `/agetos`, `/aidevtasks`, etc.

**Claude automatically:**
- Analyzes your project on first use (no manual `/analyze` needed!)
- Detects the right workflow for your task
- Executes ALL agents in sequence
- Shows progress in real-time
- Only asks for input when making decisions
- Completes everything end-to-end

Example:
```bash
# For ANY task (even first time in project):
User: /systemcc "add user authentication"

Claude: 🔍 First time in this project - running analysis first...
        ✅ Analysis complete! Now working on your authentication feature...
        [Automatically handles everything - no more commands needed!]
```

### Unified System Structure
- **Middleware**: `middleware/` - Universal Kase AI optimization
- **Workflows**: `workflows/` - All workflow implementations
  - `agent-os/` - Project initialization framework
  - `ai-dev-tasks/` - PRD-based development
  - `complete-system/` - Six-agent validation workflow
  - `orchestrated-only/` - Streamlined three-agent workflow
  - `phase-based-workflow/` - Context-optimized execution
- **Commands**: `commands/` - All command entry points
- **Git Workflows**: `create-worktree.md` and `wt-alias-setup.md`

## Unified System Commands

### REMEMBER: You Only Need ONE Command!

```bash
# For EVERYTHING (including first time in project):
/systemcc "what you want to do"
```

**That's it!** Claude handles:
- Choosing the right workflow
- Running all agents automatically
- Managing phases and context
- Asking for input only when needed
- Completing everything end-to-end

### What Happens Behind the Scenes:

- **Simple fixes**: 3-agent streamlined workflow
- **Complex features**: 6-agent comprehensive workflow
- **New features**: PRD → Tasks → Implementation
- **Project setup**: Full initialization workflow
- **Large codebases**: Phase-based execution

**You don't need to know or care about these details - just use `/systemcc`!**

### How It Works:

**Simple Tasks** (detected automatically):
```bash
User: /systemcc "fix button color"
Claude: [Runs 3-agent orchestrated workflow automatically]
```

**Complex Tasks** (detected automatically):
```bash
User: /systemcc "build payment system"
Claude: [Runs full 6-agent workflow automatically]
```

**Feature Development** (detected automatically):
```bash
User: /systemcc "create user dashboard"
Claude: [Creates PRD, generates tasks, implements - all automatic]
```

**You ONLY provide input when Claude asks for:**
- Clarification on requirements
- Choice between implementation options
- Approval for major changes
- Missing project context

## Important Files

### Core System Files
- `CLAUDE-FILES-ORGANIZATION.md` - **MANDATORY file organization**
- `middleware/kase-universal.md` - Universal AI prompt optimization
- `middleware/automated-workflow-executor.md` - **NEW: Automatic agent execution system**

### Workflow Documentation
- `workflows/agent-os/` - Project initialization system
- `workflows/ai-dev-tasks/` - PRD-based development
  - `create-prd.md` - PRD generation process
  - `generate-tasks.md` - Task list creation
  - `process-task-list.md` - Task execution
- `workflows/complete-system/` - Six-agent validation
- `workflows/orchestrated-only/` - Three-agent streamlined
- `workflows/phase-based-workflow/` - Context management

### Command References
- `commands/systemcc.md` - Master router documentation
- `commands/agetos.md` - Agent OS commands
- `commands/aidevtasks.md` - PRD workflow commands
- `commands/help.md` - Complete command reference

## File Organization System

### MANDATORY: ClaudeFiles Directory
**ALL non-code files generated by Claude agents MUST be stored in the `ClaudeFiles/` directory structure.** This includes:
- Documentation (learnings, project status, features)
- Test results, bug reports, performance metrics
- Workflow plans, phase outcomes, summaries
- Temporary working files

See `CLAUDE-FILES-ORGANIZATION.md` for complete details.

## Development Guidelines

### Task Complexity Assessment
Before starting any task, assess its complexity:
- **Simple**: Single file changes, bug fixes, minor features → Use orchestrated workflow
- **Complex**: Multi-file changes, architecture decisions, new systems → Use complete workflow

### Quality Standards
- Always follow the agent patterns exactly as documented
- Run appropriate validation for the task complexity
- Document learnings and patterns discovered

### Workflow Integration
The agent system is designed to:
1. Ensure consistent quality across all development
2. Capture knowledge and patterns systematically
3. Prevent common mistakes through structured processes
4. Scale appropriately to task complexity

## Notes
- This system emphasizes quality over speed
- Each agent has specific responsibilities - respect the boundaries
- The global CLAUDE.md at `~/.claude/CLAUDE.md` provides general guidelines
- This project-specific file takes precedence for workflow selection

## Automated Workflow Implementation Instructions for Claude

When `/systemcc` is invoked:

1. **Detect and Route Internally**:
   - Analyze task complexity
   - Choose appropriate workflow
   - Execute ALL agents automatically
   - NEVER ask user to run another command

2. **Progress Updates**:
   ```
   🚀 Analyzing your request...
   ✅ Workflow selected: [Type]
   🔄 Phase 1/6: Strategic analysis...
   ✅ Phase 1/6: Complete
   🔄 Phase 2/6: Implementation...
   ```

3. **User Interactions - ONLY for**:
   - **Specifications**: "Which authentication method do you prefer?"
   - **Clarifications**: "Should this work on mobile devices?"
   - **Decisions**: "Database choice: PostgreSQL or MySQL?"
   - **Context**: "What's your current API structure?"
   
   NEVER: "Run /planner to continue" or "Execute /verifier next"

4. **Example - Proper Flow**:
   ```
   User: /systemcc "add search functionality"
   
   Claude: 🚀 Analyzing your request...
   ✅ This requires a comprehensive implementation approach.
   
   🔄 Phase 1/6: Analyzing search requirements...
   
   ❓ I need some clarification:
   What type of search do you need?
   1. Full-text search across all content
   2. Product/item search with filters
   3. User search functionality
   
   User: 2
   
   Claude: 🔄 Phase 1/6: Planning product search with filters...
   ✅ Phase 1/6: Strategic plan complete
   
   🔄 Phase 2/6: Implementing search system...
   [Continues through ALL phases automatically]
   
   ✨ Search functionality complete! Here's what I implemented:
   - Elasticsearch integration
   - Filter system for categories and price
   - Search API endpoints
   - Frontend search components
   ```

5. **CRITICAL Rules**:
   - User ONLY ever types: `/systemcc "task"` (that's it!)
   - ALL workflow execution is internal and automatic
   - NEVER expose agent commands to users
   - NEVER ask users to run commands
   - Complete EVERYTHING in one flow

## CRITICAL File Creation Rules

**MANDATORY: ALL non-code files MUST be created in the ClaudeFiles/ directory structure!**

### Code Files → Project Directory
These go in the actual project structure:
- Source code: .js, .ts, .jsx, .tsx, .py, .java, .go, .rb, etc.
- Styles: .css, .scss, .less
- Markup: .html, .xml
- Config: package.json, tsconfig.json, .gitignore, webpack.config.js
- Build files needed for the project to run

### ALL Other Files → ClaudeFiles/ Directory ONLY
These MUST go in ClaudeFiles:
- **Documentation**: All .md files → ClaudeFiles/documentation/
- **Test Results**: Test outputs → ClaudeFiles/tests/results/
- **Bug Reports**: Issue tracking → ClaudeFiles/tests/bugs/
- **Workflow Files**: WORK.md, plans → ClaudeFiles/workflows/
- **Temporary Files**: Any temp work → ClaudeFiles/temp/
- **Logs & Reports**: .log, .txt → ClaudeFiles/
- **Analysis Files**: Any analysis → ClaudeFiles/

### NEVER Create These Outside ClaudeFiles:
❌ **NO** README.md in project root (unless user explicitly asks)
❌ **NO** docs/ or documentation/ folders in project
❌ **NO** reports/, logs/, or analysis/ folders in project
❌ **NO** temporary .md files scattered in project
❌ **NO** LEARNINGS.md, SYSTEMS.md, etc. in project

### Why This Matters:
- Keeps project directory clean and professional
- Prevents accidental commits of Claude's working files
- Easy to add `ClaudeFiles/` to .gitignore
- Clear separation between code and documentation
- Avoids "trash" accumulation that annoys users

### Example:
```bash
# CORRECT ✅
src/components/Button.tsx          # Code file - project directory
ClaudeFiles/documentation/button-design.md  # Documentation - ClaudeFiles

# WRONG ❌
docs/button-design.md              # Should be in ClaudeFiles
README-BUTTON.md                   # Should be in ClaudeFiles
button-analysis.txt                # Should be in ClaudeFiles
```

## Agent OS Attribution
The Agent OS framework (.agent-os directory) is integrated from:
- Source: https://buildermethods.com/agent-os
- Tutorial: https://www.youtube.com/watch?v=CTMyzeKKb0o&t
- Modifications: Adapted for multi-language support and integration with our analyzecc system