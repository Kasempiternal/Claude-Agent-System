# Anti-YOLO Web Workflow Orchestrator

## Purpose
Coordinates the complete Anti-YOLO web development workflow from detection through implementation, ensuring seamless transitions between ASCII wireframing and HTML generation.

## Workflow Phases

### Phase 1: Web Project Detection
```
Input: User task description + project context
Process: 
- Apply web-project-detector.md logic
- Check for HTML/CSS/JS keywords
- Analyze project structure for web indicators
- Determine confidence level
Output: Web project detected → Continue | Not detected → Route to standard workflow
```

### Phase 2: ASCII Wireframe Creation
```
Agent: wireframe-designer.md
Process:
- Apply Lyra-optimized prompt to wireframe generation
- Create ASCII art layout based on requirements
- Include responsive breakpoints when needed
- Add interaction annotations
- Save wireframe to ClaudeFiles/wireframes/
Output: Complete ASCII wireframe ready for approval
```

### Phase 3: Mandatory User Approval
```
Process:
- Display wireframe with clear formatting
- Present approval prompt: "Does this layout look right? Type 'yes' to proceed or describe changes."
- If changes requested:
  → Update wireframe based on feedback
  → Re-present for approval
  → Repeat until approved
- If approved:
  → Save approved wireframe as reference
  → Proceed to implementation
```

### Phase 4: HTML Implementation
```
Agent: wireframe-to-html.md
Process:
- Reference approved wireframe throughout implementation
- Detect project frameworks and follow conventions
- Generate semantic HTML matching wireframe structure
- Create responsive CSS following mobile-first approach
- Add JavaScript for interactive functionality
- Ensure accessibility compliance
Output: Production-ready HTML/CSS/JS files
```

### Phase 5: Wireframe-Driven Testing
```
Process:
- Use approved wireframe as test specification
- Validate every wireframe element is present in HTML
- Test responsive behavior matches wireframe
- Verify interactive elements function correctly
- Check accessibility requirements are met
- Confirm visual layout matches wireframe structure
Output: Tested, verified implementation
```

## Integration with systemcc

### Detection Logic
```python
def should_use_anti_yolo_workflow(task_description, project_context):
    """Check if task requires Anti-YOLO web workflow"""
    
    # Load web project detector
    from middleware.web_project_detector import detect_web_project
    from middleware.web_implementation_intent import detect_web_implementation_intent
    
    detection_result = detect_web_project(task_description, project_context)
    intent_result = detect_web_implementation_intent(task_description, project_context)
    
    return (detection_result['isWebProject'] and detection_result['confidence'] in ['high', 'medium']) or intent_result
```

### Hybrid Workflow Mode (NEW!)
The Anti-YOLO workflow can now operate as a **pre-phase** for other workflows:

#### Anti-YOLO → Complete System
For complex web applications requiring full validation:
1. **Phase 0**: ASCII Wireframe Creation + User Approval
2. **Phase 1-6**: Standard Complete System workflow
3. **Benefit**: Visual planning + comprehensive validation

#### Anti-YOLO → AI Dev Tasks  
For feature-rich web applications:
1. **Phase 0**: ASCII Wireframe Creation + User Approval
2. **Phase 1-3**: PRD Creation → Task Generation → Implementation
3. **Benefit**: Visual planning + systematic feature development

#### Anti-YOLO Standalone
For simple web interfaces:
1. **Phase 1-5**: Complete Anti-YOLO workflow only
2. **Benefit**: Fast, visual-first web development

