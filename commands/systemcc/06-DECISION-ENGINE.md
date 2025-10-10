# DECISION ENGINE MODULE

## Simplified Decision Engine

### Core Function

```python
def analyze_for_workflow_selection(task_description, context_info, user_preferences=None):
    """Simplified workflow selection focused on code minimalism"""

    # Load memory bank context
    memory_context = load_memory_bank()

    # Enhanced security detection for database/SQL operations
    if should_run_security_scan_enhanced(task_description):
        security_report = run_prompt_security_scan(task_description)
        if security_report.risk_level == "CRITICAL":
            return abort_with_security_warning(security_report)

    # Use Lyra universal middleware first
    lyra_result = lyra_optimize({
        'command': 'systemcc',
        'prompt': task_description,
        'context': context_info
    })

    # Apply simplified decision engine with code minimalism
    return simplified_workflow_selection(task_description, context_info, memory_context, lyra_result)
```

## Enhanced Security Detection

```python
def should_run_security_scan_enhanced(task_description):
    """
    Automatically detect when security scanning is required
    Especially for database, SQL, encoding, and authentication tasks
    """

    desc_lower = task_description.lower()

    # Database and SQL related keywords (ALWAYS scan)
    database_keywords = [
        'database', 'sql', 'query', 'queries', 'migration', 'schema',
        'table', 'tables', 'column', 'columns', 'index', 'indexes',
        'postgres', 'mysql', 'mongodb', 'redis', 'sqlite', 'oracle',
        'orm', 'sequelize', 'typeorm', 'prisma', 'knex', 'mongoose',
        'insert', 'update', 'delete', 'select', 'join', 'where'
    ]

    # Encoding and potential injection vectors (ALWAYS scan)
    encoding_keywords = [
        'encode', 'decode', 'base64', 'encoding', 'decoding',
        'serialize', 'deserialize', 'json', 'xml', 'yaml',
        'escape', 'unescape', 'sanitize', 'injection', 'xss'
    ]

    # Authentication and security (ALWAYS scan)
    auth_keywords = [
        'auth', 'authentication', 'authorization', 'login', 'logout',
        'password', 'token', 'jwt', 'oauth', 'session', 'cookie',
        'permission', 'role', 'rbac', 'acl', 'security', 'crypto',
        'encrypt', 'decrypt', 'hash', 'salt', 'key', 'certificate'
    ]

    # Network and API operations (scan if suspicious)
    network_keywords = [
        'api', 'endpoint', 'webhook', 'request', 'response',
        'http', 'https', 'rest', 'graphql', 'grpc', 'websocket',
        'fetch', 'axios', 'curl', 'post', 'get', 'put', 'patch'
    ]

    # Check for any database/SQL/encoding keywords
    for keyword in database_keywords + encoding_keywords + auth_keywords:
        if keyword in desc_lower:
            print(f"🔐 Security scan auto-enabled: '{keyword}' detected")
            return True

    # Check for network operations with data handling
    for keyword in network_keywords:
        if keyword in desc_lower and any(data_word in desc_lower for data_word in ['data', 'payload', 'body', 'params']):
            print(f"🔐 Security scan auto-enabled: Network operation with data handling detected")
            return True

    # Check for explicit security flags
    if '--security' in task_description or '--scan' in task_description:
        return True

    return False
```

## Streamlined Selection Logic

```python
def simplified_workflow_selection(task_description, context_info, memory_context, lyra_result):
    """
    Simplified Decision Engine for Workflow Selection

    Professional approach focused on:
    1. Code minimalism scoring
    2. Practical heuristics
    3. Clear, understandable rules
    4. Fast decision making
    5. Team-friendly code generation
    """

    try:
        # Import simplified decision engine
        from middleware.simplified_decision_engine import select_workflow

        # Calculate workflow with code minimalism focus
        result = select_workflow(task_description, context_info)

        # Enhance with Lyra context if available
        if hasattr(lyra_result, 'metadata'):
            result['lyra_enhanced'] = True

        # Add professional code standards reminder
        result['code_standards'] = {
            'minimize_new_files': True,
            'prefer_modifications': True,
            'surgical_changes': True,
            'team_friendly': True
        }

        return result

    except Exception as e:
        # Fallback to simple logic
        return simple_workflow_selection(task_description, context_info)
```

