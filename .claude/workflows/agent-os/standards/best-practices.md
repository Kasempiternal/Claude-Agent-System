# Best Practices Standards - Agent OS Enhanced

## Purpose

Comprehensive best practices applied by Agent OS when `/systemcc` detects standards establishment or quality improvement needs. These practices ensure maintainable, secure, and performant code across all projects.

## Core Development Principles

### 1. Single Responsibility Principle
Each function, class, and module should have one clear purpose.

```javascript
// ✅ Good - Single responsibility
const calculateTax = (amount, taxRate) => amount * taxRate;
const calculateDiscount = (amount, discountRate) => amount * discountRate;
const calculateTotal = (subtotal, tax, discount) => subtotal + tax - discount;

// ❌ Avoid - Multiple responsibilities
const processOrder = (items, user, taxRate, discountCode) => {
  // Calculating subtotal
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  
  // Processing discount
  let discount = 0;
  if (discountCode === 'SAVE10') discount = subtotal * 0.1;
  
  // Calculating tax
  const tax = (subtotal - discount) * taxRate;
  
  // Sending email
  emailService.send(user.email, 'Order confirmation');
  
  // Logging
  console.log('Order processed');
  
  return subtotal + tax - discount;
};
```

### 2. Pure Functions and Immutability
Prefer functions without side effects and immutable data structures.

```javascript
// ✅ Good - Pure function
const addUser = (users, newUser) => [...users, newUser];
const updateUserStatus = (user, status) => ({ ...user, status });

// ❌ Avoid - Mutations and side effects
const addUser = (users, newUser) => {
  users.push(newUser); // Mutates input array
  console.log('User added'); // Side effect
  return users;
};
```

### 3. Fail Fast and Explicit Error Handling
Validate inputs early and handle errors explicitly.

```javascript
// ✅ Good - Early validation and explicit errors
const divide = (a, b) => {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('Both arguments must be numbers');
  }
  
  if (b === 0) {
    throw new Error('Division by zero is not allowed');
  }
  
  return a / b;
};

// ❌ Avoid - Silent failures or late validation
const divide = (a, b) => {
  const result = a / b;
  return result === Infinity ? 0 : result; // Hides the error
};
```

## Code Organization Best Practices

### Project Structure Patterns
```bash
# ✅ Recommended structure
src/
├── components/           # UI components
│   ├── common/          # Reusable components
│   └── feature-specific/ # Feature-specific components
├── services/            # Business logic and API calls
│   ├── api/            # External API clients
│   └── domain/         # Business domain services
├── utils/               # Pure utility functions
├── hooks/              # Custom hooks (React)
├── stores/             # State management
├── types/              # Type definitions
├── constants/          # Application constants
└── __tests__/          # Test files
```

### Module Organization
```javascript
// ✅ Good - Clear module structure
// user.service.js
export class UserService {
  constructor(apiClient) {
    this.apiClient = apiClient;
  }
  
  async findById(id) { /* ... */ }
  async create(userData) { /* ... */ }
  async update(id, userData) { /* ... */ }
  async delete(id) { /* ... */ }
}

// user.types.js
export interface User {
  id: string;
  email: string;
  profile: UserProfile;
}

// user.constants.js
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  MODERATOR: 'moderator'
};
```

### Dependency Injection Pattern
```javascript
// ✅ Good - Dependencies injected, easily testable
class OrderService {
  constructor(userService, paymentService, emailService) {
    this.userService = userService;
    this.paymentService = paymentService;
    this.emailService = emailService;
  }
  
  async processOrder(orderData) {
    const user = await this.userService.findById(orderData.userId);
    const payment = await this.paymentService.charge(orderData.amount);
    await this.emailService.sendConfirmation(user.email);
    
    return { orderId: generateId(), payment, user };
  }
}

// ❌ Avoid - Hard dependencies, difficult to test
class OrderService {
  async processOrder(orderData) {
    const user = await UserService.findById(orderData.userId); // Hard dependency
    const payment = await PaymentService.charge(orderData.amount);
    await EmailService.sendConfirmation(user.email);
    
    return { orderId: generateId(), payment, user };
  }
}
```