### Execution Flow
```python
def execute_anti_yolo_workflow(optimized_prompt, project_context):
    """Execute complete Anti-YOLO workflow"""
    
    print("🎨 Detecting web project requirements...")
    
    # Phase 1: Create wireframe
    print("🔄 Phase 1/4: Creating ASCII wireframe...")
    wireframe = create_ascii_wireframe(optimized_prompt)
    save_wireframe(wireframe, "ClaudeFiles/wireframes/")
    
    print("✋ Wireframe complete! Does this layout look right?")
    print("Type 'yes' to proceed with HTML implementation, or describe changes.")
    
    # Phase 2: Get user approval
    user_response = wait_for_user_approval()
    
    while not is_approval(user_response):
        print("🔄 Updating wireframe based on your feedback...")
        wireframe = update_wireframe(wireframe, user_response)
        print("✋ Updated wireframe! Does this look better?")
        user_response = wait_for_user_approval()
    
    print("✅ Perfect! Proceeding with HTML implementation...")
    
    # Phase 3: Implement HTML
    print("🔄 Phase 2/4: Generating semantic HTML structure...")
    html_files = generate_html_from_wireframe(wireframe, project_context)
    print("✅ Phase 2/4: HTML structure complete")
    
    print("🔄 Phase 3/4: Creating responsive CSS...")
    css_files = generate_css_from_wireframe(wireframe, project_context)
    print("✅ Phase 3/4: CSS styling complete")
    
    print("🔄 Phase 4/4: Adding interactive functionality...")
    js_files = generate_javascript_from_wireframe(wireframe, project_context)
    print("✅ Phase 4/4: Interactive functionality complete")
    
    # Phase 4: Test against wireframe
    print("🧪 Testing against wireframe specification...")
    test_results = validate_implementation_against_wireframe(
        wireframe, html_files, css_files, js_files
    )
    
    if test_results['all_passed']:
        print("✅ All wireframe elements present")
        print("✅ Responsive behavior matches")
        print("✅ Interactive functionality working")
        print("✅ Accessibility requirements met")
        print("✨ Implementation complete and ready for deployment!")
    else:
        print("⚠️ Some tests failed - fixing issues...")
        fix_implementation_issues(test_results['failures'])
        print("✅ All issues resolved!")
    
    return {
        'wireframe': wireframe,
        'implementation_files': html_files + css_files + js_files,
        'test_results': test_results
    }
```

## Error Handling

### Wireframe Creation Failures
- Fallback to simpler ASCII patterns
- Ask clarifying questions about layout
- Provide multiple wireframe options

### User Approval Timeout
- No timeout - wait indefinitely for user input
- Clear instructions on how to provide feedback
- Examples of acceptable responses

### Implementation Failures
- Reference wireframe for troubleshooting
- Break down implementation into smaller steps
- Validate each component against wireframe section

## Quality Assurance

### Wireframe Quality Checks
- All interactive elements clearly marked
- Responsive breakpoints specified when needed
- Clear content hierarchy
- Proper ASCII formatting

### Implementation Quality Checks
- Semantic HTML structure
- Accessibility compliance (WCAG AA)
- Cross-browser compatibility
- Mobile-responsive design
- Performance optimization

## Memory Integration

### File Storage
- Wireframes: `ClaudeFiles/wireframes/[task-name]-[timestamp].txt`
- Implementation notes: `ClaudeFiles/implementation/[task-name]/`
- Test results: `ClaudeFiles/tests/anti-yolo/[task-name]/`

### Memory Bank Updates
- Document successful wireframe patterns in `CLAUDE-patterns.md`
- Record user preferences for future reference
- Save implementation approaches that worked well
- Update troubleshooting database with solutions

## Success Metrics

### Token Efficiency
- 70-90% reduction in HTML iteration cycles
- Faster approval process due to visual clarity
- Fewer "not what I expected" moments

### Implementation Quality
- First-pass HTML accuracy > 95%
- User satisfaction with final layout
- Reduced debugging time in production
- Better accessibility compliance

## Example: LinkedIn Application Tracker Use Case

### User Request: "create a full web app with a table to follow my LinkedIn application"

**Detection Process:**
1. **Keyword Analysis**: "full web app" + "table" → Web application intent detected
2. **Project Context**: Empty project → Implementation intent confirmed  
3. **Workflow Selection**: Anti-YOLO → Complete System (hybrid mode)

**Execution Flow:**
```
🎨 Web application detected! Creating visual layout first...

┌─ LinkedIn Application Tracker ──────────────────┐
│ My Job Applications              [+ New] [Filter]│
├─────────────────────────────────────────────────┤
│ Company    │ Position    │ Status     │ Applied │
├─────────────────────────────────────────────────┤
│ Google     │ SWE         │ Interview  │ Jan 15  │
│ Microsoft  │ Frontend    │ Applied    │ Jan 20  │
│ Apple      │ Full Stack  │ Rejected   │ Jan 10  │
├─────────────────────────────────────────────────┤
│ [Previous] [1] [2] [3] [Next]          3 of 47  │
└─────────────────────────────────────────────────┘

✋ Does this layout look right? Type 'yes' to proceed or describe changes.

User: yes

✅ Perfect! Proceeding with comprehensive implementation...
🔄 Phase 1/6: Strategic architecture planning...
[Complete System workflow continues with wireframe as reference]
```

This orchestrator ensures that the Anti-YOLO methodology is applied consistently and effectively to all web development tasks, including hybrid execution with other workflows.