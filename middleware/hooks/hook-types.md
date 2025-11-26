# Hook Types

## Purpose
Defines the three core hook types in the systemcc workflow: UserPromptSubmit, PostToolUse, and Stop. Each hook type has specific execution points, context data, and use cases.

## Overview

The hook system provides three lifecycle points for extending systemcc functionality:

1. **UserPromptSubmit**: Execute when user submits a `/systemcc` command
2. **PostToolUse**: Execute after Edit/Write/MultiEdit operations
3. **Stop**: Execute before workflow completion

## Hook Type Definitions

### 1. UserPromptSubmit Hooks

**Execution Point**: Phase 1 (immediately after Critical Detection message)

**Timing**: Before Lyra optimization, before workflow selection

**Purpose**: Analyze user request and provide early insights

#### Context Data

```javascript
{
  "user_request": "add authentication to API",
  "loaded_files": [
    "src/app.ts",
    "src/routes/users.ts"
  ],
  "session_state": {
    "session_id": "uuid",
    "commands_executed": [...],
    "patterns_detected": ["api", "backend"]
  },
  "working_directory": "/project/root",
  "timestamp": "2025-01-26T14:30:00Z"
}
```

#### Expected Output

```javascript
{
  "hook_id": "auto-pattern-detection",
  "status": "success",
  "data": {
    "patterns_detected": ["authentication", "security"],
    "confidence": 0.85,
    "suggested_workflow": "complete_system",
    "enable_security_scan": true,
    "hints": ["🔒 Authentication task detected"],
    "display_message": "💡 PATTERN DETECTED: 🔒 Authentication\n   Recommendation: Complete system workflow with security validation"
  }
}
```

#### Use Cases

- **Pattern Detection**: Identify task type from keywords
- **Context Analysis**: Analyze loaded files for clues
- **Session Awareness**: Check recent session patterns
- **Auto-Configuration**: Enable features based on request
- **User Guidance**: Provide helpful hints early

#### Example Hooks

1. **auto-pattern-detection.md**
   - Detects patterns in user request
   - Suggests optimal workflow
   - Enables security scanning if needed

2. **context-analyzer.md**
   - Analyzes loaded files for context
   - Identifies working domain (frontend/backend)
   - Suggests relevant tools/agents

3. **session-continuity.md**
   - Checks session state for ongoing work
   - Suggests continuation of previous task
   - Displays recent context

#### Integration

```python
# In 01-CRITICAL-DETECTION.md

# Show mandatory detection message
print("🎯 SYSTEMCC DETECTED - Command acknowledged")

# Execute UserPromptSubmit hooks
context = {
    "user_request": user_request,
    "loaded_files": get_loaded_files(),
    "session_state": load_session_state(),
    "working_directory": os.getcwd()
}

hook_results = execute_hooks("UserPromptSubmit", context)

# Display results
for result in hook_results:
    if result["status"] == "success" and "display_message" in result["data"]:
        print(result["data"]["display_message"])
```

---

### 2. PostToolUse Hooks

**Execution Point**: Immediately after each Edit/Write/MultiEdit operation

**Timing**: During workflow execution, after file modifications

**Purpose**: Track changes, validate edits, maintain state

#### Context Data

```javascript
{
  "tool": "Edit",
  "file_path": "src/auth/middleware.ts",
  "operation": {
    "old_content": "const validate = ...",
    "new_content": "const validate = ...",
    "lines_changed": 15
  },
  "workflow_phase": "implementation",
  "workflow_type": "complete_system",
  "session_state": {...},
  "timestamp": "2025-01-26T14:35:22Z"
}
```

#### Expected Output

```javascript
{
  "hook_id": "file-change-tracker",
  "status": "success",
  "data": {
    "file_tracked": true,
    "modification_count": 2,
    "change_summary": "Added JWT validation",
    "session_update": {
      "files_modified": {
        "src/auth/middleware.ts": {
          "modification_count": 2,
          "last_modified": "2025-01-26T14:35:22Z",
          "changes_summary": "Created auth middleware, Added JWT validation"
        }
      }
    }
  }
}
```

#### Use Cases

- **Change Tracking**: Record all file modifications
- **Validation**: Run syntax/lint checks after edits
- **Session Updates**: Update session state with changes
- **Build Triggers**: Trigger builds after certain changes
- **Metrics Collection**: Track code changes for analytics

#### Example Hooks

1. **file-change-tracker.md**
   - Tracks all file modifications in session
   - Updates session state automatically
   - Builds file modification history

2. **validation-runner.md**
   - Runs linters after code changes
   - Validates syntax
   - Checks formatting rules

3. **build-trigger.md**
   - Triggers incremental builds
   - Runs type checking
   - Updates compilation state

#### Integration

```python
# In workflow execution (after Edit tool)

def after_edit(file_path, changes):
    context = {
        "tool": "Edit",
        "file_path": file_path,
        "operation": changes,
        "workflow_phase": current_phase,
        "workflow_type": selected_workflow,
        "session_state": session_state
    }

    hook_results = execute_hooks("PostToolUse", context)

    # Apply session updates
    for result in hook_results:
        if "session_update" in result.get("data", {}):
            apply_session_updates(result["data"]["session_update"])
```

---

### 3. Stop Hooks

**Execution Point**: Phase 11 (after Memory Update, before completion message)

**Timing**: End of workflow, before final summary

**Purpose**: Final validations, builds, tests

#### Context Data

```javascript
{
  "workflow_type": "complete_system",
  "workflow_status": "completed",
  "files_modified": [
    "src/auth/middleware.ts",
    "src/routes/auth.ts",
    "src/utils/jwt.ts"
  ],
  "duration_seconds": 420,
  "errors_encountered": [],
  "session_state": {...},
  "memory_updates": {
    "patterns": 3,
    "decisions": 2,
    "issues": 4
  },
  "timestamp": "2025-01-26T14:42:00Z"
}
```

