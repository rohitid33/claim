// Define the Subcategory interface
export interface SubcategoryData {
  id: string;
  name: string;
  categoryId: string;
  serviceIds: string[]; // IDs of services linked to this subcategory
}

// Initial subcategories data
export const subcategoriesData: SubcategoryData[] = [
  { 
    id: "health-insurance", 
    name: "Health Insurance", 
    categoryId: "insurance",
    serviceIds: ["health-claim"] 
  },
  { 
    id: "motor-insurance", 
    name: "Motor Insurance", 
    categoryId: "insurance",
    serviceIds: ["motor-claim"] 
  },
  { 
    id: "life-insurance", 
    name: "Life Insurance", 
    categoryId: "insurance",
    serviceIds: ["life-claim"] 
  }
];

// For reactive updates - store subscribers
let subscribers: (() => void)[] = [];

// Helper functions
export async function getAllSubcategories(): Promise<SubcategoryData[]> {
  try {
    console.log('Fetching subcategories from API...');
    // Try to fetch subcategories from the API
    const response = await fetch('/api/subcategories');
    
    if (response.ok) {
      const apiSubcategories = await response.json();
      console.log('Subcategories fetched successfully:', apiSubcategories);
      
      // Update the local array
      subcategoriesData.length = 0;
      subcategoriesData.push(...apiSubcategories);
      
      // Update localStorage
      saveToLocalStorage();
      
      console.log('Subcategories fetched from API:', apiSubcategories.length);
      return [...apiSubcategories]; // Return a copy of the fetched subcategories
    } else {
      console.warn('Failed to fetch subcategories from API, using local data');
      return [...subcategoriesData]; // Return a copy to prevent direct mutation
    }
  } catch (error) {
    console.error('Error fetching subcategories from API:', error);
    // Fallback to the in-memory array
    return [...subcategoriesData]; // Return a copy to prevent direct mutation
  }
}

export function getSubcategoryById(id: string): SubcategoryData | undefined {
  return subcategoriesData.find(subcategory => subcategory.id === id);
}

export function getSubcategoriesByCategoryId(categoryId: string): SubcategoryData[] {
  return subcategoriesData.filter(subcategory => subcategory.categoryId === categoryId);
}

export function getSubcategoriesByServiceId(serviceId: string): SubcategoryData[] {
  return subcategoriesData.filter(subcategory => 
    subcategory.serviceIds.includes(serviceId)
  );
}

