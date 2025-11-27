# Pattern Detector Middleware

## Purpose
Lightweight pattern detection system that analyzes user requests and loaded files to suggest optimal workflows and provide context-aware hints.

## Integration Point
This middleware is called during Phase 1 (Critical Detection) of the systemcc workflow, immediately after the detection message is displayed.

## Overview

The pattern detector provides non-blocking suggestions based on:
- Keywords in user request
- Loaded file paths and types
- Recent session patterns (from session-state)
- Project structure analysis

## Pattern Detection Strategy

### 1. Keyword Analysis
Extract and match keywords from user request against known pattern categories.

### 2. File Context Analysis
Analyze currently loaded files to infer working domain.

### 3. Session History Analysis
Check session state for recurring patterns (authentication, testing, etc.).

### 4. Workflow Suggestion
Recommend workflows based on detected patterns.

## Pattern Categories

```json
{
  "authentication": {
    "keywords": ["auth", "login", "logout", "session", "jwt", "token", "oauth", "sso", "permission", "role", "rbac"],
    "file_patterns": ["**/auth/**", "**/middleware/auth*", "**/guards/**", "**/strategies/**"],
    "suggested_workflow": "complete_system",
    "security_scan": true,
    "hint": "🔒 Authentication task detected - using comprehensive workflow with security validation"
  },
  "database": {
    "keywords": ["database", "db", "sql", "postgres", "mysql", "mongo", "migration", "schema", "query", "orm", "prisma", "sequelize"],
    "file_patterns": ["**/models/**", "**/schema/**", "**/migrations/**", "**/db/**"],
    "suggested_workflow": "complete_system",
    "security_scan": false,
    "hint": "💾 Database task detected - using comprehensive workflow for data integrity"
  },
  "api": {
    "keywords": ["api", "endpoint", "route", "controller", "rest", "graphql", "request", "response"],
    "file_patterns": ["**/routes/**", "**/api/**", "**/controllers/**", "**/endpoints/**"],
    "suggested_workflow": "complete_system",
    "security_scan": false,
    "hint": "🌐 API development detected - using comprehensive workflow"
  },
  "frontend": {
    "keywords": ["component", "ui", "page", "view", "layout", "styling", "css", "react", "vue", "angular"],
    "file_patterns": ["**/components/**", "**/*.tsx", "**/*.jsx", "**/*.vue", "**/pages/**"],
    "suggested_workflow": "orchestrated",
    "security_scan": false,
    "hint": "🎨 Frontend task detected - using streamlined workflow"
  },
  "testing": {
    "keywords": ["test", "spec", "jest", "mocha", "pytest", "unit test", "integration test", "e2e"],
    "file_patterns": ["**/*.test.*", "**/*.spec.*", "**/tests/**", "**/__tests__/**"],
    "suggested_workflow": "orchestrated",
    "security_scan": false,
    "hint": "🧪 Testing task detected - using streamlined workflow"
  },
  "bugfix": {
    "keywords": ["fix", "bug", "error", "issue", "broken", "not working", "fails", "crash"],
    "file_patterns": [],
    "suggested_workflow": "orchestrated",
    "security_scan": false,
    "hint": "🐛 Bug fix detected - using quick resolution workflow"
  },
  "refactoring": {
    "keywords": ["refactor", "cleanup", "improve", "optimize", "reorganize", "restructure"],
    "file_patterns": [],
    "suggested_workflow": "complete_system",
    "security_scan": false,
    "hint": "♻️ Refactoring task detected - using comprehensive workflow for safety"
  },
  "security": {
    "keywords": ["security", "vulnerability", "xss", "csrf", "injection", "sanitize", "validate", "encrypt"],
    "file_patterns": ["**/security/**", "**/validators/**"],
    "suggested_workflow": "complete_system",
    "security_scan": true,
    "hint": "🔒 Security task detected - enabling security scanning and comprehensive review"
  },
  "configuration": {
    "keywords": ["config", "setup", "install", "environment", "env", "settings"],
    "file_patterns": ["**/.env*", "**/config/**", "**/*.config.*"],
    "suggested_workflow": "orchestrated",
    "security_scan": false,
    "hint": "⚙️ Configuration task detected - using streamlined workflow"
  },
  "documentation": {
    "keywords": ["docs", "documentation", "readme", "guide", "tutorial"],
    "file_patterns": ["**/docs/**", "**/*.md"],
    "suggested_workflow": "orchestrated",
    "security_scan": false,
    "hint": "📝 Documentation task detected - using streamlined workflow"
  }
}
```

