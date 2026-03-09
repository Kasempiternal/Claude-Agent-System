# Worker Result Format

Workers MUST write their result to `.claude/plans/siege-{slug}/worker-result-iter{N}.md` in EXACTLY this format. The orchestrator parses this file — deviation breaks the loop.

```markdown
# Worker Result: Iteration {N}

## Status
MODE: {FULL|DELTA}
TASKS_BEFORE: {count of checked P1 tasks at start}
TASKS_AFTER: {count of checked P1 tasks at end}
P1_CHECKED: {count}
P1_TOTAL: {count}
P2_CHECKED: {count}
P2_TOTAL: {count}
P3_CHECKED: {count}
P3_TOTAL: {count}

## Waves Executed
WAVE_COUNT: {number}
{For each wave:}
WAVE {W}: agents={count} | completed={task_count} | failed={task_count}

## Files Modified
{file_path}: {1-line summary}
{file_path}: {1-line summary}

## Test Results
TEST_COMMAND: {command used or "none"}
TEST_EXIT_CODE: {0|1|N/A}
TEST_SUMMARY: {e.g., "12/12 passed" or "3 failures" or "no tests"}

## Build Results
BUILD_COMMAND: {command used or "none"}
BUILD_EXIT_CODE: {0|1|N/A}

## Collaboration Metrics
TOTAL_MESSAGES_SENT: {count across all teammates}
INTERFACE_PROPOSALS: {count}
BROADCASTS: {count}
BLOCKERS_RAISED: {count}
CHALLENGES: {count}

## Remaining Work
{list of unchecked P1 tasks, one per line}

## Issues Encountered
{list of problems, blockers, or unexpected findings}

## Summary
{2-3 sentence summary of what was accomplished this iteration}
```

## Parsing Rules (for orchestrator)

The orchestrator extracts these fields by grepping:
- `P1_CHECKED:` and `P1_TOTAL:` for checkbox arithmetic
- `TEST_EXIT_CODE:` for test gate (0 = pass)
- `BUILD_EXIT_CODE:` for build gate (0 = pass)
- `TOTAL_MESSAGES_SENT:` for collaboration verification
- `WAVE_COUNT:` for progress tracking

All fields are required. Use `N/A` for fields that don't apply (e.g., no build command).
