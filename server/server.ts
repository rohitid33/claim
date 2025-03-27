import { createApp, startServer } from './config/server-config';
import { connectToMongoDB, closeMongoDB } from './db/mongodb-connection';

async function bootstrap() {
  try {
    // Connect to MongoDB database
    await connectToMongoDB();
    
    // Create and configure Express app
    const app = createApp();
    
    // Start server with dynamic port handling
    const port = await startServer(app);
    console.log(`Server is running on port ${port}`);
    
    // Handle graceful shutdown
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
    
    async function shutdown() {
      console.log('Shutting down server...');
      await closeMongoDB();
      process.exit(0);
    }
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the application
bootstrap();