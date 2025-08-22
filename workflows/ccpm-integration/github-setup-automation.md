# GitHub Detection and Setup Automation

## Overview

This module provides automated detection of GitHub repositories and setup of the CCPM integration environment, including GitHub CLI verification, extension installation, and repository configuration.

## Core Components

### 1. GitHub Environment Detection

#### Repository Detection Script
```python
#!/usr/bin/env python3
"""
GitHub Repository Detection for CCPM Integration
"""

import subprocess
import re
import json
import sys
from pathlib import Path

class GitHubDetector:
    def __init__(self, project_path=None):
        self.project_path = project_path or Path.cwd()
        self.detection_result = {}
    
    def detect_all(self):
        """Comprehensive GitHub environment detection"""
        self.detection_result = {
            'repository': self.detect_repository(),
            'github_cli': self.detect_github_cli(),
            'authentication': self.check_authentication(),
            'permissions': self.check_permissions(),
            'extensions': self.check_extensions(),
            'ccpm_ready': False,
            'setup_actions': []
        }
        
        self.detection_result['ccpm_ready'] = self.is_ccpm_ready()
        self.detection_result['setup_actions'] = self.get_setup_actions()
        
        return self.detection_result
    
    def detect_repository(self):
        """Detect if current directory is a GitHub repository"""
        try:
            # Check if git repository
            result = subprocess.run(['git', 'rev-parse', '--git-dir'], 
                                  capture_output=True, text=True, cwd=self.project_path)
            if result.returncode != 0:
                return {
                    'is_git_repo': False,
                    'is_github_repo': False,
                    'error': 'Not a git repository'
                }
            
            # Get remote URLs
            result = subprocess.run(['git', 'remote', '-v'], 
                                  capture_output=True, text=True, cwd=self.project_path)
            if result.returncode != 0:
                return {
                    'is_git_repo': True,
                    'is_github_repo': False,
                    'error': 'No remotes configured'
                }
            
            remotes = result.stdout
            
            # Check for GitHub patterns
            github_patterns = [
                r'github\.com[:/]([^/\s]+)/([^/\s\.]+)',  # HTTPS or SSH
                r'ssh://git@github\.com/([^/\s]+)/([^/\s\.]+)'  # SSH alternative
            ]
            
            for pattern in github_patterns:
                match = re.search(pattern, remotes)
                if match:
                    owner, repo_name = match.groups()
                    repo_name = repo_name.replace('.git', '')  # Remove .git suffix
                    
                    return {
                        'is_git_repo': True,
                        'is_github_repo': True,
                        'owner': owner,
                        'name': repo_name,
                        'full_name': f"{owner}/{repo_name}",
                        'remote_url': match.group(0),
                        'clone_url': f"https://github.com/{owner}/{repo_name}.git"
                    }
            
            return {
                'is_git_repo': True,
                'is_github_repo': False,
                'error': 'No GitHub remotes found',
                'remotes': remotes.strip()
            }
            
        except Exception as e:
            return {
                'is_git_repo': False,
                'is_github_repo': False,
                'error': f'Detection failed: {str(e)}'
            }
    
    def detect_github_cli(self):
        """Check GitHub CLI installation and version"""
        try:
            # Check if gh command exists
            result = subprocess.run(['gh', '--version'], 
                                  capture_output=True, text=True)
            if result.returncode != 0:
                return {
                    'installed': False,
                    'error': 'GitHub CLI not found'
                }
            
            # Parse version information
            version_output = result.stdout
            version_match = re.search(r'gh version (\d+\.\d+\.\d+)', version_output)
            
            return {
                'installed': True,
                'version': version_match.group(1) if version_match else 'unknown',
                'full_output': version_output.strip()
            }
            
        except Exception as e:
            return {
                'installed': False,
                'error': f'Failed to check GitHub CLI: {str(e)}'
            }
    
    def check_authentication(self):
        """Verify GitHub CLI authentication status"""
        try:
            result = subprocess.run(['gh', 'auth', 'status'], 
                                  capture_output=True, text=True)
            
            if result.returncode == 0:
                # Parse authentication details
                auth_output = result.stderr  # gh auth status outputs to stderr
                
                logged_in = 'Logged in to github.com' in auth_output
                
                # Extract username if available
                user_match = re.search(r'Logged in to github.com as ([^\s]+)', auth_output)
                username = user_match.group(1) if user_match else None
                
                # Check token scope
                token_scopes = []
                if 'Token scopes:' in auth_output:
                    scopes_match = re.search(r'Token scopes: ([^\n]+)', auth_output)
                    if scopes_match:
                        token_scopes = scopes_match.group(1).split(', ')
                
                return {
                    'authenticated': logged_in,
                    'username': username,
                    'token_scopes': token_scopes,
                    'output': auth_output
                }
            else:
                return {
                    'authenticated': False,
                    'error': result.stderr or 'Authentication check failed'
                }
                
        except Exception as e:
            return {
                'authenticated': False,
                'error': f'Failed to check authentication: {str(e)}'
            }
    
    def check_permissions(self):
        """Check if user has necessary permissions for CCPM operations"""
        if not self.detection_result.get('repository', {}).get('is_github_repo'):
            return {'has_permissions': False, 'error': 'Not a GitHub repository'}
        
        try:
            # Test issue listing permission (read access)
            result = subprocess.run(['gh', 'issue', 'list', '--limit', '1'], 
                                  capture_output=True, text=True, cwd=self.project_path)
            
            if result.returncode != 0:
                return {
                    'has_permissions': False,
                    'missing_permissions': ['issues:read'],
                    'error': result.stderr,
                    'suggestion': 'Run: gh auth refresh --scopes repo'
                }
            
            # Test issue creation permission (write access)
            # We don't actually create an issue, just check if the command is available
            result = subprocess.run(['gh', 'issue', 'create', '--help'], 
                                  capture_output=True, text=True)
            
            required_permissions = ['repo', 'issues:write']
            auth_info = self.check_authentication()
            
            if auth_info.get('authenticated'):
                token_scopes = auth_info.get('token_scopes', [])
                missing_scopes = [scope for scope in required_permissions 
                                if not any(scope in token_scope for token_scope in token_scopes)]
                
                return {
                    'has_permissions': len(missing_scopes) == 0,
                    'token_scopes': token_scopes,
                    'required_scopes': required_permissions,
                    'missing_scopes': missing_scopes
                }
            
            return {
                'has_permissions': False,
                'error': 'Not authenticated'
            }
            
        except Exception as e:
            return {
                'has_permissions': False,
                'error': f'Failed to check permissions: {str(e)}'
            }
    
    def check_extensions(self):
        """Check for required GitHub CLI extensions"""
        required_extensions = {
            'gh-sub-issue': {
                'url': 'https://github.com/k1LoW/gh-sub-issue',
                'install_command': 'gh extension install k1LoW/gh-sub-issue',
                'required': True
            }
        }
        
        try:
            # List installed extensions
            result = subprocess.run(['gh', 'extension', 'list'], 
                                  capture_output=True, text=True)
            
            if result.returncode != 0:
                return {
                    'can_check_extensions': False,
                    'error': result.stderr,
                    'required_extensions': required_extensions
                }
            
            installed_extensions = result.stdout
            extension_status = {}
            
            for ext_name, ext_info in required_extensions.items():
                is_installed = ext_name in installed_extensions
                extension_status[ext_name] = {
                    'installed': is_installed,
                    'required': ext_info['required'],
                    'install_command': ext_info['install_command'],
                    'url': ext_info['url']
                }
            
            return {
                'can_check_extensions': True,
                'extensions': extension_status,
                'all_required_installed': all(
                    ext['installed'] or not ext['required'] 
                    for ext in extension_status.values()
                )
            }
            
        except Exception as e:
            return {
                'can_check_extensions': False,
                'error': f'Failed to check extensions: {str(e)}',
                'required_extensions': required_extensions
            }
    
    def is_ccpm_ready(self):
        """Determine if environment is ready for CCPM integration"""
        repo_ok = self.detection_result.get('repository', {}).get('is_github_repo', False)
        cli_ok = self.detection_result.get('github_cli', {}).get('installed', False)
        auth_ok = self.detection_result.get('authentication', {}).get('authenticated', False)
        perm_ok = self.detection_result.get('permissions', {}).get('has_permissions', False)
        ext_ok = self.detection_result.get('extensions', {}).get('all_required_installed', False)
        
        return all([repo_ok, cli_ok, auth_ok, perm_ok, ext_ok])
    
    def get_setup_actions(self):
        """Generate list of actions needed to make environment CCPM-ready"""
        actions = []
        
        # Check repository
        if not self.detection_result.get('repository', {}).get('is_git_repo'):
            actions.append({
                'action': 'init_git',
                'description': 'Initialize git repository',
                'command': 'git init',
                'priority': 'high'
            })
        
        if not self.detection_result.get('repository', {}).get('is_github_repo'):
            actions.append({
                'action': 'add_github_remote',
                'description': 'Add GitHub remote or create repository on GitHub',
                'command': 'gh repo create',
                'priority': 'high'
            })
        
        # Check GitHub CLI
        if not self.detection_result.get('github_cli', {}).get('installed'):
            actions.append({
                'action': 'install_gh_cli',
                'description': 'Install GitHub CLI',
                'command': 'Follow instructions at https://cli.github.com/',
                'priority': 'critical'
            })
        
        # Check authentication
        if not self.detection_result.get('authentication', {}).get('authenticated'):
            actions.append({
                'action': 'authenticate_gh',
                'description': 'Authenticate with GitHub',
                'command': 'gh auth login',
                'priority': 'critical'
            })
        
        # Check permissions
        perm_info = self.detection_result.get('permissions', {})
        if not perm_info.get('has_permissions') and perm_info.get('missing_scopes'):
            actions.append({
                'action': 'refresh_token_scopes',
                'description': f"Refresh token with required scopes: {', '.join(perm_info['missing_scopes'])}",
                'command': 'gh auth refresh --scopes repo',
                'priority': 'high'
            })
        
        # Check extensions
        ext_info = self.detection_result.get('extensions', {})
        if not ext_info.get('all_required_installed'):
            for ext_name, ext_data in ext_info.get('extensions', {}).items():
                if ext_data['required'] and not ext_data['installed']:
                    actions.append({
                        'action': f'install_extension_{ext_name}',
                        'description': f'Install {ext_name} extension',
                        'command': ext_data['install_command'],
                        'priority': 'medium'
                    })
        
        return actions

def detect_github_environment():
    """Main detection function for use by CCPM integration"""
    detector = GitHubDetector()
    return detector.detect_all()

if __name__ == '__main__':
    # Command-line interface
    result = detect_github_environment()
    print(json.dumps(result, indent=2))
```

