import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  ChevronRight, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  XCircle 
} from "lucide-react";
import { Link, useParams, useLocation } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskList } from "@/components/ticket/TaskList";
import { TaskProgress } from "@/components/ticket/TaskProgress";
import { DeleteTicketDialog } from "@/components/ticket/DeleteTicketDialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { Ticket, useTickets } from "@/hooks/use-tickets";
import { useTicketTasks } from "@/hooks/use-ticket-tasks";

export default function TicketDetail() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("tasks");
  const { tasks } = useTicketTasks(id);
  const { refetchTickets } = useTickets();
  const queryClient = useQueryClient();

  // Fetch ticket details
  const {
    data: ticket,
    isLoading,
    error,
  } = useQuery<Ticket>({
    queryKey: [`/api/tickets/${id}`],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Redirect to tickets page if error occurs
  useEffect(() => {
    if (error) {
      navigate("/tickets");
    }
  }, [error, navigate]);

  // Format date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  // Get status badge and icon
  const getStatusBadge = (status: string | undefined) => {
    if (!status) return null;
    
    switch (status) {
      case "new":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>New</span>
          </Badge>
        );
      case "processing":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            <span>Processing</span>
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            <span>Completed</span>
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 flex items-center gap-1">
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

  // Get priority badge
  const getPriorityBadge = (priority: string | undefined) => {
    if (!priority) return null;
    
    switch (priority) {
      case "low":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
            Low Priority
          </Badge>
        );
      case "medium":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
            Medium Priority
          </Badge>
        );
      case "high":
        return (
          <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
            High Priority
          </Badge>
        );
      case "urgent":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
            Urgent
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/tickets">
        <button className="text-lg font-semibold flex items-center mb-4">
          <ChevronRight className="w-5 h-5 rotate-180" /> Back to Tickets
        </button>
      </Link>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-[180px] w-full rounded-lg" />
          <Skeleton className="h-[300px] w-full rounded-lg" />
        </div>
      ) : ticket ? (
        <>
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-2xl font-semibold">{ticket.title || ticket.serviceName}</h1>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <div className="flex gap-2">
                      {getStatusBadge(ticket.status)}
                      {getPriorityBadge(ticket.priority)}
                    </div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Created:</span> {formatDate(ticket.createdAt)}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Updated:</span> {formatDate(ticket.updatedAt)}
                  </div>
                </div>
                
                {tasks && tasks.length > 0 && (
                  <div className="mt-4">
                    <TaskProgress tasks={tasks} />
                  </div>
                )}
              </div>

              <Tabs defaultValue="tasks" onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2 mt-4">
                  <TabsTrigger value="tasks">Tasks</TabsTrigger>
                  <TabsTrigger value="whatsapp">WhatsApp Chat</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>

          <div className="mb-8">
            {activeTab === "tasks" && (
              <TaskList ticketId={id!} />
            )}

            {activeTab === "whatsapp" && (
              <Card>
                <CardContent className="p-6">
                  <div className="text-center py-8">
                    <div className="mx-auto h-12 w-12 text-green-500 mb-4">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium mb-2">Chat on WhatsApp</h3>
                    <p className="text-muted-foreground mb-4">
                      Have questions about your ticket? Chat with our support team on WhatsApp for quick assistance.
                    </p>
                    <a
                      href={`https://wa.me/918630959445`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200"
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                      </svg>
                      Start WhatsApp Chat
                    </a>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Ticket not found</h2>
          <p className="text-muted-foreground mb-4">
            The ticket you are looking for doesn't exist or you don't have permission to view it.
          </p>
          <Button onClick={() => navigate("/tickets")}>
            Back to Tickets
          </Button>
        </div>
      )}
    </div>
  );
}