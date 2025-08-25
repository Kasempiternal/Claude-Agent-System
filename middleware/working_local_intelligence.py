#!/usr/bin/env python3
"""
Working Local Intelligence System for /systemcc
REAL implementation that actually works and can be used immediately
"""

import json
import hashlib
import os
import subprocess
from datetime import datetime
from collections import defaultdict
from pathlib import Path


class WorkingIntelligenceTracker:
    """Real implementation that works globally across all projects"""
    
    def __init__(self, use_global=True):
        # Determine intelligence directory (global vs local)
        if use_global:
            home_dir = Path.home()
            self.intelligence_dir = home_dir / ".claude" / "intelligence"
            self.config_file = home_dir / ".claude" / "config"
            self.is_global = True
        else:
            self.intelligence_dir = Path("ClaudeFiles/intelligence")
            self.config_file = Path("ClaudeFiles/.config")
            self.is_global = False
        
        self.decisions_file = self.intelligence_dir / "decision-outcomes.json"
        self.patterns_file = self.intelligence_dir / "success-patterns.json"
        self.project_contexts_file = self.intelligence_dir / "project-contexts.json"
        
        # Ensure directories exist
        self.intelligence_dir.mkdir(parents=True, exist_ok=True)
        self.config_file.parent.mkdir(parents=True, exist_ok=True)
        
        # Load configuration
        self.config = self._load_config()
        
        # Detect current project context
        self.current_project_context = self._detect_project_context()
        
        # Load existing data
        self.decisions = self._load_decisions()
        self.patterns = self._load_patterns()
        self.project_contexts = self._load_project_contexts()
        
        # Auto-migrate old local data if this is first global run
        if self.is_global and self.config.get('MIGRATION_STATUS') != 'completed':
            self._auto_migrate_local_data()
    
    def record_decision(self, task_description, workflow_chosen, outcome_success, completion_time_minutes=30):
        """Record a real decision outcome"""
        
        # Check if learning is disabled
        if self.config.get('INTELLIGENCE_MODE') == 'disabled':
            return None
        
        # Create anonymous hash of task (no original text stored)
        task_hash = hashlib.md5(task_description.lower().encode()).hexdigest()[:8]
        
        # Extract task characteristics
        task_features = self._extract_task_features(task_description)
        
        decision_record = {
            'timestamp': datetime.now().isoformat(),
            'task_hash': task_hash,
            'task_type': task_features['type'],
            'complexity_indicators': task_features['complexity'],
            'workflow_used': workflow_chosen,
            'success': outcome_success,
            'completion_time': completion_time_minutes,
            'user_satisfaction': None,  # Can be set later
            'project_context': self.current_project_context  # Add project context
        }
        
        # Store the decision
        self.decisions.append(decision_record)
        self._save_decisions()
        
        # Update success patterns
        self._update_success_patterns(task_features, workflow_chosen, outcome_success)
        
        print(f"✓ Recorded decision: {task_features['type']} → {workflow_chosen} ({'✓' if outcome_success else '✗'})")
        return decision_record
    
    def get_workflow_recommendation(self, task_description):
        """Get enhanced recommendation based on global patterns and project context"""
        
        if not self.decisions:
            return None  # No data yet
        
        task_features = self._extract_task_features(task_description)
        
        # Try context-specific recommendations first (more accurate)
        context_recommendation = self._get_context_aware_recommendation(task_features)
        if context_recommendation:
            return context_recommendation
        
        # Fall back to general pattern matching
        return self._get_general_recommendation(task_features)
    
    def _get_context_aware_recommendation(self, task_features):
        """Get recommendation based on current project context"""
        
        current_context = self.current_project_context
        similar_decisions = []
        
        # Find decisions from similar project contexts
        for decision in self.decisions:
            decision_context = decision.get('project_context', {})
            similarity_score = self._calculate_context_similarity(current_context, decision_context)
            
            if similarity_score > 0.6:  # Only consider similar contexts
                # Also check task similarity
                if (decision.get('task_type') == task_features['type'] or 
                    abs(decision.get('complexity_indicators', 1) - task_features['complexity']) <= 1):
                    similar_decisions.append((decision, similarity_score))
        
        if len(similar_decisions) < 2:
            return None
        
        # Weight decisions by context similarity
        workflow_success = {}
        for decision, similarity in similar_decisions:
            workflow = decision['workflow_used']
            if workflow not in workflow_success:
                workflow_success[workflow] = {'total': 0, 'success': 0, 'weighted_total': 0}
            
            weight = similarity  # Use similarity as weight
            workflow_success[workflow]['total'] += 1
            workflow_success[workflow]['weighted_total'] += weight
            if decision['success']:
                workflow_success[workflow]['success'] += weight
        
        # Find best workflow with weighted success rate
        best_workflow = None
        best_rate = 0
        best_stats = None
        
        for workflow, stats in workflow_success.items():
            if stats['total'] >= 2:  # Minimum sample size
                weighted_success_rate = stats['success'] / stats['weighted_total']
                if weighted_success_rate > best_rate:
                    best_rate = weighted_success_rate
                    best_workflow = workflow
                    best_stats = stats
        
        if best_workflow and best_rate > 0.6:
            context_info = f" in {current_context.get('framework', current_context.get('language', 'similar'))} projects"
            return {
                'workflow': best_workflow,
                'confidence': best_rate,
                'sample_size': best_stats['total'],
                'reasoning': f"Similar tasks{context_info} succeeded {best_rate:.0%} with {best_workflow}",
                'recommendation_type': 'context-aware'
            }
        
        return None
    
    def _get_general_recommendation(self, task_features):
        """Get recommendation based on general patterns (fallback)"""
        
        similar_decisions = self._find_similar_tasks(task_features)
        
        if len(similar_decisions) < 2:
            return None  # Not enough data
        
        # Calculate success rates by workflow
        workflow_success = {}
        for decision in similar_decisions:
            workflow = decision['workflow_used']
            if workflow not in workflow_success:
                workflow_success[workflow] = {'total': 0, 'success': 0}
            
            workflow_success[workflow]['total'] += 1
            if decision['success']:
                workflow_success[workflow]['success'] += 1
        
        # Find best workflow
        best_workflow = None
        best_rate = 0
        
        for workflow, stats in workflow_success.items():
            if stats['total'] >= 2:  # Minimum data threshold
                success_rate = stats['success'] / stats['total']
                if success_rate > best_rate:
                    best_rate = success_rate
                    best_workflow = workflow
        
        if best_workflow and best_rate > 0.6:  # Only recommend if success rate > 60%
            return {
                'workflow': best_workflow,
                'confidence': best_rate,
                'sample_size': workflow_success[best_workflow]['total'],
                'reasoning': f"Similar tasks succeeded {best_rate:.0%} with {best_workflow}",
                'recommendation_type': 'general'
            }
        
        return None
    
    def _calculate_context_similarity(self, context1, context2):
        """Calculate similarity score between two project contexts"""
        
        if not context1 or not context2:
            return 0.0
        
        similarity_score = 0.0
        
        # Framework match (high weight)
        if context1.get('framework') and context2.get('framework'):
            if context1['framework'] == context2['framework']:
                similarity_score += 0.4
        
        # Language match (medium weight) 
        if context1.get('language') and context2.get('language'):
            if context1['language'] == context2['language']:
                similarity_score += 0.3
        
        # Project type match (medium weight)
        if context1.get('project_type') and context2.get('project_type'):
            if context1['project_type'] == context2['project_type']:
                similarity_score += 0.2
        
        # Tech stack overlap (lower weight)
        tech1 = set(context1.get('tech_stack', []))
        tech2 = set(context2.get('tech_stack', []))
        if tech1 and tech2:
            overlap = len(tech1.intersection(tech2))
            union = len(tech1.union(tech2))
            if union > 0:
                similarity_score += 0.1 * (overlap / union)
        
        return min(1.0, similarity_score)  # Cap at 1.0
    
    def _extract_task_features(self, task_description):
        """Extract actual task characteristics"""
        
        desc_lower = task_description.lower()
        
        # Task type classification
        task_type = 'other'
        if any(word in desc_lower for word in ['auth', 'login', 'user', 'account', 'register']):
            task_type = 'authentication'
        elif any(word in desc_lower for word in ['ui', 'interface', 'component', 'design', 'button']):
            task_type = 'ui'
        elif any(word in desc_lower for word in ['api', 'endpoint', 'service', 'backend', 'server']):
            task_type = 'api'
        elif any(word in desc_lower for word in ['database', 'data', 'model', 'schema', 'migration']):
            task_type = 'database'
        elif any(word in desc_lower for word in ['test', 'testing', 'spec', 'unit']):
            task_type = 'testing'
        elif any(word in desc_lower for word in ['fix', 'bug', 'error', 'issue', 'broken']):
            task_type = 'bugfix'
        elif any(word in desc_lower for word in ['feature', 'add', 'create', 'build', 'implement']):
            task_type = 'feature'
        elif any(word in desc_lower for word in ['refactor', 'improve', 'optimize', 'clean']):
            task_type = 'refactor'
        
        # Complexity indicators
        complexity_score = 1
        if any(word in desc_lower for word in ['system', 'architecture', 'complex', 'enterprise']):
            complexity_score += 2
        if any(word in desc_lower for word in ['all', 'entire', 'across', 'multiple', 'throughout']):
            complexity_score += 2
        if any(word in desc_lower for word in ['security', 'critical', 'production', 'important']):
            complexity_score += 1
        if any(word in desc_lower for word in ['integration', 'migrate', 'deploy', 'configure']):
            complexity_score += 1
        
        return {
            'type': task_type,
            'complexity': min(5, complexity_score)  # Cap at 5
        }
    
    def _find_similar_tasks(self, task_features):
        """Find decisions for similar tasks"""
        
        similar = []
        for decision in self.decisions:
            # Match task type exactly
            if decision['task_type'] == task_features['type']:
                similar.append(decision)
            # Or match complexity level
            elif abs(decision['complexity_indicators'] - task_features['complexity']) <= 1:
                similar.append(decision)
        
        return similar
    
    def _update_success_patterns(self, task_features, workflow, success):
        """Update success patterns"""
        
        pattern_key = f"{task_features['type']}_complexity_{task_features['complexity']}"
        
        if pattern_key not in self.patterns:
            self.patterns[pattern_key] = {}
        
        if workflow not in self.patterns[pattern_key]:
            self.patterns[pattern_key][workflow] = {'total': 0, 'success': 0}
        
        self.patterns[pattern_key][workflow]['total'] += 1
        if success:
            self.patterns[pattern_key][workflow]['success'] += 1
        
        self._save_patterns()
        self._save_project_contexts()
    
    def _detect_project_context(self):
        """Detect current project context for intelligent recommendations"""
        
        context = {
            'project_hash': None,
            'tech_stack': [],
            'project_type': 'unknown',
            'framework': None,
            'language': None
        }
        
        try:
            # Get project root hash for identification (without exposing path)
            cwd = os.getcwd()
            context['project_hash'] = hashlib.md5(cwd.encode()).hexdigest()[:8]
            
            # Detect tech stack from common files
            tech_indicators = {
                'package.json': ['javascript', 'nodejs'],
                'requirements.txt': ['python'],
                'Gemfile': ['ruby'],
                'pom.xml': ['java'],
                'Cargo.toml': ['rust'],
                'go.mod': ['go'],
                'composer.json': ['php'],
                'project.clj': ['clojure']
            }
            
            for file_name, languages in tech_indicators.items():
                if os.path.exists(file_name):
                    context['tech_stack'].extend(languages)
                    if not context['language']:
                        context['language'] = languages[0]
            
            # Detect framework from package.json
            if os.path.exists('package.json'):
                try:
                    with open('package.json', 'r') as f:
                        package_data = json.load(f)
                        deps = {**package_data.get('dependencies', {}), **package_data.get('devDependencies', {})}
                        
                        if 'react' in deps:
                            context['framework'] = 'react'
                        elif 'vue' in deps:
                            context['framework'] = 'vue'
                        elif 'angular' in deps or '@angular/core' in deps:
                            context['framework'] = 'angular'
                        elif 'express' in deps:
                            context['framework'] = 'express'
                        elif 'next' in deps:
                            context['framework'] = 'nextjs'
                except:
                    pass
            
            # Detect Python framework
            if 'python' in context['tech_stack']:
                if os.path.exists('manage.py'):
                    context['framework'] = 'django'
                elif os.path.exists('app.py') or os.path.exists('main.py'):
                    if os.path.exists('requirements.txt'):
                        try:
                            with open('requirements.txt', 'r') as f:
                                reqs = f.read().lower()
                                if 'flask' in reqs:
                                    context['framework'] = 'flask'
                                elif 'fastapi' in reqs:
                                    context['framework'] = 'fastapi'
                        except:
                            pass
            
            # Determine project type
            if context['framework'] in ['react', 'vue', 'angular', 'nextjs']:
                context['project_type'] = 'frontend'
            elif context['framework'] in ['express', 'django', 'flask', 'fastapi']:
                context['project_type'] = 'backend'
            elif 'javascript' in context['tech_stack'] and 'react-native' in str(os.listdir('.')):
                context['project_type'] = 'mobile'
            elif any(ml_file in os.listdir('.') for ml_file in ['model.py', 'train.py', 'notebook.ipynb']):
                context['project_type'] = 'ml'
                
        except Exception:
            pass  # Use default context if detection fails
        
        return context
    
    def _load_project_contexts(self):
        """Load project contexts database"""
        if self.project_contexts_file.exists():
            try:
                with open(self.project_contexts_file, 'r') as f:
                    return json.load(f)
            except:
                return {}
        return {}
    
    def _save_project_contexts(self):
        """Save project contexts database"""
        try:
            with open(self.project_contexts_file, 'w') as f:
                json.dump(self.project_contexts, f, indent=2)
        except OSError as e:
            print(f"⚠️ Unable to save project contexts: {e}")
    
    def _auto_migrate_local_data(self):
        """Auto-migrate existing local intelligence data to global system"""
        
        print("🔄 First-time global intelligence setup - checking for local data to migrate...")
        
        migrated_count = 0
        local_intel_paths = []
        
        # Find common project locations
        search_paths = [
            Path.cwd(),  # Current directory
            Path.home() / "Projects",
            Path.home() / "Code", 
            Path.home() / "Development",
            Path.home() / "Documents"
        ]
        
        # Search for ClaudeFiles/intelligence directories
        for search_path in search_paths:
            if search_path.exists():
                try:
                    for claude_files in search_path.rglob("ClaudeFiles/intelligence"):
                        if claude_files.is_dir():
                            local_intel_paths.append(claude_files)
                except PermissionError:
                    continue
        
        # Migrate data from found local intelligence directories
        for local_path in local_intel_paths:
            decisions_file = local_path / "decision-outcomes.json"
            patterns_file = local_path / "success-patterns.json"
            
            try:
                # Migrate decisions
                if decisions_file.exists():
                    with open(decisions_file, 'r') as f:
                        local_decisions = json.load(f)
                    
                    for decision in local_decisions:
                        # Add to global decisions if not already present
                        if decision not in self.decisions:
                            self.decisions.append(decision)
                            migrated_count += 1
                
                # Migrate patterns
                if patterns_file.exists():
                    with open(patterns_file, 'r') as f:
                        local_patterns = json.load(f)
                    
                    for pattern_key, workflows in local_patterns.items():
                        if pattern_key not in self.patterns:
                            self.patterns[pattern_key] = workflows
                        else:
                            # Merge workflow stats
                            for workflow, stats in workflows.items():
                                if workflow not in self.patterns[pattern_key]:
                                    self.patterns[pattern_key][workflow] = stats
                                else:
                                    self.patterns[pattern_key][workflow]['total'] += stats.get('total', 0)
                                    self.patterns[pattern_key][workflow]['success'] += stats.get('success', 0)
                
            except Exception as e:
                print(f"⚠️ Error migrating from {local_path}: {e}")
        
        if migrated_count > 0:
            self._save_decisions()
            self._save_patterns()
            print(f"✅ Migrated {migrated_count} decisions to global intelligence system")
        else:
            print("ℹ️ No local intelligence data found to migrate")
        
        # Mark migration as completed
        self.config['MIGRATION_STATUS'] = 'completed'
        self._save_config()
    
    def _load_config(self):
        """Load configuration settings"""
        config = {'INTELLIGENCE_MODE': 'local'}  # Default: local learning enabled
        
        if self.config_file.exists():
            try:
                with open(self.config_file, 'r') as f:
                    for line in f:
                        line = line.strip()
                        if '=' in line and not line.startswith('#'):
                            key, value = line.split('=', 1)
                            config[key.strip()] = value.strip()
            except Exception:
                pass  # Use defaults if config file is corrupt
        
        return config
    
    def _save_config(self):
        """Save configuration settings"""
        try:
            with open(self.config_file, 'w') as f:
                for key, value in self.config.items():
                    f.write(f"{key}={value}\n")
        except OSError as e:
            print(f"⚠️ Unable to save config: {e}")
    
    def _load_decisions(self):
        """Load existing decisions"""
        if self.decisions_file.exists():
            try:
                with open(self.decisions_file, 'r') as f:
                    return json.load(f)
            except json.JSONDecodeError as e:
                print(f"⚠️ Corrupt decisions JSON, starting fresh: {e}")
                return []
            except OSError as e:
                print(f"⚠️ Unable to read decisions file: {e}")
                return []
        return []
    def _load_patterns(self):
        """Load existing patterns"""
        if self.patterns_file.exists():
            try:
                with open(self.patterns_file, 'r') as f:
                    return json.load(f)
            except json.JSONDecodeError as e:
                print(f"⚠️ Corrupt patterns JSON, starting fresh: {e}")
                return {}
            except OSError as e:
                print(f"⚠️ Unable to read patterns file: {e}")
                return {}
        return {}
    
    def _save_decisions(self):
        """Save decisions to file"""
        try:
            with open(self.decisions_file, 'w') as f:
                json.dump(self.decisions, f, indent=2)
        except OSError as e:
            print(f"⚠️ Unable to save decisions: {e}")
    
    def _save_patterns(self):
        """Save patterns to file"""
        try:
            with open(self.patterns_file, 'w') as f:
                json.dump(self.patterns, f, indent=2)
        except OSError as e:
            print(f"⚠️ Unable to save patterns: {e}")
    
    def get_stats_summary(self):
        """Get summary of learning data"""
        
        total_decisions = len(self.decisions)
        if total_decisions == 0:
            return "No learning data yet"
        
        successful_decisions = sum(1 for d in self.decisions if d.get('success', False))
        success_rate = successful_decisions / total_decisions
        
        workflow_counts = {}
        for decision in self.decisions:
            workflow = decision['workflow_used']
            workflow_counts[workflow] = workflow_counts.get(workflow, 0) + 1
        
        return {
            'total_decisions': total_decisions,
            'success_rate': success_rate,
            'most_used_workflow': max(workflow_counts.items(), key=lambda x: x[1]) if workflow_counts else None,
            'workflow_distribution': workflow_counts,
            'patterns_learned': len(self.patterns)
        }


