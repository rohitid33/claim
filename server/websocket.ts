import { WebSocket, WebSocketServer } from 'ws';
import { Server } from 'http';
import { parse } from 'url';
import env from './config/env';
import { IncomingMessage } from 'http';

interface AuthenticatedWebSocket extends WebSocket {
  userId?: string;
  isAlive: boolean;
}

interface ExtendedIncomingMessage extends IncomingMessage {
  session?: any;
}

export function setupWebSocketServer(server: Server) {
  console.log('Setting up WebSocket server...');
  const wss = new WebSocketServer({ noServer: true });

  // Handle WebSocket upgrade requests
  server.on('upgrade', (request: ExtendedIncomingMessage, socket, head) => {
    console.log('Upgrade request received:');
    console.log('- URL:', request.url);
    console.log('- Headers:', JSON.stringify(request.headers, null, 2));
    console.log('- Session:', request.session);

    const { pathname } = parse(request.url || '');
    console.log('- Pathname:', pathname);

    if (pathname === '/api/notifications') {
      // Get session ID from cookie
      const cookies = request.headers.cookie?.split(';')
        .map(cookie => cookie.trim())
        .reduce((acc: { [key: string]: string }, cookie) => {
          const [key, value] = cookie.split('=');
          acc[key] = value;
          return acc;
        }, {});

      console.log('Parsed cookies:', cookies);
      const sessionId = cookies?.['connect.sid'];
      console.log('Session ID:', sessionId);

      if (!sessionId) {
        console.log('No session ID found, rejecting connection');
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        return;
      }

      // Additional session validation could be added here
      // For example, verify the session in your session store

      wss.handleUpgrade(request, socket, head, (ws) => {
        console.log('Upgrade successful, establishing WebSocket connection');
        const authenticatedWs = ws as AuthenticatedWebSocket;
        authenticatedWs.isAlive = true;
        
        // You could store the user ID from the session here
        if (request.session?.userId) {
          authenticatedWs.userId = request.session.userId;
          console.log('Associated WebSocket with user:', authenticatedWs.userId);
        }
        
        wss.emit('connection', authenticatedWs, request);
      });
    } else {
      console.log('Invalid pathname, ignoring upgrade request');
      socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
      socket.destroy();
    }
  });

  // Set up connection handling
  wss.on('connection', (ws: AuthenticatedWebSocket) => {
    console.log('New client connected');
    console.log('Total connected clients:', wss.clients.size);
    if (ws.userId) {
      console.log('Authenticated user connected:', ws.userId);
    }

    // Set up ping-pong for connection health check
    ws.on('pong', () => {
      console.log('Received pong from client');
      ws.isAlive = true;
    });

    // Handle client messages
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('Received message from client:', data);
      } catch (error) {
        console.error('Error processing message:', error);
        console.error('Raw message:', message.toString());
      }
    });

    // Handle client disconnection
    ws.on('close', (code, reason) => {
      console.log('Client disconnected');
      console.log('Close code:', code);
      console.log('Close reason:', reason.toString());
      console.log('Remaining connected clients:', wss.clients.size);
      if (ws.userId) {
        console.log('User disconnected:', ws.userId);
      }
    });
  });

  // Set up periodic health checks
  const interval = setInterval(() => {
    console.log('Running health check. Connected clients:', wss.clients.size);
    wss.clients.forEach((ws) => {
      const client = ws as AuthenticatedWebSocket;
      if (client.isAlive === false) {
        console.log('Terminating inactive client');
        return client.terminate();
      }
      client.isAlive = false;
      client.ping();
      console.log('Sent ping to client');
    });
  }, 30000);

  wss.on('close', () => {
    console.log('WebSocket server closing');
    clearInterval(interval);
  });

  // Helper function to broadcast notifications
  function broadcastNotification(notification: {
    type: 'notification';
    message: string;
    notificationType: 'info' | 'success' | 'warning' | 'error';
    taskId?: string;
  }) {
    console.log('Broadcasting notification:', notification);
    console.log('Number of connected clients:', wss.clients.size);
    
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        console.log('Sending notification to client');
        client.send(JSON.stringify(notification));
      } else {
        console.log('Client not ready, state:', client.readyState);
      }
    });
  }

  return {
    wss,
    broadcastNotification,
  };
} 