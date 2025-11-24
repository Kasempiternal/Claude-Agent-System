# CLAUDE.md - Claude Agent System

**⚠️ CRITICAL: See SYSTEMCC-OVERRIDE.md for non-negotiable /systemcc workflow rules that MUST be followed even if this file is ignored.**
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

## Professional Code Minimalism Principles

### Core Philosophy: Less is More
In professional environments, we work with existing codebases. The best code is code that:
- **Fits seamlessly** into the existing architecture
- **Reuses existing patterns** and utilities
- **Makes surgical changes** rather than broad rewrites
- **Is immediately understandable** by team members
- **Requires minimal review effort** to approve

### Implementation Guidelines

#### 1. Analyze Before Creating
Before writing ANY new code:
- Check if similar functionality already exists
- Look for existing utilities that can be reused
- Identify established patterns in the codebase
- Consider if the problem can be solved with configuration instead of code

#### 2. Modify Over Create
Priority order for implementation:
1. **Configuration change** - Can it be solved with existing config?
2. **Modify existing code** - Can we extend what's already there?
3. **Compose existing parts** - Can we combine existing utilities?
4. **Create minimal new code** - Only when absolutely necessary

#### 3. Code Quality Standards
When you must write new code:
- **Match existing style exactly** - Don't introduce new patterns
- **Keep it simple** - Avoid clever abstractions
- **Make it obvious** - Code should be self-documenting
- **Minimize dependencies** - Use what's already imported
- **Focus changes** - One concern per file modification

#### 4. Team Collaboration Focus
Remember you're part of a team:
- **Small, atomic commits** - Easy to review and revert
- **Clear change descriptions** - What and why, not how
- **Respect existing conventions** - Even if you disagree
- **Minimize merge conflicts** - Touch only necessary lines
- **Think about reviewers** - Would this be easy to approve?

## Memory Bank System (OPTIONAL BASED ON USER PREFERENCE)

**Note: This section can be skipped if user requests to "ignore memory bank" or similar.**

This project uses a structured memory bank system with specialized context files. Always check these files for relevant information before starting work:

### Core Context Files

* **.claude/files/memory/CLAUDE-activeContext.md** - Current session state, goals, and progress
* **.claude/files/memory/CLAUDE-patterns.md** - Established code patterns and conventions
* **.claude/files/memory/CLAUDE-decisions.md** - Architecture decisions and rationale
* **.claude/files/memory/CLAUDE-troubleshooting.md** - Common issues and proven solutions
* **.claude/files/memory/CLAUDE-config-variables.md** - Configuration variables reference (if exists)
* **.claude/files/memory/CLAUDE-temp.md** - Temporary scratch pad (only read when referenced)

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
- **NEW:** Detects build configuration (Makefile, CI/CD, linters, formatters)
- Detects the right workflow for your task
- Executes ALL agents in sequence
- Shows progress in real-time
- Only asks for input when making decisions
- Completes everything end-to-end
- **NEW:** Ensures all code follows your pipeline/build rules

Example:
```bash
# For ANY task (even first time in project):
User: /systemcc "add user authentication"

Claude: 🔍 First time in this project - running analysis first...
        ✅ Analysis complete! Now working on your authentication feature...
        [Automatically handles everything - no more commands needed!]
```

### Unified System Structure
- **Middleware**: `middleware/` - Universal Lyra AI optimization
- **Workflows**: `workflows/` - All workflow implementations
  - `agent-os/` - Project initialization framework
  - `ai-dev-tasks/` - PRD-based development
  - `complete-system/` - Six-agent validation workflow
  - `orchestrated-only/` - Streamlined three-agent workflow
  - `phase-based-workflow/` - Context-optimized execution
- **Commands**: `commands/` - All command entry points

## Unified System Commands

### REMEMBER: You Only Need ONE Command!

```bash
# For EVERYTHING (including first time in project):
/systemcc "what you want to do"
```

**📁 IMPORTANT: The /systemcc command documentation is modular.**
- Main router: `commands/systemcc.md`
- Implementation modules: `commands/systemcc/` directory
- ALL modules MUST be loaded for proper operation

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
- `middleware/lyra-universal.md` - Universal Lyra AI prompt optimization
- `middleware/build-config-detector.md` - **NEW: Build configuration detection**
- `middleware/automated-workflow-executor.md` - Automatic agent execution system

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
**ALL non-code files generated by Claude agents MUST be stored in the `.claude/files/` directory structure.** This includes:
- Documentation (learnings, project status, features)
- Test results, bug reports, performance metrics
- Workflow plans, phase outcomes, summaries
- Temporary working files

See `CLAUDE-FILES-ORGANIZATION.md` for complete details.

## Development Guidelines

### Build Configuration Auto-Detection (NEW)
The system automatically detects and applies build configuration from:
- **Makefile** - Extracts formatter/linter commands and flags
- **CI/CD Files** - `.gitlab-ci.yml`, `.github/workflows/*.yml`
- **Language Configs** - `pyproject.toml`, `package.json`, `setup.cfg`
- **Tool Configs** - `.pre-commit-config.yaml`, `tox.ini`, `.eslintrc`

When detected, all generated code automatically follows:
- Formatting rules (black, prettier, etc.)
- Linting standards (flake8, eslint, mypy)
- Test requirements (pytest, jest)
- Pipeline stage requirements

