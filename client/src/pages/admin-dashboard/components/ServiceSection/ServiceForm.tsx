import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CategoryData } from "@/data/categories-data";
import { SubcategoryData } from "@/components/services/service-template";
import { ServiceFaqForm } from "./ServiceFaqForm";
import { ServiceProcessForm } from "./ServiceProcessForm";

interface ServiceFormProps {
  serviceId: string;
  setServiceId: (value: string) => void;
  serviceTitle: string;
  setServiceTitle: (value: string) => void;
  serviceIcon: string;
  setServiceIcon: (value: string) => void;
  serviceDescription: string;
  setServiceDescription: (value: string) => void;
  serviceFeatures: string;
  setServiceFeatures: (value: string) => void;
  servicePopular: boolean;
  setServicePopular: (value: boolean) => void;
  serviceEligibility: string;
  setServiceEligibility: (value: string) => void;
  serviceDocuments: string;
  setServiceDocuments: (value: string) => void;
  serviceFaqs: {question: string, answer: string}[];
  setServiceFaqs: (value: {question: string, answer: string}[]) => void;
  faqQuestion: string;
  setFaqQuestion: (value: string) => void;
  faqAnswer: string;
  setFaqAnswer: (value: string) => void;
  serviceProcess: {title: string, steps: string[]}[];
  setServiceProcess: (value: {title: string, steps: string[]}[]) => void;
  processTitle: string;
  setProcessTitle: (value: string) => void;
  processSteps: string;
  setProcessSteps: (value: string) => void;
  contactPhone: string;
  setContactPhone: (value: string) => void;
  contactEmail: string;
  setContactEmail: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  selectedSubcategories: string[];
  setSelectedSubcategories: (value: string[]) => void;
  categories: CategoryData[];
  subcategories: SubcategoryData[];
  activeSection: string;
  setActiveSection: (value: string) => void;
  editServiceId: string | null;
  onAddService: () => void;
  onCancelEdit: () => void;
  onAddFaq: () => void;
  onRemoveFaq: (index: number) => void;
  onAddProcess: () => void;
  onRemoveProcess: (index: number) => void;
  isLoading?: boolean;
}

