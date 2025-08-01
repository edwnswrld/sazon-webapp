import { isDevelopment } from '../config/index.js'

/**
 * Simple logging utility for the Sazon AI backend
 * Provides consistent logging with different levels and development/production modes
 */
export class SazonLogger {
  private static formatMessage(level: string, message: string, data?: any): string {
    const timestamp = new Date().toISOString()
    const baseMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`
    
    if (data && isDevelopment()) {
      return `${baseMessage} ${JSON.stringify(data, null, 2)}`
    }
    
    return baseMessage
  }

  /**
   * Log an info message
   */
  static info(message: string, data?: any): void {
    console.log(this.formatMessage('info', message, data))
  }

  /**
   * Log a warning message
   */
  static warn(message: string, data?: any): void {
    console.warn(this.formatMessage('warn', message, data))
  }

  /**
   * Log an error message
   */
  static error(message: string, error?: Error | any): void {
    console.error(this.formatMessage('error', message, error))
  }

  /**
   * Log a debug message (only in development)
   */
  static debug(message: string, data?: any): void {
    if (isDevelopment()) {
      console.debug(this.formatMessage('debug', message, data))
    }
  }

  /**
   * Log API request details
   */
  static request(method: string, url: string, statusCode: number, duration: number): void {
    const level = statusCode >= 400 ? 'warn' : 'info'
    const message = `${method} ${url} - ${statusCode} - ${duration}ms`
    this[level](message)
  }
} 