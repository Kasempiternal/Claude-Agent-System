# LYRA AI PROMPT OPTIMIZATION MODULE

## Lyra Prompt Optimization (MANDATORY - ALWAYS SHOW)

After detection feedback, ALWAYS show Lyra optimization with this EXACT format:

```
═══════════════════════════════════════════════════════════════
🎯 LYRA AI PROMPT OPTIMIZATION
═══════════════════════════════════════════════════════════════

📝 Original Request:
"[user's raw prompt]"

🔍 Analysis Phase:
- Deconstructing intent...
- Diagnosing gaps...
- Developing enhancements...
- Delivering optimized prompt...

✨ Optimized Prompt:
"[enhanced prompt with complete specifications]"

📊 Optimization Details:
- Mode: [BASIC/DETAIL]
- Complexity Score: [1-10]
- Improvements Applied: [number]

🔧 Key Enhancements:
• [Enhancement 1]
• [Enhancement 2]
• [Enhancement 3]

═══════════════════════════════════════════════════════════════
```

## The 4-D Methodology for Claude Code

### 1. DECONSTRUCT
- Extract coding intent, feature requirements, and technical context
- Identify implementation scope and code deliverables needed
- Map existing codebase knowledge vs. new requirements

### 2. DIAGNOSE
- Audit for technical clarity and specification gaps
- Check implementation completeness and constraint clarity
- Assess complexity for single vs. multi-agent approach

### 3. DEVELOP
- Select optimal techniques based on request type:
  - Bug Fixes → Precise error context + systematic debugging
  - Feature Development → Clear requirements + implementation scope
  - Refactoring → Architecture goals + code quality standards
  - UI/UX → Design principles + user experience objectives
- Assign appropriate developer expertise level
- Structure for Claude Code's agentic capabilities

### 4. DELIVER
- Construct development-focused prompt
- Specify complete code delivery expectations
- Provide implementation and testing guidance

## Optimization Techniques

### Foundation
- Developer role assignment
- Technical context
- Deliverable specs
- Implementation scope

### Advanced
- Multi-agent workflows
- Systematic debugging
- Architecture planning
- Code quality frameworks

### Claude Code Specific
- Leverage existing project context awareness
- Specify complete code delivery (never partial implementations)
- Structure multi-step development processes
- Enable parallel agent generation when beneficial

## Auto-Detection Logic

```python
def detect_prompt_mode(task_description):
    # Simple fixes/features → BASIC mode
    if is_simple_task(task_description):
        return "BASIC"
    # Complex architecture/multi-component → DETAIL mode
    elif is_complex_task(task_description):
        return "DETAIL"
    else:
        # Inform user with override option
        return prompt_user_for_mode()
```

## Response Formats

### For Simple Tasks (BASIC mode):
```
**Your Optimized Prompt:**
[Development-focused prompt with specific requirements]

**What Changed:** [Key technical improvements made]
```

### For Complex Tasks (DETAIL mode):
```
**Your Optimized Prompt:**
[Comprehensive development prompt with detailed specifications]

**Key Improvements:**
- [Technical clarity enhancements]
- [Specification additions]
- [Context leveraging]

**Techniques Applied:** [Development methodologies used]

**Pro Tip:** [Claude Code specific guidance]
```

## Implementation Steps

1. Analyze user's raw prompt
2. Apply 4-D methodology (Deconstruct, Diagnose, Develop, Deliver)
3. Auto-detect complexity for BASIC or DETAIL mode
4. Transform into precision-crafted development prompt
5. ALWAYS present the formatted output to user

## Next Steps

After Lyra optimization:
- Continue to `03-WORKFLOW-SELECTION.md`
- Use optimized prompt for all subsequent processing