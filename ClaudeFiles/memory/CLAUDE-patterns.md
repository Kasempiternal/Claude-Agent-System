# CLAUDE-patterns.md
*Established Code Patterns and Conventions*

## Project Architecture Patterns

### Workflow Organization
- **Pattern**: Command → Middleware → Workflow → Agents
- **Location**: `/commands/*.md`, `/middleware/*.md`, `/workflows/*/`
- **Convention**: Each workflow has dedicated agents subdirectory

### Command Structure
```markdown
# /command-name
## Purpose
## Usage
## Implementation Instructions
## Examples
```

### Agent File Pattern
```markdown
# Agent Name
## Role & Responsibilities
## Input Requirements
## Deliverables
## Validation Criteria
## Working Process
```

## Code Conventions

### File Naming
- Commands: `/commands/[command-name].md`
- Agents: `/workflows/[workflow]/agents/[agent-name].md`
- Middleware: `/middleware/[feature]-[type].md`
- Documentation: `/ClaudeFiles/documentation/[topic].md`

### Markdown Structure
- H1 for file title
- H2 for major sections
- H3 for subsections
- Code blocks with language specification
- Bullet points for lists

## Implementation Patterns

### Workflow Execution
```python
def execute_workflow(task, context):
    # 1. Analyze complexity
    # 2. Select workflow
    # 3. Execute agents sequentially
    # 4. Update memory/documentation
    # 5. Return results
```

### Memory Bank Updates
- Read at workflow start
- Update after each agent
- Write summary at completion
- Maintain version history

### Error Handling
- Graceful degradation
- User notification
- Fallback workflows
- Recovery strategies

## Integration Patterns

### Subagent Usage
```markdown
Use Task tool with:
- description: Brief task description
- prompt: Detailed requirements
- subagent_type: specialized agent name
```

### Context Management
- Limit file reads to necessary
- Use memory bank for persistence
- Clean up after large operations
- Monitor token usage

## Security Patterns

### Input Validation
1. Security scan user input
2. Decode any encodings
3. Check for injection attempts
4. Sanitize before processing

### Output Safety
- Never expose internal paths
- Sanitize error messages
- Validate generated code
- Check for sensitive data

## Performance Patterns

### Token Optimization
- Use Chain of Draft for searches
- Batch similar operations
- Clean old context regularly
- Leverage memory bank cache

### Parallel Processing
- Identify independent tasks
- Use Task tool concurrently
- Aggregate results efficiently
- Handle partial failures

---
*This file documents discovered patterns. Update when new patterns emerge.*