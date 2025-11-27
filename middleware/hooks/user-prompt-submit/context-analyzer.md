<!--
HOOK_METADATA:
  id: context-analyzer
  name: Context Analyzer
  version: 1.0.0
  type: UserPromptSubmit
  priority: 15
  enabled: true
  dependencies: []
  author: Claude Agent System
  description: Analyzes loaded files to provide context clues about the working domain and suggest relevant tools
  execution_conditions:
    - "loaded_files_exist"
  timeout_ms: 800
-->

# Context Analyzer Hook

## Purpose
Analyzes loaded files to understand the current working context and provide helpful suggestions about the development domain, tech stack, and relevant patterns.

## Hook Type
**UserPromptSubmit** - Executes after auto-pattern-detection

## Execution

### Conditional Execution

```python
def should_execute(context):
    """Only execute if files are loaded."""
    loaded_files = context.get("loaded_files", [])
    return len(loaded_files) > 0
```

### Input Context

```javascript
{
  "user_request": "fix the validation",
  "loaded_files": [
    "src/components/LoginForm.tsx",
    "src/hooks/useAuth.ts",
    "src/utils/validation.ts"
  ],
  "session_state": {...}
}
```

### Output

```javascript
{
  "hook_id": "context-analyzer",
  "status": "success",
  "data": {
    "working_domain": "frontend",
    "tech_stack": ["React", "TypeScript"],
    "file_categories": {
      "components": ["src/components/LoginForm.tsx"],
      "hooks": ["src/hooks/useAuth.ts"],
      "utils": ["src/utils/validation.ts"]
    },
    "suggested_focus": "authentication-related frontend components",
    "relevant_agents": ["frontend-error-fixer"],
    "display_message": "📁 CONTEXT: Frontend (React/TypeScript)\n   Focus: Authentication components\n   Files: 3 loaded (components, hooks, utils)"
  }
}
```

## Implementation

### Domain Detection

```python
def analyze_context(context):
    """Analyze loaded files for context clues."""

    loaded_files = context.get("loaded_files", [])

    if not loaded_files:
        return None

    # Categorize files
    categories = categorize_files(loaded_files)

    # Detect domain
    domain = detect_working_domain(loaded_files, categories)

    # Detect tech stack
    tech_stack = detect_tech_stack(loaded_files)

    # Determine focus area
    focus = determine_focus_area(categories, context["user_request"])

    # Suggest relevant agents
    agents = suggest_agents(domain, focus)

    # Build display
    display = build_context_display(domain, tech_stack, len(loaded_files), categories)

    return {
        "working_domain": domain,
        "tech_stack": tech_stack,
        "file_categories": categories,
        "suggested_focus": focus,
        "relevant_agents": agents,
        "display_message": display
    }
```

### File Categorization

```python
def categorize_files(files):
    """Categorize files by type and purpose."""

    categories = {
        "components": [],
        "hooks": [],
        "utils": [],
        "api": [],
        "models": [],
        "tests": [],
        "config": [],
        "other": []
    }

    for file in files:
        if "/components/" in file or file.endswith((".tsx", ".jsx", ".vue")):
            categories["components"].append(file)
        elif "/hooks/" in file or "/use" in file:
            categories["hooks"].append(file)
        elif "/utils/" in file or "/helpers/" in file:
            categories["utils"].append(file)
        elif "/api/" in file or "/routes/" in file or "/controllers/" in file:
            categories["api"].append(file)
        elif "/models/" in file or "/schema/" in file:
            categories["models"].append(file)
        elif ".test." in file or ".spec." in file or "/tests/" in file:
            categories["tests"].append(file)
        elif "config" in file or ".env" in file:
            categories["config"].append(file)
        else:
            categories["other"].append(file)

    # Remove empty categories
    return {k: v for k, v in categories.items() if v}
```

### Domain Detection

```python
def detect_working_domain(files, categories):
    """Determine if working on frontend, backend, or full-stack."""

    frontend_indicators = sum([
        len(categories.get("components", [])),
        len(categories.get("hooks", [])),
        sum(1 for f in files if f.endswith((".tsx", ".jsx", ".vue", ".css", ".scss")))
    ])

    backend_indicators = sum([
        len(categories.get("api", [])),
        len(categories.get("models", [])),
        sum(1 for f in files if "/routes/" in f or "/controllers/" in f or "/middleware/" in f)
    ])

    if frontend_indicators > backend_indicators * 2:
        return "frontend"
    elif backend_indicators > frontend_indicators * 2:
        return "backend"
    elif frontend_indicators > 0 and backend_indicators > 0:
        return "full-stack"
    else:
        return "general"
```

### Tech Stack Detection

