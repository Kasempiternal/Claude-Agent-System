# Tech Stack Profiles for analyzecc

This file contains predefined technology stack profiles used by the `/analyzecc` command to adapt the Claude Agent System to different project types.

## Language Detection Patterns

### Python
```yaml
python:
  extensions: [.py, .pyw, .pyi, .pyx]
  signature_files:
    - requirements.txt
    - setup.py
    - pyproject.toml
    - Pipfile
    - environment.yml
    - conda.yaml
  syntax_patterns:
    - "import "
    - "from .* import"
    - "def .*:"
    - "class .*:"
    - "__init__"
  ai_ml_indicators:
    - tensorflow
    - torch
    - keras
    - scikit-learn
    - pandas
    - numpy
    - jupyter
    - ".ipynb"
```

### JavaScript/TypeScript
```yaml
javascript:
  extensions: [.js, .jsx, .ts, .tsx, .mjs, .cjs]
  signature_files:
    - package.json
    - package-lock.json
    - yarn.lock
    - tsconfig.json
  syntax_patterns:
    - "const "
    - "let "
    - "var "
    - "import .* from"
    - "export "
    - "=>"
  framework_indicators:
    react: [react, react-dom, next, gatsby]
    vue: [vue, nuxt, quasar]
    angular: ["@angular/core", angular.json]
    node: [express, fastify, koa, nest]
```

### Ruby
```yaml
ruby:
  extensions: [.rb, .rake, .gemspec]
  signature_files:
    - Gemfile
    - Gemfile.lock
    - Rakefile
    - .ruby-version
  syntax_patterns:
    - "require "
    - "def "
    - "class "
    - "module "
    - "end$"
  framework_indicators:
    rails: [rails, activerecord, actionpack]
    sinatra: [sinatra]
    hanami: [hanami]
```

### Java
```yaml
java:
  extensions: [.java, .class, .jar]
  signature_files:
    - pom.xml
    - build.gradle
    - build.gradle.kts
    - settings.gradle
  syntax_patterns:
    - "public class"
    - "private "
    - "protected "
    - "import "
    - "@"
  framework_indicators:
    spring: [spring-boot, spring-core, spring-web]
    android: [android, androidx]
```

### Go
```yaml
go:
  extensions: [.go]
  signature_files:
    - go.mod
    - go.sum
  syntax_patterns:
    - "package "
    - "import ("
    - "func "
    - "type .* struct"
    - ":="
  framework_indicators:
    gin: [gin-gonic/gin]
    echo: [echo]
    fiber: [fiber]
```

## Technology Stack Profiles

### Python AI/ML Stack
```yaml
python_ai_ml:
  name: "Python AI/ML Development"
  language: python
  version_command: "python --version"
  commands:
    lint: "flake8 . && pylint src/"
    format: "black . && isort ."
    type_check: "mypy src/"
    test: "pytest tests/ -v"
    coverage: "pytest --cov=src tests/ --cov-report=html"
    notebook_test: "nbqa pytest notebooks/"
  file_patterns:
    test: "test_*.py or *_test.py"
    source: "src/**/*.py"
    notebooks: "notebooks/**/*.ipynb"
  common_structure:
    - models/
    - data/
    - notebooks/
    - src/
    - tests/
    - experiments/
  validation_rules:
    - "Assert model accuracy metrics"
    - "Validate data pipeline integrity"
    - "Check GPU memory usage"
    - "Verify reproducibility with seeds"
```

### JavaScript React Stack
```yaml
javascript_react:
  name: "JavaScript/TypeScript React"
  language: javascript
  version_command: "node --version"
  commands:
    lint: "eslint . --ext .js,.jsx,.ts,.tsx"
    format: "prettier --write ."
    type_check: "tsc --noEmit"
    test: "jest"
    coverage: "jest --coverage"
    build: "npm run build"
    dev: "npm run dev"
  file_patterns:
    test: "*.test.{js,jsx,ts,tsx} or *.spec.{js,jsx,ts,tsx}"
    source: "src/**/*.{js,jsx,ts,tsx}"
    components: "src/components/**/*.{jsx,tsx}"
  common_structure:
    - src/components/
    - src/hooks/
    - src/services/
    - src/utils/
    - public/
    - tests/
  validation_rules:
    - "Component props validation"
    - "Accessibility (a11y) checks"
    - "React hooks rules"
    - "No console.log in production"
```

### Ruby on Rails Stack
```yaml
ruby_rails:
  name: "Ruby on Rails"
  language: ruby
  version_command: "ruby --version"
  commands:
    lint: "rubocop"
    format: "rubocop -a"
    test: "bundle exec rspec"
    coverage: "bundle exec rspec --format RspecJunitFormatter"
    console: "rails console"
    server: "rails server"
    migrate: "rails db:migrate"
  file_patterns:
    test: "spec/**/*_spec.rb"
    source: "app/**/*.rb"
    models: "app/models/**/*.rb"
  common_structure:
    - app/models/
    - app/controllers/
    - app/views/
    - spec/
    - db/
    - config/
  validation_rules:
    - "Model validations"
    - "Controller strong parameters"
    - "Database indices"
    - "N+1 query detection"
```

### Go Microservices Stack
```yaml
go_microservices:
  name: "Go Microservices"
  language: go
  version_command: "go version"
  commands:
    lint: "golangci-lint run"
    format: "go fmt ./..."
    test: "go test ./..."
    coverage: "go test -cover ./..."
    build: "go build -o bin/app"
    mod: "go mod tidy"
  file_patterns:
    test: "*_test.go"
    source: "**/*.go"
    main: "cmd/**/main.go"
  common_structure:
    - cmd/
    - internal/
    - pkg/
    - api/
    - configs/
    - tests/
  validation_rules:
    - "Error handling checks"
    - "Goroutine leak detection"
    - "Interface compliance"
    - "Context propagation"
```

## Profile Selection Logic

```python
def select_profile(analysis_results):
    """Select the best matching profile based on analysis results"""
    
    # Check for AI/ML indicators in Python projects
    if analysis_results.language == "python":
        ml_libs = ["tensorflow", "torch", "keras", "sklearn"]
        if any(lib in analysis_results.dependencies for lib in ml_libs):
            return "python_ai_ml"
        elif "django" in analysis_results.dependencies:
            return "python_django"
        elif "flask" in analysis_results.dependencies:
            return "python_flask"
    
    # Check for frontend frameworks in JS projects
    elif analysis_results.language == "javascript":
        if "react" in analysis_results.dependencies:
            return "javascript_react"
        elif "vue" in analysis_results.dependencies:
            return "javascript_vue"
        elif "angular" in analysis_results.dependencies:
            return "javascript_angular"
        elif analysis_results.is_backend:
            return "javascript_node"
    
    # Default profiles by language
    return f"{analysis_results.language}_default"
```

## Custom Profile Extension

Users can add custom profiles in `.claude/custom-profiles.yaml`:

```yaml
custom_profiles:
  rust_wasm:
    name: "Rust WebAssembly"
    language: rust
    commands:
      lint: "cargo clippy"
      format: "cargo fmt"
      test: "cargo test"
      build_wasm: "wasm-pack build"
```