## Detection Algorithm

```python
def detect_patterns(user_request, loaded_files=None, session_state=None):
    """
    Detect patterns from user request and context.

    Returns:
        {
            "detected_patterns": ["authentication", "security"],
            "confidence": 0.85,
            "suggested_workflow": "complete_system",
            "enable_security_scan": true,
            "hints": [
                "🔒 Authentication task detected",
                "🔒 Security scanning enabled"
            ]
        }
    """

    # Load pattern definitions
    patterns = load_pattern_definitions()

    # Initialize detection results
    detected = []
    confidence_scores = {}

    # 1. Keyword matching
    request_lower = user_request.lower()
    for pattern_name, pattern_config in patterns.items():
        keyword_matches = 0
        for keyword in pattern_config["keywords"]:
            if keyword in request_lower:
                keyword_matches += 1

        if keyword_matches > 0:
            confidence = min(keyword_matches / 3.0, 1.0)  # Max confidence at 3+ keywords
            detected.append(pattern_name)
            confidence_scores[pattern_name] = confidence

    # 2. File path analysis (if files loaded)
    if loaded_files:
        for pattern_name, pattern_config in patterns.items():
            for file_path in loaded_files:
                for file_pattern in pattern_config["file_patterns"]:
                    if matches_glob(file_path, file_pattern):
                        if pattern_name not in detected:
                            detected.append(pattern_name)
                            confidence_scores[pattern_name] = 0.6
                        else:
                            # Boost confidence if both keyword and file match
                            confidence_scores[pattern_name] = min(
                                confidence_scores[pattern_name] + 0.3,
                                1.0
                            )

    # 3. Session history boost (if available)
    if session_state and "patterns_detected" in session_state:
        recent_patterns = session_state["patterns_detected"]
        for pattern in detected:
            if pattern in recent_patterns:
                # Boost confidence for recurring patterns
                confidence_scores[pattern] = min(
                    confidence_scores[pattern] + 0.2,
                    1.0
                )

    # Sort patterns by confidence
    detected_sorted = sorted(
        detected,
        key=lambda p: confidence_scores.get(p, 0),
        reverse=True
    )

    # Select primary pattern (highest confidence)
    primary_pattern = detected_sorted[0] if detected_sorted else None

    if not primary_pattern:
        # No patterns detected - default behavior
        return {
            "detected_patterns": [],
            "confidence": 0.0,
            "suggested_workflow": None,
            "enable_security_scan": False,
            "hints": []
        }

    # Get configuration for primary pattern
    pattern_config = patterns[primary_pattern]

    # Check if any detected pattern requires security scan
    enable_security = any(
        patterns[p]["security_scan"]
        for p in detected_sorted
        if p in patterns
    )

    # Collect hints
    hints = [
        patterns[p]["hint"]
        for p in detected_sorted[:3]  # Show top 3 patterns
        if p in patterns
    ]

    return {
        "detected_patterns": detected_sorted,
        "confidence": confidence_scores.get(primary_pattern, 0),
        "suggested_workflow": pattern_config["suggested_workflow"],
        "enable_security_scan": enable_security,
        "hints": hints
    }
```

## Integration with Systemcc Flow

### Phase 1: Detection Display

After showing the detection message, run pattern detection and display results:

```markdown
🎯 SYSTEMCC DETECTED - Command acknowledged

🔍 ANALYZING REQUEST...

[Pattern detection runs here]

💡 DETECTED PATTERNS:
   • 🔒 Authentication task - comprehensive workflow recommended
   • 🔒 Security scanning enabled for auth-related changes

[Continue with Lyra optimization...]
```

### Non-blocking Approach

Pattern detection is **informational only**:
- Provides hints to user
- Pre-configures workflow selection
- Enables security features if needed
- **Does not block** if no patterns detected
- User can override suggestions

## Display Format

### Single Pattern Detected
```
💡 PATTERN DETECTED: 🔒 Authentication
   Recommendation: Complete system workflow with security validation
```

### Multiple Patterns Detected
```
💡 PATTERNS DETECTED:
   • 🔒 Authentication (high confidence)
   • 💾 Database (medium confidence)
   Recommendation: Complete system workflow with security validation
```

### No Patterns Detected
```
[No pattern detection display - proceed silently]
```

## Configuration Loading

Patterns are loaded from `middleware/workflow-suggestions.json`:

```python
def load_pattern_definitions():
    """Load pattern definitions from configuration file."""
    try:
        with open('middleware/workflow-suggestions.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        # Fallback to embedded defaults
        return DEFAULT_PATTERNS
```

