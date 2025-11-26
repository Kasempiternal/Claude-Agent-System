# 12-PROGRESSIVE-DISCLOSURE - Context Optimization Phase

## Phase Purpose
Determine and apply progressive loading levels for all systemcc modules to optimize context usage while maintaining task effectiveness.

## Execution Timing
**When**: Immediately after 00-INDEX initialization, before loading other modules
**Dependencies**: Requires task complexity analysis from Lyra optimization
**Output**: Loading level assignments for all subsequent module loads

---

## Progressive Loading Status

🔄 **PROGRESSIVE LOADING: ACTIVE**

This systemcc execution will use progressive disclosure to optimize context usage.

---

## Task Analysis for Loading Level

### Input Parameters
- **Task Description**: {user_task}
- **Complexity Score**: {from Lyra or initial analysis}
- **Scope Impact**: {from initial detection}
- **Time Pressure**: {urgent/normal/exploratory}

### Loading Level Determination

```
ANALYZE TASK CHARACTERISTICS:

1. Complexity Indicators:
   - Simple fix/single function: +1
   - Feature modification: +3
   - New feature development: +5
   - Architectural change: +7
   - System-wide refactor: +9

2. Scope Indicators:
   - Single file: +1
   - Multiple related files: +3
   - Module/package: +5
   - Cross-system: +7
   - Full codebase: +9

3. Risk Indicators:
   - Documentation only: +1
   - Non-critical feature: +3
   - User-facing feature: +5
   - Authentication/security: +7
   - Database/data integrity: +9

TOTAL SCORE = (Complexity + Scope + Risk) / 3

IF score <= 3: LOADING_LEVEL = MINIMAL
ELIF score <= 6: LOADING_LEVEL = STANDARD
ELSE: LOADING_LEVEL = FULL
```

---

## Current Task Loading Analysis

### Task Characteristics
```
📋 TASK: "{user_task}"

ANALYSIS:
- Complexity: {score}/10 - {description}
- Scope: {score}/10 - {description}
- Risk: {score}/10 - {description}

COMBINED SCORE: {average}/10
```

### Selected Loading Level

```
🎯 LOADING LEVEL: {MINIMAL | STANDARD | FULL}

RATIONALE:
{1-2 sentence explanation of why this level was chosen}

EXPECTED CONTEXT SAVINGS: ~{percentage}% reduction vs full load
ESTIMATED TOKEN REDUCTION: ~{number} tokens saved
```

---

## Module Loading Assignments

### Core System Modules (Always FULL)

These modules are small and critical, always loaded completely:

- ✅ `00-INDEX.md` - FULL (system initialization)
- ✅ `progressive-loader.md` - FULL (loading system itself)
- ✅ `12-PROGRESSIVE-DISCLOSURE.md` - FULL (this file)

### Workflow Modules (Progressive)

Based on selected level: **{MINIMAL | STANDARD | FULL}**

| Module | Size | Assigned Level | Rationale |
|--------|------|----------------|-----------|
| 01-CRITICAL-DETECTION.md | ~200 lines | {LEVEL} | {reason} |
| 02-LYRA-OPTIMIZATION.md | ~300 lines | {LEVEL} | {reason} |
| 03-BUILD-CONFIG.md | ~250 lines | {LEVEL} | {reason} |
| 04-WORKFLOW-SELECTION.md | ~350 lines | {LEVEL} | {reason} |
| 05-IMPLEMENTATION-STEPS.md | ~800 lines | {LEVEL} | {reason} |
| 06-ANALYSIS.md | ~200 lines | {LEVEL} | {reason} |
| 07-DECISION-ENGINE.md | ~400 lines | {LEVEL} | {reason} |
| 08-ORCHESTRATED-WORKFLOW.md | ~300 lines | {LEVEL} | {reason} |
| 09-COMPLETE-SYSTEM.md | ~250 lines | {LEVEL} | {reason} |
| 10-POST-REVIEW.md | ~200 lines | {LEVEL} | {reason} |
| 11-MEMORY-UPDATE.md | ~300 lines | {LEVEL} | {reason} |

### Middleware Modules (Progressive)

| Module | Size | Assigned Level | Rationale |
|--------|------|----------------|-----------|
| automated-workflow-executor.md | ~300 lines | {LEVEL} | {reason} |
| pattern-detector.md | ~200 lines | {LEVEL} | {reason} |
| session-state-tracker.md | ~150 lines | {LEVEL} | {reason} |
| hooks/hook-registry.md | ~250 lines | {LEVEL} | {reason} |

---

## Loading Instructions for Claude

### What to Load at Each Level

#### If MINIMAL Level Selected:

