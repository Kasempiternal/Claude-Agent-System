# /orchestrated - Streamlined Three-Agent Workflow

## Purpose
Execute simple to moderate complexity tasks using the streamlined three-agent workflow. This provides quick, efficient implementation with built-in quality checks for focused development tasks. **All three agents execute automatically in a single seamless flow.**

## How It Works

When you use `/orchestrated "task description"`, the system will:

1. **Apply Lyra Universal Optimization** to clarify requirements
2. **Automatically execute all three agents**:
   - ✅ ORCHESTRATOR analyzes and plans
   - 🔄 DEVELOPER implements solution
   - 🔄 REVIEWER validates quality
3. **Deliver** production-ready code without manual intervention

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

## Automated Execution

The system uses the **Automated Workflow Executor** to provide:

1. **Seamless Flow**: All three agents run automatically
2. **Real-time Updates**: Progress shown as work happens
3. **Smart Interactions**: Only asks when choices are needed
4. **Complete Delivery**: From analysis to reviewed code

### Example Automated Flow
```
User: /orchestrated "add dark mode toggle to settings"

Claude: 🚀 Starting Orchestrated Workflow...

✅ ORCHESTRATOR: Task analysis complete
   - Identified: Settings UI update
   - Approach: Toggle component + theme system
   - Files: SettingsPage.tsx, theme.ts

🔄 DEVELOPER: Implementing dark mode toggle...
✅ DEVELOPER: Implementation complete
   - Added DarkModeToggle component
   - Integrated theme switching logic
   - Persisted preference to localStorage

🔄 REVIEWER: Validating implementation...
✅ REVIEWER: Code review passed
   - ✓ Accessibility: ARIA labels present
   - ✓ Performance: No re-render issues
   - ✓ Best practices: Clean code patterns

✨ Task Complete! Dark mode toggle ready for use.
```

## Three-Agent Process (Automated)

### 1. Orchestrator (Planning) - Automatic
- Analyzes the optimized request
- Creates implementation approach
- Identifies affected files
- Sets quality criteria
- **Passes context to Developer automatically**

### 2. Developer (Implementation) - Automatic
- Executes the plan from Orchestrator
- Writes clean, tested code
- Follows project patterns
- Handles edge cases
- **Passes code to Reviewer automatically**

### 3. Reviewer (Quality) - Automatic
- Validates implementation
- Checks best practices
- Ensures completeness
- Confirms deliverables
- **Returns final result to user**

## User Interaction Points

The workflow only pauses when:

1. **Implementation Choice**: Multiple valid approaches exist
2. **Missing Context**: Need project-specific information
3. **Risk Assessment**: Changes might have side effects

Example:
```
🔄 DEVELOPER: For the email validation, which approach do you prefer?
   1. HTML5 email input with pattern attribute
   2. Custom regex validation with error messages
   3. Third-party validation library
   
Your choice (1-3): _
```

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