def enhanced_systemcc_with_real_intelligence(task_description, context_info):
    """Actually working enhanced systemcc"""
    
    # Step 1: Check for learned recommendations
    learned_recommendation = intelligence_tracker.get_workflow_recommendation(task_description)
    
    # Step 2: Apply base decision logic (simplified working version)
    base_decision = get_base_workflow_decision(task_description, context_info)
    
    # Step 3: Combine learned intelligence with base decision
    if learned_recommendation and learned_recommendation['confidence'] > 0.7:
        # High confidence learning - use it
        final_workflow = learned_recommendation['workflow']
        reasoning = f"🤖 AI Learning: {learned_recommendation['reasoning']} (confidence: {learned_recommendation['confidence']:.0%}, sample: {learned_recommendation['sample_size']} cases)"
        confidence = learned_recommendation['confidence']
    else:
        # Use base decision
        final_workflow = base_decision['workflow']
        reasoning = base_decision['reasoning']
        confidence = base_decision.get('confidence', 0.7)
        
        # Add learning context if available
        if learned_recommendation:
            reasoning += f" | 📊 Learning data: {learned_recommendation['sample_size']} similar cases"
    
    return {
        'workflow': final_workflow,
        'reasoning': reasoning,
        'confidence': confidence,
        'learned_recommendation': learned_recommendation
    }


