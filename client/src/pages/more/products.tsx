import React from "react";
import { Button } from "@/components/ui/button";

const products = [
  {
    id: 1,
    title: "Claim Assistance Pro",
    category: "Service",
    description: "End-to-end support for complex insurance claims with dedicated case managers.",
    features: [
      "Dedicated claim manager",
      "Document preparation and submission",
      "Follow-up with insurance companies",
      "Appeal support for rejected claims",
      "Legal consultation if needed"
    ],
    price: "Starting at ₹2,999",
    popular: true
  },
  {
    id: 2,
    title: "Legal Document Review",
    category: "Service",
    description: "Expert review of insurance policies and legal documents with detailed analysis.",
    features: [
      "Thorough policy analysis",
      "Identification of coverage gaps",
      "Plain language explanation",
      "Recommendation report",
      "30-minute consultation"
    ],
    price: "Starting at ₹1,499",
    popular: false
  },
  {
    id: 3,
    title: "Insurance Claim Toolkit",
    category: "Digital Product",
    description: "Comprehensive digital toolkit with templates, checklists, and guides for DIY claim filing.",
    features: [
      "Claim submission templates",
      "Document checklists by claim type",
      "Video tutorials",
      "Sample appeal letters",
      "FAQ database"
    ],
    price: "₹799 one-time purchase",
    popular: false
  },
  {
    id: 4,
    title: "Corporate Claim Management",
    category: "Enterprise Service",
    description: "Complete claim management solution for businesses with multiple insurance policies.",
    features: [
      "Policy portfolio management",
      "Employee claim assistance",
      "Quarterly claim reviews",
      "Optimization recommendations",
      "Dedicated account manager"
    ],
    price: "Custom pricing",
    popular: false
  },
  {
    id: 5,
    title: "Claim Tracker Plus",
    category: "Subscription",
    description: "Real-time tracking and updates for all your insurance claims in one dashboard.",
    features: [
      "Centralized claim dashboard",
      "Status notifications",
      "Document storage",
      "Communication history",
      "Reminder system"
    ],
    price: "₹299/month",
    popular: true
  },
  {
    id: 6,
    title: "Insurance Literacy Course",
    category: "Educational",
    description: "Comprehensive online course to understand insurance policies and claim processes.",
    features: [
      "10 detailed modules",
      "Interactive exercises",
      "Real case studies",
      "Certificate of completion",
      "Resource library access"
    ],
    price: "₹1,999 one-time purchase",
    popular: false
  }
];

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Our Products & Services</h1>
      
      <p className="text-lg mb-8">
        Claimsutra offers a range of products and services designed to help you navigate the complex world of insurance claims and legal matters. Whether you need hands-on assistance or self-service tools, we have solutions to meet your needs.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {products.map((product) => (
          <div 
            key={product.id} 
            className={`bg-card rounded-lg overflow-hidden shadow-md border ${
              product.popular ? 'border-primary' : 'border-transparent'
            }`}
          >
            {product.popular && (
              <div className="bg-primary text-white text-center py-1 text-sm font-medium">
                Popular Choice
              </div>
            )}
            <div className="p-6">
              <div className="text-sm text-muted-foreground mb-2">{product.category}</div>
              <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
              <p className="mb-4">{product.description}</p>
              
              <h4 className="font-medium mb-2">Features:</h4>
              <ul className="space-y-1 mb-6">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="flex justify-between items-center mt-auto">
                <div className="font-bold text-lg">{product.price}</div>
                <Button>Learn More</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <section className="bg-primary/10 p-8 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Need a Custom Solution?</h2>
        <p className="mb-6">
          We understand that every situation is unique. Contact us to discuss your specific needs and how we can tailor our services to help you.
        </p>
        <Button>Contact Our Team</Button>
      </section>
    </div>
  );
}