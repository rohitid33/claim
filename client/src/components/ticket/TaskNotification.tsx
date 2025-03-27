import React, { useEffect, useState } from 'react';
import { Bell, X } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from 'wouter';
import { Task } from '@/hooks/use-ticket-tasks';
import { useTaskNotifications } from '@/hooks/use-task-notifications';

interface TaskNotificationProps {
  ticketId: string;
  task: Task;
  onDismiss: () => void;
}

export function TaskNotification({ ticketId, task, onDismiss }: TaskNotificationProps) {
  const [, navigate] = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const { markTaskSeen } = useTaskNotifications();

  // Auto-dismiss after 20 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onDismiss, 300); // Wait for animation to finish
    }, 20000);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  const handleViewTask = () => {
    // First mark the task as seen
    markTaskSeen(task.id);
    // Then navigate and dismiss
    setTimeout(() => {
      navigate(`/ticket/${ticketId}`);
      onDismiss();
    }, 100); // Small delay to ensure state updates
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 300);
  };

  // Get status color
  const getStatusColor = () => {
    switch (task.status) {
      case 'pending': return 'bg-blue-100 text-blue-600';
      case 'in_progress': return 'bg-orange-100 text-orange-600';
      case 'completed': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  // Get due date indicator
  const getDueDateDisplay = () => {
    const now = new Date();
    const dueDate = new Date(task.dueDate);
    const timeDiff = dueDate.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    if (daysDiff < 0) {
      return <span className="text-red-600 font-medium">Overdue: {dueDate.toLocaleDateString()}</span>;
    } else if (daysDiff === 0) {
      return <span className="text-red-600 font-medium">Due today</span>;
    } else if (daysDiff === 1) {
      return <span className="text-orange-600 font-medium">Due tomorrow</span>;
    } else if (daysDiff <= 3) {
      return <span className="text-orange-600 font-medium">Due in {daysDiff} days</span>;
    } else {
      return <span>Due: {dueDate.toLocaleDateString()}</span>;
    }
  };

  return (
    <div 
      className={`fixed bottom-4 right-4 transition-all duration-300 ease-in-out z-50 max-w-sm w-full 
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}
    >
      <Card className="shadow-lg p-4 bg-white border-blue-200 border-2">
        <div className="flex items-start gap-4">
          <div className={`${getStatusColor()} p-2 rounded-full`}>
            <Bell className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">New Task for Your Ticket</h3>
            <p className="text-sm text-gray-600 mb-1">
              {task.title}
            </p>
            <p className="text-xs text-gray-500 mb-3">
              {getDueDateDisplay()}
            </p>
            <div className="flex justify-end gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleDismiss}
                className="text-gray-500 h-8 px-2"
              >
                Dismiss
              </Button>
              <Button 
                size="sm" 
                className="h-8" 
                onClick={handleViewTask}
              >
                View Task
              </Button>
            </div>
          </div>
          <button 
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-500"
          >
            <X size={18} />
          </button>
        </div>
      </Card>
    </div>
  );
}