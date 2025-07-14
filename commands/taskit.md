# /taskit Command Implementation

## Purpose
Execute complex tasks using phase-based development for optimal context usage and quality.

## When This Command is Used

Execute the following workflow when the user types `/taskit "task description"`:

### 1. Task Analysis Phase

**Analyze the task and create a phase plan:**

```markdown
# TASK-PLAN.md
Task: [User's task description]
Created: [Current timestamp]
Complexity: [Low/Medium/High/Critical]

## Phase Breakdown

### Phase 1: [Descriptive Name]
**Objective**: [Single, clear objective]
**Scope**: 
- [ ] Specific deliverable 1
- [ ] Specific deliverable 2
**Dependencies**: None | [List previous phases]
**Context Needed**: [List of files/patterns to examine]
**Estimated Duration**: [X] minutes

### Phase 2: [Descriptive Name]
[Continue pattern...]

## Execution Strategy
- Total phases: [X]
- Estimated total time: [X] minutes
- Parallel opportunities: [List any phases that can run in parallel]
- Risk factors: [Any identified risks]
```

### 2. Phase Execution

**For each phase, create a focused execution context:**

```markdown
# Executing Phase [X]: [Name]

## Current Context
- Previous phases completed: [List]
- Key decisions from previous phases: [Summarized list]
- Current objective: [From phase plan]

## Execution
[Perform the phase work with focused attention]

## Phase Outcome
- Completed objectives: [List what was done]
- Files modified: [List with brief descriptions]
- Key decisions made: [List with rationale]
- Handoff notes: [Critical info for next phase]
```

### 3. Save Phase Results

**After each phase, save outcomes:**

```markdown
# phase-[X]-outcome.md
Phase: [X] - [Name]
Status: Completed
Duration: [Actual time]

## Delivered
[List of concrete deliverables]

## Decisions & Rationale
[Key decisions with reasoning]

## Next Phase Requirements
[What the next phase needs to know]
```

### 4. Final Summary

**After all phases complete:**

```markdown
# TASK-SUMMARY.md
Task: [Original description]
Status: Completed
Total Duration: [Sum of phases]

## Phases Completed
1. ✓ [Phase 1 name] - [Key outcome]
2. ✓ [Phase 2 name] - [Key outcome]
[...]

## Overall Achievements
[Summary of what was built/fixed/improved]

## Testing & Validation
[What testing was performed]

## Documentation Updates
[What documentation was created/updated]
```

## Implementation Logic

```python
# Pseudo-code for taskit execution
def handle_taskit_command(task_description):
    # 1. Analyze task complexity
    complexity = analyze_complexity(task_description)
    
    # 2. Generate phases
    if complexity == "Low":
        phases = generate_phases(task_description, max_phases=3)
    elif complexity == "Medium":
        phases = generate_phases(task_description, max_phases=5)
    else:  # High/Critical
        phases = generate_phases(task_description, max_phases=7)
    
    # 3. Create task plan
    create_file("TASK-PLAN.md", format_task_plan(phases))
    
    # 4. Execute each phase
    for i, phase in enumerate(phases):
        # Load minimal context
        context = {
            "phase_objective": phase.objective,
            "previous_outcomes": load_previous_outcomes(i),
            "relevant_files": identify_relevant_files(phase)
        }
        
        # Execute phase
        outcome = execute_phase_with_context(phase, context)
        
        # Save outcome
        create_file(f"phase-{i+1}-outcome.md", format_outcome(outcome))
        
        # Check if should continue
        if outcome.has_blockers:
            handle_blockers(outcome.blockers)
    
    # 5. Create summary
    create_file("TASK-SUMMARY.md", summarize_all_phases())
```

## Examples

### Example 1: Medium Complexity Task
```
/taskit "add user profile page with avatar upload and bio editing"

Creates phases:
1. Profile page structure and routing
2. Avatar upload component with image handling  
3. Bio editor with validation
4. Integration and styling
```

### Example 2: High Complexity Task
```
/taskit "migrate database from PostgreSQL to MongoDB"

Creates phases:
1. Schema analysis and mapping
2. Data models for MongoDB
3. Migration scripts
4. Data validation tools
5. Rollback procedures
6. Testing and verification
```

## Integration Points

- Works with `/systemcc` for individual phase execution
- Can invoke orchestrated agents for specific phases
- Compatible with git worktree workflow
- Updates CLAUDE.md with learnings

## Key Benefits

1. **Context Optimization**: 60-80% reduction in token usage
2. **Quality Focus**: Each phase gets full attention
3. **Clear Progress**: Visible phase completion
4. **Error Isolation**: Problems contained to phases
5. **Knowledge Capture**: Structured documentation

## Directory Structure Created

```
phase-based-workflow/
├── TASK-PLAN.md           # Master plan
├── phase-1-outcome.md     # Phase 1 results
├── phase-2-outcome.md     # Phase 2 results
├── ...                    # Additional phases
└── TASK-SUMMARY.md        # Final summary
```