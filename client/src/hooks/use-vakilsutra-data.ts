import { useState, useEffect } from 'react';
import { getAllCategories, CategoryData } from '@/data/categories-data';
import { getAllSubcategories, SubcategoryData } from '@/data/subcategories-data';
import { getAllServices } from '@/data/services-data';
import { ServiceData } from '@/components/services/service-template';

// Extend the interfaces to include number property
interface ExtendedSubcategoryData extends SubcategoryData {
  number?: number;
}

interface ExtendedServiceData extends ServiceData {
  number?: number;
}

interface VakilsutraCategory extends CategoryData {
  subcategories: (ExtendedSubcategoryData & {
    services: ExtendedServiceData[];
  })[];
}

export function useVakilsutraData() {
  const [categories, setCategories] = useState<VakilsutraCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch all data
        const [allCategories, allSubcategories, allServices] = await Promise.all([
          getAllCategories(),
          getAllSubcategories(),
          getAllServices()
        ]);

        // Filter and sort categories for vakilsutra
        const vakilsutraCategories = allCategories
          .filter(category => {
            // Filter categories that have 'vakilsutra' tag or are related to legal services
            return (
              category.tags?.includes('vakilsutra') ||
              category.name.toLowerCase().includes('legal') ||
              category.name.toLowerCase().includes('law')
            );
          })
          .sort((a, b) => {
            // Sort by number property, defaulting to 0 if not set
            const aNumber = a.number ?? 0;
            const bNumber = b.number ?? 0;
            return aNumber - bNumber;
          })
          .map(category => {
            // Get and sort subcategories
            const categorySubcategories = allSubcategories
              .filter(sub => sub.categoryId === category.id)
              .sort((a, b) => {
                // Sort subcategories by number if available
                const aNumber = (a as ExtendedSubcategoryData).number ?? 0;
                const bNumber = (b as ExtendedSubcategoryData).number ?? 0;
                return aNumber - bNumber;
              })
              .map(subcategory => {
                // Get and sort services
                const subcategoryServices = allServices
                  .filter(service => subcategory.serviceIds.includes(service.id))
                  .sort((a, b) => {
                    // Sort services by number if available
                    const aNumber = (a as ExtendedServiceData).number ?? 0;
                    const bNumber = (b as ExtendedServiceData).number ?? 0;
                    return aNumber - bNumber;
                  });

                return {
                  ...subcategory,
                  services: subcategoryServices as ExtendedServiceData[]
                } as ExtendedSubcategoryData & { services: ExtendedServiceData[] };
              });

            return {
              ...category,
              subcategories: categorySubcategories
            };
          });

        setCategories(vakilsutraCategories);
      } catch (error) {
        console.error('Error fetching vakilsutra data:', error);
        setError('Failed to load categories. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  return { categories, isLoading, error };
} 