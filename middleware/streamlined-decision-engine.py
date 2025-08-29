"""
Streamlined Decision Engine for Claude Agent System

Balanced approach: Sophisticated 5-dimensional analysis with practical rule-based logic.
Maintains decision quality while avoiding over-engineering complexity.
"""

import math
import re
import logging
from typing import Dict, List, Tuple, Any, Optional
from dataclasses import dataclass
from enum import Enum
# Import constants with fallback for standalone execution
try:
    from .decision_constants import (
        SCORE_MIN, SCORE_MAX, CONTEXT_OVERFLOW_THRESHOLD, CRITICAL_RISK_THRESHOLD,
        CRITICAL_TIME_THRESHOLD, TECH_COMPLEXITY_WEIGHTS, RISK_WEIGHTS, 
        TIME_PRESSURE_WEIGHTS, TIME_SPECIFIC_PHRASES, CONTEXT_LOAD_PARAMS,
        SCOPE_PARAMS, GLOBAL_SCOPE_INDICATORS, MULTI_COMPONENT_INDICATORS,
        GROWTH_INDICATORS, WORKFLOW_WEIGHTS, WORKFLOW_SUITABILITY, SCORE_LEVELS,
        NORMALIZATION, VALIDATION, FALLBACK
    )
except ImportError:
    from decision_constants import (
        SCORE_MIN, SCORE_MAX, CONTEXT_OVERFLOW_THRESHOLD, CRITICAL_RISK_THRESHOLD,
        CRITICAL_TIME_THRESHOLD, TECH_COMPLEXITY_WEIGHTS, RISK_WEIGHTS, 
        TIME_PRESSURE_WEIGHTS, TIME_SPECIFIC_PHRASES, CONTEXT_LOAD_PARAMS,
        SCOPE_PARAMS, GLOBAL_SCOPE_INDICATORS, MULTI_COMPONENT_INDICATORS,
        GROWTH_INDICATORS, WORKFLOW_WEIGHTS, WORKFLOW_SUITABILITY, SCORE_LEVELS,
        NORMALIZATION, VALIDATION, FALLBACK
    )


class WorkflowType(Enum):
    """Available workflow types"""
    ORCHESTRATED = "orchestrated"
    COMPLETE_SYSTEM = "complete_system"
    TASKIT = "taskit"
    AIDEVTASKS = "aidevtasks"


