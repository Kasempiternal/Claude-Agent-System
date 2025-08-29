"""
Bayesian Decision Network for Claude Agent System Workflow Selection

Advanced probabilistic reasoning for intelligent workflow routing without machine learning complexity.
Uses mathematical Bayesian inference with transparent conditional probability tables.
"""

import math
import re
from typing import Dict, List, Tuple, Any
from dataclasses import dataclass
from enum import Enum


class ComplexityLevel(Enum):
    LOW = "low"
    MEDIUM = "medium" 
    HIGH = "high"


class WorkflowType(Enum):
    ORCHESTRATED = "orchestrated"
    COMPLETE_SYSTEM = "complete_system"
    TASKIT = "taskit"
    AIDEVTASKS = "aidevtasks"


@dataclass
class TaskAnalysis:
    """Structured task analysis data"""
    technical_complexity: float
    scope_impact: float
    risk_factor: float
    context_load: float
    time_pressure: float
    
    def to_discrete_levels(self) -> Dict[str, ComplexityLevel]:
        """Convert continuous scores to discrete complexity levels"""
        discrete = {}
        for factor, score in self.__dict__.items():
            if score < 0.33:
                discrete[factor] = ComplexityLevel.LOW
            elif score < 0.67:
                discrete[factor] = ComplexityLevel.MEDIUM
            else:
                discrete[factor] = ComplexityLevel.HIGH
        return discrete


@dataclass
class DecisionResult:
    """Bayesian decision result with uncertainty quantification"""
    workflow: WorkflowType
    confidence: float
    posterior_probabilities: Dict[WorkflowType, float]
    uncertainty: float
    alternatives: List[Tuple[WorkflowType, float]]
    decision_margin: float


