import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { getQueryFn } from "@/lib/queryClient";
import axios from "axios";

export interface Ticket {
  id: string;
  serviceId: string;
  serviceName: string;
  userId: string;
  title: string;
  description: string;
  status: 'new' | 'processing' | 'completed' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
}

interface TicketsContextType {
  tickets: Ticket[];
  isLoading: boolean;
  error: Error | null;
  refetchTickets: () => void;
  deleteTicket: (id: string) => Promise<boolean>;
  isDeletingTicket: boolean;
}

export const TicketsContext = createContext<TicketsContextType | null>(null);

export function TicketsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: tickets = [],
    error,
    isLoading,
    refetch,
  } = useQuery<Ticket[]>({
    queryKey: ["/api/tickets"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!user, // Only fetch tickets if user is logged in
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Delete ticket mutation
  const deleteTicketMutation = useMutation({
    mutationFn: async (ticketId: string) => {
      const response = await axios.delete(`/api/tickets/${ticketId}`);
      return response.status === 204; // Returns true if successful
    },
    onSuccess: () => {
      // Invalidate and refetch tickets after successful deletion
      queryClient.invalidateQueries({ queryKey: ["/api/tickets"] });
    },
  });

  // Refetch tickets when user changes
  useEffect(() => {
    if (user) {
      refetch();
    }
  }, [user, refetch]);

  return (
    <TicketsContext.Provider
      value={{
        tickets,
        isLoading,
        error,
        refetchTickets: refetch,
        deleteTicket: deleteTicketMutation.mutateAsync,
        isDeletingTicket: deleteTicketMutation.isPending,
      }}
    >
      {children}
    </TicketsContext.Provider>
  );
}

export function useTickets() {
  const context = useContext(TicketsContext);
  if (!context) {
    throw new Error("useTickets must be used within a TicketsProvider");
  }
  return context;
}