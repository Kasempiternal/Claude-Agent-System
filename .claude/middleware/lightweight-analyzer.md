# Lightweight Project Analyzer

## Purpose
This module provides fast, focused project analysis for first-run detection in `/systemcc`. Unlike the full analyzecc command, this performs only essential analysis to get started quickly.

## Analysis Phases (All Parallel)

### Phase 1: File System Scan (2-3 seconds)
```python
def scan_file_system():
    """Quick scan for project structure and size"""
    return {
        'total_files': count_files(),
        'file_extensions': get_extension_counts(),
        'directory_structure': get_top_level_dirs(),
        'project_size_mb': calculate_size(),
        'key_directories': find_source_dirs()
    }
```

### Phase 2: Tech Stack Detection (1-2 seconds)
```python
def detect_tech_stack():
    """Identify language, framework, and tools"""
    
    # Check for package files
    package_files = {
        'package.json': parse_npm_package,
        'requirements.txt': parse_python_requirements,
        'Gemfile': parse_ruby_gems,
        'go.mod': parse_go_modules,
        'Cargo.toml': parse_rust_cargo,
        'pom.xml': parse_java_maven,
        'build.gradle': parse_java_gradle
    }
    
    # Detect from found files
    for file, parser in package_files.items():
        if exists(file):
            return parser(file)
```

### Phase 3: Quick Pattern Recognition (2-3 seconds)
```python
def recognize_patterns():
    """Sample files to detect coding conventions"""
    
    # Get 5-10 representative files
    sample_files = get_sample_source_files(max=10)
    
    patterns = {
        'naming_convention': detect_naming_style(sample_files),
        'indent_style': detect_indentation(sample_files),
        'component_structure': detect_structure_pattern(sample_files),
        'test_pattern': detect_test_organization()
    }
    
    return patterns
```

### Phase 4: Command Detection (1 second)
```python
def detect_commands():
    """Find build, test, and run commands"""
    
    # Check package.json scripts
    if exists('package.json'):
        scripts = read_json('package.json').get('scripts', {})
        return extract_npm_commands(scripts)
    
    # Check for Makefile
    if exists('Makefile'):
        return parse_makefile_targets()
    
    # Default commands by language
    return get_default_commands(detected_language)
```

## Detection Strategies

### JavaScript/TypeScript Projects
```python
js_indicators = {
    'react': [
        'files': ['package.json contains react'],
        'imports': ['from "react"', "from 'react'"],
        'extensions': ['.jsx', '.tsx']
    ],
    'vue': [
        'files': ['package.json contains vue', '.vue files'],
        'patterns': ['<template>', '<script>', '<style>']
    ],
    'angular': [
        'files': ['angular.json', '@angular/core in package.json'],
        'patterns': ['@Component', '@Injectable']
    ],
    'node': [
        'files': ['no frontend framework', 'express/fastify/koa'],
        'patterns': ['app.listen', 'module.exports']
    ]
}
```

### Python Projects
```python
python_indicators = {
    'django': [
        'files': ['manage.py', 'settings.py', 'django in requirements'],
        'structure': ['apps/', 'templates/', 'static/']
    ],
    'flask': [
        'files': ['app.py', 'flask in requirements'],
        'patterns': ['@app.route', 'Flask(__name__)']
    ],
    'fastapi': [
        'files': ['main.py', 'fastapi in requirements'],
        'patterns': ['@app.get', '@app.post', 'FastAPI()']
    ],
    'ml_project': [
        'files': ['notebooks/', '.ipynb', 'tensorflow/pytorch/sklearn'],
        'patterns': ['import pandas', 'import numpy']
    ]
}
```

## Output Format

The analyzer creates a concise analysis result:

```yaml
# Generated analysis summary
project_analysis:
  timestamp: "2024-01-30T10:00:00Z"
  duration_ms: 4500
  
  tech_stack:
    language: "TypeScript"
    framework: "React"
    version: "18.2.0"
    ui_library: "Material-UI"
    state_management: "Redux Toolkit"
    build_tool: "Vite"
    test_runner: "Jest"
    
  project_info:
    type: "web-application"
    size: "medium"  # small/medium/large based on file count
    main_directories:
      - src/components
      - src/pages
      - src/services
      - src/hooks
      
  conventions:
    component_naming: "PascalCase"
    file_structure: "feature-based"
    css_approach: "CSS Modules"
    test_location: "alongside source"
    
  commands:
    dev: "npm run dev"
    build: "npm run build"
    test: "npm test"
    lint: "npm run lint"
    
  quick_insights:
    - "Uses TypeScript with strict mode"
    - "Has 85% test coverage setup"
    - "Follows feature-based architecture"
    - "Uses modern React patterns (hooks, functional components)"
```

## Speed Optimizations

1. **Parallel Execution**: All phases run simultaneously
2. **Smart Sampling**: Analyze only representative files
3. **Early Termination**: Stop when enough data collected
4. **Caching**: Store results to avoid re-analysis
5. **Minimal I/O**: Read only necessary files

## Integration with systemcc

```python
def handle_first_run_analysis():
    print("🔍 First time in this project - running analysis first...")
    
    # Start all analyzers in parallel
    with ThreadPoolExecutor(max_workers=4) as executor:
        future_fs = executor.submit(scan_file_system)
        future_tech = executor.submit(detect_tech_stack)
        future_patterns = executor.submit(recognize_patterns)
        future_commands = executor.submit(detect_commands)
        
        # Collect results
        results = {
            'file_system': future_fs.result(),
            'tech_stack': future_tech.result(),
            'patterns': future_patterns.result(),
            'commands': future_commands.result()
        }
    
    # Create analysis summary
    summary = create_analysis_summary(results)
    
    # Save to status file
    save_analysis_status(summary)
    
    # Display key findings
    display_analysis_results(summary)
    
    print("✅ Analysis complete! Now proceeding with your task...")
    
    return summary
```

## User Experience

```
User: /systemcc "add shopping cart feature"

Claude: 🔍 First time in this project - running analysis first...

        ⚡ Quick Analysis (4.2s):
        ├─ Language: TypeScript (React 18.2)
        ├─ Build: Vite + npm
        ├─ Testing: Jest with 82% coverage
        └─ Architecture: Feature-based structure
        
        📋 Detected Conventions:
        ├─ Components: PascalCase in src/components
        ├─ Hooks: useXxx pattern in src/hooks
        └─ API calls: Services in src/services
        
        ✅ Analysis complete! Now building your shopping cart feature...
        
        [Continues with implementation using detected patterns]
```

## Benefits

1. **Fast**: Complete analysis in under 5 seconds
2. **Focused**: Only gathers essential information
3. **Smart**: Detects patterns from minimal sampling
4. **Accurate**: Sufficient for proper workflow selection
5. **Transparent**: Shows what was detected

Remember: This lightweight analyzer ensures users can start working immediately while still benefiting from project-aware assistance!