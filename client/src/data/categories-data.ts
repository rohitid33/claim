// Define the Category interface
export interface CategoryData {
  id: string;
  name: string;
  icon: string;
  number?: number; // Added number field as optional
  tags?: string[]; // Optional array of tags
}

// Empty array for when no categories are available
const emptyCategoriesArray: CategoryData[] = [];

// In-memory cache of categories
let categoriesCache: CategoryData[] = [];
let isLoading = false;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// For reactive updates - store subscribers
let subscribers: (() => void)[] = [];

// Function to map database categories to CategoryData
function mapDbCategoryToUi(dbCategory: any): CategoryData {
  // Use the icon from the database if it exists
  let icon = dbCategory.icon;
  
  // Only apply default mapping if no icon is set
  if (!icon) {
    const name = dbCategory.name.toLowerCase();
    
    if (name.includes("insurance")) icon = "🔒";
    else if (name.includes("debt") || name.includes("loan")) icon = "💰";
    else if (name.includes("consumer") || name.includes("dispute")) icon = "🛒";
    else if (name.includes("trademark") || name.includes("ip")) icon = "™️";
    else if (name.includes("business") || name.includes("ngo")) icon = "🏢";
    else if (name.includes("property") || name.includes("personal")) icon = "🏠";
    else icon = "📄"; // Default icon if no mapping matches
  }
  
  // Generate an ID from the name if none exists
  const id = dbCategory.id || dbCategory.name.replace(/\s+/g, '-').toLowerCase();
  
  return {
    id,
    name: dbCategory.name,
    icon,
    number: dbCategory.number !== undefined ? dbCategory.number : 0,
    tags: dbCategory.tags || []
  };
}

// Helper function to fetch categories from the API
async function fetchCategoriesFromApi(): Promise<CategoryData[]> {
  try {
    const response = await fetch('/api/categories');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Map the database categories to our UI format
    return data.map(mapDbCategoryToUi);
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Return empty array if API fails
    return [];
  }
}

// Helper functions
export async function getAllCategories(): Promise<CategoryData[]> {
  const now = Date.now();
  
  // If we have cached data that's not too old, return it
  if (categoriesCache.length > 0 && now - lastFetchTime < CACHE_DURATION) {
    return [...categoriesCache];
  }
  
  // If we're already loading, return the current cache
  if (isLoading) {
    return categoriesCache.length > 0 ? [...categoriesCache] : [];
  }
  
  // Otherwise, fetch fresh data
  isLoading = true;
  
  try {
    const categories = await fetchCategoriesFromApi();
    categoriesCache = categories;
    lastFetchTime = now;
    
    // Notify subscribers of the update
    notifySubscribers();
    
    return [...categories];
  } catch (error) {
    console.error('Error in getAllCategories:', error);
    return categoriesCache.length > 0 ? [...categoriesCache] : [];
  } finally {
    isLoading = false;
  }
}

export function getCategoryById(id: string): CategoryData | undefined {
  // Check the cache
  const cachedCategory = categoriesCache.find(category => category.id === id);
  if (cachedCategory) {
    return cachedCategory;
  }
  
  // If not in cache, return undefined
  return undefined;
}

// Function to update the categories data
export async function updateCategoriesData(updatedCategories: CategoryData[]): Promise<void> {
  try {
    console.log("Updating categories in database:", updatedCategories);
    
    // First, clear all existing categories
    console.log("Clearing existing categories...");
    const clearResponse = await fetch('/api/categories/clear', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!clearResponse.ok) {
      const errorData = await clearResponse.json();
      throw new Error(`Failed to clear categories: ${errorData.error || clearResponse.statusText}`);
    }
    
    console.log("Categories cleared successfully");
    
    // Then add each category to the database
    for (const category of updatedCategories) {
      console.log(`Adding category: ${category.name}`);
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          id: category.id,
          name: category.name,
          icon: category.icon,
          number: category.number || 0,
          tags: category.tags || []
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to save category ${category.name}: ${errorData.error || response.statusText}`);
      }
      
      console.log(`Category ${category.name} added successfully`);
    }
    
    // Update the local cache
    categoriesCache = [...updatedCategories];
    lastFetchTime = Date.now();
    
    // Store categories in localStorage for persistence across page refreshes
    try {
      localStorage.setItem('categories', JSON.stringify(updatedCategories));
    } catch (error) {
      console.error('Failed to save categories to localStorage:', error);
    }
    
    // Notify all subscribers that data has changed
    notifySubscribers();
    
    console.log("Categories update completed successfully");
  } catch (error) {
    console.error('Error updating categories in database:', error);
    throw error;
  }
}

// Function to subscribe to data changes
export function subscribeToCategories(callback: () => void): () => void {
  subscribers.push(callback);
  
  // Return unsubscribe function
  return () => {
    subscribers = subscribers.filter(cb => cb !== callback);
  };
}

// Function to notify all subscribers
function notifySubscribers(): void {
  subscribers.forEach(callback => callback());
}

// Load categories from localStorage on module initialization
try {
  const savedCategories = localStorage.getItem('categories');
  if (savedCategories) {
    const parsedCategories = JSON.parse(savedCategories);
    categoriesCache = parsedCategories;
  }
} catch (error) {
  console.error('Failed to load categories from localStorage:', error);
}

// Immediately start fetching categories in the background
getAllCategories().catch(console.error);