import express, { Application } from 'express';
import http from 'http';
import { AddressInfo } from 'net';
import session from 'express-session';
import { env } from './env';

/**
 * Server configuration with dynamic port handling
 * This helps resolve EADDRINUSE errors by trying alternative ports
 */
export class ServerConfig {
  private app: Application;
  private server: http.Server | null = null;
  private startPort: number;
  private maxPortAttempts: number;

  constructor(app: Application, startPort: number = 3000, maxPortAttempts: number = 10) {
    this.app = app;
    this.startPort = startPort;
    this.maxPortAttempts = maxPortAttempts;
  }

  /**
   * Start the server with dynamic port selection
   * If the initial port is busy, it will try the next port up to maxPortAttempts
   */
  public start(): Promise<number> {
    return new Promise((resolve, reject) => {
      this.tryPort(this.startPort, 0, resolve, reject);
    });
  }

  /**
   * Recursively try ports until one works or we run out of attempts
   */
  private tryPort(
    port: number, 
    attempt: number, 
    resolve: (port: number) => void, 
    reject: (error: Error) => void
  ): void {
    if (attempt >= this.maxPortAttempts) {
      reject(new Error(`Could not find an available port after ${this.maxPortAttempts} attempts`));
      return;
    }

    this.server = this.app.listen(port)
      .on('listening', () => {
        const address = this.server?.address() as AddressInfo;
        console.log(`Server started successfully on port ${address.port}`);
        resolve(port);
      })
      .on('error', (err: NodeJS.ErrnoException) => {
        if (err.code === 'EADDRINUSE') {
          console.log(`Port ${port} is already in use, trying port ${port + 1}...`);
          this.tryPort(port + 1, attempt + 1, resolve, reject);
        } else {
          reject(err);
        }
      });
  }

  /**
   * Stop the server
   */
  public stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.server) {
        resolve();
        return;
      }

      this.server.close((err) => {
        if (err) {
          reject(err);
        } else {
          this.server = null;
          resolve();
        }
      });
    });
  }
}

/**
 * Create and configure the Express application
 */
export function createApp(): Application {
  const app = express();
  
  // Configure basic middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // Enable CORS for development
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });
  
  // Add basic health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
  });
  
  // Serve static assets in production
  if (process.env.NODE_ENV === 'production') {
    // Serve static files from the React app build directory
    app.use(express.static('dist'));
  }
  
  // Configure session middleware
  app.use(session({
    secret: env.auth.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: env.isProduction,
      httpOnly: true,
      maxAge: env.auth.sessionDuration
    }
  }));
  
  return app;
}

/**
 * Helper function to start the server with environment-aware port configuration
 */
export async function startServer(app: Application): Promise<number> {
  const startPort = parseInt(process.env.PORT || '3000', 10);
  const serverConfig = new ServerConfig(app, startPort);
  return await serverConfig.start();
}