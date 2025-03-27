import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CategoryData } from "@/data/categories-data";
import { SubcategoryData } from "@/components/services/service-template";

interface CategoryCardProps {
  category: CategoryData;
  subcategories: SubcategoryData[];
  onEdit: (category: CategoryData) => void;
  onDelete: (id: string) => void;
}

export function CategoryCard({ category, subcategories, onEdit, onDelete }: CategoryCardProps) {
  const categorySubcategories = subcategories.filter(
    subcat => subcat.categoryId === category.id
  );

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{category.icon}</span>
            <h3 className="text-lg font-semibold">{category.name}</h3>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(category)}>
              Edit
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => onDelete(category.id)}
            >
              Delete
            </Button>
          </div>
        </div>

        {/* Display tags if they exist */}
        {category.tags && category.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {category.tags.map((tag, index) => (
              <Badge key={index} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Display subcategories */}
        {categorySubcategories.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-muted-foreground mb-2">Subcategories:</p>
            <div className="flex flex-wrap gap-2">
              {categorySubcategories.map((subcat) => (
                <Badge key={subcat.id} variant="outline">
                  {subcat.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}