# Project Memory System

## Purpose
This middleware enables Claude to learn and remember patterns, preferences, and conventions from your project over time. It makes the system more intelligent by adapting to your specific codebase and development style.

## How It Works

The Project Memory System operates at multiple levels:
1. **Convention Detection**: Identifies coding patterns and standards
2. **Preference Tracking**: Remembers user choices and decisions
3. **Pattern Learning**: Recognizes recurring solutions and approaches
4. **Relationship Mapping**: Understands component dependencies
5. **Historical Context**: Maintains awareness of past changes

## Memory Categories

### 🎨 Code Conventions
```yaml
detected_conventions:
  naming:
    components: PascalCase        # Button, UserCard
    hooks: camelCase with 'use'   # useAuth, useData
    services: camelCase           # authService, apiService
    constants: UPPER_SNAKE        # MAX_RETRIES, API_URL
  
  file_structure:
    components: src/components/{Component}/{Component}.tsx
    tests: __tests__/{component}.test.ts
    styles: CSS Modules ({Component}.module.css)
  
  patterns:
    state_management: Redux Toolkit
    data_fetching: React Query
    styling: CSS Modules + Tailwind
    testing: Jest + React Testing Library
```

### 🔧 Technical Preferences
```yaml
user_preferences:
  database: PostgreSQL          # Chosen in 3 previous tasks
  auth_method: JWT             # Consistent choice
  ui_framework: Material-UI    # Detected from imports
  error_handling: Try-catch with logger
  validation: Zod schemas
  
  deployment:
    platform: Vercel
    ci_cd: GitHub Actions
    environment_vars: .env.local
```

### 🔄 Solution Patterns
```yaml
recurring_solutions:
  pagination:
    approach: Cursor-based
    implementation: usePagination hook
    last_used: 2024-01-15
    
  file_upload:
    service: AWS S3
    pattern: Presigned URLs
    validation: Client + server side
    
  real_time:
    technology: Socket.io
    pattern: Event-based rooms
    reconnection: Exponential backoff
```

### 🔗 Component Relationships
```yaml
dependency_map:
  AuthContext:
    used_by: [Header, ProtectedRoute, UserProfile]
    provides: [user, login, logout, isAuthenticated]
    
  ApiService:
    consumers: [All data hooks]
    dependencies: [AuthContext, ConfigContext]
    patterns: [Retry logic, Error transformation]
```

## Memory Storage

All project memory is stored in `.claude/files/memory/`:

```
.claude/files/
└── memory/
    ├── CLAUDE-patterns.md       # Detected code conventions and patterns
    ├── CLAUDE-decisions.md      # User preferences and architecture decisions
    ├── CLAUDE-activeContext.md  # Current session state
    ├── CLAUDE-troubleshooting.md # Solutions database
    └── CLAUDE-config-variables.md  # Configuration variables reference
```

## Intelligent Features

### 1. Pattern Recognition
```python
def detect_patterns(codebase):
    patterns = {
        'naming_conventions': analyze_naming_patterns(),
        'import_structure': analyze_import_patterns(),
        'component_patterns': analyze_component_structure(),
        'test_patterns': analyze_test_approaches(),
        'error_patterns': analyze_error_handling()
    }
    return patterns
```

### 2. Preference Learning
```python
def learn_preference(category, choice, context):
    # Track user choices
    preferences[category].append({
        'choice': choice,
        'context': context,
        'timestamp': now(),
        'frequency': calculate_frequency(category, choice)
    })
    
    # Identify consistent preferences
    if is_consistent_choice(category, choice):
        set_default_preference(category, choice)
```

### 3. Smart Suggestions
```python
def suggest_based_on_memory(task_context):
    suggestions = {
        'conventions': match_conventions(task_context),
        'similar_solutions': find_similar_implementations(task_context),
        'preferred_tools': get_user_preferences(task_context),
        'related_components': find_related_work(task_context)
    }
    return prioritize_suggestions(suggestions)
```

## Integration Examples

### 1. Convention-Aware Implementation
```
Claude: I noticed you consistently use:
- PascalCase for components
- CSS Modules for styling
- Custom hooks starting with 'use'

I'll follow these patterns in the implementation.
```

### 2. Preference-Based Defaults
```
Claude: Based on your previous choices:
- Database: PostgreSQL ✓ (used in last 3 features)
- Authentication: JWT ✓ (your standard)
- UI Components: Material-UI ✓ (detected in project)

Using these defaults unless you specify otherwise.
```

### 3. Pattern Reuse
```
Claude: I found a similar pagination implementation from last week.
Would you like me to:
1. Reuse the cursor-based approach
2. Implement a different pattern
3. Enhance the existing pattern
```

### 4. Relationship Awareness
```
Claude: ⚠️ Modifying AuthContext will affect:
- Header component (auth status display)
- ProtectedRoute (route guards)
- 12 other components using useAuth hook

I'll ensure backward compatibility.
```

## Memory Updates

### Automatic Learning
The system automatically learns from:
- Code analysis during `/analyze`
- Implementation choices during tasks
- User corrections and preferences
- Successful pattern applications

### Manual Teaching
Users can explicitly teach the system:
```
User: "Always use PostgreSQL for new services"
Claude: ✓ Noted. Setting PostgreSQL as default database choice.

User: "Our convention is to put all types in a types/ folder"
Claude: ✓ Updated file structure conventions.
```

## Benefits

1. **Consistency**: Maintains project conventions automatically
2. **Efficiency**: Reduces repetitive decisions
3. **Intelligence**: Suggests proven solutions
4. **Awareness**: Understands impact of changes
5. **Personalization**: Adapts to team preferences

## Privacy & Control

- All memory stored locally in .claude/files/memory/
- Can be reviewed and edited manually
- Can be cleared with `/clear-memory`
- Never shared across projects
- Respects .gitignore patterns

## Example Memory Usage

```
User: /systemcc "add user notifications"

Claude: 🧠 Checking project memory...

📋 Found relevant patterns:
- Previous notification system using Socket.io
- Toast component for UI notifications
- Notification preferences in user settings

🎯 Applying your conventions:
- Component: src/components/Notification/Notification.tsx
- Hook: useNotifications
- Service: notificationService
- Tests: __tests__/notification.test.ts

💡 Suggestion: Last time you implemented real-time features, you used:
- Socket.io with room-based events
- Redis for message queuing
- Exponential backoff for reconnection

Shall I follow the same pattern? (yes/modify/new approach)
```

## Future Enhancements

1. **Cross-Project Learning**: Optional shared patterns
2. **Team Conventions**: Shared team preferences
3. **AI Pattern Suggestions**: ML-based pattern matching
4. **Performance Tracking**: Learn from performance outcomes
5. **Refactoring Assistant**: Suggest improvements based on patterns

Remember: The more you use the system, the smarter it becomes about your specific project and preferences!