# GitLab Integration for CCPM Workflow

## Overview

This document outlines the GitLab integration strategy for the CCPM workflow, providing full compatibility with GitLab projects alongside GitHub support. GitLab offers excellent project management features that align perfectly with CCPM methodology.

## GitLab vs GitHub - CCPM Feature Comparison

| Feature | GitHub | GitLab | Implementation |
|---------|--------|--------|----------------|
| **Issues** | ✅ Native | ✅ Native | Both supported |
| **Sub-issues** | ✅ gh-sub-issue extension | ✅ Native issue hierarchy | GitLab is better! |
| **Epics** | ❌ Limited | ✅ Native Premium feature | GitLab advantage |
| **Milestones** | ✅ Basic | ✅ Advanced | Both supported |
| **Boards** | ✅ Projects | ✅ Issue Boards | Both supported |
| **CLI Tool** | ✅ gh cli | ✅ glab cli | Both supported |
| **Parallel Tracking** | ✅ via Issues | ✅ via Issues + Epics | GitLab superior |

**🎯 Result**: GitLab actually provides BETTER CCPM support than GitHub due to native Epic and sub-issue functionality!

## GitLab Environment Detection

### GitLab Repository Detection
```python
def detect_gitlab_repo():
    """Detect if current directory is a GitLab repository"""
    try:
        # Check for git repository
        result = subprocess.run(['git', 'remote', '-v'], capture_output=True, text=True)
        if result.returncode != 0:
            return {'is_repo': False, 'reason': 'Not a git repository'}
        
        # Check for GitLab patterns
        remotes = result.stdout
        gitlab_patterns = [
            r'gitlab\.com[:/]([^/\s]+)/([^/\s\.]+)',  # GitLab.com
            r'gitlab\.([^/\s]+)[:/]([^/\s]+)/([^/\s\.]+)',  # Self-hosted GitLab
            r'ssh://git@gitlab\.([^/\s]+)/([^/\s]+)/([^/\s\.]+)'  # SSH
        ]
        
        for pattern in gitlab_patterns:
            match = re.search(pattern, remotes)
            if match:
                if 'gitlab.com' in pattern:
                    # GitLab.com
                    groups = match.groups()
                    return {
                        'is_repo': True,
                        'is_gitlab_repo': True,
                        'host': 'gitlab.com',
                        'owner': groups[0],
                        'name': groups[1].replace('.git', ''),
                        'full_name': f"{groups[0]}/{groups[1].replace('.git', '')}",
                        'type': 'gitlab_saas'
                    }
                else:
                    # Self-hosted GitLab
                    groups = match.groups()
                    host = groups[0]
                    owner = groups[1] if len(groups) > 2 else groups[0]
                    name = groups[2] if len(groups) > 2 else groups[1]
                    
                    return {
                        'is_repo': True,
                        'is_gitlab_repo': True,
                        'host': host,
                        'owner': owner,
                        'name': name.replace('.git', ''),
                        'full_name': f"{owner}/{name.replace('.git', '')}",
                        'type': 'gitlab_self_hosted'
                    }
        
        return {'is_repo': True, 'is_gitlab_repo': False, 'reason': 'No GitLab remotes found'}
        
    except Exception as e:
        return {'is_repo': False, 'reason': f'Detection failed: {str(e)}'}
```

### GitLab CLI Verification
```bash
# Check GitLab CLI installation
glab --version

# Verify authentication
glab auth status

# Test repository access
glab repo view
```

## GitLab CCPM Implementation

### 1. Epic Creation (GitLab Advantage!)
GitLab has native Epic support, making it superior to GitHub for CCPM:

```python
def create_gitlab_epic(epic_data):
    """Create epic using GitLab's native Epic functionality"""
    
    epic_body = f"""
# Epic: {epic_data['title']}

## Problem Statement
{epic_data['problem_statement']}

## Success Criteria
{epic_data['success_criteria']}

## Technical Scope
{epic_data['technical_scope']}

## Child Issues
{format_child_issues(epic_data['tasks'])}

---
🤖 Generated via CCPM Integration  
Complexity Score: {epic_data['complexity']}/10  
Estimated Duration: {epic_data['estimated_hours']} hours
"""
    
    # Create epic via GitLab CLI
    cmd = [
        'glab', 'epic', 'create',
        '--title', f"Epic: {epic_data['title']}", 
        '--description', epic_body,
        '--label', 'epic:feature,ccpm-generated'
    ]
    
    result = subprocess.run(cmd, capture_output=True, text=True)
    
    if result.returncode == 0:
        epic_url = result.stdout.strip()
        epic_id = extract_epic_id(epic_url)
        return {'success': True, 'id': epic_id, 'url': epic_url}
    else:
        return {'success': False, 'error': result.stderr}
```

