/**
 * Centralized environment configuration
 * This file loads and validates all environment variables used in the application
 */

import dotenv from 'dotenv';
import path from 'path';

// Determine which .env file to load based on NODE_ENV
const envFile = process.env.NODE_ENV 
  ? `.env.${process.env.NODE_ENV}` 
  : '.env.development';

// Load environment variables from the appropriate file
dotenv.config({ 
  path: path.resolve(process.cwd(), envFile)
});

// Environment configuration object
export const env = {
  // Node environment
  nodeEnv: process.env.NODE_ENV || 'development',
  isDevelopment: (process.env.NODE_ENV || 'development') === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
  
  // Server configuration
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
    host: process.env.HOST || 'localhost',
  },
  
  // Database configuration
  database: {
    // MongoDB configuration with hardcoded URI
    mongodb: {
      uri: 'mongodb+srv://claimsutra:y2tmBpzEZHe8DVOl@claimsutra.vtcut.mongodb.net/?retryWrites=true&w=majority&appName=claimsutra',
    },
    // PostgreSQL configuration (if needed)
    postgres: {
      url: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/claimsutra',
      ssl: process.env.NODE_ENV === 'production',
    },
  },
  
  // Authentication configuration
  auth: {
    sessionSecret: process.env.SESSION_SECRET || 'dev-session-secret-replace-in-production',
    jwtSecret: process.env.JWT_SECRET || 'dev-jwt-secret-replace-in-production',
    cookieSecure: process.env.NODE_ENV === 'production',
    sessionDuration: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
  },
  
  // API configuration
  api: {
    // Add any API keys or external service configurations here
  },
};

/**
 * Validate required environment variables
 * In production, this will throw an error if required variables are missing
 * In development, it will log warnings but continue
 */
export function validateEnv(): void {
  const requiredVars = [
    'SESSION_SECRET',
  ];
  
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    const message = `Missing required environment variables: ${missingVars.join(', ')}`;
    
    if (env.isProduction) {
      throw new Error(message);
    } else {
      console.warn(`⚠️  Warning: ${message}`);
      console.warn('Using default values for development. DO NOT use these in production!');
    }
  }
}

// Export the environment configuration
export default env;