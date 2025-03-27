import { ServiceData } from "@/components/services/service-template";

// Sample services data - in a real application, this would contain all 150+ services
export const servicesData: ServiceData[] = [
  {
    id: "health-claim",
    title: "Health Insurance Claim",
    icon: "🏥",
    description: "Our health insurance claim service provides comprehensive assistance in processing and managing your medical insurance claims. We help you navigate through the complex healthcare system, ensuring you receive the coverage you deserve.",
    features: [
      "Claim processing assistance",
      "Documentation support",
      "Medical bill review",
      "Insurance coverage verification",
      "Appeals handling"
    ],
    popular: true,
    eligibility: [
      "Valid health insurance policy",
      "Policy must be active at the time of treatment",
      "Claim must be filed within policy timeframe",
      "Treatment must be covered under policy terms"
    ],
    process: [
      {
        title: "Initial Assessment",
        steps: [
          "Submit your claim request",
          "Provide basic policy information",
          "Schedule initial consultation"
        ]
      },
      {
        title: "Documentation",
        steps: [
          "Gather all required medical documents",
          "Complete claim forms",
          "Submit supporting evidence"
        ]
      },
      {
        title: "Processing",
        steps: [
          "Claim review by our experts",
          "Communication with insurance provider",
          "Resolution and settlement"
        ]
      }
    ],
    documents: [
      "Insurance policy document",
      "Medical reports and records",
      "Hospital bills and receipts",
      "Prescription details",
      "Identity proof"
    ],
    faqs: [
      {
        question: "How long does the claim process take?",
        answer: "The typical processing time is 7-14 business days, depending on the complexity of the claim and the responsiveness of the insurance provider."
      },
      {
        question: "What if my claim is rejected?",
        answer: "If your claim is rejected, our experts will analyze the reason for rejection and assist you in filing an appeal with additional documentation if necessary."
      },
      {
        question: "Do I need to pay upfront for your services?",
        answer: "No, our service fee is typically a percentage of the successful claim amount. You don't pay if the claim is not successful."
      }
    ],
    contactInfo: {
      phone: "+1 (800) 123-4567",
      email: "health-claims@example.com"
    }
  },
  {
    id: "motor-claim",
    title: "Motor Insurance Claim",
    icon: "🚗",
    description: "Our motor insurance claim service helps you handle all aspects of vehicle-related insurance claims. We ensure a smooth and efficient process for dealing with accidents and damages to your vehicle.",
    features: [
      "Accident report assistance",
      "Damage assessment",
      "Repair cost estimation",
      "Third-party claim handling",
      "Insurance negotiation"
    ],
    popular: true,
    eligibility: [
      "Valid motor insurance policy",
      "Vehicle registered under your name",
      "Claim filed within policy timeframe",
      "Incident covered under policy terms"
    ],
    process: [
      {
        title: "Incident Reporting",
        steps: [
          "Report the incident immediately",
          "Document the scene with photos",
          "Collect information from other parties involved"
        ]
      },
      {
        title: "Claim Submission",
        steps: [
          "Complete the claim form",
          "Attach supporting documents",
          "Submit to our processing team"
        ]
      },
      {
        title: "Assessment & Settlement",
        steps: [
          "Vehicle inspection by authorized surveyor",
          "Damage evaluation and repair cost estimation",
          "Claim approval and settlement"
        ]
      }
    ],
    documents: [
      "Insurance policy document",
      "Vehicle registration certificate",
      "Driving license",
      "Police report (for accidents)",
      "Repair estimates",
      "Photos of damage"
    ],
    faqs: [
      {
        question: "Can I choose my own repair shop?",
        answer: "Yes, you can choose your preferred repair shop, but we recommend using our network of authorized service centers for faster claim processing and quality assurance."
      },
      {
        question: "Will my premium increase after filing a claim?",
        answer: "Premium adjustments depend on various factors including claim history, type of incident, and policy terms. Our advisors can provide specific guidance for your situation."
      },
      {
        question: "What if the accident was not my fault?",
        answer: "If the accident was caused by another party, we'll help you file a third-party claim against the responsible party's insurance, potentially protecting your no-claim bonus."
      }
    ],
    contactInfo: {
      phone: "+1 (800) 234-5678",
      email: "motor-claims@example.com"
    }
  },
  {
    id: "life-claim",
    title: "Life Insurance Claim",
    icon: "👥",
    description: "Our life insurance claim service provides compassionate and efficient assistance to beneficiaries during difficult times. We help simplify the process of claiming life insurance benefits.",
    features: [
      "Beneficiary assistance",
      "Documentation guidance",
      "Claim form completion help",
      "Communication with insurance providers",
      "Expedited processing"
    ],
    eligibility: [
      "Named beneficiary of a valid life insurance policy",
      "Policy was active at time of insured's passing",
      "Claim filed within policy timeframe"
    ],
    process: [
      {
        title: "Initial Notification",
        steps: [
          "Notify us about the claim",
          "Provide basic policy information",
          "Schedule a consultation with our specialist"
        ]
      },
      {
        title: "Documentation",
        steps: [
          "Gather required documents",
          "Complete claim forms with our assistance",
          "Submit documentation package"
        ]
      },
      {
        title: "Processing & Disbursement",
        steps: [
          "Claim verification by insurance company",
          "Approval process",
          "Benefit disbursement to beneficiaries"
        ]
      }
    ],
    documents: [
      "Original policy document",
      "Death certificate",
      "Beneficiary identification proof",
      "Bank account details for fund transfer",
      "Completed claim form"
    ],
    faqs: [
      {
        question: "How long does it take to receive the claim amount?",
        answer: "Most straightforward life insurance claims are processed within 30 days of submission. Complex cases may take longer."
      },
      {
        question: "What if I can't find the original policy document?",
        answer: "If the original policy document is unavailable, we can help you obtain a duplicate from the insurance company with appropriate verification."
      },
      {
        question: "Are life insurance proceeds taxable?",
        answer: "In most cases, life insurance proceeds paid to beneficiaries are not subject to income tax. However, we recommend consulting with a tax advisor for your specific situation."
      }
    ],
    contactInfo: {
      phone: "+1 (800) 345-6789",
      email: "life-claims@example.com"
    }
  }
];

