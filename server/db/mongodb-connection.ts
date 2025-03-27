import mongoose from 'mongoose';
import { env, validateEnv } from '../config/env';

// Configure mongoose
mongoose.set('strictQuery', false);

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    // Validate environment variables before connecting
    validateEnv();
    
    // Connect to MongoDB using the URI from centralized config
    await mongoose.connect(env.database.mongodb.uri);
    console.log('Successfully connected to MongoDB database');
    
    // Log connection info (but not the full connection string for security)
    if (env.isDevelopment) {
      console.log(`Connected to MongoDB in ${env.nodeEnv} mode`);
    }
    
    return mongoose.connection;
  } catch (error) {
    console.error('Error connecting to MongoDB database:', error);
    throw error;
  }
}

// Close MongoDB connection
async function closeMongoDB() {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    return true;
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
    throw error;
  }
}

// Export connection functions
export { connectToMongoDB, closeMongoDB };
export default mongoose;