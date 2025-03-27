import React from "react";
import { Button } from "@/components/ui/button";
import { WrenchIcon, TicketIcon, UsersIcon, HandshakeIcon, BarChartIcon, ShieldIcon } from "lucide-react";
import { useLocation } from "wouter";

export function AdminNavigation() {
  const [, setLocation] = useLocation();

  return (
    <div className="bg-gray-100 p-4 mb-6 rounded-lg overflow-x-auto">
      <div className="flex space-x-2">
        <Button 
          variant="default" 
          onClick={() => setLocation('/admin-dashboard')} 
          size="sm"
        >
          <WrenchIcon className="mr-2 h-4 w-4" />
          Services
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => setLocation('/admin-dashboard/tickets')} 
          size="sm"
        >
          <TicketIcon className="mr-2 h-4 w-4" />
          Ticket Management
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => setLocation('/admin-dashboard/users')} 
          size="sm"
        >
          <UsersIcon className="mr-2 h-4 w-4" />
          Users
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => setLocation('/admin-dashboard/partners')} 
          size="sm"
        >
          <HandshakeIcon className="mr-2 h-4 w-4" />
          Partners
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => setLocation('/admin-dashboard/analytics')} 
          size="sm"
        >
          <BarChartIcon className="mr-2 h-4 w-4" />
          Analytics
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => setLocation('/admin-dashboard/admin')} 
          size="sm"
        >
          <ShieldIcon className="mr-2 h-4 w-4" />
          Admin
        </Button>
      </div>
    </div>
  );
}