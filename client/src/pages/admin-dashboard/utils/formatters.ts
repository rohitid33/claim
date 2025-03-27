import { CategoryData } from "@/data/categories-data";
import { ServiceData, SubcategoryData } from "@/components/services/service-template";

// Format ID from a name string
export const formatId = (name: string): string => {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
};

// Parse comma-separated string into an array
export const parseCommaSeparated = (value: string): string[] => {
  return value.split(',').map(item => item.trim()).filter(Boolean);
};

// Format category for display
export const formatCategoryName = (categoryId: string, categories: CategoryData[]): string => {
  const category = categories.find(c => c.id === categoryId);
  return category ? category.name : categoryId;
};

// Format subcategory names from IDs
export const formatSubcategoryNames = (
  subcategoryIds: string[] | undefined, 
  subcategories: SubcategoryData[]
): string[] => {
  if (!subcategoryIds) return [];
  
  return subcategoryIds.map(id => {
    const subcategory = subcategories.find(s => s.id === id);
    return subcategory ? subcategory.name : id;
  });
};

// Generate a summary of service details
export const getServiceSummary = (service: ServiceData): string => {
  const summary = [];
  
  if (service.eligibility && service.eligibility.length > 0) {
    summary.push(`${service.eligibility.length} eligibility criteria`);
  }
  
  if (service.process && service.process.length > 0) {
    summary.push(`${service.process.length} process phases`);
  }
  
  if (service.documents && service.documents.length > 0) {
    summary.push(`${service.documents.length} documents required`);
  }
  
  if (service.faqs && service.faqs.length > 0) {
    summary.push(`${service.faqs.length} FAQs`);
  }
  
  return summary.join(', ');
};