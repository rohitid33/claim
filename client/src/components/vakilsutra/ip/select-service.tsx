import React, { useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface Service {
  name: string;
  icon: string;
  url: string;
  price: string;
  description: string;
}

interface IPServices {
  [key: string]: Service[];
}

const ipServices: IPServices = {
  "Trademark Services": [
    {
      name: "Trademark Registration",
      icon: "/icons/trademark.png",
      url: "/vakilsutra/ip/trademark-registration",
      price: "Starting from ₹4,999",
      description: "Register your trademark with expert guidance"
    },
    {
      name: "Search for Trademark",
      icon: "/icons/search.png",
      url: "/vakilsutra/ip/trademark-search",
      price: "Starting from ₹1,999",
      description: "Comprehensive trademark search before registration"
    },
    {
      name: "Respond to TM Objection",
      icon: "/icons/objection.png",
      url: "/vakilsutra/ip/trademark-objection",
      price: "Starting from ₹3,999",
      description: "Professional response to trademark objections"
    },
    {
      name: "Well-Known Trademark",
      icon: "/icons/well-known.png",
      url: "/vakilsutra/ip/well-known-trademark",
      price: "Starting from ₹9,999",
      description: "Apply for well-known trademark status"
    },
    {
      name: "Trademark Watch",
      icon: "/icons/watch.png",
      url: "/vakilsutra/ip/trademark-watch",
      price: "Starting from ₹2,999",
      description: "Monitor similar trademark applications"
    },
    {
      name: "Trademark Renewal",
      icon: "/icons/renewal.png",
      url: "/vakilsutra/ip/trademark-renewal",
      price: "Starting from ₹2,999",
      description: "Renew your trademark registration"
    },
    {
      name: "Trademark Assignment",
      icon: "/icons/assignment.png",
      url: "/vakilsutra/ip/trademark-assignment",
      price: "Starting from ₹3,999",
      description: "Transfer trademark ownership legally"
    },
    {
      name: "USA Trademark",
      icon: "/icons/usa.png",
      url: "/vakilsutra/ip/usa-trademark",
      price: "Starting from ₹19,999",
      description: "Register your trademark in the USA"
    },
    {
      name: "International Trademark",
      icon: "/icons/international.png",
      url: "/vakilsutra/ip/international-trademark",
      price: "Starting from ₹29,999",
      description: "Register your trademark internationally"
    },
    {
      name: "Trademark Infringement",
      icon: "/icons/infringement.png",
      url: "/vakilsutra/ip/trademark-infringement",
      price: "Starting from ₹4,999",
      description: "Take legal action against trademark infringement"
    }
  ],
  "Copyright Services": [
    {
      name: "Copyright Registration",
      icon: "/icons/copyright.png",
      url: "/vakilsutra/ip/copyright-registration",
      price: "Starting from ₹2,999",
      description: "Register your creative works for copyright protection"
    },
    {
      name: "Copyright Infringement",
      icon: "/icons/infringement.png",
      url: "/vakilsutra/ip/copyright-infringement",
      price: "Starting from ₹3,999",
      description: "Take action against copyright violations"
    }
  ],
  "Patent Services": [
    {
      name: "Indian Patent Search",
      icon: "/icons/search.png",
      url: "/vakilsutra/ip/patent-search",
      price: "Starting from ₹3,999",
      description: "Search for existing patents in India"
    },
    {
      name: "Provisional Application",
      icon: "/icons/provisional.png",
      url: "/vakilsutra/ip/provisional-patent",
      price: "Starting from ₹4,999",
      description: "File a provisional patent application"
    },
    {
      name: "Permanent Patent",
      icon: "/icons/patent.png",
      url: "/vakilsutra/ip/permanent-patent",
      price: "Starting from ₹9,999",
      description: "File a complete patent specification"
    },
    {
      name: "Patent Infringement",
      icon: "/icons/infringement.png",
      url: "/vakilsutra/ip/patent-infringement",
      price: "Starting from ₹5,999",
      description: "Take legal action for patent infringement"
    }
  ],
  "Design & Branding Services": [
    {
      name: "Logo Design",
      icon: "/icons/logo.png",
      url: "/vakilsutra/ip/logo-design",
      price: "Starting from ₹1,999",
      description: "Professional logo design services"
    },
    {
      name: "Design Registration",
      icon: "/icons/design.png",
      url: "/vakilsutra/ip/design-registration",
      price: "Starting from ₹3,999",
      description: "Register your industrial design"
    }
  ]
};

interface SelectServiceProps {
  category: string;
}

export default function SelectService({ category }: SelectServiceProps) {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const handleServiceClick = (serviceName: string, url: string) => {
    setSelectedService(serviceName);
    window.location.href = url;
  };

  const services = ipServices[category] || [];

  return (
    <div id="service-section" className="mt-6 pt-4 border-t border-blue-100">
      <h3 className="text-lg font-semibold text-blue-950 mb-4">{category} Services</h3>
      <ScrollArea className="w-full" style={{ WebkitOverflowScrolling: 'touch' }}>
        <div className="flex gap-4 pb-4 overflow-y-visible" style={{ scrollBehavior: 'smooth', willChange: 'transform' }}>
          {services.map((service: Service, index: number) => (
            <div 
              key={index}
              onClick={() => handleServiceClick(service.name, service.url)}
              className={`flex flex-col items-center gap-3 p-4 cursor-pointer group rounded-xl transition-all duration-200 min-w-[200px] sm:min-w-[250px] ${
                selectedService === service.name 
                  ? 'bg-blue-50 shadow-md' 
                  : 'hover:bg-blue-50/50'
              }`}
            >
              <div className={`w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center transition-all duration-200 group-hover:shadow-xl rounded-xl ${
                selectedService === service.name ? 'bg-white' : 'bg-blue-50'
              }`}>
                <img
                  src={service.icon}
                  alt={service.name}
                  className="w-12 h-12 sm:w-16 sm:h-16 object-contain rounded-xl transition-all duration-200"
                />
              </div>
              <div className="text-center">
                <span className={`text-base font-medium block transition-colors duration-200 ${
                  selectedService === service.name 
                    ? 'text-blue-950' 
                    : 'text-blue-800 group-hover:text-blue-600'
                }`}>
                  {service.name}
                </span>
                <span className="text-sm text-gray-600 mt-1 block">
                  {service.price}
                </span>
                <span className="text-sm text-gray-500 mt-2 block">
                  {service.description}
                </span>
              </div>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </div>
  );
} 