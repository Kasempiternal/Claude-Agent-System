# Build Configuration Detector Middleware

## Purpose
Automatically detect and apply build configuration rules (linting, formatting, testing) from project files to ensure all generated code complies with project standards and CI/CD pipelines.

## Detection Priority

The detector scans for configuration files in this order:

1. **Makefile** - Primary source for build commands
2. **CI/CD Files** - `.gitlab-ci.yml`, `.github/workflows/*.yml`
3. **Language-Specific Configs** - `pyproject.toml`, `package.json`, `setup.cfg`
4. **Tool Configs** - `.pre-commit-config.yaml`, `tox.ini`, `.eslintrc`
5. **Editor Configs** - `.editorconfig`, `.prettierrc`

## Detection Engine

```python
def detect_build_configuration():
    """
    Scans project for build configuration and extracts code quality rules.
    Returns comprehensive ruleset for code generation.
    """

    config = {
        'formatters': {},
        'linters': {},
        'test_runners': {},
        'build_commands': {},
        'code_style': {},
        'pipeline_stages': []
    }

    # Priority 1: Makefile parsing
    if exists('Makefile'):
        config.update(parse_makefile())

    # Priority 2: CI/CD configurations
    if exists('.gitlab-ci.yml'):
        config.update(parse_gitlab_ci())
    elif exists('.github/workflows'):
        config.update(parse_github_actions())

    # Priority 3: Language configs
    config.update(detect_language_specific_configs())

    # Priority 4: Tool configurations
    config.update(detect_tool_configs())

    return config
```

## Makefile Parser

```python
def parse_makefile(path='Makefile'):
    """
    Extracts formatting, linting, and testing rules from Makefile.
    """
    rules = {
        'formatters': {},
        'linters': {},
        'test_runners': {}
    }

    makefile_content = read_file(path)

    # Detect Python formatters
    if 'black' in makefile_content:
        rules['formatters']['black'] = extract_black_config(makefile_content)
        # Example: --line-length 100

    if 'isort' in makefile_content:
        rules['formatters']['isort'] = extract_isort_config(makefile_content)
        # Example: --profile black --multi-line 3

    # Detect Python linters
    if 'flake8' in makefile_content:
        rules['linters']['flake8'] = extract_flake8_config(makefile_content)
        # Example: --ignore E501,E203,W503 --max-line-length=100

    if 'mypy' in makefile_content:
        rules['linters']['mypy'] = extract_mypy_config(makefile_content)
        # Example: --ignore-missing-imports --no-strict-optional

    # Detect JavaScript tools
    if 'prettier' in makefile_content:
        rules['formatters']['prettier'] = extract_prettier_config(makefile_content)

    if 'eslint' in makefile_content:
        rules['linters']['eslint'] = extract_eslint_config(makefile_content)

    # Detect test runners
    if 'pytest' in makefile_content:
        rules['test_runners']['pytest'] = extract_pytest_config(makefile_content)

    if 'jest' in makefile_content:
        rules['test_runners']['jest'] = extract_jest_config(makefile_content)

    return rules
```

## Configuration Extraction Examples

### Python Configuration
```python
def extract_python_config(makefile_content):
    """
    Example extraction for Python projects.
    """
    config = {}

    # Black configuration
    black_match = re.search(r'black\s+(.+?)(?:\n|$)', makefile_content)
    if black_match:
        flags = black_match.group(1)
        if '--line-length' in flags:
            line_length = re.search(r'--line-length\s+(\d+)', flags)
            config['line_length'] = int(line_length.group(1))
        if '--check' in flags:
            config['check_only'] = True

    # Isort configuration
    isort_match = re.search(r'isort\s+(.+?)(?:\n|$)', makefile_content)
    if isort_match:
        flags = isort_match.group(1)
        if '--profile' in flags:
            profile = re.search(r'--profile\s+(\w+)', flags)
            config['isort_profile'] = profile.group(1)
        if '--multi-line' in flags:
            multi_line = re.search(r'--multi-line\s+(\d+)', flags)
            config['multi_line_output'] = int(multi_line.group(1))

    # Flake8 configuration
    flake8_match = re.search(r'flake8\s+(.+?)(?:\n|$)', makefile_content)
    if flake8_match:
        flags = flake8_match.group(1)
        if '--ignore' in flags:
            ignore = re.search(r'--ignore\s+([A-Z0-9,]+)', flags)
            config['flake8_ignore'] = ignore.group(1).split(',')
        if '--max-line-length' in flags:
            max_length = re.search(r'--max-line-length[=\s]+(\d+)', flags)
            config['max_line_length'] = int(max_length.group(1))
        if '--exclude' in flags:
            exclude = re.search(r'--exclude\s+(\S+)', flags)
            config['exclude_paths'] = exclude.group(1).split(',')

    return config
```

### JavaScript Configuration
```python
def extract_javascript_config(package_json):
    """
    Extract linting and formatting rules from package.json scripts.
    """
    config = {}
    scripts = package_json.get('scripts', {})

    # Prettier detection
    if any('prettier' in s for s in scripts.values()):
        prettier_cmd = next(s for s in scripts.values() if 'prettier' in s)
        config['prettier'] = parse_prettier_flags(prettier_cmd)

    # ESLint detection
    if any('eslint' in s for s in scripts.values()):
        eslint_cmd = next(s for s in scripts.values() if 'eslint' in s)
        config['eslint'] = parse_eslint_flags(eslint_cmd)

    return config
```

