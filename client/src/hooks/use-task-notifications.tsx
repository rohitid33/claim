import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task } from './use-ticket-tasks';
import { useTickets } from './use-tickets';
import { useAuth } from './use-auth';
import { TaskNotification } from '../components/ticket/TaskNotification';

export interface TaskNotificationContextType {
  markTaskSeen: (taskId: string) => Promise<void>;
  markTasksSeenBatch: (taskIds: string[]) => Promise<void>;
  hasUnseenTasks: boolean;
  unseenTasksCount: number;
  getUnseenTaskCountForTicket: (ticketId: string) => number;
  isLoading: boolean;
  error: Error | null;
}

export const TaskNotificationContext = createContext<TaskNotificationContextType | undefined>(undefined);

// Function to get seen task IDs from localStorage for a specific user
const getStoredSeenTaskIds = (userId: string): Set<string> => {
  try {
    const stored = localStorage.getItem(`seenTaskIds_${userId}`);
    if (stored) {
      return new Set(JSON.parse(stored));
    }
  } catch (error) {
    console.error('Error reading seen tasks from localStorage:', error);
  }
  return new Set();
};

// Function to store seen task IDs in localStorage for a specific user
const storeSeenTaskIds = (userId: string, ids: Set<string>) => {
  try {
    localStorage.setItem(`seenTaskIds_${userId}`, JSON.stringify(Array.from(ids)));
  } catch (error) {
    console.error('Error storing seen tasks in localStorage:', error);
  }
};

// Function to clear seen task IDs for a user
const clearUserSeenTasks = (userId: string) => {
  try {
    localStorage.removeItem(`seenTaskIds_${userId}`);
  } catch (error) {
    console.error('Error clearing seen tasks from localStorage:', error);
  }
};

