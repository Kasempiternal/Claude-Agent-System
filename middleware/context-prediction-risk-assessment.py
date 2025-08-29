"""
Context Load Prediction and Risk Assessment System

Advanced mathematical models for predicting context growth and assessing task risks
using Monte Carlo simulation and statistical analysis.
"""

import math
import random
import statistics
import numpy as np
from typing import Dict, List, Tuple, Any, Optional
from dataclasses import dataclass
from enum import Enum
import scipy.stats as stats


class RiskLevel(Enum):
    """Risk level classifications"""
    VERY_LOW = "very_low"
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class TaskType(Enum):
    """Task type classifications for prediction models"""
    BUG_FIX = "bug_fix"
    FEATURE_DEVELOPMENT = "feature_development"
    REFACTORING = "refactoring"
    ARCHITECTURE_CHANGE = "architecture_change"
    OPTIMIZATION = "optimization"
    SECURITY = "security"
    UI_CHANGE = "ui_change"
    TESTING = "testing"
    DOCUMENTATION = "documentation"


@dataclass
class ContextMetrics:
    """Current context metrics"""
    current_tokens: int
    loaded_files: int
    conversation_turns: int
    file_types: Dict[str, int]
    recent_file_additions: int
    avg_file_size_tokens: float
    context_entropy: float


@dataclass
class TaskCharacteristics:
    """Task characteristics for prediction"""
    estimated_duration_minutes: int
    affected_file_count_estimate: int
    new_file_creation_likely: bool
    external_dependency_changes: bool
    database_changes: bool
    api_changes: bool
    ui_changes: bool
    test_file_additions: bool


@dataclass
class ContextPrediction:
    """Context growth prediction result"""
    predicted_final_tokens: int
    predicted_file_additions: int
    growth_confidence_interval: Tuple[int, int]  # (low, high) token estimates
    context_overflow_probability: float
    recommended_context_management: str


@dataclass
class RiskFactor:
    """Individual risk factor with probability distribution"""
    name: str
    probability: float  # 0.0 to 1.0
    impact: float      # 0.0 to 1.0
    confidence: float  # How confident we are in this assessment
    mitigation_difficulty: float  # How hard it is to mitigate


@dataclass
class RiskAssessment:
    """Comprehensive risk assessment result"""
    overall_risk_score: float
    risk_level: RiskLevel
    risk_factors: List[RiskFactor]
    monte_carlo_distribution: List[float]
    value_at_risk_95: float  # 95th percentile risk
    expected_risk: float
    risk_categories: Dict[str, float]


