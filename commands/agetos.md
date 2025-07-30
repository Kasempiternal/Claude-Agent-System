# /agetos - Agent OS Project Initialization & Standards

## Purpose
Initialize and standardize projects using the Agent OS framework. This command provides comprehensive project setup, coding standards, and development workflow establishment.

## How It Works

When you use `/agetos`, the system will **automatically execute all phases**:

1. **Apply Lyra Universal Optimization** to your request
2. **Automatically run all Agent OS phases**:
   - ✅ ANALYZE project structure and technology stack
   - 🔄 ARCHITECT appropriate standards and conventions
   - 🔄 BUILD configuration files and workflows
   - 🔄 DOCUMENT all conventions for team alignment
3. **Deliver complete project setup** without manual intervention

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

## Automated Execution

The system uses the **Automated Workflow Executor** to run all phases seamlessly:

### Automatic Phase Progression
```
🚀 Starting Agent OS Workflow...

✅ ANALYSIS: Project structure analyzed
   - Detected: TypeScript, React, Node.js
   - Current standards: Minimal
   - Improvement areas identified

🔄 ARCHITECTURE: Designing standards...
✅ ARCHITECTURE: Standards framework complete
   - Code style: Airbnb + custom rules
   - Testing: Jest + React Testing Library
   - Git workflow: Feature branches

🔄 BUILD: Creating configuration files...
✅ BUILD: All configurations generated
   - .eslintrc.js created
   - .prettierrc added
   - tsconfig.json optimized
   - CI/CD pipelines ready

🔄 DOCUMENTATION: Creating team guides...
✅ DOCUMENTATION: Complete guides generated
   - Team coding standards
   - Onboarding documentation
   - Architecture decisions

✨ Agent OS Complete! Project fully standardized.
```

### User Interaction Points

The workflow only pauses when:
1. **Technology Choice**: Multiple valid options exist
2. **Standards Preference**: Team-specific decisions needed
3. **Integration Conflicts**: Existing tools need reconciliation

Example:
```
🔄 ARCHITECTURE: Which testing framework should I configure?
   1. Jest (recommended, already partially configured)
   2. Vitest (modern, faster alternative)
   3. Mocha + Chai (traditional choice)
   
Your preference (1-3): _
```

## Implementation Instructions

When this command is invoked, the automated executor will:

1. **Lyra Optimization**:
   - Apply universal middleware from middleware/lyra-universal.md
   - Optimize for project initialization context
   - Extract specific requirements and preferences

2. **Automatic Phase Execution**:
   - **Phase 1: Analysis** → Detect stack, patterns, current state
   - **Phase 2: Architecture** → Design standards framework
   - **Phase 3: Build** → Generate all configurations
   - **Phase 4: Documentation** → Create team guides

All phases execute automatically with progress updates.

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