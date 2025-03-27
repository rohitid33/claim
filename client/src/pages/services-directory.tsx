import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAllServices } from "@/data/services-data";
import { ServiceData } from "@/components/services/service-template";

export default function ServicesDirectory() {
  const [services, setServices] = useState<ServiceData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [location] = useLocation();
  
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const fetchedServices = await getAllServices();
        
        // Get category from URL if present
        const urlParams = new URLSearchParams(window.location.search);
        const categoryId = urlParams.get('category');
        
        // Filter services by category if categoryId is present
        const filteredServices = categoryId
          ? fetchedServices.filter(service => service.category === categoryId)
          : fetchedServices;
        
        setServices(filteredServices);
      } catch (error) {
        console.error("Error fetching services:", error);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchServices();
  }, [location]);
  
  // Filter services based on search query
  const filteredServices = services.filter(service => 
    service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.features.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Services Directory</h1>
        <div className="text-center py-12">Loading services...</div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Services Directory</h1>
      
      {/* Search Bar */}
      <div className="mb-8">
        <Input
          type="search"
          placeholder="Search services..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>
      
      {/* Services Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <Link key={service.id} href={`/service/${service.id}`}>
              <Card className="h-full cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">{service.icon}</div>
                  <h2 className="text-xl font-semibold mb-2">{service.title}</h2>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">No services found.</p>
          </div>
        )}
      </div>
    </div>
  );
}