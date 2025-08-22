#!/usr/bin/env python3
"""
Aggregate Intelligence Data from Multiple Users via Git
Run this script to improve systemcc with collective intelligence

Usage:
    python scripts/aggregate-intelligence.py
    python scripts/aggregate-intelligence.py --repo-path /path/to/repo
    python scripts/aggregate-intelligence.py --output improved_systemcc_rules.py
"""

import json
import glob
import os
import argparse
from collections import defaultdict


class IntelligenceAggregator:
    """Aggregate learning data from multiple git contributors"""
    
    def __init__(self):
        self.aggregated_patterns = defaultdict(lambda: defaultdict(lambda: {'total': 0, 'success': 0}))
        self.contributor_count = 0
    
    def aggregate_all_intelligence_files(self, repo_path="."):
        """Aggregate intelligence from all contributors"""
        
        # Find all intelligence files in the repo
        pattern_files = glob.glob(f"{repo_path}/**/ClaudeFiles/intelligence/success-patterns.json", recursive=True)
        decision_files = glob.glob(f"{repo_path}/**/ClaudeFiles/intelligence/decision-outcomes.json", recursive=True)
        
        print(f"🔍 Found {len(pattern_files)} pattern files and {len(decision_files)} decision files")
        
        contributors = set()
        
        # Aggregate patterns
        for pattern_file in pattern_files:
            contributor = self._get_contributor_id(pattern_file)
            if contributor:
                contributors.add(contributor)
            self._aggregate_pattern_file(pattern_file)
        
        # Aggregate decisions
        for decision_file in decision_files:
            contributor = self._get_contributor_id(decision_file)
            if contributor:
                contributors.add(contributor)
            self._aggregate_decision_file(decision_file)
        
        self.contributor_count = len(contributors)
        print(f"👥 Aggregated data from {self.contributor_count} contributors")
        
        # Generate improved decision rules
        improved_rules = self._generate_decision_rules()
        
        return improved_rules
    
    def _get_contributor_id(self, file_path):
        """Extract anonymous contributor ID from file path"""
        # Use directory structure to identify unique contributors
        # This preserves anonymity while counting unique contributions
        path_parts = file_path.split(os.sep)
        for i, part in enumerate(path_parts):
            if part == 'ClaudeFiles' and i > 0:
                return path_parts[i-1]  # Directory before ClaudeFiles
        return None
    
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
            print(f"⚠️ Error processing {pattern_file}: {e}")
    
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
                
                if workflow:  # Only process if workflow is specified
                    pattern_key = f"{task_type}_complexity_{complexity}"
                    
                    self.aggregated_patterns[pattern_key][workflow]['total'] += 1
                    if success:
                        self.aggregated_patterns[pattern_key][workflow]['success'] += 1
                    
        except Exception as e:
            print(f"⚠️ Error processing {decision_file}: {e}")
    
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
        
        # Sort by success rate and sample size
        rules.sort(key=lambda x: (x['success_rate'], x['sample_size']), reverse=True)
        
        return rules
    
    def save_improved_systemcc(self, rules, output_file="improved_systemcc_rules.py"):
        """Generate improved systemcc code with learned rules"""
        
        code_template = '''#!/usr/bin/env python3
"""
Auto-generated improved systemcc rules from collective intelligence
Generated from {total_rules} learned patterns across {contributors} contributors
Generated on: {timestamp}

Usage:
    from improved_systemcc_rules import apply_learned_intelligence
    
    # In your systemcc decision logic:
    base_decision = get_base_decision(task_description)
    enhanced_decision = apply_learned_intelligence(task_description, base_decision)
"""

import hashlib
from datetime import datetime

# Learned workflow rules from community data
LEARNED_WORKFLOW_RULES = {{
{rule_definitions}
}}

def extract_task_features(task_description):
    """Extract task features for pattern matching"""
    
    desc_lower = task_description.lower()
    
    # Task type classification (same logic as working system)
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
    
    # Complexity calculation (same logic as working system)
    complexity_score = 1
    if any(word in desc_lower for word in ['system', 'architecture', 'complex', 'enterprise']):
        complexity_score += 2
    if any(word in desc_lower for word in ['all', 'entire', 'across', 'multiple', 'throughout']):
        complexity_score += 2
    if any(word in desc_lower for word in ['security', 'critical', 'production', 'important']):
        complexity_score += 1
    if any(word in desc_lower for word in ['integration', 'migrate', 'deploy', 'configure']):
        complexity_score += 1
    
    return {{
        'type': task_type,
        'complexity': min(5, complexity_score)
    }}

def apply_learned_intelligence(task_description, base_decision):
    """Apply learned intelligence to workflow selection"""
    
    task_features = extract_task_features(task_description)
    pattern_key = f"{{task_features['type']}}_complexity_{{task_features['complexity']}}"
    
    if pattern_key in LEARNED_WORKFLOW_RULES:
        learned_rule = LEARNED_WORKFLOW_RULES[pattern_key]
        if learned_rule['confidence'] == 'high' and learned_rule['success_rate'] > 0.85:
            # High confidence rule - use it
            return {{
                'workflow': learned_rule['workflow'],
                'reasoning': f"🤖 Community Learning: {{learned_rule['success_rate']:.0%}} success rate from {{learned_rule['sample_size']}} cases",
                'confidence': learned_rule['success_rate'],
                'source': 'community_learning'
            }}
        elif learned_rule['confidence'] in ['high', 'medium'] and learned_rule['success_rate'] > 0.75:
            # Medium confidence - enhance base decision with learning data
            enhanced_reasoning = f"{{base_decision.get('reasoning', '')}} | 🤖 Community data: {{learned_rule['success_rate']:.0%}} success rate ({{learned_rule['sample_size']}} cases)"
            return {{
                'workflow': learned_rule['workflow'] if learned_rule['success_rate'] > 0.8 else base_decision.get('workflow'),
                'reasoning': enhanced_reasoning,
                'confidence': max(base_decision.get('confidence', 0.7), learned_rule['success_rate'] * 0.9),
                'source': 'enhanced_with_learning'
            }}
    
    # No learned rule or low confidence - return base decision
    return base_decision

def get_learning_stats():
    """Get statistics about learned rules"""
    
    return {{
        'total_rules': len(LEARNED_WORKFLOW_RULES),
        'high_confidence_rules': sum(1 for rule in LEARNED_WORKFLOW_RULES.values() if rule['confidence'] == 'high'),
        'contributors': {contributors},
        'generated': '{timestamp}'
    }}

if __name__ == "__main__":
    # Test the learned intelligence
    stats = get_learning_stats()
    print(f"📊 Learned Intelligence Stats:")
    print(f"   Total Rules: {{stats['total_rules']}}")
    print(f"   High Confidence: {{stats['high_confidence_rules']}}")
    print(f"   Contributors: {{stats['contributors']}}")
    print(f"   Generated: {{stats['generated']}}")
    
    # Show top rules
    print(f"\\n🏆 Top Learned Rules:")
    for pattern, rule in list(LEARNED_WORKFLOW_RULES.items())[:5]:
        print(f"   {{pattern}}: {{rule['workflow']}} ({{rule['success_rate']:.0%}}, {{rule['sample_size']}} cases)")
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
            contributors=self.contributor_count,
            timestamp=datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            rule_definitions=',\n'.join(rule_definitions)
        )
        
        with open(output_file, 'w') as f:
            f.write(final_code)
        
        return output_file
    
    def generate_report(self, rules):
        """Generate a human-readable report of learned patterns"""
        
        report = f"""
# Collective Intelligence Report
Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
Contributors: {self.contributor_count}
Learned Rules: {len(rules)}

## High-Confidence Patterns (>80% success rate)
"""
        
        high_confidence = [r for r in rules if r['confidence'] == 'high']
        
        for rule in high_confidence:
            report += f"""
### {rule['pattern'].replace('_', ' ').title()}
- **Workflow**: {rule['recommended_workflow']}
- **Success Rate**: {rule['success_rate']:.1%}
- **Sample Size**: {rule['sample_size']} cases
- **Confidence**: {rule['confidence']}
"""
        
        report += f"""
## Medium-Confidence Patterns (70-80% success rate)
"""
        
        medium_confidence = [r for r in rules if r['confidence'] == 'medium']
        
        for rule in medium_confidence:
            report += f"""
### {rule['pattern'].replace('_', ' ').title()}
- **Workflow**: {rule['recommended_workflow']}
- **Success Rate**: {rule['success_rate']:.1%} 
- **Sample Size**: {rule['sample_size']} cases
"""
        
        report += f"""
## Summary
- **Total Patterns**: {len(rules)}
- **High Confidence**: {len(high_confidence)}
- **Medium Confidence**: {len(medium_confidence)}
- **Contributors**: {self.contributor_count}

This data represents anonymized, aggregated learning from the Claude Agent System community.
No personal information, project details, or code specifics are included.
"""
        
        return report


def main():
    parser = argparse.ArgumentParser(description='Aggregate intelligence data from git contributors')
    parser.add_argument('--repo-path', default='.', help='Path to repository root')
    parser.add_argument('--output', default='improved_systemcc_rules.py', help='Output file for generated rules')
    parser.add_argument('--report', action='store_true', help='Generate human-readable report')
    
    args = parser.parse_args()
    
    print("🧠 Collective Intelligence Aggregator")
    print("=====================================")
    
    aggregator = IntelligenceAggregator()
    rules = aggregator.aggregate_all_intelligence_files(args.repo_path)
    
    if not rules:
        print("⚠️ No learning rules generated (insufficient data or low success rates)")
        return
    
    # Generate improved systemcc code
    output_file = aggregator.save_improved_systemcc(rules, args.output)
    
    print(f"✅ Generated {len(rules)} learned rules")
    print(f"📁 Improved systemcc code saved to: {output_file}")
    
    # Generate report if requested
    if args.report:
        report = aggregator.generate_report(rules)
        report_file = args.output.replace('.py', '_report.md')
        with open(report_file, 'w') as f:
            f.write(report)
        print(f"📊 Report saved to: {report_file}")
    
    # Display summary
    print(f"\n🏆 Top Learned Rules:")
    for i, rule in enumerate(rules[:5], 1):
        pattern_display = rule['pattern'].replace('_', ' ').title()
        print(f"   {i}. {pattern_display}: {rule['recommended_workflow']} ({rule['success_rate']:.0%}, {rule['sample_size']} cases)")
    
    if len(rules) > 5:
        print(f"   ... and {len(rules) - 5} more rules")


if __name__ == "__main__":
    main()