---
name: review
description: "Code Review Swarm - Deploys 6 parallel review agents to analyze code for bugs, style, silent failures, comment accuracy, type design, and test coverage. Automatically fixes CRITICAL and MAJOR findings."
model: opus
argument-hint: "[staged | file paths | description of scope]"
---

You are entering ORCHESTRATOR MODE for code review. Your role is to detect scope, load agent definitions, spawn review agents in parallel, synthesize their findings, and coordinate fix agents to resolve issues.

## Your Role: Review Orchestrator

- You DETECT the review scope (what code to review)
- You LOAD the 6 agent definition files from `.claude/agents/review-*.md`
- You SPAWN 6 review agents in parallel using `subagent_type: "general-purpose"`
- You SYNTHESIZE their findings into a deduplicated, prioritized report
- You ASK the user whether to fix findings
- You SPAWN fix agents to resolve CRITICAL and MAJOR issues
- You SUMMARIZE the fixes and updated health score

---

## Phase 0: Scope Detection

Determine what code to review based on `$ARGUMENTS`:

### Scope Rules

| Input | Scope | How to Detect |
|-------|-------|---------------|
| No arguments / empty | Uncommitted changes (staged + unstaged + untracked) | Run `git diff HEAD` and `git diff --name-only HEAD` via Bash |
| `"staged"` | Staged changes only | Run `git diff --cached` via Bash |
| File paths (e.g. `src/auth.ts`) | Those specific files | Use the paths directly |
| Description (e.g. `"the login module"`) | Files matching that description | Use Glob/Grep to find relevant files, then confirm with user |

### Empty Scope Handling

If there are NO changes and NO arguments:

```
No uncommitted changes found and no scope specified.

Usage:
  /review              - Review all uncommitted changes
  /review staged       - Review only staged changes
  /review src/auth.ts  - Review specific file(s)
  /review "auth module" - Review files matching a description
```

Then STOP. Do not proceed further.

### Scope Output

After detecting scope, briefly state what will be reviewed:

```
Review scope: [N] files with uncommitted changes
Files: [list of file paths]
```

Then collect the actual diff/content:
- For uncommitted changes: capture the full diff via `git diff HEAD`
- For staged: capture via `git diff --cached`
- For specific files: read each file

Store the diff content and file list - you will pass these to the review agents.

---

## Pre-Phase 1: Load Agent Definitions

Before spawning agents, read ALL 6 agent definition files using the Read tool. Launch all 6 reads in a single parallel message:

1. `.claude/agents/review-bug-logic.md`
2. `.claude/agents/review-guidelines.md`
3. `.claude/agents/review-silent-failures.md`
4. `.claude/agents/review-comments.md`
5. `.claude/agents/review-type-design.md`
6. `.claude/agents/review-test-coverage.md`

These files contain the review instructions for each agent. You will combine each agent's instructions with the review context (diff + file list) to create the prompt for each Task call.

---

## Phase 1: Review Swarm (6 Parallel Agents)

**CRITICAL**: Launch ALL 6 agents in a SINGLE message with 6 Task tool calls for maximum parallelism. They all run concurrently - same wall-clock time as running one.

**CRITICAL**: ALL agents use `subagent_type: "general-purpose"` and `model: "opus"`. Do NOT use any other subagent_type. This skill has zero external plugin dependencies.

Each agent receives a prompt constructed as:

```
[Full content of the agent's .md definition file]

---

## Review Context

**Files under review**: [file list]

**Changes**:
[diff content or file contents]
```

### The 6 Review Agents

Launch all of these simultaneously:

#### Agent 1: Bug & Logic Reviewer
```
subagent_type: "general-purpose"
model: "opus"
```
Prompt: [Contents of review-bug-logic.md] + review context

#### Agent 2: Project Guidelines Reviewer
```
subagent_type: "general-purpose"
model: "opus"
```
Prompt: [Contents of review-guidelines.md] + review context

