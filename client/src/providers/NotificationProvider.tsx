import React, { ReactNode } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useTickets } from '@/hooks/use-tickets';
import { useState, useEffect } from 'react';

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { tickets } = useTickets();

  // WebSocket connection for real-time notifications
  useEffect(() => {
    if (!user?.id) {
      console.log('No authenticated user, skipping WebSocket connection');
      return;
    }

    let reconnectTimeout: NodeJS.Timeout;
    const maxRetries = 3;
    let retryCount = 0;

    const connectWebSocket = () => {
      const ws = new WebSocket(`${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws/notifications/${user.id}`);

      ws.onopen = () => {
        console.log('WebSocket connection established');
        retryCount = 0;
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          // Handle different types of notifications
          if (data.type === 'TICKET_UPDATE') {
            // Handle ticket update notification
          } else if (data.type === 'NEW_MESSAGE') {
            // Handle new message notification
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket connection closed');
        if (retryCount < maxRetries) {
          retryCount++;
          reconnectTimeout = setTimeout(connectWebSocket, 5000 * retryCount);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      return ws;
    };

    const ws = connectWebSocket();

    return () => {
      clearTimeout(reconnectTimeout);
      ws.close();
    };
  }, [user?.id]);

  return <>{children}</>;
} 