export function ServiceForm({
  serviceId,
  setServiceId,
  serviceTitle,
  setServiceTitle,
  serviceIcon,
  setServiceIcon,
  serviceDescription,
  setServiceDescription,
  serviceFeatures,
  setServiceFeatures,
  servicePopular,
  setServicePopular,
  serviceEligibility,
  setServiceEligibility,
  serviceDocuments,
  setServiceDocuments,
  serviceFaqs,
  setServiceFaqs,
  faqQuestion,
  setFaqQuestion,
  faqAnswer,
  setFaqAnswer,
  serviceProcess,
  setServiceProcess,
  processTitle,
  setProcessTitle,
  processSteps,
  setProcessSteps,
  contactPhone,
  setContactPhone,
  contactEmail,
  setContactEmail,
  selectedCategory,
  setSelectedCategory,
  selectedSubcategories,
  setSelectedSubcategories,
  categories,
  subcategories,
  activeSection,
  setActiveSection,
  editServiceId,
  onAddService,
  onCancelEdit,
  onAddFaq,
  onRemoveFaq,
  onAddProcess,
  onRemoveProcess,
  isLoading = false
}: ServiceFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{editServiceId ? "Edit Service" : "Add New Service"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeSection} onValueChange={setActiveSection}>
          <TabsList className="mb-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="eligibility">Eligibility & Documents</TabsTrigger>
            <TabsTrigger value="process">Process</TabsTrigger>
            <TabsTrigger value="faqs">FAQs</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>
          
          {/* Basic Info Section */}
          <TabsContent value="basic">
            <div className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="serviceId">Service ID</Label>
                  <Input 
                    id="serviceId"
                    value={serviceId}
                    onChange={(e) => setServiceId(e.target.value)}
                    placeholder="e.g., health-claim"
                  />
                </div>
                <div>
                  <Label htmlFor="serviceTitle">Title</Label>
                  <Input 
                    id="serviceTitle"
                    value={serviceTitle}
                    onChange={(e) => setServiceTitle(e.target.value)}
                    placeholder="e.g., Health Insurance Claim"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="serviceIcon">Icon (emoji)</Label>
                  <Input 
                    id="serviceIcon"
                    value={serviceIcon}
                    onChange={(e) => setServiceIcon(e.target.value)}
                    placeholder="e.g., 🏥"
                  />
                </div>
                <div>
                  <Label htmlFor="serviceCategory">Category</Label>
                  <Select 
                    value={selectedCategory} 
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.icon} {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid gap-3 mt-4">
                <Label htmlFor="serviceSubcategories">Subcategories (Optional)</Label>
                <div className="border rounded p-3 max-h-60 overflow-y-auto">
                  {selectedCategory ? (
                    subcategories
                      .filter(subcat => subcat.categoryId === selectedCategory)
                      .map(subcat => (
                        <div key={subcat.id} className="flex items-center space-x-2 py-2">
                          <Checkbox
                            id={`subcategory-${subcat.id}`}
                            checked={selectedSubcategories.includes(subcat.id)}
                            onCheckedChange={() => {
                              if (selectedSubcategories.includes(subcat.id)) {
                                setSelectedSubcategories(
                                  selectedSubcategories.filter(id => id !== subcat.id)
                                );
                              } else {
                                setSelectedSubcategories([
                                  ...selectedSubcategories,
                                  subcat.id
                                ]);
                              }
                            }}
                          />
                          <Label 
                            htmlFor={`subcategory-${subcat.id}`} 
                            className="text-sm font-medium leading-none cursor-pointer"
                          >
                            {subcat.name}
                          </Label>
                        </div>
                      ))
                  ) : (
                    <p className="text-sm text-muted-foreground p-2">
                      Please select a category first to see available subcategories
                    </p>
                  )}
                  {selectedCategory && subcategories.filter(subcat => subcat.categoryId === selectedCategory).length === 0 && (
                    <p className="text-sm text-muted-foreground p-2">
                      No subcategories available for this category
                    </p>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Note: It's not necessary for a service to have a subcategory
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="servicePopular"
                  checked={servicePopular}
                  onCheckedChange={(checked) => setServicePopular(checked === true)}
                />
                <Label htmlFor="servicePopular" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Mark as popular service (will appear in the Popular Services section)
                </Label>
              </div>
              
              <div>
                <Label htmlFor="serviceDescription">Description</Label>
                <Textarea 
                  id="serviceDescription"
                  value={serviceDescription}
                  onChange={(e) => setServiceDescription(e.target.value)}
                  placeholder="Describe the service..."
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="serviceFeatures">Features (comma-separated)</Label>
                <Textarea 
                  id="serviceFeatures"
                  value={serviceFeatures}
                  onChange={(e) => setServiceFeatures(e.target.value)}
                  placeholder="Feature 1, Feature 2, Feature 3..."
                  rows={3}
                />
              </div>
            </div>
          </TabsContent>
          
          {/* Eligibility & Documents Section */}
          <TabsContent value="eligibility">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="serviceEligibility">Eligibility Criteria</Label>
                <Textarea 
                  id="serviceEligibility"
                  value={serviceEligibility}
                  onChange={(e) => setServiceEligibility(e.target.value)}
                  placeholder="Enter eligibility criteria..."
                  rows={3}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter the eligibility criteria as you want it to appear on the service page.
                </p>
              </div>
              
              <div>
                <Label htmlFor="serviceDocuments">Required Documents</Label>
                <Textarea 
                  id="serviceDocuments"
                  value={serviceDocuments}
                  onChange={(e) => setServiceDocuments(e.target.value)}
                  placeholder="Enter required documents..."
                  rows={3}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter the required documents as you want them to appear on the service page.
                </p>
              </div>
            </div>
          </TabsContent>
          
          {/* Process Section */}
          <TabsContent value="process">
            <ServiceProcessForm
              processes={serviceProcess}
              processTitle={processTitle}
              setProcessTitle={setProcessTitle}
              processSteps={processSteps}
              setProcessSteps={setProcessSteps}
              onAddProcess={onAddProcess}
              onRemoveProcess={onRemoveProcess}
            />
          </TabsContent>
          
          {/* FAQs Section */}
          <TabsContent value="faqs">
            <ServiceFaqForm
              faqs={serviceFaqs}
              faqQuestion={faqQuestion}
              setFaqQuestion={setFaqQuestion}
              faqAnswer={faqAnswer}
              setFaqAnswer={setFaqAnswer}
              onAddFaq={onAddFaq}
              onRemoveFaq={onRemoveFaq}
            />
          </TabsContent>
          
          {/* Contact Section */}
          <TabsContent value="contact">
            <div className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactPhone">Phone Number</Label>
                  <Input 
                    id="contactPhone"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="e.g., +1 (800) 123-4567"
                  />
                </div>
                <div>
                  <Label htmlFor="contactEmail">Email Address</Label>
                  <Input 
                    id="contactEmail"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="e.g., service@example.com"
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex gap-2 mt-6">
          <Button 
            onClick={onAddService} 
            disabled={isLoading}
            className="min-w-[120px]"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {editServiceId ? "Updating..." : "Adding..."}
              </div>
            ) : (
              editServiceId ? "Update Service" : "Add Service"
            )}
          </Button>
          {editServiceId && (
            <Button 
              variant="outline" 
              onClick={onCancelEdit}
              disabled={isLoading}
            >
              Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}