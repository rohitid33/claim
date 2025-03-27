import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryData } from "@/data/categories-data";
import { ServiceData, SubcategoryData } from "@/components/services/service-template";

interface ServiceCardProps {
  service: ServiceData;
  categories: CategoryData[];
  subcategories: SubcategoryData[];
  onEdit: (service: ServiceData) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export function ServiceCard({
  service,
  categories,
  subcategories,
  onEdit,
  onDelete,
  isLoading = false
}: ServiceCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete this service?`)) {
      setIsDeleting(true);
      try {
        await onDelete(service.id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <Card key={service.id}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span>{service.icon}</span>
            {service.title}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(service)}
              disabled={isLoading || isDeleting}
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={isLoading || isDeleting}
            >
              {isDeleting ? (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Deleting...
                </div>
              ) : (
                "Delete"
              )}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm text-muted-foreground">ID: {service.id}</span>
          {service.category && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
              {categories.find(c => c.id === service.category)?.name || service.category}
            </span>
          )}
          {service.popular && (
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
              Popular
            </span>
          )}
        </div>
        
        {/* Display subcategories for this service */}
        {service.subcategoryIds && service.subcategoryIds.length > 0 && (
          <div className="mb-2">
            <span className="text-xs font-medium">Subcategories: </span>
            <div className="flex flex-wrap gap-1 mt-1">
              {service.subcategoryIds.map(subcatId => {
                const subcat = subcategories.find(s => s.id === subcatId);
                return (
                  <span key={subcatId} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {subcat?.name || subcatId}
                  </span>
                );
              })}
            </div>
          </div>
        )}
        
        <p className="text-sm mb-4 line-clamp-2">{service.description}</p>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {service.eligibility && service.eligibility.length > 0 && (
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
              {service.eligibility.length} eligibility criteria
            </span>
          )}
          {service.process && service.process.length > 0 && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {service.process.length} process phases
            </span>
          )}
          {service.documents && service.documents.length > 0 && (
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
              {service.documents.length} documents
            </span>
          )}
          {service.faqs && service.faqs.length > 0 && (
            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
              {service.faqs.length} FAQs
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}