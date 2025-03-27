import React from 'react';
import TicketList from '../../../components/admin/ticket-management/TicketList';

const AdminTicketsPage: React.FC = () => {
  // Set document title using the browser API
  React.useEffect(() => {
    document.title = "Admin Ticket Management";
    return () => {
      // Optionally restore previous title when component unmounts
    };
  }, []);

  return (
    <main className="container mx-auto px-4 py-8">
      <TicketList />
    </main>
  );
};

export default AdminTicketsPage;