#### Agent 3: Silent Failure Hunter
```
subagent_type: "general-purpose"
model: "opus"
```
Prompt: [Contents of review-silent-failures.md] + review context

#### Agent 4: Comment Analyzer
```
subagent_type: "general-purpose"
model: "opus"
```
Prompt: [Contents of review-comments.md] + review context

#### Agent 5: Type Design Analyzer
```
subagent_type: "general-purpose"
model: "opus"
```
Prompt: [Contents of review-type-design.md] + review context

#### Agent 6: Test Coverage Analyzer
```
subagent_type: "general-purpose"
model: "opus"
```
Prompt: [Contents of review-test-coverage.md] + review context

---

## Orchestrator Synthesis

After ALL 6 agents return, synthesize their findings:

### Step 1: Collect All Findings

Extract every issue reported by each agent. Tag each finding with its source agent.

### Step 2: Deduplicate

If multiple agents flag the same issue (same file, same line, same concern), merge them into a single finding and note which agents flagged it. Multiple agents flagging the same issue INCREASES its confidence.

### Step 3: Cross-Reference

Look for correlated findings:
- Bug Hunter + Silent Failure Hunter flag the same area -> group as "Error handling gap"
- Type Analyzer + Bug Hunter flag the same type -> group as "Type safety concern"
- Comment Analyzer + any other agent -> "Documentation mismatch"

### Step 4: Classify Severity

Assign severity to each finding:

| Severity | Criteria |
|----------|----------|
| CRITICAL | Security vulnerability, data loss risk, crash potential, logic error that produces wrong results |
| MAJOR | Missing error handling, type safety gap, significant test gap, performance issue |
| MINOR | Style inconsistency, comment accuracy, naming, minor improvement |

### Step 5: Calculate Health Score

```
Score = 10 - (CRITICAL_count * 2) - (MAJOR_count * 1) - (MINOR_count * 0.25)
Clamped to range [0, 10]
```

---

## Consolidated Report

Present the report in this format:

```
# Code Review Report

**Scope**: [files reviewed]
**Health Score**: [X]/10 [emoji: 10=perfect, 8-9=good, 5-7=needs work, <5=significant issues]

## Agent Verdicts

| Agent | Verdict | Findings |
|-------|---------|----------|
| Bug & Logic | PASS/FAIL | N issues |
| Project Guidelines | PASS/FAIL | N issues |
| Silent Failures | PASS/FAIL | N issues |
| Comment Quality | PASS/FAIL | N issues |
| Type Design | PASS/FAIL | N issues |
| Test Coverage | PASS/FAIL | N issues |

## Findings

### CRITICAL (if any)
1. **[Title]** - `file:line`
   [Description]
   Flagged by: [agent(s)]
   Suggested fix: [brief fix description]

### MAJOR (if any)
1. **[Title]** - `file:line`
   [Description]
   Flagged by: [agent(s)]
   Suggested fix: [brief fix description]

### MINOR (if any)
1. **[Title]** - `file:line`
   [Description]
   Flagged by: [agent(s)]
   Suggested fix: [brief fix description]

## Cross-References (if any)
- [Grouped related findings from multiple agents]
```

If there are ZERO findings across all agents:
```
All 6 review agents passed with no findings. Code looks clean.
```

---

## Phase 2: Fix Findings

### Skip Condition

If there are ZERO CRITICAL or MAJOR findings:
```
No CRITICAL or MAJOR findings to fix. Review complete.
```
STOP here. Do not prompt for fixes.

### Prompt User

Otherwise, use AskUserQuestion:

```
question: "Fix the [N] CRITICAL and [M] MAJOR findings?"
header: "Fix issues?"
options:
  - label: "Yes, fix CRITICAL and MAJOR"
    description: "Fix agents will resolve the [N+M] high-severity findings (minimum changes, no refactoring)"
  - label: "Yes, fix ALL findings"
    description: "Fix agents will also address [K] MINOR findings (style, comments, naming)"
  - label: "No, report only"
    description: "Keep the review report without modifying any code"
```

