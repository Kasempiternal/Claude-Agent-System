# Specification Gatherer

## Purpose
This middleware collects ALL necessary specifications upfront when `/systemcc` is invoked, reducing mid-execution interruptions and ensuring comprehensive requirements gathering. It provides an organized, category-based approach to understanding user needs.

## How It Works

When `/systemcc` detects a task that needs specifications, this gatherer:
1. Analyzes the task type to determine relevant question categories
2. Presents organized groups of questions upfront
3. Provides smart defaults based on project patterns
4. Collects all answers before workflow execution begins
5. Passes complete specifications to the workflow

## Question Categories

### 🎯 Feature Development
```
━━━ Feature Specifications ━━━
📋 Core Functionality:
   □ What is the primary purpose of this feature?
   □ Who are the target users? (admin/regular/guest/all)
   □ What are the key user actions?
   □ Success criteria for the feature?

🔗 Integration Requirements:
   □ Which existing systems need integration?
   □ API endpoints needed? (list or describe)
   □ Database changes required? (tables/fields)
   □ Third-party services? (payment/email/storage)

🎨 User Interface:
   □ UI type? (form/dashboard/list/modal/page)
   □ Mobile responsive required? (yes/no)
   □ Accessibility level? (WCAG AA/AAA)
   □ Brand/theme compliance needed?

Type answers or 'defaults' for standard implementation:
```

### 🔒 Security & Authentication
```
━━━ Security Requirements ━━━
🔐 Authentication:
   □ Auth method? (JWT/session/OAuth/multi-factor)
   □ User roles needed? (list roles)
   □ Permission levels? (read/write/admin)
   □ Session timeout requirements?

🛡️ Data Security:
   □ Sensitive data types? (PII/payment/health)
   □ Encryption requirements? (at-rest/in-transit)
   □ Audit trail needed? (yes/no)
   □ Compliance requirements? (GDPR/HIPAA/PCI)

Type answers or 'standard' for typical security setup:
```

### 🚀 Performance & Scale
```
━━━ Performance Specifications ━━━
📊 Expected Load:
   □ Concurrent users? (10/100/1000/10k+)
   □ Data volume? (records/files)
   □ Peak usage times?
   □ Geographic distribution?

⚡ Performance Targets:
   □ Page load time? (<1s/2s/3s)
   □ API response time? (ms)
   □ Offline capability? (yes/no)
   □ Caching strategy? (aggressive/moderate/minimal)

Type answers or 'standard' for typical web app performance:
```

### 🗄️ Data & Storage
```
━━━ Data Requirements ━━━
📁 Data Structure:
   □ Main entities/models? (list them)
   □ Relationships? (1-to-1/1-to-many/many-to-many)
   □ Data validation rules?
   □ Required fields vs optional?

💾 Storage Needs:
   □ Database type? (PostgreSQL/MySQL/MongoDB/existing)
   □ File storage? (local/S3/CDN)
   □ Backup requirements? (frequency/retention)
   □ Data migration from existing system?

Type answers or 'typical' for standard data setup:
```

### 🎨 UI/UX Preferences
```
━━━ UI/UX Specifications ━━━
🖼️ Visual Design:
   □ Design system? (Material/Bootstrap/custom/existing)
   □ Color scheme? (link or describe)
   □ Typography preferences?
   □ Icon set? (FontAwesome/Material/custom)

🔄 Interactions:
   □ Loading states? (spinners/skeletons/progress)
   □ Error handling? (inline/toast/modal)
   □ Success feedback? (how to show)
   □ Animation preferences? (none/subtle/rich)

Type answers or 'modern' for contemporary UI patterns:
```

### 🧪 Testing Requirements
```
━━━ Testing Specifications ━━━
✅ Test Coverage:
   □ Unit test coverage target? (80%/90%/100%)
   □ Integration tests needed? (yes/no)
   □ E2E test scenarios? (list critical paths)
   □ Performance benchmarks?

🔍 Quality Gates:
   □ Code review required? (yes/no)
   □ Automated CI/CD? (yes/no)
   □ Staging environment? (yes/no)
   □ User acceptance testing? (yes/no)

Type answers or 'standard' for typical testing setup:
```

