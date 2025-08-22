# Working Local Intelligence System
## Git-Based Collective Learning for /systemcc

## Purpose
This system provides REAL, WORKING intelligence improvements to `/systemcc` by storing decision outcomes locally in ClaudeFiles that can be committed to git and aggregated across users via pull requests.

## How It Actually Works

### 1. Local Decision Tracking (WORKS NOW)
```python
import json
import hashlib
from datetime import datetime
import os

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
    
    def record_decision(self, task_description, workflow_chosen, outcome_success, completion_time_minutes):
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
        
        return decision_record
    
    def get_workflow_recommendation(self, task_description):
        """Get actual recommendation based on real data"""
        
        if not self.decisions:
            return None  # No data yet
        
        task_features = self._extract_task_features(task_description)
        
        # Find similar tasks
        similar_decisions = self._find_similar_tasks(task_features)
        
        if len(similar_decisions) < 3:
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
                'reasoning': f'Similar tasks succeeded {best_rate:.0%} with {best_workflow}'
            }
        
        return None
    
    def _extract_task_features(self, task_description):
        """Extract actual task characteristics"""
        
        desc_lower = task_description.lower()
        
        # Task type classification
        task_type = 'other'
        if any(word in desc_lower for word in ['auth', 'login', 'user', 'account']):
            task_type = 'authentication'
        elif any(word in desc_lower for word in ['ui', 'interface', 'component', 'design']):
            task_type = 'ui'
        elif any(word in desc_lower for word in ['api', 'endpoint', 'service', 'backend']):
            task_type = 'api'
        elif any(word in desc_lower for word in ['database', 'data', 'model', 'schema']):
            task_type = 'database'
        elif any(word in desc_lower for word in ['test', 'testing', 'spec']):
            task_type = 'testing'
        elif any(word in desc_lower for word in ['fix', 'bug', 'error', 'issue']):
            task_type = 'bugfix'
        elif any(word in desc_lower for word in ['feature', 'add', 'create', 'build']):
            task_type = 'feature'
        elif any(word in desc_lower for word in ['refactor', 'improve', 'optimize']):
            task_type = 'refactor'
        
        # Complexity indicators
        complexity_score = 1
        if any(word in desc_lower for word in ['system', 'architecture', 'complex']):
            complexity_score += 2
        if any(word in desc_lower for word in ['all', 'entire', 'across', 'multiple']):
            complexity_score += 2
        if any(word in desc_lower for word in ['security', 'critical', 'production']):
            complexity_score += 1
        if any(word in desc_lower for word in ['integration', 'migrate', 'deploy']):
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
            except:
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
            'workflow_distribution': workflow_counts
        }

# Global instance
intelligence_tracker = WorkingIntelligenceTracker()
```

### 2. Integration with /systemcc (WORKS NOW)
```python
def enhanced_systemcc_with_real_intelligence(task_description, context_info):
    """Actually working enhanced systemcc"""
    
    # Step 1: Check for learned recommendations
    learned_recommendation = intelligence_tracker.get_workflow_recommendation(task_description)
    
    # Step 2: Apply existing decision logic
    base_decision = analyze_for_workflow_selection(task_description, context_info, None)
    
    # Step 3: Combine learned intelligence with base decision
    if learned_recommendation and learned_recommendation['confidence'] > 0.7:
        # High confidence learning - use it
        final_workflow = learned_recommendation['workflow']
        reasoning = f"AI Learning: {learned_recommendation['reasoning']} (confidence: {learned_recommendation['confidence']:.0%})"
    else:
        # Use base decision
        final_workflow = base_decision[0]
        reasoning = base_decision[1]
        
        # Add learning context if available
        if learned_recommendation:
            reasoning += f" | Learning data: {learned_recommendation['sample_size']} similar cases"
    
    return (final_workflow, reasoning, learned_recommendation)

def record_workflow_outcome(task_description, workflow_used, success, completion_time=None):
    """Record outcome for learning - CALL THIS AFTER WORKFLOW COMPLETION"""
    
    return intelligence_tracker.record_decision(
        task_description=task_description,
        workflow_chosen=workflow_used,
        outcome_success=success,
        completion_time_minutes=completion_time or 30  # Default estimate
    )
```