## Simple Workflow Selection

```python
def simple_workflow_selection(task_description, context_info):
    """Simplified workflow selection for maximum reliability"""
    
    desc_lower = task_description.lower()
    
    # Priority 1: Context protection
    if context_info.get('current_tokens', 0) > 30000:
        return {
            'workflow': 'taskit',
            'reasoning': 'Context size protection',
            'confidence': 0.9
        }
    
    # Priority 2: Risk indicators
    high_risk_indicators = ['critical', 'production', 'breaking', 'delete', 'remove', 'security']
    if any(indicator in desc_lower for indicator in high_risk_indicators):
        return {
            'workflow': 'complete_system',
            'reasoning': 'High-risk indicators detected',
            'confidence': 0.85
        }
    
    # Priority 3: Complexity indicators
    complex_indicators = ['architecture', 'refactor', 'system', 'complex', 'integration']
    simple_indicators = ['fix', 'update', 'change', 'small', 'simple', 'typo']
    
    complexity_score = sum(1 for indicator in complex_indicators if indicator in desc_lower)
    simplicity_score = sum(1 for indicator in simple_indicators if indicator in desc_lower)
    
    if simplicity_score > complexity_score:
        return {
            'workflow': 'orchestrated',
            'reasoning': 'Simple task detected',
            'confidence': 0.8
        }
    elif complexity_score >= 2:
        return {
            'workflow': 'complete_system',
            'reasoning': 'Complex task detected',
            'confidence': 0.75
        }
    else:
        return {
            'workflow': 'complete_system',
            'reasoning': 'Default to comprehensive validation',
            'confidence': 0.7
        }
```

## Web Intent Detection

```python
def detect_web_implementation_intent(task_description, project_context):
    """Detect if task will create web files"""
    
    desc_lower = task_description.lower()
    
    # Implementation intent indicators
    web_intent_patterns = [
        "full.*app", "web.*app", "application.*table",
        "tracking.*app", "dashboard.*application",
        "create.*app.*with", "build.*app.*for"
    ]
    
    # Empty project + UI elements
    is_empty_project = not project_context.get('has_html_files', False)
    has_ui_elements = any(ui in desc_lower for ui in [
        "table", "dashboard", "interface", "tracker", "form", "page"
    ])
    
    has_web_intent = any(re.search(pattern, desc_lower) for pattern in web_intent_patterns)
    
    return (is_empty_project and has_ui_elements) or has_web_intent
```

## CCPM Detection

```python
def ccpm_would_be_beneficial(analysis):
    """Determine if CCPM would help"""
    
    return (
        analysis.complexity_score > 6 AND 
        analysis.estimated_time > 60_minutes AND
        (
            analysis.independent_components >= 3 OR
            "parallel" in analysis.keywords OR
            "concurrent" in analysis.keywords OR
            "multiple systems" in analysis.description
        )
    )
```

## Fallback Logic

```python
def fallback_decision_logic(task_description, context_info, lyra_result, error_details):
    """Robust fallback when main engine fails"""
    
    # Use simple selection as fallback
    result = simple_workflow_selection(task_description, context_info)
    result['reasoning'] += f" (Fallback: {error_details[:100]})"
    result['fallback_used'] = True
    
    return result
```

## Decision Priority Order

1. **Web Detection** (Anti-YOLO)
2. **CCPM Flag** (--pm)
3. **Context Size** (>30k tokens)
4. **Agent OS Keywords** (setup, standards)
5. **Feature Development** (PRD needed)
6. **Complexity Score** (>5)
7. **Simple Tasks** (orchestrated)
8. **Default** (complete system)

## Confidence Levels

- **0.9+**: Very confident (clear indicators)
- **0.8-0.89**: Confident (multiple indicators)
- **0.7-0.79**: Moderate (some indicators)
- **0.6-0.69**: Low (unclear, using defaults)
- **<0.6**: Fallback mode active

## Integration

This engine integrates with:
- `02-LYRA-OPTIMIZATION.md` for complexity scoring
- `03-WORKFLOW-SELECTION.md` for indicator matching
- `04-IMPLEMENTATION-STEPS.md` for execution
- `07-ERROR-HANDLING.md` for fallbacks