### 2. Issue Creation with Epic Linking
```python
def create_gitlab_issues(epic_id, tasks):
    """Create child issues and link to epic"""
    
    created_issues = []
    
    for task in tasks:
        issue_body = f"""
# Task: {task['title']}

## Objective
{task['objective']}

## Acceptance Criteria
{format_acceptance_criteria(task['acceptance_criteria'])}

## Technical Details
{task['technical_details']}

## Dependencies
{format_dependencies(task['dependencies'])}

## Estimated Time
{task['estimated_minutes']} minutes

---
🤖 Generated via CCPM Integration  
Parent Epic: &{epic_id}  
Parallel Safe: {'✅' if task['parallel_safe'] else '❌'}
"""
        
        # Create issue
        cmd = [
            'glab', 'issue', 'create',
            '--title', task['title'],
            '--description', issue_body,
            '--label', f"task:feature,ccpm-generated,epic-{epic_id}",
            '--epic', str(epic_id)  # GitLab native epic linking!
        ]
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode == 0:
            issue_url = result.stdout.strip()
            issue_id = extract_issue_id(issue_url)
            
            created_issues.append({
                'task_id': task['id'],
                'id': issue_id,
                'url': issue_url,
                'title': task['title']
            })
        else:
            created_issues.append({
                'task_id': task['id'], 
                'error': result.stderr,
                'failed': True
            })
    
    return created_issues
```

### 3. GitLab Issue Boards Integration
GitLab's Issue Boards provide excellent visual project management:

```python
def setup_gitlab_ccpm_board(project_id, epic_id):
    """Create CCPM-specific issue board for the epic"""
    
    # Create board for the epic
    board_data = {
        'name': f'CCPM Epic {epic_id}',
        'labels': [
            {'name': 'epic:feature', 'color': '#FF6B35'},
            {'name': 'task:feature', 'color': '#4ECDC4'},
            {'name': 'parallel-safe', 'color': '#45B7D1'},
            {'name': 'sequential', 'color': '#FFA07A'},
            {'name': 'in-progress', 'color': '#98D8C8'},
            {'name': 'completed', 'color': '#6BCF7F'}
        ],
        'lists': [
            {'label': 'Backlog', 'list_type': 'backlog'},
            {'label': 'Ready', 'position': 0},
            {'label': 'In Progress', 'position': 1},
            {'label': 'Review', 'position': 2},
            {'label': 'Done', 'list_type': 'closed'}
        ]
    }
    
    # Use GitLab API or glab CLI to create the board
    cmd = [
        'glab', 'api', 'projects/' + str(project_id) + '/boards',
        '--method', 'POST',
        '--field', f"name={board_data['name']}"
    ]
    
    return subprocess.run(cmd, capture_output=True, text=True)
```

## GitLab CLI Setup Automation

