import { createContext, ReactNode, useContext, useState, useCallback } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { type User } from "@shared/schema";
import { getQueryFn, apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  requestOTPMutation: UseMutationResult<{ userId: string }, Error, { username: string }>;
  verifyOTPMutation: UseMutationResult<User, Error, { userId: string; otp: string }>;
  logoutMutation: UseMutationResult<void, Error, void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<User | null>({
    queryKey: ["/api/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const requestOTPMutation = useMutation({
    mutationFn: async (credentials: { username: string }) => {
      const res = await apiRequest("POST", "/api/auth/request-otp", credentials);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to send OTP");
      }
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "OTP Sent!",
        description: "Please check the console for the OTP (in production this would be sent via SMS)",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to send OTP",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const verifyOTPMutation = useMutation({
    mutationFn: async (data: { userId: string; otp: string }) => {
      const res = await apiRequest("POST", "/api/auth/verify-otp", data);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "OTP verification failed");
      }
      return res.json();
    },
    onSuccess: (user: User) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Welcome!",
        description: "You have successfully signed in.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Verification failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
      toast({
        title: "Goodbye!",
        description: "You have been logged out successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logout = useCallback(async () => {
    if (!user) return;

    const userSpecificKeys = [
      `seenTaskIds_${user.id}`,
      `notification_session_${user.id}`
    ];

    try {
      // Make logout API call first
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      // Only clear storage after successful logout
      userSpecificKeys.forEach(key => {
        try {
          localStorage.removeItem(key);
          sessionStorage.removeItem(key);
        } catch (storageError) {
          console.error(`Error clearing storage key ${key}:`, storageError);
        }
      });

      // Clear user state
      queryClient.setQueryData(["/api/user"], null);
    } catch (error) {
      console.error('Error during logout:', error);
      throw error; // Propagate error to caller
    }
  }, [user, queryClient]);

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        requestOTPMutation,
        verifyOTPMutation,
        logoutMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
