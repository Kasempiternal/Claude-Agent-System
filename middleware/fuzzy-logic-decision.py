"""
Fuzzy Logic Decision System for Claude Agent System

Handles uncertainty and linguistic variables in workflow selection using mathematical fuzzy logic.
Complements the Bayesian system by providing smooth transitions and handling imprecise descriptions.
"""

import math
import re
from typing import Dict, List, Callable, Tuple, Any
from dataclasses import dataclass
from enum import Enum


class LinguisticVariable(Enum):
    """Linguistic variables for fuzzy sets"""
    VERY_LOW = "very_low"
    LOW = "low"
    MEDIUM_LOW = "medium_low"
    MEDIUM = "medium"
    MEDIUM_HIGH = "medium_high"
    HIGH = "high"
    VERY_HIGH = "very_high"


class WorkflowType(Enum):
    """Available workflow types"""
    ORCHESTRATED = "orchestrated"
    COMPLETE_SYSTEM = "complete_system"
    TASKIT = "taskit"
    AIDEVTASKS = "aidevtasks"


@dataclass
class FuzzySet:
    """Fuzzy set with membership function and linguistic label"""
    name: str
    membership_function: Callable[[float], float]
    
    def membership(self, value: float) -> float:
        """Calculate membership degree for a given value"""
        return self.membership_function(value)


@dataclass
class FuzzyRule:
    """Fuzzy inference rule with conditions and conclusions"""
    conditions: Dict[str, List[str]]  # factor -> list of linguistic values
    conclusion: WorkflowType
    weight: float
    confidence: float


@dataclass
class FuzzyDecisionResult:
    """Result from fuzzy logic decision system"""
    workflow: WorkflowType
    fuzzy_confidence: float
    rule_activations: Dict[int, float]  # rule_id -> activation strength
    linguistic_interpretation: Dict[str, str]  # factor -> linguistic description
    defuzzified_scores: Dict[WorkflowType, float]


class FuzzyMembershipFunctions:
    """Collection of fuzzy membership function generators"""
    
    @staticmethod
    def triangular(a: float, b: float, c: float) -> Callable[[float], float]:
        """
        Create triangular membership function
        
        Parameters a <= b <= c define the triangle:
        - a: left base point (membership = 0)
        - b: peak point (membership = 1) 
        - c: right base point (membership = 0)
        """
        def membership(x: float) -> float:
            if x <= a or x >= c:
                return 0.0
            elif a < x <= b:
                if b == a:  # Avoid division by zero
                    return 1.0
                return (x - a) / (b - a)
            else:  # b < x < c
                if c == b:  # Avoid division by zero
                    return 1.0
                return (c - x) / (c - b)
        return membership
    
    @staticmethod
    def trapezoidal(a: float, b: float, c: float, d: float) -> Callable[[float], float]:
        """
        Create trapezoidal membership function
        
        Parameters a <= b <= c <= d define the trapezoid:
        - a: left base point (membership = 0)
        - b: left top point (membership = 1)
        - c: right top point (membership = 1) 
        - d: right base point (membership = 0)
        """
        def membership(x: float) -> float:
            if x <= a or x >= d:
                return 0.0
            elif a < x <= b:
                if b == a:
                    return 1.0
                return (x - a) / (b - a)
            elif b <= x <= c:
                return 1.0
            else:  # c < x < d
                if d == c:
                    return 1.0
                return (d - x) / (d - c)
        return membership
    
    @staticmethod
    def gaussian(mean: float, std: float) -> Callable[[float], float]:
        """Create Gaussian (bell-curve) membership function"""
        def membership(x: float) -> float:
            return math.exp(-0.5 * ((x - mean) / std) ** 2)
        return membership
    
    @staticmethod
    def sigmoid(center: float, slope: float) -> Callable[[float], float]:
        """Create sigmoid membership function"""
        def membership(x: float) -> float:
            return 1.0 / (1.0 + math.exp(-slope * (x - center)))
        return membership


