import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CategoryData } from "@/data/categories-data";
import { ServiceData } from "@/components/services/service-template";

interface SubcategoryFormProps {
  subcategoryName: string;
  setSubcategoryName: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  selectedServices: string[];
  onServiceSelection: (serviceId: string) => void;
  categories: CategoryData[];
  services: ServiceData[];
  editSubcategoryId: string | null;
  onAddSubcategory: () => void;
  onCancelEdit: () => void;
  isLoading?: boolean;
}

export function SubcategoryForm({
  subcategoryName,
  setSubcategoryName,
  selectedCategory,
  setSelectedCategory,
  selectedServices,
  onServiceSelection,
  categories,
  services,
  editSubcategoryId,
  onAddSubcategory,
  onCancelEdit,
  isLoading = false
}: SubcategoryFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{editSubcategoryId ? "Edit Subcategory" : "Add New Subcategory"}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="subcategoryName">Subcategory Name</Label>
              <Input 
                id="subcategoryName"
                value={subcategoryName}
                onChange={(e) => setSubcategoryName(e.target.value)}
                placeholder="e.g., Corporate Law"
              />
            </div>
            <div>
              <Label htmlFor="subcategoryCategory">Category</Label>
              <Select 
                value={selectedCategory} 
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger id="subcategoryCategory">
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
          
          <div>
            <Label>Services Linked</Label>
            <div className="border rounded p-3 max-h-60 overflow-y-auto mt-2">
              {services.map(service => (
                <div key={service.id} className="flex items-center space-x-2 py-2">
                  <Checkbox 
                    id={`service-${service.id}`}
                    checked={selectedServices.includes(service.id)}
                    onCheckedChange={() => onServiceSelection(service.id)}
                  />
                  <Label htmlFor={`service-${service.id}`} className="cursor-pointer">
                    {service.title}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={onAddSubcategory} disabled={isLoading}>
              {isLoading ? "Processing..." : (editSubcategoryId ? "Update Subcategory" : "Add Subcategory")}
            </Button>
            {editSubcategoryId && (
              <Button variant="outline" onClick={onCancelEdit}>
                Cancel
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}