```
📚 MINIMAL LOADING ACTIVE - Load ONLY:

For Each Module:
- [MINIMAL] marked sections
- Headers and purpose statements
- Function signatures (no implementations)
- Critical configuration parameters
- Essential validation rules

SKIP:
- [STANDARD] marked sections
- [FULL] marked sections
- Detailed examples
- Implementation details
- Advanced configuration
- Troubleshooting guides

CONTEXT SAVINGS: ~60% vs full load
```

#### If STANDARD Level Selected:

```
📚 STANDARD LOADING ACTIVE - Load:

For Each Module:
- [MINIMAL] marked sections (all)
- [STANDARD] marked sections (all)
- Implementation logic summaries
- Key examples and patterns
- Error handling strategies
- Common edge cases

SKIP:
- [FULL] marked sections
- Complete implementation details
- Advanced troubleshooting
- Rare edge cases

CONTEXT SAVINGS: ~30% vs full load
```

#### If FULL Level Selected:

```
📚 FULL LOADING ACTIVE - Load:

For Each Module:
- ALL sections ([MINIMAL], [STANDARD], [FULL])
- Complete implementations
- All examples and edge cases
- Detailed troubleshooting
- Advanced configuration

CONTEXT SAVINGS: 0% (full context loaded)
```

---

## Dynamic Level Upgrades

### When to Request Upgrade

During task execution, request a level upgrade if:

1. **Missing Context Signals**:
   - You need implementation details not loaded at current level
   - Validation logic requires understanding not available
   - Error handling requires deeper context

2. **Task Complexity Increase**:
   - Subtask is more complex than initial analysis suggested
   - Related issues discovered requiring broader context
   - Architectural implications become apparent

3. **Specific Module Needs**:
   - One module needs more detail while others are fine
   - Debugging requires full context for specific component

### Upgrade Request Syntax

```markdown
🔄 PROGRESSIVE LOADING UPGRADE REQUEST

MODULE: {module_name}
CURRENT LEVEL: {current}
REQUESTED LEVEL: {STANDARD | FULL}

REASON: {1-2 sentence justification}

EXPECTED IMPACT: +{estimated_tokens} tokens
```

### System Response to Upgrade

```markdown
✅ UPGRADE APPROVED

Loading {module_name} at {new_level} level...
📊 Additional context loaded: {actual_tokens} tokens
🔄 Continuing with enhanced context...
```

---

## Context Budget Management

### Budget Tracking

```
CONTEXT BUDGET STATUS:

Total Available: 200,000 tokens
Current Usage: {current} tokens ({percentage}%)
Remaining: {remaining} tokens

Loading Level Impact:
- MINIMAL: ~15,000 tokens for all modules
- STANDARD: ~25,000 tokens for all modules
- FULL: ~40,000 tokens for all modules

Selected Level: {LEVEL}
Estimated Load: ~{estimate} tokens
Projected Remaining: ~{projected} tokens
```

### Emergency Context Management

```
⚠️ CONTEXT PRESSURE WARNING

IF remaining < 50,000 tokens:
    → AUTOMATIC DOWNGRADE to MINIMAL for all modules
    → Keep only active workflow at STANDARD
    → Flag warning to user

IF remaining < 20,000 tokens:
    → EMERGENCY CONTEXT SHEDDING
    → Keep only currently executing module
    → Load others on absolute need basis
    → Strongly recommend task simplification
```

---

## Intelligent Pre-Loading

### Pattern-Based Pre-Loading

Based on task patterns, pre-load related modules at higher levels:

```
PATTERN DETECTION:

IF task contains ["auth", "login", "session", "jwt"]:
    → Load auth-related agents at STANDARD
    → Load security validation at STANDARD
    → Keep others at MINIMAL

IF task contains ["database", "query", "migration", "schema"]:
    → Load DB-related modules at STANDARD
    → Load data validation at STANDARD
    → Keep others at MINIMAL

IF task contains ["ui", "component", "styling", "layout"]:
    → Load frontend agents at STANDARD
    → Load component patterns at STANDARD
    → Keep backend at MINIMAL

IF task contains ["test", "spec", "coverage"]:
    → Load testing modules at FULL
    → Load quality validation at STANDARD
    → Keep implementation at STANDARD
```

---

## Module-Specific Loading Rules

### 05-IMPLEMENTATION-STEPS.md (Largest Module)

**MINIMAL Level**:
- Load: Workflow types list, agent names only
- Skip: Agent specifications, validation details
- Savings: ~600 lines

**STANDARD Level**:
- Load: Agent summaries (2-3 lines each), key validations
- Skip: Complete agent specs, all edge cases
- Savings: ~400 lines

**FULL Level**:
- Load: Everything
- Savings: 0 lines

### 07-DECISION-ENGINE.md (Complex Logic)

**MINIMAL Level**:
- Load: 5 scoring dimensions, threshold values only
- Skip: Scoring algorithms, examples, edge cases
- Savings: ~300 lines

**STANDARD Level**:
- Load: Scoring logic summaries, workflow mapping rules
- Skip: Complete algorithms, all examples
- Savings: ~150 lines

