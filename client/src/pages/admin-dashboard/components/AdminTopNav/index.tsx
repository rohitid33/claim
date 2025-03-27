import React from "react";
import { Link, useLocation } from "wouter";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { Button } from "@/components/ui/button";
import { LogOut, Wrench, Ticket, Users, BarChart, Shield } from "lucide-react";

const AdminTopNav = () => {
  const { adminLogout } = useAdminAuth();
  const [location, setLocation] = useLocation();

  const handleLogout = () => {
    adminLogout();
    setLocation('/admin-login');
  };

  return (
    <header className="bg-background/80 backdrop-blur-sm border-b border-border w-full">
      <div className="flex flex-col md:flex-row items-start md:items-center p-2 w-full px-4 py-3">
        <Link href="/admin-dashboard" className="flex items-center gap-2 mb-3 md:mb-0">
          <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center">
            <span className="text-white text-lg">✓</span>
          </div>
          <span className="font-bold text-lg text-primary">Claimsutra Admin</span>
        </Link>
        
        {/* Navigation buttons - Full width on mobile, row on desktop */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto md:ml-auto">
          {/* Services button */}
          <Button 
            variant={location === '/admin-dashboard' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setLocation('/admin-dashboard')}
          >
            <Wrench className="h-4 w-4 mr-2" />
            Services
          </Button>
          
          {/* Ticket Management button */}
          <Button 
            variant={location === '/admin-dashboard/tickets' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setLocation('/admin-dashboard/tickets')}
          >
            <Ticket className="h-4 w-4 mr-2" />
            Tickets
          </Button>
          
          {/* Users button */}
          <Button 
            variant={location === '/admin-dashboard/users' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setLocation('/admin-dashboard/users')}
          >
            <Users className="h-4 w-4 mr-2" />
            Users
          </Button>
          
          {/* Partners button */}
          <Button 
            variant={location === '/admin-dashboard/partners' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setLocation('/admin-dashboard/partners')}
          >
            <Users className="h-4 w-4 mr-2" />
            Partners
          </Button>
          
          {/* Analytics button */}
          <Button 
            variant={location === '/admin-dashboard/analytics' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setLocation('/admin-dashboard/analytics')}
          >
            <BarChart className="h-4 w-4 mr-2" />
            Analytics
          </Button>
          
          {/* Admin button */}
          <Button 
            variant={location === '/admin-dashboard/admin' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setLocation('/admin-dashboard/admin')}
          >
            <Shield className="h-4 w-4 mr-2" />
            Admin
          </Button>
          
          {/* Logout button */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout}
            className="text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AdminTopNav;