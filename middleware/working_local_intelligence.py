#!/usr/bin/env python3
"""
Working Local Intelligence System for /systemcc
REAL implementation that actually works and can be used immediately
"""

import json
import hashlib
import os
from datetime import datetime
from collections import defaultdict


class WorkingIntelligenceTracker:
    """Real implementation that actually works"""
    
    def __init__(self):
        self.intelligence_dir = "ClaudeFiles/intelligence"
        self.decisions_file = f"{self.intelligence_dir}/decision-outcomes.json"
        self.patterns_file = f"{self.intelligence_dir}/success-patterns.json"
        
        # Ensure directory exists
        os.makedirs(self.intelligence_dir, exist_ok=True)
        
        # Load existing data
        self.decisions = self._load_decisions()
        self.patterns = self._load_patterns()
    
    def record_decision(self, task_description, workflow_chosen, outcome_success, completion_time_minutes=30):
        """Record a real decision outcome"""
        
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
            'user_satisfaction': None  # Can be set later
        }
        
        # Store the decision
        self.decisions.append(decision_record)
        self._save_decisions()
        
        # Update success patterns
        self._update_success_patterns(task_features, workflow_chosen, outcome_success)
        
        print(f"✓ Recorded decision: {task_features['type']} → {workflow_chosen} ({'✓' if outcome_success else '✗'})")
        return decision_record
    
    def get_workflow_recommendation(self, task_description):
        """Get actual recommendation based on real data"""
        
        if not self.decisions:
            return None  # No data yet
        
        task_features = self._extract_task_features(task_description)
        
        # Find similar tasks
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
                'reasoning': f"Similar tasks succeeded {best_rate:.0%} with {best_workflow}"
            }
        
        return None
    
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
    
    def _load_decisions(self):
        """Load existing decisions"""
        if os.path.exists(self.decisions_file):
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
        if os.path.exists(self.patterns_file):
            try:
                with open(self.patterns_file, 'r') as f:
                    return json.load(f)
            except:
                return {}
        return {}
    
    def _save_decisions(self):
        """Save decisions to file"""
        with open(self.decisions_file, 'w') as f:
            json.dump(self.decisions, f, indent=2)
    
    def _save_patterns(self):
        """Save patterns to file"""
        with open(self.patterns_file, 'w') as f:
            json.dump(self.patterns, f, indent=2)
    
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
    print(f"   Total Decisions: {stats['total_decisions']}")
    print(f"   Success Rate: {stats['success_rate']:.1%}")
    print(f"   Patterns Learned: {stats['patterns_learned']}")
    
    if stats['most_used_workflow']:
        workflow, count = stats['most_used_workflow']
        print(f"   Most Used: {workflow} ({count} times)")
    
    print(f"   Workflow Distribution:")
    for workflow, count in stats['workflow_distribution'].items():
        print(f"      {workflow}: {count} times")


# Global instance - ready to use immediately
intelligence_tracker = WorkingIntelligenceTracker()


if __name__ == "__main__":
    # Test the system
    print("🧠 Working Local Intelligence System - Test")
    
    # Simulate some decisions
    record_workflow_outcome("add user authentication", "complete_system", True, 45)
    record_workflow_outcome("fix button color", "orchestrated", True, 10)
    record_workflow_outcome("add login system", "complete_system", True, 50)
    
    # Test recommendation
    recommendation = intelligence_tracker.get_workflow_recommendation("add OAuth authentication")
    if recommendation:
        print(f"✅ Recommendation: {recommendation['workflow']} ({recommendation['confidence']:.0%} confidence)")
    else:
        print("ℹ️ No recommendation yet (need more data)")
    
    # Show stats
    show_learning_stats()
    
    print(f"\n📁 Learning data saved to: {intelligence_tracker.intelligence_dir}/")
    print("💡 Commit these files to git to share anonymous learning data!")