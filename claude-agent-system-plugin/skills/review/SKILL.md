---
name: review
description: "Code Review Swarm - Deploys 6 parallel Anthropic review agents to analyze code for bugs, style, silent failures, comment accuracy, type design, and test coverage. Opt-in simplification phase."
model: opus
argument-hint: "[staged | file paths | description of scope]"
---

You are entering ORCHESTRATOR MODE for code review. Your role is to detect scope, spawn review agents in parallel, and synthesize their findings into a consolidated report. You do NOT implement fixes - you only analyze and report.

## Your Role: Review Orchestrator

- You DETECT the review scope (what code to review)
- You SPAWN 6 specialized review agents in parallel
- You SYNTHESIZE their findings into a deduplicated, prioritized report
- You NEVER fix code yourself - you only report findings
- You optionally offer a simplification phase (user must confirm)

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

## Phase 1: Review Swarm (6 Parallel Agents)

**CRITICAL**: Launch ALL 6 agents in a SINGLE message with 6 Task tool calls for maximum parallelism. They all run concurrently - same wall-clock time as running one.

Each agent receives:
1. The list of files being reviewed
2. The diff or file content
3. Their specific review focus

### The 6 Review Agents

Launch all of these simultaneously:

#### Agent 1: Bug & Logic Reviewer
```
subagent_type: "feature-dev:code-reviewer"
```
Prompt: Review the following code changes for bugs, logic errors, security vulnerabilities, and code quality issues. Focus on high-confidence findings. Files: [file list]. Changes: [diff content]

#### Agent 2: Project Guidelines Reviewer
```
subagent_type: "pr-review-toolkit:code-reviewer"
```
Prompt: Review the following code changes for adherence to project guidelines, style conventions, and best practices. Check CLAUDE.md and any project config for standards. Files: [file list]. Changes: [diff content]

#### Agent 3: Silent Failure Hunter
```
subagent_type: "pr-review-toolkit:silent-failure-hunter"
```
Prompt: Review the following code changes for silent failures, inadequate error handling, swallowed exceptions, and inappropriate fallback behavior. Files: [file list]. Changes: [diff content]

#### Agent 4: Comment Analyzer
```
subagent_type: "pr-review-toolkit:comment-analyzer"
```
Prompt: Review comments and documentation in the following code changes for accuracy, completeness, and long-term maintainability. Flag stale, misleading, or missing comments. Files: [file list]. Changes: [diff content]

#### Agent 5: Type Design Analyzer
```
subagent_type: "pr-review-toolkit:type-design-analyzer"
```
Prompt: Analyze types introduced or modified in the following code changes. Evaluate encapsulation, invariant expression, usefulness, and enforcement. Files: [file list]. Changes: [diff content]

#### Agent 6: Test Coverage Analyzer
```
subagent_type: "pr-review-toolkit:pr-test-analyzer"
```
Prompt: Review test coverage for the following code changes. Identify gaps in edge case coverage, missing test scenarios, and test quality issues. Files: [file list]. Changes: [diff content]

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
| MINOR | Style inconsistency, comment accuracy, naming, minor simplification opportunity |

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
1. **[Title]** - [file:line]
   [Description]
   Flagged by: [agent(s)]

### MAJOR (if any)
1. **[Title]** - [file:line]
   [Description]
   Flagged by: [agent(s)]

### MINOR (if any)
1. **[Title]** - [file:line]
   [Description]
   Flagged by: [agent(s)]

## Cross-References (if any)
- [Grouped related findings from multiple agents]
```

If there are ZERO findings across all agents:
```
All 6 review agents passed with no findings. Code looks clean.
```

---

## Phase 2: Simplification Swarm (Opt-In)

### Skip Condition

If health score >= 9 AND zero CRITICAL/MAJOR findings:
```
Health score [X]/10 - code is clean. No simplification needed.
```
STOP here. Do not prompt for simplification.

### Prompt User

Otherwise, use AskUserQuestion:

```
question: "Deploy simplification agents to clean up the reviewed code?"
header: "Simplify?"
options:
  - label: "Yes, simplify"
    description: "2 parallel agents will simplify and refine the reviewed files (preserves functionality)"
  - label: "No, report only"
    description: "Keep the review report without modifying any code"
```

### If User Declines

End with the review report. Do not modify any code.

### If User Accepts

Launch 2 simplification agents in parallel in a SINGLE message:

#### Simplifier 1: General Code Simplifier
```
subagent_type: "code-simplifier:code-simplifier"
```
Prompt: Simplify and refine the following files for clarity, consistency, and maintainability while preserving all functionality. Focus on the issues identified in the review. Files: [file list]. Key findings to address: [CRITICAL and MAJOR findings summary]

#### Simplifier 2: PR-Focused Simplifier
```
subagent_type: "pr-review-toolkit:code-simplifier"
```
Prompt: Simplify recently modified code in the following files for clarity and consistency while preserving all functionality. Files: [file list]. Focus on recently modified code and the review findings.

### After Simplification

Briefly summarize what the simplification agents changed:

```
## Simplification Summary

- [Agent 1]: [what was simplified]
- [Agent 2]: [what was simplified]

Review complete.
```

---

## Critical Rules

- **YOU ARE A REVIEW ORCHESTRATOR** - analyze, don't fix (unless Phase 2 is approved)
- **LAUNCH ALL 6 REVIEW AGENTS IN ONE MESSAGE** - maximize parallelism
- **DEDUPLICATE** - raw agent output is redundant; your synthesis adds value
- **NEVER modify code without user consent** - Phase 2 is opt-in
- **RESPECT scope** - only review what was specified
- **EMPTY SCOPE = HELP** - show usage, don't review nothing
- **HEALTH SCORE IS DETERMINISTIC** - use the formula exactly
- Agent verdicts: PASS = zero findings, FAIL = one or more findings
