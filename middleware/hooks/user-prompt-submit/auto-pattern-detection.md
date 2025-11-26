<!--
HOOK_METADATA:
  id: auto-pattern-detection
  name: Auto Pattern Detection
  version: 2.0.0
  type: UserPromptSubmit
  priority: 10
  enabled: true
  dependencies: []
  author: Claude Agent System
  description: Detects patterns in user requests and suggests optimal workflows with security scanning
  execution_conditions:
    - "always"
  timeout_ms: 1000
-->

# Auto Pattern Detection Hook

## Purpose
Analyzes user requests, loaded files, and session history to detect patterns and suggest optimal workflows. This is the full hook version of the lightweight pattern-detector.md from Phase 1.3.

## Hook Type
**UserPromptSubmit** - Executes after critical detection message, before Lyra optimization

## Execution

### Input Context

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
    "patterns_detected": ["api", "backend"],
    "files_modified": {...}
  },
  "working_directory": "/project/root",
  "timestamp": "2025-01-26T14:30:00Z"
}
```

### Output

```javascript
{
  "hook_id": "auto-pattern-detection",
  "status": "success",
  "data": {
    "patterns_detected": ["authentication", "security"],
    "primary_pattern": "authentication",
    "confidence": 0.85,
    "suggested_workflow": "complete_system",
    "enable_security_scan": true,
    "hints": [
      "🔒 Authentication task detected",
      "🔒 Security scanning enabled"
    ],
    "display_message": "💡 PATTERN DETECTED: 🔒 Authentication\n   Recommendation: Complete system workflow with security validation",
    "workflow_config": {
      "workflow": "complete_system",
      "security_scan": true,
      "validation_level": "high"
    }
  }
}
```

## Implementation

### Pattern Definitions

Load from `middleware/workflow-suggestions.json`:

```python
def load_pattern_definitions():
    """Load pattern definitions from configuration."""
    config_path = "middleware/workflow-suggestions.json"

    try:
        with open(config_path, 'r') as f:
            patterns = json.load(f)
        return patterns
    except FileNotFoundError:
        # Fallback to embedded defaults
        return get_default_patterns()
```

### Detection Algorithm

```python
def detect_patterns(context):
    """
    Main pattern detection logic.

    Args:
        context: Hook execution context

    Returns:
        Detection results dictionary
    """
    user_request = context["user_request"]
    loaded_files = context.get("loaded_files", [])
    session_state = context.get("session_state", {})

    # Load pattern definitions
    patterns = load_pattern_definitions()

    # Initialize detection
    detected = []
    confidence_scores = {}

    # 1. Keyword Analysis
    request_lower = user_request.lower()

    for pattern_name, pattern_config in patterns.items():
        if pattern_name.startswith("_"):
            # Skip metadata keys
            continue

        keywords = pattern_config.get("keywords", [])
        keyword_matches = sum(1 for kw in keywords if kw in request_lower)

        if keyword_matches > 0:
            # Calculate confidence (max at 3+ keywords)
            confidence = min(keyword_matches / 3.0, 1.0)
            detected.append(pattern_name)
            confidence_scores[pattern_name] = confidence

    # 2. File Path Analysis
    if loaded_files:
        for pattern_name, pattern_config in patterns.items():
            if pattern_name.startswith("_"):
                continue

            file_patterns = pattern_config.get("file_patterns", [])

            for file_path in loaded_files:
                for file_pattern in file_patterns:
                    if matches_glob(file_path, file_pattern):
                        if pattern_name not in detected:
                            detected.append(pattern_name)
                            confidence_scores[pattern_name] = 0.6
                        else:
                            # Boost confidence (keyword + file match)
                            confidence_scores[pattern_name] = min(
                                confidence_scores[pattern_name] + 0.3,
                                1.0
                            )
                        break

    # 3. Session History Boost
    if session_state and "patterns_detected" in session_state:
        recent_patterns = session_state["patterns_detected"]

        for pattern in detected:
            if pattern in recent_patterns:
                # Boost for recurring patterns
                confidence_scores[pattern] = min(
                    confidence_scores[pattern] + 0.2,
                    1.0
                )

    # Sort by confidence
    detected_sorted = sorted(
        detected,
        key=lambda p: confidence_scores.get(p, 0),
        reverse=True
    )

    if not detected_sorted:
        # No patterns detected
        return {
            "patterns_detected": [],
            "primary_pattern": None,
            "confidence": 0.0,
            "suggested_workflow": None,
            "enable_security_scan": False,
            "hints": [],
            "display_message": None
        }

    # Primary pattern (highest confidence)
    primary_pattern = detected_sorted[0]
    primary_config = patterns[primary_pattern]

    # Check if security scan needed
    enable_security = any(
        patterns.get(p, {}).get("security_scan", False)
        for p in detected_sorted
    )

    # Build hints
    hints = [
        patterns[p]["hint"]
        for p in detected_sorted[:3]
        if p in patterns
    ]

    # Build display message
    display_message = build_display_message(
        primary_pattern,
        primary_config,
        detected_sorted,
        confidence_scores
    )

    return {
        "patterns_detected": detected_sorted,
        "primary_pattern": primary_pattern,
        "confidence": confidence_scores[primary_pattern],
        "suggested_workflow": primary_config["suggested_workflow"],
        "enable_security_scan": enable_security,
        "hints": hints,
        "display_message": display_message,
        "workflow_config": {
            "workflow": primary_config["suggested_workflow"],
            "security_scan": enable_security,
            "validation_level": get_validation_level(primary_config)
        }
    }