### 2. Automated Setup Script

#### setup-ccpm-github.py
```python
#!/usr/bin/env python3
"""
Automated CCPM GitHub Setup Script
"""

import subprocess
import sys
import json
from pathlib import Path
import time

class CCPMGitHubSetup:
    def __init__(self, project_path=None):
        self.project_path = project_path or Path.cwd()
        self.setup_log = []
        
    def log(self, message, level='info'):
        """Log setup progress"""
        timestamp = time.strftime('%Y-%m-%d %H:%M:%S')
        log_entry = f"[{timestamp}] {level.upper()}: {message}"
        self.setup_log.append(log_entry)
        print(log_entry)
    
    def run_command(self, command, description, critical=True):
        """Run a command and handle errors"""
        self.log(f"Running: {description}")
        self.log(f"Command: {command}")
        
        try:
            if isinstance(command, str):
                result = subprocess.run(command, shell=True, capture_output=True, text=True, cwd=self.project_path)
            else:
                result = subprocess.run(command, capture_output=True, text=True, cwd=self.project_path)
            
            if result.returncode == 0:
                self.log(f"✅ Success: {description}")
                if result.stdout:
                    self.log(f"Output: {result.stdout.strip()}")
                return True
            else:
                error_msg = f"❌ Failed: {description}\nError: {result.stderr}"
                self.log(error_msg, 'error')
                if critical:
                    raise Exception(error_msg)
                return False
                
        except Exception as e:
            error_msg = f"❌ Exception during: {description}\nError: {str(e)}"
            self.log(error_msg, 'error')
            if critical:
                raise
            return False
    
    def setup_github_cli(self):
        """Install and configure GitHub CLI"""
        self.log("🔧 Setting up GitHub CLI...")
        
        # Check if already installed
        try:
            result = subprocess.run(['gh', '--version'], capture_output=True, text=True)
            if result.returncode == 0:
                self.log("✅ GitHub CLI already installed")
                return True
        except FileNotFoundError:
            pass
        
        # Installation instructions (platform-specific)
        import platform
        system = platform.system().lower()
        
        if system == 'darwin':  # macOS
            self.log("🍎 macOS detected - install with: brew install gh")
            self.log("💡 Run: brew install gh")
        elif system == 'linux':
            self.log("🐧 Linux detected - install with package manager")
            self.log("💡 Ubuntu/Debian: curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg")
        elif system == 'windows':
            self.log("🪟 Windows detected - install with: winget install --id GitHub.cli")
            self.log("💡 Or download from: https://cli.github.com/")
        
        self.log("⚠️  Please install GitHub CLI manually and re-run setup")
        return False
    
    def setup_authentication(self):
        """Setup GitHub authentication"""
        self.log("🔐 Setting up GitHub authentication...")
        
        # Check if already authenticated
        result = subprocess.run(['gh', 'auth', 'status'], capture_output=True, text=True)
        if result.returncode == 0 and 'Logged in to github.com' in result.stderr:
            self.log("✅ Already authenticated with GitHub")
            return True
        
        self.log("🔑 Starting authentication flow...")
        return self.run_command(['gh', 'auth', 'login'], "GitHub authentication", critical=True)
    
    def setup_token_permissions(self):
        """Ensure token has necessary permissions"""
        self.log("🔒 Refreshing token permissions...")
        
        return self.run_command(
            ['gh', 'auth', 'refresh', '--scopes', 'repo,issues:write'],
            "Token permission refresh",
            critical=False
        )
    
    def install_extensions(self):
        """Install required GitHub CLI extensions"""
        self.log("📦 Installing GitHub CLI extensions...")
        
        extensions = [
            {
                'name': 'k1LoW/gh-sub-issue',
                'description': 'Sub-issue management'
            }
        ]
        
        for ext in extensions:
            # Check if already installed
            result = subprocess.run(['gh', 'extension', 'list'], capture_output=True, text=True)
            if ext['name'] in result.stdout or 'sub-issue' in result.stdout:
                self.log(f"✅ Extension {ext['name']} already installed")
                continue
            
            success = self.run_command(
                ['gh', 'extension', 'install', ext['name']],
                f"Install extension: {ext['description']}",
                critical=False
            )
            
            if not success:
                self.log(f"⚠️  Extension {ext['name']} installation failed, but setup continues")
    
    def verify_repository_access(self):
        """Verify repository access and permissions"""
        self.log("🔍 Verifying repository access...")
        
        # Test repository view
        if not self.run_command(['gh', 'repo', 'view'], "Repository view test", critical=False):
            self.log("⚠️  Cannot access repository - checking if we need to create it")
            return self.create_or_link_repository()
        
        # Test issue access
        return self.run_command(
            ['gh', 'issue', 'list', '--limit', '1'],
            "Issue access test",
            critical=False
        )
    
    def create_or_link_repository(self):
        """Create repository or link to existing one"""
        self.log("🏗️  Setting up repository connection...")
        
        # Check if we have a GitHub remote
        result = subprocess.run(['git', 'remote', '-v'], capture_output=True, text=True, cwd=self.project_path)
        
        if 'github.com' in result.stdout:
            self.log("✅ GitHub remote already configured")
            return True
        
        # Offer to create repository
        self.log("🆕 No GitHub repository found")
        repo_name = self.project_path.name
        
        response = input(f"Create new GitHub repository '{repo_name}'? (y/n): ").lower().strip()
        
        if response == 'y':
            return self.run_command(
                ['gh', 'repo', 'create', repo_name, '--source', '.', '--push'],
                f"Create GitHub repository: {repo_name}",
                critical=False
            )
        else:
            self.log("💡 You can manually add a GitHub remote with:")
            self.log("   git remote add origin https://github.com/USERNAME/REPO.git")
            return False
    
    def setup_issue_templates(self):
        """Create GitHub issue templates for CCPM"""
        self.log("📋 Setting up GitHub issue templates...")
        
        issue_template_dir = self.project_path / '.github' / 'ISSUE_TEMPLATE'
        issue_template_dir.mkdir(parents=True, exist_ok=True)
        
        # Epic template
        epic_template = '''---
name: CCPM Epic
about: Epic template for CCPM workflow
title: 'Epic: [Epic Title]'
labels: epic:feature, ccmp-generated
assignees: ''
---

# Epic: [Epic Title]

## Problem Statement
[What problem does this epic solve?]

## Success Criteria
[How will we know when this epic is complete?]

## Technical Scope
[What systems/components are affected?]

## Child Tasks
[This section will be auto-populated by CCPM]

---
🤖 Generated via CCPM Integration
'''
        
        with open(issue_template_dir / 'ccpm-epic.md', 'w') as f:
            f.write(epic_template)
        
        # Task template
        task_template = '''---
name: CCPM Task
about: Task template for CCMP workflow
title: '[Task Title]'
labels: task:feature, ccpm-generated
assignees: ''
---

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
Parent Epic: #[epic-number]
'''
        
        with open(issue_template_dir / 'ccpm-task.md', 'w') as f:
            f.write(task_template)
        
        self.log("✅ Created GitHub issue templates")
        return True
    
    def setup_claude_directories(self):
        """Setup .claude directory structure for GitHub mode"""
        self.log("📁 Setting up .claude directory structure...")
        
        claude_dir = self.project_path / '.claude'
        subdirs = ['agents', 'commands', 'context', 'epics', 'prds']
        
        for subdir in subdirs:
            (claude_dir / subdir).mkdir(parents=True, exist_ok=True)
        
        self.log("✅ Created .claude directory structure")
        return True
    
    def run_full_setup(self):
        """Run complete CCPM GitHub setup"""
        self.log("🚀 Starting CCPM GitHub Integration Setup...")
        self.log(f"📂 Project Path: {self.project_path}")
        
        try:
            # Setup steps in order
            steps = [
                ("GitHub CLI Installation", self.setup_github_cli),
                ("GitHub Authentication", self.setup_authentication),
                ("Token Permissions", self.setup_token_permissions),
                ("GitHub Extensions", self.install_extensions),
                ("Repository Access", self.verify_repository_access),
                ("Issue Templates", self.setup_issue_templates),
                (".claude Directory", self.setup_claude_directories)
            ]
            
            failed_steps = []
            
            for step_name, step_func in steps:
                self.log(f"\n{'='*50}")
                self.log(f"Step: {step_name}")
                self.log(f"{'='*50}")
                
                try:
                    success = step_func()
                    if success:
                        self.log(f"✅ {step_name} completed successfully")
                    else:
                        self.log(f"⚠️  {step_name} completed with warnings")
                        failed_steps.append(step_name)
                        
                except Exception as e:
                    self.log(f"❌ {step_name} failed: {str(e)}", 'error')
                    failed_steps.append(step_name)
            
            # Summary
            self.log(f"\n{'='*50}")
            self.log("SETUP SUMMARY")
            self.log(f"{'='*50}")
            
            if not failed_steps:
                self.log("🎉 CCPM GitHub Integration setup completed successfully!")
                self.log("✅ Your project is ready for CCPM workflow")
                self.log("\n💡 You can now use: /systemcc --pm \"your complex task\"")
                return True
            else:
                self.log(f"⚠️  Setup completed with {len(failed_steps)} issues:")
                for step in failed_steps:
                    self.log(f"  - {step}")
                self.log("\n💡 You may need to complete these steps manually")
                return False
                
        except Exception as e:
            self.log(f"❌ Setup failed with critical error: {str(e)}", 'error')
            return False
        
        finally:
            # Save setup log
            log_file = self.project_path / 'ClaudeFiles' / 'ccpm-setup.log'
            log_file.parent.mkdir(parents=True, exist_ok=True)
            
            with open(log_file, 'w') as f:
                f.write('\n'.join(self.setup_log))
            
            self.log(f"\n📝 Setup log saved to: {log_file}")

def main():
    """Main setup function"""
    if len(sys.argv) > 1:
        project_path = Path(sys.argv[1])
    else:
        project_path = Path.cwd()
    
    setup = CCPMGitHubSetup(project_path)
    success = setup.run_full_setup()
    
    sys.exit(0 if success else 1)

if __name__ == '__main__':
    main()
```