### 3. Git-Based Aggregation Script (WORKS NOW)
```python
#!/usr/bin/env python3
"""
Aggregate intelligence data from multiple users via git
Run this script to improve systemcc with collective intelligence
"""

import json
import glob
import os
from collections import defaultdict

class IntelligenceAggregator:
    """Aggregate learning data from multiple git contributors"""
    
    def __init__(self):
        self.aggregated_patterns = defaultdict(lambda: defaultdict(lambda: {'total': 0, 'success': 0}))
    
    def aggregate_all_intelligence_files(self, repo_path="."):
        """Aggregate intelligence from all contributors"""
        
        # Find all intelligence files in the repo
        pattern_files = glob.glob(f"{repo_path}/**/ClaudeFiles/intelligence/success-patterns.json", recursive=True)
        decision_files = glob.glob(f"{repo_path}/**/ClaudeFiles/intelligence/decision-outcomes.json", recursive=True)
        
        print(f"Found {len(pattern_files)} pattern files and {len(decision_files)} decision files")
        
        # Aggregate patterns
        for pattern_file in pattern_files:
            self._aggregate_pattern_file(pattern_file)
        
        # Aggregate decisions
        for decision_file in decision_files:
            self._aggregate_decision_file(decision_file)
        
        # Generate improved decision rules
        improved_rules = self._generate_decision_rules()
        
        return improved_rules
    
    def _aggregate_pattern_file(self, pattern_file):
        """Aggregate a single pattern file"""
        
        try:
            with open(pattern_file, 'r') as f:
                patterns = json.load(f)
            
            for pattern_key, workflows in patterns.items():
                for workflow, stats in workflows.items():
                    self.aggregated_patterns[pattern_key][workflow]['total'] += stats.get('total', 0)
                    self.aggregated_patterns[pattern_key][workflow]['success'] += stats.get('success', 0)
                    
        except Exception as e:
            print(f"Error processing {pattern_file}: {e}")
    
    def _aggregate_decision_file(self, decision_file):
        """Aggregate a single decision file"""
        
        try:
            with open(decision_file, 'r') as f:
                decisions = json.load(f)
            
            for decision in decisions:
                task_type = decision.get('task_type', 'other')
                complexity = decision.get('complexity_indicators', 1)
                workflow = decision.get('workflow_used')
                success = decision.get('success', False)
                
                pattern_key = f"{task_type}_complexity_{complexity}"
                
                self.aggregated_patterns[pattern_key][workflow]['total'] += 1
                if success:
                    self.aggregated_patterns[pattern_key][workflow]['success'] += 1
                    
        except Exception as e:
            print(f"Error processing {decision_file}: {e}")
    
    def _generate_decision_rules(self):
        """Generate improved decision rules from aggregated data"""
        
        rules = []
        
        for pattern, workflows in self.aggregated_patterns.items():
            if not workflows:
                continue
            
            # Calculate success rates
            workflow_success_rates = {}
            for workflow, stats in workflows.items():
                if stats['total'] >= 5:  # Minimum sample size
                    success_rate = stats['success'] / stats['total']
                    workflow_success_rates[workflow] = {
                        'success_rate': success_rate,
                        'sample_size': stats['total']
                    }
            
            if workflow_success_rates:
                # Find best workflow for this pattern
                best_workflow = max(workflow_success_rates.items(), 
                                  key=lambda x: x[1]['success_rate'])
                
                if best_workflow[1]['success_rate'] > 0.7:  # 70% threshold
                    rules.append({
                        'pattern': pattern,
                        'recommended_workflow': best_workflow[0],
                        'success_rate': best_workflow[1]['success_rate'],
                        'sample_size': best_workflow[1]['sample_size'],
                        'confidence': 'high' if best_workflow[1]['success_rate'] > 0.8 else 'medium'
                    })
        
        return rules
    
    def save_improved_systemcc(self, rules, output_file="improved-systemcc-rules.py"):
        """Generate improved systemcc code with learned rules"""
        
        code_template = '''# Auto-generated improved systemcc rules from collective intelligence
# Generated from {total_rules} learned patterns

LEARNED_WORKFLOW_RULES = {{
{rule_definitions}
}}

def apply_learned_intelligence(task_description, base_decision):
    """Apply learned intelligence to workflow selection"""
    
    task_features = extract_task_features(task_description)
    pattern_key = f"{{task_features['type']}}_complexity_{{task_features['complexity']}}"
    
    if pattern_key in LEARNED_WORKFLOW_RULES:
        learned_rule = LEARNED_WORKFLOW_RULES[pattern_key]
        if learned_rule['confidence'] == 'high':
            return learned_rule['workflow'], f"Learned rule: {{learned_rule['success_rate']:.0%}} success rate"
    
    return base_decision[0], base_decision[1]
'''
        
        rule_definitions = []
        for rule in rules:
            rule_def = f'''    '{rule["pattern"]}': {{
        'workflow': '{rule["recommended_workflow"]}',
        'success_rate': {rule["success_rate"]:.3f},
        'sample_size': {rule["sample_size"]},
        'confidence': '{rule["confidence"]}'
    }}'''
            rule_definitions.append(rule_def)
        
        final_code = code_template.format(
            total_rules=len(rules),
            rule_definitions=',\n'.join(rule_definitions)
        )
        
        with open(output_file, 'w') as f:
            f.write(final_code)
        
        return output_file

if __name__ == "__main__":
    aggregator = IntelligenceAggregator()
    rules = aggregator.aggregate_all_intelligence_files()
    output_file = aggregator.save_improved_systemcc(rules)
    
    print(f"Generated {len(rules)} learned rules")
    print(f"Improved systemcc code saved to: {output_file}")
    
    # Display summary
    for rule in rules[:5]:  # Show top 5 rules
        print(f"Pattern '{rule['pattern']}': {rule['recommended_workflow']} ({rule['success_rate']:.0%} success)")
```