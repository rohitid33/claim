import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CategoryData } from "@/data/categories-data";
import { ServiceData, SubcategoryData } from "@/components/services/service-template";

interface SubcategoryCardProps {
  subcategory: SubcategoryData;
  categories: CategoryData[];
  services: ServiceData[];
  onEdit: (subcategory: SubcategoryData) => void;
  onDelete: (id: string) => void;
}

export function SubcategoryCard({ subcategory, categories, services, onEdit, onDelete }: SubcategoryCardProps) {
  return (
    <Card key={subcategory.id}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">{subcategory.name}</h3>
          <span className="text-sm text-muted-foreground">ID: {subcategory.id}</span>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3">
          Category: {categories.find(c => c.id === subcategory.categoryId)?.name || subcategory.categoryId}
        </p>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Linked Services:</h4>
          <ul className="list-disc list-inside text-sm">
            {subcategory.serviceIds.map(serviceId => (
              <li key={serviceId}>
                {services.find(s => s.id === serviceId)?.title || serviceId}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="flex gap-2 mt-4">
          <Button 
            variant="outline" 
            onClick={() => onEdit(subcategory)}
          >
            Edit
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => onDelete(subcategory.id)}
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}