/**
 * MAIN ADMIN DASHBOARD PAGE
 * 
 * This is the primary admin dashboard accessed via the router.
 * It manages categories, subcategories, and services with a tabbed interface.
 * This page uses data handling modules rather than direct API calls.
 * 
 * NOTE: There is a separate admin dashboard component in components/admin/admin-dashboard.tsx
 * which has similar functionality but different implementation details.
 */

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// Import custom hooks
import { useCategories } from "./hooks/useCategories";
import { useSubcategories } from "./hooks/useSubcategories";
import { useServices } from "./hooks/useServices";

// Import components
import { CategorySection } from "./components/CategorySection";
import { SubcategorySection } from "./components/SubcategorySection";
import { ServiceSection } from "./components/ServiceSection";

// Import data modules
import { updateServicesData } from "@/data/services-data";
import { updateCategoriesData } from "@/data/categories-data";
import { updateSubcategoriesData } from "@/data/subcategories-data";

export default function AdminDashboard() {
  const { toast } = useToast();
  
  // Use custom hooks for data management
  const categories = useCategories();
  const subcategories = useSubcategories();
  const services = useServices();
  
  // State for tracking changes and loading state
  const [isSaving, setIsSaving] = useState(false);
  
  // Check if there are any unsaved changes
  const hasUnsavedChanges = categories.hasChanges || subcategories.hasChanges || services.hasChanges;

  // Fetch initial data when component mounts
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await Promise.all([
          categories.fetchCategories(),
          subcategories.fetchSubcategories(),
          services.fetchServices()
        ]);
      } catch (error) {
        console.error('Error fetching initial data:', error);
        toast({
          title: "Error",
          description: "Failed to load initial data",
          variant: "destructive"
        });
      }
    };

    fetchInitialData();
  }, []); // Empty dependency array means this runs once on mount
  
  // Save changes to source code and database
  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const promises = [];
      
      // Update the services data in the MongoDB database
      if (services.hasChanges) {
        console.log("Saving services changes to MongoDB...");
        promises.push(updateServicesData(services.services));
      }
      
      // Update the categories data in the database
      if (categories.hasChanges) {
        console.log("Saving categories changes to MongoDB...");
        promises.push(updateCategoriesData(categories.categories));
      }
      
      // Update the subcategories data in the database
      if (subcategories.hasChanges) {
        console.log("Saving subcategories changes to MongoDB...");
        promises.push(updateSubcategoriesData(subcategories.subcategories));
      }
      
      await Promise.all(promises);
      
      toast({
        title: "Changes saved",
        description: "All changes have been saved to the database and will be reflected on the home screen and service pages.",
      });
      
      // Reset change flags
      categories.setHasChanges(false);
      subcategories.setHasChanges(false);
      services.setHasChanges(false);
      
      // Refresh data from the database
      await Promise.all([
        categories.fetchCategories(),
        subcategories.fetchSubcategories(),
        services.fetchServices()
      ]);
      
    } catch (error) {
      console.error("Error saving changes:", error);
      toast({
        title: "Error saving changes",
        description: "An error occurred while saving your changes to the database.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          
          {hasUnsavedChanges && (
            <Button 
              onClick={handleSaveChanges}
              className="bg-green-600 hover:bg-green-700"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save All Changes"}
            </Button>
          )}
        </div>
      </div>
      
      <Tabs defaultValue="categories">
        <TabsList className="mb-8">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="subcategories">Subcategories</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
        </TabsList>
        
        {/* Categories Tab */}
        <TabsContent value="categories">
          <CategorySection
            categories={categories.categories}
            subcategories={subcategories.subcategories}
            categoryName={categories.categoryName}
            setCategoryName={categories.setCategoryName}
            categoryIcon={categories.categoryIcon}
            setCategoryIcon={categories.setCategoryIcon}
            categoryNumber={categories.categoryNumber}
            setCategoryNumber={categories.setCategoryNumber}
            categoryTags={categories.categoryTags}
            setCategoryTags={categories.setCategoryTags}
            editCategoryId={categories.editCategoryId}
            setEditCategoryId={categories.setEditCategoryId}
            onAddCategory={categories.handleAddCategory}
            onDeleteCategory={categories.handleDeleteCategory}
            isLoading={categories.isLoading}
          />
        </TabsContent>
        
        {/* Subcategories Tab */}
        <TabsContent value="subcategories">
          <SubcategorySection
            subcategories={subcategories.subcategories}
            categories={categories.categories}
            services={services.services}
            subcategoryName={subcategories.subcategoryName}
            setSubcategoryName={subcategories.setSubcategoryName}
            selectedCategory={subcategories.selectedCategoryForSubcategory}
            setSelectedCategory={subcategories.setSelectedCategoryForSubcategory}
            selectedServices={subcategories.selectedServicesForSubcategory}
            setSelectedServices={subcategories.setSelectedServicesForSubcategory}
            editSubcategoryId={subcategories.editSubcategoryId}
            setEditSubcategoryId={subcategories.setEditSubcategoryId}
            onAddSubcategory={subcategories.handleAddSubcategory}
            onDeleteSubcategory={subcategories.handleDeleteSubcategory}
            isLoading={subcategories.isLoading}
          />
        </TabsContent>
        
        {/* Services Tab */}
        <TabsContent value="services">
          <ServiceSection
            services={services.services}
            categories={categories.categories}
            subcategories={subcategories.subcategories}
            serviceId={services.serviceId}
            setServiceId={services.setServiceId}
            serviceTitle={services.serviceTitle}
            setServiceTitle={services.setServiceTitle}
            serviceIcon={services.serviceIcon}
            setServiceIcon={services.setServiceIcon}
            serviceDescription={services.serviceDescription}
            setServiceDescription={services.setServiceDescription}
            serviceFeatures={services.serviceFeatures}
            setServiceFeatures={services.setServiceFeatures}
            servicePopular={services.servicePopular}
            setServicePopular={services.setServicePopular}
            serviceEligibility={services.serviceEligibility}
            setServiceEligibility={services.setServiceEligibility}
            serviceDocuments={services.serviceDocuments}
            setServiceDocuments={services.setServiceDocuments}
            serviceFaqs={services.serviceFaqs}
            setServiceFaqs={services.setServiceFaqs}
            faqQuestion={services.faqQuestion}
            setFaqQuestion={services.setFaqQuestion}
            faqAnswer={services.faqAnswer}
            setFaqAnswer={services.setFaqAnswer}
            serviceProcess={services.serviceProcess}
            setServiceProcess={services.setServiceProcess}
            processTitle={services.processTitle}
            setProcessTitle={services.setProcessTitle}
            processSteps={services.processSteps}
            setProcessSteps={services.setProcessSteps}
            contactPhone={services.contactPhone}
            setContactPhone={services.setContactPhone}
            contactEmail={services.contactEmail}
            setContactEmail={services.setContactEmail}
            selectedCategory={services.selectedCategory}
            setSelectedCategory={services.setSelectedCategory}
            selectedSubcategories={services.selectedSubcategoriesForService}
            setSelectedSubcategories={services.setSelectedSubcategoriesForService}
            activeServiceSection={services.activeServiceSection}
            setActiveServiceSection={services.setActiveServiceSection}
            editServiceId={services.editServiceId}
            setEditServiceId={services.setEditServiceId}
            onAddService={services.handleAddService}
            onDeleteService={services.handleDeleteService}
            isLoading={services.isLoading}
          />
        </TabsContent>
      </Tabs>
      
      {hasUnsavedChanges && (
        <div className="fixed bottom-20 right-4 z-50">
          <Button 
            onClick={handleSaveChanges}
            size="lg"
            className="bg-green-600 hover:bg-green-700 shadow-lg"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save All Changes"}
          </Button>
        </div>
      )}
      
      <div className="mt-8 p-4 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">
          <strong>Note:</strong> Click the "Save All Changes" button to persist your changes to the application's data.
          Changes will be immediately reflected on the home screen and service pages after saving.
          Without saving, changes will only be stored in memory and will be lost when the page is refreshed.
        </p>
      </div>
    </div>
  );
}