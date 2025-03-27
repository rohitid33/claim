import React, { useState, useEffect } from 'react';
// Try importing from another location where it might already be available
import { useParams, useNavigate } from '../../../routes/RouterUtils';
import { useAdminAuth } from '../../../hooks/use-admin-auth';
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Badge } from "../../ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../../ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
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
import { Separator } from "../../ui/separator";
import TaskList from './TaskList';
import TaskForm from './TaskForm';

// Define types
interface Ticket {
  id: string;
  title: string;
  description: string;
  serviceId: string;
  serviceName: string;
  userId: string;
  status: 'new' | 'processing' | 'completed' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface TicketDetailProps {
  ticketIdProp?: string;
}

const TicketDetail: React.FC<TicketDetailProps> = ({ ticketIdProp }) => {
  const { id: urlId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdminAuthenticated } = useAdminAuth();
  
  // Use the ID from props if available, otherwise fall back to URL params
  const id = ticketIdProp || urlId;
  
  console.log("Ticket ID being used:", id);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showTaskForm, setShowTaskForm] = useState<boolean>(false);
  
  // Reference to force refresh task list
  const [taskListKey, setTaskListKey] = useState<number>(0);

  // Function to refresh the task list
  const refreshTaskList = () => {
    setTaskListKey(prev => prev + 1);
  };
  
