import React, { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';

interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  adminLoading: boolean;
  adminError: string | null;
  adminLogin: (username: string, password: string) => Promise<void>;
  adminLogout: () => void;
  isAdminAuthenticated: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [adminLoading, setAdminLoading] = useState(true);
  const [adminError, setAdminError] = useState<string | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Configure axios to include credentials
  axios.defaults.withCredentials = true;

  useEffect(() => {
    const verifyAdmin = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setAdminLoading(false);
        return;
      }

      try {
        const res = await axios.get('/api/admin-auth/verify', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true // Include cookies
        });
        
        setAdminUser(res.data.admin);
        setIsAdminAuthenticated(true);
      } catch (error) {
        console.error('Admin verification error:', error);
        localStorage.removeItem('adminToken');
        setAdminError('Session expired. Please log in again.');
      } finally {
        setAdminLoading(false);
      }
    };

    verifyAdmin();
  }, []);

  const adminLogin = async (username: string, password: string) => {
    setAdminLoading(true);
    setAdminError(null);
    
    try {
      console.log('Attempting admin login for:', username);
      const res = await axios.post('/api/admin-auth/login', 
        { username, password },
        { withCredentials: true } // Include cookies
      );
      
      console.log('Admin login response:', res.data);
      
      // Store the token in localStorage
      localStorage.setItem('adminToken', res.data.token);
      
      // Set the admin user in state
      setAdminUser(res.data.admin);
      setIsAdminAuthenticated(true);
      
      console.log('Admin login successful, token stored in localStorage');
    } catch (error: any) {
      console.error('Admin login error:', error);
      setAdminError(error.response?.data?.message || 'Login failed');
      setIsAdminAuthenticated(false);
    } finally {
      setAdminLoading(false);
    }
  };

  const adminLogout = () => {
    localStorage.removeItem('adminToken');
    setAdminUser(null);
    setIsAdminAuthenticated(false);
  };

  return (
    <AdminAuthContext.Provider 
      value={{ 
        adminUser, 
        adminLoading, 
        adminError, 
        adminLogin, 
        adminLogout, 
        isAdminAuthenticated 
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};