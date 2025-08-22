# GitHub Integration for CCPM Workflow

## Overview

This module handles GitHub-specific functionality for the CCPM workflow, including repository detection, GitHub CLI management, issue creation and tracking, and parallel agent coordination through GitHub Issues.

## Core Components

### 1. Environment Detection

#### GitHub Repository Detection
```python
def detect_github_repo():
    """Detect if current directory is a GitHub repository"""
    try:
        # Check for git repository
        result = subprocess.run(['git', 'remote', '-v'], capture_output=True, text=True)
        if result.returncode != 0:
            return {'is_repo': False, 'reason': 'Not a git repository'}
        
        # Check for GitHub remote
        remotes = result.stdout
        github_patterns = ['github.com', 'ssh://git@github.com']
        
        for pattern in github_patterns:
            if pattern in remotes:
                repo_match = re.search(r'github\.com[:/]([^/\s]+)/([^/\s\.]+)', remotes)
                if repo_match:
                    return {
                        'is_repo': True,
                        'owner': repo_match.group(1),
                        'name': repo_match.group(2),
                        'full_name': f"{repo_match.group(1)}/{repo_match.group(2)}"
                    }
        
        return {'is_repo': False, 'reason': 'No GitHub remote found'}
    except Exception as e:
        return {'is_repo': False, 'reason': f'Detection failed: {str(e)}'}
```

#### GitHub CLI Verification
```bash
# Check GitHub CLI installation
gh --version

# Verify authentication
gh auth status

# Test repository access
gh repo view
```

#### gh-sub-issue Extension Management
```bash
# Check if gh-sub-issue is installed  
gh extension list | grep sub-issue

# Install if missing
gh extension install https://github.com/k1LoW/gh-sub-issue

# Verify installation
gh sub-issue --help
```

### 2. Issue Management System

#### Epic Creation
```python  
def create_github_epic(epic_data):
    """Create parent epic issue on GitHub"""
    
    epic_body = f"""
# Epic: {epic_data['title']}

## Problem Statement
{epic_data['problem_statement']}

## Success Criteria
{epic_data['success_criteria']}

## Technical Scope
{epic_data['technical_scope']}

## Child Tasks
{format_child_tasks(epic_data['tasks'])}

---
🤖 Generated via CCPM Integration  
Complexity Score: {epic_data['complexity']}/10  
Estimated Duration: {epic_data['estimated_hours']} hours
"""
    
    # Create issue via GitHub CLI
    cmd = [
        'gh', 'issue', 'create',
        '--title', f"Epic: {epic_data['title']}", 
        '--body', epic_body,
        '--label', 'epic:feature,ccpm-generated'
    ]
    
    result = subprocess.run(cmd, capture_output=True, text=True)
    
    if result.returncode == 0:
        issue_url = result.stdout.strip()
        epic_number = extract_issue_number(issue_url)
        return {'success': True, 'number': epic_number, 'url': issue_url}
    else:
        return {'success': False, 'error': result.stderr}
```

#### Task Issue Creation
```python
def create_task_issues(epic_number, tasks):
    """Create child task issues and link to epic"""
    
    created_issues = []
    
    for task in tasks:
        task_body = f"""
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
Parent Epic: #{epic_number}  
Parallel Safe: {'✅' if task['parallel_safe'] else '❌'}
"""
        
        # Create task issue
        cmd = [
            'gh', 'issue', 'create',
            '--title', task['title'],
            '--body', task_body, 
            '--label', f"task:feature,ccmp-generated,epic-{epic_number}"
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode == 0:
            task_url = result.stdout.strip()
            task_number = extract_issue_number(task_url)
            
            # Link to parent epic using gh-sub-issue
            link_cmd = ['gh', 'sub-issue', '--parent', str(epic_number), '--child', str(task_number)]
            subprocess.run(link_cmd)
            
            created_issues.append({
                'task_id': task['id'],
                'number': task_number,
                'url': task_url,
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

### 3. Progress Tracking & Updates

#### Issue Status Updates
```python
def update_task_progress(issue_number, status, progress_notes):
    """Update GitHub issue with progress information"""
    
    progress_comment = f"""
## 🔄 Progress Update

**Status**: {status}  
**Timestamp**: {datetime.now().isoformat()}

### Progress Notes
{progress_notes}

### Next Steps
{generate_next_steps(status)}

---
🤖 Auto-generated via CCPM workflow
"""
    
    # Add comment to issue
    cmd = [
        'gh', 'issue', 'comment', str(issue_number),
        '--body', progress_comment
    ]
    
    subprocess.run(cmd)
    
    # Update labels based on status
    if status == 'completed':
        subprocess.run(['gh', 'issue', 'edit', str(issue_number), '--add-label', 'completed'])
        subprocess.run(['gh', 'issue', 'close', str(issue_number)])
    elif status == 'in_progress':
        subprocess.run(['gh', 'issue', 'edit', str(issue_number), '--add-label', 'in-progress'])
