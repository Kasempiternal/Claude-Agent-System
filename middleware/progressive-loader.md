# Progressive Loader - Context Optimization System

## Purpose
Implements lazy loading for large modules to reduce context usage by 20-30% through intelligent progressive disclosure.

## Loading Levels

### Level 1: MINIMAL (Initial Load)
**When**: Simple tasks, quick fixes, low complexity
**What to Load**:
- Module headers and purpose statements
- Core function signatures (without implementation details)
- Critical configuration parameters
- Essential validation rules

**Context Savings**: ~60% reduction vs full load

### Level 2: STANDARD (Default Load)
**When**: Medium complexity tasks, typical development
**What to Load**:
- Everything from MINIMAL
- Implementation logic summaries
- Key examples and patterns
- Error handling strategies
- Common edge cases

**Context Savings**: ~30% reduction vs full load

### Level 3: FULL (Complete Load)
**When**: Complex tasks, architectural changes, debugging
**What to Load**:
- Everything from STANDARD
- Complete implementation details
- All examples and edge cases
- Detailed troubleshooting guides
- Advanced configuration options

**Context Savings**: 0% (full context)

## Loading Strategy

### Automatic Level Detection

```markdown
TASK ANALYSIS → LOADING LEVEL SELECTION

IF (complexity_score < 3 AND scope_impact < 3):
    → MINIMAL loading
    → Load only headers and signatures

ELSE IF (complexity_score <= 6 OR scope_impact <= 6):
    → STANDARD loading
    → Load summaries and key patterns

ELSE:
    → FULL loading
    → Load complete documentation
```

### Progressive Upgrade Path

```markdown
START: Load at detected level
    ↓
DURING EXECUTION: Monitor for missing context signals
    ↓
IF (agent requests more detail OR task complexity increases):
    → Upgrade to next level
    → Load additional sections on-demand
    ↓
CONTINUE: With enhanced context
```

## Module Structure for Progressive Loading

### Standard Module Template

```markdown
# Module Name

## [MINIMAL] Core Purpose
[Always loaded - 2-3 sentences describing module function]

## [MINIMAL] Function Signatures
[Always loaded - Input/output contracts only]

---

## [STANDARD] Implementation Strategy
[Load on STANDARD+ - How it works overview]

## [STANDARD] Key Patterns
[Load on STANDARD+ - Common usage examples]

---

## [FULL] Complete Implementation
[Load on FULL only - Detailed logic and code]

## [FULL] Advanced Configuration
[Load on FULL only - All options and edge cases]

## [FULL] Troubleshooting Guide
[Load on FULL only - Detailed debugging]
```

## Loading Instructions for Claude

### Initial Load Directive

```markdown
🔄 PROGRESSIVE LOADING ACTIVE

Loading Level: {MINIMAL|STANDARD|FULL}
Reason: {brief justification}

INSTRUCTIONS:
1. Load only sections marked [{LEVEL}] or lower
2. Skip sections marked above your level
3. If you need more context, request level upgrade
4. Monitor for context limit warnings
```

### On-Demand Loading

```markdown
UPGRADE REQUEST SYNTAX:

"I need {MODULE_NAME} at {STANDARD|FULL} level because {reason}"

SYSTEM RESPONSE:
✅ Upgrading {MODULE_NAME} to {LEVEL}
📊 Context Impact: +{N} tokens
🔄 Loading additional sections...
```

## Module Candidates for Progressive Loading

### High Priority (Large Modules)
1. **commands/systemcc/05-IMPLEMENTATION-STEPS.md** (~800 lines)
   - MINIMAL: Workflow list, agent names
   - STANDARD: Agent summaries, key validations
   - FULL: Complete agent specs, all edge cases

2. **commands/systemcc/07-DECISION-ENGINE.md** (~400 lines)
   - MINIMAL: Scoring dimensions, thresholds
   - STANDARD: Scoring logic, workflow mapping
   - FULL: Complete algorithms, examples

3. **middleware/hooks/hook-registry.md** (Future)
   - MINIMAL: Hook types, execution order
   - STANDARD: Registration API, common patterns
   - FULL: Complete implementation, edge cases

### Medium Priority
4. **middleware/automated-workflow-executor.md** (~300 lines)
5. **commands/systemcc/11-MEMORY-UPDATE.md** (~250 lines)

## Implementation Markers

### Section Markers (For Module Authors)

```markdown
<!-- [MINIMAL] -->
Content always loaded for this module
<!-- [/MINIMAL] -->

<!-- [STANDARD] -->
Content loaded for STANDARD and FULL levels
<!-- [/STANDARD] -->

<!-- [FULL] -->
Content loaded only at FULL level
<!-- [/FULL] -->
```

### Alternative: Heading-Based Markers

```markdown
## [MINIMAL] Section Name
This section loads at MINIMAL and above

## [STANDARD] Section Name
This section loads at STANDARD and FULL only

## [FULL] Section Name
This section loads at FULL only
```

## Context Monitoring

### Signals for Level Upgrade

**Upgrade from MINIMAL to STANDARD when**:
- Agent asks "how does X work?"
- Implementation details are referenced but not loaded
- Validation failures require understanding logic

**Upgrade from STANDARD to FULL when**:
- Complex debugging required
- Edge case handling needed
- Architectural understanding required
- Multiple related modules interact