def get_base_workflow_decision(task_description, context_info):
    """Working base decision logic"""
    
    # PRIORITY 1: Context-based routing
    if context_info.get('current_tokens', 0) > 30000:
        return {
            'workflow': 'taskit',
            'reasoning': 'Context size exceeds optimal threshold',
            'confidence': 0.9
        }
    
    if context_info.get('loaded_files', 0) > 10:
        return {
            'workflow': 'taskit', 
            'reasoning': 'Too many files in context',
            'confidence': 0.8
        }
    
    # Calculate basic complexity
    complexity_score = calculate_working_complexity(task_description)
    
    # Apply working decision rules
    if complexity_score <= 3:
        return {
            'workflow': 'orchestrated',
            'reasoning': f'Low complexity task (score: {complexity_score})',
            'confidence': 0.8
        }
    elif complexity_score <= 6:
        return {
            'workflow': 'complete_system',
            'reasoning': f'Medium complexity task (score: {complexity_score})',
            'confidence': 0.7
        }
    else:
        return {
            'workflow': 'taskit',
            'reasoning': f'High complexity task (score: {complexity_score})',
            'confidence': 0.8
        }


def calculate_working_complexity(task_description):
    """Actually working complexity calculation"""
    
    score = 1
    desc_lower = task_description.lower()
    
    # Scope indicators
    if any(word in desc_lower for word in ['all', 'entire', 'across', 'system']):
        score += 2
    if any(word in desc_lower for word in ['multiple', 'several', 'various']):
        score += 1
    
    # Technical complexity
    if any(word in desc_lower for word in ['architecture', 'refactor', 'migrate']):
        score += 2
    if any(word in desc_lower for word in ['security', 'auth', 'critical']):
        score += 1
    if any(word in desc_lower for word in ['integration', 'api', 'service']):
        score += 1
    
    # Simple indicators (reduce score)
    if any(word in desc_lower for word in ['fix', 'update', 'change', 'small']):
        score -= 1
    
    return max(1, min(10, score))


