# Hydra Coordination: {slug}

Created: [Date]
Team: hydra-{slug}
Total Tasks: {N}
Total Waves: {W}

## Task Summary

| ID | Task | Wave | Files (Create) | Files (Modify) | Depends On |
|----|------|------|----------------|----------------|------------|
| 1 | Add auth | 1 | 2 | 3 | — |
| 2 | Build dashboard | 1 | 4 | 1 | — |
| 3 | Fix payments | 2 | 0 | 2 | Task 1 |

## File Ownership Map

| File | Owner Task | Operation | Conflict? | Resolution |
|------|-----------|-----------|-----------|------------|
| src/auth/middleware.ts | Task 1 (Wave 1), Task 3 (Wave 2) | MODIFY, MODIFY | Yes | Sequential: Task 1 first (foundational) |
| src/dashboard/page.tsx | Task 2 | CREATE | No | — |

## Conflict Resolutions

### Conflict 1: `src/auth/middleware.ts`
- **Tasks**: 1 (add auth) and 3 (fix payments)
- **Type**: Both MODIFY
- **Resolution**: Task 1 runs in Wave 1, Task 3 in Wave 2
- **Reasoning**: Auth middleware changes are foundational; payment fixes build on them

## Execution Wave Diagram

Wave 1 (parallel):  [Task 1: Add auth]  [Task 2: Build dashboard]
                           |
                           v
Wave 2 (sequential): [Task 3: Fix payments]

## Agent Budget Estimate

| Phase | Agents | Model |
|-------|--------|-------|
| Scouts | {scout_count} | Opus |
| Wave 1 Implementation | {agents_w1} | Opus |
| Wave 1 Verification | 1 | default |
| Wave 2 Implementation | {agents_w2} | Opus |
| Wave 2 Verification | 1 | default |
| Global Verification | 1-2 | Opus |
| Simplification | {simplifier_count} | Opus |
| **Total** | **{total}** | |

---
**USER: Review this coordination plan. Edit wave assignments or conflict resolutions, then confirm to proceed.**
