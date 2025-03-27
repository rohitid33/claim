import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
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
import { Input } from "../../ui/input";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../../ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../ui/pagination";
import { Badge } from "../../ui/badge";

// Define Ticket type
interface Ticket {
  id: string;
  title: string;
  serviceId: string;
  serviceName: string;
  userId: string;
  status: 'new' | 'processing' | 'completed' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
}

// Define pagination type
interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

const TicketList: React.FC = () => {
  const [, navigate] = useLocation();
  const { isAdminAuthenticated } = useAdminAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Fetch tickets with pagination and filters
  const fetchTickets = async () => {
    setLoading(true);
    setError(null); // Clear previous errors
    
    try {
      console.log("Fetching tickets with pagination:", pagination.page, pagination.limit);
      console.log("Filters:", { status: statusFilter, priority: priorityFilter, search: searchQuery });
      
      // Get admin token from localStorage
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        throw new Error('Admin authentication required. Please log in again.');
      }
      
      // Build query parameters
      const params = new URLSearchParams();
      params.append('page', pagination.page.toString());
      params.append('limit', pagination.limit.toString());
      
      if (statusFilter && statusFilter !== 'all') params.append('status', statusFilter);
      if (priorityFilter && priorityFilter !== 'all') params.append('priority', priorityFilter);
      if (searchQuery) params.append('search', searchQuery);

      const url = `/api/admin/tickets?${params.toString()}`;
      console.log("Request URL:", url);
      
      const response = await fetch(url, {
        credentials: 'include', // Include cookies for authentication
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        }
      });
      
      console.log("Response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        
        let errorMessage = "Failed to fetch tickets";
        try {
          const errorObj = JSON.parse(errorText);
          if (errorObj.message) {
            errorMessage = errorObj.message;
          }
        } catch (parseError) {
          // If parsing fails, use the raw error text if available
          if (errorText) {
            errorMessage = errorText;
          }
        }
        
        // Handle authentication errors specifically
        if (response.status === 401) {
          localStorage.removeItem('adminToken'); // Clear invalid token
          errorMessage = "Authentication expired. Please log in again.";
        }
        
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      console.log("Received data:", data);
      console.log(`Loaded ${data.tickets?.length || 0} tickets`);
      
      setTickets(data.tickets || []);
      setPagination(prev => ({
        ...prev,
        total: data.pagination?.total || 0,
        pages: data.pagination?.pages || 0
      }));
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Load tickets on component mount and filter changes
  useEffect(() => {
    if (isAdminAuthenticated) {
      fetchTickets();
    } else {
      setError("Admin authentication required to view tickets.");
      setLoading(false);
    }
  }, [pagination.page, statusFilter, priorityFilter, searchQuery, isAdminAuthenticated]);

  // Navigate to ticket detail page
  const handleRowClick = (ticketId: string) => {
    navigate(`/admin-dashboard/tickets/${ticketId}`);
  };

  // Apply filters
  const handleFilterChange = () => {
    // Reset to page 1 when applying new filters
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Clear all filters
  const clearFilters = () => {
    setStatusFilter('all');
    setPriorityFilter('all');
    setSearchQuery('');
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">New</Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Processing</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Completed</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get priority badge color
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'low':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Low</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Medium</Badge>;
      case 'high':
        return <Badge variant="outline" className="bg-orange-100 text-orange-800">High</Badge>;
      case 'urgent':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Urgent</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Ticket Management</h1>
      
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="w-[150px]">
          <Select value={statusFilter} onValueChange={(value) => {
            setStatusFilter(value);
            handleFilterChange();
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-[150px]">
          <Select value={priorityFilter} onValueChange={(value) => {
            setPriorityFilter(value);
            handleFilterChange();
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        <Button variant="outline" onClick={clearFilters}>
          Clear Filters
        </Button>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-6">
          Error: {error}
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableCaption>List of all user tickets</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Ticket ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Last Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  Loading tickets...
                </TableCell>
              </TableRow>
            ) : tickets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  No tickets found.
                </TableCell>
              </TableRow>
            ) : (
              tickets.map((ticket) => (
                <TableRow 
                  key={ticket.id} 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleRowClick(ticket.id)}
                >
                  <TableCell className="font-medium">{ticket.id.substring(0, 8)}...</TableCell>
                  <TableCell>{ticket.title}</TableCell>
                  <TableCell>{ticket.serviceName}</TableCell>
                  <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                  <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                  <TableCell>{formatDate(ticket.createdAt)}</TableCell>
                  <TableCell>{formatDate(ticket.updatedAt)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {!loading && pagination.pages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                className={pagination.page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            
            {Array.from({ length: pagination.pages }).map((_, i) => {
              // Only show a few page links to avoid cluttering
              if (
                i === 0 || 
                i === pagination.pages - 1 || 
                (i >= pagination.page - 2 && i <= pagination.page + 2)
              ) {
                return (
                  <PaginationItem key={i}>
                    <PaginationLink
                      onClick={() => setPagination(prev => ({ ...prev, page: i + 1 }))}
                      isActive={pagination.page === i + 1}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                );
              } else if (
                i === 1 && pagination.page > 4 ||
                i === pagination.pages - 2 && pagination.page < pagination.pages - 3
              ) {
                return (
                  <PaginationItem key={i}>
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              }
              return null;
            })}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.pages, prev.page + 1) }))}
                className={pagination.page >= pagination.pages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default TicketList;