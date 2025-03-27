import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Clock, AlertCircle, ArrowUpDown } from "lucide-react";
import { useTicketTasks, Task } from '@/hooks/use-ticket-tasks';
import { useTaskNotifications } from '@/hooks/use-task-notifications';
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface TaskListProps {
  ticketId: string;
}

type SortField = 'dueDate' | 'createdAt' | 'status' | 'title';
type SortOrder = 'asc' | 'desc';

export function TaskList({ ticketId }: TaskListProps) {
  const { tasks, isLoading, error } = useTicketTasks(ticketId);
  const { markTaskSeen } = useTaskNotifications();
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Mark tasks as seen when they are rendered
  useEffect(() => {
    if (tasks && tasks.length > 0) {
      tasks.forEach(task => {
        markTaskSeen(task.id);
      });
    }
  }, [tasks, markTaskSeen]);

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Get status indicator
  const getStatusIndicator = (task: Task) => {
    switch (task.status) {
      case 'pending':
        return (
          <div className="flex items-center gap-2 text-orange-600">
            <Clock className="h-4 w-4" />
            <span>Pending</span>
          </div>
        );
      case 'in_progress':
        return (
          <div className="flex items-center gap-2 text-blue-600">
            <AlertCircle className="h-4 w-4" />
            <span>In Progress</span>
          </div>
        );
      case 'completed':
        return (
          <div className="flex items-center gap-2 text-green-600">
            <Check className="h-4 w-4" />
            <span>Completed</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 text-gray-600">
            <span>{task.status}</span>
          </div>
        );
    }
  };

  // Get due date indicator with color based on proximity
  const getDueDateIndicator = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const timeDiff = due.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    if (daysDiff < 0) {
      return <span className="text-red-600">{formatDate(dueDate)} (Overdue)</span>;
    } else if (daysDiff <= 3) {
      return <span className="text-orange-600">{formatDate(dueDate)} (Soon)</span>;
    } else {
      return <span className="text-gray-600">{formatDate(dueDate)}</span>;
    }
  };

  // Sort tasks based on selected field and order
  const sortedTasks = [...tasks].sort((a, b) => {
    let comparison = 0;
    
    switch (sortField) {
      case 'dueDate':
        comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        break;
      case 'createdAt':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      case 'status':
        // Define status priority
        const statusPriority = { completed: 3, in_progress: 2, pending: 1 };
        comparison = statusPriority[a.status] - statusPriority[b.status];
        break;
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      default:
        comparison = 0;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[120px] w-full rounded-lg" />
        <Skeleton className="h-[120px] w-full rounded-lg" />
        <Skeleton className="h-[120px] w-full rounded-lg" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="border-2 border-red-300 bg-red-50">
        <CardContent className="pt-6">
          <p className="text-red-700">
            There was a problem loading the tasks for this ticket. Please try refreshing the page.
          </p>
        </CardContent>
      </Card>
    );
  }

  // No tasks state
  if (tasks.length === 0) {
    return (
      <Card className="border-2 border-gray-300">
        <CardContent className="pt-6 pb-6 text-center">
          <p className="text-muted-foreground">
            Welcome to Claimsutra,<br />
            <span className="flex items-center justify-center gap-2">
              <div className="rounded-full bg-blue-600 p-1 flex items-center justify-center">
                <Check className="h-3 w-3 text-white" />
              </div>
              India's No. 1 Platform for All Things Legal.
            </span><br />
            Please wait a moment while our legal expert connects with you shortly.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Tasks for this ticket</h2>
        
        <div className="flex items-center gap-2">
          <Select value={sortField} onValueChange={(value) => setSortField(value as SortField)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="dueDate">Due Date</SelectItem>
                <SelectItem value="createdAt">Created Date</SelectItem>
                <SelectItem value="status">Status</SelectItem>
                <SelectItem value="title">Title</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            className="h-9 w-9"
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {sortedTasks.map((task) => (
        <Card key={task.id} className={`overflow-hidden border-2 shadow-sm ${
          task.status === 'completed' 
            ? 'border-green-400 bg-green-50' 
            : task.status === 'in_progress' 
              ? 'border-blue-400 bg-blue-50/30' 
              : 'border-gray-300'
        }`}>
          <CardHeader className="p-4 pb-0">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">{task.title}</CardTitle>
              <Badge variant={
                task.status === 'completed' 
                  ? 'secondary' 
                  : task.status === 'in_progress' 
                    ? 'default' 
                    : 'outline'
              }>
                {task.status.replace('_', ' ')}
              </Badge>
            </div>
            <CardDescription className="text-sm flex justify-between items-center mt-1">
              <span>Assigned to: {task.assigneeName || 'Customer Support'}</span>
              <span className="font-medium">Due: {getDueDateIndicator(task.dueDate)}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600 mb-3">
              {task.description}
            </p>
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <div>{getStatusIndicator(task)}</div>
              <div>Created: {formatDate(task.createdAt)}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}