#### Expected Output

```javascript
{
  "hook_id": "build-validator",
  "status": "success",
  "data": {
    "build_status": "success",
    "build_output": "Build completed successfully\n0 errors, 0 warnings",
    "tests_passed": true,
    "display_message": "✅ BUILD VALIDATION\n   • TypeScript compilation: ✓\n   • Tests: 45 passed\n   • Linting: ✓"
  }
}
```

#### Use Cases

- **Build Validation**: Run final build check
- **Test Execution**: Run test suite
- **Quality Gates**: Enforce quality standards
- **Deployment Prep**: Prepare for deployment
- **Cleanup**: Clean temporary files

#### Example Hooks

1. **build-validator.md**
   - Runs TypeScript compilation
   - Checks for build errors
   - Validates configuration

2. **test-runner.md**
   - Executes test suite
   - Reports test results
   - Fails on test failures

3. **quality-gate.md**
   - Checks code coverage
   - Validates linting
   - Enforces standards

#### Integration

```python
# In 11-MEMORY-UPDATE.md (end of phase)

def workflow_completion():
    # Memory updates complete
    update_all_memory_banks()

    # Execute Stop hooks
    context = {
        "workflow_type": selected_workflow,
        "workflow_status": "completed",
        "files_modified": all_modified_files,
        "duration_seconds": elapsed_time,
        "errors_encountered": errors,
        "session_state": session_state,
        "memory_updates": memory_stats
    }

    hook_results = execute_hooks("Stop", context)

    # Display validation results
    for result in hook_results:
        if "display_message" in result.get("data", {}):
            print(result["data"]["display_message"])

    # Show final summary
    print("✅ TASK COMPLETE")
```

---

## Hook Interface Contract

All hooks must implement this interface:

```python
class Hook:
    """Base interface for all hooks."""

    def execute(self, context):
        """
        Execute hook logic.

        Args:
            context: Dictionary with execution context

        Returns:
            {
                "hook_id": str,
                "status": "success"|"failed"|"skipped",
                "data": dict,  # Hook-specific data
                "error": str   # Optional error message
            }
        """
        raise NotImplementedError

    def should_execute(self, context):
        """
        Determine if hook should execute based on context.

        Args:
            context: Dictionary with execution context

        Returns:
            bool: True if hook should execute
        """
        return True  # Default: always execute
```

## Hook Return Codes

### Status Codes

- **success**: Hook executed successfully
- **failed**: Hook encountered an error
- **skipped**: Hook chose not to execute
- **timeout**: Hook execution exceeded timeout

### Data Keys

Common keys in `data` dictionary:

- `display_message`: Text to show user
- `session_update`: Updates to apply to session state
- `workflow_config`: Configuration for workflow selection
- `validation_results`: Results from validation checks
- `metrics`: Performance or analytics data

## Conditional Execution

Hooks can skip execution based on context:

```python
def should_execute(self, context):
    """Example: Only run on authentication-related tasks."""

    # Check user request for keywords
    request = context.get("user_request", "").lower()
    auth_keywords = ["auth", "login", "jwt", "token", "session"]

    if any(keyword in request for keyword in auth_keywords):
        return True

    # Check loaded files
    files = context.get("loaded_files", [])
    if any("auth" in file for file in files):
        return True

    # Skip execution
    return False
```

## Hook Priorities by Type

### UserPromptSubmit

- Priority 0-5: Security scanners, critical analysis
- Priority 10-19: Pattern detection, context analysis
- Priority 20-49: Session awareness, user guidance
- Priority 50+: Analytics, metrics

### PostToolUse

- Priority 0-5: Critical validations
- Priority 10-19: File tracking, session updates
- Priority 20-49: Linting, formatting checks
- Priority 50+: Build triggers, metrics

### Stop

- Priority 0-5: Security checks, critical validations
- Priority 10-19: Build validation, test execution
- Priority 20-49: Quality gates, coverage checks
- Priority 50+: Cleanup, analytics

## Error Handling Strategies

### By Hook Type

**UserPromptSubmit**:
- Errors: Log and continue (non-blocking)
- Fallback: Proceed with standard workflow
- User notification: Optional (for critical hooks)

**PostToolUse**:
- Errors: Log and continue (non-blocking)
- Fallback: File tracked with minimal metadata
- User notification: Only for validation failures

**Stop**:
- Errors: Log and MAY block completion
- Fallback: Display warning, allow user choice
- User notification: YES for build/test failures

## Performance Budgets

### UserPromptSubmit
- Target: <500ms total for all hooks
- Individual hook: <200ms
- Timeout: 2000ms

### PostToolUse
- Target: <100ms per operation
- Individual hook: <50ms
- Timeout: 500ms

### Stop
- Target: <5000ms total for all hooks
- Individual hook: <3000ms (builds/tests can be longer)
- Timeout: 10000ms

## Future Hook Types

Potential future additions:

- **PreWorkflowSelection**: Before workflow is selected
- **PrePhase**: Before each workflow phase starts
- **PostPhase**: After each workflow phase completes
- **OnError**: When errors are encountered
- **OnUserInterrupt**: When user cancels operation

---

**Version**: 1.0.0 (Phase 2.1)
**Last Updated**: 2025-01-26
**Integration Phase**: Phase 2 (Weeks 5-6)
**Dependencies**: `hook-registry.md`
**Related**: Phase 2.2 (UserPromptSubmit hooks), Phase 2.3 (PostToolUse hooks), Phase 2.4 (Stop hooks)
