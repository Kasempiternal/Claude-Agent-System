# /taskit - Phase-Based Task Execution System

## Overview

The `/taskit` command implements a phase-based development approach that breaks complex tasks into focused phases, optimizing context usage and improving quality by allowing deep focus on each phase independently.

### Critical for Large Codebases
When working in projects with hundreds of files or when context accumulates during long sessions, Claude's context window can become compressed, leading to:
- Degraded code quality
- Missed important details
- Superficial implementations
- Errors from forgotten context

`/taskit` solves this by resetting context between phases while maintaining continuity through documentation.

## Core Concept

Instead of attempting to complete an entire complex task in one go (which can overwhelm context and reduce quality), `/taskit`:

1. **Decomposes** the task into logical phases
2. **Documents** each phase in a structured plan
3. **Executes** phases sequentially with focused context
4. **Maintains** continuity through phase documentation

### Why This Matters
- **Context Window Limit**: Claude has a finite context window (~200k tokens)
- **Quality Degradation**: Performance drops significantly when context is compressed
- **Large Projects**: In codebases with 100+ files, context fills quickly
- **Solution**: Phase-based execution keeps each phase under 30k tokens

## How It Works

### 1. Task Analysis & Planning
When invoked with `/taskit "your complex task"`, the system:
- Analyzes the task requirements
- Breaks it into 3-7 logical phases
- Creates a `TASK-PLAN.md` file with detailed phase descriptions
- Estimates complexity and time for each phase

### 2. Phase Execution
For each phase:
- Loads only relevant context for that phase
- Executes with full focus on phase objectives
- Documents outcomes and learnings
- Prepares handoff for next phase

### 3. Context Optimization
- Each phase starts fresh with minimal context
- Previous phase outcomes are summarized
- Only essential information carries forward
- Reduces token usage by 60-80%

### Context Management Strategy
```
Traditional Approach:
- Start: 10k tokens
- After exploring: 30k tokens
- After implementing: 60k tokens
- After testing: 80k tokens (compressed, degraded quality)

Phase-Based Approach:
- Phase 1: 10k tokens (fresh start)
- Phase 2: 12k tokens (fresh start + summary)
- Phase 3: 11k tokens (fresh start + summary)
- Phase 4: 10k tokens (fresh start + summary)
Total: 43k tokens with consistent quality
```

## Usage

```bash
/taskit "build a complete user dashboard with analytics, notifications, and settings"
```

This creates a phase plan and begins execution:

```
Phase 1: Architecture & Setup
Phase 2: Analytics Components
Phase 3: Notification System
Phase 4: Settings Panel
Phase 5: Integration & Testing
```

## Implementation Structure

### Files Created

1. **TASK-PLAN.md** - Master plan with all phases
2. **phase-1-outcome.md** - Results from Phase 1
3. **phase-2-outcome.md** - Results from Phase 2
4. **...continuing for each phase**
5. **TASK-SUMMARY.md** - Final summary and handoff

### Phase Plan Template

```markdown
# Task: [Task Description]
Date: [Current Date]
Total Phases: [Number]

## Phase 1: [Phase Name]
**Objective**: Clear, focused goal for this phase
**Inputs**: 
- Required files/context
- Dependencies from previous phases
**Outputs**:
- Expected deliverables
- Documentation updates
**Success Criteria**:
- Specific, measurable outcomes
**Estimated Time**: [X] minutes

## Phase 2: [Phase Name]
[Similar structure...]

## Execution Notes
- Phases can be executed sequentially
- Each phase should be self-contained
- Context from previous phases is summarized, not fully loaded
```

### Phase Outcome Template

```markdown
# Phase [X] Outcome: [Phase Name]
Completed: [Timestamp]

## Accomplished
- Specific achievement 1
- Specific achievement 2

## Key Decisions
- Decision 1 and rationale
- Decision 2 and rationale

## Modifications Made
- File: path/to/file - Description of changes
- File: path/to/file2 - Description of changes

## Handoff to Next Phase
Critical information for Phase [X+1]:
- Important context point 1
- Important context point 2

## Learnings
- Pattern discovered
- Optimization identified
```

## Execution Flow

```python
def execute_taskit(task_description):
    # 1. Analyze and Plan
    phases = analyze_task_complexity(task_description)
    create_task_plan(phases)
    
    # 2. Execute Each Phase
    for phase in phases:
        # Minimal context load
        context = load_phase_context(phase)
        
        # Focused execution
        results = execute_phase(phase, context)
        
        # Document outcomes
        save_phase_outcome(phase, results)
        
        # Prepare handoff
        handoff = prepare_handoff(results)
        
    # 3. Final Summary
    create_task_summary(all_phase_outcomes)
```

## Benefits

1. **10x Context Efficiency**: Each phase uses minimal tokens
2. **Higher Quality**: Deep focus on one aspect at a time
3. **Better Error Recovery**: Issues isolated to phases
4. **Clear Progress**: Visible phase completion
5. **Knowledge Capture**: Structured documentation

## Integration with Existing Workflows

### Automatic Selection via /systemcc
`/systemcc` will automatically route to `/taskit` when:
- Current context exceeds 30,000 tokens
- More than 10 files are loaded in context
- Working in a project with 100+ files and broad changes
- Task is estimated to take 60+ minutes
- Multiple system integrations are involved

### Manual Usage
`/taskit` can also be used directly for:
- **Planning** complex features before implementation
- **Large tasks** that would overwhelm single-context execution
- **Refactoring** that touches many files
- **Migrations** requiring systematic changes

## Example: Complex Feature Implementation

```bash
User: /taskit "implement complete authentication system with OAuth, 2FA, and session management"
```

Generated Plan:
```
Phase 1: Database Schema & Models
- User model with auth fields
- Session tracking tables
- OAuth provider configs

Phase 2: Core Authentication Logic
- Password hashing
- Session generation
- Token management

Phase 3: OAuth Integration
- Provider setup (Google, GitHub)
- Callback handling
- Token exchange

Phase 4: Two-Factor Authentication
- TOTP implementation
- Backup codes
- Recovery flow

Phase 5: Frontend Integration
- Login/Register forms
- OAuth buttons
- 2FA screens

Phase 6: Validation & Security
- Manual validation
- Integration validation
- Security audit
```

## Advanced Features

### Parallel Phase Execution
Some phases can be marked for parallel execution:
```markdown
## Phase 3: Component A [PARALLEL-OK with Phase 4]
## Phase 4: Component B [PARALLEL-OK with Phase 3]
```

### Phase Dependencies
Explicit dependency declaration:
```markdown
## Phase 5: Integration
**Depends on**: Phase 2, Phase 3 outcomes
**Blocks**: Phase 6
```

### Checkpoint Recovery
If execution fails, resume from last completed phase:
```bash
/taskit --resume-from-phase 3
```

## Best Practices

1. **Phase Size**: Each phase should be 15-45 minutes of work
2. **Clear Boundaries**: Phases should have minimal overlap
3. **Documentation**: Always document key decisions
4. **Testing**: Include test phases for complex features
5. **Handoffs**: Make phase transitions explicit

## Limitations

- Not suitable for simple, single-file tasks
- Requires upfront planning time
- Best for tasks taking >1 hour total
- May create overhead for tiny features

## Success Metrics

Typical improvements with `/taskit`:
- 60-80% reduction in context usage
- 2-3x improvement in code quality
- 90% reduction in context-related errors
- 50% faster completion for complex tasks