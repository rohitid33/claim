import { useState, useEffect } from "react";
import { SubcategoryData } from "@/components/services/service-template";
import { useToast } from "@/hooks/use-toast";
import { 
  getAllSubcategories, 
  updateSubcategoriesData, 
  createSubcategory, 
  deleteSubcategory 
} from "@/data/subcategories-data";

export function useSubcategories() {
  const [subcategories, setSubcategories] = useState<SubcategoryData[]>([]);
  const [subcategoryName, setSubcategoryName] = useState("");
  const [selectedCategoryForSubcategory, setSelectedCategoryForSubcategory] = useState("");
  const [selectedServicesForSubcategory, setSelectedServicesForSubcategory] = useState<string[]>([]);
  const [editSubcategoryId, setEditSubcategoryId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    fetchSubcategories();
  }, []);

  const fetchSubcategories = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching subcategories from API...");
      const data = await getAllSubcategories();
      console.log("Fetched subcategories:", data);
      setSubcategories(data);
    } catch (error) {
      console.error('Error loading subcategories:', error);
      toast({
        title: "Error loading subcategories",
        description: "There was a problem loading the subcategories.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveSubcategories = async () => {
    setIsLoading(true);
    try {
      console.log("Saving subcategories to MongoDB...");
      await updateSubcategoriesData(subcategories);
      console.log("Subcategories saved successfully");
      setHasChanges(false);
      toast({
        title: "Success",
        description: "Subcategories saved to database successfully",
      });
    } catch (error) {
      console.error('Error saving subcategories:', error);
      toast({
        title: "Error saving subcategories",
        description: "There was a problem saving the subcategories to the database.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSubcategory = async () => {
    if (!subcategoryName.trim()) {
      toast({
        title: "Error",
        description: "Subcategory name is required",
        variant: "destructive"
      });
      return;
    }

    if (!selectedCategoryForSubcategory) {
      toast({
        title: "Error",
        description: "Please select a category",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      console.log("=== Adding new subcategory ===");
      console.log("Form data:", {
        name: subcategoryName,
        categoryId: selectedCategoryForSubcategory,
        selectedServices: selectedServicesForSubcategory
      });
      
      // Generate a slug-style ID for the subcategory
      const id = editSubcategoryId || subcategoryName.toLowerCase().replace(/\s+/g, '-');
      
      const subcategoryData = { 
        id, 
        name: subcategoryName, 
        categoryId: selectedCategoryForSubcategory, 
        serviceIds: selectedServicesForSubcategory 
      };
      
      console.log("Generated subcategory data:", subcategoryData);
      
      if (editSubcategoryId) {
        // Update existing subcategory
        console.log("Updating existing subcategory:", subcategoryData);
        setSubcategories(subcategories.map(subcat => 
          subcat.id === editSubcategoryId ? subcategoryData : subcat
        ));
      } else {
        // Add new subcategory
        console.log("Adding new subcategory:", subcategoryData);
        
        // First update local state
        setSubcategories([...subcategories, subcategoryData]);
        
        // Then try to create it immediately in the database
        try {
          await createSubcategory(subcategoryData);
          console.log("Subcategory created in database:", subcategoryData.id);
        } catch (error) {
          console.error("Error creating subcategory in database:", error);
          // Remove from local state if database creation failed
          setSubcategories(subcategories.filter(subcat => subcat.id !== subcategoryData.id));
          throw error;
        }
      }
      
      // Reset form
      setSubcategoryName("");
      setSelectedCategoryForSubcategory("");
      setSelectedServicesForSubcategory([]);
      setEditSubcategoryId(null);
      setHasChanges(true);
      
      toast({
        title: editSubcategoryId ? "Subcategory updated" : "Subcategory added",
        description: `The subcategory has been ${editSubcategoryId ? "updated" : "added"} successfully.`,
      });
    } catch (error) {
      console.error("Error adding/updating subcategory:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "There was a problem with the subcategory operation",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSubcategory = async (id: string) => {
    if (window.confirm(`Are you sure you want to delete this subcategory?`)) {
      try {
        setIsLoading(true);
        
        // First update local state
        setSubcategories(subcategories.filter(subcat => subcat.id !== id));
        
        // Then delete from database
        await deleteSubcategory(id);
        
        setHasChanges(true);
        
        toast({
          title: "Subcategory deleted",
          description: "The subcategory has been deleted successfully.",
        });
      } catch (error) {
        console.error(`Error deleting subcategory ${id}:`, error);
        
        // Restore the subcategory in local state if deletion failed
        const deletedSubcategory = subcategories.find(subcat => subcat.id === id);
        if (deletedSubcategory) {
          setSubcategories([...subcategories]);
        }
        
        toast({
          title: "Error deleting subcategory",
          description: error instanceof Error ? error.message : "There was a problem deleting the subcategory.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleServiceSelection = (serviceId: string) => {
    if (selectedServicesForSubcategory.includes(serviceId)) {
      setSelectedServicesForSubcategory(selectedServicesForSubcategory.filter(id => id !== serviceId));
    } else {
      setSelectedServicesForSubcategory([...selectedServicesForSubcategory, serviceId]);
    }
  };

  return {
    subcategories,
    setSubcategories,
    subcategoryName,
    setSubcategoryName,
    selectedCategoryForSubcategory,
    setSelectedCategoryForSubcategory,
    selectedServicesForSubcategory,
    setSelectedServicesForSubcategory,
    editSubcategoryId,
    setEditSubcategoryId,
    isLoading,
    hasChanges,
    setHasChanges,
    fetchSubcategories,
    saveSubcategories,
    handleAddSubcategory,
    handleDeleteSubcategory,
    handleServiceSelection
  };
}