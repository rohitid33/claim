// Helper functions for handling icon paths

/**
 * Format the filename by:
 * 1. Converting to lowercase
 * 2. Replacing spaces with hyphens
 * 3. Removing special characters
 * @param name The name to format
 * @returns Formatted filename
 */
const formatFileName = (name: string): string => {
  if (!name) return '';
  
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')        // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, '')  // Remove special characters
    .replace(/-+/g, '-')         // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, '');    // Remove leading/trailing hyphens
};

/**
 * Get the icon path for a category
 * @param categoryId The ID of the category
 * @returns The path to the category icon
 */
export const getCategoryIconPath = (categoryId: string): string => {
  if (!categoryId) return '';
  
  const fileName = formatFileName(categoryId);
  if (!fileName) return '';
  
  return `/icons/categories/${fileName}.png`;
};

/**
 * Get the icon path for a service
 * @param serviceId The ID of the service
 * @returns The path to the service icon
 */
export const getServiceIconPath = (serviceId: string): string => {
  if (!serviceId) return '';
  
  const fileName = formatFileName(serviceId);
  if (!fileName) return '';
  
  return `/icons/services/${fileName}.png`;
};

/**
 * Check if an image exists at the given path
 * @param path The path to check
 * @returns Promise that resolves to boolean indicating if image exists
 */
export const checkImageExists = async (path: string): Promise<boolean> => {
  if (!path) return false;
  
  try {
    const response = await fetch(path, {
      method: 'HEAD', // Only fetch headers, not the whole image
      cache: 'no-cache' // Don't cache the check results
    });
    return response.ok;
  } catch (error) {
    console.error('Error checking image existence:', error);
    return false;
  }
}; 