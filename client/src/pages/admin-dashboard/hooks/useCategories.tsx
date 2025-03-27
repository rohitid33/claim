import { useState } from "react";
import { CategoryData } from "@/data/categories-data";
import { useToast } from "@/hooks/use-toast";

export function useCategories() {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const [categoryIcon, setCategoryIcon] = useState("");
  const [categoryNumber, setCategoryNumber] = useState(0);
  const [categoryTags, setCategoryTags] = useState<string[]>([]);
  const [editCategoryId, setEditCategoryId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  const { toast } = useToast();

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      const mappedCategories = data.map((category: any) => ({
        id: category.id,
        name: category.name,
        icon: category.icon || '📄',
        number: category.number || 0,
        tags: Array.isArray(category.tags) ? category.tags : []
      }));
      setCategories(mappedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!categoryName.trim()) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const categoryData = {
        name: categoryName,
        icon: categoryIcon,
        number: categoryNumber,
        tags: categoryTags
      };

      let response;
      if (editCategoryId) {
        // Update existing category
        response = await fetch(`/api/categories/${editCategoryId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(categoryData)
        });
      } else {
        // Create new category
        response = await fetch('/api/categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(categoryData)
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save category');
      }

      const savedCategory = await response.json();
      
      if (editCategoryId) {
        setCategories(categories.map(cat => 
          cat.id === editCategoryId ? savedCategory : cat
        ));
        setEditCategoryId(null);
      } else {
        setCategories([...categories, savedCategory]);
      }

      // Reset form
      setCategoryName("");
      setCategoryIcon("");
      setCategoryNumber(0);
      setCategoryTags([]);
      
      toast({
        title: editCategoryId ? "Category updated" : "Category added",
        description: `The category has been ${editCategoryId ? "updated" : "added"} successfully.`,
      });
    } catch (error) {
      console.error('Error saving category:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save category",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm(`Are you sure you want to delete this category?`)) {
      setCategories(categories.filter(cat => cat.id !== id));
      setHasChanges(true);
      
      toast({
        title: "Category deleted",
        description: "The category has been deleted from the local changes.",
      });
    }
  };

  return {
    categories,
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
    isLoading,
    hasChanges,
    setHasChanges,
    fetchCategories,
    handleAddCategory,
    handleDeleteCategory
  };
}