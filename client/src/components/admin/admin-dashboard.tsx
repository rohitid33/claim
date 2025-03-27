/**
 * ALTERNATIVE ADMIN DASHBOARD COMPONENT
 * 
 * IMPORTANT: This is NOT the main admin dashboard currently used in the application.
 * The main dashboard is located at pages/admin-dashboard/index.tsx
 * 
 * This component provides an alternative implementation of the admin dashboard with:
 * - Direct API calls to endpoints (/api/categories, /api/subcategories, etc.)
 * - Grid-based layout for managing entities
 * - Different UI structure from the main dashboard
 * 
 * Consider either:
 * 1. Using this as a replacement if preferred over the main dashboard
 * 2. Extracting reusable parts into smaller components
 * 3. Merging unique functionality into the main dashboard
 * 4. Renaming to 'LegacyAdminDashboard' or 'AdminDashboardAlternative' for clarity
 */

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ServiceData, SubcategoryData } from "../services/service-template";
import { useToast } from "@/hooks/use-toast";
import { Category, Subcategory } from "@shared/schema";

// Define the AppService interface
interface AppService {
  id?: string;
  title: string;
  description: string;
  icon?: string;
  category?: string;
  subcategoryIds?: string[];
  features?: string[];
}

// Renamed from AdminDashboard to AlternativeAdminDashboard for clarity
export function AlternativeAdminDashboard() {
  // State for form inputs
  const [categoryName, setCategoryName] = useState("");
  const [subcategoryName, setSubcategoryName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  
  // AppService form inputs
  const [appServiceName, setAppServiceName] = useState("");
  const [appServiceDescription, setAppServiceDescription] = useState("");
  const [appServiceIcon, setAppServiceIcon] = useState("📄");
  const [appServiceCategory, setAppServiceCategory] = useState("");
  const [selectedAppServiceSubcategories, setSelectedAppServiceSubcategories] = useState<string[]>([]);
  
  // State for data
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [services, setServices] = useState<ServiceData[]>([]);
  const [appServices, setAppServices] = useState<AppService[]>([]);
  
  // State for loading and errors
  const [isLoading, setIsLoading] = useState({
    categories: false,
    subcategories: false,
    services: false,
    appServices: false
  });
  
  const { toast } = useToast();

  // Fetch categories, subcategories, services, and app services on component mount
  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
    fetchServices();
    fetchAppServices();
  }, []);

  // Fetch categories from API
  const fetchCategories = async () => {
    setIsLoading(prev => ({ ...prev, categories: true }));
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive"
      });
    } finally {
      setIsLoading(prev => ({ ...prev, categories: false }));
    }
  };

  // Fetch subcategories from API
  const fetchSubcategories = async () => {
    setIsLoading(prev => ({ ...prev, subcategories: true }));
    try {
      const response = await fetch('/api/subcategories');
      if (!response.ok) {
        throw new Error('Failed to fetch subcategories');
      }
      const data = await response.json();
      setSubcategories(data);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      toast({
        title: "Error",
        description: "Failed to load subcategories",
        variant: "destructive"
      });
    } finally {
      setIsLoading(prev => ({ ...prev, subcategories: false }));
    }
  };

  // Fetch services from API
  const fetchServices = async () => {
    setIsLoading(prev => ({ ...prev, services: true }));
    try {
      const response = await fetch('/api/services');
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }
      const data = await response.json();
      console.log("Services data received:", data);
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast({
        title: "Error",
        description: "Failed to load services",
        variant: "destructive"
      });
    } finally {
      setIsLoading(prev => ({ ...prev, services: false }));
    }
  };

  // Add a new category
  const handleAddCategory = async () => {
    if (!categoryName.trim()) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: categoryName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create category');
      }

      const newCategory = await response.json();
      setCategories([...categories, newCategory]);
      setCategoryName('');
      
      toast({
        title: "Success",
        description: "Category added successfully",
      });
    } catch (error) {
      console.error('Error adding category:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add category",
        variant: "destructive"
      });
    }
  };

  // Delete a category
  const handleDeleteCategory = async (id: string) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete category');
      }

      setCategories(categories.filter(category => category.id !== id));
      
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete category",
        variant: "destructive"
      });
    }
  };

  // Add a new subcategory
  const handleAddSubcategory = async () => {
    if (!subcategoryName.trim()) {
      toast({
        title: "Error",
        description: "Subcategory name is required",
        variant: "destructive"
      });
      return;
    }

    if (!selectedCategory) {
      toast({
        title: "Error",
        description: "Please select a category",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch('/api/subcategories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name: subcategoryName,
          categoryId: selectedCategory,
          serviceIds: selectedSubcategories
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create subcategory');
      }

      const newSubcategory = await response.json();
      setSubcategories([...subcategories, newSubcategory]);
      setSubcategoryName('');
      setSelectedSubcategories([]);
      
      toast({
        title: "Success",
        description: "Subcategory added successfully",
      });
    } catch (error) {
      console.error('Error adding subcategory:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add subcategory",
        variant: "destructive"
      });
    }
  };

  // Delete a subcategory
  const handleDeleteSubcategory = async (id: string) => {
    try {
      const response = await fetch(`/api/subcategories/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete subcategory');
      }

      setSubcategories(subcategories.filter(subcategory => subcategory.id !== id));
      
      toast({
        title: "Success",
        description: "Subcategory deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting subcategory:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete subcategory",
        variant: "destructive"
      });
    }
  };

  // Handler for subcategory service selection
  const handleServiceSelection = (serviceId: string) => {
    if (selectedSubcategories.includes(serviceId)) {
      setSelectedSubcategories(selectedSubcategories.filter(id => id !== serviceId));
    } else {
      setSelectedSubcategories([...selectedSubcategories, serviceId]);
    }
  };

  // Add a new service
  const handleAddService = async () => {
    if (!serviceName.trim()) {
      toast({
        title: "Error",
        description: "Service name is required",
        variant: "destructive"
      });
      return;
    }

    if (!serviceDescription.trim()) {
      toast({
        title: "Error",
        description: "Service description is required",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(prev => ({ ...prev, services: true }));
    
    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          title: serviceName,
          description: serviceDescription
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create service');
      }

      const newService = await response.json();
      console.log("New service created:", newService);
      
      // Add the new service to the state
      setServices([...services, newService]);
      
      // Reset form fields
      setServiceName('');
      setServiceDescription('');
      
      toast({
        title: "Success",
        description: "Service added successfully",
      });
    } catch (error) {
      console.error('Error adding service:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add service",
        variant: "destructive"
      });
    } finally {
      setIsLoading(prev => ({ ...prev, services: false }));
    }
  };

  // Fetch app services from API
  const fetchAppServices = async () => {
    setIsLoading(prev => ({ ...prev, appServices: true }));
    try {
      const response = await fetch('/api/appservices');
      if (!response.ok) {
        throw new Error('Failed to fetch app services');
      }
      const data = await response.json();
      console.log("App services data received:", data);
      setAppServices(data);
    } catch (error) {
      console.error('Error fetching app services:', error);
      toast({
        title: "Error",
        description: "Failed to load app services",
        variant: "destructive"
      });
    } finally {
      setIsLoading(prev => ({ ...prev, appServices: false }));
    }
  };

  // Add a new app service
  const handleAddAppService = async () => {
    if (!appServiceName.trim()) {
      toast({
        title: "Error",
        description: "Service name is required",
        variant: "destructive"
      });
      return;
    }

    if (!appServiceDescription.trim()) {
      toast({
        title: "Error",
        description: "Service description is required",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(prev => ({ ...prev, appServices: true }));
    
    try {
      const response = await fetch('/api/appservices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          title: appServiceName,
          description: appServiceDescription,
          icon: appServiceIcon,
          category: appServiceCategory,
          subcategoryIds: selectedAppServiceSubcategories
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create app service');
      }

      const newAppService = await response.json();
      console.log("New app service created:", newAppService);
      
      // Add the new app service to the state
      setAppServices([...appServices, newAppService]);
      
      // Reset form fields
      setAppServiceName('');
      setAppServiceDescription('');
      setAppServiceIcon('📄');
      setAppServiceCategory('');
      setSelectedAppServiceSubcategories([]);
      
      toast({
        title: "Success",
        description: "App service added successfully",
      });
    } catch (error) {
      console.error('Error adding app service:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add app service",
        variant: "destructive"
      });
    } finally {
      setIsLoading(prev => ({ ...prev, appServices: false }));
    }
  };

  // Delete an app service
  const handleDeleteAppService = async (id: string) => {
    try {
      const response = await fetch(`/api/appservices/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete app service');
      }

      // Remove the deleted app service from the state
      setAppServices(appServices.filter(service => service.id !== id));
      
      toast({
        title: "Success",
        description: "App service deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting app service:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete app service",
        variant: "destructive"
      });
    }
  };

  // Delete a service
  const handleDeleteService = async (id: string) => {
    try {
      const response = await fetch(`/api/services/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete service');
      }

      // Remove the deleted service from the state
      setServices(services.filter(service => service.id !== id));
      
      toast({
        title: "Success",
        description: "Service deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting service:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete service",
        variant: "destructive"
      });
    }
  };

  // Handler for app service subcategory selection
  const handleAppServiceSubcategorySelection = (subcategoryId: string) => {
    if (selectedAppServiceSubcategories.includes(subcategoryId)) {
      setSelectedAppServiceSubcategories(selectedAppServiceSubcategories.filter(id => id !== subcategoryId));
    } else {
      setSelectedAppServiceSubcategories([...selectedAppServiceSubcategories, subcategoryId]);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col mb-6">
        <div className="mb-3">
          <Button variant="default" onClick={() => window.location.reload()} className="w-full">
            Services
          </Button>
        </div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Management */}
        <Card>
          <CardHeader>
            <CardTitle>Manage Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="categoryName">Category Name</Label>
                <Input 
                  id="categoryName" 
                  placeholder="Enter category name" 
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                />
              </div>
              <Button onClick={handleAddCategory} disabled={isLoading.categories}>
                {isLoading.categories ? "Adding..." : "Add Category"}
              </Button>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Existing Categories</h3>
                <div className="grid gap-2">
                  {categories.length === 0 && !isLoading.categories && (
                    <p className="text-muted-foreground">No categories found</p>
                  )}
                  
                  {isLoading.categories ? (
                    <p>Loading categories...</p>
                  ) : (
                    categories.map(category => (
                      <div key={category.id} className="flex justify-between items-center p-3 border rounded">
                        <span>{category.name}</span>
                        <div>
                          <Button variant="outline" size="sm" className="mr-2">Edit</Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteCategory(category.id!)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Subcategory Management */}
        <Card>
          <CardHeader>
            <CardTitle>Manage Subcategories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="subcategoryName">Subcategory Name</Label>
                <Input 
                  id="subcategoryName" 
                  placeholder="Enter subcategory name" 
                  value={subcategoryName}
                  onChange={(e) => setSubcategoryName(e.target.value)}
                />
              </div>
              
              <div className="grid gap-3">
                <Label htmlFor="categorySelect">Category</Label>
                <Select 
                  value={selectedCategory} 
                  onValueChange={setSelectedCategory}
                  disabled={isLoading.categories || categories.length === 0}
                >
                  <SelectTrigger id="categorySelect">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id!}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-3">
                <Label>Services Linked</Label>
                <div className="border rounded p-3 max-h-60 overflow-y-auto">
                  {services.length === 0 && !isLoading.services ? (
                    <p className="text-muted-foreground">No services found</p>
                  ) : isLoading.services ? (
                    <p>Loading services...</p>
                  ) : (
                    services.map(service => (
                      <div key={service.id} className="flex items-center space-x-2 py-2">
                        <Checkbox 
                          id={`service-${service.id}`} 
                          checked={selectedSubcategories.includes(service.id)}
                          onCheckedChange={() => handleServiceSelection(service.id)}
                        />
                        <Label htmlFor={`service-${service.id}`} className="cursor-pointer">
                          {service.title}
                        </Label>
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              <Button 
                onClick={handleAddSubcategory} 
                disabled={isLoading.subcategories || !selectedCategory}
              >
                {isLoading.subcategories ? "Adding..." : "Add Subcategory"}
              </Button>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Existing Subcategories</h3>
                <div className="grid gap-2 max-h-60 overflow-y-auto">
                  {subcategories.length === 0 && !isLoading.subcategories && (
                    <p className="text-muted-foreground">No subcategories found</p>
                  )}
                  
                  {isLoading.subcategories ? (
                    <p>Loading subcategories...</p>
                  ) : (
                    subcategories.map(subcategory => (
                      <div key={subcategory.id} className="p-3 border rounded">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">{subcategory.name}</span>
                          <div>
                            <Button variant="outline" size="sm" className="mr-2">Edit</Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDeleteSubcategory(subcategory.id!)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Category: {categories.find(c => c.id === subcategory.categoryId)?.name || 'Unknown'}
                        </p>
                        {subcategory.serviceIds && subcategory.serviceIds.length > 0 && (
                          <div className="text-sm">
                            <span className="font-medium">Linked Services:</span>
                            <ul className="list-disc list-inside mt-1">
                              {subcategory.serviceIds.map(serviceId => (
                                <li key={serviceId}>
                                  {services.find(s => s.id === serviceId)?.title || 'Unknown Service'}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Service Management */}
        <Card>
          <CardHeader>
            <CardTitle>Manage Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="serviceName">Service Name</Label>
                <Input 
                  id="serviceName" 
                  placeholder="Enter service name" 
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                />
              </div>
              
              <div className="grid gap-3">
                <Label htmlFor="serviceDescription">Description</Label>
                <Input 
                  id="serviceDescription" 
                  placeholder="Enter service description" 
                  value={serviceDescription}
                  onChange={(e) => setServiceDescription(e.target.value)}
                />
              </div>
              
              <div className="grid gap-3">
                <Label htmlFor="serviceCategorySelect">Category</Label>
                <Select disabled={isLoading.categories || categories.length === 0}>
                  <SelectTrigger id="serviceCategorySelect">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id!}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-3">
                <Label>Subcategories</Label>
                <div className="border rounded p-3 max-h-60 overflow-y-auto">
                  {subcategories.length === 0 && !isLoading.subcategories ? (
                    <p className="text-muted-foreground">No subcategories found</p>
                  ) : isLoading.subcategories ? (
                    <p>Loading subcategories...</p>
                  ) : (
                    subcategories.map(subcategory => (
                      <div key={subcategory.id} className="flex items-center space-x-2 py-2">
                        <Checkbox id={`subcategory-${subcategory.id}`} />
                        <Label htmlFor={`subcategory-${subcategory.id}`} className="cursor-pointer">
                          {subcategory.name}
                        </Label>
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              <Button 
                onClick={handleAddService}
                disabled={isLoading.services || !serviceName || !serviceDescription}
              >
                {isLoading.services ? "Adding..." : "Add Service"}
              </Button>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Existing Services</h3>
                <div className="grid gap-2 max-h-60 overflow-y-auto">
                  {services.length === 0 && !isLoading.services ? (
                    <div>
                      <p className="text-muted-foreground mb-2">No services found</p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={async () => {
                          try {
                            const response = await fetch('/api/test-create-service');
                            const data = await response.json();
                            console.log("Test service creation response:", data);
                            fetchServices(); // Refresh services after creating a test one
                            toast({
                              title: "Success",
                              description: "Test service created successfully",
                            });
                          } catch (error) {
                            console.error('Error creating test service:', error);
                            toast({
                              title: "Error",
                              description: "Failed to create test service",
                              variant: "destructive"
                            });
                          }
                        }}
                      >
                        Create Test Service
                      </Button>
                    </div>
                  ) : isLoading.services ? (
                    <p>Loading services...</p>
                  ) : (
                    services.map(service => (
                      <div key={service.id} className="flex justify-between items-center p-3 border rounded">
                        <div>
                          <span className="font-medium">{service.title}</span>
                          <p className="text-sm text-muted-foreground">
                            {service.description?.substring(0, 50)}...
                          </p>
                        </div>
                        <div>
                          <Button variant="outline" size="sm" className="mr-2">Edit</Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteService(service.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* App Service Management */}
        <Card>
          <CardHeader>
            <CardTitle>Manage App Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="appServiceName">App Service Name</Label>
                <Input 
                  id="appServiceName" 
                  placeholder="Enter app service name" 
                  value={appServiceName}
                  onChange={(e) => setAppServiceName(e.target.value)}
                />
              </div>
              
              <div className="grid gap-3">
                <Label htmlFor="appServiceDescription">Description</Label>
                <Input 
                  id="appServiceDescription" 
                  placeholder="Enter app service description" 
                  value={appServiceDescription}
                  onChange={(e) => setAppServiceDescription(e.target.value)}
                />
              </div>
              
              <div className="grid gap-3">
                <Label htmlFor="appServiceIcon">Icon (emoji)</Label>
                <Input 
                  id="appServiceIcon" 
                  placeholder="Enter icon (emoji)" 
                  value={appServiceIcon}
                  onChange={(e) => setAppServiceIcon(e.target.value)}
                />
              </div>
              
              <div className="grid gap-3">
                <Label htmlFor="appServiceCategorySelect">Category</Label>
                <Select 
                  value={appServiceCategory} 
                  onValueChange={setAppServiceCategory}
                  disabled={isLoading.categories || categories.length === 0}
                >
                  <SelectTrigger id="appServiceCategorySelect">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id!}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-3">
                <Label>Subcategories</Label>
                <div className="border rounded p-3 max-h-60 overflow-y-auto">
                  {subcategories.length === 0 && !isLoading.subcategories ? (
                    <p className="text-muted-foreground">No subcategories found</p>
                  ) : isLoading.subcategories ? (
                    <p>Loading subcategories...</p>
                  ) : (
                    subcategories.map(subcategory => (
                      <div key={subcategory.id} className="flex items-center space-x-2 py-2">
                        <Checkbox 
                          id={`app-subcategory-${subcategory.id}`} 
                          checked={selectedAppServiceSubcategories.includes(subcategory.id!)}
                          onCheckedChange={() => handleAppServiceSubcategorySelection(subcategory.id!)}
                        />
                        <Label htmlFor={`app-subcategory-${subcategory.id}`} className="cursor-pointer">
                          {subcategory.name}
                        </Label>
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              <Button 
                onClick={handleAddAppService}
                disabled={isLoading.appServices || !appServiceName || !appServiceDescription}
              >
                {isLoading.appServices ? "Adding..." : "Add App Service"}
              </Button>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Existing App Services</h3>
                <div className="grid gap-2 max-h-60 overflow-y-auto">
                  {appServices.length === 0 && !isLoading.appServices ? (
                    <p className="text-muted-foreground">No app services found</p>
                  ) : isLoading.appServices ? (
                    <p>Loading app services...</p>
                  ) : (
                    appServices.map(service => (
                      <div key={service.id} className="flex justify-between items-center p-3 border rounded">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{service.icon}</span>
                            <span className="font-medium">{service.title}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {service.description?.substring(0, 50)}...
                          </p>
                        </div>
                        <div>
                          <Button variant="outline" size="sm" className="mr-2">Edit</Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteAppService(service.id!)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
)};