## Error Handling Best Practices

### Structured Error Handling
```javascript
// ✅ Good - Structured error types
class ValidationError extends Error {
  constructor(field, message) {
    super(`Validation failed for ${field}: ${message}`);
    this.name = 'ValidationError';
    this.field = field;
  }
}

class ApiError extends Error {
  constructor(status, message, originalError) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.originalError = originalError;
  }
}

// Usage with proper error handling
const createUser = async (userData) => {
  try {
    validateUserData(userData); // May throw ValidationError
    const user = await apiClient.post('/users', userData); // May throw ApiError
    return user;
  } catch (error) {
    if (error instanceof ValidationError) {
      logger.warn('User validation failed', { field: error.field, data: userData });
      throw error; // Re-throw for caller to handle
    }
    
    if (error instanceof ApiError) {
      logger.error('API call failed', { status: error.status, error: error.message });
      throw new Error('Failed to create user. Please try again.');
    }
    
    logger.error('Unexpected error during user creation', { error });
    throw new Error('An unexpected error occurred');
  }
};
```

### Error Recovery Patterns
```javascript
// ✅ Good - Retry with exponential backoff
const fetchWithRetry = async (url, options = {}, maxRetries = 3) => {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fetch(url, options);
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) break;
      
      const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw new Error(`Failed after ${maxRetries + 1} attempts: ${lastError.message}`);
};

// ✅ Good - Circuit breaker pattern
class CircuitBreaker {
  constructor(threshold = 5, timeout = 60000) {
    this.threshold = threshold;
    this.timeout = timeout;
    this.failureCount = 0;
    this.lastFailureTime = null;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
  }
  
  async execute(operation) {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.timeout) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }
    
    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  onSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }
  
  onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    
    if (this.failureCount >= this.threshold) {
      this.state = 'OPEN';
    }
  }
}
```

## Performance Best Practices

### Efficient Data Structures and Algorithms
```javascript
// ✅ Good - Use appropriate data structures
class UserCache {
  constructor() {
    this.cache = new Map(); // O(1) lookup time
    this.usersByEmail = new Map(); // Index for email lookups
  }
  
  addUser(user) {
    this.cache.set(user.id, user);
    this.usersByEmail.set(user.email, user);
  }
  
  findById(id) {
    return this.cache.get(id); // O(1)
  }
  
  findByEmail(email) {
    return this.usersByEmail.get(email); // O(1)
  }
}

// ❌ Avoid - Inefficient algorithms
class UserCache {
  constructor() {
    this.users = []; // Array for everything
  }
  
  addUser(user) {
    this.users.push(user);
  }
  
  findById(id) {
    return this.users.find(user => user.id === id); // O(n)
  }
  
  findByEmail(email) {
    return this.users.find(user => user.email === email); // O(n)
  }
}
```

### Memory Management
```javascript
// ✅ Good - Cleanup event listeners and timers
class Component {
  constructor() {
    this.handleClick = this.handleClick.bind(this);
    this.intervalId = null;
  }
  
  mount() {
    document.addEventListener('click', this.handleClick);
    this.intervalId = setInterval(this.updateData.bind(this), 1000);
  }
  
  unmount() {
    document.removeEventListener('click', this.handleClick);
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
  
  handleClick(event) { /* ... */ }
  updateData() { /* ... */ }
}

// ❌ Avoid - Memory leaks
class Component {
  mount() {
    document.addEventListener('click', (event) => { /* ... */ }); // Anonymous function, can't remove
    setInterval(() => { /* ... */ }, 1000); // Timer never cleared
  }
}
```

### Lazy Loading and Code Splitting
```javascript
// ✅ Good - Dynamic imports for code splitting
const LazyComponent = lazy(() => import('./HeavyComponent'));

// ✅ Good - Lazy initialization
class DataProcessor {
  constructor() {
    this._heavyResource = null;
  }
  
  get heavyResource() {
    if (!this._heavyResource) {
      this._heavyResource = new HeavyResource(); // Initialized only when needed
    }
    return this._heavyResource;
  }
}
```