class FuzzyWorkflowDecisionSystem:
    """
    Fuzzy Logic System for workflow decision making
    
    Handles:
    1. Linguistic variables (simple, complex, moderate, etc.)
    2. Fuzzy rules with weighted conclusions
    3. Mamdani inference method
    4. Centroid defuzzification
    5. Uncertainty quantification through fuzzy confidence
    """
    
    def __init__(self):
        self.initialize_fuzzy_sets()
        self.initialize_fuzzy_rules()
        self.initialize_output_fuzzy_sets()
    
    def initialize_fuzzy_sets(self):
        """Initialize fuzzy sets for each input factor"""
        
        # Technical Complexity fuzzy sets
        self.technical_complexity_sets = {
            "simple": FuzzySet("simple", FuzzyMembershipFunctions.triangular(0.0, 0.0, 0.35)),
            "moderate": FuzzySet("moderate", FuzzyMembershipFunctions.triangular(0.1, 0.4, 0.7)),
            "complex": FuzzySet("complex", FuzzyMembershipFunctions.triangular(0.5, 0.8, 1.0)),
            "very_complex": FuzzySet("very_complex", FuzzyMembershipFunctions.triangular(0.75, 1.0, 1.0))
        }
        
        # Scope Impact fuzzy sets
        self.scope_impact_sets = {
            "narrow": FuzzySet("narrow", FuzzyMembershipFunctions.triangular(0.0, 0.0, 0.4)),
            "moderate": FuzzySet("moderate", FuzzyMembershipFunctions.triangular(0.2, 0.5, 0.8)),
            "broad": FuzzySet("broad", FuzzyMembershipFunctions.triangular(0.6, 1.0, 1.0))
        }
        
        # Risk Factor fuzzy sets
        self.risk_factor_sets = {
            "low": FuzzySet("low", FuzzyMembershipFunctions.triangular(0.0, 0.0, 0.3)),
            "medium": FuzzySet("medium", FuzzyMembershipFunctions.triangular(0.1, 0.5, 0.9)),
            "high": FuzzySet("high", FuzzyMembershipFunctions.triangular(0.7, 1.0, 1.0))
        }
        
        # Context Load fuzzy sets
        self.context_load_sets = {
            "light": FuzzySet("light", FuzzyMembershipFunctions.triangular(0.0, 0.0, 0.3)),
            "moderate": FuzzySet("moderate", FuzzyMembershipFunctions.triangular(0.1, 0.4, 0.7)),
            "heavy": FuzzySet("heavy", FuzzyMembershipFunctions.triangular(0.5, 0.8, 1.0)),
            "overwhelming": FuzzySet("overwhelming", FuzzyMembershipFunctions.triangular(0.7, 1.0, 1.0))
        }
        
        # Time Pressure fuzzy sets
        self.time_pressure_sets = {
            "relaxed": FuzzySet("relaxed", FuzzyMembershipFunctions.triangular(0.0, 0.0, 0.25)),
            "normal": FuzzySet("normal", FuzzyMembershipFunctions.triangular(0.1, 0.4, 0.7)),
            "urgent": FuzzySet("urgent", FuzzyMembershipFunctions.triangular(0.5, 0.8, 1.0)),
            "critical": FuzzySet("critical", FuzzyMembershipFunctions.triangular(0.8, 1.0, 1.0))
        }
        
        # Combine all input fuzzy sets
        self.input_fuzzy_sets = {
            "technical_complexity": self.technical_complexity_sets,
            "scope_impact": self.scope_impact_sets,
            "risk_factor": self.risk_factor_sets,
            "context_load": self.context_load_sets,
            "time_pressure": self.time_pressure_sets
        }
    
    def initialize_output_fuzzy_sets(self):
        """Initialize output fuzzy sets for workflow suitability"""
        
        self.workflow_suitability_sets = {
            "poor": FuzzySet("poor", FuzzyMembershipFunctions.triangular(0.0, 0.0, 0.3)),
            "fair": FuzzySet("fair", FuzzyMembershipFunctions.triangular(0.1, 0.35, 0.6)),
            "good": FuzzySet("good", FuzzyMembershipFunctions.triangular(0.4, 0.65, 0.9)),
            "excellent": FuzzySet("excellent", FuzzyMembershipFunctions.triangular(0.7, 1.0, 1.0))
        }
    
    def initialize_fuzzy_rules(self):
        """Initialize fuzzy inference rules"""
        
        self.fuzzy_rules = [
            # Rule 1: Simple, narrow scope, low risk → Orchestrated (Excellent)
            FuzzyRule(
                conditions={
                    "technical_complexity": ["simple"],
                    "scope_impact": ["narrow"],
                    "risk_factor": ["low"]
                },
                conclusion=WorkflowType.ORCHESTRATED,
                weight=0.95,
                confidence=0.9
            ),
            
            # Rule 2: Simple to moderate, any scope, low risk, light context → Orchestrated (Good)
            FuzzyRule(
                conditions={
                    "technical_complexity": ["simple", "moderate"],
                    "risk_factor": ["low"],
                    "context_load": ["light"]
                },
                conclusion=WorkflowType.ORCHESTRATED,
                weight=0.8,
                confidence=0.75
            ),
            
            # Rule 3: Complex technical, medium risk → Complete System (Excellent)
            FuzzyRule(
                conditions={
                    "technical_complexity": ["complex", "very_complex"],
                    "risk_factor": ["medium", "high"]
                },
                conclusion=WorkflowType.COMPLETE_SYSTEM,
                weight=0.9,
                confidence=0.85
            ),
            
            # Rule 4: High risk regardless of complexity → Complete System (Excellent)
            FuzzyRule(
                conditions={
                    "risk_factor": ["high"]
                },
                conclusion=WorkflowType.COMPLETE_SYSTEM,
                weight=0.95,
                confidence=0.9
            ),
            
            # Rule 5: Broad scope with moderate+ complexity → Taskit (Good)
            FuzzyRule(
                conditions={
                    "scope_impact": ["broad"],
                    "technical_complexity": ["moderate", "complex", "very_complex"]
                },
                conclusion=WorkflowType.TASKIT,
                weight=0.85,
                confidence=0.8
            ),
            
            # Rule 6: Heavy or overwhelming context load → Taskit (Excellent)
            FuzzyRule(
                conditions={
                    "context_load": ["heavy", "overwhelming"]
                },
                conclusion=WorkflowType.TASKIT,
                weight=0.9,
                confidence=0.85
            ),
            
            # Rule 7: Moderate complexity, moderate scope, medium risk → Complete System (Good)
            FuzzyRule(
                conditions={
                    "technical_complexity": ["moderate"],
                    "scope_impact": ["moderate"],
                    "risk_factor": ["medium"]
                },
                conclusion=WorkflowType.COMPLETE_SYSTEM,
                weight=0.75,
                confidence=0.7
            ),
            
            # Rule 8: Complex technical + broad scope + heavy context → Taskit (Excellent)
            FuzzyRule(
                conditions={
                    "technical_complexity": ["complex", "very_complex"],
                    "scope_impact": ["broad"],
                    "context_load": ["heavy", "overwhelming"]
                },
                conclusion=WorkflowType.TASKIT,
                weight=0.95,
                confidence=0.9
            ),
            
            # Rule 9: Simple task but urgent → Orchestrated (Good)
            FuzzyRule(
                conditions={
                    "technical_complexity": ["simple"],
                    "time_pressure": ["urgent", "critical"]
                },
                conclusion=WorkflowType.ORCHESTRATED,
                weight=0.8,
                confidence=0.75
            ),
            
            # Rule 10: Feature development patterns → AI Dev Tasks (Good)
            FuzzyRule(
                conditions={
                    "technical_complexity": ["moderate", "complex"],
                    "scope_impact": ["moderate", "broad"],
                    "risk_factor": ["low", "medium"],
                    "time_pressure": ["normal", "relaxed"]
                },
                conclusion=WorkflowType.AIDEVTASKS,
                weight=0.7,
                confidence=0.65
            ),
            
            # Rule 11: Very complex but narrow scope → Complete System (Good)
            FuzzyRule(
                conditions={
                    "technical_complexity": ["very_complex"],
                    "scope_impact": ["narrow"]
                },
                conclusion=WorkflowType.COMPLETE_SYSTEM,
                weight=0.8,
                confidence=0.75
            ),
            
            # Rule 12: Critical time pressure with low complexity → Orchestrated (Fair)
            FuzzyRule(
                conditions={
                    "time_pressure": ["critical"],
                    "technical_complexity": ["simple", "moderate"],
                    "risk_factor": ["low"]
                },
                conclusion=WorkflowType.ORCHESTRATED,
                weight=0.6,
                confidence=0.6
            )
        ]
    
    def fuzzify_inputs(self, crisp_inputs: Dict[str, float]) -> Dict[str, Dict[str, float]]:
        """
        Convert crisp input values to fuzzy membership degrees
        
        Args:
            crisp_inputs: Dictionary of factor_name -> crisp_value (0.0 to 1.0)
            
        Returns:
            Dictionary of factor_name -> linguistic_term -> membership_degree
        """
        
        fuzzified = {}
        
        for factor_name, crisp_value in crisp_inputs.items():
            if factor_name in self.input_fuzzy_sets:
                factor_memberships = {}
                
                for linguistic_term, fuzzy_set in self.input_fuzzy_sets[factor_name].items():
                    membership_degree = fuzzy_set.membership(crisp_value)
                    factor_memberships[linguistic_term] = membership_degree
                
                fuzzified[factor_name] = factor_memberships
        
        return fuzzified
    
    def evaluate_fuzzy_rules(self, fuzzified_inputs: Dict[str, Dict[str, float]]) -> List[Tuple[FuzzyRule, float]]:
        """
        Evaluate all fuzzy rules and calculate their activation strengths
        
        Args:
            fuzzified_inputs: Fuzzified input values from fuzzify_inputs()
            
        Returns:
            List of (rule, activation_strength) tuples
        """
        
        rule_activations = []
        
        for rule_id, rule in enumerate(self.fuzzy_rules):
            activation_strength = self.calculate_rule_activation(rule, fuzzified_inputs)
            
            if activation_strength > 0:
                rule_activations.append((rule, activation_strength))
        
        return rule_activations
    
    def calculate_rule_activation(self, rule: FuzzyRule, fuzzified_inputs: Dict[str, Dict[str, float]]) -> float:
        """
        Calculate how strongly a fuzzy rule fires given fuzzified inputs
        
        Uses minimum (AND) operation for combining conditions within a factor
        and minimum across factors (Mamdani inference)
        """
        
        condition_strengths = []
        
        for factor_name, linguistic_values in rule.conditions.items():
            if factor_name not in fuzzified_inputs:
                continue
            
            factor_memberships = fuzzified_inputs[factor_name]
            
            # Calculate maximum membership across all acceptable linguistic values for this factor
            max_membership = 0.0
            for linguistic_value in linguistic_values:
                if linguistic_value in factor_memberships:
                    membership = factor_memberships[linguistic_value]
                    max_membership = max(max_membership, membership)
            
            condition_strengths.append(max_membership)
        
        # Use minimum for AND operation across all factors (Mamdani)
        if condition_strengths:
            rule_strength = min(condition_strengths)
            return rule_strength * rule.weight  # Apply rule weight
        
        return 0.0
    
    def aggregate_rule_outputs(self, rule_activations: List[Tuple[FuzzyRule, float]]) -> Dict[WorkflowType, float]:
        """
        Aggregate rule outputs for each workflow type
        
        Uses maximum aggregation method (take the strongest rule for each workflow)
        """
        
        workflow_strengths = {}
        
        for rule, activation_strength in rule_activations:
            workflow = rule.conclusion
            
            # Use maximum aggregation
            current_strength = workflow_strengths.get(workflow, 0.0)
            workflow_strengths[workflow] = max(current_strength, activation_strength * rule.confidence)
        
        return workflow_strengths
    
    def defuzzify_outputs(self, workflow_strengths: Dict[WorkflowType, float]) -> Tuple[WorkflowType, float]:
        """
        Convert fuzzy workflow strengths to crisp decision
        
        Uses weighted average defuzzification method
        """
        
        if not workflow_strengths:
            return WorkflowType.COMPLETE_SYSTEM, 0.5  # Default fallback
        
        # Normalize strengths to get relative confidence
        total_strength = sum(workflow_strengths.values())
        
        if total_strength == 0:
            return WorkflowType.COMPLETE_SYSTEM, 0.5  # Default fallback
        
        normalized_strengths = {
            workflow: strength / total_strength 
            for workflow, strength in workflow_strengths.items()
        }
        
        # Select workflow with highest normalized strength
        best_workflow = max(normalized_strengths, key=normalized_strengths.get)
        best_confidence = normalized_strengths[best_workflow]
        
        return best_workflow, best_confidence
    
    def generate_linguistic_interpretation(self, crisp_inputs: Dict[str, float], 
                                         fuzzified_inputs: Dict[str, Dict[str, float]]) -> Dict[str, str]:
        """
        Generate human-readable linguistic interpretation of input values
        """
        
        interpretations = {}
        
        for factor_name, factor_memberships in fuzzified_inputs.items():
            # Find the linguistic term with highest membership
            max_membership = 0.0
            best_term = "unknown"
            
            for linguistic_term, membership in factor_memberships.items():
                if membership > max_membership:
                    max_membership = membership
                    best_term = linguistic_term
            
            # Add confidence qualifier based on membership strength
            if max_membership >= 0.8:
                qualifier = "very"
            elif max_membership >= 0.6:
                qualifier = "quite"
            elif max_membership >= 0.4:
                qualifier = "somewhat"
            else:
                qualifier = "slightly"
            
            crisp_value = crisp_inputs.get(factor_name, 0.0)
            interpretations[factor_name] = f"{qualifier} {best_term} ({crisp_value:.3f})"
        
        return interpretations
    
    def decide_workflow(self, crisp_inputs: Dict[str, float]) -> FuzzyDecisionResult:
        """
        Main decision function using fuzzy logic inference
        
        Args:
            crisp_inputs: Dictionary of factor_name -> value (0.0 to 1.0)
            
        Returns:
            FuzzyDecisionResult with workflow recommendation and fuzzy reasoning
        """
        
        # Step 1: Fuzzification
        fuzzified_inputs = self.fuzzify_inputs(crisp_inputs)
        
        # Step 2: Rule Evaluation
        rule_activations = self.evaluate_fuzzy_rules(fuzzified_inputs)
        
        # Step 3: Aggregation
        workflow_strengths = self.aggregate_rule_outputs(rule_activations)
        
        # Step 4: Defuzzification
        best_workflow, fuzzy_confidence = self.defuzzify_outputs(workflow_strengths)
        
        # Step 5: Linguistic Interpretation
        linguistic_interpretation = self.generate_linguistic_interpretation(crisp_inputs, fuzzified_inputs)
        
        # Create rule activation mapping for transparency
        rule_activation_map = {
            i: strength for i, (rule, strength) in enumerate(rule_activations)
        }
        
        return FuzzyDecisionResult(
            workflow=best_workflow,
            fuzzy_confidence=fuzzy_confidence,
            rule_activations=rule_activation_map,
            linguistic_interpretation=linguistic_interpretation,
            defuzzified_scores=workflow_strengths
        )
    
    def explain_fuzzy_decision(self, crisp_inputs: Dict[str, float], 
                             decision_result: FuzzyDecisionResult) -> str:
        """Generate human-readable explanation of fuzzy decision process"""
        
        explanation = f"""
🌊 FUZZY LOGIC DECISION ANALYSIS

🎯 Recommended Workflow: {decision_result.workflow.value.upper()}
🔮 Fuzzy Confidence: {decision_result.fuzzy_confidence:.1%}

📊 Linguistic Input Interpretation:
"""
        
        for factor_name, interpretation in decision_result.linguistic_interpretation.items():
            factor_display = factor_name.replace('_', ' ').title()
            explanation += f"  • {factor_display}: {interpretation}\n"
        
        explanation += f"""
⚖️ Workflow Suitability Scores:
"""
        
        # Sort workflows by strength
        sorted_workflows = sorted(decision_result.defuzzified_scores.items(), 
                                key=lambda x: x[1], reverse=True)
        
        for workflow, strength in sorted_workflows:
            indicator = "👑" if workflow == decision_result.workflow else "  "
            explanation += f"{indicator} {workflow.value}: {strength:.3f}\n"
        
        explanation += f"""
🔥 Active Fuzzy Rules: {len(decision_result.rule_activations)}
"""
        
        if decision_result.rule_activations:
            explanation += "  Top 3 Most Active Rules:\n"
            sorted_rules = sorted(decision_result.rule_activations.items(), 
                                key=lambda x: x[1], reverse=True)[:3]
            
            for rule_id, strength in sorted_rules:
                explanation += f"  • Rule #{rule_id + 1}: {strength:.3f} activation\n"
        
        return explanation
    
    def analyze_decision_uncertainty(self, decision_result: FuzzyDecisionResult) -> Dict[str, Any]:
        """Analyze uncertainty and confidence in fuzzy decision"""
        
        # Calculate entropy of workflow strengths
        strengths = list(decision_result.defuzzified_scores.values())
        total_strength = sum(strengths)
        
        if total_strength > 0:
            probabilities = [s / total_strength for s in strengths]
            entropy = -sum(p * math.log2(p) for p in probabilities if p > 0)
            max_entropy = math.log2(len(strengths))
            normalized_entropy = entropy / max_entropy if max_entropy > 0 else 0
        else:
            normalized_entropy = 1.0  # Maximum uncertainty
        
        # Decision margin
        sorted_strengths = sorted(strengths, reverse=True)
        decision_margin = (sorted_strengths[0] - sorted_strengths[1]) if len(sorted_strengths) > 1 else sorted_strengths[0]
        
        # Number of competing alternatives
        significant_alternatives = sum(1 for s in strengths if s > 0.1)
        
        uncertainty_analysis = {
            'entropy': normalized_entropy,
            'decision_margin': decision_margin,
            'competing_alternatives': significant_alternatives,
            'confidence_level': self.classify_fuzzy_confidence(decision_result.fuzzy_confidence),
            'decision_clarity': 'Clear' if decision_margin > 0.3 else 
                              'Moderate' if decision_margin > 0.1 else 'Unclear'
        }
        
        return uncertainty_analysis
    
    def classify_fuzzy_confidence(self, confidence: float) -> str:
        """Classify fuzzy confidence into human-readable levels"""
        if confidence >= 0.8:
            return "Very High"
        elif confidence >= 0.65:
            return "High"
        elif confidence >= 0.5:
            return "Moderate"
        elif confidence >= 0.35:
            return "Low"
        else:
            return "Very Low"


# Example usage and testing
def example_fuzzy_decision():
    """Example of using the fuzzy logic decision system"""
    
    # Initialize fuzzy system
    fuzzy_system = FuzzyWorkflowDecisionSystem()
    
    # Example task inputs
    crisp_inputs = {
        'technical_complexity': 0.75,  # Complex
        'scope_impact': 0.4,           # Moderate
        'risk_factor': 0.85,           # High
        'context_load': 0.3,           # Light
        'time_pressure': 0.6           # Urgent
    }
    
    # Get fuzzy decision
    fuzzy_result = fuzzy_system.decide_workflow(crisp_inputs)
    
    # Generate explanation
    explanation = fuzzy_system.explain_fuzzy_decision(crisp_inputs, fuzzy_result)
    
    # Analyze uncertainty
    uncertainty = fuzzy_system.analyze_decision_uncertainty(fuzzy_result)
    
    print(explanation)
    print(f"\n🔍 Uncertainty Analysis: {uncertainty}")
    
    return fuzzy_result


if __name__ == "__main__":
    # Run example
    example_result = example_fuzzy_decision()