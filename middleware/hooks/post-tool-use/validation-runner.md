<!--
HOOK_METADATA:
  id: validation-runner
  name: Validation Runner
  version: 1.0.0
  type: PostToolUse
  priority: 20
  enabled: false
  dependencies: []
  author: Claude Agent System
  description: Runs quick validation checks after code modifications (syntax, formatting)
  execution_conditions:
    - "code_files_only"
  timeout_ms: 500
-->

# Validation Runner Hook

## Purpose
Runs lightweight validation checks after code modifications to catch syntax errors, formatting issues, and basic problems early.

## Hook Type
**PostToolUse** - Executes after file-change-tracker

## Status
**Disabled by default** - Enable in `hooks.config.json` when needed

## Execution

### Conditional Execution

```python
def should_execute(context):
    """Only run on code files."""
    file_path = context["file_path"]

    code_extensions = [".ts", ".tsx", ".js", ".jsx", ".py", ".java", ".go", ".rs"]
    return any(file_path.endswith(ext) for ext in code_extensions)
```

### Input Context

```javascript
{
  "tool": "Edit",
  "file_path": "src/utils/validation.ts",
  "operation": {...},
  "workflow_type": "orchestrated"
}
```

### Output

```javascript
{
  "hook_id": "validation-runner",
  "status": "success",
  "data": {
    "validation_passed": true,
    "checks_run": ["syntax", "formatting"],
    "issues_found": [],
    "display_message": "✅ Validation: Syntax ✓, Formatting ✓"
  }
}
```

## Implementation

```python
def execute(context):
    """Run validation checks."""

    if not should_execute(context):
        return skip_result()

    file_path = context["file_path"]
    issues = []

    # 1. Syntax check
    if not check_syntax(file_path):
        issues.append("Syntax error detected")

    # 2. Basic formatting (indentation)
    if not check_basic_formatting(file_path):
        issues.append("Formatting issues detected")

    # Build result
    validation_passed = len(issues) == 0

    if validation_passed:
        display = "✅ Validation: Syntax ✓, Formatting ✓"
    else:
        display = f"⚠️ Validation Issues: {', '.join(issues)}"

    return {
        "hook_id": "validation-runner",
        "status": "success",
        "data": {
            "validation_passed": validation_passed,
            "checks_run": ["syntax", "formatting"],
            "issues_found": issues,
            "display_message": display
        }
    }
```

---

**Version**: 1.0.0 (Phase 2.3)
**Last Updated**: 2025-01-26
**Execution Point**: PostToolUse
**Priority**: 20
**Default**: Disabled (enable when needed)
