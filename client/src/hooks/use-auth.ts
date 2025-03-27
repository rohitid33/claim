import { create } from "zustand";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";

interface MigrationStatus {
  startedAt: string;
  daysRemaining: number | null;
  remindersSent: number;
  lastReminder: string | null;
  scheduledDeletionDate: string;
}

interface User {
  id: string;
  username: string;
  preferredAuthMethod?: 'otp' | 'password';
  createdAt: string;
  migrationStatus?: MigrationStatus;
  warning?: string;
}

interface AuthResponse extends User {
  migrationStatus?: MigrationStatus;
  warning?: string;
}

interface AuthStore {
  user: User | null;
  setUser: (user: User | null) => void;
}

const useAuthStore = create<AuthStore>()((set) => ({
  user: null,
  setUser: (user: User | null) => set({ user }),
}));

export function useAuth() {
  const { user, setUser } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: currentUser, isLoading } = useQuery<User | null>({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (!response.ok) {
          if (response.status === 401) {
            // Only clear user if we're sure the session is invalid
            const data = await response.json();
            if (data.error === "session_expired") {
              setUser(null);
            }
          }
          return null;
        }
        const data = await response.json();
        return data as User;
      } catch (error) {
        console.error("Error fetching user:", error);
        return null;
      }
    },
    retry: 2, // Retry twice
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Exponential backoff
    gcTime: 3600000, // Cache for 1 hour (formerly cacheTime)
    staleTime: 30000, // Consider data fresh for 30 seconds
    refetchOnWindowFocus: true, // Refetch when window gains focus
    refetchOnReconnect: true, // Refetch when reconnecting
    refetchOnMount: true, // Refetch when component mounts
  });

  // Update user state when currentUser changes
  React.useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
    }
  }, [currentUser, setUser]);

  const requestOTPMutation = useMutation({
    mutationFn: async (data: { username: string }) => {
      const response = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to request OTP");
      }
      return response.json();
    },
  });

  const verifyOTPMutation = useMutation({
    mutationFn: async (data: { userId: string; otp: string }) => {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to verify OTP");
      }
      const userData: User = await response.json();
      return userData;
    },
    onSuccess: (data: User) => {
      setUser(data);
      queryClient.setQueryData(["user"], data);
    },
  });

  const loginWithPasswordMutation = useMutation({
    mutationFn: async (data: { username: string; password: string }): Promise<AuthResponse> => {
      const response = await fetch("/api/auth/password/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to login");
      }
      const userData: AuthResponse = await response.json();
      return userData;
    },
    onSuccess: (data: AuthResponse) => {
      const { migrationStatus, warning, ...userData } = data;
      setUser(userData);
      queryClient.setQueryData(["user"], userData);
    },
  });

  const setupPasswordMutation = useMutation({
    mutationFn: async (data: { password: string; confirmPassword: string }): Promise<AuthResponse> => {
      const response = await fetch("/api/auth/password/setup-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to set up password");
      }
      return response.json();
    },
  });

  const changeAuthMethodMutation = useMutation({
    mutationFn: async (method: 'otp' | 'password'): Promise<AuthResponse> => {
      const response = await fetch("/api/auth/password/change-auth-method", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ method }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to change authentication method");
      }
      return response.json();
    },
    onSuccess: (data: AuthResponse) => {
      const { migrationStatus, warning, ...userData } = data;
      if (user) {
        const updatedUser = { ...userData, preferredAuthMethod: data.preferredAuthMethod };
        setUser(updatedUser);
        queryClient.setQueryData(["user"], updatedUser);
      }
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) {
        // Try to parse error message if available
        try {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to logout");
        } catch {
          throw new Error(`Logout failed with status: ${response.status}`);
        }
      }
    },
    onSuccess: () => {
      // Clear all application state
      setUser(null);
      queryClient.clear();
      // Clear any stored tokens or session data
      localStorage.clear();
      sessionStorage.clear();
      // Remove any cookies by setting them to expire
      document.cookie.split(";").forEach(cookie => {
        document.cookie = cookie
          .replace(/^ +/, "")
          .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
      });
    },
    onError: (error) => {
      console.error("Logout failed:", error);
      // Force logout on frontend even if backend fails
      setUser(null);
      queryClient.clear();
      localStorage.clear();
      sessionStorage.clear();
    }
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    requestOTPMutation,
    verifyOTPMutation,
    loginWithPasswordMutation,
    setupPasswordMutation,
    changeAuthMethodMutation,
    logoutMutation,
  };
} 