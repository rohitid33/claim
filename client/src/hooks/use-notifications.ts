import { useEffect } from 'react';
import { useAuth } from './use-auth';
import { useNotificationStore } from '@/stores/notification-store';
import { useToastStore } from '@/stores/toast-notification-store';

export function useNotifications() {
  const { user } = useAuth();
  const { addNotification } = useNotificationStore();
  const { addToast } = useToastStore();

  useEffect(() => {
    if (!user?.id) {
      console.log('No authenticated user, skipping WebSocket connection');
      return;
    }

    let reconnectTimeout: NodeJS.Timeout;
    const maxRetries = 3;
    let retryCount = 0;

    function connect() {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/api/notifications`;
      console.log(`Attempting WebSocket connection (attempt ${retryCount + 1}/${maxRetries}):`, wsUrl);
      
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('WebSocket connection established');
        console.log('WebSocket URL:', wsUrl);
        console.log('WebSocket state:', ws.readyState);
        console.log('Connection protocol:', ws.protocol);
        retryCount = 0; // Reset retry count on successful connection
      };

      ws.onmessage = (event) => {
        try {
          console.log('WebSocket message received:', event.data);
          const data = JSON.parse(event.data);
          if (data.type === 'notification') {
            console.log('Processing notification:', data);
            
            // Add to persistent notifications
            addNotification({
              message: data.message,
              type: data.notificationType || 'info',
              taskId: data.taskId,
            });
            
            // Also show as toast
            addToast({
              message: data.message,
              type: data.notificationType || 'info',
              taskId: data.taskId,
            });
          }
        } catch (error) {
          console.error('Error processing notification:', error);
          console.error('Raw message data:', event.data);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        console.log('WebSocket state when error occurred:', ws.readyState);
        console.log('WebSocket URL when error occurred:', wsUrl);
      };

      ws.onclose = (event) => {
        console.log('WebSocket connection closed');
        console.log('Close code:', event.code);
        console.log('Close reason:', event.reason);
        console.log('Clean close:', event.wasClean);
        
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`Reconnecting in 3 seconds... (attempt ${retryCount}/${maxRetries})`);
          reconnectTimeout = setTimeout(connect, 3000);
        } else {
          console.log('Max retry attempts reached');
        }
      };

      return ws;
    }

    const ws = connect();

    // Cleanup on unmount or when user changes
    return () => {
      clearTimeout(reconnectTimeout);
      if (ws.readyState === WebSocket.OPEN) {
        console.log('Cleaning up WebSocket connection');
        ws.close();
      }
    };
  }, [user?.id, addNotification, addToast]); // Changed dependency to user.id
} 