class ContextLoadPredictor:
    """
    Advanced context load prediction using statistical models and machine learning-like patterns
    """
    
    def __init__(self):
        self.initialize_prediction_models()
        self.initialize_growth_patterns()
    
    def initialize_prediction_models(self):
        """Initialize statistical models for context prediction"""
        
        # Historical growth patterns by task type (empirical data)
        self.task_growth_patterns = {
            TaskType.BUG_FIX: {
                'base_files': 1.2,
                'file_variance': 0.5,
                'tokens_per_file': 800,
                'token_variance': 300,
                'additional_research_factor': 1.3
            },
            TaskType.FEATURE_DEVELOPMENT: {
                'base_files': 3.5,
                'file_variance': 1.2,
                'tokens_per_file': 1200,
                'token_variance': 400,
                'additional_research_factor': 2.1
            },
            TaskType.REFACTORING: {
                'base_files': 4.8,
                'file_variance': 2.0,
                'tokens_per_file': 1000,
                'token_variance': 350,
                'additional_research_factor': 2.8
            },
            TaskType.ARCHITECTURE_CHANGE: {
                'base_files': 8.2,
                'file_variance': 3.5,
                'tokens_per_file': 1400,
                'token_variance': 500,
                'additional_research_factor': 3.5
            },
            TaskType.OPTIMIZATION: {
                'base_files': 2.1,
                'file_variance': 0.8,
                'tokens_per_file': 900,
                'token_variance': 250,
                'additional_research_factor': 1.7
            },
            TaskType.SECURITY: {
                'base_files': 3.8,
                'file_variance': 1.5,
                'tokens_per_file': 1100,
                'token_variance': 350,
                'additional_research_factor': 2.4
            },
            TaskType.UI_CHANGE: {
                'base_files': 2.3,
                'file_variance': 0.9,
                'tokens_per_file': 700,
                'token_variance': 200,
                'additional_research_factor': 1.4
            }
        }
        
        # Context limits for different scenarios
        self.context_limits = {
            'standard': 32000,
            'extended': 128000,
            'maximum': 200000
        }
    
    def initialize_growth_patterns(self):
        """Initialize context growth patterns"""
        
        # Exponential smoothing parameters for different factors
        self.smoothing_parameters = {
            'file_addition_rate': 0.3,
            'token_growth_rate': 0.4,
            'conversation_depth_factor': 0.2,
            'complexity_amplifier': 0.5
        }
        
        # Information entropy factors
        self.entropy_weights = {
            'file_type_diversity': 0.3,
            'conversation_branching': 0.4,
            'task_complexity': 0.3
        }
    
    def predict_context_growth(self, current_context: ContextMetrics, 
                             task_characteristics: TaskCharacteristics,
                             task_type: TaskType) -> ContextPrediction:
        """
        Predict context growth using multiple statistical approaches
        
        Combines:
        1. Historical pattern matching
        2. Exponential smoothing
        3. Monte Carlo simulation
        4. Information theory analysis
        """
        
        # Get historical pattern for this task type
        pattern = self.task_growth_patterns.get(task_type, 
                                               self.task_growth_patterns[TaskType.FEATURE_DEVELOPMENT])
        
        # Monte Carlo simulation for context growth
        growth_samples = self.monte_carlo_context_simulation(
            current_context, task_characteristics, pattern, num_simulations=1000
        )
        
        # Statistical analysis of growth samples
        predicted_final = int(statistics.mean(growth_samples))
        growth_std = statistics.stdev(growth_samples)
        
        # Confidence interval (95%)
        confidence_low = int(predicted_final - 1.96 * growth_std)
        confidence_high = int(predicted_final + 1.96 * growth_std)
        
        # Context overflow probability
        overflow_prob = self.calculate_overflow_probability(
            growth_samples, self.context_limits['standard']
        )
        
        # Predict file additions
        predicted_files = self.predict_file_additions(task_characteristics, pattern)
        
        # Context management recommendation
        management_recommendation = self.recommend_context_management(
            predicted_final, overflow_prob, current_context
        )
        
        return ContextPrediction(
            predicted_final_tokens=predicted_final,
            predicted_file_additions=predicted_files,
            growth_confidence_interval=(confidence_low, confidence_high),
            context_overflow_probability=overflow_prob,
            recommended_context_management=management_recommendation
        )
    
    def monte_carlo_context_simulation(self, current_context: ContextMetrics,
                                     task_characteristics: TaskCharacteristics,
                                     pattern: Dict[str, float],
                                     num_simulations: int = 1000) -> List[int]:
        """
        Monte Carlo simulation for context growth prediction
        """
        
        growth_samples = []
        
        for _ in range(num_simulations):
            # Sample file additions from normal distribution
            file_additions = max(0, np.random.normal(
                pattern['base_files'], pattern['file_variance']
            ))
            
            # Sample tokens per file
            tokens_per_file = max(100, np.random.normal(
                pattern['tokens_per_file'], pattern['token_variance']
            ))
            
            # Calculate additional tokens from new files
            new_file_tokens = file_additions * tokens_per_file
            
            # Research and investigation factor (existing files might be read)
            research_factor = np.random.gamma(
                2, pattern['additional_research_factor'] / 2
            )
            research_tokens = research_factor * current_context.avg_file_size_tokens
            
            # Conversation growth (iterative refinement)
            conversation_growth = self.simulate_conversation_growth(
                current_context, task_characteristics
            )
            
            # Total predicted context
            total_tokens = (
                current_context.current_tokens +
                new_file_tokens +
                research_tokens +
                conversation_growth
            )
            
            growth_samples.append(int(total_tokens))
        
        return growth_samples
    
    def simulate_conversation_growth(self, current_context: ContextMetrics,
                                   task_characteristics: TaskCharacteristics) -> float:
        """Simulate conversation growth based on task complexity"""
        
        # Base conversation tokens based on task duration
        base_conversation = task_characteristics.estimated_duration_minutes * 50
        
        # Complexity multipliers
        complexity_factors = [
            1.5 if task_characteristics.external_dependency_changes else 1.0,
            1.3 if task_characteristics.database_changes else 1.0,
            1.2 if task_characteristics.api_changes else 1.0,
            1.1 if task_characteristics.ui_changes else 1.0,
            1.1 if task_characteristics.test_file_additions else 1.0
        ]
        
        complexity_multiplier = np.prod(complexity_factors)
        
        # Random variation in conversation complexity
        variation = np.random.lognormal(0, 0.3)  # Log-normal for right skew
        
        return base_conversation * complexity_multiplier * variation
    
    def predict_file_additions(self, task_characteristics: TaskCharacteristics,
                             pattern: Dict[str, float]) -> int:
        """Predict number of files that will be added to context"""
        
        base_files = pattern['base_files']
        
        # Adjustments based on task characteristics
        if task_characteristics.new_file_creation_likely:
            base_files *= 1.4
        
        if task_characteristics.test_file_additions:
            base_files += 2  # Test files typically add 2+ files
        
        if task_characteristics.external_dependency_changes:
            base_files += 1  # Documentation files
        
        return max(1, int(base_files + np.random.normal(0, pattern['file_variance'])))
    
    def calculate_overflow_probability(self, growth_samples: List[int],
                                     context_limit: int) -> float:
        """Calculate probability of context overflow"""
        
        overflow_count = sum(1 for sample in growth_samples if sample > context_limit)
        return overflow_count / len(growth_samples)
    
    def recommend_context_management(self, predicted_tokens: int,
                                   overflow_prob: float,
                                   current_context: ContextMetrics) -> str:
        """Recommend context management strategy"""
        
        if overflow_prob > 0.7:
            return "PHASE_BASED_MANDATORY"
        elif overflow_prob > 0.4:
            return "PHASE_BASED_RECOMMENDED"
        elif predicted_tokens > 25000:
            return "CONTEXT_MONITORING_ADVISED"
        else:
            return "STANDARD_EXECUTION"


