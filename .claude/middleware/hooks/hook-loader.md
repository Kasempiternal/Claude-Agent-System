# Hook Loader

## Purpose
Dynamic discovery and loading system for hooks. Scans hook directories, extracts metadata, validates hook implementations, and registers them in the hook registry.

## Overview

The hook loader is responsible for:
- **Discovery**: Finding all hook files in the middleware/hooks/ directory
- **Metadata Extraction**: Reading hook configuration from frontmatter
- **Validation**: Ensuring hooks meet interface requirements
- **Registration**: Adding validated hooks to the registry
- **Hot Reload**: Reloading hooks without restarting (future)

## Discovery Process

### Directory Structure

```
middleware/hooks/
├── hook-registry.md
├── hook-types.md
├── hook-loader.md
├── hooks.config.json
├── user-prompt-submit/
│   ├── auto-pattern-detection.md
│   └── context-analyzer.md
├── post-tool-use/
│   ├── file-change-tracker.md
│   └── validation-runner.md
└── stop/
    └── build-validator.md
```

### Discovery Algorithm

```python
def discover_all_hooks():
    """
    Scan middleware/hooks/ for all hook implementations.

    Returns:
        List of hook metadata dictionaries
    """
    discovered_hooks = []

    # Load configuration
    config = load_hook_config()
    discovery_paths = config.get("discovery_paths", [
        "middleware/hooks/user-prompt-submit/",
        "middleware/hooks/post-tool-use/",
        "middleware/hooks/stop/"
    ])

    for path in discovery_paths:
        if not os.path.exists(path):
            log_warning(f"Hook directory not found: {path}")
            continue

        # Find all .md files (hooks are markdown files)
        hook_files = glob.glob(f"{path}*.md")

        for hook_file in hook_files:
            try:
                # Extract metadata
                metadata = extract_hook_metadata(hook_file)

                if metadata:
                    # Validate hook
                    if validate_hook(metadata, hook_file):
                        discovered_hooks.append(metadata)
                    else:
                        log_error(f"Invalid hook: {hook_file}")
                else:
                    # No metadata found - skip
                    log_debug(f"Skipping file without metadata: {hook_file}")

            except Exception as e:
                log_error(f"Error loading hook {hook_file}: {e}")
                continue

    return discovered_hooks
```

## Metadata Extraction

### Metadata Format

Hooks declare metadata in HTML comment frontmatter:

```markdown
<!--
HOOK_METADATA:
  id: auto-pattern-detection
  name: Auto Pattern Detection
  version: 1.0.0
  type: UserPromptSubmit
  priority: 10
  enabled: true
  dependencies: []
  author: Claude Agent System
  description: Detects patterns in user requests and suggests workflows
  execution_conditions:
    - "always"
  timeout_ms: 1000
-->

# Auto Pattern Detection Hook

Hook implementation here...
```

### Extraction Function

```python
import re
import yaml

def extract_hook_metadata(hook_file):
    """
    Extract HOOK_METADATA from hook file.

    Args:
        hook_file: Path to hook .md file

    Returns:
        Dictionary with metadata or None if not found
    """
    try:
        with open(hook_file, 'r', encoding='utf-8') as f:
            content = f.read()

        # Look for HOOK_METADATA comment block
        pattern = r'<!--\s*HOOK_METADATA:(.*?)-->'
        match = re.search(pattern, content, re.DOTALL)

        if not match:
            return None

        # Extract and parse YAML
        metadata_yaml = match.group(1).strip()
        metadata = yaml.safe_load(metadata_yaml)

        # Add file path to metadata
        metadata["file_path"] = hook_file

        # Infer type from directory if not specified
        if "type" not in metadata:
            metadata["type"] = infer_type_from_path(hook_file)

        # Set defaults
        metadata.setdefault("priority", 50)
        metadata.setdefault("enabled", True)
        metadata.setdefault("dependencies", [])
        metadata.setdefault("timeout_ms", 5000)

        return metadata

    except yaml.YAMLError as e:
        log_error(f"Invalid YAML in {hook_file}: {e}")
        return None
    except Exception as e:
        log_error(f"Error reading {hook_file}: {e}")
        return None
```

### Type Inference

```python
def infer_type_from_path(hook_file):
    """
    Infer hook type from file path.

    Args:
        hook_file: Path to hook file

    Returns:
        "UserPromptSubmit", "PostToolUse", or "Stop"
    """
    if "user-prompt-submit" in hook_file:
        return "UserPromptSubmit"
    elif "post-tool-use" in hook_file:
        return "PostToolUse"
    elif "stop" in hook_file:
        return "Stop"
    else:
        raise ValueError(f"Cannot infer type from path: {hook_file}")
```

## Validation

### Hook Validation Rules

