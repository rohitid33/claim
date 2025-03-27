import { useState, useEffect } from "react";
import { ServiceData } from "@/components/services/service-template";
import { getAllServices } from "@/data/services-data";
import { useToast } from "@/hooks/use-toast";

export function useServices() {
  const [services, setServices] = useState<ServiceData[]>([]);
  const [serviceId, setServiceId] = useState("");
  const [serviceTitle, setServiceTitle] = useState("");
  const [serviceIcon, setServiceIcon] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [serviceFeatures, setServiceFeatures] = useState("");
  const [servicePopular, setServicePopular] = useState(false);
  const [serviceEligibility, setServiceEligibility] = useState("");
  const [serviceDocuments, setServiceDocuments] = useState("");
  const [serviceFaqs, setServiceFaqs] = useState<{question: string, answer: string}[]>([]);
  const [faqQuestion, setFaqQuestion] = useState("");
  const [faqAnswer, setFaqAnswer] = useState("");
  const [serviceProcess, setServiceProcess] = useState<{title: string, steps: string[]}[]>([]);
  const [processTitle, setProcessTitle] = useState("");
  const [processSteps, setProcessSteps] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubcategoriesForService, setSelectedSubcategoriesForService] = useState<string[]>([]);
  const [editServiceId, setEditServiceId] = useState<string | null>(null);
  const [activeServiceSection, setActiveServiceSection] = useState("basic");
  
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const loadedServices = await getAllServices();
      setServices(loadedServices);
    } catch (error) {
      console.error('Error loading services:', error);
      toast({
        title: "Error loading services",
        description: "There was a problem loading the services.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddService = async () => {
    // Enhanced validation
    const validationErrors = [];
    
    if (!serviceId.trim()) {
      validationErrors.push("Service ID is required");
    } else {
      // Validate service ID format (URL-friendly)
      const idRegex = /^[a-z0-9-]+$/;
      if (!idRegex.test(serviceId)) {
        validationErrors.push("Service ID must contain only lowercase letters, numbers, and hyphens");
      } else {
        // Check for duplicate service ID (excluding current service when editing)
        const isDuplicate = services.some(service => 
          service.id === serviceId && service.id !== editServiceId
        );
        if (isDuplicate) {
          validationErrors.push("A service with this ID already exists");
        }
      }
    }
    
    if (!serviceTitle.trim()) {
      validationErrors.push("Service title is required");
    }
    if (!serviceDescription.trim()) {
      validationErrors.push("Service description is required");
    }
    if (!selectedCategory) {
      validationErrors.push("Please select a category");
    }
    if (!serviceIcon.trim()) {
      validationErrors.push("Service icon (emoji) is required");
    }
    if (serviceProcess.length === 0) {
      validationErrors.push("At least one process is required");
    }
    if (serviceFaqs.length === 0) {
      validationErrors.push("At least one FAQ is required");
    }
    if (!contactPhone.trim() || !contactEmail.trim()) {
      validationErrors.push("Both phone and email contact information are required");
    }

    if (validationErrors.length > 0) {
      toast({
        title: "Missing Information",
        description: validationErrors.join("\n"),
        variant: "destructive"
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactEmail)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const featuresArray = serviceFeatures.split(',').map(item => item.trim()).filter(Boolean);
      const eligibilityArray = serviceEligibility.split(',').map(item => item.trim()).filter(Boolean);
      const documentsArray = serviceDocuments.split(',').map(item => item.trim()).filter(Boolean);
      
      const serviceData: ServiceData = {
        id: editServiceId || serviceId,
        title: serviceTitle.trim(),
        icon: serviceIcon.trim(),
        description: serviceDescription.trim(),
        features: featuresArray,
        category: selectedCategory,
        selectedCategory: selectedCategory,
        subcategoryIds: selectedSubcategoriesForService.length > 0 ? selectedSubcategoriesForService : undefined,
        popular: servicePopular,
        eligibility: eligibilityArray,
        process: serviceProcess,
        documents: documentsArray,
        faqs: serviceFaqs,
        contactInfo: { 
          phone: contactPhone.trim(), 
          email: contactEmail.trim() 
        }
      };

      if (editServiceId) {
        // Update existing service
        const response = await fetch(`/api/services/${editServiceId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(serviceData),
        });

        if (!response.ok) {
          throw new Error('Failed to update service');
        }

        const updatedService = await response.json();
        setServices(services.map(service => 
          service.id === editServiceId ? updatedService : service
        ));
        
        toast({
          title: "Service updated",
          description: "The service has been updated successfully.",
        });
      } else {
        // Add new service
        const response = await fetch('/api/services', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(serviceData),
        });

        if (!response.ok) {
          throw new Error('Failed to add service');
        }

        const newService = await response.json();
        setServices([...services, newService]);
        
        toast({
          title: "Service added",
          description: "The service has been added successfully.",
        });
      }

      // Reset form only after successful API call
      resetServiceForm();
      setHasChanges(true);
      setEditServiceId(null);
    } catch (error) {
      console.error('Error saving service:', error);
      toast({
        title: "Error saving service",
        description: error instanceof Error ? error.message : "Failed to save service",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetServiceForm = () => {
    setServiceId("");
    setServiceTitle("");
    setServiceIcon("");
    setServiceDescription("");
    setServiceFeatures("");
    setServicePopular(false);
    setServiceEligibility("");
    setServiceDocuments("");
    setServiceProcess([]);
    setServiceFaqs([]);
    setContactPhone("");
    setContactEmail("");
    setSelectedCategory("");
    setSelectedSubcategoriesForService([]);
    setActiveServiceSection("basic");
  };

  const handleDeleteService = async (id: string) => {
    if (window.confirm(`Are you sure you want to delete this service?`)) {
      try {
        setIsLoading(true);
        
        // First update local state
        setServices(services.filter(service => service.id !== id));
        
        // Then delete from database
        await fetch(`/api/services/${id}`, {
          method: 'DELETE',
        });
        
        setHasChanges(true);
        
        toast({
          title: "Service deleted",
          description: "The service has been deleted successfully.",
        });
      } catch (error) {
        console.error(`Error deleting service ${id}:`, error);
        
        // Restore the service in local state if deletion failed
        const deletedService = services.find(service => service.id === id);
        if (deletedService) {
          setServices([...services]);
        }
        
        toast({
          title: "Error deleting service",
          description: error instanceof Error ? error.message : "Failed to delete service",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return {
    services,
    setServices,
    serviceId,
    setServiceId,
    serviceTitle,
    setServiceTitle,
    serviceIcon,
    setServiceIcon,
    serviceDescription,
    setServiceDescription,
    serviceFeatures,
    setServiceFeatures,
    servicePopular,
    setServicePopular,
    serviceEligibility,
    setServiceEligibility,
    serviceDocuments,
    setServiceDocuments,
    serviceFaqs,
    setServiceFaqs,
    faqQuestion,
    setFaqQuestion,
    faqAnswer,
    setFaqAnswer,
    serviceProcess,
    setServiceProcess,
    processTitle,
    setProcessTitle,
    processSteps,
    setProcessSteps,
    contactPhone,
    setContactPhone,
    contactEmail,
    setContactEmail,
    selectedCategory,
    setSelectedCategory,
    selectedSubcategoriesForService,
    setSelectedSubcategoriesForService,
    editServiceId,
    setEditServiceId,
    activeServiceSection,
    setActiveServiceSection,
    isLoading,
    hasChanges,
    setHasChanges,
    fetchServices,
    handleAddService,
    handleDeleteService,
    resetServiceForm
  };
}