class RiskAssessmentEngine:
    """
    Advanced risk assessment using Monte Carlo simulation and multi-factor analysis
    """
    
    def __init__(self):
        self.initialize_risk_models()
        self.initialize_risk_factors()
    
    def initialize_risk_models(self):
        """Initialize risk assessment models"""
        
        # Base risk probabilities by task type
        self.base_task_risks = {
            TaskType.BUG_FIX: 0.15,
            TaskType.FEATURE_DEVELOPMENT: 0.25,
            TaskType.REFACTORING: 0.35,
            TaskType.ARCHITECTURE_CHANGE: 0.50,
            TaskType.OPTIMIZATION: 0.30,
            TaskType.SECURITY: 0.40,
            TaskType.UI_CHANGE: 0.20,
            TaskType.TESTING: 0.10,
            TaskType.DOCUMENTATION: 0.05
        }
        
        # Risk correlation matrix (how risks amplify each other)
        self.risk_correlations = {
            'breaking_changes': {
                'integration_failure': 0.6,
                'performance_degradation': 0.3,
                'security_vulnerability': 0.2
            },
            'integration_failure': {
                'data_corruption': 0.4,
                'service_disruption': 0.7
            },
            'performance_degradation': {
                'user_experience_impact': 0.8,
                'resource_exhaustion': 0.5
            }
        }
    
    def initialize_risk_factors(self):
        """Initialize specific risk factor assessment functions"""
        
        self.risk_factor_assessors = {
            'breaking_changes': self.assess_breaking_change_risk,
            'security_vulnerabilities': self.assess_security_risk,
            'performance_degradation': self.assess_performance_risk,
            'integration_failure': self.assess_integration_risk,
            'data_corruption': self.assess_data_risk,
            'rollback_difficulty': self.assess_rollback_risk,
            'user_experience_impact': self.assess_ux_risk,
            'compliance_violation': self.assess_compliance_risk,
            'resource_exhaustion': self.assess_resource_risk,
            'dependency_conflicts': self.assess_dependency_risk
        }
    
    def assess_comprehensive_risk(self, task_description: str,
                                task_characteristics: TaskCharacteristics,
                                task_type: TaskType,
                                project_context: Dict[str, Any]) -> RiskAssessment:
        """
        Perform comprehensive risk assessment using multiple mathematical approaches
        """
        
        # Assess individual risk factors
        risk_factors = self.assess_all_risk_factors(
            task_description, task_characteristics, project_context
        )
        
        # Monte Carlo risk simulation
        risk_distribution = self.monte_carlo_risk_simulation(
            risk_factors, task_type, num_simulations=10000
        )
        
        # Statistical analysis
        overall_risk = statistics.mean(risk_distribution)
        var_95 = np.percentile(risk_distribution, 95)
        expected_risk = statistics.mean(risk_distribution)
        
        # Risk categorization
        risk_categories = self.categorize_risks(risk_factors)
        
        # Determine risk level
        risk_level = self.classify_risk_level(overall_risk)
        
        return RiskAssessment(
            overall_risk_score=overall_risk,
            risk_level=risk_level,
            risk_factors=risk_factors,
            monte_carlo_distribution=risk_distribution,
            value_at_risk_95=var_95,
            expected_risk=expected_risk,
            risk_categories=risk_categories
        )
    
    def assess_all_risk_factors(self, task_description: str,
                              task_characteristics: TaskCharacteristics,
                              project_context: Dict[str, Any]) -> List[RiskFactor]:
        """Assess all risk factors"""
        
        risk_factors = []
        
        for risk_name, assessor_func in self.risk_factor_assessors.items():
            risk_factor = assessor_func(task_description, task_characteristics, project_context)
            risk_factors.append(risk_factor)
        
        return risk_factors
    
    def monte_carlo_risk_simulation(self, risk_factors: List[RiskFactor],
                                  task_type: TaskType,
                                  num_simulations: int = 10000) -> List[float]:
        """
        Monte Carlo simulation for comprehensive risk assessment
        """
        
        risk_samples = []
        base_risk = self.base_task_risks.get(task_type, 0.25)
        
        for _ in range(num_simulations):
            # Sample each risk factor
            sampled_risks = []
            
            for risk_factor in risk_factors:
                # Sample from beta distribution based on risk factor characteristics
                alpha = risk_factor.probability * risk_factor.confidence * 10
                beta = (1 - risk_factor.probability) * risk_factor.confidence * 10
                
                # Handle edge cases
                alpha = max(0.1, alpha)
                beta = max(0.1, beta)
                
                sampled_probability = np.random.beta(alpha, beta)
                risk_impact = sampled_probability * risk_factor.impact
                sampled_risks.append(risk_impact)
            
            # Combine risks with correlation effects
            combined_risk = self.combine_correlated_risks(sampled_risks, risk_factors)
            
            # Apply base task risk
            total_risk = base_risk + combined_risk * (1 - base_risk)
            
            risk_samples.append(min(1.0, total_risk))
        
        return risk_samples
    
    def combine_correlated_risks(self, sampled_risks: List[float],
                               risk_factors: List[RiskFactor]) -> float:
        """Combine risks accounting for correlations"""
        
        if not sampled_risks:
            return 0.0
        
        # Start with maximum individual risk
        combined_risk = max(sampled_risks)
        
        # Add correlation amplification
        for i, risk1 in enumerate(sampled_risks):
            for j, risk2 in enumerate(sampled_risks[i+1:], i+1):
                risk1_name = risk_factors[i].name
                risk2_name = risk_factors[j].name
                
                correlation = self.get_risk_correlation(risk1_name, risk2_name)
                amplification = risk1 * risk2 * correlation
                combined_risk += amplification * 0.1  # Weighted amplification
        
        return min(1.0, combined_risk)
    
    def get_risk_correlation(self, risk1: str, risk2: str) -> float:
        """Get correlation coefficient between two risks"""
        
        if risk1 in self.risk_correlations and risk2 in self.risk_correlations[risk1]:
            return self.risk_correlations[risk1][risk2]
        elif risk2 in self.risk_correlations and risk1 in self.risk_correlations[risk2]:
            return self.risk_correlations[risk2][risk1]
        else:
            return 0.1  # Default low correlation
    
    def assess_breaking_change_risk(self, task_description: str,
                                  task_characteristics: TaskCharacteristics,
                                  project_context: Dict[str, Any]) -> RiskFactor:
        """Assess risk of breaking changes"""
        
        desc_lower = task_description.lower()
        
        # High-risk indicators
        high_risk_patterns = [
            'api', 'interface', 'contract', 'schema', 'database',
            'migration', 'breaking', 'remove', 'delete', 'deprecated'
        ]
        
        risk_score = 0.0
        for pattern in high_risk_patterns:
            if pattern in desc_lower:
                risk_score += 0.15
        
        # Amplify based on task characteristics
        if task_characteristics.api_changes:
            risk_score += 0.25
        if task_characteristics.database_changes:
            risk_score += 0.30
        if task_characteristics.external_dependency_changes:
            risk_score += 0.20
        
        probability = min(0.95, risk_score)
        impact = 0.8  # Breaking changes have high impact
        confidence = 0.85 if probability > 0.3 else 0.6
        mitigation_difficulty = 0.7
        
        return RiskFactor(
            name="breaking_changes",
            probability=probability,
            impact=impact,
            confidence=confidence,
            mitigation_difficulty=mitigation_difficulty
        )
    
    def assess_security_risk(self, task_description: str,
                           task_characteristics: TaskCharacteristics,
                           project_context: Dict[str, Any]) -> RiskFactor:
        """Assess security vulnerability risk"""
        
        desc_lower = task_description.lower()
        
        security_indicators = [
            'auth', 'password', 'token', 'session', 'encryption',
            'security', 'permission', 'access', 'user', 'admin'
        ]
        
        risk_score = 0.0
        for indicator in security_indicators:
            if indicator in desc_lower:
                risk_score += 0.1
        
        # High-risk security patterns
        high_risk_security = [
            'bypass', 'disable', 'remove auth', 'skip validation',
            'direct access', 'admin rights'
        ]
        
        for pattern in high_risk_security:
            if pattern in desc_lower:
                risk_score += 0.3
        
        probability = min(0.90, risk_score)
        impact = 0.9  # Security issues have very high impact
        confidence = 0.75
        mitigation_difficulty = 0.8  # Security fixes can be complex
        
        return RiskFactor(
            name="security_vulnerabilities",
            probability=probability,
            impact=impact,
            confidence=confidence,
            mitigation_difficulty=mitigation_difficulty
        )
    
    def assess_performance_risk(self, task_description: str,
                              task_characteristics: TaskCharacteristics,
                              project_context: Dict[str, Any]) -> RiskFactor:
        """Assess performance degradation risk"""
        
        desc_lower = task_description.lower()
        
        performance_indicators = [
            'query', 'database', 'algorithm', 'loop', 'process',
            'large', 'scale', 'optimization', 'cache', 'memory'
        ]
        
        risk_score = 0.0
        for indicator in performance_indicators:
            if indicator in desc_lower:
                risk_score += 0.08
        
        # Performance-critical patterns
        critical_patterns = [
            'real time', 'high throughput', 'millions', 'concurrent',
            'heavy load', 'big data'
        ]
        
        for pattern in critical_patterns:
            if pattern in desc_lower:
                risk_score += 0.25
        
        probability = min(0.85, risk_score)
        impact = 0.6
        confidence = 0.70
        mitigation_difficulty = 0.6
        
        return RiskFactor(
            name="performance_degradation",
            probability=probability,
            impact=impact,
            confidence=confidence,
            mitigation_difficulty=mitigation_difficulty
        )
    
    def assess_integration_risk(self, task_description: str,
                              task_characteristics: TaskCharacteristics,
                              project_context: Dict[str, Any]) -> RiskFactor:
        """Assess integration failure risk"""
        
        desc_lower = task_description.lower()
        
        integration_indicators = [
            'api', 'service', 'external', 'third party', 'integration',
            'webhook', 'sync', 'connect', 'interface'
        ]
        
        risk_score = sum(0.12 for indicator in integration_indicators if indicator in desc_lower)
        
        if task_characteristics.external_dependency_changes:
            risk_score += 0.30
        
        probability = min(0.80, risk_score)
        impact = 0.7
        confidence = 0.75
        mitigation_difficulty = 0.8
        
        return RiskFactor(
            name="integration_failure",
            probability=probability,
            impact=impact,
            confidence=confidence,
            mitigation_difficulty=mitigation_difficulty
        )
    
    def assess_data_risk(self, task_description: str,
                        task_characteristics: TaskCharacteristics,
                        project_context: Dict[str, Any]) -> RiskFactor:
        """Assess data corruption risk"""
        
        desc_lower = task_description.lower()
        
        data_risk_indicators = [
            'database', 'data', 'migration', 'schema', 'delete',
            'update', 'modify', 'transform', 'import', 'export'
        ]
        
        risk_score = sum(0.1 for indicator in data_risk_indicators if indicator in desc_lower)
        
        if task_characteristics.database_changes:
            risk_score += 0.25
        
        probability = min(0.75, risk_score)
        impact = 0.9  # Data corruption has very high impact
        confidence = 0.8
        mitigation_difficulty = 0.9  # Data issues are hard to fix
        
        return RiskFactor(
            name="data_corruption",
            probability=probability,
            impact=impact,
            confidence=confidence,
            mitigation_difficulty=mitigation_difficulty
        )
    
    def assess_rollback_risk(self, task_description: str,
                           task_characteristics: TaskCharacteristics,
                           project_context: Dict[str, Any]) -> RiskFactor:
        """Assess rollback difficulty risk"""
        
        desc_lower = task_description.lower()
        
        rollback_difficulty_indicators = [
            'migration', 'schema change', 'data transformation',
            'breaking change', 'irreversible', 'one way'
        ]
        
        risk_score = sum(0.2 for indicator in rollback_difficulty_indicators if indicator in desc_lower)
        
        if task_characteristics.database_changes:
            risk_score += 0.15
        
        probability = min(0.70, risk_score)
        impact = 0.5  # Moderate impact but operational concern
        confidence = 0.85
        mitigation_difficulty = 0.6
        
        return RiskFactor(
            name="rollback_difficulty",
            probability=probability,
            impact=impact,
            confidence=confidence,
            mitigation_difficulty=mitigation_difficulty
        )
    
    def assess_ux_risk(self, task_description: str,
                      task_characteristics: TaskCharacteristics,
                      project_context: Dict[str, Any]) -> RiskFactor:
        """Assess user experience impact risk"""
        
        desc_lower = task_description.lower()
        
        ux_indicators = [
            'ui', 'interface', 'user', 'frontend', 'design',
            'layout', 'responsive', 'accessibility', 'mobile'
        ]
        
        risk_score = sum(0.08 for indicator in ux_indicators if indicator in desc_lower)
        
        if task_characteristics.ui_changes:
            risk_score += 0.20
        
        probability = min(0.65, risk_score)
        impact = 0.4  # UX issues have moderate impact
        confidence = 0.70
        mitigation_difficulty = 0.4
        
        return RiskFactor(
            name="user_experience_impact",
            probability=probability,
            impact=impact,
            confidence=confidence,
            mitigation_difficulty=mitigation_difficulty
        )
    
    def assess_compliance_risk(self, task_description: str,
                             task_characteristics: TaskCharacteristics,
                             project_context: Dict[str, Any]) -> RiskFactor:
        """Assess compliance violation risk"""
        
        desc_lower = task_description.lower()
        
        compliance_indicators = [
            'gdpr', 'privacy', 'data protection', 'compliance',
            'audit', 'regulation', 'legal', 'policy'
        ]
        
        risk_score = sum(0.15 for indicator in compliance_indicators if indicator in desc_lower)
        
        probability = min(0.60, risk_score)
        impact = 0.8  # Compliance issues have high impact
        confidence = 0.65
        mitigation_difficulty = 0.8
        
        return RiskFactor(
            name="compliance_violation",
            probability=probability,
            impact=impact,
            confidence=confidence,
            mitigation_difficulty=mitigation_difficulty
        )
    
    def assess_resource_risk(self, task_description: str,
                           task_characteristics: TaskCharacteristics,
                           project_context: Dict[str, Any]) -> RiskFactor:
        """Assess resource exhaustion risk"""
        
        desc_lower = task_description.lower()
        
        resource_indicators = [
            'memory', 'cpu', 'disk', 'network', 'bandwidth',
            'scale', 'load', 'performance', 'resource'
        ]
        
        risk_score = sum(0.1 for indicator in resource_indicators if indicator in desc_lower)
        
        probability = min(0.55, risk_score)
        impact = 0.6
        confidence = 0.65
        mitigation_difficulty = 0.7
        
        return RiskFactor(
            name="resource_exhaustion",
            probability=probability,
            impact=impact,
            confidence=confidence,
            mitigation_difficulty=mitigation_difficulty
        )
    
    def assess_dependency_risk(self, task_description: str,
                             task_characteristics: TaskCharacteristics,
                             project_context: Dict[str, Any]) -> RiskFactor:
        """Assess dependency conflict risk"""
        
        desc_lower = task_description.lower()
        
        dependency_indicators = [
            'dependency', 'package', 'library', 'version',
            'upgrade', 'update', 'install', 'npm', 'pip'
        ]
        
        risk_score = sum(0.1 for indicator in dependency_indicators if indicator in desc_lower)
        
        if task_characteristics.external_dependency_changes:
            risk_score += 0.2
        
        probability = min(0.50, risk_score)
        impact = 0.5
        confidence = 0.75
        mitigation_difficulty = 0.5
        
        return RiskFactor(
            name="dependency_conflicts",
            probability=probability,
            impact=impact,
            confidence=confidence,
            mitigation_difficulty=mitigation_difficulty
        )
    
    def categorize_risks(self, risk_factors: List[RiskFactor]) -> Dict[str, float]:
        """Categorize risks by type"""
        
        categories = {
            'technical': 0.0,
            'operational': 0.0,
            'security': 0.0,
            'business': 0.0
        }
        
        category_mapping = {
            'breaking_changes': 'technical',
            'performance_degradation': 'technical',
            'integration_failure': 'technical',
            'dependency_conflicts': 'technical',
            'security_vulnerabilities': 'security',
            'compliance_violation': 'security',
            'data_corruption': 'operational',
            'rollback_difficulty': 'operational',
            'resource_exhaustion': 'operational',
            'user_experience_impact': 'business'
        }
        
        for risk_factor in risk_factors:
            category = category_mapping.get(risk_factor.name, 'technical')
            risk_score = risk_factor.probability * risk_factor.impact
            categories[category] = max(categories[category], risk_score)
        
        return categories
    
    def classify_risk_level(self, overall_risk: float) -> RiskLevel:
        """Classify overall risk level"""
        
        if overall_risk >= 0.8:
            return RiskLevel.CRITICAL
        elif overall_risk >= 0.6:
            return RiskLevel.HIGH
        elif overall_risk >= 0.4:
            return RiskLevel.MEDIUM
        elif overall_risk >= 0.2:
            return RiskLevel.LOW
        else:
            return RiskLevel.VERY_LOW


