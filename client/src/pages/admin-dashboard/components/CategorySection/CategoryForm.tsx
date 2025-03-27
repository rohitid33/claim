import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface CategoryFormProps {
  categoryName: string;
  setCategoryName: (value: string) => void;
  categoryIcon: string;
  setCategoryIcon: (value: string) => void;
  categoryNumber: number;
  setCategoryNumber: (value: number) => void;
  categoryTags: string[];
  setCategoryTags: (value: string[]) => void;
  editCategoryId: string | null;
  onAddCategory: () => void;
  onCancelEdit: () => void;
  isLoading?: boolean;
}

export function CategoryForm({
  categoryName,
  setCategoryName,
  categoryIcon,
  setCategoryIcon,
  categoryNumber,
  setCategoryNumber,
  categoryTags,
  setCategoryTags,
  editCategoryId,
  onAddCategory,
  onCancelEdit,
  isLoading = false
}: CategoryFormProps) {
  const [tagInput, setTagInput] = useState("");

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!categoryTags.includes(tagInput.trim())) {
        setCategoryTags([...categoryTags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setCategoryTags(categoryTags.filter(tag => tag !== tagToRemove));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{editCategoryId ? "Edit Category" : "Add New Category"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); onAddCategory(); }} className="space-y-6">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="categoryName" className="text-sm font-medium">
                  Category Name *
                </Label>
                <Input 
                  id="categoryName"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="e.g., Insurance"
                  required
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoryIcon" className="text-sm font-medium">
                  Icon (emoji)
                </Label>
                <Input 
                  id="categoryIcon"
                  value={categoryIcon}
                  onChange={(e) => setCategoryIcon(e.target.value)}
                  placeholder="e.g., 🔒"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Display Order Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Display Settings</h3>
            <div className="space-y-2">
              <Label htmlFor="categoryNumber" className="text-sm font-medium">
                Display Order
              </Label>
              <Input 
                id="categoryNumber"
                type="number"
                value={categoryNumber}
                onChange={(e) => setCategoryNumber(parseInt(e.target.value) || 0)}
                placeholder="0"
                className="w-full md:w-1/3"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter a number to control display order (lower numbers appear first)
              </p>
            </div>
          </div>

          <Separator />

          {/* Tags Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Tags</h3>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {categoryTags.map((tag, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="flex items-center gap-1 px-3 py-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-destructive focus:outline-none ml-2"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoryTags" className="text-sm font-medium">
                  Add Tags
                </Label>
                <Input 
                  id="categoryTags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Type a tag and press Enter"
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Add tags to help organize and filter categories (optional)
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              type="submit" 
              disabled={isLoading || !categoryName.trim()}
              className="px-8"
            >
              {isLoading ? "Processing..." : (editCategoryId ? "Update Category" : "Add Category")}
            </Button>
            {editCategoryId && (
              <Button 
                type="button"
                variant="outline" 
                onClick={onCancelEdit}
                className="px-8"
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}