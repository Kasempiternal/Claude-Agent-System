# /analyzecc - Project Analysis & Auto-Adaptation Command

## Purpose
The `/analyzecc` command automatically analyzes your project and adapts the Claude Agent System to match your specific tech stack. It detects languages, frameworks, tools, and patterns, then updates agent documentation to provide stack-specific guidance.

## How It Works

When you run `/analyzecc`, the system:

1. **Launches Parallel Analysis Agents**:
   - Agent A: Language Detection
   - Agent B: Framework & Dependencies
   - Agent C: Code Patterns & Tools
   - Agent D: Project Structure

2. **Consolidates Findings** into a tech stack profile

3. **Updates Agent Files** with stack-specific:
   - Commands (lint, test, build)
   - Examples in your language
   - Best practices for your framework
   - Validation rules

4. **Saves Configuration** for future sessions

## Usage

```bash
/analyzecc
# Analyzes current project and adapts agent system
```

## Implementation Instructions

### Phase 1: Parallel Analysis

Launch 4 agents simultaneously to analyze different aspects:

```python
agents = {
    'A': analyze_languages(),     # File extensions, syntax
    'B': analyze_dependencies(),   # Package files, frameworks
    'C': analyze_patterns(),       # Code style, testing
    'D': analyze_structure()       # Directory layout, architecture
}
```

### Phase 2: Tech Stack Detection

#### Language Detection (Agent A)
```python
language_indicators = {
    'python': {
        'extensions': ['.py', '.pyw', '.pyi'],
        'files': ['requirements.txt', 'setup.py', 'pyproject.toml'],
        'patterns': ['import ', 'from ', 'def ', 'class ']
    },
    'javascript': {
        'extensions': ['.js', '.jsx', '.ts', '.tsx'],
        'files': ['package.json', 'node_modules'],
        'patterns': ['const ', 'import ', 'export ', 'function ']
    },
    'ruby': {
        'extensions': ['.rb', '.rake'],
        'files': ['Gemfile', 'Rakefile'],
        'patterns': ['require ', 'def ', 'class ', 'module ']
    }
}
```

#### Framework Detection (Agent B)
```python
framework_indicators = {
    'python': {
        'django': ['django', 'manage.py', 'settings.py'],
        'flask': ['flask', 'app.py'],
        'fastapi': ['fastapi', 'uvicorn'],
        'tensorflow': ['tensorflow', 'keras', '.h5'],
        'pytorch': ['torch', 'torchvision', '.pth']
    },
    'javascript': {
        'react': ['react', 'react-dom', '.jsx'],
        'vue': ['vue', '.vue', 'vuex'],
        'angular': ['@angular/core', 'angular.json'],
        'nextjs': ['next', 'next.config.js']
    }
}
```

### Phase 3: Profile Matching

Match detected stack to predefined profiles:

```yaml
profiles:
  python-ai:
    name: "Python AI/ML"
    language: "Python"
    frameworks: ["tensorflow", "pytorch", "keras"]
    testing: "pytest"
    linting: "flake8"
    formatting: "black"
    
  javascript-react:
    name: "JavaScript React"
    language: "JavaScript/TypeScript"
    framework: "React"
    testing: "jest"
    linting: "eslint"
    building: "vite"
```

### Phase 4: File Updates

Update agent files with detected stack:

#### Files to Update:
1. `.claude/complete-system/verifier-agent.md`
   - Linting commands
   - Type checking commands
   - Build verification

2. `.claude/complete-system/tester-agent.md`
   - Test runner commands
   - Coverage tools
   - Testing patterns

3. `.claude/complete-system/executer-agent.md`
   - Code examples in detected language
   - Import patterns
   - Common patterns

4. `.agent-os/standards/tech-stack.md`
   - Complete tech stack documentation
   - Version information
   - Dependencies

### Phase 5: Update Templates

#### Example: Updating Linting Commands

**Before (Generic)**:
```bash
npm run lint
npm run type-check
```

**After (Python)**:
```bash
flake8 .
mypy src/
black --check .
```

**After (Ruby)**:
```bash
rubocop
reek
bundle exec rspec
```

### Phase 6: Safety & Validation

1. **Backup Original Files**:
   ```bash
   cp -r .claude .claude.backup-[timestamp]
   ```

2. **Show Detected Stack**:
   ```
   Detected Stack:
   - Language: Python 3.9
   - Type: AI/ML Project
   - Frameworks: TensorFlow 2.13, Keras
   - Testing: pytest
   - Proceed with adaptation? (y/n)
   ```

3. **Display Changes**:
   ```diff
   - npm run test
   + pytest tests/ -v
   ```

## Output Format

```markdown
## 🔍 Project Analysis Complete

### Detected Stack
- **Language**: Python 3.9
- **Project Type**: AI/ML Application
- **Frameworks**: TensorFlow, Keras, scikit-learn
- **Testing**: pytest
- **Linting**: flake8, mypy
- **Notebooks**: Jupyter

### Agents Updated
✅ Verifier Agent - Python linting commands
✅ Tester Agent - pytest configuration  
✅ Executer Agent - Python examples
✅ Tech Stack - AI/ML dependencies

### Custom Detections
- Found GPU training setup (CUDA)
- Detected data pipeline in `data/`
- Model checkpoints in `models/`

Your agent system is now optimized for Python AI development!
```

## Integration with systemcc

After running `/analyzecc`, the `/systemcc` command will:
- Use adapted validation rules
- Suggest framework-specific patterns
- Run correct test/lint commands
- Provide relevant examples

## Supported Stacks

Currently optimized for:
- Python (AI/ML, Django, Flask, FastAPI)
- JavaScript (React, Vue, Angular, Node.js)
- Ruby (Rails, Sinatra)
- Java (Spring, Maven, Gradle)
- Go (Standard library, Gin, Echo)
- Rust (Cargo, Actix, Rocket)
- PHP (Laravel, Symfony)
- C# (.NET Core, ASP.NET)

## Update Mechanism

The command updates agent files by replacing placeholder sections:

```markdown
<!-- ANALYZECC:LINT_COMMAND -->
npm run lint
<!-- /ANALYZECC:LINT_COMMAND -->
```

These placeholders are replaced with stack-specific commands:
- `LINT_COMMAND` - Linting command for your language
- `TEST_COMMAND` - Test runner command
- `TYPE_CHECK_COMMAND` - Type checking command
- `FORMAT_COMMAND` - Code formatting command

## Safety Features

1. **Backup Creation**: Original files are backed up before updates
2. **Confirmation Prompt**: Shows detected stack and asks for confirmation
3. **Profile Storage**: Saves configuration for consistency
4. **Rollback Option**: Can restore from backup if needed