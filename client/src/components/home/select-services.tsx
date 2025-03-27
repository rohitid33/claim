import React, { useState } from "react";

interface SelectServicesProps {
  category: string;
}

interface Service {
  name: string;
  icon: string;
  url: string;
}

interface GeneralInsuranceServices {
  [key: string]: Service[];
}

const motorInsuranceServices: Service[] = [
  {
    name: "Motor Theft Claim",
    icon: "/icons/cartheft.png",
    url: "/service/67d87dd8586ae9b3babb7d63"
  },
  {
    name: "Motor Accident Insurance Claim",
    icon: "/icons/accident.png",
    url: "/service/67d7f548aee5a4ad962514e0"
  },
  {
    name: "Third Party Accident Claims",
    icon: "/icons/thirdparty.png",
    url: "/service/67d7d0b9ba8af0c60c60b7a0"
  }
];

const generalInsuranceServices: GeneralInsuranceServices = {
  FIRE: [
    {
      name: "Fire Damage Claim",
      icon: "/icons/fire-damage.png",
      url: "/service/fire-damage-claim"
    },
    {
      name: "Business Interruption",
      icon: "/icons/business-interruption.png",
      url: "/service/business-interruption"
    },
    {
      name: "Fire Safety Audit",
      icon: "/icons/fire-safety.png",
      url: "/service/fire-safety-audit"
    }
  ],
  PROPERTY: [
    {
      name: "Property Damage",
      icon: "/icons/property-damage.png",
      url: "/service/property-damage"
    },
    {
      name: "Natural Calamity",
      icon: "/icons/natural-calamity.png",
      url: "/service/natural-calamity"
    },
    {
      name: "Theft & Burglary",
      icon: "/icons/theft-burglary.png",
      url: "/service/theft-burglary"
    }
  ],
  MARINE: [
    {
      name: "Cargo Insurance",
      icon: "/icons/cargo-insurance.png",
      url: "/service/cargo-insurance"
    },
    {
      name: "Ship Insurance",
      icon: "/icons/ship-insurance.png",
      url: "/service/ship-insurance"
    },
    {
      name: "Marine Liability",
      icon: "/icons/marine-liability.png",
      url: "/service/marine-liability"
    }
  ],
  "HOME INSURANCE": [
    {
      name: "Home Structure",
      icon: "/icons/home-structure.png",
      url: "/service/home-structure"
    },
    {
      name: "Contents Insurance",
      icon: "/icons/contents-insurance.png",
      url: "/service/contents-insurance"
    },
    {
      name: "Personal Liability",
      icon: "/icons/personal-liability.png",
      url: "/service/personal-liability"
    }
  ]
};

export default function SelectServices({ category }: SelectServicesProps) {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const getServices = () => {
    switch (category) {
      case "Motor Insurance":
        return motorInsuranceServices;
      case "General Insurance":
        return generalInsuranceServices;
      default:
        return [];
    }
  };

  const services = getServices();

  const handleServiceClick = (serviceName: string, url: string) => {
    setSelectedService(serviceName);
    window.location.href = url;
  };

  return (
    <div className="mt-6 pt-4 border-t border-blue-100">
      <h3 className="text-lg font-semibold text-blue-950 mb-4">{category} Services</h3>
      {category === "General Insurance" ? (
        <div className="space-y-8">
          {Object.entries(generalInsuranceServices).map(([subcategory, subServices]) => (
            <div key={subcategory}>
              <h4 className="text-md font-medium text-blue-800 mb-4">{subcategory}</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {subServices.map((service: Service, index: number) => (
                  <div 
                    key={index}
                    onClick={() => handleServiceClick(service.name, service.url)}
                    className={`flex flex-col items-center gap-2 sm:gap-3 p-2 sm:p-4 cursor-pointer group ${
                      selectedService === service.name ? 'bg-blue-50 rounded-xl' : ''
                    }`}
                  >
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center transition-all duration-200 group-hover:shadow-xl rounded-xl sm:rounded-2xl ${
                      selectedService === service.name ? 'bg-white' : 'bg-blue-50'
                    }`}>
                      <img
                        src={service.icon}
                        alt={service.name}
                        className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-xl sm:rounded-2xl transition-all duration-200 group-hover:shadow-lg"
                      />
                    </div>
                    <span className={`text-sm sm:text-base font-medium text-center transition-colors duration-200 ${
                      selectedService === service.name 
                        ? 'text-blue-950' 
                        : 'text-blue-800 group-hover:text-blue-600'
                    }`}>
                      {service.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {(services as Service[]).map((service: Service, index: number) => (
            <div 
              key={index}
              onClick={() => handleServiceClick(service.name, service.url)}
              className={`flex flex-col items-center gap-2 sm:gap-3 p-2 sm:p-4 cursor-pointer group ${
                selectedService === service.name ? 'bg-blue-50 rounded-xl' : ''
              }`}
            >
              <div className={`w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center transition-all duration-200 group-hover:shadow-xl rounded-xl sm:rounded-2xl ${
                selectedService === service.name ? 'bg-white' : 'bg-blue-50'
              }`}>
                <img
                  src={service.icon}
                  alt={service.name}
                  className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-xl sm:rounded-2xl transition-all duration-200 group-hover:shadow-lg"
                />
              </div>
              <span className={`text-sm sm:text-base font-medium text-center transition-colors duration-200 ${
                selectedService === service.name 
                  ? 'text-blue-950' 
                  : 'text-blue-800 group-hover:text-blue-600'
              }`}>
                {service.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}