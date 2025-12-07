# Hook Registry

## Purpose
Central registration and execution system for all hooks in the systemcc workflow. Provides a unified interface for registering, discovering, and executing hooks at specific lifecycle points.

## Overview

The hook registry is the core of the hook infrastructure, managing the complete lifecycle of hooks:
- **Registration**: Hooks declare themselves and their execution points
- **Discovery**: Automatic detection of available hooks
- **Execution**: Coordinated execution at the right workflow phases
- **Error Handling**: Graceful degradation when hooks fail

## Hook Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      HOOK REGISTRY                          │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │UserPrompt  │  │PostToolUse │  │   Stop     │            │
│  │Submit Hooks│  │   Hooks    │  │   Hooks    │            │
│  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘            │
│        │                │                │                   │
│        ▼                ▼                ▼                   │
│  [Registered Hooks by Execution Point]                      │
└─────────────────────────────────────────────────────────────┘
           │                │                │
           ▼                ▼                ▼
     [Execute at      [Execute after   [Execute before
      Phase 1]         Edit/Write]      completion]
```

## Hook Lifecycle

### 1. Registration

Hooks register themselves in the registry:

```javascript
{
  "hook_id": "auto-pattern-detection",
  "name": "Auto Pattern Detection",
  "type": "UserPromptSubmit",
  "execution_point": "after_detection",
  "priority": 10,
  "enabled": true,
  "file_path": "middleware/hooks/user-prompt-submit/auto-pattern-detection.md"
}
```

### 2. Discovery

At systemcc startup, the registry discovers all available hooks:

```python
def discover_hooks():
    """
    Scan middleware/hooks/ directory for hook definitions.

    Returns:
        List of discovered hooks with metadata
    """
    discovered = []

    # Scan directory structure
    hook_dirs = [
        "middleware/hooks/user-prompt-submit/",
        "middleware/hooks/post-tool-use/",
        "middleware/hooks/stop/"
    ]

    for hook_dir in hook_dirs:
        # Find all .md files (hook implementations)
        hook_files = glob(f"{hook_dir}*.md")

        for hook_file in hook_files:
            # Extract hook metadata from file
            metadata = extract_hook_metadata(hook_file)

            if metadata:
                discovered.append({
                    "hook_id": metadata["id"],
                    "name": metadata["name"],
                    "type": infer_type_from_path(hook_dir),
                    "file_path": hook_file,
                    "priority": metadata.get("priority", 50),
                    "enabled": metadata.get("enabled", True)
                })

    return discovered
```

### 3. Execution

Execute hooks at the appropriate workflow phase:

```python
def execute_hooks(hook_type, context):
    """
    Execute all registered hooks of a specific type.

    Args:
        hook_type: "UserPromptSubmit", "PostToolUse", or "Stop"
        context: Execution context (user request, files, etc.)

    Returns:
        Aggregated results from all hooks
    """
    # Get hooks for this type
    hooks = registry.get_hooks_by_type(hook_type)

    # Sort by priority (lower number = higher priority)
    hooks = sorted(hooks, key=lambda h: h["priority"])

    results = []

    for hook in hooks:
        # Skip disabled hooks
        if not hook["enabled"]:
            continue

        try:
            # Execute hook
            result = execute_single_hook(hook, context)
            results.append(result)

        except Exception as e:
            # Log error but continue with other hooks
            log_hook_error(hook["hook_id"], e)

            # Graceful degradation
            results.append({
                "hook_id": hook["hook_id"],
                "status": "failed",
                "error": str(e)
            })

    return aggregate_results(results)
```

## Hook Types and Execution Points

### UserPromptSubmit Hooks

**Execution Point**: Phase 1 (after Critical Detection)

**Context Available**:
- User request (full text)
- Loaded files (if any)
- Session state (if exists)
- Current working directory

**Example Hooks**:
- `auto-pattern-detection.md` - Detect patterns in request
- `context-analyzer.md` - Analyze loaded files for hints

**Usage**:
```python
# In 01-CRITICAL-DETECTION.md
user_request = get_user_request()
loaded_files = get_loaded_files()
session_state = load_session_state()

context = {
    "user_request": user_request,
    "loaded_files": loaded_files,
    "session_state": session_state
}

hook_results = execute_hooks("UserPromptSubmit", context)

# Display results
if hook_results.get("pattern_detected"):
    display_pattern_detection(hook_results["patterns"])
