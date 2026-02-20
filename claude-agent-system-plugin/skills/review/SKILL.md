---
name: review
description: "Code Review Swarm - Deploys 7 parallel review agents (2 custom + 5 official Anthropic plugin agents, with built-in fallbacks) to analyze code for bugs, style, silent failures, comment accuracy, type design, and test coverage. Automatically fixes CRITICAL and MAJOR findings, with optional code simplification pass."
model: opus
argument-hint: "[staged | file paths | description of scope]"
---

You are entering ORCHESTRATOR MODE for code review. Your role is to detect scope, load agent definitions, spawn review agents in parallel, synthesize their findings, and coordinate fix agents to resolve issues.

## Your Role: Review Orchestrator

- You DETECT the review scope (what code to review)
- You READ all 7 agent definition files using the Read tool (7 parallel Read calls in one message)
- You SPAWN 7 review agents using the Task tool (7 parallel Task calls in one message): 2 custom agents with embedded `.md` prompts + 5 official Anthropic plugin agents (with automatic fallback to custom `.md` agents if plugins aren't installed)
- You SYNTHESIZE their findings into a deduplicated, prioritized report
- You ASK the user whether to fix findings
- You SPAWN fix agents using the Task tool to resolve CRITICAL and MAJOR issues
- You OFFER an optional code simplification pass on fixed files
- You SUMMARIZE the fixes and updated health score

**You are an orchestrator. You delegate ALL review work to agents via the Task tool. You NEVER review code yourself.**

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

### Platform Detection

After detecting scope, determine the git hosting platform by running:

```bash
git remote get-url origin
```

Classify the result:
- Contains `github.com` → `GIT_PLATFORM=github`
- Contains `gitlab.com` or `gitlab` → `GIT_PLATFORM=gitlab`
- Anything else → `GIT_PLATFORM=other`

Store `GIT_PLATFORM` — it determines whether Pattern B (official plugin agents) can be used in Phase 1.

### Scope Output

After detecting scope, briefly state what will be reviewed:

```
Review scope: [N] files with uncommitted changes
Files: [list of file paths]
Platform: [github/gitlab/other]
```

Then collect the actual diff/content:
- For uncommitted changes: capture the full diff via `git diff HEAD`
- For staged: capture via `git diff --cached`
- For specific files: read each file

Store the diff content and file list - you will pass these to the review agents.

---

## Phase 1: Review Swarm (7 Parallel Agents)

Phase 1 has three steps: DISCOVER the plugin agents directory, READ all agent definitions, then SPAWN all agents. Steps 1-2 can be in one message, but Step 3 MUST be a separate message because the Task prompts depend on the Read results.

### Step 0: Discover Plugin Agents Directory

Use Glob to find the plugin's bundled agents: `Glob("**/skills/review/SKILL.md")`. Extract the parent path (everything before `/skills/review/SKILL.md`) — this is the plugin root. The agents are at `{PLUGIN_ROOT}/agents/`. Store this as `REVIEW_AGENTS_DIR`.

### Step 1: Read ALL Agent Definitions

Read ALL 7 agent definition files in a SINGLE message with 7 parallel Read tool calls:

| # | Agent Name | Definition File |
|---|------------|----------------|
| 1 | Bug & Logic | `{REVIEW_AGENTS_DIR}/review-bug-logic.md` |
| 2 | Project Guidelines | `{REVIEW_AGENTS_DIR}/review-guidelines.md` |
| 3 | Code Reviewer | `{REVIEW_AGENTS_DIR}/review-code-reviewer.md` |
| 4 | Silent Failures | `{REVIEW_AGENTS_DIR}/review-silent-failures.md` |
| 5 | Comment Quality | `{REVIEW_AGENTS_DIR}/review-comments.md` |
| 6 | Type Design | `{REVIEW_AGENTS_DIR}/review-type-design.md` |
| 7 | Test Coverage | `{REVIEW_AGENTS_DIR}/review-test-coverage.md` |

**Why read all 7?** Agents 1-2 always use their `.md` files. Agents 3-7 prefer official plugin agents, but the `.md` files serve as automatic fallbacks if the plugins aren't installed. Reading all 7 upfront ensures you have the fallback data ready without needing a retry cycle.

### Step 2: Spawn 7 Review Agents

**CRITICAL**: Launch ALL 7 agents in a SINGLE message with 7 parallel Task tool calls. They all run concurrently - same wall-clock time as running one.

There are TWO agent patterns:

#### Pattern A: Custom Agents (agents 1-2) — always used

Use `subagent_type: "general-purpose"` and embed the full `.md` file content:

```javascript
Task({
  subagent_type: "general-purpose",
  model: "opus",
  prompt: "<FULL CONTENTS OF THE AGENT .md FILE>\n\n---\n\n## Review Context\n\n**Files under review**: <FILE_LIST>\n\n**Changes**:\n<DIFF_CONTENT>",
  description: "Review agent: <AGENT_NAME>"
})
```

**IMPORTANT**: Paste the ENTIRE content of each agent's `.md` file into the `prompt` field. NEVER summarize or abbreviate the agent definition.

#### Pattern B: Official Plugin Agents (agents 3-7) — GitHub repos only, preferred when plugins are installed

**IMPORTANT**: Pattern B uses `pr-review-toolkit` agents that depend on the `gh` CLI, which only works on GitHub-hosted repos. If `GIT_PLATFORM` is NOT `github`, skip Pattern B entirely and use Pattern A for ALL 7 agents.

Use the plugin-qualified `subagent_type` and pass only the review context:

```javascript
Task({
  subagent_type: "<PLUGIN_AGENT_TYPE>",
  prompt: "Review the following code changes. Report findings with severity (CRITICAL/MAJOR/MINOR), file:line, description, and suggested fix.\n\n**Files under review**: <FILE_LIST>\n\n**Changes**:\n<DIFF_CONTENT>",
  description: "Review agent: <AGENT_NAME>"
})
```

The official plugin handles model selection and review methodology automatically — do NOT set `model` for plugin agents.

### Agent-to-Type Mapping

| # | Agent Name | subagent_type (preferred) | Fallback `.md` file | Notes |
|---|------------|---------------------------|---------------------|-------|
| 1 | Bug & Logic | `general-purpose` | `review-bug-logic.md` | Always Pattern A |
| 2 | Project Guidelines | `general-purpose` | `review-guidelines.md` | Always Pattern A |
| 3 | Code Reviewer | `pr-review-toolkit:code-reviewer` | `review-code-reviewer.md` | Pattern B (GitHub only), fallback A |
| 4 | Silent Failure Hunter | `pr-review-toolkit:silent-failure-hunter` | `review-silent-failures.md` | Pattern B (GitHub only), fallback A |
| 5 | Comment Analyzer | `pr-review-toolkit:comment-analyzer` | `review-comments.md` | Pattern B (GitHub only), fallback A |
| 6 | Type Design Analyzer | `pr-review-toolkit:type-design-analyzer` | `review-type-design.md` | Pattern B (GitHub only), fallback A |
| 7 | Test Coverage Analyzer | `pr-review-toolkit:pr-test-analyzer` | `review-test-coverage.md` | Pattern B (GitHub only), fallback A |

### Fallback Handling

**Non-GitHub repos (`GIT_PLATFORM` is `gitlab` or `other`):** Pattern B is skipped entirely — all 7 agents use Pattern A. No fallback is needed since Pattern B was never attempted.

**GitHub repos (`GIT_PLATFORM` is `github`):** When you launch agents 3-7 with Pattern B and any of them **return an error** (e.g., unknown `subagent_type`, plugin not found), immediately re-spawn the failed agents using Pattern A with their corresponding `.md` file content (already loaded from Step 1). Do NOT re-spawn agents that succeeded.

If **all 5** official agents fail on a GitHub repo (plugins not installed at all), this is expected — the skill works fully with all 7 agents running as Pattern A custom agents. After the fallback agents complete successfully, include this note in the review report:

```
**Tip**: Running with bundled review agents. For enhanced analysis with official Anthropic agents:
/plugin install pr-review-toolkit@claude-plugins-official
/plugin install code-simplifier@claude-plugins-official
```

Only show this tip when `GIT_PLATFORM` is `github`, since the official plugin agents require `gh` CLI which only works with GitHub repos.

### Concrete Examples

**Agent 1 (Custom - Pattern A):**

If `review-bug-logic.md` contains the text `"You are an expert code reviewer specializing in bug detection..."` and the review scope is `src/auth.ts` with a diff:

```javascript
Task({
  subagent_type: "general-purpose",
  model: "opus",
  prompt: "---\nname: review-bug-logic\nmodel: opus\n---\n\nYou are an expert code reviewer specializing in bug detection, security vulnerabilities, and correctness analysis. Your primary goal is high precision...\n[...entire file content...]\n\n---\n\n## Review Context\n\n**Files under review**: src/auth.ts\n\n**Changes**:\ndiff --git a/src/auth.ts b/src/auth.ts\n...[full diff]...",
  description: "Review agent: Bug & Logic"
})
```

**Agent 3 (Official - Pattern B):**

```javascript
Task({
  subagent_type: "pr-review-toolkit:code-reviewer",
  prompt: "Review the following code changes. Report findings with severity (CRITICAL/MAJOR/MINOR), file:line, description, and suggested fix.\n\n**Files under review**: src/auth.ts\n\n**Changes**:\ndiff --git a/src/auth.ts b/src/auth.ts\n...[full diff]...",
  description: "Review agent: Code Reviewer"
})
```

**Agent 3 (Fallback - if Plugin B fails, re-spawn as Pattern A):**

```javascript
Task({
  subagent_type: "general-purpose",
  model: "opus",
  prompt: "<FULL CONTENTS OF review-code-reviewer.md>\n\n---\n\n## Review Context\n\n**Files under review**: src/auth.ts\n\n**Changes**:\ndiff --git a/src/auth.ts b/src/auth.ts\n...[full diff]...",
  description: "Review agent: Code Reviewer (fallback)"
})
```

Launch all 7 agents in ONE message. Re-spawn any failures as fallback agents.

---

## Orchestrator Synthesis

After ALL 7 agents return, synthesize their findings:

### Step 1: Collect All Findings

Extract every issue reported by each agent. Tag each finding with its source agent.

### Step 2: Deduplicate

If multiple agents flag the same issue (same file, same line, same concern), merge them into a single finding and note which agents flagged it. Multiple agents flagging the same issue INCREASES its confidence.

### Step 3: Cross-Reference

Look for correlated findings:
- Bug & Logic + Silent Failure Hunter flag the same area -> group as "Error handling gap"
- Type Design Analyzer + Bug & Logic flag the same type -> group as "Type safety concern"
- Comment Analyzer + any other agent -> "Documentation mismatch"
- Code Reviewer + Project Guidelines flag the same area -> group as "Standards violation"

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
| Code Reviewer | PASS/FAIL | N issues |
| Silent Failure Hunter | PASS/FAIL | N issues |
| Comment Analyzer | PASS/FAIL | N issues |
| Type Design Analyzer | PASS/FAIL | N issues |
| Test Coverage Analyzer | PASS/FAIL | N issues |

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
All 7 review agents passed with no findings. Code looks clean.
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

For EACH fix agent group, construct a Task call using this exact pattern:

```javascript
Task({
  subagent_type: "general-purpose",
  model: "opus",
  prompt: "You are a CODE FIX AGENT. Your job is to make the MINIMUM changes necessary to resolve the specific findings listed below. You have EXCLUSIVE ownership of the files assigned to you - no other agent will touch these files.\n\n## Fix Rules\n1. Fix ONLY the listed findings - do not refactor, do not improve code beyond the fix\n2. Fix CRITICAL findings first, then MAJOR, then MINOR (if included)\n3. Make the SMALLEST change that resolves each issue\n4. If a fix is uncertain, add a protective measure (null check, error handler, type guard) rather than restructuring\n5. Do NOT add new features, refactor surrounding code, or \"clean up while you're there\"\n6. After making fixes, briefly report what you changed for each finding\n\n## Your Files (EXCLUSIVE OWNERSHIP)\n<LIST_OF_FILES>\n\n## Findings to Fix\n\n<FOR_EACH_FINDING>\n### [SEVERITY]: [Title]\n- **File**: `path/to/file.ext:line_number`\n- **Issue**: [description]\n- **Suggested Fix**: [from the review report]\n</FOR_EACH_FINDING>\n\n## Output\n\nAfter making all fixes, report:\n\n## Fixes Applied\n1. **[Finding title]** - `file:line` - [What was changed]\n\n## Skipped (if any)\n1. **[Finding title]** - `file:line` - [Why it was skipped]",
  description: "Fix agent: <FILE_GROUP_DESCRIPTION>"
})
```

**Launch ALL fix agents in a SINGLE message** for maximum parallelism.

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
```

Then proceed to Phase 3.

---

## Phase 3: Code Simplification (Optional)

After Phase 2 fixes are applied, offer the user a code simplification pass. Skip this phase entirely if no fixes were applied in Phase 2.

### Prompt User

```
question: "Run code simplifier on the fixed files?"
header: "Simplify?"
options:
  - label: "Yes, simplify"
    description: "Code simplifier will refine the [N] fixed files for clarity and consistency"
  - label: "No, skip"
    description: "Keep fixes as-is without additional refinement"
```

### If User Accepts

Spawn the code simplifier on the fixed files. Try the official plugin first, fall back to `general-purpose` if not installed:

**Preferred (official plugin):**
```javascript
Task({
  subagent_type: "code-simplifier:code-simplifier",
  prompt: "Simplify and refine the following recently modified files for clarity, consistency, and maintainability while preserving all functionality. Focus only on these files:\n\n<LIST_OF_FIXED_FILES>",
  description: "Simplify fixed files"
})
```

**Fallback (if plugin not installed):**
```javascript
Task({
  subagent_type: "general-purpose",
  model: "opus",
  prompt: "You are a code simplifier. Simplify and refine the following recently modified files for clarity, consistency, and maintainability while preserving ALL functionality. Make code easier to read and maintain without changing behavior. Focus on: removing unnecessary complexity, improving naming, simplifying conditionals, extracting unclear expressions into named variables, and ensuring consistent style. Focus only on these files:\n\n<LIST_OF_FIXED_FILES>",
  description: "Simplify fixed files (fallback)"
})
```

After the simplifier returns, present:

```
## Simplification Summary

Code simplifier refined [N] files for clarity and consistency.
Changes: [brief description of simplifications made]

Review complete.
```

### If User Declines

```
Review complete.
```

---

## Critical Rules

- **YOU ARE AN ORCHESTRATOR** - delegate ALL review work to agents via the Task tool. You NEVER review code yourself. If you catch yourself analyzing code for bugs/style/etc, STOP and spawn an agent instead.
- **TWO AGENT PATTERNS** - Custom agents (1-2) always use `subagent_type: "general-purpose"` with `model: "opus"` and embedded `.md` prompts. Official plugin agents (3-7) prefer their plugin-qualified `subagent_type` (e.g. `pr-review-toolkit:code-reviewer`) but fall back to Pattern A with their `.md` file if the plugin isn't installed. **Pattern B is GitHub-only** — on non-GitHub repos (`GIT_PLATFORM` is `gitlab` or `other`), skip Pattern B entirely and use Pattern A for all 7 agents.
- **SELF-CONTAINED** - This skill works with zero external plugins. All 7 agents have `.md` fallback definitions bundled in the plugin's `agents/` directory. Plugins (`pr-review-toolkit`, `code-simplifier`) enhance the experience but are NOT required.
- **EMBED FULL FILE CONTENTS** - paste the ENTIRE agent definition `.md` file content into the Task `prompt` field for Pattern A agents. NEVER summarize, abbreviate, or paraphrase the agent definitions.
- **DISCOVER THEN READ THEN SPAWN** - Step 0: Glob to find the plugin's agents directory. Step 1: Read all 7 agent definition files (one message, 7 parallel Read calls). Step 2: Launch all 7 Task calls (next message, 7 parallel Task calls). Steps 0-1 can be one message, but Step 2 must be separate. Reading all 7 upfront ensures fallback data is ready.
- **FALLBACK ON ERROR** - If an official plugin agent (Pattern B) returns an error, immediately re-spawn it as Pattern A using the already-loaded `.md` file content. Do NOT re-prompt the user or abandon the agent.
- **LAUNCH ALL 7 REVIEW AGENTS IN ONE MESSAGE** - maximize parallelism
- **DEDUPLICATE** - raw agent output is redundant; your synthesis adds value
- **NEVER modify code without user consent** - Phase 2 and Phase 3 are opt-in
- **FIX AGENTS OWN FILES EXCLUSIVELY** - no two agents edit the same file
- **MINIMUM CHANGES ONLY** - fix agents resolve findings, they don't refactor
- **RESPECT scope** - only review what was specified
- **EMPTY SCOPE = HELP** - show usage, don't review nothing
- **HEALTH SCORE IS DETERMINISTIC** - use the formula exactly
- Agent verdicts: PASS = zero findings, FAIL = one or more findings
