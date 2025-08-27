"""
Enhanced Complexity Calculation Algorithms for Claude Agent System

Advanced mathematical algorithms for calculating task complexity across multiple dimensions.
Uses sophisticated mathematical models without machine learning complexity.
"""

import math
import re
import statistics
from typing import Dict, List, Tuple, Any, Optional
from dataclasses import dataclass
from enum import Enum
import hashlib


class TaskType(Enum):
    """Task classification types"""
    BUG_FIX = "bug_fix"
    FEATURE_DEVELOPMENT = "feature_development"
    REFACTORING = "refactoring"
    ARCHITECTURE_CHANGE = "architecture_change"
    PERFORMANCE_OPTIMIZATION = "performance_optimization"
    SECURITY_IMPLEMENTATION = "security_implementation"
    UI_UX_CHANGE = "ui_ux_change"
    TESTING = "testing"
    DOCUMENTATION = "documentation"
    CONFIGURATION = "configuration"


@dataclass
class ComplexityFactors:
    """Structured representation of complexity analysis factors"""
    technical_depth: float
    integration_complexity: float
    data_complexity: float
    ui_complexity: float
    testing_requirements: float
    architectural_impact: float
    cognitive_load: float


@dataclass
class ProjectMetrics:
    """Project-specific metrics for complexity calculation"""
    total_files: int
    avg_files_per_feature: float
    codebase_size_mb: float
    dependency_count: int
    tech_stack_diversity: int
    team_size: int
    project_maturity_months: int


@dataclass
class ContextInformation:
    """Current context information for complexity assessment"""
    current_tokens: int
    loaded_files: int
    conversation_depth: int
    file_types: Dict[str, int]
    recent_changes: int


