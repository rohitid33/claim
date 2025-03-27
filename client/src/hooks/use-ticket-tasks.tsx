import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";

export interface Task {
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

export function useTicketTasks(ticketId: string | undefined) {
  const { user } = useAuth();

  const {
    data: tasks = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Task[]>({
    queryKey: [`/api/tickets/${ticketId}/tasks`],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!user && !!ticketId, // Only fetch tasks if user is logged in and ticketId is provided
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  return {
    tasks,
    isLoading,
    error,
    refetchTasks: refetch
  };
}