class RiskLevel(Enum):
    """Risk level classifications"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


@dataclass
class TaskAnalysis:
    """Comprehensive task analysis with 5 dimensions"""
    technical_complexity: float
    scope_impact: float
    risk_factor: float
    context_load: float
    time_pressure: float
    
    def __post_init__(self):
        # Ensure all scores are in valid range
        for field in ['technical_complexity', 'scope_impact', 'risk_factor', 'context_load', 'time_pressure']:
            value = getattr(self, field)
            setattr(self, field, max(0.0, min(1.0, value)))


@dataclass
class DecisionResult:
    """Streamlined decision result"""
    workflow: WorkflowType
    confidence: float
    reasoning: str
    factor_scores: TaskAnalysis
    decision_factors: List[str]
    alternatives_considered: List[Tuple[WorkflowType, float]]


class StreamlinedDecisionEngine:
    """
    Streamlined decision engine that balances sophistication with maintainability.
    
    Key Principles:
    1. 5-dimensional scoring for nuanced analysis
    2. Rule-based logic instead of complex mathematical models  
    3. Transparent reasoning without mathematical complexity
    4. Robust fallbacks and error handling
    5. Performance-optimized for real-time use
    """
    
    def __init__(self):
        # Initialize logging
        self.logger = logging.getLogger(__name__)
        
        try:
            self.initialize_scoring_weights()
            self.initialize_workflow_thresholds()
            self.initialize_decision_rules()
            self.logger.info("StreamlinedDecisionEngine initialized successfully")
        except Exception as e:
            self.logger.error(f"Failed to initialize StreamlinedDecisionEngine: {e}")
            raise
    
    def initialize_scoring_weights(self):
        """Initialize factor importance weights for different workflow types"""
        
        self.workflow_factor_weights = {
            WorkflowType.ORCHESTRATED: WORKFLOW_WEIGHTS['ORCHESTRATED'],
            WorkflowType.COMPLETE_SYSTEM: WORKFLOW_WEIGHTS['COMPLETE_SYSTEM'],
            WorkflowType.TASKIT: WORKFLOW_WEIGHTS['TASKIT'],
            WorkflowType.AIDEVTASKS: WORKFLOW_WEIGHTS['AIDEVTASKS']
        }
    
    def initialize_workflow_thresholds(self):
        """Initialize decision thresholds for workflow selection"""
        
        # Critical override thresholds
        self.critical_thresholds = {
            'context_overflow': CONTEXT_OVERFLOW_THRESHOLD,
            'critical_risk': CRITICAL_RISK_THRESHOLD,
            'critical_time': CRITICAL_TIME_THRESHOLD
        }
        
        # Workflow suitability ranges
        self.workflow_suitability = {
            WorkflowType.ORCHESTRATED: {
                'technical_complexity': (0.0, 0.4),
                'scope_impact': (0.0, 0.4),
                'risk_factor': (0.0, 0.3),
                'optimal_range': (0.0, 0.35)
            },
            WorkflowType.COMPLETE_SYSTEM: {
                'technical_complexity': (0.3, 1.0),
                'scope_impact': (0.0, 0.8),
                'risk_factor': (0.3, 1.0),
                'optimal_range': (0.4, 0.8)
            },
            WorkflowType.TASKIT: {
                'technical_complexity': (0.0, 1.0),
                'scope_impact': (0.6, 1.0),
                'context_load': (0.6, 1.0),
                'optimal_range': (0.6, 1.0)
            },
            WorkflowType.AIDEVTASKS: {
                'technical_complexity': (0.4, 0.8),
                'scope_impact': (0.4, 0.8),
                'risk_factor': (0.2, 0.6),
                'optimal_range': (0.3, 0.7)
            }
        }
    
    def initialize_decision_rules(self):
        """Initialize enhanced rule-based decision logic"""
        
        self.decision_rules = [
            # Priority 1: Critical overrides
            {
                'name': 'Context Overflow Protection',
                'condition': lambda analysis: analysis.context_load > self.critical_thresholds['context_overflow'],
                'workflow': WorkflowType.TASKIT,
                'confidence': 0.95,
                'priority': 1
            },
            {
                'name': 'Critical Risk Protection',
                'condition': lambda analysis: analysis.risk_factor > self.critical_thresholds['critical_risk'],
                'workflow': WorkflowType.COMPLETE_SYSTEM,
                'confidence': 0.9,
                'priority': 1
            },
            
            # Priority 2: Optimal fit rules
            {
                'name': 'Simple Low-Risk Task',
                'condition': lambda analysis: (
                    analysis.technical_complexity < 0.3 and
                    analysis.scope_impact < 0.4 and
                    analysis.risk_factor < 0.3
                ),
                'workflow': WorkflowType.ORCHESTRATED,
                'confidence': 0.85,
                'priority': 2
            },
            {
                'name': 'Large Scope Task',
                'condition': lambda analysis: (
                    analysis.scope_impact > 0.6 and
                    analysis.context_load > 0.5
                ),
                'workflow': WorkflowType.TASKIT,
                'confidence': 0.8,
                'priority': 2
            },
            {
                'name': 'High-Risk Complex Task',
                'condition': lambda analysis: (
                    analysis.risk_factor > 0.5 and
                    analysis.technical_complexity > 0.4
                ),
                'workflow': WorkflowType.COMPLETE_SYSTEM,
                'confidence': 0.85,
                'priority': 2
            },
            {
                'name': 'Feature Development Task',
                'condition': lambda analysis: (
                    0.4 <= analysis.technical_complexity <= 0.7 and
                    0.4 <= analysis.scope_impact <= 0.7 and
                    analysis.risk_factor < 0.6
                ),
                'workflow': WorkflowType.AIDEVTASKS,
                'confidence': 0.75,
                'priority': 2
            }
        ]
    
    def calculate_five_dimensional_scores(self, task_description: str, 
                                        context_info: Dict[str, Any]) -> TaskAnalysis:
        """
        Calculate scores across 5 dimensions using practical algorithms
        """
        
        try:
            # 1. Technical Complexity - Enhanced keyword analysis with weighting
            technical_complexity = self._safe_calculate(
                self.calculate_technical_complexity, task_description, 'technical_complexity'
            )
            
            # 2. Scope Impact - Project scope analysis
            scope_impact = self._safe_calculate(
                self.calculate_scope_impact, task_description, context_info, 'scope_impact'
            )
            
            # 3. Risk Factor - Risk indicator detection
            risk_factor = self._safe_calculate(
                self.calculate_risk_factor, task_description, 'risk_factor'
            )
            
            # 4. Context Load - Context size and growth prediction
            context_load = self._safe_calculate(
                self.calculate_context_load, task_description, context_info, 'context_load'
            )
            
            # 5. Time Pressure - Urgency detection
            time_pressure = self._safe_calculate(
                self.calculate_time_pressure, task_description, 'time_pressure'
            )
            
            analysis = TaskAnalysis(
                technical_complexity=technical_complexity,
                scope_impact=scope_impact,
                risk_factor=risk_factor,
                context_load=context_load,
                time_pressure=time_pressure
            )
            
            self.logger.debug(f"Five-dimensional analysis completed: {analysis}")
            return analysis
            
        except Exception as e:
            self.logger.error(f"Error in five-dimensional analysis: {e}")
            # Return conservative fallback scores
            return TaskAnalysis(
                technical_complexity=0.5,
                scope_impact=0.5,
                risk_factor=0.7,  # Conservative high risk
                context_load=0.3,
                time_pressure=0.2
            )
    
    def _safe_calculate(self, func, *args, score_name: str) -> float:
        """Safely execute calculation function with error handling"""
        try:
            result = func(*args)
            if not isinstance(result, (int, float)) or not (SCORE_MIN <= result <= SCORE_MAX):
                self.logger.warning(f"Invalid {score_name} score: {result}, using fallback")
                return 0.5  # Safe middle ground
            return float(result)
        except Exception as e:
            self.logger.error(f"Error calculating {score_name}: {e}")
            return 0.5  # Safe fallback
    
    def calculate_technical_complexity(self, task_description: str) -> float:
        """Enhanced technical complexity calculation"""
        
        if not task_description:
            return 0.0
            
        desc_lower = task_description.lower()
        complexity_score = 0.0
        
        # Use centralized complexity weights
        complexity_patterns = {
            **TECH_COMPLEXITY_WEIGHTS['HIGH'],
            **TECH_COMPLEXITY_WEIGHTS['MEDIUM'], 
            **TECH_COMPLEXITY_WEIGHTS['LOW']
        }
        
        # Calculate weighted score with performance optimization
        matched_patterns = 0
        for pattern, weight in complexity_patterns.items():
            if pattern in desc_lower:
                complexity_score += weight
                matched_patterns += 1
                # Early termination for very high complexity
                if complexity_score > 1.5:
                    break
        
        # Normalize using constants
        sigmoid_center = NORMALIZATION['SIGMOID_CENTER']
        sigmoid_scale = NORMALIZATION['SIGMOID_SCALE']
        normalized_score = 1 / (1 + math.exp(-(complexity_score - sigmoid_center) / sigmoid_scale))
        
        result = max(SCORE_MIN, min(SCORE_MAX, normalized_score))
        
        # Log for debugging if high complexity detected
        if result > SCORE_LEVELS['HIGH']:
            self.logger.debug(f"High technical complexity detected: {result:.3f} from {matched_patterns} patterns")
            
        return result
    
    def calculate_scope_impact(self, task_description: str, context_info: Dict[str, Any]) -> float:
        """Calculate scope impact based on breadth indicators"""
        
        desc_lower = task_description.lower()
        scope_score = 0.0
        
        # Global scope indicators
        global_indicators = ['all', 'entire', 'every', 'across', 'throughout', 'system-wide']
        global_matches = sum(1 for indicator in global_indicators if indicator in desc_lower)
        scope_score += min(0.4, global_matches * 0.15)
        
        # Multi-component indicators
        multi_indicators = ['multiple', 'several', 'various', 'different', 'many']
        multi_matches = sum(1 for indicator in multi_indicators if indicator in desc_lower)
        scope_score += min(0.3, multi_matches * 0.1)
        
        # Project context adjustment
        loaded_files = context_info.get('loaded_files', 0)
        if loaded_files > 10:
            scope_score += 0.2
        elif loaded_files > 5:
            scope_score += 0.1
        
        # Word count as complexity indicator
        word_count = len(task_description.split())
        if word_count > 100:
            scope_score += 0.2
        elif word_count > 50:
            scope_score += 0.1
        return max(0.0, min(1.0, scope_score))
    
    def calculate_risk_factor(self, task_description: str) -> float:
        """Calculate risk factor using pattern recognition"""
        
        desc_lower = task_description.lower()
        risk_score = 0.0
        
        # Critical risk indicators
        critical_risks = {
            'breaking': 0.4,
            'delete': 0.3,
            'remove': 0.3,
            'drop': 0.3,
            'migrate': 0.25,
            'production': 0.3,
            'live': 0.3,
            'critical': 0.4
        }
        
        # High risk indicators
        high_risks = {
            'security': 0.25,
            'auth': 0.2,
            'password': 0.25,
            'permission': 0.2,
            'admin': 0.2,
            'schema': 0.2,
            'database': 0.15,
            'api': 0.1
        }
        
        # Medium risk indicators
        medium_risks = {
            'change': 0.05,
            'modify': 0.05,
            'update': 0.05,
            'refactor': 0.1
        }
        
        # Calculate weighted risk score
        for pattern, weight in critical_risks.items():
            if pattern in desc_lower:
                risk_score += weight
        
        for pattern, weight in high_risks.items():
            if pattern in desc_lower:
                risk_score += weight
        
        for pattern, weight in medium_risks.items():
            if pattern in desc_lower:
                risk_score += weight
        
        return max(0.0, min(1.0, risk_score))
    
    def calculate_context_load(self, task_description: str, context_info: Dict[str, Any]) -> float:
        """Calculate context load and growth prediction"""
        
        current_tokens = context_info.get('current_tokens', 0)
        loaded_files = context_info.get('loaded_files', 0)
        
        # Base context load
        base_load = min(0.5, current_tokens / 25000.0)  # 25k tokens = 0.5 load
        
        # File load factor
        file_load = min(0.3, loaded_files / 20.0)  # 20 files = 0.3 load
        
        # Growth prediction based on task description
        desc_lower = task_description.lower()
        growth_indicators = [
            'implement', 'create', 'build', 'design', 'refactor',
            'architecture', 'system', 'complex', 'integration'
        ]
        
        growth_factor = sum(1 for indicator in growth_indicators if indicator in desc_lower)
        predicted_growth = min(0.4, growth_factor * 0.08)
        
        total_context_load = base_load + file_load + predicted_growth
        
        return max(0.0, min(1.0, total_context_load))
    
    def calculate_time_pressure(self, task_description: str) -> float:
        """Calculate time pressure using linguistic analysis"""
        
        desc_lower = task_description.lower()
        
        # Time pressure indicators with weights
        urgency_indicators = {
            'urgent': 0.3,
            'asap': 0.35,
            'immediately': 0.35,
            'critical': 0.4,
            'emergency': 0.45,
            'quickly': 0.25,
            'fast': 0.2,
            'soon': 0.15,
            'deadline': 0.25,
            'priority': 0.2,
            'rush': 0.3
        }
        
        # Time-specific indicators
        time_specific = ['today', 'tonight', 'tomorrow', 'this morning', 'right now']
        
        time_pressure_score = 0.0
        
        # Check urgency indicators
        for indicator, weight in urgency_indicators.items():
            if indicator in desc_lower:
                time_pressure_score = max(time_pressure_score, weight)
        
        # Check time-specific mentions
        if any(time_phrase in desc_lower for time_phrase in time_specific):
            time_pressure_score = max(time_pressure_score, 0.4)
        
        # Check for multiple urgency indicators
        urgency_count = sum(1 for indicator in urgency_indicators.keys() if indicator in desc_lower)
        if urgency_count > 2:
            time_pressure_score += 0.1
        
        return max(0.0, min(1.0, time_pressure_score))
    
    def select_workflow(self, task_analysis: TaskAnalysis) -> DecisionResult:
        """Select optimal workflow using enhanced rule-based logic"""
        
        # Apply decision rules in priority order
        matching_rules = []
        
        for rule in self.decision_rules:
            if rule['condition'](task_analysis):
                matching_rules.append(rule)
        
        # Sort by priority (lower number = higher priority)
        matching_rules.sort(key=lambda x: x['priority'])
        
        if matching_rules:
            # Use highest priority matching rule
            selected_rule = matching_rules[0]
            workflow = selected_rule['workflow']
            confidence = selected_rule['confidence']
            primary_reasoning = selected_rule['name']
        else:
            # Fallback to weighted scoring
            workflow, confidence, primary_reasoning = self.fallback_scoring_selection(task_analysis)
        
        # Calculate alternatives
        alternatives = self.calculate_alternatives(task_analysis, workflow)
        
        # Generate detailed reasoning
        decision_factors = self.identify_decision_factors(task_analysis, workflow)
        detailed_reasoning = self.generate_detailed_reasoning(
            task_analysis, workflow, primary_reasoning, decision_factors
        )
        
        return DecisionResult(
            workflow=workflow,
            confidence=confidence,
            reasoning=detailed_reasoning,
            factor_scores=task_analysis,
            decision_factors=decision_factors,
            alternatives_considered=alternatives
        )
    
    def fallback_scoring_selection(self, task_analysis: TaskAnalysis) -> Tuple[WorkflowType, float, str]:
        """Fallback weighted scoring when no rules match"""
        
        workflow_scores = {}
        
        for workflow, weights in self.workflow_factor_weights.items():
            score = (
                task_analysis.technical_complexity * weights['technical_complexity'] +
                task_analysis.scope_impact * weights['scope_impact'] +
                task_analysis.risk_factor * weights['risk_factor'] +
                task_analysis.context_load * weights['context_load'] +
                task_analysis.time_pressure * weights['time_pressure']
            )
            workflow_scores[workflow] = score
        
        # Select workflow with highest score
        best_workflow = max(workflow_scores, key=workflow_scores.get)
        best_score = workflow_scores[best_workflow]
        
        # Calculate confidence based on score margin
        scores = list(workflow_scores.values())
        scores.sort(reverse=True)
        margin = scores[0] - scores[1] if len(scores) > 1 else scores[0]
        confidence = min(0.9, 0.5 + margin)
        
        return best_workflow, confidence, "Weighted factor analysis"
    
    def calculate_alternatives(self, task_analysis: TaskAnalysis, 
                             selected_workflow: WorkflowType) -> List[Tuple[WorkflowType, float]]:
        """Calculate alternative workflows with suitability scores"""
        
        alternatives = []
        
        for workflow in WorkflowType:
            if workflow != selected_workflow:
                suitability = self.calculate_workflow_suitability(task_analysis, workflow)
                if suitability > 0.2:  # Only include viable alternatives
                    alternatives.append((workflow, suitability))
        
        # Sort by suitability score
        alternatives.sort(key=lambda x: x[1], reverse=True)
        
        return alternatives[:3]  # Return top 3 alternatives
    
    def calculate_workflow_suitability(self, task_analysis: TaskAnalysis, 
                                     workflow: WorkflowType) -> float:
        """Calculate how suitable a workflow is for the given task"""
        
        weights = self.workflow_factor_weights[workflow]
        
        suitability = (
            task_analysis.technical_complexity * weights['technical_complexity'] +
            task_analysis.scope_impact * weights['scope_impact'] +
            task_analysis.risk_factor * weights['risk_factor'] +
            task_analysis.context_load * weights['context_load'] +
            task_analysis.time_pressure * weights['time_pressure']
        )
        
        return max(0.0, min(1.0, suitability))
    
    def identify_decision_factors(self, task_analysis: TaskAnalysis, 
                                workflow: WorkflowType) -> List[str]:
        """Identify key factors that influenced the decision"""
        
        factors = []
        
        # Check for high-impact factors
        if task_analysis.technical_complexity > 0.6:
            factors.append(f"High technical complexity ({task_analysis.technical_complexity:.2f})")
        
        if task_analysis.scope_impact > 0.6:
            factors.append(f"Large scope impact ({task_analysis.scope_impact:.2f})")
        
        if task_analysis.risk_factor > 0.5:
            factors.append(f"Significant risk factors ({task_analysis.risk_factor:.2f})")
        
        if task_analysis.context_load > 0.6:
            factors.append(f"High context load ({task_analysis.context_load:.2f})")
        
        if task_analysis.time_pressure > 0.5:
            factors.append(f"Time pressure detected ({task_analysis.time_pressure:.2f})")
        
        # Add workflow-specific reasoning
        if workflow == WorkflowType.ORCHESTRATED:
            factors.append("Suitable for streamlined execution")
        elif workflow == WorkflowType.COMPLETE_SYSTEM:
            factors.append("Requires comprehensive validation")
        elif workflow == WorkflowType.TASKIT:
            factors.append("Benefits from phase-based approach")
        elif workflow == WorkflowType.AIDEVTASKS:
            factors.append("Feature development with PRD approach")
        
        return factors
    
    def generate_detailed_reasoning(self, task_analysis: TaskAnalysis, 
                                  workflow: WorkflowType, primary_reasoning: str,
                                  decision_factors: List[str]) -> str:
        """Generate comprehensive but readable decision explanation"""
        
        reasoning = f"""