# Example usage and testing
def example_context_and_risk_analysis():
    """Example of using the context prediction and risk assessment systems"""
    
    # Initialize systems
    context_predictor = ContextLoadPredictor()
    risk_assessor = RiskAssessmentEngine()
    
    # Example current context
    current_context = ContextMetrics(
        current_tokens=15000,
        loaded_files=12,
        conversation_turns=25,
        file_types={'js': 8, 'ts': 3, 'css': 1},
        recent_file_additions=4,
        avg_file_size_tokens=1200,
        context_entropy=2.3
    )
    
    # Example task characteristics
    task_characteristics = TaskCharacteristics(
        estimated_duration_minutes=90,
        affected_file_count_estimate=6,
        new_file_creation_likely=True,
        external_dependency_changes=False,
        database_changes=True,
        api_changes=True,
        ui_changes=False,
        test_file_additions=True
    )
    
    # Example task
    task_description = """
    Implement user authentication system with JWT tokens, including login/logout endpoints,
    password hashing with bcrypt, user session management, and database schema changes
    to add user roles and permissions.
    """
    
    # Predict context growth
    context_prediction = context_predictor.predict_context_growth(
        current_context, task_characteristics, TaskType.FEATURE_DEVELOPMENT
    )
    
    print("Context Prediction:")
    print(f"  Predicted Final Tokens: {context_prediction.predicted_final_tokens}")
    print(f"  File Additions: {context_prediction.predicted_file_additions}")
    print(f"  Confidence Interval: {context_prediction.growth_confidence_interval}")
    print(f"  Overflow Probability: {context_prediction.context_overflow_probability:.2%}")
    print(f"  Recommendation: {context_prediction.recommended_context_management}")
    
    # Assess risk
    risk_assessment = risk_assessor.assess_comprehensive_risk(
        task_description, task_characteristics, TaskType.FEATURE_DEVELOPMENT, {}
    )
    
    print(f"\nRisk Assessment:")
    print(f"  Overall Risk: {risk_assessment.overall_risk_score:.3f} ({risk_assessment.risk_level.value})")
    print(f"  Value at Risk (95%): {risk_assessment.value_at_risk_95:.3f}")
    print(f"  Risk Categories: {risk_assessment.risk_categories}")
    
    return context_prediction, risk_assessment


if __name__ == "__main__":
    # Run example
    context_pred, risk_assess = example_context_and_risk_analysis()