## Integration with Workflow Selection

Pattern detection results are passed to workflow selection (Phase 4):

```python
# In 04-WORKFLOW-SELECTION.md
def select_workflow(user_request, pattern_results):
    """
    Select workflow based on task analysis and pattern hints.
    """

    # If pattern detection suggests a workflow
    if pattern_results["suggested_workflow"]:
        suggested = pattern_results["suggested_workflow"]
        confidence = pattern_results["confidence"]

        # High confidence pattern match (>0.7)
        if confidence > 0.7:
            # Use suggested workflow directly
            selected_workflow = suggested
        else:
            # Medium confidence - use as hint for decision engine
            selected_workflow = decision_engine(
                user_request,
                hint=suggested
            )
    else:
        # No pattern detected - use decision engine
        selected_workflow = decision_engine(user_request)

    # Enable security scan if patterns require it
    if pattern_results["enable_security_scan"]:
        selected_workflow.enable_security_scan()

    return selected_workflow
```

## Benefits

1. **Educational**: Teaches users about workflow types
2. **Confidence**: Shows system understands the task
3. **Context-aware**: Uses session history for better suggestions
4. **Security**: Auto-enables scanning for sensitive tasks
5. **Non-blocking**: Doesn't slow down workflow if uncertain

## Performance

- **Fast**: Pattern matching is simple keyword/glob matching
- **Lightweight**: No complex ML or analysis
- **Cached**: Pattern definitions loaded once at startup
- **Optional**: Gracefully degrades if configuration missing

## Future Enhancements (Phase 2)

When hook infrastructure is implemented:
- Real-time pattern learning from user corrections
- Custom pattern definitions per project
- Pattern confidence tuning based on success rates
- Advanced regex and context-aware matching

## Examples

### Example 1: Authentication Task
```
User: /systemcc "add login endpoint with JWT"

Pattern Detection:
✓ Keywords: "login", "jwt" → authentication pattern
✓ Confidence: 0.67 (2 keywords matched)
✓ Suggested workflow: complete_system
✓ Security scan: enabled

Display:
💡 PATTERN DETECTED: 🔒 Authentication
   Recommendation: Complete system workflow with security validation
```

### Example 2: UI Component
```
User: /systemcc "create new button component"

Pattern Detection:
✓ Keywords: "component" → frontend pattern
✓ Confidence: 0.33 (1 keyword matched)
✓ Suggested workflow: orchestrated
✓ Security scan: disabled

Display:
💡 PATTERN DETECTED: 🎨 Frontend task
   Recommendation: Streamlined workflow
```

### Example 3: Bug Fix
```
User: /systemcc "fix broken user profile page"

Pattern Detection:
✓ Keywords: "fix", "broken" → bugfix pattern
✓ Files loaded: src/pages/UserProfile.tsx → frontend pattern
✓ Confidence: 0.8 (keyword + file match)
✓ Suggested workflow: orchestrated

Display:
💡 PATTERNS DETECTED:
   • 🐛 Bug fix (high confidence)
   • 🎨 Frontend task (medium confidence)
   Recommendation: Quick resolution workflow
```

### Example 4: No Clear Pattern
```
User: /systemcc "improve performance"

Pattern Detection:
✓ Keywords: "improve" → refactoring pattern (low confidence)
✓ Confidence: 0.33 (generic keyword)
✓ Suggested workflow: complete_system
✓ Security scan: disabled

Display:
💡 PATTERN DETECTED: ♻️ Refactoring task
   Recommendation: Comprehensive workflow for safety
   (Note: Low confidence - decision engine will make final choice)
```

## Error Handling

```python
def detect_patterns_safe(user_request, loaded_files=None, session_state=None):
    """
    Wrapper with error handling for pattern detection.
    """
    try:
        return detect_patterns(user_request, loaded_files, session_state)
    except Exception as e:
        # Log error but don't block workflow
        log_error(f"Pattern detection failed: {e}")

        # Return empty result
        return {
            "detected_patterns": [],
            "confidence": 0.0,
            "suggested_workflow": None,
            "enable_security_scan": False,
            "hints": []
        }
```

Pattern detection failures never block the systemcc workflow.

---

**Version**: 1.0.0 (Lightweight - Phase 1.3)
**Last Updated**: 2025-01-26
**Integration Phase**: Phase 1.3 (Week 3-4)
**Dependencies**: `workflow-suggestions.json` (optional - has embedded defaults)
**Breaking Changes**: None (additive only)
**Future**: Will be upgraded to full hook system in Phase 2.2