```python
def validate_hook(metadata, hook_file):
    """
    Validate hook metadata and implementation.

    Args:
        metadata: Extracted metadata dictionary
        hook_file: Path to hook file

    Returns:
        bool: True if valid, False otherwise
    """
    # Required fields
    required_fields = ["id", "name", "type"]
    for field in required_fields:
        if field not in metadata:
            log_error(f"Hook {hook_file} missing required field: {field}")
            return False

    # Valid type
    valid_types = ["UserPromptSubmit", "PostToolUse", "Stop"]
    if metadata["type"] not in valid_types:
        log_error(f"Hook {hook_file} has invalid type: {metadata['type']}")
        return False

    # Valid priority
    if not isinstance(metadata.get("priority", 50), int):
        log_error(f"Hook {hook_file} has invalid priority")
        return False

    # Hook ID uniqueness (checked by registry)
    # File exists
    if not os.path.exists(hook_file):
        log_error(f"Hook file not found: {hook_file}")
        return False

    # Hook file is readable
    try:
        with open(hook_file, 'r') as f:
            f.read()
    except Exception as e:
        log_error(f"Cannot read hook file {hook_file}: {e}")
        return False

    return True
```

### Dependency Resolution

```python
def resolve_dependencies(hooks):
    """
    Ensure hook dependencies are met.

    Args:
        hooks: List of hook metadata dictionaries

    Returns:
        List of hooks with dependencies resolved
    """
    hook_ids = {h["id"] for h in hooks}
    valid_hooks = []

    for hook in hooks:
        dependencies = hook.get("dependencies", [])

        # Check all dependencies exist
        missing_deps = [dep for dep in dependencies if dep not in hook_ids]

        if missing_deps:
            log_warning(
                f"Hook {hook['id']} missing dependencies: {missing_deps}. "
                f"Disabling hook."
            )
            hook["enabled"] = False
            hook["disabled_reason"] = f"Missing dependencies: {missing_deps}"

        valid_hooks.append(hook)

    return valid_hooks
```

## Registration

### Loading Hooks into Registry

```python
def load_hooks_into_registry(registry):
    """
    Discover and register all hooks.

    Args:
        registry: HookRegistry instance

    Returns:
        Statistics about loaded hooks
    """
    # Discover all hooks
    discovered = discover_all_hooks()

    # Resolve dependencies
    validated = resolve_dependencies(discovered)

    # Check for disabled hooks in config
    config = load_hook_config()
    disabled_ids = config.get("disabled_hooks", [])

    # Register each hook
    registered_count = 0
    disabled_count = 0

    for hook in validated:
        # Apply config-based disabling
        if hook["id"] in disabled_ids:
            hook["enabled"] = False
            hook["disabled_reason"] = "Disabled in configuration"

        # Register hook
        registry.register_hook(hook)

        if hook["enabled"]:
            registered_count += 1
        else:
            disabled_count += 1

    return {
        "total": len(validated),
        "registered": registered_count,
        "disabled": disabled_count,
        "types": {
            "UserPromptSubmit": len([h for h in validated if h["type"] == "UserPromptSubmit"]),
            "PostToolUse": len([h for h in validated if h["type"] == "PostToolUse"]),
            "Stop": len([h for h in validated if h["type"] == "Stop"])
        }
    }
```

## Configuration

### Hook Configuration File

`middleware/hooks/hooks.config.json`:

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
  "disabled_hooks": [],
  "cache": {
    "enabled": true,
    "ttl_seconds": 3600
  }
}
```

### Loading Configuration

```python
def load_hook_config():
    """
    Load hook system configuration.

    Returns:
        Configuration dictionary with defaults
    """
    config_path = "middleware/hooks/hooks.config.json"

    # Default configuration
    defaults = {
        "enabled": True,
        "discovery_paths": [
            "middleware/hooks/user-prompt-submit/",
            "middleware/hooks/post-tool-use/",
            "middleware/hooks/stop/"
        ],
        "max_execution_time_ms": 5000,
        "error_handling": "continue",
        "logging": {
            "enabled": True,
            "level": "info"
        },
        "disabled_hooks": [],
        "cache": {
            "enabled": True,
            "ttl_seconds": 3600
        }
    }

    # Try to load from file
    if os.path.exists(config_path):
        try:
            with open(config_path, 'r') as f:
                user_config = json.load(f)

            # Merge with defaults
            config = {**defaults, **user_config}
            return config

        except Exception as e:
            log_error(f"Error loading hook config: {e}")
            return defaults
    else:
        return defaults
```

## Caching

### Metadata Cache

```python
class HookMetadataCache:
    """Cache for hook metadata to avoid re-parsing files."""

    def __init__(self, ttl_seconds=3600):
        self.cache = {}
        self.ttl_seconds = ttl_seconds

    def get(self, hook_file):
        """Get cached metadata for hook file."""
        if hook_file not in self.cache:
            return None

        entry = self.cache[hook_file]
        age = time.time() - entry["cached_at"]

        if age > self.ttl_seconds:
            # Cache expired
            del self.cache[hook_file]
            return None

        # Check if file was modified
        if os.path.getmtime(hook_file) > entry["cached_at"]:
            # File changed - invalidate cache
            del self.cache[hook_file]
            return None

        return entry["metadata"]

    def set(self, hook_file, metadata):
        """Cache metadata for hook file."""
        self.cache[hook_file] = {
            "metadata": metadata,
            "cached_at": time.time()
        }

    def clear(self):
        """Clear all cached metadata."""
        self.cache = {}