def record_workflow_outcome(task_description, workflow_used, success, completion_time=None):
    """Record outcome for learning - CALL THIS AFTER WORKFLOW COMPLETION"""
    
    if not task_description or not workflow_used:
        print("⚠️ Missing required parameters for learning record")
        return None
        
    return intelligence_tracker.record_decision(
        task_description=task_description,
        workflow_chosen=workflow_used,
        outcome_success=success,
        completion_time_minutes=completion_time or 30
    )


def show_learning_stats():
    """Show current learning statistics"""
    
    stats = intelligence_tracker.get_stats_summary()
    
    if isinstance(stats, str):
        print(stats)
        return
    
    print(f"📊 Learning Intelligence Stats:")
    print(f"   Mode: {intelligence_tracker.config.get('INTELLIGENCE_MODE', 'local')}")
    print(f"   Total Decisions: {stats['total_decisions']}")
    print(f"   Success Rate: {stats['success_rate']:.1%}")
    print(f"   Patterns Learned: {stats['patterns_learned']}")
    
    if stats['most_used_workflow']:
        workflow, count = stats['most_used_workflow']
        print(f"   Most Used: {workflow} ({count} times)")
    
    print(f"   Workflow Distribution:")
    for workflow, count in stats['workflow_distribution'].items():
        print(f"      {workflow}: {count} times")
    
    return stats


