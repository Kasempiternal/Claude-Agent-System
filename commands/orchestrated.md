# /orchestrated - Streamlined Three-Agent Workflow

## Purpose
Execute simple to moderate complexity tasks using the streamlined three-agent workflow. This provides quick, efficient implementation with built-in quality checks for focused development tasks.

## How It Works

When you use `/orchestrated "task description"`, the system will:

1. **Apply Lyra Universal Optimization** to clarify requirements
2. **Orchestrate** the task breakdown and approach
3. **Develop** the implementation with best practices
4. **Review** the code for quality and completeness
5. **Deliver** production-ready code quickly

## Usage

### Direct Access
```bash
/orchestrated "fix navigation menu on mobile"
/orchestrated "add email validation to signup form"
/orchestrated "update API endpoint for user profile"
```

### Through Master Router
```bash
/systemcc "simple bug fix"  # Often routes to orchestrated
```

## Implementation

When invoked:

1. **Lyra Optimization**:
   ```
   Apply middleware/lyra-universal.md
   - Enhance task clarity
   - Add implementation details
   - Specify quality requirements
   ```

2. **Execute Orchestrated Workflow**:
   ```
   Use workflows/orchestrated-only/m-orchestrated-dev.md
   - Single-pass implementation
   - Integrated quality checks
   - Rapid delivery
   ```

## Three-Agent Process

### 1. Orchestrator (Planning)
- Analyzes the optimized request
- Creates implementation approach
- Identifies affected files
- Sets quality criteria

### 2. Developer (Implementation)
- Executes the plan
- Writes clean, tested code
- Follows project patterns
- Handles edge cases

### 3. Reviewer (Quality)
- Validates implementation
- Checks best practices
- Ensures completeness
- Confirms deliverables

## When to Use Orchestrated

Ideal for:
- Bug fixes
- Small feature additions
- UI/UX updates
- Configuration changes
- Refactoring single components
- Documentation updates

Not suitable for:
- Multi-system changes
- Complex architectures
- Security-critical features
- Large refactoring
- Breaking changes

## Output

The orchestrated workflow delivers:
- Complete, working code
- Inline documentation
- Basic test coverage
- Ready for commit

## Example

```
User: /orchestrated "add dark mode toggle to settings"

Lyra Optimization: "Implement dark mode toggle in settings page. Add 
toggle switch UI component, persist preference to localStorage, apply 
theme classes to root element, ensure all components respect theme, 
maintain WCAG contrast ratios in dark mode."

Orchestrated Execution:
1. Orchestrator: Plans toggle component and theme system
2. Developer: Implements toggle, theme switching, persistence
3. Reviewer: Validates accessibility, completeness, patterns

Result: Complete dark mode implementation in single pass
```

## Benefits

1. **Speed** - Single-pass execution for quick delivery
2. **Quality** - Built-in review ensures standards
3. **Efficiency** - Minimal overhead for simple tasks
4. **Focus** - Concentrated on specific deliverable
5. **Simplicity** - No complex phase management

Remember: Orchestrated is perfect for tasks you could explain to a developer in a single conversation.