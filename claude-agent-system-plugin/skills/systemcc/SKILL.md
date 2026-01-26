---
name: systemcc
description: "Intelligent workflow router - Auto-analyzes task complexity, risk, and scope to select and execute the optimal workflow automatically. The only command you need."
model: opus
argument-hint: <task description>
---

# SystemCC - Master Command Router

**User types:** `/systemcc "any task"`
**Claude does:** EVERYTHING automatically

## Immediate Response

When invoked, IMMEDIATELY display:

```
🎯 SYSTEMCC ACTIVATED
━━━━━━━━━━━━━━━━━━━━━
Task: $ARGUMENTS

Analyzing...
```

## Phase 1: Task Analysis (3-Dimensional)

Analyze the task across three dimensions:

### Dimension 1: Complexity
| Level | Indicators |
|-------|------------|
| **Simple** | fix, update, change, small, typo, rename, style |
| **Moderate** | feature, add, create, implement, modify |
| **Complex** | architecture, refactor, system, integration, migration, security |

### Dimension 2: Risk
| Level | Indicators |
|-------|------------|
| **Low** | docs, style, test, config (non-production) |
| **High** | critical, production, breaking, delete, security, database, auth, payment |

### Dimension 3: Scope
| Level | Indicators |
|-------|------------|
| **Single** | specific file mentioned, "this file", "the function" |
| **Multi** | "multiple", "several files", specific file list |
| **System** | "entire", "all files", "across", "throughout", "migrate all" |

Display analysis:
```
📊 Task Analysis:
   - Complexity: [Simple/Moderate/Complex]
   - Risk: [Low/High]
   - Scope: [Single/Multi/System]
```

## Phase 2: Workflow Selection

Use this decision table:

| Complexity | Risk | Scope | Workflow |
|------------|------|-------|----------|
| Simple | Low | Single | **Quick Fix** |
| Simple | Low | Multi | **Quick Fix** |
| Simple | High | Any | **Full Validation** |
| Moderate | Low | Single | **Standard** |
| Moderate | Low | Multi | **Full Validation** |
| Moderate | High | Any | **Full Validation** |
| Complex | Any | Any | **Full Validation** |
| Any | Any | System | **Phased Execution** |

### Priority Overrides
1. **Context >30k tokens** → Phased Execution
2. **Security keywords detected** → Enable security scan
3. **Web/UI task detected** → Include wireframe phase

Display selection:
```
📋 Selected Workflow: [Workflow Name]
   ↳ Reason: [Brief explanation]
   ↳ Security Scan: [Enabled/Disabled]
```

## Phase 3: Automatic Execution

**CRITICAL: Execute ALL phases automatically. NEVER ask user to run commands.**

### Quick Fix Workflow
```
🔄 Analyzing code...
🔄 Implementing fix...
🔄 Verifying changes...
✅ Complete!
```

### Standard Workflow
```
🔄 Phase 1/4: Analysis
🔄 Phase 2/4: Implementation
🔄 Phase 3/4: Testing
🔄 Phase 4/4: Review
✅ Complete!
```

### Full Validation Workflow
```
🔄 Phase 1/6: Strategic Analysis
🔄 Phase 2/6: Implementation Planning
🔄 Phase 3/6: Code Implementation
🔄 Phase 4/6: Testing & Validation
🔄 Phase 5/6: Code Review
🔄 Phase 6/6: Documentation
✅ Complete!
```

### Phased Execution Workflow (Large Tasks)
For system-wide changes, decompose into phases:
```
🔄 Decomposing task into phases...

Phase 1: [Component A]
├─ Files: [list]
└─ Status: Pending

Phase 2: [Component B]
├─ Files: [list]
└─ Status: Pending

[Execute each phase sequentially]
```

## Phase 4: Code Review (Automatic)

After implementation, run triple review:

```
🔍 POST-EXECUTION REVIEW
━━━━━━━━━━━━━━━━━━━━━━━
Running parallel code reviews...

├─ 👨‍💻 Code Quality: [PASS/ISSUES]
├─ 👩‍💼 Architecture: [PASS/ISSUES]
└─ 🏗️ Integration: [PASS/ISSUES]
```

If issues found:
- Critical → Auto-fix before proceeding
- Minor → Note in summary

## Phase 5: Final Summary

```
✅ TASK COMPLETE
━━━━━━━━━━━━━━━

What changed:
• [Brief point 1]
• [Brief point 2]
• [Brief point 3]

Files modified: [count]
Tests: [status]
```

## Security Auto-Detection

Automatically enable security scanning when task mentions:

| Category | Keywords |
|----------|----------|
| Database | sql, query, database, migration, schema |
| Auth | auth, login, password, token, jwt, session |
| Security | encrypt, decrypt, permission, role, certificate |

When triggered:
```
🔐 Security scan auto-enabled: [reason]
```

## Critical Rules

1. **NEVER ask user to run another command** - you handle everything
2. **NEVER ask user to continue** - proceed automatically through all phases
3. **NEVER ask user to choose workflow** - you decide based on analysis
4. **ALWAYS show progress** - display phase status as you work
5. **ALWAYS complete the task** - don't stop mid-workflow

## User Interaction Rules

### ONLY Ask User For:
- **Specifications**: "Which authentication method do you prefer?"
- **Clarifications**: "Should this work on mobile devices?"
- **Decisions**: "Database choice: PostgreSQL or MySQL?"

### NEVER Ask User To:
- Run another command
- Execute a specific agent
- Continue with next phase
- Choose workflow manually

## Error Handling

If something fails:
1. Display clear error message
2. Attempt automatic recovery
3. If unrecoverable, explain what happened and suggest fix

```
⚠️ Issue encountered: [description]
🔄 Attempting recovery...
[Either: ✅ Recovered! Continuing...]
[Or: ❌ Manual intervention needed: [specific action]]
```

## Interruption Handling

When user says "no", "stop", "don't do that":
1. IMMEDIATELY STOP current action
2. Acknowledge: "Got it! I'll remember not to [action]"
3. Ask: "What would you prefer instead?"

---

**Remember**: SystemCC is the ONLY command users need. Analyze → Select → Execute → Review → Complete. All automatic.
