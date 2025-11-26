<!--
HOOK_METADATA:
  id: file-change-tracker
  name: File Change Tracker
  version: 2.0.0
  type: PostToolUse
  priority: 15
  enabled: true
  dependencies: []
  author: Claude Agent System
  description: Tracks all file modifications and updates session state automatically
  execution_conditions:
    - "always"
  timeout_ms: 100
-->

# File Change Tracker Hook

## Purpose
Automatically tracks all file modifications (Edit/Write/MultiEdit operations) and updates session state with change history. This is the full hook version upgrading the lightweight session-state-tracker.md from Phase 1.2.

## Hook Type
**PostToolUse** - Executes immediately after Edit/Write/MultiEdit operations

## Execution

### Input Context

```javascript
{
  "tool": "Edit",
  "file_path": "src/auth/middleware.ts",
  "operation": {
    "old_content": "...",
    "new_content": "...",
    "lines_changed": 15
  },
  "workflow_phase": "implementation",
  "workflow_type": "complete_system",
  "session_state": {...},
  "timestamp": "2025-01-26T14:35:22Z"
}
```

### Output

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
          "first_modified": "2025-01-26T14:30:00Z",
          "last_modified": "2025-01-26T14:35:22Z",
          "modification_count": 2,
          "changes_summary": "Created auth middleware, Added JWT validation",
          "workflows": ["complete_system"]
        }
      }
    }
  }
}
```

## Implementation

```python
def execute(context):
    """Track file modification."""

    file_path = context["file_path"]
    tool = context["tool"]
    workflow_type = context.get("workflow_type", "unknown")
    timestamp = context["timestamp"]

    # Load session state
    session_state = context.get("session_state", {})
    files_modified = session_state.get("files_modified", {})

    # Infer change description
    change_desc = infer_change_description(context)

    # Update or create file entry
    if file_path in files_modified:
        # Existing file - increment count
        entry = files_modified[file_path]
        entry["modification_count"] += 1
        entry["last_modified"] = timestamp
        entry["changes_summary"] += f", {change_desc}"

        # Add workflow if new
        if workflow_type not in entry["workflows"]:
            entry["workflows"].append(workflow_type)

        mod_count = entry["modification_count"]

    else:
        # New file - create entry
        files_modified[file_path] = {
            "first_modified": timestamp,
            "last_modified": timestamp,
            "modification_count": 1,
            "changes_summary": change_desc,
            "workflows": [workflow_type]
        }
        mod_count = 1

    # Build session update
    session_update = {
        "files_modified": files_modified
    }

    return {
        "hook_id": "file-change-tracker",
        "status": "success",
        "data": {
            "file_tracked": True,
            "modification_count": mod_count,
            "change_summary": change_desc,
            "session_update": session_update
        }
    }
```

### Change Description Inference

```python
def infer_change_description(context):
    """Infer what was changed from operation details."""

    tool = context["tool"]
    file_path = context["file_path"]
    operation = context.get("operation", {})

    # For Edit operations
    if tool == "Edit":
        old_content = operation.get("old_content", "")
        new_content = operation.get("new_content", "")

        # Simple heuristics
        if "function" in new_content and "function" not in old_content:
            return "Added function implementation"
        elif "import" in new_content and "import" not in old_content:
            return "Added imports"
        elif "export" in new_content and "export" not in old_content:
            return "Added exports"
        elif len(new_content) > len(old_content) * 1.5:
            return "Extended implementation"
        elif len(new_content) < len(old_content) * 0.5:
            return "Removed code"
        else:
            return "Modified implementation"

    # For Write operations
    elif tool == "Write":
        if file_path.endswith((".test.", ".spec.")):
            return "Created test file"
        elif file_path.endswith(("config", ".json", ".yml", ".yaml")):
            return "Created configuration"
        else:
            return "Created file"

    # Default
    return f"{tool} operation"
```

## Integration

```python
# In workflow execution (after any Edit/Write)

def after_tool_use(tool, file_path, operation):
    """Execute PostToolUse hooks."""

    context = {
        "tool": tool,
        "file_path": file_path,
        "operation": operation,
        "workflow_phase": current_phase,
        "workflow_type": selected_workflow,
        "session_state": session_state,
        "timestamp": datetime.now().isoformat()
    }

    hook_results = execute_hooks("PostToolUse", context)

    # Apply session updates
    for result in hook_results:
        if "session_update" in result.get("data", {}):
            apply_session_update(result["data"]["session_update"])
```

## Session State Integration

Updates `ClaudeFiles/memory/CLAUDE-session-state.json`:

```json
{
  "session_id": "...",
  "files_modified": {
    "src/auth/middleware.ts": {
      "first_modified": "2025-01-26T14:30:00Z",
      "last_modified": "2025-01-26T14:35:22Z",
      "modification_count": 2,
      "changes_summary": "Created auth middleware, Added JWT validation",
      "workflows": ["complete_system"]
    }
  }
}
```

## Performance

- **Typical execution**: 20-50ms
- **Operation**: Simple dict update
- **Timeout**: 100ms

## Error Handling

```python
def execute(context):
    """Execute with error handling."""

    try:
        # Track file
        result = track_file_change(context)

        return {
            "hook_id": "file-change-tracker",
            "status": "success",
            "data": result
        }

    except Exception as e:
        log_error(f"File tracking failed: {e}")

        # Graceful degradation - return minimal tracking
        return {
            "hook_id": "file-change-tracker",
            "status": "failed",
            "error": str(e),
            "data": {
                "file_tracked": False,
                "session_update": {}
            }
        }
```

---

**Version**: 2.0.0 (Full Hook - Phase 2.3)
**Upgraded From**: session-state-tracker.md v1.0.0 (Phase 1.2)
**Last Updated**: 2025-01-26
**Dependencies**: Session state system
**Execution Point**: PostToolUse (after Edit/Write/MultiEdit)
**Priority**: 15
