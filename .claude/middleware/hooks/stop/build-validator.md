<!--
HOOK_METADATA:
  id: build-validator
  name: Build Validator
  version: 1.0.0
  type: Stop
  priority: 10
  enabled: false
  dependencies: []
  author: Claude Agent System
  description: Runs build validation before workflow completion
  execution_conditions:
    - "code_changes_made"
  timeout_ms: 5000
-->

# Build Validator Hook

## Purpose
Runs build and type-checking validation before workflow completion to ensure no errors were introduced.

## Hook Type
**Stop** - Executes after memory update, before completion summary

## Status
**Disabled by default** - Enable per project when needed

## Execution

### Conditional Execution

```python
def should_execute(context):
    """Only run if code files were modified."""
    files_modified = context.get("files_modified", [])

    code_files = [
        f for f in files_modified
        if f.endswith((".ts", ".tsx", ".js", ".jsx", ".py", ".java", ".go"))
    ]

    return len(code_files) > 0
```

### Input Context

```javascript
{
  "workflow_type": "complete_system",
  "workflow_status": "completed",
  "files_modified": [
    "src/auth/middleware.ts",
    "src/routes/auth.ts"
  ],
  "duration_seconds": 420,
  "errors_encountered": [],
  "session_state": {...}
}
```

### Output

```javascript
{
  "hook_id": "build-validator",
  "status": "success",
  "data": {
    "build_status": "success",
    "build_output": "Build completed\n0 errors, 0 warnings",
    "tests_run": false,
    "display_message": "✅ BUILD VALIDATION\n   • TypeScript compilation: ✓\n   • 0 errors, 0 warnings"
  }
}
```

## Implementation

```python
def execute(context):
    """Run build validation."""

    if not should_execute(context):
        return skip_result()

    # Detect project type
    project_type = detect_project_type()

    # Run appropriate build check
    if project_type == "typescript":
        result = run_typescript_check()
    elif project_type == "python":
        result = run_python_check()
    else:
        result = {"status": "skipped", "reason": "Unknown project type"}

    # Build display
    if result["status"] == "success":
        display = f"✅ BUILD VALIDATION\n   • {result['message']}"
    else:
        display = f"❌ BUILD FAILED\n   • {result['message']}"

    return {
        "hook_id": "build-validator",
        "status": "success",
        "data": {
            "build_status": result["status"],
            "build_output": result.get("output", ""),
            "display_message": display
        }
    }
```

### TypeScript Validation

```python
def run_typescript_check():
    """Run TypeScript type check."""

    try:
        result = subprocess.run(
            ["npx", "tsc", "--noEmit"],
            capture_output=True,
            text=True,
            timeout=5
        )

        if result.returncode == 0:
            return {
                "status": "success",
                "message": "TypeScript compilation: ✓",
                "output": result.stdout
            }
        else:
            error_count = result.stdout.count("error TS")
            return {
                "status": "failed",
                "message": f"TypeScript: {error_count} errors found",
                "output": result.stdout
            }

    except subprocess.TimeoutExpired:
        return {
            "status": "timeout",
            "message": "Build check timed out"
        }
```

---

**Version**: 1.0.0 (Phase 2.4)
**Last Updated**: 2025-01-26
**Execution Point**: Stop
**Priority**: 10
**Default**: Disabled