## Integration with Code Generation

### Apply Rules to Generated Code

```python
def apply_build_config_to_code(code, language, config):
    """
    Ensures generated code follows detected build configuration.
    """
    if language == 'python':
        # Apply black formatting rules
        if 'line_length' in config:
            code = format_with_line_length(code, config['line_length'])

        # Apply isort rules
        if 'isort_profile' in config:
            code = sort_imports_with_profile(code, config['isort_profile'])

        # Ensure flake8 compliance
        if 'flake8_ignore' in config:
            code = ensure_flake8_compliance(code, config['flake8_ignore'])

        # Add type hints for mypy
        if 'mypy' in config.get('linters', {}):
            code = add_type_hints(code)

    elif language == 'javascript':
        # Apply prettier formatting
        if 'prettier' in config.get('formatters', {}):
            code = format_with_prettier(code, config['formatters']['prettier'])

        # Ensure ESLint compliance
        if 'eslint' in config.get('linters', {}):
            code = ensure_eslint_compliance(code, config['linters']['eslint'])

    return code
```

## Display Format

When build configuration is detected, show this to the user:

```
📋 BUILD CONFIGURATION DETECTED
═══════════════════════════════════════════════════════════════
Source: Makefile

Python Formatting:
  ✓ black --line-length 100
  ✓ isort --profile black --multi-line 3

Python Linting:
  ✓ flake8 --ignore E501,E203,W503 --max-line-length=100
  ✓ mypy --ignore-missing-imports

Test Requirements:
  ✓ pytest with coverage

Excluded Paths:
  ✓ models/

═══════════════════════════════════════════════════════════════
✅ All generated code will follow these standards
```

## Build Configuration Storage

Detected configuration is stored temporarily at `~/.claude/temp/build-config.json` for the current workflow session:

```json
{
  "detected_at": "[timestamp]",
  "formatting": {
    "black": {"line_length": 100},
    "isort": {"profile": "black", "multi_line": 3}
  },
  "linting": {
    "flake8": {"ignore": ["E501", "E203", "W503"], "max_line_length": 100},
    "mypy": {"ignore_missing_imports": true}
  },
  "testing": {
    "pytest": {"coverage": true, "min_coverage": 80}
  },
  "pipeline_stages": ["format_check", "static", "test", "build"]
}
```

Note: Build configuration is NOT automatically documented in target repositories. Documentation is only created when user explicitly requests it.

## Error Handling

```python
def safe_config_detection():
    """
    Gracefully handle missing or malformed configuration files.
    """
    try:
        config = detect_build_configuration()
        if not config:
            return {
                'status': 'no_config',
                'message': 'No build configuration detected, using defaults',
                'config': get_default_config()
            }
        return {
            'status': 'success',
            'config': config
        }
    except Exception as e:
        return {
            'status': 'error',
            'message': f'Config detection failed: {e}',
            'config': get_default_config()
        }
```

## Default Configurations

When no configuration is detected, use sensible defaults:

### Python Defaults
```python
DEFAULT_PYTHON_CONFIG = {
    'formatters': {
        'black': {'line_length': 88},
        'isort': {'profile': 'black'}
    },
    'linters': {
        'flake8': {'max_line_length': 88, 'ignore': ['E203', 'W503']},
        'mypy': {'check_untyped_defs': True}
    }
}
```

### JavaScript Defaults
```python
DEFAULT_JAVASCRIPT_CONFIG = {
    'formatters': {
        'prettier': {
            'printWidth': 80,
            'tabWidth': 2,
            'singleQuote': True,
            'semi': True
        }
    },
    'linters': {
        'eslint': {
            'extends': ['eslint:recommended']
        }
    }
}
```

## Usage in systemcc Workflow

```python
def systemcc_with_build_config(task):
    """
    Enhanced systemcc workflow with build configuration detection.
    """
    # Step 1: Detect build configuration
    build_config = detect_build_configuration()

    # Step 2: Display detection results
    if build_config['status'] == 'success':
        display_build_config_box(build_config['config'])

    # Step 3: Enhance Lyra optimization with config
    optimized_prompt = lyra_optimize_with_config(task, build_config['config'])

    # Step 4: Generate code following detected rules
    generated_code = generate_code(optimized_prompt)

    # Step 5: Apply formatting and linting rules
    compliant_code = apply_build_config_to_code(
        generated_code,
        detect_language(),
        build_config['config']
    )

    return compliant_code
```

## Benefits

1. **Automatic Compliance** - Code follows team standards without manual intervention
2. **Pipeline Success** - Generated code passes CI/CD checks on first commit
3. **Team Consistency** - Uses exact same rules as the rest of the team
4. **Time Saving** - No manual formatting or fixing after generation
5. **Learning** - System learns and remembers project conventions

## Testing

Test the detector with various configuration files:

```bash
# Create test Makefile
echo 'format:
    black --line-length 100 .
    isort --profile black .

lint:
    flake8 --ignore E501,E203 .
    mypy --strict .' > Makefile

# Run systemcc and verify detection
/systemcc "create a new Python module"

# Check that generated code:
# - Has 100 char line limit
# - Imports are sorted with black profile
# - Passes flake8 with specified ignores
# - Has proper type hints
```