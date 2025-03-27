import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle } from "lucide-react";

export default function Consult() {
  const handleCall = () => {
    window.location.href = 'tel:+918630959445';
  };

  const handleWhatsAppChat = () => {
    // WhatsApp business API link with your number
    window.open('https://wa.me/918630959445', '_blank');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Consult an Expert</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Call Now
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Speak directly with our insurance experts.
            </p>
            <Button 
              onClick={handleCall}
              className="bg-primary hover:bg-primary/90"
            >
              <Phone className="h-4 w-4 mr-2" />
              Call Expert Now
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              WhatsApp Chat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Chat with our experts on WhatsApp instantly.
            </p>
            <Button 
              variant="secondary" 
              onClick={handleWhatsAppChat}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Start WhatsApp Chat
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
