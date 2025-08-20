# Code Style Standards - Agent OS Enhanced

## Purpose

Comprehensive coding standards applied by Agent OS when `/systemcc` detects standards establishment, project setup, or code consistency tasks. These standards ensure consistency, readability, and maintainability across all projects.

## Universal Principles

1. **Consistency over personal preference** - Team standards win over individual styles
2. **Readability over cleverness** - Code should be self-documenting
3. **Explicit over implicit** - Clear intentions prevent misunderstandings
4. **Simple over complex** - Prefer straightforward solutions

## Naming Conventions

### Variables and Functions
**Format**: camelCase
```javascript
// ✅ Good
const userData = fetchUserData();
const isAuthenticated = checkAuthStatus();
const handleUserLogin = (credentials) => { /* ... */ };

// ❌ Avoid
const user_data = fetchUserData();
const IsAuthenticated = checkAuthStatus();
const handle_user_login = (credentials) => { /* ... */ };
```

### Constants
**Format**: SCREAMING_SNAKE_CASE
```javascript
// ✅ Good
const API_BASE_URL = 'https://api.example.com';
const MAX_RETRY_ATTEMPTS = 3;
const DEFAULT_TIMEOUT_MS = 5000;

// ❌ Avoid
const apiBaseUrl = 'https://api.example.com';
const maxRetryAttempts = 3;
```

### Classes and Interfaces
**Format**: PascalCase
```typescript
// ✅ Good
class UserRepository {
  constructor() { /* ... */ }
}

interface ApiResponse {
  data: unknown;
  status: number;
}

// ❌ Avoid
class userRepository { /* ... */ }
interface apiResponse { /* ... */ }
```

### Files and Directories
**Files**: kebab-case with appropriate extensions
**Directories**: kebab-case for consistency
```bash
# ✅ Good
src/
├── components/
│   ├── user-profile.component.ts
│   └── navigation-menu.component.ts
├── services/
│   └── api-client.service.ts
└── utils/
    └── date-formatter.util.ts

# ❌ Avoid
src/
├── Components/
│   ├── UserProfile.component.ts
│   └── navigation_menu.component.ts
```

### Component Files (React/Vue/etc.)
**Format**: PascalCase for component files
```bash
# ✅ Good
src/components/
├── UserProfile.tsx
├── NavigationMenu.vue
└── common/
    ├── Button.tsx
    └── Modal.tsx

# ❌ Avoid
src/components/
├── userProfile.tsx
├── navigation-menu.vue
```

## Code Organization

### Import Order and Grouping
```javascript
// 1. External libraries (alphabetical)
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Router } from 'express';

// 2. Internal modules - absolute paths (alphabetical)
import { UserService } from '@/services/user.service';
import { ApiClient } from '@/utils/api-client';
import { Button, Modal } from '@/components/common';

// 3. Relative imports (closest to furthest)
import { validateInput } from '../utils/validation';
import { UserForm } from './UserForm';
import './UserProfile.styles.css';

// 4. Type-only imports (if applicable)
import type { User, ApiResponse } from '@/types';
```

### Function Structure and Size
**Guideline**: Functions should be focused and reasonably sized
```javascript
// ✅ Good - Single responsibility, clear purpose
const calculateTotalPrice = (items, taxRate) => {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const tax = subtotal * taxRate;
  return subtotal + tax;
};

const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

// ❌ Avoid - Too many responsibilities
const processOrder = (items, user, paymentMethod, taxRate, discountCode) => {
  // Validating user
  if (!user.isActive) throw new Error('User inactive');
  
  // Processing discount
  let discount = 0;
  if (discountCode === 'SAVE10') discount = 0.1;
  
  // Calculating total
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const discountAmount = subtotal * discount;
  const tax = (subtotal - discountAmount) * taxRate;
  const total = subtotal - discountAmount + tax;
  
  // Processing payment
  paymentMethod.charge(total);
  
  // Sending email
  emailService.sendOrderConfirmation(user.email, { items, total });
  
  return { total, items };
};
```

### Error Handling Patterns
```javascript
// ✅ Good - Explicit error handling
const fetchUserData = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    
    if (!response.data) {
      throw new Error(`User with ID ${userId} not found`);
    }
    
    return response.data;
  } catch (error) {
    logger.error('Failed to fetch user data', { userId, error: error.message });
    throw new Error(`Failed to fetch user data: ${error.message}`);
  }
};

// ❌ Avoid - Silent failures or generic errors
const fetchUserData = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data; // What if response.data is null?
  } catch (error) {
    return null; // Silent failure - caller doesn't know what went wrong
  }
};
```

## Language-Specific Standards

### JavaScript/TypeScript
```typescript
// Prefer const over let, let over var
const immutableData = { name: 'John' };
let mutableCounter = 0;

// Use template literals for string interpolation
const message = `Hello, ${user.name}! You have ${notifications.length} new messages.`;

// Use optional chaining and nullish coalescing
const userName = user?.profile?.name ?? 'Anonymous';

// Prefer arrow functions for short functions
const double = (x: number): number => x * 2;

// Use regular functions for methods that need `this` context
class Calculator {
  add(a: number, b: number): number {
    return a + b;
  }
}

// Type annotations for function parameters and return types
const processUserData = (user: User): ProcessedUser => {
  return {
    id: user.id,
    displayName: `${user.firstName} ${user.lastName}`,
    isActive: user.status === 'active'
  };
};
```

