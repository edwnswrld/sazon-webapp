import { jest } from '@jest/globals'

// Mock environment variables for testing
process.env['NODE_ENV'] = 'test'
process.env['PORT'] = '3001'
process.env['SUPABASE_URL'] = 'https://test.supabase.co'
process.env['SUPABASE_ANON_KEY'] = 'test-anon-key'
process.env['SUPABASE_SERVICE_KEY'] = 'test-service-key'
process.env['OPENAI_API_KEY'] = 'test-openai-key'
process.env['OPENAI_MODEL'] = 'gpt-4'
process.env['CORS_ORIGIN'] = 'http://localhost:5173'

// Global test timeout
jest.setTimeout(10000)

// Mock console methods to reduce noise in tests
const originalConsoleLog = console.log
const originalConsoleWarn = console.warn
const originalConsoleError = console.error

beforeAll(() => {
  console.log = jest.fn()
  console.warn = jest.fn()
  console.error = jest.fn()
})

afterAll(() => {
  console.log = originalConsoleLog
  console.warn = originalConsoleWarn
  console.error = originalConsoleError
})

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks()
}) 