## Security Best Practices

### Input Validation and Sanitization
```javascript
// ✅ Good - Proper validation and sanitization
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ValidationError('email', 'Invalid email format');
  }
  
  // Sanitize to prevent injection
  return email.trim().toLowerCase();
};

const validatePassword = (password) => {
  if (!password || password.length < 8) {
    throw new ValidationError('password', 'Password must be at least 8 characters');
  }
  
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    throw new ValidationError('password', 'Password must contain uppercase, lowercase, and number');
  }
  
  return password; // Don't log or store passwords
};

// ❌ Avoid - No validation or weak validation
const createUser = (userData) => {
  return apiClient.post('/users', userData); // Raw input sent to API
};
```

### Secure Data Handling
```javascript
// ✅ Good - Secure credential handling
const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

// Secure token generation
const generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// ❌ Avoid - Insecure practices
const hashPassword = (password) => {
  return md5(password); // Weak hashing algorithm
};

const generateToken = () => {
  return Math.random().toString(36); // Predictable token generation
};
```

### SQL Injection Prevention
```javascript
// ✅ Good - Parameterized queries
const findUserById = async (id) => {
  const query = 'SELECT * FROM users WHERE id = $1';
  const result = await db.query(query, [id]);
  return result.rows[0];
};

// ✅ Good - ORM usage
const findUserByEmail = async (email) => {
  return await User.findOne({ where: { email } }); // ORM handles parameterization
};

// ❌ Avoid - String concatenation
const findUserById = async (id) => {
  const query = `SELECT * FROM users WHERE id = ${id}`; // SQL injection risk
  return await db.query(query);
};
```

## Testing Best Practices

### Test Structure and Organization
```javascript
// ✅ Good - Clear test structure
describe('UserService', () => {
  let userService;
  let mockApiClient;
  
  beforeEach(() => {
    mockApiClient = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn()
    };
    userService = new UserService(mockApiClient);
  });
  
  describe('findById', () => {
    it('should return user when found', async () => {
      // Arrange
      const userId = '123';
      const expectedUser = { id: userId, email: 'test@example.com' };
      mockApiClient.get.mockResolvedValue({ data: expectedUser });
      
      // Act
      const result = await userService.findById(userId);
      
      // Assert
      expect(result).toEqual(expectedUser);
      expect(mockApiClient.get).toHaveBeenCalledWith(`/users/${userId}`);
    });
    
    it('should throw error when user not found', async () => {
      // Arrange
      const userId = '999';
      mockApiClient.get.mockRejectedValue(new Error('Not found'));
      
      // Act & Assert
      await expect(userService.findById(userId)).rejects.toThrow('Not found');
    });
  });
});
```

### Test Coverage Guidelines
- **Unit Tests**: 80%+ coverage for business logic
- **Integration Tests**: Critical user flows
- **E2E Tests**: Key user journeys
- **Edge Cases**: Error conditions and boundary values

## Agent OS Integration

### Automatic Best Practice Enforcement
When Agent OS detects quality improvement needs:

1. **Code Analysis**: Identifies anti-patterns and violations
2. **Refactoring Suggestions**: Proposes improvements
3. **Quality Gates**: Sets up automated checks
4. **Documentation**: Creates best practice guides

### Quality Metrics Tracking
```yaml
# .agent-os.yml
quality_metrics:
  test_coverage: 80
  complexity_threshold: 10
  duplicate_code_threshold: 5
  security_scan: enabled
  performance_budget: 
    bundle_size: 250kb
    load_time: 3s
```

### Continuous Improvement Process
1. **Regular Reviews**: Monthly code quality assessments
2. **Pattern Updates**: Evolve practices based on learnings
3. **Tool Integration**: Leverage static analysis tools
4. **Team Training**: Share best practices across team

Remember: Best practices evolve with technology and team maturity. These guidelines should be adapted based on project needs and team expertise.