```

### PostToolUse Hooks

**Execution Point**: After each Edit/Write/MultiEdit operation

**Context Available**:
- Tool name (Edit, Write, MultiEdit)
- File path modified
- Changes made (summary)
- Current workflow phase
- Session state

**Example Hooks**:
- `file-change-tracker.md` - Track all file modifications
- `validation-runner.md` - Run post-change validations

**Usage**:
```python
# In workflow execution
after_edit_operation():
    context = {
        "tool": "Edit",
        "file_path": modified_file,
        "changes": change_summary,
        "workflow_phase": current_phase,
        "session_state": session_state
    }

    hook_results = execute_hooks("PostToolUse", context)

    # Update session state with tracking
    if hook_results.get("file_tracked"):
        update_session_state(hook_results["tracking_data"])
```

### Stop Hooks

**Execution Point**: Phase 11 (after Memory Update, before completion)

**Context Available**:
- Complete workflow results
- All files modified
- Workflow type used
- Execution duration
- Any errors encountered

**Example Hooks**:
- `build-validator.md` - Run final build check
- `test-runner.md` - Execute test suite

**Usage**:
```python
# In 11-MEMORY-UPDATE.md (end)
workflow_complete():
    context = {
        "workflow_type": selected_workflow,
        "files_modified": all_modified_files,
        "duration_seconds": execution_time,
        "errors": encountered_errors,
        "session_state": session_state
    }

    hook_results = execute_hooks("Stop", context)

    # Display validation results
    if hook_results.get("build_status"):
        display_build_status(hook_results["build_status"])
```

## Hook Metadata Format

Each hook file should include metadata in a frontmatter-style comment:

```markdown
<!--
HOOK_METADATA:
  id: auto-pattern-detection
  name: Auto Pattern Detection
  type: UserPromptSubmit
  priority: 10
  enabled: true
  dependencies: []
  description: Detects patterns in user requests and suggests workflows
-->

# Auto Pattern Detection Hook

[Hook implementation here...]
```

## Hook Priority System

Priority determines execution order (lower number = higher priority):

- **0-9**: Critical hooks (must run first)
- **10-19**: High priority hooks
- **20-49**: Medium priority hooks
- **50-99**: Low priority hooks
- **100+**: Optional/experimental hooks

**Example Priority Assignment**:
- Security scanning: Priority 5 (critical)
- Pattern detection: Priority 10 (high)
- File tracking: Priority 20 (medium)
- Analytics/metrics: Priority 80 (low)

## Hook Configuration

Global hook configuration in `middleware/hooks/hooks.config.json`:

```json
{
  "enabled": true,
  "discovery_paths": [
    "middleware/hooks/user-prompt-submit/",
    "middleware/hooks/post-tool-use/",
    "middleware/hooks/stop/"
  ],
  "max_execution_time_ms": 5000,
  "error_handling": "continue",
  "logging": {
    "enabled": true,
    "level": "info",
    "file": "~/.claude/temp/hooks.log"
  },
  "disabled_hooks": []
}
```

## Registry API

### Core Functions

```python
class HookRegistry:
    """Central registry for all hooks."""

    def __init__(self):
        self.hooks = {
            "UserPromptSubmit": [],
            "PostToolUse": [],
            "Stop": []
        }
        self.config = load_config()

    def register_hook(self, hook_metadata):
        """Register a single hook."""
        hook_type = hook_metadata["type"]
        self.hooks[hook_type].append(hook_metadata)

    def get_hooks_by_type(self, hook_type):
        """Get all hooks of a specific type."""
        return self.hooks.get(hook_type, [])

    def enable_hook(self, hook_id):
        """Enable a specific hook."""
        for hook_type in self.hooks:
            for hook in self.hooks[hook_type]:
                if hook["hook_id"] == hook_id:
                    hook["enabled"] = True

    def disable_hook(self, hook_id):
        """Disable a specific hook."""
        for hook_type in self.hooks:
            for hook in self.hooks[hook_type]:
                if hook["hook_id"] == hook_id:
                    hook["enabled"] = False

    def reload(self):
        """Reload all hooks from discovery."""
        discovered = discover_hooks()
        self.hooks = group_by_type(discovered)