```python
def detect_tech_stack(files):
    """Detect technologies from file extensions and paths."""

    stack = []

    # Frontend frameworks
    if any(f.endswith((".tsx", ".jsx")) for f in files):
        stack.append("React")
    if any(f.endswith(".vue") for f in files):
        stack.append("Vue")
    if any(f.endswith(".svelte") for f in files):
        stack.append("Svelte")

    # TypeScript
    if any(f.endswith((".ts", ".tsx")) for f in files):
        stack.append("TypeScript")

    # Backend frameworks
    if any("express" in f.lower() for f in files):
        stack.append("Express")
    if any("nest" in f.lower() for f in files):
        stack.append("NestJS")

    # Databases
    if any("prisma" in f for f in files):
        stack.append("Prisma")
    if any("sequelize" in f for f in files):
        stack.append("Sequelize")

    return stack
```

### Focus Area Determination

```python
def determine_focus_area(categories, user_request):
    """Determine what the user is focusing on."""

    request_lower = user_request.lower()

    # Check user request first
    if "auth" in request_lower or "login" in request_lower:
        return "authentication-related " + get_primary_category(categories)
    elif "api" in request_lower or "endpoint" in request_lower:
        return "API development"
    elif "component" in request_lower or "ui" in request_lower:
        return "UI components"
    elif "test" in request_lower:
        return "testing"
    elif "config" in request_lower or "setup" in request_lower:
        return "configuration"

    # Infer from loaded files
    if categories.get("components"):
        return f"{categories['components'][0].split('/')[-1].split('.')[0]} component work"
    elif categories.get("api"):
        return "API endpoints"
    elif categories.get("models"):
        return "data models"
    else:
        return "general development"
```

### Agent Suggestions

```python
def suggest_agents(domain, focus):
    """Suggest relevant specialized agents."""

    agents = []

    # Domain-based suggestions
    if domain == "frontend":
        agents.append("frontend-error-fixer")
    elif domain == "backend":
        if "auth" in focus.lower():
            agents.append("auth-debugger")

    # Focus-based suggestions
    if "test" in focus.lower():
        agents.append("test-runner")

    return agents
```

### Display Builder

```python
def build_context_display(domain, stack, file_count, categories):
    """Build user-friendly context display."""

    # Domain and stack
    stack_str = "/".join(stack) if stack else domain

    # File summary
    category_summary = ", ".join([
        f"{len(v)} {k}" for k, v in categories.items()
    ][:3])  # Show top 3 categories

    return f"📁 CONTEXT: {domain.title()} ({stack_str})\n   Files: {file_count} loaded ({category_summary})"
```

## Examples

### Example 1: React Frontend

```python
context = {
    "user_request": "fix validation in login form",
    "loaded_files": [
        "src/components/LoginForm.tsx",
        "src/components/Button.tsx",
        "src/hooks/useAuth.ts"
    ]
}

result = execute(context)
# Output:
# {
#   "working_domain": "frontend",
#   "tech_stack": ["React", "TypeScript"],
#   "file_categories": {
#     "components": ["src/components/LoginForm.tsx", "src/components/Button.tsx"],
#     "hooks": ["src/hooks/useAuth.ts"]
#   },
#   "suggested_focus": "authentication-related LoginForm component work",
#   "relevant_agents": ["frontend-error-fixer"],
#   "display_message": "📁 CONTEXT: Frontend (React/TypeScript)\n   Files: 3 loaded (2 components, 1 hooks)"
# }
```

### Example 2: Backend API

```python
context = {
    "user_request": "add new endpoint",
    "loaded_files": [
        "src/routes/users.ts",
        "src/controllers/userController.ts",
        "src/models/User.ts"
    ]
}

result = execute(context)
# Output:
# {
#   "working_domain": "backend",
#   "tech_stack": ["TypeScript"],
#   "file_categories": {
#     "api": ["src/routes/users.ts", "src/controllers/userController.ts"],
#     "models": ["src/models/User.ts"]
#   },
#   "suggested_focus": "API endpoints",
#   "relevant_agents": [],
#   "display_message": "📁 CONTEXT: Backend (TypeScript)\n   Files: 3 loaded (2 api, 1 models)"
# }
```

## Integration

```python
# In 01-CRITICAL-DETECTION.md

# After pattern detection
if len(loaded_files) > 0:
    context_result = execute_hook("context-analyzer", context)

    if context_result["status"] == "success":
        print(context_result["data"]["display_message"])
```

## Performance

- **File categorization**: O(n) where n=number of files
- **Typical execution**: 50-100ms for 10 files
- **Timeout**: 800ms

## Error Handling

```python
def execute(context):
    """Execute with error handling."""

    try:
        # Check if should execute
        if not should_execute(context):
            return {
                "hook_id": "context-analyzer",
                "status": "skipped",
                "reason": "No files loaded"
            }

        # Analyze context
        analysis = analyze_context(context)

        return {
            "hook_id": "context-analyzer",
            "status": "success",
            "data": analysis
        }

    except Exception as e:
        log_error(f"Context analysis failed: {e}")

        return {
            "hook_id": "context-analyzer",
            "status": "failed",
            "error": str(e)
        }
```

---

**Version**: 1.0.0 (Phase 2.2)
**Last Updated**: 2025-01-26
**Dependencies**: None
**Execution Point**: UserPromptSubmit (after pattern detection)
**Priority**: 15 (executes after pattern detection)
**Conditional**: Only runs if files are loaded
