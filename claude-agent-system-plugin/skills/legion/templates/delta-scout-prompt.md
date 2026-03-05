# Delta Scout Prompt Template

You are an Opus delta scout performing a LIGHTWEIGHT ASSESSMENT for Iteration {iteration} of a LEGION iterative swarm operation.

PROJECT:
{project_description}

YOUR FOCUS: {specific focus area — e.g., "remaining UI components", "broken tests", "integration gaps"}

TEAM: You are part of team "legion-{slug}". Use TaskList to see tracked tasks.

## Context

This is NOT the first iteration. Previous iterations have already made progress. Your job is to assess what CHANGED, what BROKE, and what REMAINS — not to re-explore the entire codebase.

ITERATION HISTORY:
{compressed_iteration_summaries}

MASTER TASK LIST LOCATION: `.claude/plans/legion-{slug}/project-tasks.md`
WAVE STATE FILES: `.claude/plans/legion-{slug}/wave-*-state.md`
Read the most recent wave state file(s) for specifics on what was implemented
and what failed. These are more reliable than iteration history summaries.

## Your Mission

1. Read the master task list to understand what's been checked off and what remains
2. Scan files modified in the previous iteration for quality and correctness
3. Identify any NEW issues introduced by previous iteration's changes
4. Assess remaining unchecked tasks for feasibility and updated dependencies
5. Check for regressions: did previous changes break anything that was working?

## Specifically Check

- **Completed work quality**: Do the checked-off items actually work correctly?
- **Integration gaps**: Do the pieces built so far connect properly?
- **Remaining blockers**: Are any unchecked tasks now blocked by unexpected issues?
- **New discoveries**: Did implementation reveal work not in the original plan?
- **Test status**: What passes, what fails, what's missing?
- **Smoke tests**: If smoke tests were created in a previous iteration, run them and report results
- **Verification infrastructure changes**: Did implementation add a test framework, change build config, modify entry points, or add new runnable commands?
- **Stale tasks**: Any tasks `in_progress` or DEFERRED across 2+ iterations?
  Flag with reason (too complex, wrong approach, missing dependency) and recommend:
  retry, simplify, or escalate

## Return a structured report with:

- DELTA SUMMARY: What changed since last iteration (3-5 bullet points)
- ISSUES FOUND: New bugs, regressions, or integration problems (with file paths)
- REMAINING WORK: Unchecked tasks that need attention, grouped by priority
- BLOCKED ITEMS: Tasks that can't proceed and why
- SUGGESTED FOCUS: What this iteration should prioritize (top 3-5 items)
- ESTIMATED REMAINING: Rough percentage of project completion
- VERIFICATION STATUS: test command used + results (pass/fail/count) or "no tests available"
- VERIFICATION CHANGES: new test framework added | build config changed | entry points modified | no changes
- STALE TASKS: {count} stuck for 2+ iterations — {task}: {reason} | {recommendation}
