import React from "react";
import { useParams } from "wouter";
import { ServiceTemplate } from "@/components/services/service-template";
import { getServiceById } from "@/data/services-data";
import NotFound from "@/pages/not-found";

export default function DynamicServicePage() {
  // Extract the service ID from the URL using useParams
  const params = useParams();
  const serviceId = params.id;
  
  console.log("Service ID from URL:", serviceId); // Add logging for debugging
  
  // Get the service data
  const service = serviceId ? getServiceById(serviceId) : undefined;
  
  console.log("Service data:", service); // Add logging for debugging
  
  // If service not found, show 404
  if (!service) {
    return <NotFound />;
  }
  
  // Render the service template with the data
  return <ServiceTemplate service={service} />;
}