```

### Helper Functions

```python
def extract_hook_metadata(hook_file):
    """
    Extract metadata from hook file frontmatter.

    Returns:
        Dictionary with hook metadata or None if invalid
    """
    with open(hook_file, 'r') as f:
        content = f.read()

    # Look for HOOK_METADATA comment block
    match = re.search(r'<!--\s*HOOK_METADATA:(.*?)-->', content, re.DOTALL)

    if not match:
        return None

    # Parse YAML metadata
    metadata_yaml = match.group(1)
    metadata = yaml.safe_load(metadata_yaml)

    return metadata

def aggregate_results(hook_results):
    """
    Aggregate results from multiple hooks.

    Merges results, handles conflicts, prioritizes by hook priority.
    """
    aggregated = {}

    for result in hook_results:
        if result["status"] == "success":
            # Merge result data
            for key, value in result.get("data", {}).items():
                if key not in aggregated:
                    aggregated[key] = value
                else:
                    # Conflict resolution (higher priority wins)
                    if result["priority"] < aggregated.get(f"{key}_priority", 999):
                        aggregated[key] = value
                        aggregated[f"{key}_priority"] = result["priority"]

    return aggregated
```

## Error Handling

### Graceful Degradation

Hooks should never block the workflow:

```python
def execute_single_hook(hook, context):
    """Execute a single hook with error handling."""

    try:
        # Load hook implementation
        hook_impl = load_hook_implementation(hook["file_path"])

        # Execute with timeout
        result = execute_with_timeout(
            hook_impl,
            context,
            timeout_ms=hook_registry.config["max_execution_time_ms"]
        )

        return {
            "hook_id": hook["hook_id"],
            "status": "success",
            "data": result,
            "priority": hook["priority"]
        }

    except TimeoutError:
        log_error(f"Hook {hook['hook_id']} timed out")
        return {
            "hook_id": hook["hook_id"],
            "status": "timeout",
            "error": "Execution exceeded timeout"
        }

    except Exception as e:
        log_error(f"Hook {hook['hook_id']} failed: {e}")
        return {
            "hook_id": hook["hook_id"],
            "status": "failed",
            "error": str(e)
        }
```

### Error Recovery

- **Continue on Error**: Default behavior - log and continue
- **Fallback Values**: Hooks provide safe defaults
- **User Notification**: Critical hook failures are reported
- **Automatic Disable**: Repeatedly failing hooks can be auto-disabled

## Performance Considerations

### Optimization Strategies

1. **Lazy Loading**: Hooks loaded only when needed
2. **Caching**: Hook metadata cached after discovery
3. **Parallel Execution**: Independent hooks can run in parallel
4. **Timeout Protection**: Max execution time enforced
5. **Conditional Execution**: Hooks can skip if conditions not met

### Benchmarks

- Hook discovery: <100ms for 20 hooks
- Single hook execution: <500ms typical
- Complete hook chain: <2 seconds for all hooks

## Integration with Systemcc

### Startup (Once)

```python
# At systemcc initialization
hook_registry = HookRegistry()
hook_registry.reload()  # Discover and register all hooks
```

### Runtime (Per Command)

```python
# Phase 1: UserPromptSubmit hooks
user_prompt_results = execute_hooks("UserPromptSubmit", context)

# During workflow: PostToolUse hooks
post_edit_results = execute_hooks("PostToolUse", edit_context)

# Phase 11: Stop hooks
stop_results = execute_hooks("Stop", completion_context)
```

## Migration Path

### Phase 1.3 → Phase 2

Upgrade lightweight features to full hooks:

1. **Pattern Detector** (Phase 1.3) → **UserPromptSubmit Hook** (Phase 2.2)
   - Keep existing `pattern-detector.md` logic
   - Wrap in hook interface
   - Add hook metadata

2. **Session Tracker** (Phase 1.2) → **PostToolUse Hook** (Phase 2.3)
   - Keep existing tracking logic
   - Execute after each file modification
   - Automatic updates

## Future Enhancements

- **Custom Hooks**: Users can add project-specific hooks
- **Hook Marketplace**: Share hooks across projects
- **Conditional Execution**: Advanced condition matching
- **Hook Chaining**: Hooks can trigger other hooks
- **Hook Analytics**: Track execution times and success rates

---

**Version**: 1.0.0 (Phase 2.1)
**Last Updated**: 2025-01-26
**Integration Phase**: Phase 2 (Weeks 5-6)
**Dependencies**: `hook-types.md`, `hook-loader.md`
**Breaking Changes**: None (additive infrastructure)