```

## Hot Reload (Future)

```python
def reload_hooks(registry):
    """
    Reload all hooks without restarting systemcc.

    Useful for development and dynamic hook updates.
    """
    # Clear cache
    metadata_cache.clear()

    # Clear registry
    registry.hooks = {
        "UserPromptSubmit": [],
        "PostToolUse": [],
        "Stop": []
    }

    # Reload all hooks
    stats = load_hooks_into_registry(registry)

    log_info(f"Hooks reloaded: {stats}")
    return stats
```

## Logging

### Hook Loading Events

```python
def setup_hook_logging():
    """Configure logging for hook system."""
    config = load_hook_config()
    log_config = config.get("logging", {})

    if not log_config.get("enabled", True):
        return

    level = log_config.get("level", "info").upper()
    log_file = log_config.get("file", "~/.claude/temp/hooks.log")

    # Ensure log directory exists
    os.makedirs(os.path.dirname(log_file), exist_ok=True)

    # Configure logger
    logging.basicConfig(
        level=getattr(logging, level),
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler(log_file),
            logging.StreamHandler()  # Also log to console
        ]
    )
```

### Log Messages

```python
# During discovery
log_info("Starting hook discovery...")
log_debug(f"Scanning directory: {path}")
log_info(f"Discovered {len(hooks)} hooks")

# During validation
log_error(f"Invalid hook: {hook_file} - missing required field")
log_warning(f"Hook {hook_id} has unmet dependencies")

# During registration
log_info(f"Registered hook: {hook_id} ({hook_type}, priority={priority})")
log_warning(f"Disabled hook: {hook_id} - {reason}")
```

## Error Handling

### Discovery Errors

- **Directory not found**: Log warning, continue
- **File read error**: Log error, skip file
- **Invalid YAML**: Log error, skip file
- **Missing metadata**: Skip silently (allows non-hook .md files)

### Validation Errors

- **Missing required fields**: Log error, skip hook
- **Invalid type**: Log error, skip hook
- **Unmet dependencies**: Log warning, disable hook

### Registration Errors

- **Duplicate hook ID**: Log error, skip duplicate
- **Registry error**: Log error, continue with other hooks

## Integration with Systemcc

### Initialization (Once at Startup)

```python
# At systemcc startup
def initialize_hook_system():
    """Initialize the hook system."""

    # Setup logging
    setup_hook_logging()

    # Create registry
    registry = HookRegistry()

    # Load hooks
    stats = load_hooks_into_registry(registry)

    # Log statistics
    log_info(f"Hook system initialized: {stats}")

    return registry
```

### Display Hook Loading Status

```markdown
[During systemcc startup - optional verbose mode]

🔌 HOOK SYSTEM INITIALIZATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Discovered hooks: 8
  • UserPromptSubmit: 2 hooks
  • PostToolUse: 2 hooks
  • Stop: 1 hook

Registered: 7 active, 1 disabled

Ready to execute!
```

## Performance Optimization

### Lazy Loading

Don't load hook implementations until execution:

```python
def load_hook_implementation(hook_file):
    """
    Load hook implementation only when needed.

    This function is called by hook_registry during execution,
    not during discovery/registration.
    """
    # Hook implementation logic would be extracted here
    # For now, hook logic is in markdown which Claude reads
    pass
```

### Parallel Discovery

```python
import concurrent.futures

def discover_all_hooks_parallel():
    """Discover hooks in parallel for faster startup."""

    config = load_hook_config()
    paths = config["discovery_paths"]

    discovered_hooks = []

    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
        # Submit discovery tasks
        futures = {
            executor.submit(discover_hooks_in_path, path): path
            for path in paths
        }

        # Collect results
        for future in concurrent.futures.as_completed(futures):
            try:
                hooks = future.result()
                discovered_hooks.extend(hooks)
            except Exception as e:
                path = futures[future]
                log_error(f"Error discovering hooks in {path}: {e}")

    return discovered_hooks
```

## Testing Hook Loading

```python
def test_hook_discovery():
    """Test hook discovery system."""

    # Discover hooks
    hooks = discover_all_hooks()

    # Verify count
    assert len(hooks) > 0, "No hooks discovered"

    # Verify types
    for hook in hooks:
        assert "id" in hook
        assert "type" in hook
        assert hook["type"] in ["UserPromptSubmit", "PostToolUse", "Stop"]

    print(f"✅ Discovered {len(hooks)} hooks")

def test_hook_validation():
    """Test hook validation."""

    # Create test hook
    test_hook = {
        "id": "test-hook",
        "name": "Test Hook",
        "type": "UserPromptSubmit"
    }

    # Validate
    is_valid = validate_hook(test_hook, "test.md")

    assert is_valid, "Valid hook failed validation"
    print("✅ Hook validation working")
```

---

**Version**: 1.0.0 (Phase 2.1)
**Last Updated**: 2025-01-26
**Integration Phase**: Phase 2 (Weeks 5-6)
**Dependencies**: `hook-registry.md`, `hook-types.md`
**Configuration**: `hooks.config.json`
**Breaking Changes**: None (new infrastructure)