```

#### Epic Progress Aggregation  
```python
def update_epic_progress(epic_number):
    """Aggregate progress from all child tasks"""
    
    # Get all child issues
    child_issues = get_child_issues(epic_number)
    
    # Calculate progress
    total_tasks = len(child_issues)
    completed_tasks = len([issue for issue in child_issues if issue['state'] == 'closed'])
    in_progress_tasks = len([issue for issue in child_issues if 'in-progress' in issue['labels']])
    
    progress_percentage = (completed_tasks / total_tasks) * 100 if total_tasks > 0 else 0
    
    # Update epic issue
    progress_comment = f"""
## 📊 Epic Progress Update

**Overall Progress**: {progress_percentage:.1f}% ({completed_tasks}/{total_tasks} tasks)

### Task Breakdown
- ✅ Completed: {completed_tasks}
- 🔄 In Progress: {in_progress_tasks}  
- ⏳ Pending: {total_tasks - completed_tasks - in_progress_tasks}

### Recent Completions
{format_recent_completions(child_issues)}

---
🤖 Auto-generated CCMP progress summary
"""
    
    cmd = [
        'gh', 'issue', 'comment', str(epic_number),
        '--body', progress_comment
    ]
    
    subprocess.run(cmd)
```

### 4. Parallel Agent Coordination

#### Agent Assignment Strategy
```python
def assign_parallel_agents(tasks, github_issues):
    """Assign specialized agents to GitHub issues for parallel execution"""
    
    agent_assignments = []
    
    for task, issue in zip(tasks, github_issues):
        if task['parallel_safe'] and not task['dependencies']:
            agent_config = {
                'agent_id': f"ccpm-agent-{task['id']}",
                'issue_number': issue['number'],
                'specialization': determine_specialization(task),
                'context_files': task['required_files'],
                'objectives': task['acceptance_criteria'],
                'reporting': {
                    'update_frequency': '15min',
                    'github_issue': issue['number'],
                    'status_webhook': None  # Could integrate webhooks
                }
            }
            agent_assignments.append(agent_config)
    
    return agent_assignments
```

#### Multi-Agent Communication Protocol
```python
def setup_agent_communication(agent_assignments):
    """Set up communication channels between parallel agents"""
    
    communication_plan = {
        'shared_context': 'ClaudeFiles/ccmp/shared-context.md',
        'handoff_queue': 'ClaudeFiles/ccmp/handoffs/',
        'integration_points': [],
        'dependency_notifications': []
    }
    
    # Identify integration points
    for agent in agent_assignments:
        for other_agent in agent_assignments:
            if agents_need_coordination(agent, other_agent):
                communication_plan['integration_points'].append({
                    'agent_a': agent['agent_id'],
                    'agent_b': other_agent['agent_id'],
                    'coordination_type': 'interface_handoff',
                    'github_milestone': f"Integration-{agent['agent_id']}-{other_agent['agent_id']}"
                })
    
    return communication_plan
```

### 5. Setup Automation

#### Automated Environment Setup
```bash
#!/bin/bash
# Auto-setup script for GitHub CCMP integration

echo "🔧 Setting up GitHub CCPM integration..."