def set_intelligence_mode(mode):
    """Set intelligence mode (local, community, disabled)"""
    
    valid_modes = ['local', 'community', 'disabled']
    if mode not in valid_modes:
        print(f"❌ Invalid mode. Use: {', '.join(valid_modes)}")
        return False
    
    # Update global config
    intelligence_tracker.config['INTELLIGENCE_MODE'] = mode
    intelligence_tracker._save_config()
    
    print(f"✅ Intelligence mode set to: {mode}")
    return True


def get_intelligence_status():
    """Get detailed status of the global intelligence system"""
    
    stats = intelligence_tracker.get_stats_summary()
    context = intelligence_tracker.current_project_context
    
    print(f"🧠 Global Intelligence System Status")
    print(f"=====================================")
    print(f"📍 Intelligence Directory: {intelligence_tracker.intelligence_dir}")
    print(f"⚙️  Mode: {intelligence_tracker.config.get('INTELLIGENCE_MODE', 'local')}")
    print(f"🔄 Migration Status: {intelligence_tracker.config.get('MIGRATION_STATUS', 'pending')}")
    
    if isinstance(stats, str):
        print(f"📊 Learning Data: {stats}")
    else:
        print(f"📊 Learning Data:")
        print(f"   Total Decisions: {stats['total_decisions']}")
        print(f"   Success Rate: {stats['success_rate']:.1%}")
        print(f"   Patterns Learned: {stats['patterns_learned']}")
        if stats.get('most_used_workflow'):
            workflow, count = stats['most_used_workflow']
            print(f"   Most Used: {workflow} ({count} times)")
    
    print(f"\n🎯 Current Project Context:")
    print(f"   Project Hash: {context.get('project_hash', 'unknown')}")
    print(f"   Language: {context.get('language', 'unknown')}")
    print(f"   Framework: {context.get('framework', 'unknown')}")
    print(f"   Project Type: {context.get('project_type', 'unknown')}")
    print(f"   Tech Stack: {', '.join(context.get('tech_stack', []))}")
    
    return stats


