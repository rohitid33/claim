export interface Service {
  title: string;
  icon: string;
  link: string;
  category: string;
}

export const servicesByCategory = {
  insurance: [
    { title: "Health Claim", icon: "🏥", link: "/health-claim" },
    { title: "Motor Accident", icon: "🚗", link: "/motor-claim" },
    { title: "Fire Claim", icon: "🔥", link: "/fire-claim" },
    { title: "Life Insurance", icon: "👥", link: "/life-claim" },
    { title: "Travel Claim", icon: "✈️", link: "/travel-claim" },
    { title: "Property Claim", icon: "🏠", link: "/property-claim" },
    { title: "Marine Claim", icon: "🚢", link: "/marine-claim" },
    { title: "Liability Claim", icon: "⚖️", link: "/liability-claim" }
  ],
  loan: [
    { title: "Personal Loan", icon: "👤", link: "/personal-loan" },
    { title: "Home Loan", icon: "🏠", link: "/home-loan" },
    { title: "Business Loan", icon: "💼", link: "/business-loan" }
  ],
  consumer: [
    { title: "Product Issues", icon: "📦", link: "/product-issues" },
    { title: "Service Quality", icon: "⭐", link: "/service-quality" },
    { title: "Billing Disputes", icon: "💳", link: "/billing-disputes" }
  ]
};

// Flatten the services array with category information
export const allServices: Service[] = Object.entries(servicesByCategory).flatMap(
  ([category, services]) => 
    services.map(service => ({
      ...service,
      category
    }))
);

// Function to search services
export function searchServices(query: string): Service[] {
  if (!query) return [];
  
  const lowerQuery = query.toLowerCase();
  return allServices.filter(service => 
    service.title.toLowerCase().includes(lowerQuery) || 
    service.category.toLowerCase().includes(lowerQuery)
  );
}