```

### Display Message Builder

```python
def build_display_message(primary, config, all_detected, scores):
    """Build user-friendly display message."""

    hint = config["hint"]
    confidence = scores[primary]

    if len(all_detected) == 1:
        # Single pattern
        return f"💡 PATTERN DETECTED: {hint}\n   Recommendation: {config['suggested_workflow'].replace('_', ' ').title()} workflow"

    elif confidence > 0.7:
        # High confidence primary + others
        secondary = [
            f"   • {config['hint']} (medium confidence)"
            for p in all_detected[1:3]
            if (p_config := patterns.get(p))
        ]

        msg = f"💡 PATTERNS DETECTED:\n   • {hint} (high confidence)\n"
        msg += "\n".join(secondary) if secondary else ""
        msg += f"\n   Recommendation: {config['suggested_workflow'].replace('_', ' ').title()} workflow"
        return msg

    else:
        # Low confidence
        return f"💡 PATTERN DETECTED: {hint}\n   Recommendation: {config['suggested_workflow'].replace('_', ' ').title()} workflow\n   (Low confidence - decision engine will make final choice)"
```

### Helper Functions

```python
def matches_glob(file_path, pattern):
    """Check if file path matches glob pattern."""
    import fnmatch
    return fnmatch.fnmatch(file_path, pattern)

def get_validation_level(pattern_config):
    """Determine validation level from pattern priority."""
    priority = pattern_config.get("priority", "medium")

    if priority == "critical":
        return "high"
    elif priority == "high":
        return "high"
    else:
        return "medium"
```

## Integration Example

```python
# In 01-CRITICAL-DETECTION.md

# After showing detection message
context = {
    "user_request": user_request,
    "loaded_files": get_loaded_files(),
    "session_state": load_session_state()
}

# Execute hook
result = execute_hook("auto-pattern-detection", context)

# Display if patterns found
if result["status"] == "success":
    data = result["data"]

    if data["display_message"] and data["confidence"] > 0.3:
        print("\n🔍 ANALYZING REQUEST...\n")
        print(data["display_message"])

    # Pass workflow config to Phase 4
    workflow_hints = data["workflow_config"]