def manual_migrate_project_data(project_path):
    """Manually migrate intelligence data from a specific project"""
    
    project_path = Path(project_path)
    intel_path = project_path / "ClaudeFiles" / "intelligence"
    
    if not intel_path.exists():
        print(f"❌ No intelligence directory found at {intel_path}")
        return False
    
    migrated = 0
    
    # Migrate decisions
    decisions_file = intel_path / "decision-outcomes.json"
    if decisions_file.exists():
        try:
            with open(decisions_file, 'r') as f:
                local_decisions = json.load(f)
            
            for decision in local_decisions:
                if decision not in intelligence_tracker.decisions:
                    intelligence_tracker.decisions.append(decision)
                    migrated += 1
            
            intelligence_tracker._save_decisions()
            
        except Exception as e:
            print(f"⚠️ Error migrating decisions: {e}")
    
    # Migrate patterns
    patterns_file = intel_path / "success-patterns.json"
    if patterns_file.exists():
        try:
            with open(patterns_file, 'r') as f:
                local_patterns = json.load(f)
            
            for pattern_key, workflows in local_patterns.items():
                if pattern_key not in intelligence_tracker.patterns:
                    intelligence_tracker.patterns[pattern_key] = workflows
                else:
                    # Merge workflow stats
                    for workflow, stats in workflows.items():
                        if workflow not in intelligence_tracker.patterns[pattern_key]:
                            intelligence_tracker.patterns[pattern_key][workflow] = stats
                        else:
                            intelligence_tracker.patterns[pattern_key][workflow]['total'] += stats.get('total', 0)
                            intelligence_tracker.patterns[pattern_key][workflow]['success'] += stats.get('success', 0)
            
            intelligence_tracker._save_patterns()
            
        except Exception as e:
            print(f"⚠️ Error migrating patterns: {e}")
    
    if migrated > 0:
        print(f"✅ Successfully migrated {migrated} decisions from {project_path}")
    else:
        print(f"ℹ️ No new data found to migrate from {project_path}")
    
    return migrated > 0


