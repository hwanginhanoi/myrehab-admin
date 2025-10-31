/**
 * Environment variable configuration and validation
 *
 * This file provides type-safe access to environment variables.
 * Add new environment variables here to ensure type safety across the app.
 */

export const env = {
  /**
   * Backend API URL for API proxy
   * @default "http://localhost:8080"
   */
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",

  /**
   * Node environment
   */
  nodeEnv: process.env.NODE_ENV || "development",

  /**
   * Check if running in production
   */
  isProd: process.env.NODE_ENV === "production",

  /**
   * Check if running in development
   */
  isDev: process.env.NODE_ENV === "development",
} as const;

// Type for environment variables
export type Env = typeof env;
