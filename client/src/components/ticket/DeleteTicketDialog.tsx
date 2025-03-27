import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useTickets } from "@/hooks/use-tickets";

interface DeleteTicketDialogProps {
  ticketId: string;
  ticketTitle: string;
}

export function DeleteTicketDialog({ ticketId, ticketTitle }: DeleteTicketDialogProps) {
  const [open, setOpen] = useState(false);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { deleteTicket, isDeletingTicket } = useTickets();

  const handleDelete = async () => {
    if (!ticketId) {
      console.error("No ticket ID provided for deletion");
      toast({
        title: "Error",
        description: "Cannot delete ticket: Missing ticket ID",
        variant: "destructive",
      });
      return;
    }

    console.log(`Attempting to delete ticket ${ticketId}`);
    
    try {
      const success = await deleteTicket(ticketId);
      
      if (success) {
        toast({
          title: "Success",
          description: "Ticket has been deleted successfully",
        });
        
        // Navigate back to tickets page after successful deletion
        navigate("/tickets");
      } else {
        throw new Error("Failed to delete ticket");
      }
    } catch (error) {
      console.error("Error deleting ticket:", error);
      
      toast({
        title: "Failed to delete ticket",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Button 
        variant="destructive" 
        className="gap-2" 
        onClick={() => setOpen(true)}
      >
        <Trash2 className="h-4 w-4" />
        Delete Ticket
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this ticket?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the ticket
              <strong> {ticketTitle || `#${ticketId.substring(0, 8)}`} </strong>
              and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <AlertDialogFooter className="flex space-x-2">
            <AlertDialogCancel disabled={isDeletingTicket}>Cancel</AlertDialogCancel>
            <Button 
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeletingTicket}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeletingTicket ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Yes, Delete Ticket"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}