```

## Pattern Categories

See `middleware/workflow-suggestions.json` for complete definitions:

- **authentication**: Login, JWT, OAuth, sessions
- **database**: SQL, MongoDB, migrations, schemas
- **api**: REST, GraphQL, endpoints, controllers
- **frontend**: React, Vue, components, UI
- **testing**: Jest, pytest, unit tests, e2e
- **bugfix**: Fix, error, broken, not working
- **refactoring**: Cleanup, improve, optimize
- **security**: XSS, CSRF, encryption, validation
- **configuration**: Setup, environment, settings
- **documentation**: Docs, README, guides
- **performance**: Slow, optimize, cache, speed
- **deployment**: Docker, CI/CD, kubernetes
- **state-management**: Redux, Zustand, context
- **error-handling**: Exceptions, try-catch, recovery

## Confidence Levels

- **0.0-0.3**: No clear pattern or very low confidence → Skip display
- **0.3-0.5**: Low confidence → Display with disclaimer
- **0.5-0.7**: Medium confidence → Use as hint for decision engine
- **0.7-1.0**: High confidence → Use suggested workflow directly

## Security Patterns

Patterns with `security_scan: true`:
- **authentication**: Auto-enables security scanning
- **security**: Auto-enables enhanced security validation

When enabled, security scanning includes:
- Input validation checks
- SQL injection pattern detection
- XSS vulnerability scanning
- Authentication best practices
- Credential storage validation

## Performance

- **Keyword matching**: O(n*m) where n=patterns, m=keywords
- **File matching**: O(f*p) where f=files, p=patterns
- **Typical execution**: 50-200ms
- **Timeout**: 1000ms

## Error Handling

```python
def execute(context):
    """Execute hook with error handling."""

    try:
        # Run detection
        results = detect_patterns(context)

        return {
            "hook_id": "auto-pattern-detection",
            "status": "success",
            "data": results
        }

    except FileNotFoundError:
        # Config file missing - use defaults
        log_warning("Pattern config not found, using defaults")
        results = detect_patterns_with_defaults(context)

        return {
            "hook_id": "auto-pattern-detection",
            "status": "success",
            "data": results
        }

    except Exception as e:
        # Critical error - fail gracefully
        log_error(f"Pattern detection failed: {e}")

        return {
            "hook_id": "auto-pattern-detection",
            "status": "failed",
            "error": str(e),
            "data": {
                "patterns_detected": [],
                "confidence": 0.0,
                "suggested_workflow": None,
                "display_message": None
            }
        }
```

## Testing

```python
def test_pattern_detection():
    """Test pattern detection."""

    # Test authentication pattern
    context = {
        "user_request": "add login with JWT token",
        "loaded_files": [],
        "session_state": {}
    }

    result = execute(context)
    assert result["status"] == "success"
    assert "authentication" in result["data"]["patterns_detected"]
    assert result["data"]["enable_security_scan"] == True

    # Test frontend pattern
    context = {
        "user_request": "create button component",
        "loaded_files": ["src/components/Button.tsx"],
        "session_state": {}
    }

    result = execute(context)
    assert "frontend" in result["data"]["patterns_detected"]
    assert result["data"]["suggested_workflow"] == "orchestrated"
```

## Migration from Phase 1.3

This hook replaces `middleware/pattern-detector.md` with enhanced features:
- ✅ Hook infrastructure integration
- ✅ Better error handling
- ✅ Performance optimization
- ✅ Richer output format
- ✅ Session state integration

The old `pattern-detector.md` remains for reference but is no longer executed directly.

---

**Version**: 2.0.0 (Full Hook - Phase 2.2)
**Upgraded From**: pattern-detector.md v1.0.0 (Phase 1.3)
**Last Updated**: 2025-01-26
**Dependencies**: `workflow-suggestions.json`
**Execution Point**: UserPromptSubmit (after detection, before Lyra)
**Priority**: 10 (high priority)
