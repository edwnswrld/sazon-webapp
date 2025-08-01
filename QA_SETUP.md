# 🧪 Sazón MVP QA Setup Guide

## Overview

This document provides a comprehensive guide to the QA (Quality Assurance) setup for the Sazón MVP project. The QA infrastructure ensures code quality, security, performance, and maintainability across both frontend and backend codebases.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
# Install all dependencies for both frontend and backend
npm run install:all
```

### 2. Run Initial QA Check
```bash
# Run comprehensive QA check across both projects
npm run qa:check
```

### 3. Start Development
```bash
# Start both frontend and backend development servers
npm run dev

# In another terminal, run tests in watch mode
npm run test:watch
```

## 📋 QA Infrastructure Components

### 1. Code Quality Tools

#### ESLint Configuration
- **Frontend**: Enhanced ESLint config with React, TypeScript, and accessibility rules
- **Backend**: Security-focused ESLint config with Node.js specific rules
- **Key Features**:
  - TypeScript strict mode
  - React hooks rules
  - Accessibility (a11y) compliance
  - Security vulnerability detection
  - Unique scoping enforcement (10x engineer requirement)

#### Prettier Configuration
- Consistent code formatting across the project
- Automatic formatting on save (when configured in IDE)
- Integration with ESLint for conflict-free formatting

### 2. Testing Infrastructure

#### Frontend Testing (Vitest + React Testing Library)
- **Unit Tests**: Individual component and function testing
- **Integration Tests**: Component interaction testing
- **Accessibility Tests**: a11y compliance verification
- **Coverage Reporting**: 80% minimum coverage requirement

#### Backend Testing (Jest + Supertest)
- **Unit Tests**: Service and utility function testing
- **Integration Tests**: API endpoint testing
- **Security Tests**: Authentication and authorization testing
- **Database Tests**: Mocked database operations

### 3. Security Tools
- **npm audit**: Dependency vulnerability scanning
- **ESLint Security Plugin**: Code-level security checks
- **Input Validation**: Zod schema validation
- **Authentication**: Supabase auth integration

### 4. Performance Monitoring
- **Bundle Analysis**: Frontend bundle size monitoring
- **API Performance**: Response time tracking
- **Database Optimization**: Query performance analysis

## 🛠️ Available Commands

### Root Level Commands
```bash
# Development
npm run dev                    # Start both frontend and backend
npm run dev:frontend          # Start frontend only
npm run dev:backend           # Start backend only

# Building
npm run build                 # Build both projects
npm run build:frontend        # Build frontend only
npm run build:backend         # Build backend only

# Quality Assurance
npm run qa:check              # Full QA check (lint + type-check + test)
npm run qa:security           # Security audit
npm run qa:performance        # Performance check

# Linting
npm run lint                  # Lint both projects
npm run lint:fix              # Fix auto-fixable linting issues
npm run lint:frontend         # Lint frontend only
npm run lint:backend          # Lint backend only

# Type Checking
npm run type-check            # Type check both projects
npm run type-check:frontend   # Type check frontend only
npm run type-check:backend    # Type check backend only

# Testing
npm run test                  # Run tests for both projects
npm run test:coverage         # Run tests with coverage
npm run test:watch            # Run tests in watch mode
npm run test:frontend         # Test frontend only
npm run test:backend          # Test backend only

# Code Formatting
npm run format                # Format all code
npm run format:check          # Check formatting

# Maintenance
npm run clean                 # Clean all build artifacts
npm run install:all           # Install all dependencies
```

### Frontend Specific Commands
```bash
cd frontend

# Testing
npm run test                  # Run tests
npm run test:coverage         # Run tests with coverage
npm run test:watch            # Run tests in watch mode
npm run test:ui               # Run tests with UI

# Development
npm run dev                   # Start development server
npm run build                 # Build for production
npm run preview               # Preview production build

# Quality
npm run lint                  # Lint code
npm run lint:fix              # Fix linting issues
npm run type-check            # Type check
```

### Backend Specific Commands
```bash
cd backend

# Testing
npm run test                  # Run tests
npm run test:coverage         # Run tests with coverage
npm run test:watch            # Run tests in watch mode
npm run test:ci               # Run tests for CI

# Development
npm run dev                   # Start development server
npm run build                 # Build for production
npm run start                 # Start production server

# Quality
npm run lint                  # Lint code
npm run lint:fix              # Fix linting issues
npm run type-check            # Type check
```

## 🔍 Code Review Process

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
   - Use the QA checklist from `.cursorrules/engineering/qa_engineer.md`
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

## 📊 Quality Gates

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

## 🧪 Testing Strategy

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

## 🔧 Configuration Files

### ESLint Configurations
- `frontend/.eslintrc.cjs` - Frontend ESLint configuration
- `backend/.eslintrc.cjs` - Backend ESLint configuration

### Testing Configurations
- `frontend/vitest.config.ts` - Frontend Vitest configuration
- `backend/jest.config.js` - Backend Jest configuration

### Test Setup Files
- `frontend/src/test/setup.ts` - Frontend test setup
- `backend/src/test/setup.ts` - Backend test setup

### Code Formatting
- `.prettierrc` - Prettier configuration

## 🚨 Common Issues and Solutions

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

## 📈 Monitoring and Maintenance

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

## 🔗 Resources

- [QA Engineer Guidelines](.cursorrules/engineering/qa_engineer.md)
- [QA Workflow Guide](.cursorrules/engineering/qa_workflow.md)
- [Frontend ESLint Config](frontend/.eslintrc.cjs)
- [Backend ESLint Config](backend/.eslintrc.cjs)
- [Jest Configuration](backend/jest.config.js)
- [Vitest Configuration](frontend/vitest.config.ts)
- [Prettier Configuration](.prettierrc)

## 🤝 Contributing

When contributing to this project:

1. Follow the established QA workflow
2. Ensure all tests pass before submitting
3. Maintain high code coverage
4. Follow the coding standards
5. Update documentation as needed
6. Run security audits regularly

## 📞 Support

If you encounter issues with the QA setup:

1. Check the troubleshooting section above
2. Review the configuration files
3. Consult the QA workflow guide
4. Run `npm run clean && npm run install:all` to reset dependencies
5. Check for updates to dependencies

---

**Remember**: Quality is everyone's responsibility. The QA tools are here to help, but they're only as effective as the team's commitment to using them consistently. 