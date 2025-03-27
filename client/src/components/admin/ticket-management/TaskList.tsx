import React, { useState, useEffect, useCallback } from 'react';
import { useAdminAuth } from '../../../hooks/use-admin-auth';
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Card } from "../../ui/card";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import TaskForm from './TaskForm';

// Custom SVG icons to replace @radix-ui/react-icons
const DotsHorizontalIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
  </svg>
);

const PencilIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M11.8536 1.14645C11.6583 0.951184 11.3417 0.951184 11.1465 1.14645L3.71455 8.57836C3.62459 8.66832 3.55263 8.77461 3.50251 8.89155L2.04044 12.303C1.9599 12.491 2.00189 12.709 2.14646 12.8536C2.29103 12.9981 2.50905 13.0401 2.69697 12.9596L6.10847 11.4975C6.2254 11.4474 6.3317 11.3754 6.42166 11.2855L13.8536 3.85355C14.0488 3.65829 14.0488 3.34171 13.8536 3.14645L11.8536 1.14645ZM4.42166 9.28547L11.5 2.20711L12.7929 3.5L5.71455 10.5784L4.21924 11.2192L3.78081 10.7808L4.42166 9.28547Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
  </svg>
);

const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H3.5C3.22386 4 3 3.77614 3 3.5ZM3.5 5C3.22386 5 3 5.22386 3 5.5V12.5C3 12.7761 3.22386 13 3.5 13H11.5C11.7761 13 12 12.7761 12 12.5V5.5C12 5.22386 11.7761 5 11.5 5H3.5ZM4 12V6H11V12H4Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
  </svg>
);

// Define Task type
interface Task {
  id: string;
  ticketId: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: string;
  dueDate: string;
  assigneeId: string;
  assigneeName?: string;
  updatedAt: string;
}

interface TaskListProps {
  ticketId: string;
  id?: string;
}

const TaskList: React.FC<TaskListProps> = ({ ticketId, id }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [showEditForm, setShowEditForm] = useState<boolean>(false);
  const { isAdminAuthenticated } = useAdminAuth();
  
  // Check if ticketId is provided
  useEffect(() => {
    if (!ticketId) {
      setError('No ticket ID provided');
      setLoading(false);
    }
  }, [ticketId]);
  
  // Fetch tasks for the ticket
  const fetchTasks = useCallback(async () => {
    if (!ticketId) {
      setError('No ticket ID provided');
      setLoading(false);
      return;
    }
    
    if (!isAdminAuthenticated) {
      setError('Admin authentication required to view tasks');
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      // Get admin token from localStorage
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        throw new Error('Admin authentication required. Please log in again.');
      }
      
      const response = await fetch(`/api/admin/tickets/${ticketId}/tasks`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        }
      });
      
      if (!response.ok) {
        // Handle authentication errors specifically
        if (response.status === 401) {
          localStorage.removeItem('adminToken'); // Clear invalid token
          throw new Error("Authentication expired. Please log in again.");
        }
        
        throw new Error('Failed to fetch tasks');
      }
      
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [ticketId, isAdminAuthenticated]);

  useEffect(() => {
    if (ticketId && isAdminAuthenticated) {
      fetchTasks();
    }
  }, [ticketId, fetchTasks, isAdminAuthenticated]);

  // Delete a task
  const handleDeleteTask = async (taskId: string) => {
    if (!ticketId) {
      setError('No ticket ID provided');
      return;
    }
    
    try {
      // Get admin token from localStorage
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        throw new Error('Admin authentication required. Please log in again.');
      }
      
      const response = await fetch(`/api/admin/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      
      if (!response.ok) {
        // Handle authentication errors specifically
        if (response.status === 401) {
          localStorage.removeItem('adminToken'); // Clear invalid token
          throw new Error("Authentication expired. Please log in again.");
        }
        
        throw new Error('Failed to delete task');
      }
      
      // Remove the deleted task from state
      setTasks(tasks.filter(task => task.id !== taskId));
      
    } catch (err) {
      console.error("Error deleting task:", err);
      setError(err instanceof Error ? err.message : 'Failed to delete task');
    }
  };

  // Quick update task status
  const handleStatusChange = async (taskId: string, newStatus: 'pending' | 'in_progress' | 'completed') => {
    if (!ticketId) {
      setError('No ticket ID provided');
      return;
    }
    
    try {
      // Get admin token from localStorage
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        throw new Error('Admin authentication required. Please log in again.');
      }
      
      const response = await fetch(`/api/admin/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!response.ok) {
        // Handle authentication errors specifically
        if (response.status === 401) {
          localStorage.removeItem('adminToken'); // Clear invalid token
          throw new Error("Authentication expired. Please log in again.");
        }
        
        throw new Error('Failed to update task status');
      }
      
      // Just check if update was successful, don't need to use the returned task
      await response.json();
      
      // Update the task in state
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      ));
      
    } catch (err) {
      console.error("Error updating task status:", err);
      setError(err instanceof Error ? err.message : 'Failed to update task status');
    }
  };

  // Edit a task
  const handleEditClick = (task: Task) => {
    setEditTask(task);
    setShowEditForm(true);
  };

  // Handle successful task update
  const handleTaskUpdate = () => {
    setShowEditForm(false);
    setEditTask(null);
    fetchTasks(); // Refresh the task list
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-gray-100 text-gray-800">Pending</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return <div className="text-center py-6">Loading tasks...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-800 p-4 rounded-lg">
        <p className="font-medium">Error</p>
        <p>{error}</p>
        {error === 'No ticket ID provided' && (
          <p className="mt-2">Please select a valid ticket to view its tasks.</p>
        )}
      </div>
    );
  }

  // Function to handle the delete button click
  const handleDeleteButtonClick = (taskId: string) => {
    const dialogButton = document.getElementById(`delete-dialog-${taskId}`);
    if (dialogButton) {
      dialogButton.click();
    }
  };

  return (
    <div id={id}>
      {tasks.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-gray-500">No tasks have been created for this ticket yet.</p>
          <p className="text-gray-500 mt-2">Use the "Add New Task" button to create a task.</p>
        </Card>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableCaption>List of tasks for this ticket</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.title}</TableCell>
                  <TableCell className="max-w-[300px] truncate">{task.description}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 p-0">
                          {getStatusBadge(task.status)}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleStatusChange(task.id, 'pending')}>
                          Pending
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(task.id, 'in_progress')}>
                          In Progress
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(task.id, 'completed')}>
                          Completed
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => handleEditClick(task)}>
                        <span className="sr-only">Edit</span>
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      
                      <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => handleDeleteButtonClick(task.id)}>
                        <span className="sr-only">Delete</span>
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button id={`delete-dialog-${task.id}`} className="hidden">Delete</button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the task.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteTask(task.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Edit Task Dialog */}
      {editTask && (
        <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
              <DialogDescription>
                Update the task details below.
              </DialogDescription>
            </DialogHeader>
            
            <TaskForm 
              ticketId={ticketId}
              task={editTask}
              onSuccess={handleTaskUpdate}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default TaskList;