🧮 ENHANCED DECISION ANALYSIS

🎯 Selected Workflow: {workflow.value.upper()}
📊 Decision Basis: {primary_reasoning}

📐 Five-Dimensional Analysis:
  • Technical Complexity: {task_analysis.technical_complexity:.3f} ({self.classify_score_level(task_analysis.technical_complexity)})
  • Scope Impact: {task_analysis.scope_impact:.3f} ({self.classify_score_level(task_analysis.scope_impact)})
  • Risk Factor: {task_analysis.risk_factor:.3f} ({self.classify_score_level(task_analysis.risk_factor)})
  • Context Load: {task_analysis.context_load:.3f} ({self.classify_score_level(task_analysis.context_load)})
  • Time Pressure: {task_analysis.time_pressure:.3f} ({self.classify_score_level(task_analysis.time_pressure)})

🔍 Key Decision Factors:
"""
        
        for factor in decision_factors[:5]:  # Limit to top 5 factors
            reasoning += f"  • {factor}\n"
        
        reasoning += f"""
⚖️ Workflow Suitability Analysis:
  → {workflow.value}: Optimal match for task characteristics
  → Enhanced rule-based logic with 5-dimensional scoring
  → Practical decision-making without over-engineering

🎓 Decision Method: Streamlined analysis balancing sophistication with maintainability
"""
        
        return reasoning.strip()
    
    def classify_score_level(self, score: float) -> str:
        """Convert numerical score to human-readable level"""
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


# Main integration function for systemcc
def enhanced_workflow_selection(task_description: str, context_info: Dict[str, Any], 
                              memory_context: Dict[str, Any]) -> Dict[str, Any]:
    """
    Main entry point for streamlined workflow selection
    
    Provides sophisticated analysis without over-engineering complexity
    """
    
    # Input validation
    if not task_description or not isinstance(task_description, str):
        raise ValueError("task_description must be a non-empty string")
    
    if len(task_description.strip()) == 0:
        raise ValueError("task_description cannot be empty or whitespace only")
    
    if len(task_description) > VALIDATION['MAX_TASK_DESCRIPTION_LENGTH']:
        task_description = task_description[:VALIDATION['MAX_TASK_DESCRIPTION_LENGTH']]
    
    # Ensure context_info has required structure
    context_info = context_info or {}
    context_info.setdefault('current_tokens', 0)
    context_info.setdefault('loaded_files', 0)
    
    # Validate context values
    context_info['current_tokens'] = max(0, int(context_info.get('current_tokens', 0)))
    context_info['loaded_files'] = max(0, int(context_info.get('loaded_files', 0)))
    
    try:
        # Initialize streamlined decision engine
        engine = StreamlinedDecisionEngine()
        
        # Calculate 5-dimensional analysis
        task_analysis = engine.calculate_five_dimensional_scores(task_description, context_info)
        
        # Select optimal workflow
        decision_result = engine.select_workflow(task_analysis)
        
        return {
            'workflow': decision_result.workflow.value,
            'reasoning': decision_result.reasoning,
            'confidence': decision_result.confidence,
            'factor_scores': {
                'technical_complexity': task_analysis.technical_complexity,
                'scope_impact': task_analysis.scope_impact,
                'risk_factor': task_analysis.risk_factor,
                'context_load': task_analysis.context_load,
                'time_pressure': task_analysis.time_pressure
            },
            'decision_factors': decision_result.decision_factors,
            'alternatives': [(alt[0].value, alt[1]) for alt in decision_result.alternatives_considered],
            'decision_method': 'Enhanced 5-Dimensional Analysis with Rule-Based Logic'
        }
    
    except Exception as e:
        # Robust fallback to simple logic
        return simple_fallback_selection(task_description, context_info, str(e))


def simple_fallback_selection(task_description: str, context_info: Dict[str, Any], 
                            error_details: str) -> Dict[str, Any]:
    """Simple fallback logic if enhanced system fails"""
    
    desc_lower = task_description.lower()
    
    # Context-based overrides
    if context_info.get('current_tokens', 0) > 30000:
        return {
            'workflow': 'taskit',
            'reasoning': 'Context size exceeds threshold (fallback mode)',
            'confidence': 0.8,
            'error': f'Enhanced engine failed: {error_details}'
        }
    
    # Simple keyword-based routing
    if any(word in desc_lower for word in ['fix', 'simple', 'quick', 'small']):
        workflow = 'orchestrated'
        confidence = 0.75
    elif any(word in desc_lower for word in ['complex', 'architecture', 'system', 'critical']):
        workflow = 'complete_system'
        confidence = 0.7
    else:
        workflow = 'complete_system'  # Safe default
        confidence = 0.6
    
    return {
        'workflow': workflow,
        'reasoning': f'Simple keyword-based selection (fallback mode)',
        'confidence': confidence,
        'error': f'Enhanced engine failed: {error_details}'
    }


# Example usage
if __name__ == "__main__":
    # Test the streamlined engine
    engine = StreamlinedDecisionEngine()
    
    test_cases = [
        "Fix typo in button text",
        "Implement real-time chat with WebSocket support and user authentication",
        "Refactor entire authentication system across all microservices",
        "URGENT: Fix critical production bug in payment processing"
    ]
    
    for task in test_cases:
        context = {'current_tokens': 5000, 'loaded_files': 3}
        result = enhanced_workflow_selection(task, context, {})
        print(f"\nTask: {task}")
        print(f"Workflow: {result['workflow']}")
        print(f"Confidence: {result['confidence']:.1%}")
        print("---")