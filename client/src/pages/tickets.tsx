import React, { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ChevronRight, 
  Loader2, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  ArrowUp,
  ArrowUpRight,
  ArrowUpDown,
  ArrowDown,
  Bell
} from "lucide-react";
import { useTickets } from "@/hooks/use-tickets";
import { useAuth } from "@/hooks/use-auth";
import { useTaskNotifications } from "@/hooks/use-task-notifications";

export default function Tickets() {
  const [status, setStatus] = useState("ongoing");
  const [, navigate] = useLocation();
  const { tickets, isLoading, error } = useTickets();
  const { user } = useAuth();
  const { getUnseenTaskCountForTicket } = useTaskNotifications();
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState("desc"); // "asc" or "desc"

  // Function to toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "desc" ? "asc" : "desc");
  };

  // Filter tickets based on status tab and search text
  const filteredTickets = !isLoading ? tickets
    .filter(ticket => {
      const matchesSearch = searchText === "" || 
        (ticket.title && ticket.title.toLowerCase().includes(searchText.toLowerCase())) ||
        ticket.serviceName.toLowerCase().includes(searchText.toLowerCase());
      
      if (status === "ongoing") {
        return (ticket.status === "new" || ticket.status === "processing") && matchesSearch;
      } else if (status === "completed") {
        return ticket.status === "completed" && matchesSearch;
      }
      return matchesSearch;
    })
    .map(ticket => ({
      ...ticket,
      description: ticket.description?.replace(/^Request for .* service\./i, '').trim()
    }))
    .sort((a, b) => {
      // Sort by creation date
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      
      // Apply sort order (ascending or descending)
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    }) : [];

  // Count tickets by status
  const ongoingCount = !isLoading ? tickets.filter(ticket => 
    ticket.status === "new" || ticket.status === "processing").length : 0;
  const completedCount = !isLoading ? tickets.filter(ticket => ticket.status === "completed").length : 0;

  // Get status badge with icon
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>New</span>
          </Badge>
        );
      case "processing":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            <span>In Progress</span>
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            <span>Completed</span>
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            <span>Rejected</span>
          </Badge>
        );
      default:
        return (
          <Badge>{status}</Badge>
        );
    }
  };

  // Get priority badge/indicator
  const getPriorityIndicator = (priority: string) => {
    if (!priority) return null;
    
    switch (priority) {
      case "high":
        return (
          <div className="flex items-center text-orange-600 text-sm font-medium">
            <ArrowUp className="h-3 w-3 mr-1" />
            <span>High Priority</span>
          </div>
        );
      case "urgent":
        return (
          <div className="flex items-center text-red-600 text-sm font-medium">
            <ArrowUpRight className="h-3 w-3 mr-1" />
            <span>Urgent</span>
          </div>
        );
      default:
        return null;
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Tickets</h1>
      
      <div className="flex items-center justify-between mb-6 gap-4">
        <div className="flex-1 relative">
          <input
            type="search"
            placeholder="Search tickets..."
            className="w-full p-2 rounded-md border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          onClick={toggleSortOrder}
          className="flex items-center gap-1 min-w-[130px] border border-gray-300 hover:border-primary hover:bg-primary/5 shadow-sm"
        >
          <span>Sort: {sortOrder === "desc" ? "Newest" : "Oldest"}</span>
          {sortOrder === "desc" ? (
            <ArrowDown className="h-4 w-4" />
          ) : (
            <ArrowUp className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="flex space-x-8 border-b border-gray-200 mb-6 overflow-x-auto">
        <button
          onClick={() => setStatus("ongoing")}
          className={`pb-4 px-1 capitalize whitespace-nowrap transition-all ${
            status === "ongoing"
              ? "border-b-3 border-primary font-semibold text-primary"
              : "text-muted-foreground hover:text-gray-700"
          }`}
        >
          Ongoing {ongoingCount > 0 && `(${ongoingCount})`}
        </button>
        <button
          onClick={() => setStatus("completed")}
          className={`pb-4 px-1 capitalize whitespace-nowrap transition-all ${
            status === "completed"
              ? "border-b-3 border-primary font-semibold text-primary"
              : "text-muted-foreground hover:text-gray-700"
          }`}
        >
          Completed {completedCount > 0 && `(${completedCount})`}
        </button>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading your tickets...</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-300 rounded-md p-4 text-center">
          <p className="text-red-700">
            There was a problem loading your tickets. Please try again.
          </p>
          <Button 
            variant="outline" 
            className="mt-2" 
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      )}

      {/* No tickets state */}
      {!isLoading && !error && filteredTickets.length === 0 && (
        <div className="text-center py-12 border border-gray-300 rounded-md">
          <h3 className="text-xl font-medium mb-2">No tickets found</h3>
          {status === "ongoing" ? (
            <p className="text-muted-foreground mb-4">
              You don't have any ongoing tickets. Try adjusting your search or sort criteria.
            </p>
          ) : (
            <p className="text-muted-foreground mb-4">
              You don't have any {status} tickets. Try adjusting your search or sort criteria.
            </p>
          )}
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate("/gogo")}
          >
            Browse Services
          </Button>
        </div>
      )}

      {/* Tickets list */}
      {!isLoading && !error && filteredTickets.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-2 text-sm text-muted-foreground">
            <span>{filteredTickets.length} ticket{filteredTickets.length !== 1 ? 's' : ''} found</span>
            <span className="flex items-center gap-1">
              Sorted by date: {sortOrder === "desc" ? "newest first" : "oldest first"}
            </span>
          </div>
          
          {filteredTickets.map((ticket) => {
            const unseenTaskCount = getUnseenTaskCountForTicket(ticket.id);
            
            return (
              <div key={ticket.id} onClick={() => navigate(`/ticket/${ticket.id}`)} className="block mb-4 transform transition-all duration-200 hover:translate-y-[-2px]">
                <Card className={`cursor-pointer hover:shadow-lg transition-all border ${
                  ticket.priority === 'urgent' ? 'border-red-400' : 
                  ticket.priority === 'high' ? 'border-orange-400' : 
                  'border-gray-300 hover:border-primary/60'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">
                            {ticket.title || ticket.serviceName}
                          </h3>
                          {unseenTaskCount > 0 && (
                            <Badge variant="secondary" className="bg-primary/10 text-primary flex items-center gap-1">
                              <Bell className="h-3 w-3" />
                              {unseenTaskCount} new {unseenTaskCount === 1 ? 'task' : 'tasks'}
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {!ticket.title && ticket.serviceName}
                        </div>
                        <div className="text-sm text-muted-foreground flex gap-3 mt-1">
                          <span>Created: {formatDate(ticket.createdAt)}</span>
                        </div>
                        {ticket.description && (
                          <p className="text-sm mt-2 line-clamp-2">
                            {ticket.description}
                          </p>
                        )}
                      </div>
                      <ChevronRight className="w-5 h-5" />
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex flex-wrap gap-2 items-center">
                        {getStatusBadge(ticket.status)}
                        {getPriorityIndicator(ticket.priority)}
                      </div>
                      <div>
                        {(ticket.status === "new" || ticket.status === "processing") && (
                          <Button size="sm" className="min-w-[110px]">View Details</Button>
                        )}
                        {(ticket.status === "completed" || ticket.status === "rejected") && (
                          <Button size="sm" variant="outline" className="min-w-[110px]">View Details</Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}