# 03-BUILD-CONFIG - Build Configuration Detection Module

## Purpose
Automatically detect and apply project build configuration rules (formatters, linters, test requirements) to ensure all generated code complies with CI/CD pipelines and team standards.

## Execution Order

This module runs:
1. **AFTER** Lyra optimization (02-LYRA-OPTIMIZATION.md)
2. **BEFORE** Workflow selection (04-WORKFLOW-SELECTION.md)

## Detection Process

### Step 1: Scan for Configuration Files

```python
def scan_build_configs():
    """
    Priority-based configuration file detection.
    """
    configs_to_check = [
        # Primary build files
        ('Makefile', parse_makefile),
        ('makefile', parse_makefile),

        # CI/CD files
        ('.gitlab-ci.yml', parse_gitlab_ci),
        ('.github/workflows/*.yml', parse_github_actions),
        ('azure-pipelines.yml', parse_azure_pipelines),

        # Python configs
        ('pyproject.toml', parse_pyproject),
        ('setup.cfg', parse_setupcfg),
        ('tox.ini', parse_tox),
        ('.flake8', parse_flake8_config),

        # JavaScript configs
        ('package.json', parse_package_json),
        ('.eslintrc*', parse_eslint),
        ('.prettierrc*', parse_prettier),

        # Go configs
        ('go.mod', parse_go_mod),
        ('.golangci.yml', parse_golangci),

        # Pre-commit hooks
        ('.pre-commit-config.yaml', parse_precommit),

        # Editor configs
        ('.editorconfig', parse_editorconfig)
    ]

    detected_configs = {}
    for config_file, parser in configs_to_check:
        if file_exists(config_file):
            detected_configs[config_file] = parser(config_file)

    return merge_configs(detected_configs)
```

### Step 2: Extract Rules from Makefile

```python
def parse_makefile_for_rules(content):
    """
    Extract specific formatting and linting rules from Makefile.
    """
    rules = {
        'formatters': {},
        'linters': {},
        'tests': {},
        'build': {}
    }

    # Example: Your company's Makefile
    # format:
    #     black --line-length 100 .
    #     isort --profile black --multi-line 3 --trailing-comma --force-grid-wrap 0 --use-parentheses --line-width 100 .

    # Black detection
    black_pattern = r'black\s+(.*?)(?:\n|&&|;|$)'
    black_matches = re.findall(black_pattern, content)
    if black_matches:
        for match in black_matches:
            if '--line-length' in match:
                line_length = re.search(r'--line-length\s+(\d+)', match)
                if line_length:
                    rules['formatters']['black'] = {
                        'line_length': int(line_length.group(1))
                    }
            if '--check' in match:
                rules['formatters']['black']['check_only'] = True

    # Isort detection
    isort_pattern = r'isort\s+(.*?)(?:\n|&&|;|$)'
    isort_matches = re.findall(isort_pattern, content)
    if isort_matches:
        for match in isort_matches:
            isort_config = {}
            if '--profile' in match:
                profile = re.search(r'--profile\s+(\w+)', match)
                if profile:
                    isort_config['profile'] = profile.group(1)
            if '--multi-line' in match:
                multi = re.search(r'--multi-line\s+(\d+)', match)
                if multi:
                    isort_config['multi_line'] = int(multi.group(1))
            if '--line-width' in match or '--line-length' in match:
                width = re.search(r'--line-(?:width|length)\s+(\d+)', match)
                if width:
                    isort_config['line_length'] = int(width.group(1))
            if '--trailing-comma' in match:
                isort_config['trailing_comma'] = True
            if '--force-grid-wrap' in match:
                grid = re.search(r'--force-grid-wrap\s+(\d+)', match)
                if grid:
                    isort_config['force_grid_wrap'] = int(grid.group(1))
            if '--use-parentheses' in match:
                isort_config['use_parentheses'] = True
            if isort_config:
                rules['formatters']['isort'] = isort_config

    # Flake8 detection
    flake8_pattern = r'flake8\s+(.*?)(?:\n|&&|;|$)'
    flake8_matches = re.findall(flake8_pattern, content)
    if flake8_matches:
        for match in flake8_matches:
            flake8_config = {}
            if '--ignore' in match:
                ignore = re.search(r'--ignore\s+([A-Z0-9,]+)', match)
                if ignore:
                    flake8_config['ignore'] = ignore.group(1).split(',')
            if '--max-line-length' in match:
                max_len = re.search(r'--max-line-length[=\s]+(\d+)', match)
                if max_len:
                    flake8_config['max_line_length'] = int(max_len.group(1))
            if '--exclude' in match:
                exclude = re.search(r'--exclude\s+(\S+)', match)
                if exclude:
                    flake8_config['exclude'] = exclude.group(1).split(',')
            if flake8_config:
                rules['linters']['flake8'] = flake8_config

    # Mypy detection
    mypy_pattern = r'mypy\s+(.*?)(?:\n|&&|;|$)'
    mypy_matches = re.findall(mypy_pattern, content)
    if mypy_matches:
        for match in mypy_matches:
            mypy_config = {}
            if '--ignore-missing-imports' in match:
                mypy_config['ignore_missing_imports'] = True
            if '--no-strict-optional' in match:
                mypy_config['no_strict_optional'] = True
            if '--no-site-packages' in match:
                mypy_config['no_site_packages'] = True
            if '--strict' in match:
                mypy_config['strict'] = True
            if '--exclude' in match:
                exclude = re.search(r'--exclude\s+(\S+)', match)
                if exclude:
                    mypy_config['exclude'] = exclude.group(1).split(',')
            if mypy_config:
                rules['linters']['mypy'] = mypy_config

    return rules
```

