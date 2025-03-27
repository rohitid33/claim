import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../../hooks/use-admin-auth';
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../../ui/select";

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

// Define Ticket type
interface Ticket {
  id: string;
  title: string;
  description: string;
  userId: string; // ID of the user who created the ticket
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
}

interface TaskFormProps {
  ticketId: string;
  task?: Task;
  onSuccess: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ ticketId, task, onSuccess }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [ticketDetails, setTicketDetails] = useState<Ticket | null>(null);
  const { isAdminAuthenticated } = useAdminAuth();
  
  // Form data
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || 'pending',
    dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
  });

  // Fetch ticket details to get the user ID
  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        if (!isAdminAuthenticated) {
          console.error('Admin authentication required');
          return;
        }
        
        // Get admin token from localStorage
        const adminToken = localStorage.getItem('adminToken');
        if (!adminToken) {
          console.error('Admin token not found');
          return;
        }
        
        const response = await fetch(`/api/admin/tickets/${ticketId}`, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${adminToken}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data && data.ticket) {
            setTicketDetails(data.ticket);
            console.log('Ticket details fetched:', data.ticket);
          }
        } else {
          console.error('Failed to fetch ticket details:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching ticket details:', error);
      }
    };

    if (ticketId && !task && isAdminAuthenticated) {
      fetchTicketDetails();
    }
  }, [ticketId, task, isAdminAuthenticated]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    if (!formData.dueDate) {
      setError('Due date is required');
      return;
    }
    
    if (!isAdminAuthenticated) {
      setError('Admin authentication required');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Get admin token from localStorage
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        throw new Error('Admin authentication required. Please log in again.');
      }
      
      const url = task 
        ? `/api/admin/tasks/${task.id}` 
        : `/api/admin/tickets/${ticketId}/tasks`;
      
      const method = task ? 'PUT' : 'POST';
      
      // Set up data to send
      let dataToSend;
      if (task) {
        // For editing, only send the fields we want to update
        dataToSend = {
          title: formData.title,
          description: formData.description || task.description || "",
          status: formData.status || task.status,
          // Keep the original assignee when editing
          assigneeId: task.assigneeId,
          // Include the due date
          dueDate: new Date(formData.dueDate).toISOString()
        };
      } else {
        // For new tasks, we need to include all required fields
        // Check if we have the ticket details with the user ID
        if (!ticketDetails || !ticketDetails.userId) {
          setError('Could not determine the ticket creator. Please try again later.');
          setLoading(false);
          return;
        }
        
        dataToSend = {
          title: formData.title,
          description: formData.description || "",
          status: formData.status || "pending",
          ticketId: ticketId,
          // Use the ticket creator's ID as the assignee
          assigneeId: ticketDetails.userId,
          // Include the due date
          dueDate: new Date(formData.dueDate).toISOString()
        };
      }
      
      // Log data for debugging
      console.log('Sending task data:', {
        url,
        method,
        data: dataToSend
      });
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(dataToSend)
      });
      
      if (!response.ok) {
        // Handle authentication errors specifically
        if (response.status === 401) {
          localStorage.removeItem('adminToken'); // Clear invalid token
          throw new Error("Authentication expired. Please log in again.");
        }
        
        // Try to get more detailed error information
        let errorMessage = `Failed to save task: ${response.status} ${response.statusText}`;
        
        try {
          // Try to parse as JSON first
          const errorData = await response.json();
          console.error('Task save error (JSON):', errorData);
          if (errorData.message) {
            errorMessage = `Server error: ${errorData.message}`;
          } else if (errorData.error) {
            errorMessage = `Server error: ${errorData.error}`;
          }
        } catch (jsonError) {
          // If not JSON, try to get text
          try {
            const errorText = await response.text();
            console.error('Task save error (Text):', errorText);
            if (errorText) {
              errorMessage = `Server error: ${errorText}`;
            }
          } catch (textError) {
            console.error('Could not parse error response');
          }
        }
        
        throw new Error(errorMessage);
      }
      
      // Call success callback
      onSuccess();
      
    } catch (err) {
      console.error("Error saving task:", err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-100 text-red-800 p-3 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium mb-1">Title *</label>
        <Input
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Enter task title"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <Textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Enter task description"
          rows={3}
        />
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <Select 
            value={formData.status} 
            onValueChange={(value) => handleSelectChange('status', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Due Date *</label>
          <Input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleInputChange}
            required
            min={new Date().toISOString().split('T')[0]} // Set minimum date to today
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;