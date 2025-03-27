import React, { useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface Service {
  name: string;
  icon: string;
  url: string;
}

interface CorporateServices {
  [key: string]: Service[];
}

const corporateServices: CorporateServices = {
  "Business Entity Registration": [
    {
      name: "Private Limited Company",
      icon: "/icons/motor.png",
      url: "/vakilsutra/corporate/private-limited-company"
    },
    {
      name: "Limited Liability Partnership",
      icon: "/icons/motor.png",
      url: "/vakilsutra/corporate/llp"
    },
    {
      name: "One Person Company",
      icon: "/icons/motor.png",
      url: "/vakilsutra/corporate/opc"
    },
    {
      name: "Sole Proprietorship",
      icon: "/icons/motor.png",
      url: "/vakilsutra/corporate/sole-proprietorship"
    },
    {
      name: "Nidhi Company",
      icon: "/icons/motor.png",
      url: "/vakilsutra/corporate/nidhi-company"
    },
    {
      name: "Producer Company",
      icon: "/icons/motor.png",
      url: "/vakilsutra/corporate/producer-company"
    },
    {
      name: "Partnership Firm",
      icon: "/icons/motor.png",
      url: "/vakilsutra/corporate/partnership-firm"
    },
    {
      name: "Startup India Registration",
      icon: "/icons/motor.png",
      url: "/vakilsutra/corporate/startup-india"
    },
    {
      name: "Company Name Search",
      icon: "/icons/motor.png",
      url: "/vakilsutra/corporate/company-name-search"
    },
    {
      name: "Digital Signature Certificate",
      icon: "/icons/motor.png",
      url: "/vakilsutra/corporate/dsc"
    }
  ],
  "Business Agreements": [
    {
      name: "Non-Disclosure Agreement",
      icon: "/icons/motor.png",
      url: "/vakilsutra/corporate/nda"
    },
    {
      name: "Service Level Agreement",
      icon: "/icons/motor.png",
      url: "/vakilsutra/corporate/sla"
    },
    {
      name: "Franchise Agreement",
      icon: "/icons/motor.png",
      url: "/vakilsutra/corporate/franchise-agreement"
    },
    {
      name: "Master Service Agreement",
      icon: "/icons/motor.png",
      url: "/vakilsutra/corporate/msa"
    },
    {
      name: "Shareholders Agreement",
      icon: "/icons/motor.png",
      url: "/vakilsutra/corporate/shareholders-agreement"
    },
    {
      name: "Joint Venture Agreement",
      icon: "/icons/motor.png",
      url: "/vakilsutra/corporate/joint-venture"
    },
    {
      name: "Founders Agreement",
      icon: "/icons/motor.png",
      url: "/vakilsutra/corporate/founders-agreement"
    },
    {
      name: "Vendor Agreement",
      icon: "/icons/motor.png",
      url: "/vakilsutra/corporate/vendor-agreement"
    },
    {
      name: "Consultancy Agreement",
      icon: "/icons/motor.png",
      url: "/vakilsutra/corporate/consultancy-agreement"
    },
    {
      name: "Memorandum of Understanding",
      icon: "/icons/motor.png",
      url: "/vakilsutra/corporate/mou"
    },
    {
      name: "Scope of Work Agreement",
      icon: "/icons/motor.png",
      url: "/vakilsutra/corporate/sow"
    }
  ],
  "Legal & Compliance Documents": [
    {
      name: "Terms of Service",
      icon: "/icons/motor.png",
      url: "/vakilsutra/corporate/terms-of-service"
    },
    {
      name: "GDPR",
      icon: "/icons/motor.png",
      url: "/vakilsutra/corporate/gdpr"
    },
    {
      name: "Disclaimer",
      icon: "/icons/motor.png",
      url: "/vakilsutra/corporate/disclaimer"
    }
  ],
  "Company Structure & Governance": [
    {
      name: "Add a Director",
      icon: "/icons/motor.png",
      url: "/vakilsutra/corporate/add-director"
    },
    {
      name: "Remove a Director",
      icon: "/icons/motor.png",
      url: "/vakilsutra/corporate/remove-director"
    },
    {
      name: "Increase Authorized Capital",
      icon: "/icons/motor.png",
      url: "/vakilsutra/corporate/increase-capital"
    },
    {
      name: "Change Objective/Activity",
      icon: "/icons/motor.png",
      url: "/vakilsutra/corporate/change-objective"
    },
    {
      name: "Change Address",
      icon: "/icons/motor.png",
      url: "/vakilsutra/corporate/change-address"
    },
    {
      name: "Change Company Name",
      icon: "/icons/motor.png",
      url: "/vakilsutra/corporate/change-name"
    },
    {
      name: "Private Limited Company / OPC",
      icon: "/icons/motor.png",
      url: "/vakilsutra/corporate/plc-to-opc"
    },
    {
      name: "Limited Liability Partnership",
      icon: "/icons/motor.png",
      url: "/vakilsutra/corporate/llp-conversion"
    },
    {
      name: "Proprietorship to Pvt Ltd",
      icon: "/icons/motor.png",
      url: "/vakilsutra/corporate/proprietorship-to-plc"
    },
    {
      name: "Partnership to LLP",
      icon: "/icons/motor.png",
      url: "/vakilsutra/corporate/partnership-to-llp"
    },
    {
      name: "Private to Public Limited",
      icon: "/icons/motor.png",
      url: "/vakilsutra/corporate/private-to-public"
    },
    {
      name: "Private to One Person Company",
      icon: "/icons/motor.png",
      url: "/vakilsutra/corporate/private-to-opc"
    }
  ],
  "Company Closure & Dissolution": [
    {
      name: "Close the Pvt Ltd Company",
      icon: "/icons/motor.png",
      url: "/vakilsutra/corporate/close-plc"
    },
    {
      name: "Close the LLP",
      icon: "/icons/motor.png",
      url: "/vakilsutra/corporate/close-llp"
    }
  ],
  "LLP-Specific Compliance": [
    {
      name: "Add Designated Partner",
      icon: "/icons/motor.png",
      url: "/vakilsutra/corporate/add-designated-partner"
    },
    {
      name: "Changes to LLP Agreement",
      icon: "/icons/motor.png",
      url: "/vakilsutra/corporate/llp-agreement-changes"
    }
  ],
  "NGO Related": [
    {
      name: "NGO Registration",
      icon: "/icons/motor.png",
      url: "/vakilsutra/corporate/ngo-registration"
    },
    {
      name: "Section 8 Company",
      icon: "/icons/motor.png",
      url: "/vakilsutra/corporate/section-8"
    },
    {
      name: "Trust Registration",
      icon: "/icons/motor.png",
      url: "/vakilsutra/corporate/trust-registration"
    },
    {
      name: "Society Registration",
      icon: "/icons/motor.png",
      url: "/vakilsutra/corporate/society-registration"
    },
    {
      name: "NGO Compliance",
      icon: "/icons/motor.png",
      url: "/vakilsutra/corporate/ngo-compliance"
    },
    {
      name: "Section 8 Compliance",
      icon: "/icons/motor.png",
      url: "/vakilsutra/corporate/section-8-compliance"
    },
    {
      name: "CSR-1 Filing",
      icon: "/icons/motor.png",
      url: "/vakilsutra/corporate/csr-filing"
    },
    {
      name: "Sec.80G & Sec.12A",
      icon: "/icons/motor.png",
      url: "/vakilsutra/corporate/80g-12a"
    },
    {
      name: "Darpan Registration",
      icon: "/icons/motor.png",
      url: "/vakilsutra/corporate/darpan"
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

  const services = corporateServices[category] || [];

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
              </div>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </div>
  );
} 