# Check GitHub CLI
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI not found. Please install: https://cli.github.com/"
    exit 1
fi

# Check authentication
if ! gh auth status &> /dev/null; then
    echo "🔐 Setting up GitHub authentication..."
    gh auth login
fi

# Install gh-sub-issue extension
if ! gh extension list | grep -q "sub-issue"; then
    echo "📦 Installing gh-sub-issue extension..."
    gh extension install https://github.com/k1LoW/gh-sub-issue
fi

# Verify repository access
if ! gh repo view &> /dev/null; then
    echo "❌ Cannot access repository. Please check permissions."
    exit 1
fi

# Create .claude directory structure
mkdir -p .claude/{agents,commands,context,epics,prds}
echo "📁 Created .claude directory structure"

# Set up GitHub issue templates
mkdir -p .github/ISSUE_TEMPLATE
cat > .github/ISSUE_TEMPLATE/epic.md << 'EOF'
---
name: Epic
about: CCPM Epic template
title: 'Epic: [Epic Title]'
labels: epic:feature, ccpm-generated
---

# Epic: [Epic Title]

## Problem Statement
[What problem does this epic solve?]

## Success Criteria  
[How will we know when this epic is complete?]

## Technical Scope
[What systems/components are affected?]

## Child Tasks
[List of related tasks - will be auto-generated by CCPM]
EOF

echo "✅ GitHub CCPM integration setup complete!"
```

### 6. Error Handling & Fallbacks

#### GitHub API Rate Limiting
```python
def handle_github_rate_limit(func, *args, **kwargs):
    """Handle GitHub API rate limiting gracefully"""
    
    max_retries = 3
    base_delay = 60  # seconds
    
    for attempt in range(max_retries):
        try:
            return func(*args, **kwargs)
        except GitHubRateLimitError as e:
            if attempt < max_retries - 1:
                delay = base_delay * (2 ** attempt)  # Exponential backoff
                print(f"⏳ Rate limit hit. Waiting {delay}s before retry {attempt + 1}/{max_retries}")
                time.sleep(delay)
            else:
                print("❌ GitHub rate limit exceeded. Falling back to local PM mode.")
                return fallback_to_local_mode(*args, **kwargs)
```

#### Permission Issues
```python
def check_github_permissions():
    """Verify necessary GitHub permissions"""
    
    required_permissions = ['issues:write', 'repo:read']
    
    try:
        # Test issue creation permission
        test_result = subprocess.run(['gh', 'issue', 'list', '--limit', '1'], 
                                   capture_output=True, text=True)
        
        if result.returncode != 0:
            return {
                'has_permissions': False,
                'error': 'Cannot access repository issues',
                'suggestion': 'Run: gh auth refresh -s repo'
            }
        
        return {'has_permissions': True}
        
    except Exception as e:
        return {
            'has_permissions': False,
            'error': str(e),
            'suggestion': 'Check GitHub CLI authentication: gh auth status'
        }
```

## Integration with /systemcc

### Detection Logic
```python
def should_use_github_ccpm(task_description, context):
    """Determine if GitHub CCPM mode should be activated"""
    
    github_available = detect_github_repo()['is_repo']
    complexity_score = calculate_task_complexity(task_description)
    has_pm_flag = '--pm' in context.get('flags', [])
    
    # Explicit PM mode always activates CCPM (with fallback if no GitHub)
    if has_pm_flag:
        return {'use_ccpm': True, 'mode': 'github' if github_available else 'local'}
    
    # Auto-activate for complex tasks with GitHub
    if github_available and complexity_score >= 6:
        return {'use_ccpm': True, 'mode': 'github'}
    
    # Check for parallel execution indicators
    parallel_keywords = ['parallel', 'concurrent', 'simultaneous', 'team']
    if any(keyword in task_description.lower() for keyword in parallel_keywords):
        return {'use_ccmp': True, 'mode': 'github' if github_available else 'local'}
    
    return {'use_ccpm': False}
```

This GitHub integration enables true parallel development with professional project management capabilities, while maintaining robust fallbacks for any environment.