### 3. Integration with /systemcc Command

#### Detection Integration
```python
def detect_and_setup_github_ccpm(task_description, context):
    """Detect GitHub environment and setup CCPM if needed"""
    
    # Import the detection module
    from github_detection import GitHubDetector
    
    # Detect current environment
    detector = GitHubDetector()
    detection_result = detector.detect_all()
    
    # Log detection results
    print("🔍 GitHub Environment Detection:")
    print(f"├─ Repository: {'✅' if detection_result['repository']['is_github_repo'] else '❌'}")
    print(f"├─ GitHub CLI: {'✅' if detection_result['github_cli']['installed'] else '❌'}")
    print(f"├─ Authentication: {'✅' if detection_result['authentication']['authenticated'] else '❌'}")
    print(f"├─ Permissions: {'✅' if detection_result['permissions']['has_permissions'] else '❌'}")
    print(f"└─ Extensions: {'✅' if detection_result['extensions']['all_required_installed'] else '❌'}")
    
    # If CCPM ready, return GitHub mode
    if detection_result['ccpm_ready']:
        print("✅ CCPM GitHub Integration ready!")
        return {
            'mode': 'github',
            'detection_result': detection_result,
            'setup_required': False
        }
    
    # If setup actions needed, offer to run setup
    if detection_result['setup_actions']:
        print("\n⚠️  CCPM setup required. Missing components:")
        for action in detection_result['setup_actions']:
            priority_emoji = '🔴' if action['priority'] == 'critical' else '🟡' if action['priority'] == 'high' else '🟢'
            print(f"  {priority_emoji} {action['description']}")
            print(f"     Command: {action['command']}")
        
        # Ask user if they want auto-setup
        response = input("\n🤖 Run automatic CCPM GitHub setup? (y/n): ").lower().strip()
        
        if response == 'y':
            from ccmp_github_setup import CCPMGitHubSetup
            
            setup = CCPMGitHubSetup()
            success = setup.run_full_setup()
            
            if success:
                print("\n🎉 CCPM GitHub setup completed!")
                return {
                    'mode': 'github',
                    'detection_result': detection_result,
                    'setup_required': False,
                    'setup_completed': True
                }
            else:
                print("\n⚠️  Setup incomplete - falling back to Local PM mode")
                return {
                    'mode': 'local',
                    'detection_result': detection_result,
                    'setup_required': True,
                    'fallback_reason': 'github_setup_failed'
                }
        else:
            print("\n💡 Using Local PM mode instead")
            return {
                'mode': 'local',
                'detection_result': detection_result,
                'setup_required': False,
                'user_choice': 'local_preferred'
            }
    
    # Fallback to local mode
    return {
        'mode': 'local',
        'detection_result': detection_result,
        'setup_required': False,
        'fallback_reason': 'github_not_available'
    }
```

