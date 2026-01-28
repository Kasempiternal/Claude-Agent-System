# DECISION ENGINE MODULE

Semantic AI analysis for workflow selection using 3-dimensional assessment.

## Semantic Analysis (Not Keyword Matching)

**Critical**: Claude performs genuine semantic analysis of the task, not keyword pattern matching.

### How It Works

When evaluating a task, Claude:
1. **Understands** the full context and intent
2. **Rates** each dimension on a 1-5 scale with reasoning
3. **Calculates** combined score
4. **Selects** appropriate workflow

### The Three Dimensions

| Dimension | What to Assess | Scale |
|-----------|----------------|-------|
| **Complexity** | How intricate is the implementation? | 1 (trivial) to 5 (very complex) |
| **Risk** | What could go wrong? Data loss? Breaking changes? | 1 (safe) to 5 (high stakes) |
| **Scope** | How much of the codebase is affected? | 1 (single file) to 5 (system-wide) |

## Assessment Template

For each task, Claude performs this analysis inline (no agent spawn needed):

```
SEMANTIC ASSESSMENT
━━━━━━━━━━━━━━━━━━━

Task: "[user's request]"

Complexity: [1-5] - [one sentence explaining why]
Risk: [1-5] - [one sentence explaining why]
Scope: [1-5] - [one sentence explaining why]

Combined Score: (C + R + S) / 3 = [X.X]

Workflow: [selected workflow based on score]
```

## Workflow Selection Matrix

| Combined Score | Workflow | Rationale |
|----------------|----------|-----------|
| 1.0 - 2.0 | `orchestrated` | Simple, low-risk, focused changes |
| 2.1 - 3.5 | `complete_system` | Moderate complexity, needs validation |
| 3.6 - 5.0 | `plan-opus` | Complex, requires planning and phased execution |

### Special Overrides

Regardless of score, use specific workflows when:

| Condition | Workflow | Why |
|-----------|----------|-----|
| Web app development intent | `anti-yolo-web` | Specialized for web |
| PRD/feature development | `aidevtasks` | Structured feature flow |
| Project initialization | `agetos` | Setup-specific |
| Security concerns detected | Add security scan | Always validate security |

## Example Assessments

### Example 1: Simple Fix
```
Task: "fix typo in readme"

Complexity: 1 - Single character/word change, no logic
Risk: 1 - Documentation only, cannot break anything
Scope: 1 - One file

Combined: 1.0 → orchestrated
```

### Example 2: Moderate Feature
```
Task: "add pagination to the user list API"

Complexity: 2 - Standard pattern, well-understood
Risk: 2 - Could affect existing API consumers
Scope: 2 - API endpoint + frontend component

Combined: 2.0 → orchestrated
```

### Example 3: Complex Refactor
```
Task: "refactor authentication to use OAuth2"

Complexity: 4 - Multiple integration points, new protocol
Risk: 4 - Authentication is critical, could lock users out
Scope: 4 - Auth module, middleware, tests, config

Combined: 4.0 → plan-opus
```

### Example 4: System Migration
```
Task: "migrate from REST to GraphQL"

Complexity: 5 - Complete API paradigm shift
Risk: 4 - Breaking change for all clients
Scope: 5 - Entire API layer

Combined: 4.7 → plan-opus
```

## Display Format

Show the assessment to the user for transparency:

```
🧠 DECISION ENGINE
━━━━━━━━━━━━━━━━━━

Task: "add user profile page"

Assessment:
• Complexity: 2/5 - Standard CRUD with form
• Risk: 1/5 - New feature, nothing to break
• Scope: 2/5 - Route, component, API call

Combined: 1.7 → Using **orchestrated** workflow
```

## Why Semantic Over Keywords

**Old approach (keyword matching)**:
- `"fix"` in task → always simple
- `"refactor"` in task → always complex
- **Problem**: "fix critical security vulnerability" was treated as simple

**New approach (semantic analysis)**:
- Claude understands "fix security vulnerability" is high-risk
- Claude recognizes "refactor CSS" is low-risk
- **Benefit**: Accurate assessment based on meaning, not words

## Integration

This module integrates with:
- `02-LYRA-OPTIMIZATION.md` - Task understanding
- `04-WORKFLOW-SELECTION.md` - Workflow options
- `05-IMPLEMENTATION-STEPS.md` - Execution flow

## Confidence Reporting

After assessment, Claude can report confidence:

| Confidence | Meaning |
|------------|---------|
| **High** (0.9+) | Clear task, obvious workflow choice |
| **Medium** (0.7-0.9) | Some ambiguity, but reasonable selection |
| **Low** (<0.7) | Task unclear, may want to ask user |

If confidence is low, Claude should ask clarifying questions before proceeding.

---

*Genuine understanding beats pattern matching.*
