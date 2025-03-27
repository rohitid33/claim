import { createServer } from 'http';
import express, { type Express } from 'express';
import { createApp, startServer } from './config/server-config';
import { connectToMongoDB, closeMongoDB } from './db/mongodb-connection';
import { registerRoutes } from './routes';
import { setupVite, serveStatic } from './vite';
import { env, validateEnv } from './config/env';
import { setupWebSocketServer } from './websocket';
import { WebSocketServer } from 'ws';

let wss: WebSocketServer;

async function shutdown() {
  console.log('Shutting down server...');
  if (wss) {
    wss.close();
  }
  await closeMongoDB();
  process.exit(0);
}

async function bootstrap() {
  try {
    // Validate environment variables
    validateEnv();
    
    // Connect to MongoDB database
    await connectToMongoDB();
    
    // Create and configure Express app with basic middleware
    const app = createApp() as Express;
    
    // Create HTTP server
    const server = createServer(app);
    
    // Set up WebSocket server
    const wsServer = setupWebSocketServer(server);
    wss = wsServer.wss;
    
    // Add broadcastNotification to app locals for use in routes
    app.locals.broadcastNotification = wsServer.broadcastNotification;
    
    // Register all API routes
    await registerRoutes(app);
    
    // In development mode, use Vite to serve the client app
    if (!env.isProduction) {
      console.log('Setting up Vite middleware for development mode...');
      await setupVite(app, server);
    } else {
      // In production, serve the static files
      console.log('Serving static files in production mode...');
      serveStatic(app);
    }
    
    // Start server with dynamic port handling
    const PORT = env.server.port;
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Visit http://${env.server.host}:${PORT} in your browser`);
    });
    
    // Handle graceful shutdown
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the application
bootstrap().catch(err => {
  console.error('Unhandled error during bootstrap:', err);
  process.exit(1);
});