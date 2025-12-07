# Skill-Rules Matcher

## Purpose
Pattern matching engine for skill-rules.json that provides declarative workflow selection rules. Integrates with the decision engine to influence workflow selection.

## Integration Point
Called during Phase 4 (Workflow Selection) alongside the decision engine

## Overview

Skill-rules provide declarative configuration for workflow selection based on:
- Pattern matching (keywords, file paths)
- Workflow preferences
- Required agents or validations
- Custom rules per project

## Skill-Rules Schema

Located at `middleware/skill-rules/skill-rules.json`:

```json
{
  "rules": {
    "authentication_tasks": {
      "patterns": ["auth", "login", "jwt", "session"],
      "file_triggers": ["**/auth/**", "**/middleware/auth*"],
      "preferred_workflow": "complete_system",
      "required_agents": ["security-scanner"],
      "auto_activate_hooks": ["security-validation"],
      "priority": "high"
    }
  }
}
```

## Matching Algorithm

```python
def match_skill_rules(user_request, loaded_files, pattern_results):
    """
    Match user request against skill-rules.

    Args:
        user_request: User's command text
        loaded_files: List of loaded file paths
        pattern_results: Results from auto-pattern-detection hook

    Returns:
        Matched rules and workflow suggestions
    """

    # Load skill-rules
    rules = load_skill_rules()

    matched_rules = []

    for rule_name, rule_config in rules.get("rules", {}).items():
        score = 0

        # 1. Pattern matching
        patterns = rule_config.get("patterns", [])
        request_lower = user_request.lower()

        pattern_matches = sum(1 for p in patterns if p in request_lower)
        if pattern_matches > 0:
            score += pattern_matches * 10

        # 2. File trigger matching
        file_triggers = rule_config.get("file_triggers", [])
        for file_path in loaded_files:
            for trigger in file_triggers:
                if matches_glob(file_path, trigger):
                    score += 15

        # 3. Pattern detection boost
        if pattern_results and rule_name in pattern_results.get("patterns_detected", []):
            score += 20

        if score > 0:
            matched_rules.append({
                "rule_name": rule_name,
                "score": score,
                "config": rule_config
            })

    # Sort by score
    matched_rules.sort(key=lambda r: r["score"], reverse=True)

    if not matched_rules:
        return None

    # Return top match
    top_match = matched_rules[0]

    return {
        "matched_rule": top_match["rule_name"],
        "confidence": min(top_match["score"] / 50.0, 1.0),
        "preferred_workflow": top_match["config"].get("preferred_workflow"),
        "required_agents": top_match["config"].get("required_agents", []),
        "auto_activate_hooks": top_match["config"].get("auto_activate_hooks", []),
        "priority": top_match["config"].get("priority", "medium")
    }
```

## Integration with Decision Engine

```python
# In 07-DECISION-ENGINE.md

def select_workflow(user_request, pattern_results, context):
    """
    Select workflow using multiple inputs.
    """

    # 1. Check skill-rules first
    skill_match = match_skill_rules(
        user_request,
        context.get("loaded_files", []),
        pattern_results
    )

    if skill_match and skill_match["priority"] == "high":
        # High priority rule - use directly
        return skill_match["preferred_workflow"]

    # 2. Check pattern detection (from hooks)
    if pattern_results and pattern_results.get("confidence", 0) > 0.7:
        # High confidence pattern - use suggestion
        return pattern_results["suggested_workflow"]

    # 3. Fall back to decision engine
    return run_decision_engine(user_request, context)
```

## Default Skill-Rules

```json
{
  "_schema_version": "1.0.0",
  "_description": "Declarative workflow selection rules",

  "rules": {
    "authentication_tasks": {
      "patterns": ["auth", "login", "logout", "jwt", "session", "oauth"],
      "file_triggers": ["**/auth/**", "**/middleware/auth*"],
      "preferred_workflow": "complete_system",
      "required_agents": [],
      "priority": "high"
    },

    "security_critical": {
      "patterns": ["security", "vulnerability", "xss", "csrf", "injection"],
      "file_triggers": ["**/security/**"],
      "preferred_workflow": "complete_system",
      "required_agents": [],
      "priority": "critical"
    },

    "quick_fixes": {
      "patterns": ["fix", "bug", "error", "broken"],
      "file_triggers": [],
      "preferred_workflow": "orchestrated",
      "priority": "medium"
    }
  }
}
```

## Benefits

1. **Declarative**: Define rules in JSON, no code changes
2. **Project-specific**: Customize per project
3. **Override-able**: Priority system allows overrides
4. **Extensible**: Add new rules without coding

---

**Version**: 1.0.0 (Phase 2.4)
**Last Updated**: 2025-01-26
**Integration Phase**: Phase 2 (Weeks 9-10)
**Configuration**: `skill-rules.json`
**Dependencies**: Decision engine, pattern detection