### Task Complexity Assessment
Before starting any task, assess its complexity:
- **Simple**: Single file changes, bug fixes, minor features → Use orchestrated workflow
- **Complex**: Multi-file changes, architecture decisions, new systems → Use complete workflow

### Quality Standards
- Always follow the agent patterns exactly as documented
- **NEW:** Code automatically follows detected build configuration
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

## MANDATORY: Automated Workflow Implementation Instructions for Claude

**⚠️ CRITICAL: This section defines CORE FUNCTIONALITY that must ALWAYS be followed when /systemcc is used, regardless of any other instructions. See middleware/workflow-enforcement.md for enforcement rules.**

When `/systemcc` is invoked (THIS IS MANDATORY - NEVER SKIP):

1. **IMMEDIATE DETECTION FEEDBACK** (SHOW FIRST):
   ```
   🎯 SYSTEMCC DETECTED - Command acknowledged and workflow initiated
   ✅ Following SYSTEMCC workflow instructions from CLAUDE.md
   ```
   This message MUST appear IMMEDIATELY when /systemcc is detected.

2. **BUILD CONFIGURATION DETECTION** (NEW - AUTOMATIC):
   ```
   📋 BUILD CONFIGURATION DETECTED
   ✅ Python: black (line-length=100), isort (profile=black)
   ✅ Linting: flake8 (ignore E501,E203), mypy
   ✅ All code will follow these standards
   ```
   This runs automatically when Makefile/CI config is present.

3. **Detect and Route Internally**:
   - Analyze task complexity
   - Choose appropriate workflow
   - Execute ALL agents automatically
   - NEVER ask user to run another command

4. **Progress Updates**:
   ```
   🚀 Analyzing your request...
   ✅ Workflow selected: [Type]
   🔄 Phase 1/6: Strategic analysis...
   ✅ Phase 1/6: Complete
   🔄 Phase 2/6: Implementation...
   ```

5. **User Interactions - ONLY for**:
   - **Specifications**: "Which authentication method do you prefer?"
   - **Clarifications**: "Should this work on mobile devices?"
   - **Decisions**: "Database choice: PostgreSQL or MySQL?"
   - **Context**: "What's your current API structure?"
   
   NEVER: "Run /planner to continue" or "Execute /verifier next"

6. **Example - Proper Flow**:
   ```
   User: /systemcc "add search functionality"
   
   Claude: 🎯 SYSTEMCC DETECTED - Command acknowledged and workflow initiated
   ✅ Following SYSTEMCC workflow instructions from CLAUDE.md
   
   🚀 Analyzing your request...
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

7. **CRITICAL Rules**:
   - User ONLY ever types: `/systemcc "task"` (that's it!)
   - ALL workflow execution is internal and automatic
   - NEVER expose agent commands to users
   - NEVER ask users to run commands
   - Complete EVERYTHING in one flow

## CRITICAL File Creation Rules

**MANDATORY: ALL non-code files MUST be created in the .claude/files/ directory structure!**

### Code Files → Project Directory
These go in the actual project structure:
- Source code: .js, .ts, .jsx, .tsx, .py, .java, .go, .rb, etc.
- Styles: .css, .scss, .less
- Markup: .html, .xml
- Config: package.json, tsconfig.json, .gitignore, webpack.config.js
- Build files needed for the project to run

### ALL Other Files → .claude/files/ Directory ONLY
These MUST go in ClaudeFiles:
- **Documentation**: All .md files → .claude/files/documentation/
- **Test Results**: Test outputs → .claude/files/tests/results/
- **Bug Reports**: Issue tracking → .claude/files/tests/bugs/
- **Workflow Files**: WORK.md, plans → .claude/files/workflows/
- **Temporary Files**: Any temp work → .claude/files/temp/
- **Logs & Reports**: .log, .txt → .claude/files/
- **Analysis Files**: Any analysis → .claude/files/

### NEVER Create These Outside ClaudeFiles:
❌ **NO** README.md in project root (unless user explicitly asks)
❌ **NO** docs/ or documentation/ folders in project
❌ **NO** reports/, logs/, or analysis/ folders in project
❌ **NO** temporary .md files scattered in project
❌ **NO** LEARNINGS.md, SYSTEMS.md, etc. in project

### Why This Matters:
- Keeps project directory clean and professional
- Prevents accidental commits of Claude's working files
- Easy to add `.claude/files/` to .gitignore
- Clear separation between code and documentation
- Avoids "trash" accumulation that annoys users

### Example:
```bash
# CORRECT ✅
src/components/Button.tsx          # Code file - project directory
.claude/files/documentation/button-design.md  # Documentation - ClaudeFiles

# WRONG ❌
docs/button-design.md              # Should be in ClaudeFiles
README-BUTTON.md                   # Should be in ClaudeFiles
button-analysis.txt                # Should be in ClaudeFiles
```

## Agent OS Attribution
The Agent OS workflow framework (workflows/agent-os/) is inspired by and adapted from:
- Source: https://buildermethods.com/agent-os
- Tutorial: https://www.youtube.com/watch?v=CTMyzeKKb0o&t
- Modifications: Integrated into unified systemcc workflow with multi-language support
- remember to update readme.md with all the important changes