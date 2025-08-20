# Project Analyzer: Multi-Agent Stack Detection

**Target:** Current project directory for comprehensive tech stack analysis
**Scope:** Deploy four specialized agents for parallel project analysis

## Agent Architecture

### Agent A (Language Analyst)
- **Role:** Primary language detection and version identification
- **Responsibilities:**
  - Analyze file extensions distribution
  - Detect language-specific syntax patterns
  - Identify language version from config files
  - Calculate language dominance percentages

### Agent B (Dependency Detective)
- **Role:** Framework and dependency analysis
- **Responsibilities:**
  - Parse package manager files (package.json, requirements.txt, Gemfile, etc.)
  - Identify frameworks and their versions
  - Detect AI/ML libraries for ML projects
  - Map dependency relationships

### Agent C (Pattern Scout)
- **Role:** Code patterns and development tools detection
- **Responsibilities:**
  - Identify testing frameworks and patterns
  - Detect linting and formatting tools
  - Analyze code organization patterns
  - Find build and deployment configurations

### Agent D (Structure Mapper)
- **Role:** Project architecture and structure analysis
- **Responsibilities:**
  - Map directory structure and conventions
  - Identify architectural patterns (MVC, microservices, etc.)
  - Detect special directories (models/, components/, etc.)
  - Analyze project scale and complexity

## Execution Protocol

### Phase 1: Parallel Analysis (All Agents)

**Agent A Tasks:**
```python
file_extensions = count_extensions(project_root)
primary_language = detect_primary_language(file_extensions)
syntax_patterns = analyze_code_patterns(sample_files)
version_info = extract_version_info(config_files)
```

**Agent B Tasks:**
```python
package_files = find_package_files()
dependencies = parse_dependencies(package_files)
frameworks = identify_frameworks(dependencies)
ml_libraries = detect_ml_stack(dependencies)
```

**Agent C Tasks:**
```python
test_framework = find_testing_setup()
lint_config = detect_linting_tools()
build_tools = identify_build_system()
ci_cd_config = find_ci_configuration()
```

**Agent D Tasks:**
```python
dir_structure = map_directory_tree()
special_dirs = identify_special_folders()
architecture = infer_architecture_pattern()
project_scale = calculate_project_metrics()
```

### Phase 2: Data Consolidation

Merge findings from all agents into unified tech stack profile:

```yaml
detected_stack:
  language:
    primary: "python"
    version: "3.9+"
    confidence: 0.95
  
  type: "ai_ml_project"
  
  frameworks:
    - name: "tensorflow"
      version: "2.13.0"
      purpose: "deep_learning"
    - name: "fastapi"
      version: "0.100.0"
      purpose: "api_framework"
  
  testing:
    framework: "pytest"
    coverage: "pytest-cov"
    
  linting:
    - "flake8"
    - "black"
    - "mypy"
    
  structure:
    pattern: "ml_pipeline"
    special_dirs:
      - "models/"
      - "notebooks/"
      - "data/"
```

## Tech Stack Profiles

### Python AI/ML Profile
```python
PYTHON_AI_PROFILE = {
    "commands": {
        "lint": "flake8 . && black --check .",
        "format": "black .",
        "type_check": "mypy src/",
        "test": "pytest tests/ -v",
        "test_coverage": "pytest --cov=src tests/"
    },
    "patterns": {
        "imports": "import numpy as np\nimport pandas as pd\nimport tensorflow as tf",
        "testing": "def test_model_accuracy():\n    assert model.evaluate(X_test, y_test)[1] > 0.8",
        "structure": ["models/", "data/", "notebooks/", "src/", "tests/"]
    }
}
```

### JavaScript React Profile
```javascript
JAVASCRIPT_REACT_PROFILE = {
    "commands": {
        "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
        "format": "prettier --write .",
        "type_check": "tsc --noEmit",
        "test": "jest",
        "test_coverage": "jest --coverage"
    },
    "patterns": {
        "imports": "import React from 'react';\nimport { render } from '@testing-library/react';",
        "testing": "test('renders learn react link', () => {\n  render(<App />);\n});",
        "structure": ["src/components/", "src/hooks/", "src/services/", "public/"]
    }
}
```

### Ruby Rails Profile
```ruby
RUBY_RAILS_PROFILE = {
    "commands": {
        "lint": "rubocop",
        "format": "rubocop -a",
        "test": "bundle exec rspec",
        "test_coverage": "bundle exec rspec --format RspecJunitFormatter --out rspec.xml"
    },
    "patterns": {
        "imports": "require 'rails_helper'",
        "testing": "RSpec.describe User, type: :model do\n  it { should validate_presence_of(:email) }\nend",
        "structure": ["app/models/", "app/controllers/", "app/views/", "spec/"]
    }
}
```

## File Update Strategy

### Dynamic Replacement Patterns

For each agent file, define replacement mappings:

```python
REPLACEMENTS = {
    "verifier-agent.md": {
        "npm run lint": "{profile.commands.lint}",
        "npm run type-check": "{profile.commands.type_check}",
        "npm run test": "{profile.commands.test}"
    },
    "tester-agent.md": {
        "jest": "{profile.testing.framework}",
        "npm test": "{profile.commands.test}",
        "@testing-library/react": "{profile.testing.library}"
    }
}
```

### Safe Update Process

1. **Create Backup**:
   ```bash
   cp -r .claude .claude.backup-$(date +%Y%m%d-%H%M%S)
   ```

2. **Generate Diffs**:
   ```diff
   - npm run lint
   + flake8 . && black --check .
   ```

3. **Apply Updates** with confirmation

4. **Verify** updates don't break existing functionality

## Integration Points

### With systemcc
- Check for `.claude/.analyzecc-profile.json`
- Use profile-specific commands and patterns
- Adapt validation rules to detected stack

### With Agent OS
- Update `workflows/agent-os/standards/tech-stack.md`
- Adapt code examples in standards
- Align with detected patterns

## Output Report Template

```markdown
# Project Analysis Report

## Detected Technology Stack

**Language**: {language} {version}
**Project Type**: {project_type}
**Confidence**: {confidence}%

### Frameworks & Libraries
{framework_list}

### Development Tools
- **Testing**: {test_framework}
- **Linting**: {lint_tools}
- **Formatting**: {formatters}
- **Build**: {build_tools}

### Project Structure
- **Pattern**: {architecture_pattern}
- **Scale**: {loc} lines of code, {file_count} files
- **Special Directories**: {special_dirs}

## Agent System Updates

### Files Updated
✅ complete-system/verifier-agent.md - {language} validation
✅ complete-system/tester-agent.md - {test_framework} configuration
✅ complete-system/executer-agent.md - {language} examples
✅ workflows/agent-os/standards/tech-stack.md - Full stack documentation

### Command Adaptations
- Lint: `{lint_command}`
- Test: `{test_command}`
- Build: `{build_command}`

Your Claude Agent System is now optimized for {stack_name} development!
```