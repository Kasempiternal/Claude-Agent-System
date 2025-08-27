"""
Decision Transparency and Explanation Engine

Comprehensive system for explaining mathematical workflow decisions with full transparency,
sensitivity analysis, and alternative scenario exploration.
"""

import math
import statistics
from typing import Dict, List, Tuple, Any, Optional
from dataclasses import dataclass
from enum import Enum

# Import our mathematical decision components
from .bayesian_decision_network import (
    BayesianWorkflowDecisionNetwork, DecisionResult as BayesianResult, WorkflowType
)
from .fuzzy_logic_decision import (
    FuzzyWorkflowDecisionSystem, FuzzyDecisionResult
)
from .complexity_algorithms import (
    TechnicalComplexityCalculator, ComplexityFactors
)
from .context_prediction_risk_assessment import (
    ContextLoadPredictor, RiskAssessmentEngine, ContextPrediction, RiskAssessment
)


class ExplanationLevel(Enum):
    """Levels of explanation detail"""
    MINIMAL = "minimal"
    STANDARD = "standard"
    DETAILED = "detailed"
    EXPERT = "expert"


@dataclass
class DecisionInput:
    """Input data for decision making"""
    task_description: str
    five_dimensional_scores: Dict[str, float]
    context_metrics: Dict[str, Any]
    project_metrics: Dict[str, Any]
    user_preferences: Optional[Dict[str, Any]] = None


@dataclass 
class DecisionExplanation:
    """Comprehensive decision explanation"""
    selected_workflow: WorkflowType
    overall_confidence: float
    
    # Mathematical analysis
    factor_contributions: Dict[str, Dict[str, Any]]
    decision_boundaries: Dict[str, Any]
    sensitivity_analysis: Dict[str, Any]
    alternative_scenarios: List[Dict[str, Any]]
    
    # Method-specific results
    bayesian_analysis: Dict[str, Any]
    fuzzy_analysis: Dict[str, Any]
    risk_analysis: Dict[str, Any]
    context_analysis: Dict[str, Any]
    
    # Transparency information
    mathematical_reasoning: str
    decision_tree: List[Dict[str, Any]]
    uncertainty_breakdown: Dict[str, Any]
    what_if_scenarios: List[Dict[str, Any]]


