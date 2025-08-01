import dotenv from 'dotenv'
import { SazonBackendConfig } from '../types/index.js'

// Load environment variables
dotenv.config()

// Validate required environment variables
const requiredEnvVars = [
  'OPENAI_API_KEY',
  'SUPABASE_URL',
  'SUPABASE_SERVICE_KEY'
] as const

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`)
  }
}

// Configuration object with type safety
export const sazonBackendConfig: SazonBackendConfig = {
  port: parseInt(process.env['PORT'] || '3001', 10),
  nodeEnv: process.env['NODE_ENV'] || 'development',
  openaiApiKey: process.env['OPENAI_API_KEY']!,
  openaiModel: process.env['OPENAI_MODEL'] || 'gpt-4',
  supabaseUrl: process.env['SUPABASE_URL']!,
  supabaseServiceKey: process.env['SUPABASE_SERVICE_KEY']!,
  corsOrigin: process.env['CORS_ORIGIN'] || 'http://localhost:5173'
}

// Helper function to check if we're in development mode
export const isDevelopment = (): boolean => {
  return sazonBackendConfig.nodeEnv === 'development'
}

// Helper function to check if we're in production mode
export const isProduction = (): boolean => {
  return sazonBackendConfig.nodeEnv === 'production'
} 