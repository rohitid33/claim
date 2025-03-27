import React, { useState, useEffect } from "react";
import CategorySelector from "./category-selector";
import CategoryContent from "./category-content";

interface VakilsutraSelectCategoryProps {
  searchQuery?: string;
}

const legalCategories = [
  {
    name: "Consumer Complaint",
    icon: "/icons/motor.png",
    url: "/vakilsutra/consumer"
  },
  {
    name: "Business Incorporation",
    icon: "/icons/motor.png",
    url: "/vakilsutra/corporate"
  },
  {
    name: "Intellectual Property",
    icon: "/icons/motor.png",
    url: "/vakilsutra/ip"
  },
  {
    name: "Debt Relief",
    icon: "/icons/motor.png",
    url: "/vakilsutra/debt"
  },
  {
    name: "Labor & Compliance",
    icon: "/icons/motor.png",
    url: "/vakilsutra/labor"
  },
  {
    name: "Tax & Financial Compliance",
    icon: "/icons/motor.png",
    url: "/vakilsutra/tax"
  },
  {
    name: "Personal & Civil Services",
    icon: "/icons/motor.png",
    url: "/vakilsutra/property"
  },
  {
    name: "Property related Services",
    icon: "/icons/motor.png",
    url: "/vakilsutra/property"
  },
  {
    name: "Cyber Fraud",
    icon: "/icons/motor.png",
    url: "/vakilsutra/cyber"
  }
];

export default function VakilsutraSelectCategory({ searchQuery = "" }: VakilsutraSelectCategoryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(legalCategories[0].name);

  useEffect(() => {
    const filteredCategories = legalCategories.filter(category =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filteredCategories.length > 0 && !filteredCategories.some(cat => cat.name === selectedCategory)) {
      setSelectedCategory(filteredCategories[0].name);
    }
  }, [searchQuery]);

  return (
    <div className="space-y-6">
      <CategorySelector
        categories={legalCategories}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
        searchQuery={searchQuery}
      />
      <CategoryContent category={selectedCategory} />
    </div>
  );
} 