### Python
```python
# Use snake_case for variables and functions
user_data = fetch_user_data()
is_authenticated = check_auth_status()

def handle_user_login(credentials: dict) -> bool:
    """Handle user login with provided credentials."""
    # Implementation here
    pass

# Use SCREAMING_SNAKE_CASE for constants
API_BASE_URL = "https://api.example.com"
MAX_RETRY_ATTEMPTS = 3

# Use PascalCase for classes
class UserRepository:
    def __init__(self):
        pass
    
    def find_by_id(self, user_id: int) -> User | None:
        # Implementation here
        pass

# Type hints for function parameters and return types
def calculate_total_price(items: list[Item], tax_rate: float) -> float:
    subtotal = sum(item.price for item in items)
    tax = subtotal * tax_rate
    return subtotal + tax
```

### Ruby
```ruby
# Use snake_case for variables and methods
user_data = fetch_user_data
is_authenticated = check_auth_status

def handle_user_login(credentials)
  # Implementation here
end

# Use SCREAMING_SNAKE_CASE for constants
API_BASE_URL = 'https://api.example.com'
MAX_RETRY_ATTEMPTS = 3

# Use PascalCase for classes and modules
class UserRepository
  def initialize
  end
  
  def find_by_id(user_id)
    # Implementation here
  end
end
```

## Comments and Documentation

### When to Comment
```javascript
// ✅ Good - Explaining complex business logic
const calculateShippingCost = (weight, distance, isPriority) => {
  // Base rate: $2 per pound for standard shipping
  // Priority shipping adds 50% surcharge
  // Distance multiplier: 1.2x for every 1000 miles
  const baseRate = weight * 2;
  const priorityMultiplier = isPriority ? 1.5 : 1;
  const distanceMultiplier = 1 + (Math.floor(distance / 1000) * 0.2);
  
  return baseRate * priorityMultiplier * distanceMultiplier;
};

// ✅ Good - Explaining non-obvious decisions
// Using setTimeout instead of setInterval to avoid overlapping requests
const scheduleNextSync = () => {
  setTimeout(syncData, SYNC_INTERVAL_MS);
};
```

### When NOT to Comment
```javascript
// ❌ Avoid - Stating the obvious
const user = getUser(); // Get the user
counter++; // Increment counter
return true; // Return true

// ❌ Avoid - Outdated comments
// TODO: Fix this bug (written 2 years ago)
// This function calculates tax (but now it also handles discounts)
```

### Documentation Standards
```typescript
/**
 * Processes user payment using the specified payment method
 * 
 * @param userId - The unique identifier for the user
 * @param amount - The payment amount in cents
 * @param paymentMethodId - The ID of the payment method to use
 * @returns Promise resolving to payment confirmation details
 * 
 * @throws {PaymentError} When payment processing fails
 * @throws {ValidationError} When input parameters are invalid
 * 
 * @example
 * ```typescript
 * const result = await processPayment('user123', 2500, 'pm_abc123');
 * console.log(`Payment ${result.id} processed successfully`);
 * ```
 */
const processPayment = async (
  userId: string,
  amount: number,
  paymentMethodId: string
): Promise<PaymentResult> => {
  // Implementation here
};
```

## Code Formatting Rules

### Line Length and Wrapping
- **Maximum line length**: 100 characters
- **Wrap long function calls** across multiple lines
- **Align parameters** for readability

```javascript
// ✅ Good
const result = await apiClient.post('/users', {
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  preferences: user.preferences
});

// ❌ Avoid
const result = await apiClient.post('/users', { firstName: user.firstName, lastName: user.lastName, email: user.email, preferences: user.preferences });
```

### Spacing and Indentation
- **Indentation**: 2 spaces for JavaScript/TypeScript/JSON, 4 spaces for Python
- **No trailing whitespace**
- **Empty line at end of file**
- **Consistent spacing around operators**

```javascript
// ✅ Good
const calculateTotal = (items) => {
  const subtotal = items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);
  
  const tax = subtotal * TAX_RATE;
  return subtotal + tax;
};

// ❌ Avoid
const calculateTotal=(items)=>{
const subtotal=items.reduce((sum,item)=>{
return sum+(item.price*item.quantity);
},0);

const tax=subtotal*TAX_RATE;
return subtotal+tax;
};
```

## Agent OS Integration

### Automatic Standards Application
When Agent OS detects standards establishment needs:

1. **Configuration Generation**: Creates .eslintrc, .prettierrc, etc.
2. **Pre-commit Hooks**: Sets up automatic formatting and linting
3. **Editor Configuration**: Generates .editorconfig for consistency
4. **Documentation**: Creates team style guide documentation

### Project-Specific Overrides
```yaml
# .agent-os.yml
code_style:
  line_length: 120  # Override default 100
  indent_size: 4    # Override default 2 for JS projects
  quote_style: double  # Override default single quotes
```

### Validation and Enforcement
- **Pre-commit hooks**: Prevent commits that violate standards
- **CI/CD checks**: Automated validation in pull requests
- **Editor integration**: Real-time feedback during development
- **Team reviews**: Human oversight for style guide adherence

Remember: Consistent code style reduces cognitive load and improves team productivity. These standards should be adapted to your team's preferences while maintaining consistency.