// For reactive updates - store subscribers
let subscribers: (() => void)[] = [];

// Helper functions
export function getServiceById(id: string): ServiceData | undefined {
  return servicesData.find(service => service.id === id);
}

// Get all services - now fetches from API
export async function getAllServices(): Promise<ServiceData[]> {
  try {
    // Try to fetch services from the API
    const response = await fetch('/api/services');
    
    if (response.ok) {
      const apiServices = await response.json();
      
      // Update the local array
      servicesData.length = 0;
      servicesData.push(...apiServices);
      
      // Update localStorage
      saveToLocalStorage();
      
      console.log('Services fetched from API:', apiServices.length);
      return [...apiServices]; // Return a copy of the fetched services
    } else {
      console.warn('Failed to fetch services from API, using local data');
      return [...servicesData]; // Return a copy to prevent direct mutation
    }
  } catch (error) {
    console.error('Error fetching services from API:', error);
    // Fallback to the in-memory array
    return [...servicesData]; // Return a copy to prevent direct mutation
  }
}

export function getServicesByCategory(category: string): ServiceData[] {
  // Filter services by category
  return servicesData.filter(service => service.category === category);
}

// Function to create a new service
export async function createService(newService: ServiceData): Promise<void> {
  try {
    // Check if service with the same ID already exists
    if (servicesData.some(service => service.id === newService.id)) {
      throw new Error(`Service with ID ${newService.id} already exists`);
    }
    
    // Add the new service to the array
    servicesData.push(newService);
    
    // Save to localStorage
    saveToLocalStorage();
    
    // Create in MongoDB via API
    await fetch('/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newService)
    });
    
    console.log(`Service ${newService.id} created in MongoDB successfully`);
    
    // Notify subscribers
    notifySubscribers();
  } catch (error) {
    console.error(`Failed to create service ${newService.id}:`, error);
    throw error;
  }
}