**FULL Level**:
- Load: Everything
- Savings: 0 lines

### Hooks Modules (Future)

**MINIMAL Level**:
- Load: Hook types, execution order, trigger points
- Skip: Registration details, implementation, examples

**STANDARD Level**:
- Load: Registration API, common usage patterns
- Skip: Advanced configuration, edge cases

**FULL Level**:
- Load: Everything

---

## Validation and Quality

### Loading Level Validation

After applying loading level, verify:

✅ **Completeness Check**:
- Can the task be completed with loaded context?
- Are all required functions/workflows accessible?
- Is validation logic sufficient?

✅ **Efficiency Check**:
- Is any loaded content unnecessary for this task?
- Could a lower level work equally well?
- Are we over-loading for task complexity?

✅ **Performance Check**:
- Is context usage within acceptable bounds?
- Can we complete task without hitting context limits?
- Is upgrade path clear if needed?

---

## Migration Notes

### Current State (Pre-Phase 3)
- All modules load completely
- No progressive loading markers
- Average context usage: ~40,000 tokens per task

### After Phase 3.1 Implementation
- Progressive loading available
- MINIMAL/STANDARD/FULL markers in large modules
- Target context usage: ~25,000-30,000 tokens per task
- 20-30% reduction achieved

### Gradual Module Migration
1. Start with 05-IMPLEMENTATION-STEPS.md (largest)
2. Add to 07-DECISION-ENGINE.md (complex)
3. Expand to workflow modules as needed
4. Eventually cover all modules >200 lines

---

## Usage Examples

### Example 1: Simple Bug Fix

```
TASK: "Fix TypeScript error in auth.ts line 45"

ANALYSIS:
- Complexity: 2/10 (simple fix)
- Scope: 2/10 (single file)
- Risk: 5/10 (auth related)
COMBINED: 3/10

LOADING LEVEL: MINIMAL

MODULES LOADED:
- Core modules: FULL (required)
- 01-04: MINIMAL (headers only)
- 05-IMPLEMENTATION: MINIMAL (workflow list only)
- 07-DECISION-ENGINE: MINIMAL (dimensions only)
- Others: MINIMAL

CONTEXT SAVED: ~18,000 tokens (45%)
EXECUTION: Successful without upgrade needed
```

### Example 2: New Feature Development

```
TASK: "Add password reset functionality with email verification"

ANALYSIS:
- Complexity: 6/10 (new feature)
- Scope: 5/10 (multiple files)
- Risk: 8/10 (authentication + email)
COMBINED: 6.3/10

LOADING LEVEL: STANDARD

MODULES LOADED:
- Core modules: FULL
- Auth-related: STANDARD (pre-loaded)
- Workflow modules: STANDARD
- Implementation: STANDARD (agent summaries)
- Decision engine: STANDARD (logic summaries)

CONTEXT SAVED: ~12,000 tokens (30%)

MID-EXECUTION UPGRADE:
- Needed full validation patterns
- Upgraded 05-IMPLEMENTATION to FULL
- Successfully completed with enhanced context
```

### Example 3: Architectural Refactor

```
TASK: "Refactor authentication system to use JWT instead of sessions"

ANALYSIS:
- Complexity: 9/10 (architectural change)
- Scope: 8/10 (system-wide)
- Risk: 9/10 (auth + breaking change)
COMBINED: 8.7/10

LOADING LEVEL: FULL

MODULES LOADED:
- ALL modules at FULL level
- Complete context needed for:
  - Understanding current architecture
  - Planning migration strategy
  - Ensuring no breaking changes
  - Comprehensive testing

CONTEXT SAVED: 0 tokens (full load required)
EXECUTION: Complex task requires complete context
```

---

## Success Metrics

### Phase 3 Goals

✅ **Context Reduction**: Achieve 20-30% reduction on average tasks
✅ **Task Completion**: 100% completion rate across all loading levels
✅ **Upgrade Accuracy**: <10% of tasks require level upgrades
✅ **Performance**: No degradation in task quality

### Monitoring

Track across 100 tasks:
- Average context usage per loading level
- Upgrade request frequency
- Task completion success rates
- Context limit warnings/failures

---

## Integration Checklist

- ✅ Progressive loader system created (`middleware/progressive-loader.md`)
- ✅ Loading level definitions created (this file)
- ⏳ 00-INDEX.md updated with progressive loading initialization
- ⏳ Large modules marked with [MINIMAL]/[STANDARD]/[FULL] sections
- ⏳ Testing completed across all loading levels
- ⏳ Performance metrics validated

---

**Status**: Ready for Integration
**Dependencies**: Requires 00-INDEX.md modification
**Next Steps**: Update 00-INDEX.md to activate progressive loading
**Expected Impact**: 20-30% context reduction on average tasks