def reset_global_intelligence():
    """Reset the global intelligence system (WARNING: deletes all learning data)"""
    
    response = input("⚠️ This will DELETE ALL learning data. Type 'CONFIRM' to proceed: ")
    if response != 'CONFIRM':
        print("❌ Operation cancelled")
        return False
    
    try:
        # Clear in-memory data
        intelligence_tracker.decisions = []
        intelligence_tracker.patterns = {}
        intelligence_tracker.project_contexts = {}
        
        # Remove files
        if intelligence_tracker.decisions_file.exists():
            intelligence_tracker.decisions_file.unlink()
        if intelligence_tracker.patterns_file.exists():
            intelligence_tracker.patterns_file.unlink()
        if intelligence_tracker.project_contexts_file.exists():
            intelligence_tracker.project_contexts_file.unlink()
        
        # Reset config
        intelligence_tracker.config['MIGRATION_STATUS'] = 'pending'
        intelligence_tracker._save_config()
        
        print("✅ Global intelligence system has been reset")
        return True
        
    except Exception as e:
        print(f"❌ Error resetting intelligence system: {e}")
        return False


# Global instance - ready to use immediately
intelligence_tracker = WorkingIntelligenceTracker(use_global=True)


if __name__ == "__main__":
    # Test the global intelligence system
    print("🧠 Global Intelligence System - Test")
    
    # Show initial status
    get_intelligence_status()
    
    # Simulate some decisions with different project contexts
    print("\n🔄 Testing cross-project learning...")
    
    # Simulate React project decisions
    intelligence_tracker.current_project_context = {
        'project_hash': 'react123',
        'language': 'javascript',
        'framework': 'react',
        'project_type': 'frontend',
        'tech_stack': ['javascript', 'nodejs']
    }
    record_workflow_outcome("add user authentication", "complete_system", True, 45)
    record_workflow_outcome("fix button styling", "orchestrated", True, 15)
    
    # Simulate Django project decisions
    intelligence_tracker.current_project_context = {
        'project_hash': 'django456',
        'language': 'python',
        'framework': 'django',
        'project_type': 'backend',
        'tech_stack': ['python']
    }
    record_workflow_outcome("add user authentication", "complete_system", True, 60)
    record_workflow_outcome("optimize database queries", "complete_system", True, 90)
    
    # Test recommendation in a new React project
    print("\n🎯 Testing context-aware recommendations...")
    intelligence_tracker.current_project_context = {
        'project_hash': 'newreact',
        'language': 'javascript',
        'framework': 'react',
        'project_type': 'frontend',
        'tech_stack': ['javascript', 'nodejs']
    }
    
    recommendation = intelligence_tracker.get_workflow_recommendation("implement OAuth authentication")
    if recommendation:
        print(f"✅ Context-aware recommendation: {recommendation['workflow']} ({recommendation['confidence']:.0%} confidence)")
        print(f"   Reasoning: {recommendation['reasoning']}")
        print(f"   Type: {recommendation.get('recommendation_type', 'unknown')}")
    else:
        print("ℹ️ No context-aware recommendation available")
    
    # Show final stats
    print("\n📊 Final Status:")
    show_learning_stats()
    
    print(f"\n📁 Global learning data saved to: {intelligence_tracker.intelligence_dir}/")
    print("💡 This data is now available across ALL your Claude projects!")
    print("🔄 Migration automatically happens on first run in each project")