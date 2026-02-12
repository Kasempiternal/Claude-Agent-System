# Implementation Plan: [Task Title]

Created: [Date]
Status: PENDING APPROVAL
Task: {N} of {total} in Hydra batch "{slug}"
Orchestrator: Hydra (Opus)
Scout Model: Opus (Shared Pool)
Execution Mode: Wave-Based Parallel Deployment (Agent Teams)
Team: hydra-{slug}

## Summary
[2-3 sentences describing what this specific task accomplishes]

## File Ownership (EXCLUSIVE)
Files this task will create or modify. No other task in this batch may touch these files during the same wave.

### Creates
- `path/to/new-file.ts` — [purpose]

### Modifies
- `path/to/existing-file.ts` — [what changes and why]

## Cross-Task Dependencies
- **Depends on**: [Task X — because it creates the type/module this task imports]
- **Blocks**: [Task Y — because this task modifies the schema that Y reads]
- **Shared concerns**: [Brief note on shared patterns with other tasks]

## Scope
### In Scope
- [List what will be changed]

### Out of Scope
- [List what will NOT be changed]

## Implementation Details

### Work Streams
| Stream | Focus | Files |
|--------|-------|-------|
| Stream A | [Area] | [Files] |
| Stream B | [Area] | [Files] |

### Steps
1. [Step-by-step implementation approach]

## Testing Strategy
- [How to verify this task works]

## Risks
| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| [Risk] | Low/Med/High | Low/Med/High | [Mitigation] |

---
**USER: Review this plan. Edit any section, then confirm ALL plans to proceed.**