### Installation and Authentication
```bash
#!/bin/bash
# GitLab CCPM setup script

echo "🦊 Setting up GitLab CCPM integration..."

# Check GitLab CLI
if ! command -v glab &> /dev/null; then
    echo "❌ GitLab CLI not found. Installing..."
    
    # Platform-specific installation
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install glab
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Debian/Ubuntu
        curl -fsSL https://cli.gitlab.com/packages/gitlab-cli-archive-keyring.gpg | sudo gpg --dearmor -o /usr/share/keyrings/gitlab-cli-archive-keyring.gpg
        echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/gitlab-cli-archive-keyring.gpg] https://cli.gitlab.com/packages/stable/deb/ stable main" | sudo tee /etc/apt/sources.list.d/gitlab-cli.list
        sudo apt update && sudo apt install glab
    else
        echo "Please install GitLab CLI manually: https://gitlab.com/gitlab-org/cli"
        exit 1
    fi
fi

# Check authentication
if ! glab auth status &> /dev/null; then
    echo "🔐 Setting up GitLab authentication..."
    glab auth login
fi

# Verify repository access
if ! glab repo view &> /dev/null; then
    echo "❌ Cannot access repository. Please check permissions."
    exit 1
fi

# Create issue templates
mkdir -p .gitlab/issue_templates

# Epic template
cat > .gitlab/issue_templates/epic.md << 'EOF'
# Epic: [Epic Title]

## Problem Statement
[What problem does this epic solve?]

## Success Criteria  
[How will we know when this epic is complete?]

## Technical Scope
[What systems/components are affected?]

## Child Issues
[List of related issues - will be auto-generated by CCPM]

---
🤖 Generated via CCPM Integration
Complexity Score: [X]/10
EOF

# Task template
cat > .gitlab/issue_templates/task.md << 'EOF'
# Task: [Task Title]

## Objective
[Clear, focused goal for this task]

## Acceptance Criteria
- [ ] [Acceptance criteria 1]
- [ ] [Acceptance criteria 2]
- [ ] [Acceptance criteria 3]

## Technical Details
[Technical implementation details]

## Dependencies
[List any dependencies on other tasks]

---
🤖 Generated via CCPM Integration
Parent Epic: &[epic-id]
EOF

echo "✅ GitLab CCPM integration setup complete!"
echo "🦊 Your project is ready for GitLab-powered CCPM workflow!"

## GitLab Integration Advantages

### 1. Native Epic Support
- **GitHub**: Requires third-party extension (gh-sub-issue)
- **GitLab**: Built-in Epic functionality with proper hierarchy

### 2. Better Issue Hierarchy
- **GitHub**: Parent-child relationships via extension
- **GitLab**: Native issue hierarchy with Epic → Issue → Task

### 3. Advanced Project Management
- **GitHub**: Basic Projects board
- **GitLab**: Full Issue Boards with multiple list types, filters, and automation

### 4. API Completeness
- **GitHub**: Good API coverage
- **GitLab**: Excellent API with more project management features

## Integration with /systemcc

### Detection Logic Enhancement
```python
def detect_ccpm_environment():
    """Enhanced detection supporting GitHub and GitLab"""
    
    github_result = detect_github_repo()
    gitlab_result = detect_gitlab_repo()
    
    if gitlab_result.get('is_gitlab_repo'):
        # Check GitLab CLI
        glab_available = check_glab_cli()
        
        return {
            'mode': 'gitlab' if glab_available['installed'] else 'local',
            'platform': 'gitlab',
            'repo_info': gitlab_result,
            'cli_info': glab_available,
            'advantages': [
                'Native Epic support',
                'Better issue hierarchy',
                'Advanced Issue Boards',
                'Superior project management'
            ]
        }
    
    elif github_result.get('is_github_repo'):
        # Existing GitHub logic
        return existing_github_detection()
    
    else:
        # Local PM mode
        return {'mode': 'local', 'platform': 'none'}
```

### User Experience Flow
```
User: /systemcc --pm "build microservices architecture"

🔍 Environment Detection:
├─ GitLab Repository: ✅ Detected (project/microservices)
├─ GitLab CLI: ✅ Available  
├─ Authentication: ✅ Active
└─ CCPM Mode: ✅ GitLab Enhanced

🦊 GitLab CCPM Advantages Detected:
✅ Native Epic support (better than GitHub!)
✅ Built-in issue hierarchy
✅ Advanced Issue Boards
✅ Superior project management features

🎯 Creating Epic: Microservices Architecture
├─ Epic &123 created in GitLab
├─ 8 parallel-safe tasks identified
└─ Issue Board configured automatically

🚀 Parallel Execution Started:
Agent 1: Service Discovery (Issue #456) 🔄 In Progress
Agent 2: API Gateway (Issue #457) 🔄 In Progress  
Agent 3: User Service (Issue #458) 🔄 In Progress
Agent 4: Auth Service (Issue #459) ⏳ Queued

📊 GitLab Board: https://gitlab.com/project/microservices/-/boards/123
📋 Epic Progress: https://gitlab.com/project/microservices/-/epics/123

Expected completion: 4 hours → 1.2 hours (parallel execution)
```

## Key Benefits for GitLab Users

1. **Superior Epic Management**: Native Epic support vs GitHub's extension-based approach
2. **Better Hierarchy**: Built-in Epic → Issue → Task relationships
3. **Advanced Boards**: More sophisticated project management than GitHub Projects
4. **API Completeness**: Fuller project management API coverage
5. **Self-Hosted Option**: Works with GitLab CE/EE instances
6. **Better Integration**: Native features mean fewer workarounds

## Self-Hosted GitLab Support

The integration works with:
- **GitLab.com** (SaaS)
- **GitLab CE** (Community Edition)
- **GitLab EE** (Enterprise Edition)

For self-hosted instances:
```bash
# Configure glab for self-hosted GitLab
glab config set gitlab_host your-gitlab-instance.com
glab auth login --hostname your-gitlab-instance.com
```

## Conclusion

**GitLab users actually get a BETTER CCPM experience than GitHub users** due to:

1. Native Epic support (no extensions needed)
2. Superior issue hierarchy 
3. Better project management features
4. More complete API coverage
5. Advanced Issue Boards

The CCPM integration detects GitLab automatically and provides the enhanced experience seamlessly through the same `/systemcc --pm` command.