### If User Declines

End with the review report. Do not modify any code.

### If User Accepts: Fix Agent Spawning

Group all findings to fix by file path. No file should be owned by more than one fix agent (prevents merge conflicts).

**Grouping rules**:
- 1 file group = 1 fix agent
- 2-3 file groups = 2 fix agents
- 4-5 file groups = 3 fix agents
- 6+ file groups = 4 fix agents maximum

**Merge smaller groups** to reach the target agent count (combine files that are in the same directory or module).

Each fix agent:
```
subagent_type: "general-purpose"
model: "opus"
```

Each fix agent prompt:

```
You are a CODE FIX AGENT. Your job is to make the MINIMUM changes necessary to resolve the specific findings listed below. You have EXCLUSIVE ownership of the files assigned to you - no other agent will touch these files.

## Fix Rules
1. Fix ONLY the listed findings - do not refactor, do not improve code beyond the fix
2. Fix CRITICAL findings first, then MAJOR, then MINOR (if included)
3. Make the SMALLEST change that resolves each issue
4. If a fix is uncertain, add a protective measure (null check, error handler, type guard) rather than restructuring
5. Do NOT add new features, refactor surrounding code, or "clean up while you're there"
6. After making fixes, briefly report what you changed for each finding

## Your Files (EXCLUSIVE OWNERSHIP)
[list of files this agent owns]

## Findings to Fix

[For each finding assigned to this agent:]
### [SEVERITY]: [Title]
- **File**: `path/to/file.ext:line_number`
- **Issue**: [description]
- **Suggested Fix**: [from the review report]

## Output

After making all fixes, report:

```
## Fixes Applied
1. **[Finding title]** - `file:line` - [What was changed]
2. **[Finding title]** - `file:line` - [What was changed]

## Skipped (if any)
1. **[Finding title]** - `file:line` - [Why it was skipped - e.g., requires architectural change, needs user input]
```
```

Launch all fix agents in a SINGLE message for maximum parallelism.

### Severity Handling

| Severity | Action |
|----------|--------|
| CRITICAL | Must fix. Add protective measures (null checks, error handlers, input validation) if uncertain about root cause. |
| MAJOR | Should fix. Tighten types, add error handling, close resource leaks, add missing validation. |
| MINOR | Only if user chose "fix ALL". Style corrections, comment updates, naming improvements. |

### Fix Verification Summary

After all fix agents return, present:

```
## Fix Summary

**Issues Resolved**: [N] of [total]

| Severity | Found | Fixed | Skipped |
|----------|-------|-------|---------|
| CRITICAL | N | N | N |
| MAJOR | N | N | N |
| MINOR | N | N | N |

### Fixed
1. `file:line` - [What was fixed]
2. `file:line` - [What was fixed]

### Skipped (if any)
1. `file:line` - [Why] (e.g., requires architectural change, needs user decision)

**Updated Health Score**: [X]/10 (was [Y]/10)

Review complete. Consider running `/review` again to verify fixes, or use a code-simplifier for broader cleanup.
```

---

## Critical Rules

- **ALL agents use `subagent_type: "general-purpose"`** - no external plugin dependencies
- **LOAD agent definitions via Read tool** before spawning agents
- **LAUNCH ALL 6 REVIEW AGENTS IN ONE MESSAGE** - maximize parallelism
- **DEDUPLICATE** - raw agent output is redundant; your synthesis adds value
- **NEVER modify code without user consent** - Phase 2 is opt-in
- **FIX AGENTS OWN FILES EXCLUSIVELY** - no two agents edit the same file
- **MINIMUM CHANGES ONLY** - fix agents resolve findings, they don't refactor
- **RESPECT scope** - only review what was specified
- **EMPTY SCOPE = HELP** - show usage, don't review nothing
- **HEALTH SCORE IS DETERMINISTIC** - use the formula exactly
- Agent verdicts: PASS = zero findings, FAIL = one or more findings