### Step 3: Display Detection Results

When build configuration is detected, show this formatted box:

```
📋 BUILD CONFIGURATION DETECTED
═══════════════════════════════════════════════════════════════
Source: Makefile

✅ Python Formatting Rules:
   • black: line-length=100
   • isort: profile=black, multi-line=3, trailing-comma, line-width=100

✅ Python Linting Rules:
   • flake8: ignore=E501,E203,W503, max-line-length=100, exclude=models/
   • mypy: ignore-missing-imports, no-strict-optional, exclude=models/

✅ Test Requirements:
   • pytest with coverage
   • minimum coverage: 80%

✅ Build Pipeline Stages:
   1. format_check
   2. static
   3. test
   4. build

═══════════════════════════════════════════════════════════════
🎯 All generated code will automatically follow these standards!
```

### Step 4: Enhance Lyra Optimization

Pass detected rules to Lyra for prompt enhancement:

```python
def enhance_lyra_with_build_config(original_prompt, build_config):
    """
    Add build configuration requirements to Lyra optimization.
    """
    enhanced_prompt = original_prompt

    if build_config.get('formatters'):
        formatter_rules = []

        if 'black' in build_config['formatters']:
            black = build_config['formatters']['black']
            if 'line_length' in black:
                formatter_rules.append(f"Python code must use {black['line_length']} character line limit")

        if 'isort' in build_config['formatters']:
            isort = build_config['formatters']['isort']
            if isort.get('profile') == 'black':
                formatter_rules.append("Imports must be sorted with black-compatible style")
            if isort.get('multi_line') == 3:
                formatter_rules.append("Multi-line imports use vertical hanging indent")

        if formatter_rules:
            enhanced_prompt += f"\n\nFormatting Requirements:\n" + "\n".join(f"- {r}" for r in formatter_rules)

    if build_config.get('linters'):
        linter_rules = []

        if 'flake8' in build_config['linters']:
            flake8 = build_config['linters']['flake8']
            if 'ignore' in flake8:
                linter_rules.append(f"Code can ignore flake8 rules: {', '.join(flake8['ignore'])}")
            if 'max_line_length' in flake8:
                linter_rules.append(f"Maximum line length for linting: {flake8['max_line_length']}")

        if 'mypy' in build_config['linters']:
            linter_rules.append("Include type hints for all public functions and methods")
            linter_rules.append("Use Optional[] for nullable parameters")

        if linter_rules:
            enhanced_prompt += f"\n\nLinting Requirements:\n" + "\n".join(f"- {r}" for r in linter_rules)

    return enhanced_prompt
```

### Step 5: Apply Rules to Generated Code

```python
def apply_build_rules_to_code(code, language, build_config):
    """
    Ensure generated code follows detected build rules.
    """
    if language == 'python' and build_config:
        # Apply Python-specific rules
        if 'formatters' in build_config:
            if 'black' in build_config['formatters']:
                line_length = build_config['formatters']['black'].get('line_length', 88)
                # Ensure code respects line length
                code = enforce_line_length(code, line_length)

            if 'isort' in build_config['formatters']:
                # Sort imports according to configuration
                code = sort_imports_with_config(code, build_config['formatters']['isort'])

        if 'linters' in build_config:
            if 'mypy' in build_config['linters']:
                # Add type hints where missing
                code = add_type_hints_to_functions(code)

            if 'flake8' in build_config['linters']:
                # Ensure flake8 compliance
                code = ensure_flake8_compliance(code, build_config['linters']['flake8'])

    return code
```

