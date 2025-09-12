# DECISION ENGINE MODULE

## Enhanced Decision Engine

### Core Function

```python
def analyze_for_workflow_selection(task_description, context_info, user_preferences=None):
    """Rule-based workflow selection engine"""
    
    # Load memory bank context
    memory_context = load_memory_bank()
    
    # Check for security threats if enabled
    if should_run_security_scan(task_description):
        security_report = run_prompt_security_scan(task_description)
        if security_report.risk_level == "CRITICAL":
            return abort_with_security_warning(security_report)
    
    # Use Lyra universal middleware first
    lyra_result = lyra_optimize({
        'command': 'systemcc',
        'prompt': task_description,
        'context': context_info
    })
    
    # Apply streamlined decision engine
    return enhanced_workflow_selection(task_description, context_info, memory_context, lyra_result)
```

## Streamlined Selection Logic

```python
def enhanced_workflow_selection(task_description, context_info, memory_context, lyra_result):
    """
    Streamlined Decision Engine for Workflow Selection
    
    Balanced approach:
    1. Five-dimensional factor analysis
    2. Enhanced rule-based logic with weighted scoring
    3. Decision transparency with clear reasoning
    4. Robust fallback mechanisms
    5. Performance-optimized for real-time use
    """
    
    try:
        # Import streamlined decision engine
        from middleware.streamlined_decision_engine import enhanced_workflow_selection as streamlined_selection
        
        # Use the streamlined engine
        result = streamlined_selection(task_description, context_info, memory_context)
        
        # Enhance with Lyra context
        if hasattr(lyra_result, 'metadata'):
            lyra_complexity = lyra_result.metadata.complexity_score / 10.0
            result['factor_scores']['lyra_enhanced'] = True
            result['reasoning'] += f"\n🎯 Lyra Enhancement: Complexity {lyra_complexity:.2f}"
        
        return result
    
    except Exception as e:
        # Fallback to simplified logic
        return fallback_decision_logic(task_description, context_info, lyra_result, str(e))
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