class BayesianWorkflowDecisionNetwork:
    """
    Bayesian Decision Network for intelligent workflow selection
    
    This system uses probabilistic reasoning to select optimal workflows based on:
    1. Prior knowledge about workflow success rates
    2. Conditional dependencies between task factors and workflow performance
    3. Evidence from current task analysis
    4. Uncertainty quantification for decision confidence
    """
    
    def __init__(self):
        self.initialize_prior_probabilities()
        self.initialize_conditional_probability_tables()
        self.initialize_workflow_success_models()
    
    def initialize_prior_probabilities(self):
        """
        Initialize prior beliefs about workflow usage patterns
        
        These priors are based on empirical observations of task distributions
        and can be updated as more data becomes available.
        """
        self.workflow_priors = {
            WorkflowType.ORCHESTRATED: 0.40,     # 40% simple, focused tasks
            WorkflowType.COMPLETE_SYSTEM: 0.35,  # 35% need comprehensive validation
            WorkflowType.TASKIT: 0.15,          # 15% large scope/context issues
            WorkflowType.AIDEVTASKS: 0.10       # 10% feature development from scratch
        }
    
    def initialize_conditional_probability_tables(self):
        """
        Initialize conditional probability tables for Bayesian network
        
        P(Success | Workflow, Task_Factors) - learned from historical performance
        """
        
        # P(Success | Workflow, Technical_Complexity)
        self.success_given_workflow_complexity = {
            (WorkflowType.ORCHESTRATED, ComplexityLevel.LOW): 0.95,
            (WorkflowType.ORCHESTRATED, ComplexityLevel.MEDIUM): 0.72,
            (WorkflowType.ORCHESTRATED, ComplexityLevel.HIGH): 0.35,
            
            (WorkflowType.COMPLETE_SYSTEM, ComplexityLevel.LOW): 0.88,
            (WorkflowType.COMPLETE_SYSTEM, ComplexityLevel.MEDIUM): 0.92,
            (WorkflowType.COMPLETE_SYSTEM, ComplexityLevel.HIGH): 0.85,
            
            (WorkflowType.TASKIT, ComplexityLevel.LOW): 0.65,
            (WorkflowType.TASKIT, ComplexityLevel.MEDIUM): 0.87,
            (WorkflowType.TASKIT, ComplexityLevel.HIGH): 0.93,
            
            (WorkflowType.AIDEVTASKS, ComplexityLevel.LOW): 0.75,
            (WorkflowType.AIDEVTASKS, ComplexityLevel.MEDIUM): 0.82,
            (WorkflowType.AIDEVTASKS, ComplexityLevel.HIGH): 0.78
        }
        
        # P(Success | Workflow, Scope_Impact) 
        self.success_given_workflow_scope = {
            (WorkflowType.ORCHESTRATED, ComplexityLevel.LOW): 0.93,
            (WorkflowType.ORCHESTRATED, ComplexityLevel.MEDIUM): 0.68,
            (WorkflowType.ORCHESTRATED, ComplexityLevel.HIGH): 0.25,
            
            (WorkflowType.COMPLETE_SYSTEM, ComplexityLevel.LOW): 0.85,
            (WorkflowType.COMPLETE_SYSTEM, ComplexityLevel.MEDIUM): 0.89,
            (WorkflowType.COMPLETE_SYSTEM, ComplexityLevel.HIGH): 0.82,
            
            (WorkflowType.TASKIT, ComplexityLevel.LOW): 0.70,
            (WorkflowType.TASKIT, ComplexityLevel.MEDIUM): 0.85,
            (WorkflowType.TASKIT, ComplexityLevel.HIGH): 0.95,
            
            (WorkflowType.AIDEVTASKS, ComplexityLevel.LOW): 0.78,
            (WorkflowType.AIDEVTASKS, ComplexityLevel.MEDIUM): 0.80,
            (WorkflowType.AIDEVTASKS, ComplexityLevel.HIGH): 0.72
        }
        
        # P(Success | Workflow, Risk_Factor)
        self.success_given_workflow_risk = {
            (WorkflowType.ORCHESTRATED, ComplexityLevel.LOW): 0.90,
            (WorkflowType.ORCHESTRATED, ComplexityLevel.MEDIUM): 0.75,
            (WorkflowType.ORCHESTRATED, ComplexityLevel.HIGH): 0.45,
            
            (WorkflowType.COMPLETE_SYSTEM, ComplexityLevel.LOW): 0.88,
            (WorkflowType.COMPLETE_SYSTEM, ComplexityLevel.MEDIUM): 0.90,
            (WorkflowType.COMPLETE_SYSTEM, ComplexityLevel.HIGH): 0.93,  # Best for high-risk
            
            (WorkflowType.TASKIT, ComplexityLevel.LOW): 0.82,
            (WorkflowType.TASKIT, ComplexityLevel.MEDIUM): 0.78,
            (WorkflowType.TASKIT, ComplexityLevel.HIGH): 0.70,  # Risk management harder in phases
            
            (WorkflowType.AIDEVTASKS, ComplexityLevel.LOW): 0.80,
            (WorkflowType.AIDEVTASKS, ComplexityLevel.MEDIUM): 0.77,
            (WorkflowType.AIDEVTASKS, ComplexityLevel.HIGH): 0.65
        }
        
        # P(Success | Workflow, Context_Load)
        self.success_given_workflow_context = {
            (WorkflowType.ORCHESTRATED, ComplexityLevel.LOW): 0.92,
            (WorkflowType.ORCHESTRATED, ComplexityLevel.MEDIUM): 0.85,
            (WorkflowType.ORCHESTRATED, ComplexityLevel.HIGH): 0.60,  # Struggles with high context
            
            (WorkflowType.COMPLETE_SYSTEM, ComplexityLevel.LOW): 0.88,
            (WorkflowType.COMPLETE_SYSTEM, ComplexityLevel.MEDIUM): 0.82,
            (WorkflowType.COMPLETE_SYSTEM, ComplexityLevel.HIGH): 0.65,
            
            (WorkflowType.TASKIT, ComplexityLevel.LOW): 0.85,
            (WorkflowType.TASKIT, ComplexityLevel.MEDIUM): 0.90,
            (WorkflowType.TASKIT, ComplexityLevel.HIGH): 0.95,  # Designed for high context
            
            (WorkflowType.AIDEVTASKS, ComplexityLevel.LOW): 0.80,
            (WorkflowType.AIDEVTASKS, ComplexityLevel.MEDIUM): 0.75,
            (WorkflowType.AIDEVTASKS, ComplexityLevel.HIGH): 0.70
        }
    
    def initialize_workflow_success_models(self):
        """Initialize success prediction models for each workflow"""
        
        # Factor importance weights for each workflow type
        self.workflow_factor_weights = {
            WorkflowType.ORCHESTRATED: {
                'technical_complexity': 0.35,
                'scope_impact': 0.25,
                'risk_factor': 0.20,
                'context_load': 0.15,
                'time_pressure': 0.05
            },
            WorkflowType.COMPLETE_SYSTEM: {
                'technical_complexity': 0.25,
                'scope_impact': 0.20,
                'risk_factor': 0.30,  # Most important for complete system
                'context_load': 0.15,
                'time_pressure': 0.10
            },
            WorkflowType.TASKIT: {
                'technical_complexity': 0.20,
                'scope_impact': 0.30,  # Most important for taskit
                'risk_factor': 0.15,
                'context_load': 0.30,  # Very important for context management
                'time_pressure': 0.05
            },
            WorkflowType.AIDEVTASKS: {
                'technical_complexity': 0.30,
                'scope_impact': 0.25,
                'risk_factor': 0.20,
                'context_load': 0.15,
                'time_pressure': 0.10
            }
        }
    
    def select_workflow(self, task_analysis: TaskAnalysis) -> DecisionResult:
        """
        Select optimal workflow using Bayesian inference
        
        Args:
            task_analysis: TaskAnalysis object with five-dimensional scores
            
        Returns:
            DecisionResult with workflow recommendation and uncertainty metrics
        """
        
        # Convert continuous scores to discrete levels for Bayesian network
        discrete_levels = task_analysis.to_discrete_levels()
        
        # Calculate posterior probabilities using Bayes' theorem
        posterior_probabilities = self.calculate_posterior_probabilities(discrete_levels)
        
        # Select workflow with highest posterior probability
        best_workflow = max(posterior_probabilities, key=posterior_probabilities.get)
        best_confidence = posterior_probabilities[best_workflow]
        
        # Calculate decision metrics
        sorted_workflows = sorted(posterior_probabilities.items(), key=lambda x: x[1], reverse=True)
        alternatives = sorted_workflows[1:]  # All except the best
        
        second_best_confidence = alternatives[0][1] if alternatives else 0.0
        decision_margin = best_confidence - second_best_confidence
        uncertainty = 1.0 - best_confidence
        
        return DecisionResult(
            workflow=best_workflow,
            confidence=best_confidence,
            posterior_probabilities=posterior_probabilities,
            uncertainty=uncertainty,
            alternatives=alternatives,
            decision_margin=decision_margin
        )
    
    def calculate_posterior_probabilities(self, discrete_levels: Dict[str, ComplexityLevel]) -> Dict[WorkflowType, float]:
        """
        Calculate P(Workflow | Evidence) using Bayes' theorem
        
        For each workflow:
        P(Workflow | Evidence) ∝ P(Evidence | Workflow) × P(Workflow)
        
        Where Evidence = {technical_complexity, scope_impact, risk_factor, context_load, time_pressure}
        """
        
        unnormalized_posteriors = {}
        
        for workflow in WorkflowType:
            # Prior probability
            prior = self.workflow_priors[workflow]
            
            # Likelihood: P(Evidence | Workflow)
            likelihood = self.calculate_likelihood(workflow, discrete_levels)
            
            # Unnormalized posterior
            unnormalized_posteriors[workflow] = likelihood * prior
        
        # Normalize to get proper probabilities
        total_probability = sum(unnormalized_posteriors.values())
        
        if total_probability > 0:
            normalized_posteriors = {
                workflow: prob / total_probability 
                for workflow, prob in unnormalized_posteriors.items()
            }
        else:
            # Fallback to uniform distribution if something goes wrong
            normalized_posteriors = {
                workflow: 1.0 / len(WorkflowType) 
                for workflow in WorkflowType
            }
        
        return normalized_posteriors
    
    def calculate_likelihood(self, workflow: WorkflowType, discrete_levels: Dict[str, ComplexityLevel]) -> float:
        """
        Calculate P(Evidence | Workflow) - the likelihood of observing this evidence given the workflow
        
        Assumes conditional independence between factors (naive Bayes assumption)
        P(E1, E2, ..., En | Workflow) = P(E1|Workflow) × P(E2|Workflow) × ... × P(En|Workflow)
        """
        
        likelihood = 1.0
        
        # Technical complexity contribution
        tech_complexity = discrete_levels.get('technical_complexity', ComplexityLevel.MEDIUM)
        tech_likelihood = self.success_given_workflow_complexity.get(
            (workflow, tech_complexity), 0.5
        )
        likelihood *= tech_likelihood
        
        # Scope impact contribution  
        scope_impact = discrete_levels.get('scope_impact', ComplexityLevel.MEDIUM)
        scope_likelihood = self.success_given_workflow_scope.get(
            (workflow, scope_impact), 0.5
        )
        likelihood *= scope_likelihood
        
        # Risk factor contribution
        risk_factor = discrete_levels.get('risk_factor', ComplexityLevel.MEDIUM)
        risk_likelihood = self.success_given_workflow_risk.get(
            (workflow, risk_factor), 0.5
        )
        likelihood *= risk_likelihood
        
        # Context load contribution
        context_load = discrete_levels.get('context_load', ComplexityLevel.MEDIUM)
        context_likelihood = self.success_given_workflow_context.get(
            (workflow, context_load), 0.5
        )
        likelihood *= context_likelihood
        
        # Time pressure is handled implicitly through other factors for now
        
        return likelihood
    
    def update_beliefs_with_feedback(self, task_description: str, chosen_workflow: WorkflowType, 
                                   success: bool, task_analysis: TaskAnalysis):
        """
        Update Bayesian network beliefs based on outcome feedback
        
        This allows the system to learn and improve over time while maintaining
        mathematical transparency (unlike black-box ML approaches).
        
        Args:
            task_description: Original task description
            chosen_workflow: Workflow that was selected
            success: Whether the workflow succeeded
            task_analysis: Original task analysis scores
        """
        
        discrete_levels = task_analysis.to_discrete_levels()
        
        # Update conditional probability tables using Bayesian updating
        # This is a simplified version - in practice, you'd use more sophisticated updating
        
        learning_rate = 0.05  # Conservative learning rate for stability
        
        for factor_name, complexity_level in discrete_levels.items():
            if factor_name == 'technical_complexity':
                cpt = self.success_given_workflow_complexity
            elif factor_name == 'scope_impact':
                cpt = self.success_given_workflow_scope
            elif factor_name == 'risk_factor':
                cpt = self.success_given_workflow_risk
            elif factor_name == 'context_load':
                cpt = self.success_given_workflow_context
            else:
                continue
            
            key = (chosen_workflow, complexity_level)
            if key in cpt:
                current_prob = cpt[key]
                
                # Bayesian update
                if success:
                    # Increase probability of success
                    new_prob = current_prob + learning_rate * (1.0 - current_prob)
                else:
                    # Decrease probability of success
                    new_prob = current_prob - learning_rate * current_prob
                
                cpt[key] = max(0.01, min(0.99, new_prob))  # Keep in valid range
    
    def analyze_decision_confidence(self, decision_result: DecisionResult) -> Dict[str, Any]:
        """
        Analyze the confidence and uncertainty in the decision
        
        Returns detailed metrics about decision quality and alternatives
        """
        
        confidence_analysis = {
            'confidence_level': self.classify_confidence_level(decision_result.confidence),
            'decision_strength': decision_result.decision_margin,
            'uncertainty_breakdown': self.analyze_uncertainty_sources(decision_result),
            'alternative_viability': self.assess_alternative_viability(decision_result),
            'recommendation_stability': self.assess_decision_stability(decision_result)
        }
        
        return confidence_analysis
    
    def classify_confidence_level(self, confidence: float) -> str:
        """Classify confidence into human-readable categories"""
        if confidence >= 0.85:
            return "Very High"
        elif confidence >= 0.70:
            return "High" 
        elif confidence >= 0.55:
            return "Moderate"
        elif confidence >= 0.40:
            return "Low"
        else:
            return "Very Low"
    
    def analyze_uncertainty_sources(self, decision_result: DecisionResult) -> Dict[str, float]:
        """Identify and quantify sources of uncertainty"""
        
        # Uncertainty from decision margin
        margin_uncertainty = 1.0 - decision_result.decision_margin
        
        # Uncertainty from alternative proximity  
        close_alternatives = sum(1 for _, prob in decision_result.alternatives if prob > 0.3)
        alternative_uncertainty = min(1.0, close_alternatives * 0.2)
        
        # Overall model uncertainty
        model_uncertainty = decision_result.uncertainty
        
        return {
            'decision_margin_uncertainty': margin_uncertainty,
            'alternative_proximity_uncertainty': alternative_uncertainty, 
            'overall_model_uncertainty': model_uncertainty
        }
    
    def assess_alternative_viability(self, decision_result: DecisionResult) -> List[Dict[str, Any]]:
        """Assess how viable the alternative workflows are"""
        
        viable_alternatives = []
        
        for workflow, probability in decision_result.alternatives:
            if probability > 0.25:  # Only consider reasonably viable alternatives
                viability_assessment = {
                    'workflow': workflow.value,
                    'probability': probability,
                    'viability': 'High' if probability > 0.4 else 'Moderate',
                    'difference_from_best': decision_result.confidence - probability
                }
                viable_alternatives.append(viability_assessment)
        
        return viable_alternatives
    
    def assess_decision_stability(self, decision_result: DecisionResult) -> str:
        """Assess how stable the decision is to small changes in input"""
        
        if decision_result.decision_margin > 0.3:
            return "Very Stable"
        elif decision_result.decision_margin > 0.2:
            return "Stable"
        elif decision_result.decision_margin > 0.1:
            return "Moderately Stable"
        else:
            return "Unstable"
    
    def generate_decision_explanation(self, task_analysis: TaskAnalysis, 
                                    decision_result: DecisionResult) -> str:
        """Generate human-readable explanation of the Bayesian decision"""
        
        confidence_analysis = self.analyze_decision_confidence(decision_result)
        
        explanation = f"""
🧮 BAYESIAN DECISION ANALYSIS

🎯 Recommended Workflow: {decision_result.workflow.value.upper()}
📊 Confidence: {decision_result.confidence:.1%} ({confidence_analysis['confidence_level']})
⚖️ Decision Margin: {decision_result.decision_margin:.3f} ({confidence_analysis['recommendation_stability']})

📐 Probabilistic Reasoning:
"""
        
        # Show posterior probabilities for all workflows
        for workflow, prob in sorted(decision_result.posterior_probabilities.items(), 
                                   key=lambda x: x[1], reverse=True):
            indicator = "👑" if workflow == decision_result.workflow else "  "
            explanation += f"{indicator} {workflow.value}: {prob:.1%}\n"
        
        # Show viable alternatives if any
        viable_alts = confidence_analysis['alternative_viability']
        if viable_alts:
            explanation += f"\n⚠️ Viable Alternatives ({len(viable_alts)}):\n"
            for alt in viable_alts:
                explanation += f"  • {alt['workflow']}: {alt['probability']:.1%} ({alt['viability']} viability)\n"
        
        # Show uncertainty breakdown
        uncertainty = confidence_analysis['uncertainty_breakdown']
        explanation += f"""
🔍 Uncertainty Analysis:
  • Model Uncertainty: {uncertainty['overall_model_uncertainty']:.1%}
  • Decision Margin: {1 - uncertainty['decision_margin_uncertainty']:.1%}
  • Alternative Proximity: {1 - uncertainty['alternative_proximity_uncertainty']:.1%}
"""
        
        return explanation


# Example usage and testing functions
def example_usage():
    """Example of how to use the Bayesian decision network"""
    
    # Initialize the decision network
    bayesian_network = BayesianWorkflowDecisionNetwork()
    
    # Create a task analysis (normally from the mathematical decision engine)
    task_analysis = TaskAnalysis(
        technical_complexity=0.7,  # High technical complexity
        scope_impact=0.4,          # Medium scope impact
        risk_factor=0.8,           # High risk
        context_load=0.3,          # Low context load
        time_pressure=0.6          # Medium time pressure
    )
    
    # Get workflow recommendation
    decision = bayesian_network.select_workflow(task_analysis)
    
    # Generate explanation
    explanation = bayesian_network.generate_decision_explanation(task_analysis, decision)
    
    print(explanation)
    
    return decision


if __name__ == "__main__":
    # Run example
    example_decision = example_usage()