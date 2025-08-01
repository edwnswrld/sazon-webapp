# 🧪 QA Engineering Guidelines for Code Review

## Code Review Checklist

### 1. Code Quality & Standards
- [ ] Verify consistent code formatting and indentation
- [ ] Check for proper naming conventions (camelCase for variables/functions, PascalCase for components)
- [ ] Ensure no unused imports, variables, or functions
- [ ] Validate TypeScript types are properly defined and used
- [ ] Confirm ESLint rules are followed (refer to .eslintrc.cjs)
- [ ] Verify unique scoping for all class, variable, and function names (10x engineer requirement)
- [ ] Check for proper error handling and logging

### 2. Performance Optimization
- [ ] Review for potential memory leaks
- [ ] Check for unnecessary re-renders in React components
- [ ] Validate proper use of React hooks (useCallback, useMemo where needed)
- [ ] Ensure efficient database queries and API calls
- [ ] Verify proper error boundaries implementation
- [ ] Check for proper lazy loading and code splitting
- [ ] Review bundle size and optimization

### 3. Security Best Practices
- [ ] Confirm no sensitive data exposure
- [ ] Validate proper authentication/authorization checks
- [ ] Check for SQL injection prevention in database queries
- [ ] Ensure proper CORS configuration
- [ ] Verify secure handling of environment variables
- [ ] Review API rate limiting implementation
- [ ] Check for XSS prevention in frontend components

### 4. Testing Coverage
- [ ] Unit tests for critical functions
- [ ] Integration tests for API endpoints
- [ ] End-to-end tests for user flows
- [ ] Test edge cases and error scenarios
- [ ] Verify test coverage meets minimum threshold (>80%)
- [ ] Ensure tests are properly mocked and isolated
- [ ] Check for accessibility testing (a11y)

### 5. Documentation
- [ ] Check for clear and updated documentation
- [ ] Verify API endpoints documentation
- [ ] Ensure complex logic has proper comments
- [ ] Confirm README.md is up to date
- [ ] Review changelog updates
- [ ] Verify component documentation with JSDoc
- [ ] Check for inline code documentation

## Automated Checks

### Pre-commit Hooks
```bash
# Frontend
cd frontend && npm run lint
cd frontend && npm run type-check
cd frontend && npm run test

# Backend
cd backend && npm run lint
cd backend && npm run test
```

### CI/CD Pipeline Checks
- [ ] ESLint passes on all files
- [ ] TypeScript compilation succeeds
- [ ] All tests pass
- [ ] Code coverage meets threshold
- [ ] Security scan passes
- [ ] Performance benchmarks pass
- [ ] Accessibility audit passes

## Project-Specific Rules

### Frontend (React/TypeScript)
- Use `sazon` prefix for custom hooks and utilities
- Implement proper error boundaries for all route components
- Use React Query for data fetching with proper error handling
- Ensure all components have proper TypeScript interfaces
- Use Tailwind CSS classes consistently
- Implement proper loading states and skeleton screens

### Backend (Node.js/Express)
- Use `sazon` prefix for custom middleware and services
- Implement proper request validation with Zod
- Use structured logging with the SazonLogger
- Implement proper rate limiting and security headers
- Use environment variables for all configuration
- Implement proper error handling middleware

### Database & API
- Use Supabase client with proper error handling
- Implement proper data validation before database operations
- Use transactions for multi-step operations
- Implement proper pagination for list endpoints
- Use proper HTTP status codes and error messages

## Code Review Process

### Before Review
1. Run all automated checks locally
2. Ensure all tests pass
3. Update documentation if needed
4. Self-review using this checklist

### During Review
1. Use the checklist above systematically
2. Focus on security and performance implications
3. Verify proper error handling
4. Check for edge cases
5. Ensure code follows project conventions

### After Review
1. Address all feedback before merging
2. Update tests if needed
3. Update documentation if needed
4. Verify CI/CD pipeline passes

## Quality Gates

### Must Pass (Blocking)
- [ ] All linting errors resolved
- [ ] All TypeScript errors resolved
- [ ] All tests passing
- [ ] Security scan clean
- [ ] No sensitive data in code

### Should Pass (Warning)
- [ ] Code coverage > 80%
- [ ] Performance benchmarks met
- [ ] Accessibility standards met
- [ ] Documentation updated

## Tools and Commands

### Frontend
```bash
# Linting
npm run lint

# Type checking
npm run type-check

# Testing
npm run test

# Build
npm run build
```

### Backend
```bash
# Linting
npm run lint

# Testing
npm run test

# Build
npm run build

# Start development
npm run dev
```

### Global
```bash
# Run all checks
npm run qa:check

# Run security scan
npm run qa:security

# Run performance test
npm run qa:performance
```

## Common Issues to Watch For

### Frontend
- Missing error boundaries
- Unnecessary re-renders
- Missing loading states
- Improper TypeScript usage
- Missing accessibility attributes
- Hardcoded values instead of environment variables

### Backend
- Missing input validation
- Improper error handling
- Missing authentication checks
- SQL injection vulnerabilities
- Missing rate limiting
- Improper logging

### General
- Inconsistent naming conventions
- Missing documentation
- Poor error messages
- Security vulnerabilities
- Performance bottlenecks
- Accessibility issues
