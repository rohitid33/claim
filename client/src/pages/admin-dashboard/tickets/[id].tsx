import React from 'react';
import { useParams } from 'wouter';
import TicketDetail from '../../../components/admin/ticket-management/TicketDetail';

const AdminTicketDetailPage: React.FC = () => {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  
  // Set document title using the browser API
  React.useEffect(() => {
    document.title = "Ticket Details | Admin";
    return () => {
      // Optionally restore previous title when component unmounts
    };
  }, []);
  
  console.log("Ticket ID from URL (admin page):", id);
  
  return (
    <main className="container mx-auto px-4 py-8">
      {/* Pass the ID as a prop to ensure the component receives it */}
      <TicketDetail ticketIdProp={id} />
    </main>
  );
};

export default AdminTicketDetailPage;