  // Form data for editing
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    status: string;
    priority: string;
  }>({
    title: '',
    description: '',
    status: '',
    priority: ''
  });

  // Fetch ticket details
  const fetchTicketDetails = async () => {
    if (!id) {
      console.error("No ticket ID provided");
      setError("No ticket ID provided");
      setLoading(false);
      return;
    }
    
    if (!isAdminAuthenticated) {
      console.error("Not authenticated as admin");
      setError("Admin authentication required to view ticket details");
      setLoading(false);
      return;
    }
    
    console.log("Fetching ticket details for ID:", id);
    setLoading(true);
    
    try {
      // Get admin token from localStorage
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        throw new Error('Admin authentication required. Please log in again.');
      }
      
      const url = `/api/admin/tickets/${id}`;
      console.log("Fetching from URL:", url);
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        }
      });
      console.log("Response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        
        // Handle authentication errors specifically
        if (response.status === 401) {
          localStorage.removeItem('adminToken'); // Clear invalid token
          throw new Error("Authentication expired. Please log in again.");
        }
        
        throw new Error(`Failed to fetch ticket details: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Ticket data received:", data);
      
      if (!data.ticket) {
        throw new Error("Ticket data not found in response");
      }
      
      setTicket(data.ticket);
      setUser(data.user);
      
      // Initialize form data for editing
      setFormData({
        title: data.ticket.title || '',
        description: data.ticket.description || '',
        status: data.ticket.status || 'new',
        priority: data.ticket.priority || 'medium'
      });
    } catch (err) {
      console.error("Error fetching ticket details:", err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id && isAdminAuthenticated) {
      fetchTicketDetails();
    }
  }, [id, isAdminAuthenticated]);

  // Handle form input changes
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

  // Save ticket changes
  const handleSave = async () => {
    setSaving(true);
    try {
      // Get admin token from localStorage
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        throw new Error('Admin authentication required. Please log in again.');
      }
      
      const response = await fetch(`/api/admin/tickets/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        // Handle authentication errors specifically
        if (response.status === 401) {
          localStorage.removeItem('adminToken'); // Clear invalid token
          throw new Error("Authentication expired. Please log in again.");
        }
        
        throw new Error('Failed to update ticket');
      }
      
      const updatedTicket = await response.json();
      setTicket(updatedTicket);
      setIsEditing(false);
      
      // Show success message or notification
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while saving');
    } finally {
      setSaving(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    // Reset form data to original ticket data
    if (ticket) {
      setFormData({
        title: ticket.title || '',
        description: ticket.description || '',
        status: ticket.status || 'new',
        priority: ticket.priority || 'medium'
      });
    }
    setIsEditing(false);
  };

  // Delete ticket
  const handleDelete = async () => {
    try {
      // Get admin token from localStorage
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        throw new Error('Admin authentication required. Please log in again.');
      }
      
      const response = await fetch(`/api/admin/tickets/${id}`, {
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
        
        throw new Error('Failed to delete ticket');
      }
      
      // Navigate back to ticket list
      navigate('/admin-dashboard/tickets');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while deleting');
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-blue-100 text-blue-800">New</Badge>;
      case 'processing':
        return <Badge className="bg-yellow-100 text-yellow-800">Processing</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Get priority badge
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'low':
        return <Badge className="bg-gray-100 text-gray-800">Low</Badge>;
      case 'medium':
        return <Badge className="bg-blue-100 text-blue-800">Medium</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800">High</Badge>;
      case 'urgent':
        return <Badge className="bg-red-100 text-red-800">Urgent</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  if (loading) {
    return <div className="container mx-auto py-6 text-center">Loading ticket details...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-6">
          Error: {error}
        </div>
        <Button onClick={() => navigate('/admin-dashboard/tickets')}>Back to Tickets</Button>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="container mx-auto py-6">
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg mb-6">
          Ticket not found
        </div>
        <Button onClick={() => navigate('/admin-dashboard/tickets')}>Back to Tickets</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin-dashboard/tickets')}
            className="mb-2"
          >
            ← Back to Tickets
          </Button>
          <h1 className="text-2xl font-bold">
            Ticket Details {isEditing && "(Editing)"}
          </h1>
        </div>
        
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button 
                variant="outline" 
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(true)}
              >
                Edit Ticket
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Delete Ticket</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the ticket
                      and all associated tasks.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>
      </div>

      <Tabs defaultValue="details">
        <TabsList className="mb-4">
          <TabsTrigger value="details">Ticket Information</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>
        
        {/* Ticket Details Tab */}
        <TabsContent value="details">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Ticket Info Card */}
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Ticket Information</CardTitle>
                <CardDescription>
                  Created: {formatDate(ticket.createdAt)} | 
                  Last Updated: {formatDate(ticket.updatedAt)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Title</label>
                      <Input
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <Textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={5}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                              <SelectItem value="new">New</SelectItem>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Priority</label>
                        <Select 
                          value={formData.priority} 
                          onValueChange={(value) => handleSelectChange('priority', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="urgent">Urgent</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Status</h3>
                        <div className="mt-1">{getStatusBadge(ticket.status)}</div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Priority</h3>
                        <div className="mt-1">{getPriorityBadge(ticket.priority)}</div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Service</h3>
                        <div className="mt-1">{ticket.serviceName}</div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Title</h3>
                      <div className="mt-1 text-lg font-medium">{ticket.title}</div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Description</h3>
                      <div className="mt-1 whitespace-pre-line">{ticket.description}</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* User Info Card */}
            <Card>
              <CardHeader>
                <CardTitle>User Information</CardTitle>
              </CardHeader>
              <CardContent>
                {user ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Name</h3>
                      <div className="mt-1">{user.firstName} {user.lastName}</div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Username</h3>
                      <div className="mt-1">{user.username}</div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Email</h3>
                      <div className="mt-1">
                        <a href={`mailto:${user.email}`} className="text-blue-600 hover:underline">
                          {user.email}
                        </a>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full" onClick={() => window.open(`/admin/users/${user.id}`, '_blank')}>
                      View User Profile
                    </Button>
                  </div>
                ) : (
                  <div className="text-gray-500">User information not available</div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Tasks Tab */}
        <TabsContent value="tasks">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Tasks</h2>
              
              <Dialog open={showTaskForm} onOpenChange={setShowTaskForm}>
                <DialogTrigger asChild>
                  <Button>Add New Task</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                    <DialogDescription>
                      Add a new task for this ticket.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <TaskForm 
                    ticketId={ticket.id} 
                    onSuccess={() => {
                      setShowTaskForm(false);
                      refreshTaskList();
                    }} 
                  />
                </DialogContent>
              </Dialog>
            </div>
            
            <TaskList ticketId={ticket.id} key={taskListKey} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TicketDetail;