class TechnicalComplexityCalculator:
    """
    Advanced calculator for technical complexity using multiple mathematical approaches
    """
    
    def __init__(self):
        self.initialize_complexity_models()
        self.initialize_pattern_databases()
    
    def initialize_complexity_models(self):
        """Initialize mathematical models for complexity calculation"""
        
        # Cyclomatic complexity estimation weights
        self.cyclomatic_weights = {
            'conditional_keywords': ['if', 'elif', 'else', 'switch', 'case', 'when'],
            'loop_keywords': ['for', 'while', 'do', 'foreach', 'map', 'filter'],
            'exception_keywords': ['try', 'catch', 'except', 'finally', 'throw'],
            'function_keywords': ['function', 'def', 'method', 'lambda', 'arrow'],
        }
        
        # Halstead complexity factors
        self.halstead_operators = {
            'arithmetic': ['+', '-', '*', '/', '%', '**', '//'],
            'comparison': ['==', '!=', '<', '>', '<=', '>=', '===', '!=='],
            'logical': ['&&', '||', '!', 'and', 'or', 'not'],
            'assignment': ['=', '+=', '-=', '*=', '/=', '%='],
            'bitwise': ['&', '|', '^', '~', '<<', '>>', '>>>']
        }
        
        # Technology complexity multipliers based on empirical data
        self.tech_complexity_multipliers = {
            'javascript': 1.0,
            'typescript': 1.2,
            'python': 0.9,
            'java': 1.3,
            'c++': 1.8,
            'rust': 1.6,
            'go': 1.1,
            'kotlin': 1.2,
            'swift': 1.3,
            'assembly': 2.5
        }
    
    def initialize_pattern_databases(self):
        """Initialize pattern databases for complexity recognition"""
        
        # Architecture pattern complexity scores
        self.architecture_patterns = {
            'microservices': 2.5,
            'monolith': 1.2,
            'serverless': 1.8,
            'event_driven': 2.0,
            'layered': 1.4,
            'hexagonal': 1.7,
            'cqrs': 2.2,
            'event_sourcing': 2.4
        }
        
        # Integration pattern complexity
        self.integration_patterns = {
            'rest_api': 1.0,
            'graphql': 1.4,
            'soap': 1.6,
            'grpc': 1.5,
            'websockets': 1.3,
            'message_queue': 1.7,
            'pub_sub': 1.8,
            'webhooks': 1.2
        }
        
        # Data operation complexity
        self.data_operations = {
            'crud': 1.0,
            'complex_queries': 1.5,
            'data_migration': 2.0,
            'real_time_processing': 2.2,
            'batch_processing': 1.8,
            'stream_processing': 2.4,
            'data_transformation': 1.6,
            'analytics': 1.9
        }
    
    def calculate_technical_complexity(self, task_description: str, 
                                     project_metrics: ProjectMetrics,
                                     context_info: ContextInformation) -> float:
        """
        Calculate technical complexity using multiple mathematical approaches
        
        Combines:
        1. Linguistic complexity analysis
        2. Estimated cyclomatic complexity
        3. Halstead complexity metrics
        4. Architecture pattern recognition
        5. Technology stack complexity
        6. Project-specific adjustments
        """
        
        # Extract complexity factors
        complexity_factors = self.extract_complexity_factors(task_description)
        
        # Calculate base complexity using multiple methods
        linguistic_complexity = self.calculate_linguistic_complexity(task_description)
        cyclomatic_estimate = self.estimate_cyclomatic_complexity(task_description)
        halstead_estimate = self.estimate_halstead_complexity(task_description)
        architecture_complexity = self.assess_architectural_complexity(task_description)
        integration_complexity = self.assess_integration_complexity(task_description)
        
        # Combine using weighted geometric mean for balanced assessment
        complexity_components = [
            linguistic_complexity * 0.2,
            cyclomatic_estimate * 0.25,
            halstead_estimate * 0.15,
            architecture_complexity * 0.2,
            integration_complexity * 0.2
        ]
        
        base_complexity = self.geometric_mean(complexity_components)
        
        # Apply project-specific adjustments
        project_adjusted = self.apply_project_adjustments(base_complexity, project_metrics)
        
        # Apply context adjustments
        context_adjusted = self.apply_context_adjustments(project_adjusted, context_info)
        
        # Ensure output is in [0, 1] range
        return min(1.0, max(0.0, context_adjusted))
    
    def extract_complexity_factors(self, task_description: str) -> ComplexityFactors:
        """Extract detailed complexity factors from task description"""
        
        desc_lower = task_description.lower()
        
        # Technical depth assessment
        technical_depth = self.assess_technical_depth(desc_lower)
        
        # Integration complexity
        integration_complexity = self.assess_integration_complexity(desc_lower)
        
        # Data complexity
        data_complexity = self.assess_data_complexity(desc_lower)
        
        # UI complexity
        ui_complexity = self.assess_ui_complexity(desc_lower)
        
        # Testing requirements
        testing_requirements = self.assess_testing_requirements(desc_lower)
        
        # Architectural impact
        architectural_impact = self.assess_architectural_impact(desc_lower)
        
        # Cognitive load
        cognitive_load = self.assess_cognitive_load(desc_lower)
        
        return ComplexityFactors(
            technical_depth=technical_depth,
            integration_complexity=integration_complexity,
            data_complexity=data_complexity,
            ui_complexity=ui_complexity,
            testing_requirements=testing_requirements,
            architectural_impact=architectural_impact,
            cognitive_load=cognitive_load
        )
    
    def calculate_linguistic_complexity(self, task_description: str) -> float:
        """
        Calculate complexity based on linguistic analysis of the task description
        
        Uses natural language processing techniques to assess:
        1. Sentence complexity
        2. Technical vocabulary density
        3. Ambiguity indicators
        4. Scope indicators
        """
        
        # Tokenize and analyze
        words = re.findall(r'\b\w+\b', task_description.lower())
        sentences = re.split(r'[.!?]+', task_description)
        
        if not words:
            return 0.0
        
        # Sentence complexity (average words per sentence)
        avg_sentence_length = len(words) / max(len([s for s in sentences if s.strip()]), 1)
        sentence_complexity = min(1.0, avg_sentence_length / 15.0)  # Normalize to typical sentence length
        
        # Technical vocabulary density
        technical_words = self.count_technical_vocabulary(words)
        vocab_density = technical_words / len(words)
        
        # Ambiguity indicators
        ambiguity_score = self.assess_linguistic_ambiguity(task_description.lower())
        
        # Scope indicators
        scope_score = self.assess_linguistic_scope(words)
        
        # Combine using weighted average
        linguistic_complexity = (
            sentence_complexity * 0.2 +
            vocab_density * 0.3 +
            ambiguity_score * 0.25 +
            scope_score * 0.25
        )
        
        return min(1.0, linguistic_complexity)
    
    def count_technical_vocabulary(self, words: List[str]) -> int:
        """Count technical vocabulary in word list"""
        
        technical_vocabulary = {
            # Programming concepts
            'algorithm', 'function', 'method', 'class', 'object', 'inheritance',
            'polymorphism', 'encapsulation', 'abstraction', 'interface',
            'framework', 'library', 'dependency', 'module', 'package',
            
            # Architecture terms
            'microservice', 'monolith', 'serverless', 'container', 'docker',
            'kubernetes', 'cloud', 'distributed', 'scalable', 'resilient',
            
            # Data terms
            'database', 'query', 'transaction', 'schema', 'migration',
            'replication', 'sharding', 'indexing', 'normalization',
            
            # Security terms
            'authentication', 'authorization', 'encryption', 'hashing',
            'ssl', 'tls', 'oauth', 'jwt', 'csrf', 'xss',
            
            # Performance terms
            'optimization', 'caching', 'profiling', 'benchmark', 'throughput',
            'latency', 'concurrent', 'parallel', 'asynchronous',
            
            # Testing terms
            'unittest', 'integration', 'e2e', 'mocking', 'stubbing',
            'coverage', 'regression', 'acceptance'
        }
        
        return sum(1 for word in words if word in technical_vocabulary)
    
    def assess_linguistic_ambiguity(self, task_description: str) -> float:
        """Assess ambiguity in task description"""
        
        ambiguity_indicators = {
            'vague_terms': ['somehow', 'maybe', 'probably', 'might', 'could', 
                           'should', 'would', 'possibly', 'perhaps'],
            'uncertain_quantifiers': ['some', 'several', 'many', 'few', 'most',
                                    'various', 'different', 'multiple'],
            'conditional_language': ['if possible', 'when needed', 'as required',
                                   'depending on', 'subject to']
        }
        
        ambiguity_score = 0.0
        word_count = len(task_description.split())
        
        for category, indicators in ambiguity_indicators.items():
            matches = sum(1 for indicator in indicators if indicator in task_description)
            category_score = min(1.0, matches / max(word_count * 0.1, 1))  # Normalize by text length
            ambiguity_score += category_score
        
        return min(1.0, ambiguity_score / len(ambiguity_indicators))
    
    def assess_linguistic_scope(self, words: List[str]) -> float:
        """Assess scope indicators in word list"""
        
        scope_indicators = {
            'global_scope': ['all', 'entire', 'every', 'complete', 'total', 
                           'whole', 'global', 'system-wide', 'across'],
            'multi_scope': ['multiple', 'several', 'various', 'different',
                          'many', 'numerous'],
            'focused_scope': ['specific', 'particular', 'single', 'individual',
                            'one', 'this', 'that']
        }
        
        scope_scores = {}
        for scope_type, indicators in scope_indicators.items():
            matches = sum(1 for word in words if word in indicators)
            scope_scores[scope_type] = matches
        
        # Calculate weighted scope score
        total_indicators = sum(scope_scores.values())
        if total_indicators == 0:
            return 0.5  # Medium scope by default
        
        # Global scope = high complexity, focused scope = low complexity
        weighted_score = (
            scope_scores['global_scope'] * 1.0 +
            scope_scores['multi_scope'] * 0.6 +
            scope_scores['focused_scope'] * 0.2
        ) / total_indicators
        
        return min(1.0, weighted_score)
    
    def estimate_cyclomatic_complexity(self, task_description: str) -> float:
        """
        Estimate cyclomatic complexity based on task description analysis
        
        Looks for indicators of control flow complexity:
        - Conditional logic requirements
        - Loop requirements  
        - Exception handling needs
        - Function/method decomposition
        """
        
        desc_lower = task_description.lower()
        complexity_score = 1.0  # Base complexity
        
        # Count conditional indicators
        conditional_indicators = [
            'if', 'when', 'condition', 'check', 'validate', 'verify',
            'case', 'switch', 'branch', 'different', 'depending'
        ]
        conditional_count = sum(1 for indicator in conditional_indicators 
                              if indicator in desc_lower)
        complexity_score += conditional_count * 0.5
        
        # Count loop indicators
        loop_indicators = [
            'for each', 'all', 'every', 'iterate', 'loop', 'repeat',
            'multiple', 'batch', 'process all', 'go through'
        ]
        loop_count = sum(1 for indicator in loop_indicators 
                        if indicator in desc_lower)
        complexity_score += loop_count * 0.7
        
        # Count exception handling indicators
        exception_indicators = [
            'error', 'exception', 'handle', 'catch', 'fail', 'fallback',
            'retry', 'recovery', 'robust', 'resilient'
        ]
        exception_count = sum(1 for indicator in exception_indicators 
                             if indicator in desc_lower)
        complexity_score += exception_count * 0.6
        
        # Normalize to [0, 1] range using sigmoid function
        normalized_complexity = 1 / (1 + math.exp(-(complexity_score - 3) / 2))
        
        return normalized_complexity
    
    def estimate_halstead_complexity(self, task_description: str) -> float:
        """
        Estimate Halstead complexity metrics based on task description
        
        Approximates:
        - Vocabulary size (unique operators and operands)
        - Program length
        - Difficulty
        - Effort
        """
        
        desc_lower = task_description.lower()
        
        # Estimate unique operators (actions/verbs)
        operator_indicators = [
            'create', 'add', 'update', 'delete', 'modify', 'change',
            'implement', 'build', 'design', 'refactor', 'optimize',
            'connect', 'integrate', 'configure', 'setup', 'install',
            'test', 'validate', 'verify', 'check', 'ensure'
        ]
        unique_operators = sum(1 for op in operator_indicators if op in desc_lower)
        
        # Estimate unique operands (nouns/objects)
        operand_indicators = [
            'user', 'system', 'database', 'api', 'service', 'component',
            'interface', 'module', 'function', 'class', 'method',
            'file', 'configuration', 'data', 'request', 'response'
        ]
        unique_operands = sum(1 for operand in operand_indicators if operand in desc_lower)
        
        # Halstead metrics
        vocabulary = unique_operators + unique_operands
        if vocabulary == 0:
            return 0.0
        
        # Estimate program length
        estimated_length = vocabulary * 2.5  # Empirical multiplier
        
        # Calculate difficulty (ratio of operators to operands)
        difficulty = (unique_operators / max(unique_operands, 1)) * 0.5
        
        # Calculate effort approximation
        effort = difficulty * estimated_length
        
        # Normalize using logarithmic scaling
        normalized_effort = math.log(max(effort, 1)) / math.log(100)  # Normalize to typical range
        
        return min(1.0, normalized_effort)
    
    def assess_architectural_complexity(self, task_description: str) -> float:
        """Assess architectural complexity based on pattern recognition"""
        
        desc_lower = task_description.lower()
        complexity_score = 0.0
        
        # Check for architecture patterns
        for pattern, score in self.architecture_patterns.items():
            if pattern.replace('_', ' ') in desc_lower:
                complexity_score = max(complexity_score, score)
        
        # Check for system design indicators
        system_indicators = {
            'scalable': 1.5,
            'distributed': 2.0,
            'high availability': 2.2,
            'fault tolerant': 1.8,
            'load balancing': 1.6,
            'caching': 1.3,
            'clustering': 1.9
        }
        
        for indicator, score in system_indicators.items():
            if indicator in desc_lower:
                complexity_score = max(complexity_score, score)
        
        # Normalize to [0, 1] range
        return min(1.0, complexity_score / 3.0)  # Assuming max complexity of 3.0
    
    def assess_integration_complexity(self, task_description: str) -> float:
        """Assess integration complexity"""
        
        desc_lower = task_description.lower()
        integration_score = 0.0
        
        # Check for integration patterns
        for pattern, score in self.integration_patterns.items():
            if pattern.replace('_', ' ') in desc_lower:
                integration_score = max(integration_score, score)
        
        # Count integration points
        integration_indicators = [
            'api', 'service', 'external', 'third party', 'webhook',
            'integration', 'connect', 'sync', 'interface'
        ]
        
        integration_count = sum(1 for indicator in integration_indicators 
                              if indicator in desc_lower)
        
        # Combine pattern score with count
        count_contribution = min(1.0, integration_count * 0.3)
        pattern_contribution = min(1.0, integration_score / 2.0)
        
        return max(count_contribution, pattern_contribution)
    
    def assess_data_complexity(self, task_description: str) -> float:
        """Assess data operation complexity"""
        
        desc_lower = task_description.lower()
        data_score = 0.0
        
        # Check for data operation patterns
        for operation, score in self.data_operations.items():
            if operation.replace('_', ' ') in desc_lower:
                data_score = max(data_score, score)
        
        # Check for data volume indicators
        volume_indicators = {
            'big data': 2.5,
            'large dataset': 2.0,
            'millions': 2.2,
            'thousands': 1.5,
            'batch': 1.8,
            'stream': 2.0,
            'real time': 2.3
        }
        
        for indicator, score in volume_indicators.items():
            if indicator in desc_lower:
                data_score = max(data_score, score)
        
        return min(1.0, data_score / 3.0)
    
    def assess_ui_complexity(self, task_description: str) -> float:
        """Assess user interface complexity"""
        
        desc_lower = task_description.lower()
        ui_indicators = {
            'responsive': 1.5,
            'interactive': 1.3,
            'animation': 1.7,
            'drag and drop': 1.8,
            'real time': 2.0,
            'chart': 1.4,
            'visualization': 1.6,
            'dashboard': 1.5,
            'mobile': 1.4,
            'accessibility': 1.6
        }
        
        ui_score = 0.0
        for indicator, score in ui_indicators.items():
            if indicator in desc_lower:
                ui_score = max(ui_score, score)
        
        return min(1.0, ui_score / 2.5)
    
    def assess_testing_requirements(self, task_description: str) -> float:
        """Assess testing complexity requirements"""
        
        desc_lower = task_description.lower()
        testing_indicators = {
            'unit test': 1.0,
            'integration test': 1.5,
            'e2e test': 2.0,
            'performance test': 1.8,
            'security test': 1.7,
            'load test': 1.9,
            'automated test': 1.6,
            'test coverage': 1.4
        }
        
        testing_score = 0.0
        for indicator, score in testing_indicators.items():
            if indicator in desc_lower:
                testing_score += score * 0.3  # Additive for testing requirements
        
        return min(1.0, testing_score)
    
    def assess_architectural_impact(self, task_description: str) -> float:
        """Assess impact on system architecture"""
        
        desc_lower = task_description.lower()
        
        high_impact_indicators = [
            'architecture', 'refactor', 'restructure', 'redesign',
            'breaking change', 'major change', 'system wide'
        ]
        
        medium_impact_indicators = [
            'modify', 'extend', 'enhance', 'improve', 'upgrade'
        ]
        
        low_impact_indicators = [
            'fix', 'tweak', 'adjust', 'update', 'patch'
        ]
        
        high_count = sum(1 for indicator in high_impact_indicators if indicator in desc_lower)
        medium_count = sum(1 for indicator in medium_impact_indicators if indicator in desc_lower)
        low_count = sum(1 for indicator in low_impact_indicators if indicator in desc_lower)
        
        # Weighted scoring
        impact_score = (high_count * 1.0 + medium_count * 0.6 + low_count * 0.2) / max(high_count + medium_count + low_count, 1)
        
        return min(1.0, impact_score)
    
    def assess_cognitive_load(self, task_description: str) -> float:
        """Assess cognitive load based on task description"""
        
        # Factors contributing to cognitive load
        word_count = len(task_description.split())
        sentence_count = len(re.split(r'[.!?]+', task_description))
        
        # Complexity of vocabulary
        complex_words = len([word for word in task_description.split() 
                           if len(word) > 8])
        
        # Cognitive load calculation
        length_factor = min(1.0, word_count / 100.0)  # Normalize by typical task length
        complexity_factor = complex_words / max(word_count, 1)
        structure_factor = min(1.0, sentence_count / 10.0)
        
        cognitive_load = (length_factor * 0.4 + complexity_factor * 0.4 + structure_factor * 0.2)
        
        return min(1.0, cognitive_load)
    
    def apply_project_adjustments(self, base_complexity: float, 
                                project_metrics: ProjectMetrics) -> float:
        """Apply project-specific adjustments to complexity score"""
        
        # Codebase size adjustment
        size_factor = min(2.0, math.log(project_metrics.total_files + 1) / math.log(1000))
        
        # Team size adjustment (larger teams can handle more complexity)
        team_factor = max(0.5, 1.0 - (project_metrics.team_size - 1) * 0.1)
        
        # Project maturity adjustment (mature projects are more complex to change)
        maturity_factor = min(1.5, 1.0 + project_metrics.project_maturity_months / 120.0)
        
        # Technology diversity adjustment
        tech_diversity_factor = min(1.8, 1.0 + project_metrics.tech_stack_diversity * 0.2)
        
        # Combine adjustments
        adjusted_complexity = base_complexity * size_factor * team_factor * maturity_factor * tech_diversity_factor
        
        return min(1.0, adjusted_complexity)
    
    def apply_context_adjustments(self, complexity: float, 
                                context_info: ContextInformation) -> float:
        """Apply context-specific adjustments"""
        
        # Context load adjustment
        token_factor = min(1.5, 1.0 + context_info.current_tokens / 30000.0)
        
        # File load adjustment  
        file_factor = min(1.3, 1.0 + context_info.loaded_files / 20.0)
        
        # Conversation depth adjustment
        conversation_factor = min(1.2, 1.0 + context_info.conversation_depth / 50.0)
        
        adjusted_complexity = complexity * token_factor * file_factor * conversation_factor
        
        return min(1.0, adjusted_complexity)
    
    def geometric_mean(self, values: List[float]) -> float:
        """Calculate geometric mean of values"""
        if not values or any(v <= 0 for v in values):
            return 0.0
        
        product = 1.0
        for value in values:
            product *= max(value, 1e-10)  # Avoid log(0)
        
        return product ** (1.0 / len(values))


