import React, { useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface Service {
  name: string;
  icon: string;
  url: string;
  price: string;
  description: string;
}

interface DebtServices {
  [key: string]: Service[];
}

const debtServices: DebtServices = {
  "Credit Card Debt": [
    {
      name: "Credit Card Settlement",
      icon: "/icons/credit-card.png",
      url: "/vakilsutra/debt/credit-card-settlement",
      price: "Starting from ₹1,999",
      description: "Get relief from credit card debt with our settlement program"
    },
    {
      name: "Stop Harassment Calls",
      icon: "/icons/phone.png",
      url: "/vakilsutra/debt/stop-harassment",
      price: "Starting from ₹999",
      description: "Stop recovery agent harassment calls immediately"
    },
    {
      name: "Debt Management Plan",
      icon: "/icons/plan.png",
      url: "/vakilsutra/debt/debt-management",
      price: "Starting from ₹2,499",
      description: "Structured plan to manage and reduce credit card debt"
    }
  ],
  "Personal Loans": [
    {
      name: "Loan Settlement",
      icon: "/icons/loan.png",
      url: "/vakilsutra/debt/loan-settlement",
      price: "Starting from ₹2,999",
      description: "Settle your personal loans with better terms"
    },
    {
      name: "EMI Restructuring",
      icon: "/icons/emi.png",
      url: "/vakilsutra/debt/emi-restructuring",
      price: "Starting from ₹1,999",
      description: "Restructure your EMIs to make them more manageable"
    },
    {
      name: "One-Time Settlement",
      icon: "/icons/settlement.png",
      url: "/vakilsutra/debt/one-time-settlement",
      price: "Starting from ₹3,999",
      description: "Get a one-time settlement offer for your loan"
    }
  ],
  "Recovery Protection": [
    {
      name: "Anti-Harassment Service",
      icon: "/icons/shield.png",
      url: "/vakilsutra/debt/anti-harassment",
      price: "Starting from ₹999",
      description: "Comprehensive protection from recovery agent harassment"
    },
    {
      name: "Legal Notice Service",
      icon: "/icons/notice.png",
      url: "/vakilsutra/debt/legal-notice",
      price: "Starting from ₹1,499",
      description: "Send legal notices to stop harassment"
    },
    {
      name: "Recovery Agent Complaint",
      icon: "/icons/complaint.png",
      url: "/vakilsutra/debt/recovery-complaint",
      price: "Starting from ₹1,999",
      description: "File complaints against aggressive recovery agents"
    }
  ],
  "Debt Consolidation": [
    {
      name: "Multiple Debt Consolidation",
      icon: "/icons/consolidation.png",
      url: "/vakilsutra/debt/multiple-consolidation",
      price: "Starting from ₹3,999",
      description: "Combine multiple debts into a single payment"
    },
    {
      name: "Balance Transfer",
      icon: "/icons/transfer.png",
      url: "/vakilsutra/debt/balance-transfer",
      price: "Starting from ₹2,499",
      description: "Transfer high-interest debt to lower interest options"
    },
    {
      name: "Debt Restructuring",
      icon: "/icons/restructure.png",
      url: "/vakilsutra/debt/debt-restructuring",
      price: "Starting from ₹2,999",
      description: "Restructure your debts for better terms"
    }
  ],
  "Legal Services": [
    {
      name: "Legal Consultation",
      icon: "/icons/legal.png",
      url: "/vakilsutra/debt/legal-consultation",
      price: "Starting from ₹999",
      description: "Get expert legal advice on debt resolution"
    },
    {
      name: "Court Representation",
      icon: "/icons/court.png",
      url: "/vakilsutra/debt/court-representation",
      price: "Starting from ₹4,999",
      description: "Professional representation in debt-related cases"
    },
    {
      name: "Legal Documentation",
      icon: "/icons/document.png",
      url: "/vakilsutra/debt/legal-documentation",
      price: "Starting from ₹1,999",
      description: "Prepare and file legal documents for debt resolution"
    }
  ],
  "Business Debt": [
    {
      name: "Business Loan Settlement",
      icon: "/icons/business.png",
      url: "/vakilsutra/debt/business-settlement",
      price: "Starting from ₹4,999",
      description: "Settle business loans with favorable terms"
    },
    {
      name: "Business Debt Restructuring",
      icon: "/icons/restructure.png",
      url: "/vakilsutra/debt/business-restructuring",
      price: "Starting from ₹3,999",
      description: "Restructure business debts for better cash flow"
    },
    {
      name: "Business Legal Protection",
      icon: "/icons/protection.png",
      url: "/vakilsutra/debt/business-protection",
      price: "Starting from ₹2,999",
      description: "Legal protection for business debt issues"
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

  const services = debtServices[category] || [];

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