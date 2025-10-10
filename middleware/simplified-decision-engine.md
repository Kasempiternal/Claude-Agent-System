# Simplified Decision Engine

Professional workflow selection using practical heuristics focused on minimal code generation.

## Core Philosophy

Replace complex mathematical models with straightforward, understandable rules that prioritize:
- **Minimal code changes** - Surgical modifications over broad rewrites
- **Existing code reuse** - Use what's already there
- **Team-friendly output** - Code that's easy to review
- **Fast decisions** - No complex calculations needed

## Eight-Dimensional Analysis Framework

### 1. Code Minimalism Score (M): [0.0 - 1.0]

Assesses how much we can minimize code generation:

```python
def calculate_code_minimalism_score(task_desc, project_context):
    """
    Evaluate potential for minimal code generation
    """

    score = 0.0

    # Check if modifying existing code (high minimalism potential)
    if any(word in task_desc.lower() for word in ['fix', 'update', 'modify', 'change', 'adjust', 'patch']):
        score += 0.4

    # Check if working with existing codebase
    if project_context.get('has_existing_code', False):
        score += 0.3

    # Check for configuration-based solutions
    if any(word in task_desc.lower() for word in ['config', 'setting', 'environment', 'variable']):
        score += 0.2

    # Check if refactoring (uses existing code)
    if 'refactor' in task_desc.lower():
        score += 0.2

    # Penalize if creating new features from scratch
    if any(word in task_desc.lower() for word in ['create new', 'build from scratch', 'implement entire']):
        score = max(0, score - 0.3)

    return min(1.0, score)
```

### 2. Technical Complexity (T): [0.0 - 1.0]

Simple keyword-based complexity assessment:

```python
def calculate_technical_complexity(task_desc):
    """
    Simple complexity scoring based on task indicators
    """

    complexity = 0.3  # Base complexity

    # High complexity indicators
    high_complexity_words = ['architecture', 'security', 'database', 'authentication',
                             'migration', 'integration', 'performance', 'scale']
    for word in high_complexity_words:
        if word in task_desc.lower():
            complexity += 0.1

    # Low complexity indicators
    low_complexity_words = ['typo', 'text', 'color', 'style', 'rename', 'simple']
    for word in low_complexity_words:
        if word in task_desc.lower():
            complexity -= 0.1

    return max(0.0, min(1.0, complexity))
```

### 3. Scope Impact (S): [0.0 - 1.0]

How many files/modules are affected:

```python
def calculate_scope_impact(task_desc):
    """
    Estimate scope based on language patterns
    """

    if any(word in task_desc.lower() for word in ['entire', 'all', 'throughout', 'across']):
        return 0.9
    elif any(word in task_desc.lower() for word in ['multiple', 'several', 'various']):
        return 0.6
    elif any(word in task_desc.lower() for word in ['single', 'one', 'specific']):
        return 0.2
    else:
        return 0.4  # Default moderate scope
```

### 4. Risk Factor (R): [0.0 - 1.0]

Simple risk assessment:

```python
def calculate_risk_factor(task_desc):
    """
    Assess risk based on keywords
    """

    risk = 0.2  # Base risk

    # Critical risk indicators
    if any(word in task_desc.lower() for word in ['production', 'critical', 'urgent', 'breaking']):
        risk += 0.5

    # Database/security risks
    if any(word in task_desc.lower() for word in ['database', 'security', 'authentication', 'payment']):
        risk += 0.3

    # Low risk indicators
    if any(word in task_desc.lower() for word in ['test', 'development', 'styling', 'documentation']):
        risk -= 0.2

    return max(0.0, min(1.0, risk))
```

### 5. Context Load (C): [0.0 - 1.0]

Current conversation context pressure:

```python
def calculate_context_load(context_info):
    """
    Simple context load calculation
    """

    current_tokens = context_info.get('token_count', 0)
    loaded_files = context_info.get('loaded_files', 0)

    # Simple linear scaling
    token_load = min(1.0, current_tokens / 30000)
    file_load = min(1.0, loaded_files / 20)

    return (token_load * 0.7 + file_load * 0.3)
```

### 6. Time Pressure (P): [0.0 - 1.0]

Urgency detection:

```python
def calculate_time_pressure(task_desc):
    """
    Detect urgency from task description
    """

    urgency_words = {
        'urgent': 1.0,
        'asap': 0.9,
        'immediately': 0.9,
        'critical': 0.8,
        'quickly': 0.6,
        'soon': 0.4
    }

    for word, score in urgency_words.items():
        if word in task_desc.lower():
            return score

    return 0.2  # Default low urgency
```

