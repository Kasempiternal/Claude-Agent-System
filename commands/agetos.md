# /agetos - Agent OS Project Initialization & Standards

## Purpose
Initialize and standardize projects using the Agent OS framework. This command provides comprehensive project setup, coding standards, and development workflow establishment.

## How It Works

When you use `/agetos`, the system will:

1. **Apply Lyra Universal Optimization** to your request
2. **Analyze** your project structure and technology stack
3. **Architect** appropriate standards and conventions
4. **Build** configuration files and workflows
5. **Document** all conventions for team alignment

## Usage

### Basic Commands
```bash
/agetos init              # Full project initialization
/agetos analyze           # Analyze current project state
/agetos standards         # Apply coding standards
/agetos architect         # Design system architecture
/agetos workflows         # Set up development workflows
```

### With Descriptions
```bash
/agetos "set up TypeScript project with strict standards"
/agetos "analyze our React codebase for improvements"
/agetos "establish Python coding conventions"
```

### Through Master Router
```bash
/systemcc "initialize project standards"  # Auto-routes to agetos
```

## Implementation Instructions

When this command is invoked:

1. **Lyra Optimization**:
   ```
   - Apply universal middleware from middleware/lyra-universal.md
   - Optimize for project initialization context
   - Extract specific requirements and preferences
   ```

2. **Project Analysis**:
   ```
   - Detect technology stack
   - Identify existing patterns
   - Find configuration files
   - Assess current standards
   ```

3. **Standards Selection**:
   ```
   - Choose appropriate language standards
   - Select linting and formatting rules
   - Define git workflow patterns
   - Establish documentation requirements
   ```

4. **Implementation**:
   ```
   - Create/update configuration files
   - Set up git hooks
   - Generate CI/CD templates
   - Create documentation templates
   ```

## Workflow Phases

### Phase 1: Analysis
- Scan project structure
- Detect languages and frameworks
- Identify existing tools
- Assess current practices

### Phase 2: Architecture
- Design folder structure
- Plan configuration setup
- Define workflow patterns
- Create standards documentation

### Phase 3: Implementation
- Generate config files
- Set up development tools
- Create templates
- Initialize workflows

### Phase 4: Documentation
- Generate team guides
- Create onboarding docs
- Document conventions
- Set up knowledge base

## Language-Specific Standards

### JavaScript/TypeScript
```
- ESLint configuration
- Prettier formatting
- TypeScript strict mode
- Jest testing setup
- Module patterns
```

### Python
```
- Black formatting
- Flake8 linting
- Type hints with mypy
- Pytest configuration
- Package structure
```

### Ruby
```
- RuboCop configuration
- RSpec testing
- Gem structure
- Rails conventions
- Documentation standards
```

## Integration Points

### With AI Dev Tasks
- Standards inform PRD creation
- Conventions guide task generation
- Quality gates in task execution

### With Complete System
- Standards used by VERIFIER
- Conventions checked by TESTER
- Documentation updated by DOCUMENTER

### With Phase-Based Workflow
- Standards maintained across phases
- Conventions preserved in context switches
- Quality consistent throughout

## Output Structure

All Agent OS outputs go to:
```
ClaudeFiles/
└── workflows/
    └── agent-os/
        ├── analysis/
        │   └── project-analysis-[timestamp].md
        ├── standards/
        │   ├── coding-standards.md
        │   └── [language]-conventions.md
        ├── configs/
        │   ├── .eslintrc.js
        │   ├── .prettierrc
        │   └── [other configs]
        └── documentation/
            ├── team-guide.md
            └── onboarding.md
```

## Examples

### Example 1: New TypeScript Project
```
User: /agetos init

Lyra Optimization: Enhance to include modern TypeScript setup with strict typing, 
ESLint, Prettier, Jest, and GitHub Actions CI/CD.

Agent OS executes:
1. Analyzes empty/minimal project
2. Sets up TypeScript with strict config
3. Configures ESLint + Prettier
4. Initializes Jest with coverage
5. Creates GitHub Actions workflows
6. Generates team documentation
```

### Example 2: Existing Python Project
```
User: /agetos "standardize our Python codebase"

Lyra Optimization: Analyze existing Python project and establish comprehensive 
standards including Black formatting, Flake8 linting, pytest configuration, 
type hints with mypy, and pre-commit hooks.

Agent OS executes:
1. Analyzes current Python patterns
2. Identifies inconsistencies
3. Creates pyproject.toml with standards
4. Sets up pre-commit hooks
5. Generates migration guide
6. Documents new conventions
```

### Example 3: Multi-Language Monorepo
```
User: /agetos "set up standards for our monorepo with React and Python services"

Lyra Optimization: Establish unified standards for monorepo containing React 
frontend and Python backend services, with shared tooling, consistent 
conventions, and integrated CI/CD.

Agent OS executes:
1. Analyzes monorepo structure
2. Creates root-level standards
3. Sets up language-specific configs
4. Establishes shared tooling
5. Creates unified CI/CD pipeline
6. Documents cross-team conventions
```

## Benefits

1. **Consistency** - Same standards across all projects
2. **Quality** - Best practices built-in from start
3. **Efficiency** - Hours of setup automated
4. **Onboarding** - New developers productive quickly
5. **Maintenance** - Self-documenting standards

## Best Practices

1. Run `agetos init` at project start
2. Use `agetos analyze` before major refactors
3. Apply `agetos standards` to legacy code gradually
4. Keep standards documentation updated
5. Review and evolve standards quarterly

Remember: Good standards enable creativity by removing trivial decisions.