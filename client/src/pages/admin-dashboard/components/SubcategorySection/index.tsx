import React from "react";
import { SubcategoryForm } from "./SubcategoryForm";
import { SubcategoryCard } from "./SubcategoryCard";
import { CategoryData } from "@/data/categories-data";
import { ServiceData, SubcategoryData } from "@/components/services/service-template";

interface SubcategorySectionProps {
  subcategories: SubcategoryData[];
  categories: CategoryData[];
  services: ServiceData[];
  subcategoryName: string;
  setSubcategoryName: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  selectedServices: string[];
  setSelectedServices: (value: string[]) => void;
  editSubcategoryId: string | null;
  setEditSubcategoryId: (value: string | null) => void;
  onAddSubcategory: () => void;
  onDeleteSubcategory: (id: string) => void;
  isLoading: boolean;
}

export function SubcategorySection({
  subcategories,
  categories,
  services,
  subcategoryName,
  setSubcategoryName,
  selectedCategory,
  setSelectedCategory,
  selectedServices,
  setSelectedServices,
  editSubcategoryId,
  setEditSubcategoryId,
  onAddSubcategory,
  onDeleteSubcategory,
  isLoading
}: SubcategorySectionProps) {
  
  const handleEditSubcategory = (subcategory: SubcategoryData) => {
    setSubcategoryName(subcategory.name);
    setSelectedCategory(subcategory.categoryId);
    setSelectedServices(subcategory.serviceIds);
    setEditSubcategoryId(subcategory.id);
  };

  const handleCancelEdit = () => {
    setEditSubcategoryId(null);
    setSubcategoryName("");
    setSelectedCategory("");
    setSelectedServices([]);
  };

  const handleServiceSelection = (serviceId: string) => {
    if (selectedServices.includes(serviceId)) {
      setSelectedServices(selectedServices.filter(id => id !== serviceId));
    } else {
      setSelectedServices([...selectedServices, serviceId]);
    }
  };

  return (
    <>
      <div className="mb-8">
        <SubcategoryForm
          subcategoryName={subcategoryName}
          setSubcategoryName={setSubcategoryName}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedServices={selectedServices}
          onServiceSelection={handleServiceSelection}
          categories={categories}
          services={services}
          editSubcategoryId={editSubcategoryId}
          onAddSubcategory={onAddSubcategory}
          onCancelEdit={handleCancelEdit}
          isLoading={isLoading}
        />
      </div>
      
      <h2 className="text-2xl font-semibold mb-4">Existing Subcategories</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {subcategories.length > 0 ? (
          subcategories.map((subcategory) => (
            <SubcategoryCard 
              key={subcategory.id}
              subcategory={subcategory}
              categories={categories}
              services={services}
              onEdit={handleEditSubcategory}
              onDelete={onDeleteSubcategory}
            />
          ))
        ) : (
          <div className="col-span-3 text-center p-8">
            <p className="text-muted-foreground">No subcategories found. Add a new subcategory to get started.</p>
          </div>
        )}
      </div>
    </>
  );
}