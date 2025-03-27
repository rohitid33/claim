import React, { useEffect, useRef } from "react";

interface Category {
  name: string;
  icon: string;
  url: string;
}

interface CategorySelectorProps {
  categories: Category[];
  selectedCategory: string;
  onCategorySelect: (categoryName: string) => void;
  searchQuery?: string;
}

export default function CategorySelector({ 
  categories, 
  selectedCategory, 
  onCategorySelect,
  searchQuery = "" 
}: CategorySelectorProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const hasScrolled = useRef(false);

  useEffect(() => {
    if (!hasScrolled.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollWidth = container.scrollWidth;
      const clientWidth = container.clientWidth;
      
      if (scrollWidth > clientWidth) {
        container.scrollTo({
          left: scrollWidth - clientWidth,
          behavior: 'smooth'
        });
        
        setTimeout(() => {
          container.scrollTo({
            left: 0,
            behavior: 'smooth'
          });
        }, 1000);
      }
      
      hasScrolled.current = true;
    }
  }, []);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-gradient-to-b from-white via-blue-50/30 to-white rounded-2xl p-6 shadow-sm border border-blue-100">
      <h2 className="text-2xl font-semibold text-blue-950 mb-6">Select Your Category</h2>
      <div 
        ref={scrollContainerRef}
        className="flex items-start gap-4 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {filteredCategories.map((category, index) => (
          <div 
            key={index}
            onClick={() => onCategorySelect(category.name)}
            className={`flex flex-col items-center w-[120px] min-w-[120px] h-[160px] cursor-pointer group transition-all duration-200 ${
              selectedCategory === category.name 
                ? 'bg-blue-600 rounded-xl p-3' 
                : 'p-3'
            }`}
          >
            <div className="w-14 h-14 flex items-center justify-center mb-3">
              <img
                src={category.icon}
                alt={category.name}
                className={`w-full h-full object-contain transition-all duration-200 ${
                  selectedCategory === category.name
                    ? 'brightness-0 invert'
                    : ''
                }`}
              />
            </div>
            <div className="flex-1 flex items-center">
              <span className={`text-sm font-medium text-center transition-colors duration-200 w-full ${
                selectedCategory === category.name
                  ? 'text-white'
                  : 'text-blue-950 group-hover:text-blue-800'
              }`}>
                {category.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 