### 4. User Experience Flow

#### Automatic Detection and Setup
When a user runs `/systemcc --pm "complex task"`, the system:

1. **Detect Environment**:
   ```
   🔍 Detecting CCMP environment...
   ├─ GitHub Repository: ✅ Detected
   ├─ GitHub CLI: ❌ Not installed
   ├─ Authentication: ❌ Required
   └─ Extensions: ❌ Missing gh-sub-issue
   ```

2. **Offer Setup**:
   ```
   ⚠️  CCPM setup required. Missing components:
     🔴 Install GitHub CLI
        Command: Follow instructions at https://cli.github.com/
     🔴 Authenticate with GitHub  
        Command: gh auth login
     🟢 Install gh-sub-issue extension
        Command: gh extension install k1LoW/gh-sub-issue
   
   🤖 Run automatic CCPM GitHub setup? (y/n):
   ```

3. **Run Setup** (if user chooses yes):
   ```
   🚀 Starting CCPM GitHub Integration Setup...
   
   ==================================================
   Step: GitHub CLI Installation
   ==================================================
   🍎 macOS detected - install with: brew install gh
   💡 Run: brew install gh
   ⚠️  Please install GitHub CLI manually and re-run setup
   
   ==================================================
   SETUP SUMMARY
   ==================================================
   ⚠️  Setup completed with 1 issues:
     - GitHub CLI Installation
   💡 You may need to complete these steps manually
   ```

4. **Fallback to Local** (if setup incomplete):
   ```
   ⚠️  GitHub setup incomplete - activating Local PM mode
   
   📁 Created Local PM Structure:
   ├─ ClaudeFiles/pm/epics/epic-20240822-103045.json
   ├─ ClaudeFiles/pm/dashboard.md
   └─ 5 parallel-safe tasks identified
   
   🔄 Simulated Parallel Execution ready...
   ```

This automation ensures users get the best possible experience regardless of their GitHub setup status, with clear guidance on how to unlock the full CCPM benefits when ready.

## Benefits

1. **Seamless Detection**: Automatic environment analysis without user intervention
2. **Guided Setup**: Step-by-step automation with clear error messages
3. **Smart Fallback**: Always provides value even when GitHub isn't available
4. **User Choice**: Respects user preferences for local vs GitHub workflows
5. **Professional Setup**: Creates proper issue templates and directory structure
6. **Comprehensive Logging**: Detailed setup logs for troubleshooting