### 7. Security Sensitivity (S): [0.0 - 1.0]

Detect operations requiring extra security attention:

```python
def calculate_security_sensitivity(task_desc):
    """
    Assess security implications of the task
    """

    desc_lower = task_desc.lower()
    sensitivity = 0.1  # Base sensitivity

    # Critical security indicators
    critical_security = ['password', 'token', 'auth', 'login', 'encryption', 'decrypt', 'key', 'certificate', 'oauth', 'jwt']
    for word in critical_security:
        if word in desc_lower:
            sensitivity += 0.2

    # Database operation indicators
    database_indicators = ['database', 'sql', 'query', 'migration', 'schema', 'orm', 'injection']
    for word in database_indicators:
        if word in desc_lower:
            sensitivity += 0.15

    # Data handling indicators
    data_handling = ['encode', 'decode', 'base64', 'serialize', 'sanitize', 'validation', 'input', 'user data']
    for word in data_handling:
        if word in desc_lower:
            sensitivity += 0.1

    # Network/API indicators
    if any(word in desc_lower for word in ['api', 'endpoint', 'webhook', 'external', 'third-party']):
        sensitivity += 0.1

    # Permission/Access control
    if any(word in desc_lower for word in ['permission', 'role', 'access', 'rbac', 'acl', 'authorization']):
        sensitivity += 0.15

    return min(1.0, sensitivity)
```

### 8. Pattern Reusability (PR): [0.0 - 1.0]

Check memory bank for similar solutions:

```python
def calculate_pattern_reusability(task_desc, memory_context):
    """
    Assess how much we can reuse existing patterns
    """

    reusability = 0.0

    # Check for exact pattern matches in memory
    if memory_context and 'patterns' in memory_context:
        task_keywords = extract_keywords(task_desc)

        for pattern in memory_context['patterns']:
            matches = count_keyword_matches(task_keywords, pattern['keywords'])
            if matches >= 3:
                reusability += 0.3
            elif matches >= 2:
                reusability += 0.2
            elif matches >= 1:
                reusability += 0.1

    # Check for similar previous implementations
    if memory_context and 'previous_solutions' in memory_context:
        similarity = calculate_similarity(task_desc, memory_context['previous_solutions'])
        reusability += similarity * 0.4

    # Check for component reuse opportunities
    component_keywords = ['pagination', 'authentication', 'upload', 'search', 'filter', 'sort', 'form', 'validation']
    for keyword in component_keywords:
        if keyword in task_desc.lower():
            reusability += 0.15  # Common components likely exist

    # Check for workflow pattern reuse
    workflow_patterns = ['crud', 'rest api', 'data processing', 'report generation', 'user management']
    for pattern in workflow_patterns:
        if pattern in task_desc.lower():
            reusability += 0.2  # Standard workflows can be reused

    return min(1.0, reusability)
```

## Enhanced Workflow Selection with 8 Dimensions

