# 🧪 QA Workflow Guide

## Overview

This document outlines the comprehensive QA workflow for the Sazón MVP project. The QA process ensures code quality, security, performance, and maintainability across both frontend and backend codebases.

## Quick Start

### Initial Setup
```bash
# Install all dependencies
npm run install:all

# Run initial QA check
npm run qa:check
```

### Daily Development Workflow
```bash
# Start development servers
npm run dev

# In another terminal, run tests in watch mode
npm run test:watch

# Before committing, run full QA check
npm run qa:check
```

## QA Commands Reference

### Root Level Commands
```bash
# Full QA check (lint + type-check + test coverage)
npm run qa:check

# Security audit
npm run qa:security

# Performance check
npm run qa:performance

# Format code
npm run format

# Check formatting
npm run format:check
```

### Frontend Specific
```bash
cd frontend

# Linting
npm run lint
npm run lint:fix

# Type checking
npm run type-check

# Testing
npm run test
npm run test:coverage
npm run test:watch
npm run test:ui
```

### Backend Specific
```bash
cd backend

# Linting
npm run lint
npm run lint:fix

# Type checking
npm run type-check

# Testing
npm run test
npm run test:coverage
npm run test:watch
npm run test:ci
```

## Code Review Process

### Before Submitting Code
1. **Run Local QA Check**
   ```bash
   npm run qa:check
   ```

2. **Fix Any Issues**
   - Address linting errors: `npm run lint:fix`
   - Fix TypeScript errors
   - Ensure tests pass
   - Update documentation if needed

3. **Self-Review**
   - Use the QA checklist from `qa_engineer.md`
   - Check for security vulnerabilities
   - Verify performance implications
   - Ensure proper error handling

### During Code Review
1. **Automated Checks**
   - Verify CI/CD pipeline passes
   - Check test coverage meets threshold (>80%)
   - Ensure no security vulnerabilities

2. **Manual Review**
   - Follow the QA checklist systematically
   - Focus on business logic correctness
   - Check for edge cases
   - Verify proper error handling
   - Review for accessibility issues

### After Code Review
1. **Address Feedback**
   - Fix all identified issues
   - Update tests if needed
   - Update documentation if needed

2. **Final Verification**
   - Run QA check again
   - Ensure CI/CD passes
   - Verify deployment works correctly

## Quality Gates

### Must Pass (Blocking)
- [ ] All linting errors resolved
- [ ] All TypeScript errors resolved
- [ ] All tests passing
- [ ] Security scan clean
- [ ] No sensitive data in code
- [ ] Code coverage > 80%

### Should Pass (Warning)
- [ ] Performance benchmarks met
- [ ] Accessibility standards met
- [ ] Documentation updated
- [ ] No console.log statements in production code

## Common Issues and Solutions

### Frontend Issues

#### Linting Errors
```bash
# Fix automatically fixable issues
npm run lint:fix

# Manual fixes needed for:
# - Unused variables (remove or prefix with _)
# - Missing accessibility attributes
# - Improper TypeScript usage
```

#### TypeScript Errors
```bash
# Check for type errors
npm run type-check

# Common fixes:
# - Add proper type annotations
# - Use proper interfaces
# - Handle null/undefined cases
```

#### Test Failures
```bash
# Run tests with coverage
npm run test:coverage

# Common issues:
# - Missing mocks
# - Incorrect assertions
# - Async test handling
```

### Backend Issues

#### Security Vulnerabilities
```bash
# Run security audit
npm run qa:security

# Common fixes:
# - Update dependencies
# - Fix SQL injection vulnerabilities
# - Add proper input validation
# - Implement rate limiting
```

#### Performance Issues
```bash
# Run performance check
npm run qa:performance

# Common optimizations:
# - Optimize database queries
# - Add caching
# - Implement pagination
# - Use proper indexing
```

## Testing Strategy

### Frontend Testing
- **Unit Tests**: Test individual components and functions
- **Integration Tests**: Test component interactions
- **E2E Tests**: Test complete user flows
- **Accessibility Tests**: Ensure a11y compliance

### Backend Testing
- **Unit Tests**: Test individual functions and services
- **Integration Tests**: Test API endpoints
- **Security Tests**: Test authentication and authorization
- **Performance Tests**: Test response times and throughput

## Continuous Integration

### Pre-commit Hooks
```bash
# These run automatically before commits:
npm run lint
npm run type-check
npm run test
```

### CI/CD Pipeline
```bash
# These run in CI/CD:
npm run qa:check
npm run qa:security
npm run build
npm run test:ci
```

## Monitoring and Maintenance

### Regular Tasks
- [ ] Weekly dependency updates
- [ ] Monthly security audits
- [ ] Quarterly performance reviews
- [ ] Continuous test coverage monitoring

### Metrics to Track
- Test coverage percentage
- Number of linting errors
- Security vulnerabilities
- Performance benchmarks
- Build success rate

## Troubleshooting

### Common Problems

#### "Module not found" errors
```bash
# Clear node_modules and reinstall
npm run clean
npm run install:all
```

#### Test failures after dependency updates
```bash
# Clear test cache
npm run clean
npm run install:all
npm run test
```

#### Performance degradation
```bash
# Run performance analysis
npm run qa:performance

# Check for:
# - Memory leaks
# - Inefficient queries
# - Bundle size increases
```

## Best Practices

### Code Quality
- Write self-documenting code
- Use meaningful variable and function names
- Add comments for complex logic
- Follow the established naming conventions

### Testing
- Write tests for all new features
- Maintain high test coverage
- Test edge cases and error scenarios
- Use descriptive test names

### Security
- Never commit sensitive data
- Use environment variables for configuration
- Validate all inputs
- Implement proper authentication

### Performance
- Optimize database queries
- Use proper caching strategies
- Implement lazy loading
- Monitor bundle sizes

## Resources

- [QA Engineer Guidelines](./qa_engineer.md)
- [ESLint Configuration](../frontend/.eslintrc.cjs)
- [Jest Configuration](../backend/jest.config.js)
- [Vitest Configuration](../frontend/vitest.config.ts)
- [Prettier Configuration](../.prettierrc) 