### Signals for Level Downgrade

**Downgrade to STANDARD when**:
- Task completes faster than expected
- Context limit warnings appear
- Detailed sections unused after 3+ tool calls

## Performance Metrics

### Expected Outcomes

| Module Type | Full Size | MINIMAL Size | STANDARD Size | Savings |
|-------------|-----------|--------------|---------------|---------|
| Large (800+ lines) | 800 lines | 120 lines | 320 lines | 60% / 30% |
| Medium (300-500) | 400 lines | 80 lines | 180 lines | 55% / 30% |
| Small (<300) | 200 lines | 60 lines | 120 lines | 40% / 20% |

**Overall System Impact**: 20-30% context reduction across average task execution

## Integration Points

### 1. In 00-INDEX.md Initialization

```markdown
STEP 1: Load progressive-loader.md at FULL level (always)
STEP 2: Analyze task complexity
STEP 3: Determine loading level for all other modules
STEP 4: Apply loading level markers during module reads
```

### 2. In 12-PROGRESSIVE-DISCLOSURE.md

```markdown
- Define loading level for current task
- List modules and their assigned levels
- Provide upgrade instructions for Claude
```

### 3. In Module Headers

```markdown
# Module Name
[PROGRESSIVE LOADING COMPATIBLE - Default Level: STANDARD]
```

## Backward Compatibility

- **No breaking changes**: Modules without markers load fully
- **Gradual migration**: Add markers to large modules first
- **Fallback**: If level detection fails, default to FULL loading
- **Override**: User can force FULL loading via flag

## Advanced Features

### Context Budget Management

```markdown
CONTEXT BUDGET TRACKING:

Starting Budget: 200,000 tokens
Current Usage: {current} tokens
Remaining: {remaining} tokens

IF remaining < 50,000:
    → Switch all modules to MINIMAL
    → Flag context pressure warning

IF remaining < 20,000:
    → Emergency context shedding
    → Keep only active module at MINIMAL
```

### Intelligent Pre-Loading

```markdown
PREDICTIVE LOADING:

IF task involves "authentication":
    → Pre-load auth-related modules at STANDARD
    → Keep others at MINIMAL

IF task involves "database":
    → Pre-load DB modules at STANDARD
    → Pre-load validation modules at STANDARD
```

## Usage Example

```markdown
📋 TASK: "Fix TypeScript error in auth.ts"

PROGRESSIVE LOADER ANALYSIS:
✓ Complexity: LOW (2/10)
✓ Scope: SINGLE-FILE (2/10)
→ Loading Level: MINIMAL

MODULES LOADED:
- 00-INDEX.md: FULL (always)
- 01-CRITICAL-DETECTION.md: MINIMAL (headers only)
- 05-IMPLEMENTATION-STEPS.md: MINIMAL (workflow list only)
- 07-DECISION-ENGINE.md: MINIMAL (scoring dimensions only)
- progressive-loader.md: FULL (always)

CONTEXT SAVED: ~4,500 tokens (35% reduction)

---

🔄 MID-TASK: Error requires understanding validation logic

UPGRADE REQUEST:
"I need 05-IMPLEMENTATION-STEPS.md at STANDARD level to understand validation patterns"

SYSTEM RESPONSE:
✅ Upgrading to STANDARD level
📊 Loading validation summaries (+1,200 tokens)
✓ Additional context loaded

CONTINUE: With enhanced validation context
```

## Quality Assurance

### Testing Progressive Loading

1. **Minimal Test**: Simple task completes with MINIMAL-only loading
2. **Standard Test**: Medium task completes with STANDARD loading
3. **Upgrade Test**: Task successfully requests and uses level upgrades
4. **Full Test**: Complex task correctly uses FULL loading from start

### Validation Rules

- MINIMAL sections must be self-contained (no references to unloaded content)
- STANDARD sections can reference MINIMAL content
- FULL sections can reference any content
- Section markers must be consistent across all modules

## Migration Guide

### Converting Existing Module

**BEFORE** (Full Load):
```markdown
# Module

Purpose: Does X

Implementation:
[500 lines of detailed logic]

Examples:
[200 lines of examples]
```

**AFTER** (Progressive):
```markdown
# Module
[PROGRESSIVE LOADING COMPATIBLE - Default: STANDARD]

## [MINIMAL] Purpose
Does X by coordinating Y and Z

## [MINIMAL] Core Functions
- function1(input) → output
- function2(input) → output

---

## [STANDARD] Implementation Strategy
[100 line summary of logic]

## [STANDARD] Key Examples
[50 lines of common patterns]

---

## [FULL] Complete Implementation
[500 lines of detailed logic]

## [FULL] All Examples
[200 lines of all examples]
```

## Maintenance

### Adding New Modules

1. Decide default loading level (usually STANDARD)
2. Add progressive markers to sections
3. Test at each loading level
4. Update module list in 12-PROGRESSIVE-DISCLOSURE.md

### Optimizing Existing Modules

1. Identify modules using >300 lines regularly
2. Profile which sections are rarely used
3. Move rarely-used content to FULL sections
4. Test that MINIMAL/STANDARD levels still work

---

**Status**: Production Ready
**Performance**: 20-30% context reduction target
**Compatibility**: 100% backward compatible
**Migration**: Gradual, additive-only changes