```python
def select_workflow(task_description, context_info, memory_context=None):
    """
    Enhanced workflow selection with 8-dimensional analysis
    """

    # Calculate all 8 dimensions
    scores = {
        'code_minimalism': calculate_code_minimalism_score(task_description, context_info),
        'technical_complexity': calculate_technical_complexity(task_description),
        'scope_impact': calculate_scope_impact(task_description),
        'risk_factor': calculate_risk_factor(task_description),
        'context_load': calculate_context_load(context_info),
        'time_pressure': calculate_time_pressure(task_description),
        'security_sensitivity': calculate_security_sensitivity(task_description),
        'pattern_reusability': calculate_pattern_reusability(task_description, memory_context)
    }

    # Enhanced decision rules incorporating all 8 dimensions

    # 1. High security sensitivity → Complete system with security scan
    if scores['security_sensitivity'] > 0.7:
        return {
            'workflow': 'complete_system',
            'reason': 'High security sensitivity - requires comprehensive validation and security scanning',
            'confidence': 0.95,
            'security_scan': True
        }

    # 2. High context load → Phase-based workflow
    if scores['context_load'] > 0.7:
        return {
            'workflow': 'taskit',
            'reason': 'High context load - need phased execution',
            'confidence': 0.9
        }

    # 3. High pattern reusability + High code minimalism → Orchestrated
    if scores['pattern_reusability'] > 0.6 and scores['code_minimalism'] > 0.6:
        return {
            'workflow': 'orchestrated',
            'reason': 'Can reuse existing patterns with minimal changes',
            'confidence': 0.9,
            'reuse_patterns': True
        }

    # 4. High code minimalism + Low complexity + Low security → Orchestrated
    if scores['code_minimalism'] > 0.6 and scores['technical_complexity'] < 0.4 and scores['security_sensitivity'] < 0.4:
        return {
            'workflow': 'orchestrated',
            'reason': 'Simple change to existing code - minimal workflow',
            'confidence': 0.85
        }

    # 5. High risk OR high complexity OR medium-high security → Complete system
    if scores['risk_factor'] > 0.6 or scores['technical_complexity'] > 0.7 or scores['security_sensitivity'] > 0.5:
        return {
            'workflow': 'complete_system',
            'reason': 'High risk, complexity, or security concerns - need full validation',
            'confidence': 0.8,
            'security_scan': scores['security_sensitivity'] > 0.5
        }

    # 6. Feature development with pattern potential → AI Dev Tasks
    if 'feature' in task_description.lower() and 'new' in task_description.lower():
        return {
            'workflow': 'aidevtasks',
            'reason': 'New feature development - PRD approach',
            'confidence': 0.75,
            'check_patterns': scores['pattern_reusability'] > 0.3
        }

    # 7. Large scope → Phase-based
    if scores['scope_impact'] > 0.7:
        return {
            'workflow': 'taskit',
            'reason': 'Large scope - need systematic phases',
            'confidence': 0.7
        }

    # 8. Default based on complexity and security
    if scores['technical_complexity'] < 0.5 and scores['security_sensitivity'] < 0.3:
        return {
            'workflow': 'orchestrated',
            'reason': 'Simple task with low security risk - streamlined workflow',
            'confidence': 0.65
        }
    else:
        return {
            'workflow': 'complete_system',
            'reason': 'Moderate complexity or security concerns - comprehensive validation',
            'confidence': 0.6,
            'security_scan': scores['security_sensitivity'] > 0.3
        }
```

## Code Minimalism Guidelines

### When to Use Each Workflow

#### Orchestrated (3-agent) - Maximum Minimalism
Use when:
- Modifying existing code
- Simple bug fixes
- Configuration changes
- Style/UI adjustments
- Single file changes
- Low risk operations

#### Complete System (6-agent) - Balanced Approach
Use when:
- Complex logic changes
- Multi-file modifications
- Security-related changes
- Database operations
- High risk changes
- Need comprehensive testing

#### Phase-Based (taskit) - Large Scale Minimalism
Use when:
- Context is getting large (>30k tokens)
- Refactoring across many files
- Need to break work into chunks
- Systematic changes throughout codebase

#### AI Dev Tasks - Structured Feature Development
Use when:
- Building new features
- Need requirements gathering
- User-facing functionality
- Complex business logic

## Professional Code Standards

### Priority Order for Solutions

1. **Configuration Change** - Can we solve with settings?
2. **Modify Existing** - Can we extend current code?
3. **Compose Existing** - Can we combine what's there?
4. **Create Minimal New** - Only when necessary

### Code Review Friendliness

Always consider:
- Will this be easy to review?
- Are changes focused and atomic?
- Is the intent immediately clear?
- Have I minimized the diff size?

## Decision Transparency

Show users why a workflow was selected:

```
🔍 Task Analysis: "fix login authentication with database"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 8-Dimensional Analysis:
  • Code Minimalism: 0.6 (modifying existing)
  • Complexity: 0.5 (moderate change)
  • Scope: 0.3 (auth module)
  • Risk: 0.7 (authentication critical)
  • Context Load: 0.3 (moderate)
  • Time Pressure: 0.2 (normal)
  • Security: 0.8 (auth + database) 🔐
  • Pattern Reuse: 0.5 (existing auth patterns)

✅ Selected: Complete System Workflow
📝 Reason: High security sensitivity - requires comprehensive validation and security scanning
🎯 Confidence: 95%
🔐 Security Scan: ENABLED (database + auth detected)
♻️ Pattern Reuse: Available auth patterns found
```

## Performance Optimizations

This simplified engine is optimized for:
1. **Fast decisions** - No complex math, just rules
2. **Clear reasoning** - Easy to understand logic
3. **Predictable outcomes** - Consistent workflow selection
4. **Minimal overhead** - No heavy computations

## Configuration

```python
DECISION_CONFIG = {
    'prioritize_minimalism': True,
    'prefer_existing_code': True,
    'avoid_new_files': True,
    'focus_surgical_changes': True,
    'team_friendly_mode': True
}
```

This simplified framework provides professional, minimal code generation while being completely transparent and maintainable!