# Example usage and testing
def example_complexity_calculation():
    """Example of using the complexity calculator"""
    
    # Initialize calculator
    calculator = TechnicalComplexityCalculator()
    
    # Example project metrics
    project_metrics = ProjectMetrics(
        total_files=250,
        avg_files_per_feature=4.5,
        codebase_size_mb=15.2,
        dependency_count=45,
        tech_stack_diversity=6,
        team_size=4,
        project_maturity_months=18
    )
    
    # Example context information
    context_info = ContextInformation(
        current_tokens=12000,
        loaded_files=8,
        conversation_depth=15,
        file_types={'js': 5, 'ts': 2, 'css': 1},
        recent_changes=3
    )
    
    # Example task description
    task_description = """
    Implement a real-time chat system with WebSocket support, including message persistence,
    user authentication, typing indicators, and scalable message routing across multiple 
    server instances. The system should handle thousands of concurrent users and integrate
    with existing user management API.
    """
    
    # Calculate complexity
    complexity_score = calculator.calculate_technical_complexity(
        task_description, project_metrics, context_info
    )
    
    print(f"Technical Complexity Score: {complexity_score:.3f}")
    
    # Extract detailed factors
    complexity_factors = calculator.extract_complexity_factors(task_description)
    print(f"Complexity Factors: {complexity_factors}")
    
    return complexity_score


if __name__ == "__main__":
    # Run example
    example_score = example_complexity_calculation()