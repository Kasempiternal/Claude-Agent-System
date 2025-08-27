"""
Decision Engine Constants

Centralized configuration for all mathematical thresholds and parameters
used across the decision engines to ensure consistency and maintainability.
"""

# Score Ranges and Thresholds
SCORE_MIN = 0.0
SCORE_MAX = 1.0

# Critical Decision Thresholds
CONTEXT_OVERFLOW_THRESHOLD = 0.8
CRITICAL_RISK_THRESHOLD = 0.8
CRITICAL_TIME_THRESHOLD = 0.9

# Technical Complexity Weights
TECH_COMPLEXITY_WEIGHTS = {
    'HIGH': {
        'architecture': 0.3,
        'refactor': 0.25,
        'migrate': 0.25,
        'system': 0.2,
        'complex': 0.2,
        'algorithm': 0.25,
        'optimization': 0.2,
        'integration': 0.2,
        'scalable': 0.2,
        'distributed': 0.3
    },
    'MEDIUM': {
        'implement': 0.15,
        'create': 0.1,
        'build': 0.1,
        'design': 0.15,
        'api': 0.15,
        'database': 0.15,
        'auth': 0.15,
        'security': 0.2
    },
    'LOW': {
        'fix': -0.1,
        'update': -0.05,
        'change': -0.05,
        'small': -0.1,
        'simple': -0.15,
        'quick': -0.1,
        'typo': -0.2
    }
}

# Risk Factor Weights
RISK_WEIGHTS = {
    'CRITICAL': {
        'breaking': 0.4,
        'delete': 0.3,
        'remove': 0.3,
        'drop': 0.3,
        'migrate': 0.25,
        'production': 0.3,
        'live': 0.3,
        'critical': 0.4
    },
    'HIGH': {
        'security': 0.25,
        'auth': 0.2,
        'password': 0.25,
        'permission': 0.2,
        'admin': 0.2,
        'schema': 0.2,
        'database': 0.15,
        'api': 0.1
    },
    'MEDIUM': {
        'change': 0.05,
        'modify': 0.05,
        'update': 0.05,
        'refactor': 0.1
    }
}

# Time Pressure Indicators
TIME_PRESSURE_WEIGHTS = {
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

TIME_SPECIFIC_PHRASES = [
    'today', 'tonight', 'tomorrow', 'this morning', 'right now'
]

# Context Load Calculation
CONTEXT_LOAD_PARAMS = {
    'MAX_TOKENS_FOR_HALF_LOAD': 25000,
    'MAX_FILES_FOR_THIRD_LOAD': 20,
    'GROWTH_FACTOR_MULTIPLIER': 0.08,
    'MAX_PREDICTED_GROWTH': 0.4
}

# Scope Impact Calculation
SCOPE_PARAMS = {
    'WORD_COUNT_THRESHOLDS': {
        'HIGH': 100,
        'MEDIUM': 50
    },
    'WORD_COUNT_SCORES': {
        'HIGH': 0.2,
        'MEDIUM': 0.1
    },
    'FILE_COUNT_THRESHOLDS': {
        'HIGH': 10,
        'MEDIUM': 5
    },
    'FILE_COUNT_SCORES': {
        'HIGH': 0.2,
        'MEDIUM': 0.1
    }
}

# Global and Multi-component Indicators
GLOBAL_SCOPE_INDICATORS = [
    'all', 'entire', 'every', 'across', 'throughout', 'system-wide'
]

MULTI_COMPONENT_INDICATORS = [
    'multiple', 'several', 'various', 'different', 'many'
]

GROWTH_INDICATORS = [
    'implement', 'create', 'build', 'design', 'refactor',
    'architecture', 'system', 'complex', 'integration'
]

# Workflow Factor Weights
WORKFLOW_WEIGHTS = {
    'ORCHESTRATED': {
        'technical_complexity': 0.4,
        'scope_impact': 0.2,
        'risk_factor': 0.2,
        'context_load': 0.1,
        'time_pressure': 0.1
    },
    'COMPLETE_SYSTEM': {
        'technical_complexity': 0.25,
        'scope_impact': 0.2,
        'risk_factor': 0.35,
        'context_load': 0.15,
        'time_pressure': 0.05
    },
    'TASKIT': {
        'technical_complexity': 0.15,
        'scope_impact': 0.35,
        'risk_factor': 0.15,
        'context_load': 0.3,
        'time_pressure': 0.05
    },
    'AIDEVTASKS': {
        'technical_complexity': 0.3,
        'scope_impact': 0.25,
        'risk_factor': 0.2,
        'context_load': 0.15,
        'time_pressure': 0.1
    }
}

# Workflow Suitability Ranges
WORKFLOW_SUITABILITY = {
    'ORCHESTRATED': {
        'technical_complexity': (0.0, 0.4),
        'scope_impact': (0.0, 0.4),
        'risk_factor': (0.0, 0.3),
        'optimal_range': (0.0, 0.35)
    },
    'COMPLETE_SYSTEM': {
        'technical_complexity': (0.3, 1.0),
        'scope_impact': (0.0, 0.8),
        'risk_factor': (0.3, 1.0),
        'optimal_range': (0.4, 0.8)
    },
    'TASKIT': {
        'technical_complexity': (0.0, 1.0),
        'scope_impact': (0.6, 1.0),
        'context_load': (0.6, 1.0),
        'optimal_range': (0.6, 1.0)
    },
    'AIDEVTASKS': {
        'technical_complexity': (0.4, 0.8),
        'scope_impact': (0.4, 0.8),
        'risk_factor': (0.2, 0.6),
        'optimal_range': (0.3, 0.7)
    }
}

# Score Classification Thresholds
SCORE_LEVELS = {
    'VERY_HIGH': 0.8,
    'HIGH': 0.6,
    'MEDIUM': 0.4,
    'LOW': 0.2
}

# Normalization Parameters
NORMALIZATION = {
    'SIGMOID_CENTER': 0.3,
    'SIGMOID_SCALE': 0.2,
    'MAX_SCOPE_GLOBAL_MATCHES': 0.4,
    'GLOBAL_MATCH_WEIGHT': 0.15,
    'MAX_SCOPE_MULTI_MATCHES': 0.3,
    'MULTI_MATCH_WEIGHT': 0.1
}

# Input Validation Limits
VALIDATION = {
    'MAX_TASK_DESCRIPTION_LENGTH': 10000,
    'MAX_URGENCY_MULTIPLIER': 0.1,
    'MIN_CONFIDENCE': 0.5,
    'MAX_CONFIDENCE': 0.95,
    'MAX_ALTERNATIVES': 3
}

# Fallback Configuration
FALLBACK = {
    'HIGH_CONTEXT_THRESHOLD': 30000,
    'DEFAULT_CONFIDENCE': {
        'orchestrated': 0.75,
        'complete_system': 0.7,
        'safe_default': 0.6
    },
    'SIMPLE_KEYWORDS': ['fix', 'simple', 'quick', 'small'],
    'COMPLEX_KEYWORDS': ['complex', 'architecture', 'system', 'critical']
}