// Function to update the subcategories data
export async function updateSubcategoriesData(updatedSubcategories: SubcategoryData[]): Promise<void> {
  try {
    console.log('Updating subcategories data:', updatedSubcategories);
    
    // First update the in-memory array
    subcategoriesData.length = 0; // Clear the array
    subcategoriesData.push(...updatedSubcategories); // Add the updated subcategories
    
    // Store subcategories in localStorage for persistence across page refreshes
    saveToLocalStorage();
    
    // Get the admin token from localStorage
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      throw new Error('Admin authentication required');
    }
    
    // Now, update each subcategory in the MongoDB collection via API
    const updatePromises = updatedSubcategories.map(async (subcategory) => {
      try {
        // First try to use the admin API endpoint
        try {
          // Check if subcategory exists (by ID)
          const checkResponse = await fetch(`/api/subcategories/${subcategory.id}`);
          const exists = checkResponse.ok;
          
          if (exists) {
            // Subcategory exists, update it via admin API
            console.log(`Updating subcategory ${subcategory.id} in MongoDB via admin API`);
            const adminUpdateResponse = await fetch(`/api/admin/subcategories/${subcategory.id}`, {
              method: 'PUT',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
              },
              body: JSON.stringify(subcategory),
              credentials: 'include'
            });
            
            if (adminUpdateResponse.ok) {
              return;
            }
          } else {
            // Subcategory doesn't exist, create it via admin API
            console.log(`Creating new subcategory ${subcategory.id} in MongoDB via admin API`);
            const adminCreateResponse = await fetch('/api/admin/subcategories', {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
              },
              body: JSON.stringify(subcategory),
              credentials: 'include'
            });
            
            if (adminCreateResponse.ok) {
              return;
            }
          }
        } catch (adminError) {
          console.warn(`Failed to update subcategory ${subcategory.id} via admin API, falling back to regular API:`, adminError);
        }
        
        // Fallback to regular API endpoints
        // Check if subcategory exists (by ID)
        const response = await fetch(`/api/subcategories/${subcategory.id}`);
        
        if (response.ok) {
          // Subcategory exists, update it
          console.log(`Updating subcategory ${subcategory.id} in MongoDB`);
          return fetch(`/api/subcategories/${subcategory.id}`, {
            method: 'PUT',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify(subcategory),
            credentials: 'include'
          });
        } else {
          // Subcategory doesn't exist, create it
          console.log(`Creating new subcategory ${subcategory.id} in MongoDB`);
          return fetch('/api/subcategories', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify(subcategory),
            credentials: 'include'
          });
        }
      } catch (error) {
        console.error(`Failed to update subcategory ${subcategory.id}:`, error);
        throw error;
      }
    });
    
    // Wait for all update operations to complete
    await Promise.all(updatePromises);
    console.log('All subcategories synced with MongoDB successfully');
    
    // Notify all subscribers that data has changed
    notifySubscribers();
  } catch (error) {
    console.error('Failed to update subcategories in the database:', error);
    throw error;
  }
}

// Function to add a service to a subcategory
export function addServiceToSubcategory(subcategoryId: string, serviceId: string): void {
  const subcategory = subcategoriesData.find(sc => sc.id === subcategoryId);
  if (subcategory && !subcategory.serviceIds.includes(serviceId)) {
    subcategory.serviceIds.push(serviceId);
    
    // Update localStorage
    saveToLocalStorage();
    
    // Notify subscribers
    notifySubscribers();
  }
}

// Function to remove a service from a subcategory
export function removeServiceFromSubcategory(subcategoryId: string, serviceId: string): void {
  const subcategory = subcategoriesData.find(sc => sc.id === subcategoryId);
  if (subcategory) {
    subcategory.serviceIds = subcategory.serviceIds.filter(id => id !== serviceId);
    
    // Update localStorage
    saveToLocalStorage();
    
    // Notify subscribers
    notifySubscribers();
  }
}

// Function to create a new subcategory
export async function createSubcategory(newSubcategory: SubcategoryData): Promise<void> {
  try {
    console.log("=== Creating subcategory ===");
    console.log("New subcategory data:", newSubcategory);
    
    // Check if subcategory with the same ID already exists
    if (subcategoriesData.some(subcategory => subcategory.id === newSubcategory.id)) {
      throw new Error(`Subcategory with ID ${newSubcategory.id} already exists`);
    }
    
    // Add the new subcategory to the array
    subcategoriesData.push(newSubcategory);
    
    // Save to localStorage
    saveToLocalStorage();
    
    // Get the admin token from localStorage
    const adminToken = localStorage.getItem('adminToken');
    console.log("Admin token present:", !!adminToken);
    
    if (!adminToken) {
      throw new Error('Admin authentication required');
    }
    
    // Create in MongoDB via API
    console.log("Sending request to create subcategory...");
    
    // First, try using the admin API endpoint which is protected by adminAuthMiddleware
    try {
      const adminResponse = await fetch('/api/admin/subcategories', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          id: newSubcategory.id, // Include ID in the request
          name: newSubcategory.name,
          categoryId: newSubcategory.categoryId,
          serviceIds: newSubcategory.serviceIds || []
        }),
        credentials: 'include' // Include cookies for session-based auth
      });
      
      if (adminResponse.ok) {
        const responseData = await adminResponse.json();
        console.log("Response data from admin API:", responseData);
        console.log(`Subcategory ${newSubcategory.id} created in MongoDB successfully via admin API`);
        
        // Notify subscribers
        notifySubscribers();
        return;
      }
    } catch (adminError) {
      console.warn("Failed to create subcategory via admin API, falling back to regular API:", adminError);
    }
    
    // Fallback to the regular API endpoint
    const response = await fetch('/api/subcategories', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        id: newSubcategory.id, // Include ID in the request
        name: newSubcategory.name,
        categoryId: newSubcategory.categoryId,
        serviceIds: newSubcategory.serviceIds || []
      }),
      credentials: 'include' // Include cookies for session-based auth
    });
    
    console.log("Response status:", response.status);
    
    if (!response.ok) {
      const responseData = await response.json();
      console.error("Error response:", responseData);
      throw new Error(responseData.error || responseData.message || 'Failed to create subcategory in MongoDB');
    } else {
      const responseData = await response.json();
      console.log("Response data:", responseData);
      console.log(`Subcategory ${newSubcategory.id} created in MongoDB successfully`);
    }
    
    // Notify subscribers
    notifySubscribers();
  } catch (error) {
    console.error(`Failed to create subcategory ${newSubcategory.id}:`, error);
    throw error;
  }
}

