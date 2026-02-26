# Implementation Plan: [Task Title]

Created: [Date]
Status: PENDING APPROVAL
Task: {N} of {total} in Hydra batch "{slug}"
Risk Tier: {0-3}
Risk Rationale: {why this tier — 1 sentence}
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

## Failure-Mode Checklist (Tier 1+ only)

| # | Question | Answer |
|---|----------|--------|
| 1 | What could fail? | {specific failure scenario} |
| 2 | How would we detect it? | {signal: test failure, runtime error, user report} |
| 3 | What is the fastest rollback? | {revert commit, feature flag, config change} |
| 4 | What is our weakest assumption? | {assumption most likely to be wrong} |

*Omit this section for Tier 0 tasks.*

---
**USER: Review this plan. Edit any section, then confirm ALL plans to proceed.**
