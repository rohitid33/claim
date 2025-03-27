import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import { useNotificationStore, type Notification } from '../stores/notification-store';
import { Bell } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '@/lib/utils';

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationStore();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.taskId) {
      setLocation(`/ticket/${notification.taskId}`);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer flex items-center justify-center h-9 w-9 rounded-full bg-primary/10 border border-primary/20"
      >
        <div className="relative flex items-center justify-center">
          <Bell className="h-5 w-5 text-primary" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-green-500 border-2 border-background" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95">
          <div className="flex items-center justify-between border-b px-4 py-2">
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => markAllAsRead()}
                className="text-xs"
              >
                Mark all as read
              </Button>
            )}
          </div>
          <ScrollArea className="h-[calc(100vh-20rem)]">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No notifications
              </div>
            ) : (
              <div className="divide-y">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={cn(
                      "cursor-pointer px-4 py-2 hover:bg-accent",
                      !notification.read && "bg-accent/50"
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <div className="flex-1 space-y-1">
                        <p className={cn(
                          "text-sm",
                          !notification.read && "font-medium"
                        )}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(notification.createdAt, 'MMM d, yyyy h:mm a')}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      )}
    </div>
  );
} 