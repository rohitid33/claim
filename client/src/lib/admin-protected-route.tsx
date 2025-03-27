import { useLocation } from 'wouter';
import { useAdminAuth } from '@/hooks/use-admin-auth';
import { useEffect } from 'react';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
  const { isAdminAuthenticated, adminLoading } = useAdminAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!adminLoading && !isAdminAuthenticated) {
      setLocation('/admin-dashboard/admin-login');
    }
  }, [isAdminAuthenticated, adminLoading, setLocation]);

  if (adminLoading) {
    return <div>Loading...</div>;
  }

  if (!isAdminAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;