## Integration with systemcc Workflow

### Modified Execution Flow

```python
def systemcc_execution_with_build_config(task):
    """
    Enhanced systemcc workflow with build configuration.
    """
    # Step 1: Show detection message
    show_detection_message()

    # Step 2: Show Lyra optimization
    show_lyra_optimization(task)

    # Step 3: Detect build configuration (NEW)
    build_config = detect_build_configuration()
    if build_config['detected']:
        show_build_config_box(build_config)
        # Store in memory for reuse
        update_memory_bank_with_build_config(build_config)

    # Step 4: Enhance task with build requirements
    enhanced_task = enhance_task_with_build_config(task, build_config)

    # Step 5: Select workflow (now considers build config)
    workflow = select_workflow(enhanced_task, build_config)

    # Step 6: Execute workflow with build config awareness
    execute_workflow_with_build_config(workflow, enhanced_task, build_config)
```

## Configuration Caching

Detected configuration is cached in session context for reuse during the workflow.
No persistent files are created - configuration is re-detected at the start of each workflow.

## Error Handling

```python
def handle_config_detection_errors():
    """
    Graceful fallback when configuration detection fails.
    """
    fallback_messages = {
        'no_config': "No build configuration detected, using best practices",
        'parse_error': "Could not parse build configuration, using defaults",
        'partial': "Partial configuration detected, filling gaps with defaults"
    }

    # Always continue with workflow, just inform user
    return {
        'continue': True,
        'use_defaults': True,
        'message': fallback_messages.get(error_type, fallback_messages['no_config'])
    }
```

## Example Output

### With Makefile Detection:
```
🎯 SYSTEMCC DETECTED - Command acknowledged and workflow initiated
✅ Following SYSTEMCC workflow instructions from CLAUDE.md

═══════════════════════════════════════════════════════════════
🎯 LYRA AI PROMPT OPTIMIZATION
═══════════════════════════════════════════════════════════════
[Lyra optimization content...]
═══════════════════════════════════════════════════════════════

📋 BUILD CONFIGURATION DETECTED
═══════════════════════════════════════════════════════════════
Source: Makefile

✅ Python Formatting Rules:
   • black: line-length=100
   • isort: profile=black, multi-line=3

✅ Python Linting Rules:
   • flake8: ignore=E501,E203,W503, max-line-length=100
   • mypy: ignore-missing-imports

═══════════════════════════════════════════════════════════════
🎯 All generated code will automatically follow these standards!

🚀 Analyzing your request...
✅ Workflow selected: Complete System (6-agent validation)

🔄 Phase 1/6: Strategic analysis...
[Continues with normal workflow...]
```

### Without Configuration:
```
🎯 SYSTEMCC DETECTED - Command acknowledged and workflow initiated
✅ Following SYSTEMCC workflow instructions from CLAUDE.md

═══════════════════════════════════════════════════════════════
🎯 LYRA AI PROMPT OPTIMIZATION
═══════════════════════════════════════════════════════════════
[Lyra optimization content...]
═══════════════════════════════════════════════════════════════

📋 No build configuration detected - using Python best practices

🚀 Analyzing your request...
[Continues with normal workflow...]
```

## Testing the Module

Create a test Makefile to verify detection:

```makefile
# Test Makefile
.PHONY: format format_check static test

format:
	black --line-length 100 .
	isort --profile black --multi-line 3 --trailing-comma --force-grid-wrap 0 --use-parentheses --line-width 100 .

format_check:
	black --line-length 100 --check .
	isort --profile black --multi-line 3 --trailing-comma --force-grid-wrap 0 --use-parentheses --line-width 100 . --check-only

static:
	flake8 --ignore E501,E203,W503 --max-line-length=100 --exclude models/
	mypy --ignore-missing-imports --no-strict-optional --no-site-packages . --exclude models/

test:
	pytest --cov=. --cov-report=term-missing
```

Then run:
```bash
/systemcc "create a user authentication module"
```

The system should detect and apply all the formatting and linting rules automatically!