// Function to update a single service
export async function updateService(id: string, updatedService: Partial<ServiceData>): Promise<void> {
  try {
    const index = servicesData.findIndex(service => service.id === id);
    
    if (index === -1) {
      throw new Error(`Service with ID ${id} not found`);
    }
    
    // Update the service with new data while preserving the ID
    servicesData[index] = { 
      ...servicesData[index], 
      ...updatedService,
      id // Ensure ID doesn't change
    };
    
    // Save to localStorage
    saveToLocalStorage();
    
    // Update in MongoDB via API
    await fetch(`/api/services/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(servicesData[index])
    });
    
    console.log(`Service ${id} updated in MongoDB successfully`);
    
    // Notify subscribers
    notifySubscribers();
  } catch (error) {
    console.error(`Failed to update service ${id}:`, error);
    throw error;
  }
}

// Function to delete a service
export async function deleteService(id: string): Promise<void> {
  try {
    const index = servicesData.findIndex(service => service.id === id);
    
    if (index === -1) {
      throw new Error(`Service with ID ${id} not found`);
    }
    
    // Remove the service from the array
    servicesData.splice(index, 1);
    
    // Save to localStorage
    saveToLocalStorage();
    
    // Delete from MongoDB via API
    await fetch(`/api/services/${id}`, {
      method: 'DELETE'
    });
    
    console.log(`Service ${id} deleted from MongoDB successfully`);
    
    // Notify subscribers
    notifySubscribers();
  } catch (error) {
    console.error(`Failed to delete service ${id}:`, error);
    throw error;
  }
}

// Function to update the entire services data
export async function updateServicesData(updatedServices: ServiceData[]): Promise<void> {
  try {
    // First update the in-memory array
    servicesData.length = 0; // Clear the array
    servicesData.push(...updatedServices); // Add the updated services
    
    // Store services in localStorage for persistence across page refreshes
    saveToLocalStorage();
    
    // Now, update each service in the MongoDB collection via API
    const updatePromises = updatedServices.map(async (service) => {
      try {
        // Check if service exists (by ID)
        const response = await fetch(`/api/services/${service.id}`);
        
        if (response.ok) {
          // Service exists, update it
          return fetch(`/api/services/${service.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(service)
          });
        } else {
          // Service doesn't exist, create it
          return fetch('/api/services', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(service)
          });
        }
      } catch (error) {
        console.error(`Failed to update service ${service.id}:`, error);
        throw error;
      }
    });
    
    // Wait for all update operations to complete
    await Promise.all(updatePromises);
    console.log('All services synced with MongoDB successfully');
    
    // Notify all subscribers that data has changed
    notifySubscribers();
  } catch (error) {
    console.error('Failed to update services in the database:', error);
    throw error;
  }
}

// Function to subscribe to data changes
export function subscribeToServices(callback: () => void): () => void {
  subscribers.push(callback);
  
  // Return unsubscribe function
  return () => {
    subscribers = subscribers.filter(cb => cb !== callback);
  };
}

// Function to notify all subscribers
function notifySubscribers(): void {
  subscribers.forEach(callback => callback());
}

// Helper function to save services to localStorage
function saveToLocalStorage(): void {
  try {
    localStorage.setItem('services', JSON.stringify(servicesData));
  } catch (error) {
    console.error('Failed to save services to localStorage:', error);
  }
}

// Load services from localStorage on module initialization
try {
  const savedServices = localStorage.getItem('services');
  if (savedServices) {
    const parsedServices = JSON.parse(savedServices);
    servicesData.length = 0;
    servicesData.push(...parsedServices);
    console.log('Services loaded from localStorage:', servicesData);
  }
} catch (error) {
  console.error('Failed to load services from localStorage:', error);
}