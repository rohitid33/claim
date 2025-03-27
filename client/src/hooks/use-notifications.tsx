import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task } from './use-ticket-tasks';
import { useTickets } from './use-tickets';
import { useAuth } from './use-auth';
import { TaskNotification } from '../components/ticket/TaskNotification';

export interface TaskNotificationContextType {
  markTaskSeen: (taskId: string) => void;
  hasUnseenTasks: boolean;
  unseenTasksCount: number;
}

export const TaskNotificationContext = createContext<TaskNotificationContextType | undefined>(undefined);

// Function to get seen task IDs from localStorage
const getStoredSeenTaskIds = (): Set<string> => {
  try {
    const stored = localStorage.getItem('seenTaskIds');
    if (stored) {
      return new Set(JSON.parse(stored));
    }
  } catch (error) {
    console.error('Error reading seen tasks from localStorage:', error);
  }
  return new Set();
};

// Function to store seen task IDs in localStorage
const storeSeenTaskIds = (ids: Set<string>) => {
  try {
    localStorage.setItem('seenTaskIds', JSON.stringify(Array.from(ids)));
  } catch (error) {
    console.error('Error storing seen tasks in localStorage:', error);
  }
};

export function TaskNotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { tickets } = useTickets();
  const [seenTaskIds, setSeenTaskIds] = useState<Set<string>>(() => getStoredSeenTaskIds());
  const [latestTasks, setLatestTasks] = useState<Record<string, Task[]>>({});
  const [currentNotification, setCurrentNotification] = useState<{ticketId: string, task: Task} | null>(null);
  const [hasShownNotificationsThisSession, setHasShownNotificationsThisSession] = useState(false);
  
  // Fetch tasks for all user tickets
  useEffect(() => {
    if (!user || !tickets.length) return;
    
    const fetchTasksForTickets = async () => {
      const fetchedTasks: Record<string, Task[]> = {};
      
      for (const ticket of tickets) {
        try {
          const response = await fetch(`/api/tickets/${ticket.id}/tasks`);
          if (response.ok) {
            const tasks = await response.json();
            fetchedTasks[ticket.id] = tasks;
          }
        } catch (error) {
          console.error(`Error fetching tasks for ticket ${ticket.id}:`, error);
        }
      }
      
      setLatestTasks(fetchedTasks);
    };
    
    fetchTasksForTickets();
    
    // Set up polling to check for new tasks every 2 minutes
    const intervalId = setInterval(fetchTasksForTickets, 2 * 60 * 1000);
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
  
  // Update localStorage when seenTaskIds changes
  useEffect(() => {
    storeSeenTaskIds(seenTaskIds);
  }, [seenTaskIds]);
  
  // Mark a task as seen
  const markTaskSeen = (taskId: string) => {
    setSeenTaskIds(prev => {
      const updatedSet = new Set(prev);
      updatedSet.add(taskId);
      return updatedSet;
    });
    
    // Clear the current notification if it's the task that was marked as seen
    if (currentNotification && currentNotification.task.id === taskId) {
      setCurrentNotification(null);
    }
  };
  
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
  
  // Handle notification dismissal
  const handleDismissNotification = () => {
    if (currentNotification) {
      markTaskSeen(currentNotification.task.id);
      setCurrentNotification(null);
    }
  };
  
  return (
    <TaskNotificationContext.Provider
      value={{
        markTaskSeen,
        hasUnseenTasks,
        unseenTasksCount
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