export function TaskNotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { tickets } = useTickets();
  const [seenTaskIds, setSeenTaskIds] = useState<Set<string>>(() => 
    user ? getStoredSeenTaskIds(user.id) : new Set()
  );
  const [latestTasks, setLatestTasks] = useState<Record<string, Task[]>>({});
  const [currentNotification, setCurrentNotification] = useState<{ticketId: string, task: Task} | null>(null);
  const [hasShownNotificationsThisSession, setHasShownNotificationsThisSession] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Fetch tasks for all user tickets with error handling
  useEffect(() => {
    if (!user || !tickets.length) return;
    
    const fetchTasksForTickets = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const fetchedTasks: Record<string, Task[]> = {};
        
        for (const ticket of tickets) {
          try {
            const response = await fetch(`/api/tickets/${ticket.id}/tasks`);
            if (!response.ok) {
              throw new Error(`Failed to fetch tasks for ticket ${ticket.id}`);
            }
            const tasks = await response.json();
            fetchedTasks[ticket.id] = tasks;
          } catch (error) {
            console.error(`Error fetching tasks for ticket ${ticket.id}:`, error);
            // Continue with other tickets even if one fails
          }
        }
        
        setLatestTasks(fetchedTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setError(error instanceof Error ? error : new Error('Failed to fetch tasks'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTasksForTickets();
    
    // Set up polling with error handling
    const intervalId = setInterval(() => {
      fetchTasksForTickets().catch(error => {
        console.error('Error in polling interval:', error);
      });
    }, 2 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [user, tickets]);
  
  // Process tasks and check for new ones
  useEffect(() => {
    if (!user || Object.keys(latestTasks).length === 0) return;
    
    // Get all tasks from all tickets
    let allTasks: {ticketId: string, task: Task}[] = [];
    
    Object.entries(latestTasks).forEach(([ticketId, tasks]) => {
      if (Array.isArray(tasks)) {
        tasks.forEach(task => {
          if (task && task.id) {
            allTasks.push({ ticketId, task });
          }
        });
      }
    });
    
    // Filter for unseen tasks (not in seenTaskIds)
    const unseenTasks = allTasks.filter(item => !seenTaskIds.has(item.task.id));
    
    // Only show notifications if:
    // 1. There are unseen tasks
    // 2. We don't already have a notification displayed
    // 3. We haven't shown notifications this session OR we have new tasks since page load
    if (unseenTasks.length > 0 && !currentNotification && !hasShownNotificationsThisSession) {
      // Sort by creation date (newest first) and urgency
      const sortedTasks = [...unseenTasks].sort((a, b) => {
        // Sort by created date (newest first)
        const dateA = new Date(a.task.createdAt).getTime();
        const dateB = new Date(b.task.createdAt).getTime();
        const dateComparison = dateB - dateA;
        if (dateComparison !== 0) return dateComparison;
        
        // If same date, sort by status (pending > in_progress > completed)
        const statusOrder = { 'pending': 3, 'in_progress': 2, 'completed': 1 };
        const statusA = statusOrder[a.task.status] || 0;
        const statusB = statusOrder[b.task.status] || 0;
        return statusB - statusA;
      });
      
      if (sortedTasks.length > 0) {
        setCurrentNotification(sortedTasks[0]);
        setHasShownNotificationsThisSession(true);
      }
    }
  }, [latestTasks, seenTaskIds, currentNotification, hasShownNotificationsThisSession, user]);
  
  // Reset seen tasks when user changes
  useEffect(() => {
    if (user) {
      setSeenTaskIds(getStoredSeenTaskIds(user.id));
    } else {
      setSeenTaskIds(new Set());
    }
  }, [user]);
  
  // Update localStorage when seenTaskIds changes
  useEffect(() => {
    if (user) {
      storeSeenTaskIds(user.id, seenTaskIds);
    }
  }, [seenTaskIds, user]);
  
  // Clear user data on logout
  useEffect(() => {
    if (!user && seenTaskIds.size > 0) {
      setSeenTaskIds(new Set());
    }
  }, [user]);
  
  // Handle notification dismissal - now just closes the notification without marking as seen
  const handleDismissNotification = () => {
    if (currentNotification) {
      setCurrentNotification(null);
    }
  };
  
  // Mark a task as seen - now syncs with both localStorage and database
  const markTaskSeen = async (taskId: string) => {
    if (!user) return;

    try {
      // Sync with database first
      const response = await fetch(`/api/tasks/${taskId}/view`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to sync task view status');
      }

      // Update local state only after successful database sync
      setSeenTaskIds(prev => {
        const updatedSet = new Set(prev);
        updatedSet.add(taskId);
        return updatedSet;
      });
    } catch (error) {
      console.error('Error syncing task view status:', error);
      // No need to revert local state as it wasn't updated yet
      throw error; // Propagate error to caller
    }
  };

  // Add batch processing for multiple tasks
  const markTasksSeenBatch = async (taskIds: string[]) => {
    if (!user || !taskIds.length) return;

    try {
      // Sync with database first
      const response = await fetch('/api/tasks/viewed-status/batch', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ taskIds })
      });

      if (!response.ok) {
        throw new Error('Failed to sync batch task view status');
      }

      // Update local state only after successful database sync
      setSeenTaskIds(prev => {
        const updatedSet = new Set(prev);
        taskIds.forEach(id => updatedSet.add(id));
        return updatedSet;
      });
    } catch (error) {
      console.error('Error syncing batch task view status:', error);
      throw error;
    }
  };

  // Fetch initial viewed status from database
  useEffect(() => {
    if (!user || !Object.keys(latestTasks).length) return;

    const fetchViewedStatus = async () => {
      try {
        const allTaskIds = Object.values(latestTasks)
          .flat()
          .map(task => task?.id)
          .filter(Boolean) as string[];

        const response = await fetch('/api/tasks/viewed-status', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ taskIds: allTaskIds })
        });

        if (!response.ok) {
          throw new Error('Failed to fetch viewed status');
        }

        const { viewedTasks } = await response.json();
        
        // Update local state with database state
        setSeenTaskIds(prev => {
          const updatedSet = new Set(prev);
          Object.entries(viewedTasks).forEach(([taskId, viewed]) => {
            if (viewed) {
              updatedSet.add(taskId);
            }
          });
          return updatedSet;
        });
      } catch (error) {
        console.error('Error fetching viewed status:', error);
      }
    };

    fetchViewedStatus();
  }, [user, latestTasks]);
  
  // Reset session flag when user changes
  useEffect(() => {
    if (user) {
      // Create a unique key for this user session
      const currentUserKey = `notification_session_${user.id}`;
      const sessionId = sessionStorage.getItem(currentUserKey);
      
      if (!sessionId) {
        // New session for this user - generate random session ID and store it
        const newSessionId = Math.random().toString(36).substring(2);
        sessionStorage.setItem(currentUserKey, newSessionId);
        setHasShownNotificationsThisSession(false);
      }
    } else {
      // User logged out or not logged in
      setHasShownNotificationsThisSession(false);
    }
  }, [user]);
  
  // Calculate unseen tasks count
  const allTaskIds = Object.values(latestTasks).flat().map(task => task?.id).filter(Boolean) as string[];
  const unseenTasksCount = allTaskIds.filter(id => id && !seenTaskIds.has(id)).length;
  const hasUnseenTasks = unseenTasksCount > 0;
  
  // Get unseen task count for a specific ticket
  const getUnseenTaskCountForTicket = (ticketId: string): number => {
    const ticketTasks = latestTasks[ticketId] || [];
    return ticketTasks.filter(task => !seenTaskIds.has(task.id)).length;
  };
  
  // Error boundary fallback
  if (error) {
    return (
      <div role="alert" className="text-red-600">
        <p>Error loading notifications: {error.message}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="text-blue-600 underline mt-2"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <TaskNotificationContext.Provider
      value={{
        markTaskSeen,
        markTasksSeenBatch,
        hasUnseenTasks,
        unseenTasksCount,
        getUnseenTaskCountForTicket,
        isLoading,
        error
      }}
    >
      {children}
      {currentNotification && (
        <TaskNotification
          ticketId={currentNotification.ticketId}
          task={currentNotification.task}
          onDismiss={handleDismissNotification}
        />
      )}
    </TaskNotificationContext.Provider>
  );
}

export function useTaskNotifications(): TaskNotificationContextType {
  const context = useContext(TaskNotificationContext);
  if (context === undefined) {
    throw new Error('useTaskNotifications must be used within a TaskNotificationProvider');
  }
  return context;
}