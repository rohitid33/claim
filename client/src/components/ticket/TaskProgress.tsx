import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Task } from '@/hooks/use-ticket-tasks';
import { CheckIcon, Clock, CircleEllipsis, Check } from 'lucide-react';

interface TaskProgressProps {
  tasks: Task[];
}

export function TaskProgress({ tasks }: TaskProgressProps) {
  if (!tasks || tasks.length === 0) {
    return null;
  }

  // Calculate completion percentage
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in_progress').length;
  const pendingTasks = tasks.filter(task => task.status === 'pending').length;
  
  const completionPercentage = Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Task Progress</h3>
        <span className="text-sm font-medium">{completionPercentage}% Complete</span>
      </div>
      
      <Progress value={completionPercentage} className="h-2" />
      
      <div className="flex justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Check className="h-3 w-3 text-green-500" />
          <span>{completedTasks} Completed</span>
        </div>
        <div className="flex items-center gap-1">
          <CircleEllipsis className="h-3 w-3 text-blue-500" />
          <span>{inProgressTasks} In Progress</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3 text-gray-500" />
          <span>{pendingTasks} Pending</span>
        </div>
      </div>
    </div>
  );
}