// Function to delete a subcategory
export async function deleteSubcategory(subcategoryId: string): Promise<boolean> {
  try {
    console.log(`Deleting subcategory with ID: ${subcategoryId}`);
    
    // Remove from local array
    const index = subcategoriesData.findIndex(sc => sc.id === subcategoryId);
    if (index === -1) {
      console.warn(`Subcategory with ID ${subcategoryId} not found in local data`);
      return false;
    }
    
    subcategoriesData.splice(index, 1);
    
    // Update localStorage
    saveToLocalStorage();
    
    // Get the admin token from localStorage
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      throw new Error('Admin authentication required');
    }
    
    // First try the admin API endpoint
    try {
      const adminResponse = await fetch(`/api/admin/subcategories/${subcategoryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        },
        credentials: 'include'
      });
      
      if (adminResponse.ok || adminResponse.status === 404) {
        console.log(`Subcategory ${subcategoryId} deleted successfully via admin API`);
        
        // Notify subscribers
        notifySubscribers();
        return true;
      }
    } catch (adminError) {
      console.warn("Failed to delete subcategory via admin API, falling back to regular API:", adminError);
    }
    
    // Fallback to regular API endpoint
    const response = await fetch(`/api/subcategories/${subcategoryId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${adminToken}`
      },
      credentials: 'include'
    });
    
    if (!response.ok && response.status !== 404) {
      const responseData = await response.json().catch(() => ({}));
      console.error("Error response:", responseData);
      throw new Error(responseData.error || responseData.message || `Failed to delete subcategory ${subcategoryId}`);
    }
    
    console.log(`Subcategory ${subcategoryId} deleted successfully`);
    
    // Notify subscribers
    notifySubscribers();
    return true;
  } catch (error) {
    console.error(`Error deleting subcategory ${subcategoryId}:`, error);
    throw error;
  }
}

// Function to subscribe to data changes
export function subscribeToSubcategories(callback: () => void): () => void {
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

// Helper function to save subcategories to localStorage
function saveToLocalStorage(): void {
  try {
    localStorage.setItem('subcategories', JSON.stringify(subcategoriesData));
  } catch (error) {
    console.error('Failed to save subcategories to localStorage:', error);
  }
}

// Load subcategories from localStorage on module initialization
try {
  const savedSubcategories = localStorage.getItem('subcategories');
  if (savedSubcategories) {
    const parsedSubcategories = JSON.parse(savedSubcategories);
    subcategoriesData.length = 0;
    subcategoriesData.push(...parsedSubcategories);
  }
} catch (error) {
  console.error('Failed to load subcategories from localStorage:', error);
}