class DecisionTransparencyEngine:
    """
    Main engine for generating transparent, mathematical explanations of workflow decisions
    """
    
    def __init__(self):
        self.initialize_explanation_templates()
        self.initialize_sensitivity_parameters()
        
    def initialize_explanation_templates(self):
        """Initialize templates for different explanation levels"""
        
        self.explanation_templates = {
            ExplanationLevel.MINIMAL: {
                'sections': ['decision', 'confidence', 'key_factors'],
                'detail_level': 'summary',
                'include_math': False,
                'include_alternatives': False
            },
            ExplanationLevel.STANDARD: {
                'sections': ['decision', 'confidence', 'key_factors', 'reasoning', 'alternatives'],
                'detail_level': 'moderate',
                'include_math': True,
                'include_alternatives': True
            },
            ExplanationLevel.DETAILED: {
                'sections': ['decision', 'confidence', 'key_factors', 'reasoning', 'alternatives', 'sensitivity', 'scenarios'],
                'detail_level': 'comprehensive',
                'include_math': True,
                'include_alternatives': True
            },
            ExplanationLevel.EXPERT: {
                'sections': ['all'],
                'detail_level': 'complete',
                'include_math': True,
                'include_alternatives': True
            }
        }
    
    def initialize_sensitivity_parameters(self):
        """Initialize parameters for sensitivity analysis"""
        
        self.sensitivity_config = {
            'perturbation_ranges': [-0.3, -0.2, -0.1, 0.1, 0.2, 0.3],
            'stability_threshold': 0.15,
            'significant_change_threshold': 0.1,
            'confidence_intervals': [0.68, 0.95, 0.99]  # 1σ, 2σ, 3σ
        }
    
    def generate_comprehensive_explanation(self, 
                                         decision_input: DecisionInput,
                                         bayesian_result: BayesianResult,
                                         fuzzy_result: FuzzyDecisionResult,
                                         risk_assessment: RiskAssessment,
                                         context_prediction: ContextPrediction,
                                         explanation_level: ExplanationLevel = ExplanationLevel.STANDARD) -> DecisionExplanation:
        """
        Generate comprehensive explanation of the decision process
        """
        
        # Determine consensus decision and confidence
        consensus_decision, overall_confidence = self.determine_consensus(
            bayesian_result, fuzzy_result
        )
        
        # Analyze factor contributions
        factor_contributions = self.analyze_factor_contributions(
            decision_input.five_dimensional_scores, bayesian_result, fuzzy_result
        )
        
        # Analyze decision boundaries
        decision_boundaries = self.analyze_decision_boundaries(
            bayesian_result, fuzzy_result
        )
        
        # Perform sensitivity analysis
        sensitivity_analysis = self.perform_sensitivity_analysis(
            decision_input, bayesian_result
        )
        
        # Generate alternative scenarios
        alternative_scenarios = self.generate_alternative_scenarios(
            decision_input, bayesian_result, fuzzy_result
        )
        
        # Create method-specific analyses
        bayesian_analysis = self.create_bayesian_analysis(bayesian_result)
        fuzzy_analysis = self.create_fuzzy_analysis(fuzzy_result)
        risk_analysis = self.create_risk_analysis(risk_assessment)
        context_analysis = self.create_context_analysis(context_prediction)
        
        # Generate mathematical reasoning
        mathematical_reasoning = self.generate_mathematical_reasoning(
            decision_input, bayesian_result, fuzzy_result, explanation_level
        )
        
        # Create decision tree
        decision_tree = self.create_decision_tree(
            decision_input, factor_contributions
        )
        
        # Analyze uncertainty
        uncertainty_breakdown = self.analyze_uncertainty_breakdown(
            bayesian_result, fuzzy_result, risk_assessment
        )
        
        # Generate what-if scenarios
        what_if_scenarios = self.generate_what_if_scenarios(
            decision_input, sensitivity_analysis
        )
        
        return DecisionExplanation(
            selected_workflow=consensus_decision,
            overall_confidence=overall_confidence,
            factor_contributions=factor_contributions,
            decision_boundaries=decision_boundaries,
            sensitivity_analysis=sensitivity_analysis,
            alternative_scenarios=alternative_scenarios,
            bayesian_analysis=bayesian_analysis,
            fuzzy_analysis=fuzzy_analysis,
            risk_analysis=risk_analysis,
            context_analysis=context_analysis,
            mathematical_reasoning=mathematical_reasoning,
            decision_tree=decision_tree,
            uncertainty_breakdown=uncertainty_breakdown,
            what_if_scenarios=what_if_scenarios
        )
    
    def determine_consensus(self, bayesian_result: BayesianResult, 
                          fuzzy_result: FuzzyDecisionResult) -> Tuple[WorkflowType, float]:
        """Determine consensus decision between methods"""
        
        # If both methods agree
        if bayesian_result.workflow == fuzzy_result.workflow:
            # High confidence due to agreement
            consensus_confidence = min(0.95, 
                (bayesian_result.confidence + fuzzy_result.fuzzy_confidence) / 2 + 0.15
            )
            return bayesian_result.workflow, consensus_confidence
        
        # Methods disagree - use Bayesian but reduce confidence
        disagreement_penalty = 0.20
        consensus_confidence = max(0.30, bayesian_result.confidence - disagreement_penalty)
        
        return bayesian_result.workflow, consensus_confidence
    
    def analyze_factor_contributions(self, five_dim_scores: Dict[str, float],
                                   bayesian_result: BayesianResult,
                                   fuzzy_result: FuzzyDecisionResult) -> Dict[str, Dict[str, Any]]:
        """Analyze how each factor contributed to the decision"""
        
        contributions = {}
        
        for factor_name, score in five_dim_scores.items():
            # Calculate factor importance
            importance = self.calculate_factor_importance(factor_name, score, bayesian_result)
            
            # Determine impact direction
            impact_direction = "increases" if score > 0.5 else "decreases"
            complexity_level = self.classify_factor_level(score)
            
            # Calculate confidence in this factor's assessment
            factor_confidence = self.calculate_factor_confidence(factor_name, score)
            
            # Mathematical interpretation
            mathematical_impact = self.calculate_mathematical_impact(factor_name, score)
            
            contributions[factor_name] = {
                'score': score,
                'importance': importance,
                'impact_direction': impact_direction,
                'complexity_level': complexity_level,
                'confidence': factor_confidence,
                'mathematical_impact': mathematical_impact,
                'interpretation': self.interpret_factor_score(factor_name, score)
            }
        
        return contributions
    
    def calculate_factor_importance(self, factor_name: str, score: float, 
                                  bayesian_result: BayesianResult) -> float:
        """Calculate the importance of a factor in the decision"""
        
        # Factor importance weights (from domain knowledge)
        importance_weights = {
            'technical_complexity': 0.25,
            'scope_impact': 0.20,
            'risk_factor': 0.25,
            'context_load': 0.20,
            'time_pressure': 0.10
        }
        
        base_importance = importance_weights.get(factor_name, 0.15)
        
        # Adjust importance based on score extremity
        # Extreme scores (very high or very low) are more important
        extremity = abs(score - 0.5) * 2  # 0 to 1 scale
        adjusted_importance = base_importance + (extremity * 0.1)
        
        return min(1.0, adjusted_importance)
    
    def classify_factor_level(self, score: float) -> str:
        """Classify factor score into linguistic level"""
        
        if score >= 0.8:
            return "Very High"
        elif score >= 0.6:
            return "High"
        elif score >= 0.4:
            return "Medium"
        elif score >= 0.2:
            return "Low"
        else:
            return "Very Low"
    
    def calculate_factor_confidence(self, factor_name: str, score: float) -> float:
        """Calculate confidence in factor assessment"""
        
        # Higher confidence for factors with established mathematical models
        base_confidence = {
            'technical_complexity': 0.85,
            'scope_impact': 0.80,
            'risk_factor': 0.75,
            'context_load': 0.90,
            'time_pressure': 0.70
        }
        
        factor_confidence = base_confidence.get(factor_name, 0.75)
        
        # Reduce confidence for edge cases
        if score < 0.1 or score > 0.9:
            factor_confidence *= 0.9
        
        return factor_confidence
    
    def calculate_mathematical_impact(self, factor_name: str, score: float) -> Dict[str, Any]:
        """Calculate mathematical impact of factor"""
        
        # Different mathematical models for different factors
        if factor_name == 'technical_complexity':
            # Exponential impact model
            impact = 1 - math.exp(-3 * score)
            model = "Exponential decay model: impact = 1 - e^(-3x)"
        
        elif factor_name == 'scope_impact':
            # Logarithmic impact model
            impact = math.log(1 + score * (math.e - 1)) / math.log(math.e)
            model = "Logarithmic model: impact = ln(1 + x(e-1))/ln(e)"
        
        elif factor_name == 'risk_factor':
            # Sigmoid impact model
            impact = 1 / (1 + math.exp(-6 * (score - 0.5)))
            model = "Sigmoid model: impact = 1/(1 + e^(-6(x-0.5)))"
        
        elif factor_name == 'context_load':
            # Power law impact model
            impact = score ** 1.5
            model = "Power law model: impact = x^1.5"
        
        else:  # time_pressure
            # Linear impact model
            impact = score
            model = "Linear model: impact = x"
        
        return {
            'impact_value': impact,
            'mathematical_model': model,
            'normalized_contribution': impact / (sum([score ** 1.2 for score in [0.7, 0.6, 0.5, 0.4, 0.3]]) / 5)
        }
    
    def interpret_factor_score(self, factor_name: str, score: float) -> str:
        """Generate human-readable interpretation of factor score"""
        
        level = self.classify_factor_level(score)
        
        interpretations = {
            'technical_complexity': {
                'Very High': "Requires deep technical expertise, complex algorithms, and sophisticated architecture",
                'High': "Involves advanced technical concepts and significant implementation complexity", 
                'Medium': "Moderate technical complexity with standard patterns and approaches",
                'Low': "Straightforward implementation using well-established techniques",
                'Very Low': "Minimal technical complexity, mostly configuration or simple changes"
            },
            'scope_impact': {
                'Very High': "Affects entire system architecture, multiple modules, and numerous files",
                'High': "Impacts several system components and requires coordination across modules",
                'Medium': "Affects a few related components with some cross-module dependencies", 
                'Low': "Limited to specific components with minimal cross-system impact",
                'Very Low': "Isolated changes with no significant system-wide effects"
            },
            'risk_factor': {
                'Very High': "Critical risk requiring comprehensive validation and careful rollback planning",
                'High': "Significant risk factors present, thorough testing and monitoring required",
                'Medium': "Moderate risks that can be managed with standard safety practices",
                'Low': "Low risk with minimal potential for negative impact",
                'Very Low': "Negligible risk, safe to implement with basic validation"
            },
            'context_load': {
                'Very High': "Will consume substantial context, phase-based execution mandatory",
                'High': "Heavy context usage expected, context management strategies needed",
                'Medium': "Moderate context consumption, monitoring advised",
                'Low': "Minimal context growth expected, standard execution suitable",
                'Very Low': "Negligible context impact, no special handling required"
            },
            'time_pressure': {
                'Very High': "Critical urgency, immediate execution required",
                'High': "High urgency, expedited execution preferred", 
                'Medium': "Moderate time pressure, standard execution timeline",
                'Low': "Relaxed timeline, quality prioritized over speed",
                'Very Low': "No time pressure, thorough approach recommended"
            }
        }
        
        return interpretations.get(factor_name, {}).get(level, f"{level} {factor_name}")
    
    def analyze_decision_boundaries(self, bayesian_result: BayesianResult,
                                  fuzzy_result: FuzzyDecisionResult) -> Dict[str, Any]:
        """Analyze how close the decision was to alternatives"""
        
        # Bayesian decision boundaries
        bayesian_alternatives = dict(bayesian_result.alternatives)
        bayesian_margin = bayesian_result.decision_margin
        
        # Fuzzy decision boundaries
        fuzzy_alternatives = {k.value: v for k, v in fuzzy_result.defuzzified_scores.items() 
                            if k != fuzzy_result.workflow}
        
        best_alternative = None
        alternative_gap = float('inf')
        
        if bayesian_alternatives:
            best_alt_name, best_alt_score = max(bayesian_alternatives.items(), 
                                              key=lambda x: x[1])
            alternative_gap = bayesian_result.confidence - best_alt_score
            best_alternative = best_alt_name
        
        return {
            'decision_margin': bayesian_margin,
            'best_alternative': best_alternative,
            'alternative_gap': alternative_gap,
            'boundary_stability': self.classify_boundary_stability(bayesian_margin),
            'consensus_level': self.calculate_consensus_level(bayesian_result, fuzzy_result),
            'bayesian_alternatives': bayesian_alternatives,
            'fuzzy_alternatives': fuzzy_alternatives
        }
    
    def classify_boundary_stability(self, decision_margin: float) -> str:
        """Classify decision boundary stability"""
        
        if decision_margin >= 0.4:
            return "Very Stable"
        elif decision_margin >= 0.25:
            return "Stable"
        elif decision_margin >= 0.15:
            return "Moderately Stable"
        elif decision_margin >= 0.08:
            return "Unstable"
        else:
            return "Very Unstable"
    
    def calculate_consensus_level(self, bayesian_result: BayesianResult,
                                fuzzy_result: FuzzyDecisionResult) -> str:
        """Calculate consensus level between methods"""
        
        if bayesian_result.workflow == fuzzy_result.workflow:
            confidence_diff = abs(bayesian_result.confidence - fuzzy_result.fuzzy_confidence)
            
            if confidence_diff <= 0.1:
                return "Strong Consensus"
            elif confidence_diff <= 0.2:
                return "Good Consensus"
            else:
                return "Weak Consensus"
        else:
            return "No Consensus"
    
    def perform_sensitivity_analysis(self, decision_input: DecisionInput,
                                   bayesian_result: BayesianResult) -> Dict[str, Any]:
        """Perform comprehensive sensitivity analysis"""
        
        base_scores = decision_input.five_dimensional_scores
        sensitivity_results = {}
        
        for factor_name, base_score in base_scores.items():
            factor_sensitivity = self.analyze_factor_sensitivity(
                factor_name, base_score, decision_input, bayesian_result
            )
            sensitivity_results[factor_name] = factor_sensitivity
        
        # Overall sensitivity metrics
        overall_sensitivity = self.calculate_overall_sensitivity(sensitivity_results)
        
        return {
            'factor_sensitivities': sensitivity_results,
            'overall_stability': overall_sensitivity['stability'],
            'most_sensitive_factor': overall_sensitivity['most_sensitive'],
            'least_sensitive_factor': overall_sensitivity['least_sensitive'],
            'stability_classification': self.classify_decision_stability(overall_sensitivity['stability'])
        }
    
    def analyze_factor_sensitivity(self, factor_name: str, base_score: float,
                                 decision_input: DecisionInput,
                                 base_result: BayesianResult) -> Dict[str, Any]:
        """Analyze sensitivity of decision to changes in one factor"""
        
        perturbation_results = []
        
        for perturbation in self.sensitivity_config['perturbation_ranges']:
            perturbed_score = max(0.0, min(1.0, base_score + perturbation))
            
            # Create modified input
            modified_scores = decision_input.five_dimensional_scores.copy()
            modified_scores[factor_name] = perturbed_score
            
            # Simulate decision with modified input
            # (In practice, you'd re-run the Bayesian network)
            simulated_result = self.simulate_decision_change(
                base_result, factor_name, perturbation
            )
            
            perturbation_results.append({
                'perturbation': perturbation,
                'new_score': perturbed_score,
                'workflow_changed': simulated_result['workflow'] != base_result.workflow,
                'confidence_change': simulated_result['confidence'] - base_result.confidence,
                'new_workflow': simulated_result['workflow']
            })
        
        # Calculate sensitivity metrics
        workflow_changes = sum(1 for r in perturbation_results if r['workflow_changed'])
        avg_confidence_change = statistics.mean([abs(r['confidence_change']) 
                                               for r in perturbation_results])
        
        sensitivity_score = (workflow_changes / len(perturbation_results)) + (avg_confidence_change * 0.5)
        
        return {
            'sensitivity_score': sensitivity_score,
            'perturbation_results': perturbation_results,
            'workflow_change_frequency': workflow_changes / len(perturbation_results),
            'average_confidence_impact': avg_confidence_change,
            'sensitivity_level': self.classify_sensitivity_level(sensitivity_score)
        }
    
    def simulate_decision_change(self, base_result: BayesianResult, 
                               factor_name: str, perturbation: float) -> Dict[str, Any]:
        """Simulate how decision would change with factor perturbation"""
        
        # Simplified simulation - in practice you'd re-run the full decision process
        # This approximates the change based on factor importance
        
        factor_importance = {
            'technical_complexity': 0.25,
            'scope_impact': 0.20, 
            'risk_factor': 0.30,
            'context_load': 0.20,
            'time_pressure': 0.05
        }.get(factor_name, 0.15)
        
        # Estimate confidence change
        confidence_change = perturbation * factor_importance * 0.5
        new_confidence = max(0.1, min(0.95, base_result.confidence + confidence_change))
        
        # Estimate workflow change probability
        workflow_change_threshold = 0.15  # Threshold for workflow change
        workflow_changed = abs(confidence_change) > workflow_change_threshold
        
        if workflow_changed:
            # Pick alternative workflow (simplified)
            alternatives = dict(base_result.alternatives) if base_result.alternatives else {}
            new_workflow = max(alternatives, key=alternatives.get) if alternatives else base_result.workflow
        else:
            new_workflow = base_result.workflow
        
        return {
            'workflow': new_workflow,
            'confidence': new_confidence,
            'workflow_changed': workflow_changed
        }
    
    def calculate_overall_sensitivity(self, sensitivity_results: Dict[str, Dict[str, Any]]) -> Dict[str, Any]:
        """Calculate overall sensitivity metrics"""
        
        factor_scores = [(name, data['sensitivity_score']) 
                        for name, data in sensitivity_results.items()]
        
        overall_score = statistics.mean([score for _, score in factor_scores])
        
        most_sensitive = max(factor_scores, key=lambda x: x[1])
        least_sensitive = min(factor_scores, key=lambda x: x[1])
        
        return {
            'stability': 1.0 - overall_score,  # Inverse of sensitivity
            'most_sensitive': most_sensitive[0],
            'least_sensitive': least_sensitive[0]
        }
    
    def classify_sensitivity_level(self, sensitivity_score: float) -> str:
        """Classify sensitivity level"""
        
        if sensitivity_score >= 0.7:
            return "Very High Sensitivity"
        elif sensitivity_score >= 0.5:
            return "High Sensitivity"
        elif sensitivity_score >= 0.3:
            return "Moderate Sensitivity"
        elif sensitivity_score >= 0.15:
            return "Low Sensitivity"
        else:
            return "Very Low Sensitivity"
    
    def classify_decision_stability(self, stability_score: float) -> str:
        """Classify overall decision stability"""
        
        if stability_score >= 0.85:
            return "Very Stable"
        elif stability_score >= 0.70:
            return "Stable"
        elif stability_score >= 0.55:
            return "Moderately Stable"
        elif stability_score >= 0.40:
            return "Unstable"
        else:
            return "Very Unstable"
    
    def generate_alternative_scenarios(self, decision_input: DecisionInput,
                                     bayesian_result: BayesianResult,
                                     fuzzy_result: FuzzyDecisionResult) -> List[Dict[str, Any]]:
        """Generate alternative scenarios and their outcomes"""
        
        scenarios = []
        
        # Scenario 1: What if time pressure was higher?
        high_urgency_scenario = self.create_scenario(
            "High Urgency",
            "If time pressure was critical (0.9 instead of current)",
            {'time_pressure': 0.9},
            decision_input,
            bayesian_result
        )
        scenarios.append(high_urgency_scenario)
        
        # Scenario 2: What if complexity was lower?
        simple_scenario = self.create_scenario(
            "Simplified Task", 
            "If technical complexity was low (0.2 instead of current)",
            {'technical_complexity': 0.2},
            decision_input,
            bayesian_result
        )
        scenarios.append(simple_scenario)
        
        # Scenario 3: What if risk was higher?
        high_risk_scenario = self.create_scenario(
            "High Risk",
            "If risk factor was very high (0.9 instead of current)",
            {'risk_factor': 0.9},
            decision_input,
            bayesian_result
        )
        scenarios.append(high_risk_scenario)
        
        # Scenario 4: What if scope was broader?
        broad_scope_scenario = self.create_scenario(
            "Broader Scope",
            "If scope impact was very high (0.9 instead of current)",
            {'scope_impact': 0.9},
            decision_input,
            bayesian_result
        )
        scenarios.append(broad_scope_scenario)
        
        return scenarios
    
    def create_scenario(self, name: str, description: str, 
                       factor_changes: Dict[str, float],
                       decision_input: DecisionInput,
                       base_result: BayesianResult) -> Dict[str, Any]:
        """Create a single alternative scenario"""
        
        # Apply changes to create scenario
        modified_scores = decision_input.five_dimensional_scores.copy()
        modified_scores.update(factor_changes)
        
        # Simulate decision for scenario
        scenario_result = self.simulate_scenario_decision(modified_scores, base_result)
        
        return {
            'name': name,
            'description': description,
            'factor_changes': factor_changes,
            'resulting_workflow': scenario_result['workflow'],
            'resulting_confidence': scenario_result['confidence'],
            'workflow_changed': scenario_result['workflow'] != base_result.workflow,
            'confidence_change': scenario_result['confidence'] - base_result.confidence,
            'key_insights': self.generate_scenario_insights(scenario_result, base_result)
        }
    
    def simulate_scenario_decision(self, modified_scores: Dict[str, float],
                                 base_result: BayesianResult) -> Dict[str, Any]:
        """Simulate decision for alternative scenario"""
        
        # Simplified scenario simulation
        # In practice, you'd run the full decision pipeline
        
        # Calculate aggregate change
        total_change = sum(abs(modified_scores.get(f, 0.5) - 0.5) for f in modified_scores.keys())
        normalized_change = total_change / len(modified_scores)
        
        # Estimate new confidence
        confidence_adjustment = (normalized_change - 0.5) * 0.4  # Scale factor
        new_confidence = max(0.1, min(0.95, base_result.confidence + confidence_adjustment))
        
        # Determine workflow based on key factor thresholds
        if modified_scores.get('context_load', 0) > 0.7:
            new_workflow = WorkflowType.TASKIT
        elif modified_scores.get('risk_factor', 0) > 0.7:
            new_workflow = WorkflowType.COMPLETE_SYSTEM
        elif modified_scores.get('technical_complexity', 0) < 0.3 and modified_scores.get('scope_impact', 0) < 0.3:
            new_workflow = WorkflowType.ORCHESTRATED
        else:
            new_workflow = base_result.workflow  # Keep original
        
        return {
            'workflow': new_workflow,
            'confidence': new_confidence
        }
    
    def generate_scenario_insights(self, scenario_result: Dict[str, Any],
                                 base_result: BayesianResult) -> List[str]:
        """Generate insights from scenario analysis"""
        
        insights = []
        
        if scenario_result['workflow'] != base_result.workflow:
            insights.append(f"Workflow would change to {scenario_result['workflow'].value}")
        
        confidence_change = scenario_result['confidence'] - base_result.confidence
        if abs(confidence_change) > 0.1:
            direction = "increase" if confidence_change > 0 else "decrease"
            insights.append(f"Confidence would {direction} by {abs(confidence_change):.2f}")
        
        if scenario_result['confidence'] > 0.8:
            insights.append("High confidence decision under this scenario")
        elif scenario_result['confidence'] < 0.5:
            insights.append("Low confidence decision under this scenario")
        
        return insights
    
    def create_bayesian_analysis(self, bayesian_result: BayesianResult) -> Dict[str, Any]:
        """Create structured Bayesian analysis"""
        
        return {
            'selected_workflow': bayesian_result.workflow.value,
            'confidence': bayesian_result.confidence,
            'decision_margin': bayesian_result.decision_margin,
            'uncertainty': bayesian_result.uncertainty,
            'posterior_probabilities': {k.value: v for k, v in bayesian_result.posterior_probabilities.items()},
            'alternatives': [(alt.value, prob) for alt, prob in bayesian_result.alternatives],
            'method': 'Bayesian Network with Conditional Probability Tables',
            'mathematical_basis': 'Bayes\' Theorem: P(Workflow|Evidence) ∝ P(Evidence|Workflow) × P(Workflow)'
        }
    
    def create_fuzzy_analysis(self, fuzzy_result: FuzzyDecisionResult) -> Dict[str, Any]:
        """Create structured fuzzy analysis"""
        
        return {
            'selected_workflow': fuzzy_result.workflow.value,
            'fuzzy_confidence': fuzzy_result.fuzzy_confidence,
            'linguistic_interpretation': fuzzy_result.linguistic_interpretation,
            'rule_activations': fuzzy_result.rule_activations,
            'defuzzified_scores': {k.value: v for k, v in fuzzy_result.defuzzified_scores.items()},
            'method': 'Mamdani Fuzzy Inference System',
            'mathematical_basis': 'Fuzzy Set Theory with Triangular Membership Functions'
        }
    
    def create_risk_analysis(self, risk_assessment: RiskAssessment) -> Dict[str, Any]:
        """Create structured risk analysis"""
        
        return {
            'overall_risk_score': risk_assessment.overall_risk_score,
            'risk_level': risk_assessment.risk_level.value,
            'value_at_risk_95': risk_assessment.value_at_risk_95,
            'expected_risk': risk_assessment.expected_risk,
            'risk_categories': risk_assessment.risk_categories,
            'top_risk_factors': [
                {'name': rf.name, 'probability': rf.probability, 'impact': rf.impact}
                for rf in sorted(risk_assessment.risk_factors, 
                               key=lambda x: x.probability * x.impact, reverse=True)[:3]
            ],
            'method': 'Monte Carlo Risk Simulation',
            'mathematical_basis': 'Monte Carlo simulation with correlated risk factors'
        }
    
    def create_context_analysis(self, context_prediction: ContextPrediction) -> Dict[str, Any]:
        """Create structured context analysis"""
        
        return {
            'predicted_final_tokens': context_prediction.predicted_final_tokens,
            'predicted_file_additions': context_prediction.predicted_file_additions,
            'confidence_interval': context_prediction.growth_confidence_interval,
            'overflow_probability': context_prediction.context_overflow_probability,
            'recommendation': context_prediction.recommended_context_management,
            'method': 'Statistical Context Growth Modeling',
            'mathematical_basis': 'Monte Carlo simulation with exponential smoothing'
        }
    
    def generate_mathematical_reasoning(self, decision_input: DecisionInput,
                                      bayesian_result: BayesianResult,
                                      fuzzy_result: FuzzyDecisionResult,
                                      explanation_level: ExplanationLevel) -> str:
        """Generate comprehensive mathematical reasoning explanation"""
        
        reasoning = f"""
═══════════════════════════════════════════════════════════════
🧮 MATHEMATICAL DECISION ANALYSIS
═══════════════════════════════════════════════════════════════

🎯 SELECTED WORKFLOW: {bayesian_result.workflow.value.upper()}
📊 OVERALL CONFIDENCE: {bayesian_result.confidence:.1%}

📐 FIVE-DIMENSIONAL ANALYSIS:
"""
        
        for factor_name, score in decision_input.five_dimensional_scores.items():
            factor_display = factor_name.replace('_', ' ').title()
            level = self.classify_factor_level(score)
            reasoning += f"  • {factor_display}: {score:.3f} ({level})\n"
        
        reasoning += f"""
🔬 BAYESIAN INFERENCE:
  • Method: Conditional Probability Tables with Bayes' Theorem
  • Prior Distribution: Historical workflow usage patterns
  • Likelihood Calculation: P(Evidence|Workflow) for each workflow type
  • Posterior: P(Workflow|Evidence) ∝ P(Evidence|Workflow) × P(Workflow)
  • Decision Margin: {bayesian_result.decision_margin:.3f}

🌊 FUZZY LOGIC ANALYSIS:
  • Method: Mamdani Inference with Triangular Membership Functions
  • Linguistic Variables: {len(fuzzy_result.linguistic_interpretation)} factors fuzzified
  • Active Rules: {len(fuzzy_result.rule_activations)} rules fired
  • Defuzzification: Weighted average method
  • Fuzzy Confidence: {fuzzy_result.fuzzy_confidence:.1%}

⚖️ CONSENSUS DECISION:
  • Method Agreement: {"✓" if bayesian_result.workflow == fuzzy_result.workflow else "✗"}
  • Confidence Alignment: {abs(bayesian_result.confidence - fuzzy_result.fuzzy_confidence):.3f} difference
  • Final Confidence: {bayesian_result.confidence:.1%}
"""
        
        if explanation_level in [ExplanationLevel.DETAILED, ExplanationLevel.EXPERT]:
            reasoning += f"""
📊 STATISTICAL ANALYSIS:
  • Entropy of Decision: {self.calculate_decision_entropy(bayesian_result):.3f} bits
  • Gini Impurity: {self.calculate_gini_impurity(bayesian_result):.3f}
  • Information Gain: {self.calculate_information_gain(bayesian_result):.3f}

🔍 MATHEMATICAL MODELS USED:
  1. Technical Complexity: Exponential impact model
  2. Scope Impact: Logarithmic scaling model  
  3. Risk Factor: Sigmoid activation function
  4. Context Load: Power law growth model
  5. Time Pressure: Linear scaling model
"""
        
        reasoning += "═══════════════════════════════════════════════════════════════"
        
        return reasoning
    
    def calculate_decision_entropy(self, bayesian_result: BayesianResult) -> float:
        """Calculate Shannon entropy of decision"""
        
        probabilities = list(bayesian_result.posterior_probabilities.values())
        entropy = -sum(p * math.log2(p) for p in probabilities if p > 0)
        return entropy
    
    def calculate_gini_impurity(self, bayesian_result: BayesianResult) -> float:
        """Calculate Gini impurity of decision"""
        
        probabilities = list(bayesian_result.posterior_probabilities.values())
        gini = 1 - sum(p ** 2 for p in probabilities)
        return gini
    
    def calculate_information_gain(self, bayesian_result: BayesianResult) -> float:
        """Calculate information gain from decision"""
        
        # Maximum entropy (uniform distribution)
        n_workflows = len(bayesian_result.posterior_probabilities)
        max_entropy = math.log2(n_workflows)
        
        # Actual entropy
        actual_entropy = self.calculate_decision_entropy(bayesian_result)
        
        # Information gain
        return max_entropy - actual_entropy
    
    def create_decision_tree(self, decision_input: DecisionInput,
                           factor_contributions: Dict[str, Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Create decision tree representation"""
        
        tree_nodes = []
        
        # Sort factors by importance
        sorted_factors = sorted(
            factor_contributions.items(),
            key=lambda x: x[1]['importance'],
            reverse=True
        )
        
        for i, (factor_name, contribution) in enumerate(sorted_factors):
            node = {
                'level': i,
                'factor': factor_name.replace('_', ' ').title(),
                'score': contribution['score'],
                'threshold_analysis': self.analyze_decision_thresholds(factor_name, contribution['score']),
                'split_criterion': self.determine_split_criterion(factor_name, contribution['score']),
                'information_gain': contribution['importance']
            }
            tree_nodes.append(node)
        
        return tree_nodes
    
    def analyze_decision_thresholds(self, factor_name: str, score: float) -> Dict[str, Any]:
        """Analyze decision thresholds for factor"""
        
        # Define workflow thresholds for each factor
        thresholds = {
            'technical_complexity': {
                'orchestrated': (0.0, 0.35),
                'complete_system': (0.3, 0.8), 
                'taskit': (0.7, 1.0)
            },
            'risk_factor': {
                'orchestrated': (0.0, 0.3),
                'complete_system': (0.25, 1.0),
                'taskit': (0.0, 0.6)
            },
            'context_load': {
                'orchestrated': (0.0, 0.4),
                'complete_system': (0.0, 0.7),
                'taskit': (0.6, 1.0)
            }
        }
        
        factor_thresholds = thresholds.get(factor_name, {})
        
        # Determine which threshold ranges the score falls into
        applicable_workflows = []
        for workflow, (min_val, max_val) in factor_thresholds.items():
            if min_val <= score <= max_val:
                applicable_workflows.append(workflow)
        
        return {
            'applicable_workflows': applicable_workflows,
            'threshold_ranges': factor_thresholds,
            'score_position': f"Falls in range for: {', '.join(applicable_workflows)}"
        }
    
    def determine_split_criterion(self, factor_name: str, score: float) -> str:
        """Determine decision tree split criterion"""
        
        if score < 0.33:
            return f"{factor_name} ≤ 0.33 (Low)"
        elif score < 0.67:
            return f"0.33 < {factor_name} ≤ 0.67 (Medium)"
        else:
            return f"{factor_name} > 0.67 (High)"
    
    def analyze_uncertainty_breakdown(self, bayesian_result: BayesianResult,
                                    fuzzy_result: FuzzyDecisionResult,
                                    risk_assessment: RiskAssessment) -> Dict[str, Any]:
        """Analyze sources of uncertainty in the decision"""
        
        return {
            'bayesian_uncertainty': bayesian_result.uncertainty,
            'fuzzy_uncertainty': 1.0 - fuzzy_result.fuzzy_confidence,
            'method_disagreement': 0.2 if bayesian_result.workflow != fuzzy_result.workflow else 0.0,
            'risk_uncertainty': risk_assessment.value_at_risk_95 - risk_assessment.expected_risk,
            'decision_boundary_uncertainty': 1.0 - bayesian_result.decision_margin,
            'total_uncertainty': self.calculate_total_uncertainty(
                bayesian_result, fuzzy_result, risk_assessment
            ),
            'uncertainty_sources': self.identify_uncertainty_sources(
                bayesian_result, fuzzy_result
            )
        }
    
    def calculate_total_uncertainty(self, bayesian_result: BayesianResult,
                                  fuzzy_result: FuzzyDecisionResult,
                                  risk_assessment: RiskAssessment) -> float:
        """Calculate total uncertainty across all methods"""
        
        uncertainties = [
            bayesian_result.uncertainty,
            1.0 - fuzzy_result.fuzzy_confidence,
            risk_assessment.value_at_risk_95 - risk_assessment.expected_risk
        ]
        
        # Use root mean square to combine uncertainties
        total_uncertainty = math.sqrt(sum(u ** 2 for u in uncertainties) / len(uncertainties))
        
        return min(1.0, total_uncertainty)
    
    def identify_uncertainty_sources(self, bayesian_result: BayesianResult,
                                   fuzzy_result: FuzzyDecisionResult) -> List[str]:
        """Identify primary sources of uncertainty"""
        
        sources = []
        
        if bayesian_result.decision_margin < 0.2:
            sources.append("Close decision boundary between alternative workflows")
        
        if bayesian_result.workflow != fuzzy_result.workflow:
            sources.append("Disagreement between Bayesian and Fuzzy methods")
        
        if bayesian_result.uncertainty > 0.3:
            sources.append("High inherent uncertainty in Bayesian posterior")
        
        if fuzzy_result.fuzzy_confidence < 0.7:
            sources.append("Low confidence from fuzzy inference system")
        
        if not sources:
            sources.append("Low uncertainty - high confidence decision")
        
        return sources
    
    def generate_what_if_scenarios(self, decision_input: DecisionInput,
                                 sensitivity_analysis: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate what-if scenarios based on sensitivity analysis"""
        
        scenarios = []
        
        # Most sensitive factor scenario
        most_sensitive = sensitivity_analysis['most_sensitive_factor']
        scenarios.append({
            'name': f"Optimize {most_sensitive.replace('_', ' ').title()}",
            'description': f"What if we could reduce {most_sensitive} by focusing on simplification?",
            'impact': "Could potentially change workflow recommendation",
            'actionable_steps': self.generate_actionable_steps(most_sensitive)
        })
        
        # Least sensitive factor scenario
        least_sensitive = sensitivity_analysis['least_sensitive_factor']
        scenarios.append({
            'name': f"Ignore {least_sensitive.replace('_', ' ').title()}",
            'description': f"What if {least_sensitive} was not a constraint?",
            'impact': "Unlikely to significantly change recommendation",
            'actionable_steps': ["Focus optimization efforts elsewhere"]
        })
        
        # Stability improvement scenario
        scenarios.append({
            'name': "Improve Decision Stability",
            'description': "What changes would make this decision more stable?",
            'impact': f"Current stability: {sensitivity_analysis['overall_stability']:.1%}",
            'actionable_steps': self.generate_stability_improvements(sensitivity_analysis)
        })
        
        return scenarios
    
    def generate_actionable_steps(self, factor_name: str) -> List[str]:
        """Generate actionable steps for factor optimization"""
        
        steps = {
            'technical_complexity': [
                "Break down complex requirements into simpler components",
                "Use established patterns and libraries where possible",
                "Consider incremental implementation approach"
            ],
            'scope_impact': [
                "Narrow the scope to essential features only",
                "Phase the implementation across multiple iterations",
                "Identify components that can be implemented independently"
            ],
            'risk_factor': [
                "Implement comprehensive testing strategy",
                "Add rollback mechanisms and monitoring",
                "Consider feature flags for gradual rollout"
            ],
            'context_load': [
                "Break task into smaller, focused subtasks",
                "Clean up unnecessary context before starting",
                "Use phase-based approach for complex changes"
            ],
            'time_pressure': [
                "Negotiate timeline to allow proper implementation",
                "Identify minimum viable version for urgent release",
                "Consider temporary solutions with planned refactoring"
            ]
        }
        
        return steps.get(factor_name, ["Analyze factor-specific optimization opportunities"])
    
    def generate_stability_improvements(self, sensitivity_analysis: Dict[str, Any]) -> List[str]:
        """Generate steps to improve decision stability"""
        
        improvements = []
        
        stability = sensitivity_analysis['overall_stability']
        
        if stability < 0.6:
            improvements.extend([
                "Gather more detailed requirements to reduce ambiguity",
                "Conduct stakeholder alignment sessions",
                "Consider breaking down the task into smaller, more defined pieces"
            ])
        
        if sensitivity_analysis['most_sensitive_factor'] == 'technical_complexity':
            improvements.append("Invest in technical analysis and proof of concepts")
        
        if sensitivity_analysis['most_sensitive_factor'] == 'risk_factor':
            improvements.append("Conduct thorough risk assessment and mitigation planning")
        
        return improvements or ["Decision is already stable"]


# Example usage and testing
def example_transparency_engine():
    """Example of using the decision transparency engine"""
    
    from .bayesian_decision_network import TaskAnalysis
    
    # Initialize systems (simplified for example)
    transparency_engine = DecisionTransparencyEngine()
    
    # Example decision input
    decision_input = DecisionInput(
        task_description="Implement real-time chat system with WebSocket support",
        five_dimensional_scores={
            'technical_complexity': 0.75,
            'scope_impact': 0.6,
            'risk_factor': 0.4,
            'context_load': 0.5,
            'time_pressure': 0.3
        },
        context_metrics={'current_tokens': 15000, 'loaded_files': 8},
        project_metrics={'team_size': 4, 'project_maturity': 12}
    )
    
    # Mock results for example
    class MockBayesianResult:
        def __init__(self):
            self.workflow = WorkflowType.COMPLETE_SYSTEM
            self.confidence = 0.78
            self.decision_margin = 0.23
            self.uncertainty = 0.22
            self.posterior_probabilities = {
                WorkflowType.COMPLETE_SYSTEM: 0.78,
                WorkflowType.ORCHESTRATED: 0.12,
                WorkflowType.TASKIT: 0.10
            }
            self.alternatives = [(WorkflowType.ORCHESTRATED, 0.12), (WorkflowType.TASKIT, 0.10)]
    
    class MockFuzzyResult:
        def __init__(self):
            self.workflow = WorkflowType.COMPLETE_SYSTEM
            self.fuzzy_confidence = 0.74
            self.linguistic_interpretation = {
                'technical_complexity': 'quite complex (0.750)',
                'scope_impact': 'somewhat moderate (0.600)'
            }
            self.rule_activations = {1: 0.8, 3: 0.6, 7: 0.4}
            self.defuzzified_scores = {
                WorkflowType.COMPLETE_SYSTEM: 0.74,
                WorkflowType.ORCHESTRATED: 0.26
            }
    
    # Create mock results
    bayesian_result = MockBayesianResult()
    fuzzy_result = MockFuzzyResult()
    
    # Generate explanation (would need real risk and context results)
    print("Decision Transparency Engine Example:")
    print(f"Selected Workflow: {bayesian_result.workflow.value}")
    print(f"Confidence: {bayesian_result.confidence:.1%}")
    
    # Generate factor analysis
    factor_contributions = transparency_engine.analyze_factor_contributions(
        decision_input.five_dimensional_scores, bayesian_result, fuzzy_result
    )
    
    print("\nFactor Contributions:")
    for factor, contrib in factor_contributions.items():
        print(f"  {factor}: {contrib['score']:.3f} ({contrib['complexity_level']}) - {contrib['importance']:.3f} importance")
    
    return transparency_engine


if __name__ == "__main__":
    # Run example
    engine = example_transparency_engine()