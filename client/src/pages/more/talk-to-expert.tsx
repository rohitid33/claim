import { useEffect } from "react";
import { useLocation } from "wouter";

export default function TalkToExpertPage() {
  const [_, navigate] = useLocation();
  
  useEffect(() => {
    // Redirect to consult page
    navigate("/consult");
  }, [navigate]);
  
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <p>Redirecting to consultation page...</p>
    </div>
  );
}