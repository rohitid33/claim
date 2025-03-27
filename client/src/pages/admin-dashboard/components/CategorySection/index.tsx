import React from "react";
import { CategoryForm } from "./CategoryForm";
import { CategoryCard } from "./CategoryCard";
import { CategoryData } from "@/data/categories-data";
import { SubcategoryData } from "@/components/services/service-template";

interface CategorySectionProps {
  categories: CategoryData[];
  subcategories: SubcategoryData[];
  categoryName: string;
  setCategoryName: (value: string) => void;
  categoryIcon: string;
  setCategoryIcon: (value: string) => void;
  categoryNumber: number;
  setCategoryNumber: (value: number) => void;
  categoryTags: string[];
  setCategoryTags: (value: string[]) => void;
  editCategoryId: string | null;
  setEditCategoryId: (value: string | null) => void;
  onAddCategory: () => void;
  onDeleteCategory: (id: string) => void;
  isLoading: boolean;
}

export function CategorySection({
  categories,
  subcategories,
  categoryName,
  setCategoryName,
  categoryIcon,
  setCategoryIcon,
  categoryNumber,
  setCategoryNumber,
  categoryTags,
  setCategoryTags,
  editCategoryId,
  setEditCategoryId,
  onAddCategory,
  onDeleteCategory,
  isLoading
}: CategorySectionProps) {
  
  const handleEditCategory = (category: CategoryData) => {
    setCategoryName(category.name);
    setCategoryIcon(category.icon);
    setCategoryNumber(category.number || 0);
    setCategoryTags(category.tags || []);
    setEditCategoryId(category.id);
  };

  const handleCancelEdit = () => {
    setEditCategoryId(null);
    setCategoryName("");
    setCategoryIcon("");
    setCategoryNumber(0);
    setCategoryTags([]);
  };

  return (
    <>
      <div className="mb-8">
        <CategoryForm
          categoryName={categoryName}
          setCategoryName={setCategoryName}
          categoryIcon={categoryIcon}
          setCategoryIcon={setCategoryIcon}
          categoryNumber={categoryNumber}
          setCategoryNumber={setCategoryNumber}
          categoryTags={categoryTags}
          setCategoryTags={setCategoryTags}
          editCategoryId={editCategoryId}
          onAddCategory={onAddCategory}
          onCancelEdit={handleCancelEdit}
          isLoading={isLoading}
        />
      </div>
      
      <h2 className="text-2xl font-semibold mb-4">Existing Categories</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.isArray(categories) && categories.length > 0 ? (
          categories.map((category) => (
            <CategoryCard 
              key={category.id}
              category={category}
              subcategories={subcategories}
              onEdit={handleEditCategory}
              onDelete={onDeleteCategory}
            />
          ))
        ) : (
          <div className="col-span-3 text-center p-8">
            <p className="text-muted-foreground">No categories found. Add a new category to get started.</p>
          </div>
        )}
      </div>
    </>
  );
}