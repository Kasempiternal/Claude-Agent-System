# Analysis Status Tracker

## Purpose
This middleware tracks whether a project has been analyzed, eliminating the need for users to manually run `/analyze`. The system automatically detects first-time usage and runs analysis seamlessly.

## How It Works

1. **Status File Location**: `ClaudeFiles/.analysis-status`
2. **Automatic Detection**: When `/systemcc` runs, it checks for this file
3. **First-Run Behavior**: If not found, automatically runs analysis before proceeding
4. **Subsequent Runs**: If found, skips analysis for faster execution

## Status File Format

```yaml
# ClaudeFiles/.analysis-status
analyzed: true
timestamp: 2024-01-30T10:00:00Z
version: 1.0
project_info:
  type: "web-application"
  language: "TypeScript"
  framework: "React"
  build_tool: "Vite"
  test_framework: "Jest"
  package_manager: "npm"
analysis_results:
  total_files: 156
  source_files: 89
  test_files: 34
  config_files: 12
  documentation_files: 21
conventions_detected:
  naming: "PascalCase components, camelCase functions"
  structure: "feature-based organization"
  testing: "test files alongside source"
last_updated: 2024-01-30T10:00:00Z
```

## Implementation Logic

```python
def check_analysis_status():
    status_file = "ClaudeFiles/.analysis-status"
    
    if not exists(status_file):
        # First time in project
        print("🔍 First time in this project - running analysis first...")
        
        # Run lightweight analysis
        analysis_results = run_project_analysis()
        
        # Create status file
        create_status_file(analysis_results)
        
        print("✅ Analysis complete! Now proceeding with your task...")
        return True
    else:
        # Already analyzed
        status = read_status_file(status_file)
        
        # Optional: Check if re-analysis needed (e.g., major changes)
        if should_reanalyze(status):
            print("🔄 Project has changed significantly - updating analysis...")
            update_analysis(status)
        
        return False
```

## Lightweight Analysis Process

The first-run analysis is optimized for speed while gathering essential information:

### 1. Quick File Scan
```python
def quick_scan():
    return {
        'file_types': count_file_extensions(),
        'project_size': get_directory_size(),
        'key_files': find_config_files(),
        'source_directories': identify_source_dirs()
    }
```

### 2. Tech Stack Detection
```python
def detect_tech_stack():
    # Check package.json, requirements.txt, Gemfile, etc.
    package_files = find_package_files()
    
    # Identify primary language
    language = detect_primary_language()
    
    # Detect frameworks
    framework = detect_framework(package_files, language)
    
    return {
        'language': language,
        'framework': framework,
        'dependencies': extract_key_dependencies(package_files)
    }
```

### 3. Convention Detection
```python
def detect_conventions():
    # Sample a few files to detect patterns
    sample_files = get_sample_files(limit=10)
    
    return {
        'naming': analyze_naming_patterns(sample_files),
        'structure': analyze_directory_structure(),
        'code_style': detect_code_style(sample_files)
    }
```

## Re-analysis Triggers

The system may suggest re-analysis when:
- Major framework version changes detected
- Significant file structure changes (>30% different)
- New major dependencies added
- Manual request via `/systemcc --reanalyze`

## User Experience

### First Run
```
User: /systemcc "add user authentication"

Claude: 🔍 First time in this project - running analysis first...
        
        📊 Quick Analysis Results:
        - Language: TypeScript
        - Framework: React 18.2
        - Build Tool: Vite
        - Testing: Jest + React Testing Library
        
        ✅ Analysis complete! Now working on your authentication feature...
        
        [Continues with task execution]
```

### Subsequent Runs
```
User: /systemcc "fix navigation menu"

Claude: [Proceeds directly with task - no analysis message]
```

### Manual Re-analysis
```
User: /systemcc --reanalyze "update to new coding standards"

Claude: 🔄 Re-analyzing project...
        
        📊 Updated Analysis:
        - New patterns detected
        - Convention changes noted
        - Dependencies updated
        
        ✅ Analysis updated! Now applying new coding standards...
```

## Benefits

1. **Zero Learning Curve**: Users only need one command
2. **Automatic Optimization**: Project-specific settings applied automatically
3. **Fast Subsequent Runs**: Analysis cached for speed
4. **Smart Updates**: Re-analyzes only when needed
5. **Transparent Process**: Users see what's happening

## Integration Points

- **Project Memory**: Analysis results feed into project memory system
- **Workflow Selection**: Analysis data improves workflow decisions
- **Convention Application**: Detected patterns automatically applied
- **Tool Detection**: Build/test commands auto-configured

## Privacy & Storage

- Status file stored locally in ClaudeFiles/
- Can be deleted to force re-analysis
- Never shared between projects
- Respects .gitignore (add `ClaudeFiles/` to .gitignore)

Remember: This makes the Claude Agent System truly zero-configuration - just run `/systemcc` and everything else happens automatically!