## Smart Defaults System

The gatherer provides intelligent defaults based on:
1. **Project Analysis**: Existing patterns in codebase
2. **Common Practices**: Industry standards
3. **Previous Choices**: User's past preferences
4. **Context Awareness**: Task type and complexity

### Default Examples
```
Feature Type: CRUD Operations
- Database: [Detected from project]
- Auth: JWT with refresh tokens
- UI: Responsive with existing theme
- Testing: 80% coverage with E2E
- Performance: <2s load, <200ms API

Feature Type: Dashboard
- Charts: Chart.js or existing library
- Real-time: WebSocket if needed
- Export: CSV and PDF
- Mobile: Fully responsive
- Refresh: Auto-refresh option
```

## Integration with Workflows

### 1. Early Invocation
```python
def handle_systemcc(task_description):
    # Analyze task
    task_type = analyze_task_type(task_description)
    
    # Gather specs if needed
    if needs_specifications(task_type):
        specs = specification_gatherer.collect(task_type)
        context.update(specs)
    
    # Continue with workflow
    execute_workflow(task_description, context)
```

### 2. Context Passing
All gathered specifications are passed to agents:
- PLANNER uses specs for comprehensive planning
- EXECUTER implements according to specs
- TESTER validates against requirements
- DOCUMENTER records decisions

### 3. Progressive Disclosure
Only shows relevant categories:
- Simple fix: Minimal questions
- New feature: Comprehensive gathering
- Refactor: Focus on technical specs
- Bug fix: Focus on expected behavior

## User Experience Features

### 1. Skip Options
```
━━━ Quick Options ━━━
• Type 'defaults' - Use all smart defaults
• Type 'minimal' - Basic implementation only
• Type 'standard' - Industry best practices
• Type 'premium' - All features enabled
• Type answers for custom configuration
```

### 2. Grouped Input
Users can answer multiple questions at once:
```
User: "JWT auth, PostgreSQL, 90% test coverage, Material UI"
System: ✓ Understood. Applied to relevant categories.
```

### 3. Clarification Help
Each question includes help when needed:
```
□ Compliance requirements? (GDPR/HIPAA/PCI)
  ℹ️ GDPR: EU data protection
  ℹ️ HIPAA: Health information
  ℹ️ PCI: Payment card data
```

## Benefits

1. **Fewer Interruptions**: Get all questions upfront
2. **Better Planning**: Complete specs enable better architecture
3. **Faster Execution**: No pausing mid-implementation
4. **Comprehensive Coverage**: Nothing forgotten
5. **Smart Defaults**: Quick start with intelligent suggestions
6. **Organized Approach**: Logical grouping of related questions

## Example Usage

```
User: /systemcc "build user management system"

Claude: 🎯 I'll help you build a user management system. Let me gather specifications first:

━━━ Feature Specifications ━━━
📋 Core Functionality:
   □ User operations needed? (create/read/update/delete/all)
   □ User fields? (email, name, role, etc.)
   □ Self-registration allowed? (yes/no)
   □ Admin approval required? (yes/no)

🔐 Authentication:
   □ Auth method? (JWT/session/OAuth)
   □ Password requirements? (length, complexity)
   □ 2FA support? (yes/no)
   □ Social login? (Google/GitHub/none)

Type answers or 'standard' for typical user management:

User: all operations, email name role avatar, yes self-register, no approval, JWT, standard password, no 2FA, Google login

Claude: ✓ Got it! I'll build a comprehensive user management system with:
- Full CRUD operations
- JWT authentication with Google OAuth
- Self-registration enabled
- Standard security practices

🚀 Starting implementation...
[Proceeds with full workflow automatically]
```

## Implementation Notes

1. **Don't Over-Ask**: Only show relevant categories
2. **Respect Time**: Allow quick defaults for experienced users
3. **Learn Patterns**: Remember preferences for future
4. **Stay Flexible**: Allow changes during execution if needed
5. **Clear Communication**: Explain why each question matters

Remember: The goal is to gather everything needed upfront while respecting the user's time and expertise level.