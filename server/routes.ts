import mongoose from 'mongoose';
import type { Express, Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { 
  insertComplaintSchema, 
  insertCategorySchema, 
  updateCategorySchema,
  insertSubcategorySchema,
  updateSubcategorySchema,
  insertTicketSchema,
  updateTicketSchema,
  insertTaskSchema,
  updateTaskSchema
} from "@shared/schema";
import { setupAuth } from "./auth";
import { Category } from './models/Category';
import adminAuthRoutes from './admin-auth';
import adminAuthMiddleware from './middleware/admin-auth';
import { otpService } from './services/otp-service';
import { otpLimiter, otpVerificationLimiter } from './middleware/rate-limit';
import passwordAuthRoutes from './routes/password-auth';

// Use the storage implementation from storage.ts
console.log("Using storage implementation:", storage.constructor.name);

// Admin check middleware 
const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  console.log("=== isAdmin middleware called ===");
  
  if (!req.user) {
    console.log("isAdmin check failed: No user object in request");
    return res.status(401).json({ 
      error: "Unauthorized", 
      detail: "No authenticated user found" 
    });
  }
  
  if (!req.user.id) {
    console.log("isAdmin check failed: User object has no ID");
    return res.status(401).json({ 
      error: "Unauthorized", 
      detail: "Invalid user information" 
    });
  }
  
  console.log(`User ID in request: ${req.user.id}`);
  console.log(`Admin status: ${req.user.isAdmin}`);
  
  // Check for admin status in user object
  if (req.user.isAdmin === true) {
    console.log("User has isAdmin=true, granting access");
    next();
  } else {
    console.log("User isAdmin=false, denying access");
    return res.status(403).json({ 
      error: "Forbidden - Admin access required",
      detail: "Current user does not have admin privileges" 
    });
  }
};

// Helper function to get device info from request
function getDeviceInfo(req: Request): { ipAddress: string; deviceInfo: string } {
  const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';
  return {
    ipAddress,
    deviceInfo: userAgent
  };
}

export async function registerRoutes(app: Express) {
  // Setup authentication routes and middleware
  setupAuth(app, storage);

  // Add password authentication routes
  app.use('/api/auth/password', passwordAuthRoutes);

  // Set the port for the server
  const PORT = process.env.PORT || 3000;
  
  // Add admin authentication routes
  app.use('/api/admin-auth', adminAuthRoutes);
  
  // Protect admin dashboard API routes
  app.use('/api/admin', adminAuthMiddleware);
  
  // Admin subcategory routes
  app.post("/api/admin/subcategories", async (req, res) => {
    try {
      console.log("=== Creating subcategory via admin API ===");
      console.log("Request body:", req.body);
      console.log("User:", req.user ? `ID: ${req.user.id}, isAdmin: ${req.user.isAdmin}` : "No user");
      
      const subcategoryData = insertSubcategorySchema.parse(req.body);
      console.log("Validated subcategory data:", subcategoryData);
      
      const subcategory = await storage.createSubcategory(subcategoryData);
      console.log("Subcategory created successfully via admin API:", subcategory);
      
      res.status(201).json(subcategory);
    } catch (error) {
      console.error("Error creating subcategory via admin API:", error);
      if (error instanceof Error) {
        console.error("Error details:", {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: "Invalid subcategory data" });
      }
    }
  });
  
  app.put("/api/admin/subcategories/:id", async (req, res) => {
    try {
      console.log(`=== Updating subcategory via admin API: ${req.params.id} ===`);
      console.log("Update data:", req.body);
      console.log("User:", req.user ? `ID: ${req.user.id}, isAdmin: ${req.user.isAdmin}` : "No user");
      
      const subcategoryData = updateSubcategorySchema.parse(req.body);
      const subcategory = await storage.updateSubcategory(req.params.id, subcategoryData);
      console.log("Subcategory updated successfully via admin API:", subcategory);
      
      res.json(subcategory);
    } catch (error) {
      console.error(`Error updating subcategory ${req.params.id} via admin API:`, error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: "Invalid subcategory data" });
      }
    }
  });
  
  app.delete("/api/admin/subcategories/:id", async (req, res) => {
    try {
      console.log(`=== Deleting subcategory via admin API: ${req.params.id} ===`);
      console.log("User:", req.user ? `ID: ${req.user.id}, isAdmin: ${req.user.isAdmin}` : "No user");
      
      const success = await storage.deleteSubcategory(req.params.id);
      
      if (success) {
        console.log("Subcategory deleted successfully via admin API");
        res.status(204).end();
      } else {
        console.log("Subcategory not found via admin API");
        res.status(404).json({ error: "Subcategory not found" });
      }
    } catch (error) {
      console.error(`Error deleting subcategory ${req.params.id} via admin API:`, error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Failed to delete subcategory" });
      }
    }
  });
  
  app.post("/api/complaints", async (req, res) => {
    try {
      const complaintData = insertComplaintSchema.parse(req.body);
      // Creating a complaint without the userId property to avoid TypeScript error
      const complaint = await storage.createComplaint(complaintData);
      res.json(complaint);
    } catch (error) {
      res.status(400).json({ error: "Invalid complaint data" });
    }
  });

  app.get("/api/blog-posts", async (_req, res) => {
    const posts = await storage.getBlogPosts();
    res.json(posts);
  });

  // Category routes
  app.get("/api/categories", async (_req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error: unknown) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  // Clear all categories (for admin use)
  app.post("/api/categories/clear", async (req, res) => {
    try {
      // Temporarily remove authentication check for testing
      // if (!req.user || !req.user.id) {
      //   return res.status(401).json({ error: "Unauthorized" });
      // }

      console.log("Clearing all categories");
      
      // First, get all subcategories
      const subcategories = await storage.getSubcategories();
      console.log(`Found ${subcategories.length} subcategories to delete first`);
      
      // Delete all subcategories first
      for (const subcategory of subcategories) {
        if (subcategory.id) {
          console.log(`Deleting subcategory: ${subcategory.id}`);
          try {
            await storage.deleteSubcategory(subcategory.id);
          } catch (subError) {
            console.warn(`Warning: Could not delete subcategory ${subcategory.id}: ${subError instanceof Error ? subError.message : 'Unknown error'}`);
            // Continue with other subcategories even if one fails
          }
        }
      }
      
      // Now get all categories
      const categories = await storage.getCategories();
      console.log(`Found ${categories.length} categories to delete`);
      
      // Delete each category
      let successCount = 0;
      let errorCount = 0;
      
      for (const category of categories) {
        if (category.id) {
          try {
            console.log(`Deleting category: ${category.id}`);
            await storage.deleteCategory(category.id);
            successCount++;
          } catch (catError) {
            console.error(`Error deleting category ${category.id}: ${catError instanceof Error ? catError.message : 'Unknown error'}`);
            errorCount++;
            // Continue with other categories even if one fails
          }
        }
      }
      
      res.status(200).json({ 
        message: "Categories clearing operation completed", 
        details: {
          subcategoriesDeleted: subcategories.length,
          categoriesDeleted: successCount,
          categoriesFailed: errorCount
        }
      });
    } catch (error: unknown) {
      console.error("Error clearing categories:", error);
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Failed to clear categories" });
      }
    }
  });

  app.get("/api/categories/:id", async (req, res) => {
    try {
      const category = await storage.getCategoryById(req.params.id);
      res.json(category);
    } catch (error) {
      console.error(`Error fetching category ${req.params.id}:`, error);
      res.status(404).json({ error: "Category not found" });
    }
  });

  app.post("/api/categories", async (req, res) => {
    try {
      // Temporarily remove authentication check for testing
      // if (!req.user || !req.user.id) {
      //   return res.status(401).json({ error: "Unauthorized" });
      // }

      console.log("Creating category with data:", req.body);
      
      const categoryData = insertCategorySchema.parse(req.body);
      console.log("Validated category data:", categoryData);
      
      // Debug: Check which storage implementation is being used
      console.log("Storage implementation:", storage.constructor.name);
      
      const category = await storage.createCategory(categoryData);
      console.log("Category created successfully:", category);
      
      res.status(201).json(category);
    } catch (error) {
      console.error("Error creating category:", error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: "Invalid category data" });
      }
    }
  });

  app.put("/api/categories/:id", async (req, res) => {
    try {
      // Check if user is admin (you may need to implement this check)
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const categoryData = updateCategorySchema.parse(req.body);
      const category = await storage.updateCategory(req.params.id, categoryData);
      res.json(category);
    } catch (error) {
      console.error(`Error updating category ${req.params.id}:`, error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: "Invalid category data" });
      }
    }
  });

  app.delete("/api/categories/:id", async (req, res) => {
    try {
      // Check if user is admin (you may need to implement this check)
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const success = await storage.deleteCategory(req.params.id);
      if (success) {
        res.status(204).end();
      } else {
        res.status(404).json({ error: "Category not found" });
      }
    } catch (error) {
      console.error(`Error deleting category ${req.params.id}:`, error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Failed to delete category" });
      }
    }
  });

  // Subcategory routes
  app.get("/api/subcategories", async (req, res) => {
    try {
      let subcategories;
      if (req.query.categoryId) {
        subcategories = await storage.getSubcategoriesByCategory(req.query.categoryId as string);
      } else {
        subcategories = await storage.getSubcategories();
      }
      res.json(subcategories);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      res.status(500).json({ error: "Failed to fetch subcategories" });
    }
  });

  app.get("/api/subcategories/:id", async (req, res) => {
    try {
      const subcategory = await storage.getSubcategoryById(req.params.id);
      res.json(subcategory);
    } catch (error) {
      console.error(`Error fetching subcategory ${req.params.id}:`, error);
      res.status(404).json({ error: "Subcategory not found" });
    }
  });

  app.post("/api/subcategories", isAdmin, async (req, res) => {
    try {
      console.log("=== Creating subcategory ===");
      console.log("Request headers:", req.headers);
      console.log("Request body:", req.body);
      console.log("User:", req.user ? `ID: ${req.user.id}, isAdmin: ${req.user.isAdmin}` : "No user");
      
      const subcategoryData = insertSubcategorySchema.parse(req.body);
      console.log("Validated subcategory data:", subcategoryData);
      
      const subcategory = await storage.createSubcategory(subcategoryData);
      console.log("Subcategory created successfully:", subcategory);
      
      res.status(201).json(subcategory);
    } catch (error) {
      console.error("Error creating subcategory:", error);
      if (error instanceof Error) {
        console.error("Error details:", {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: "Invalid subcategory data" });
      }
    }
  });

  app.put("/api/subcategories/:id", isAdmin, async (req, res) => {
    try {
      console.log(`Updating subcategory with ID: ${req.params.id}`);
      console.log("Update data:", req.body);
      
      const subcategoryData = updateSubcategorySchema.parse(req.body);
      const subcategory = await storage.updateSubcategory(req.params.id, subcategoryData);
      console.log("Subcategory updated successfully:", subcategory);
      
      res.json(subcategory);
    } catch (error) {
      console.error(`Error updating subcategory ${req.params.id}:`, error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: "Invalid subcategory data" });
      }
    }
  });

  app.delete("/api/subcategories/:id", isAdmin, async (req, res) => {
    try {
      console.log(`Deleting subcategory with ID: ${req.params.id}`);
      const success = await storage.deleteSubcategory(req.params.id);
      
      if (success) {
        console.log("Subcategory deleted successfully");
        res.status(204).end();
      } else {
        console.log("Subcategory not found");
        res.status(404).json({ error: "Subcategory not found" });
      }
    } catch (error) {
      console.error(`Error deleting subcategory ${req.params.id}:`, error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Failed to delete subcategory" });
      }
    }
  });

  // Test route to check database collections
  app.get("/api/db-check", async (_req, res) => {
    try {
      // Get database name
      const dbName = mongoose.connection.db?.databaseName;
      
      // List all collections
      const collections = await mongoose.connection.db?.listCollections().toArray() || [];
      const collectionNames = collections.map(c => c.name);
      
      // Get all collection stats
      const collectionStats: Record<string, number> = {};
      for (const name of collectionNames) {
        const count = await mongoose.connection.db?.collection(name).countDocuments() || 0;
        collectionStats[name] = count;
      }
      
      // Check if our collections exist
      const hasCategories = collectionNames.includes('categories');
      const hasSubcategories = collectionNames.includes('subcategories');
      
      // Get specific data
      let categories: any[] = [];
      let subcategories: any[] = [];
      
      if (hasCategories) {
        categories = await mongoose.connection.db?.collection('categories').find({}).toArray() || [];
      }
      
      if (hasSubcategories) {
        subcategories = await mongoose.connection.db?.collection('subcategories').find({}).toArray() || [];
      }
      
      res.json({
        databaseName: dbName,
        collections: collectionNames,
        collectionStats,
        hasCategories,
        hasSubcategories,
        categories,
        subcategories,
        connectionString: process.env.MONGODB_URI ? 'Using environment variable' : 'Using default connection string'
      });
    } catch (error: unknown) {
      console.error("Error checking database:", error);
      res.status(500).json({ 
        error: "Failed to check database", 
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : "No stack trace available"
      });
    }
  });

  // Direct database check endpoint
  app.get("/api/direct-db-check", async (_req, res) => {
    try {
      // Check if the model is registered
      const modelNames = mongoose.modelNames();
      
      // Check connection status
      const connectionState = mongoose.connection.readyState;
      const connectionStates = ['disconnected', 'connected', 'connecting', 'disconnecting'];
      
      // Try to create a test category directly
      let testCategory = null;
      let error = null;
      
      try {
        testCategory = new Category({ name: `Test Category ${Date.now()}` });
        await testCategory.save();
      } catch (err: unknown) {
        error = {
          message: err instanceof Error ? err.message : 'Unknown error',
          stack: err instanceof Error ? err.stack : 'No stack trace available',
          code: err instanceof Error && 'code' in err ? (err as any).code : 'unknown'
        };
      }
      
      // Get database info
      const dbName = mongoose.connection.db ? mongoose.connection.db.databaseName : 'Not connected';
      
      // Try to list collections
      let collections: any[] = [];
      try {
        if (mongoose.connection.db) {
          collections = await mongoose.connection.db.listCollections().toArray();
        }
      } catch (err) {
        console.error("Error listing collections:", err);
      }
      
      // Try to find categories
      let categories = [];
      try {
        categories = await Category.find().lean();
      } catch (err) {
        console.error("Error finding categories:", err);
      }
      
      res.json({
        connectionState: {
          code: connectionState,
          description: connectionStates[connectionState]
        },
        registeredModels: modelNames,
        categoryModelRegistered: modelNames.includes('Category'),
        databaseName: dbName,
        collections: collections.map(c => c.name),
        testCategory: testCategory ? testCategory.toJSON() : null,
        testCategoryError: error,
        categories,
        mongooseVersion: mongoose.version
      });
    } catch (error: unknown) {
      console.error("Error in direct DB check:", error);
      res.status(500).json({ 
        error: "Failed to perform direct DB check", 
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : "No stack trace available"
      });
    }
  });

  // Test endpoint to create a category directly
  app.get("/api/test-create-category", async (_req, res) => {
    try {
      console.log("Test creating a category");
      
      const testCategory = {
        name: `Test Category ${Date.now()}`,
        number: Math.floor(Math.random() * 1000) // Adding a number property 
      };
      
      console.log("Creating test category:", testCategory);
      const category = await storage.createCategory(testCategory);
      console.log("Test category created:", category);
      
      res.json({
        success: true,
        message: "Test category created successfully",
        category
      });
    } catch (error: unknown) {
      console.error("Error creating test category:", error);
      res.status(500).json({ 
        success: false,
        error: "Failed to create test category", 
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : "No stack trace available"
      });
    }
  });

  // AppServices API endpoints
  app.get("/api/appservices", async (_req, res) => {
    try {
      // Import the AppService model
      const { AppService } = await import('./models/AppService');
      
      // Fetch all app services from the database
      const appServices = await AppService.find().lean();
      
      console.log("AppServices from database (count):", appServices.length);
      
      // Transform the data to match the expected format
      const formattedServices = appServices.map(service => {
        // Ensure _id is converted to id as a string
        const id = service._id.toString();
        // Create a new object with the correct structure
        return {
          ...service,
          id
        };
      });
      
      res.json(formattedServices);
    } catch (error) {
      console.error("Error fetching app services:", error);
      res.status(500).json({ error: "Failed to fetch app services" });
    }
  });

  // Create a new app service
  app.post("/api/appservices", async (req, res) => {
    try {
      console.log("Creating app service with data:", req.body);
      
      // Import the AppService model
      const { AppService } = await import('./models/AppService');
      
      // Validate required fields
      const { title, description } = req.body;
      
      if (!title || !description) {
        return res.status(400).json({ error: "Title and description are required" });
      }
      
      // Create a new app service
      const newService = new AppService({
        title,
        description,
        icon: req.body.icon,
        category: req.body.category,
        subcategoryIds: req.body.subcategoryIds,
        features: req.body.features,
        eligibility: req.body.eligibility,
        process: req.body.process,
        documents: req.body.documents,
        faqs: req.body.faqs,
        contactInfo: req.body.contactInfo
      });
      
      await newService.save();
      console.log("App service created successfully:", newService.toJSON());
      
      res.status(201).json(newService.toJSON());
    } catch (error) {
      console.error("Error creating app service:", error);
      res.status(500).json({ 
        error: "Failed to create app service", 
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get a specific app service
  app.get("/api/appservices/:id", async (req, res) => {
    try {
      // Import the AppService model
      const { AppService } = await import('./models/AppService');
      
      // Find the app service by ID
      const appService = await AppService.findById(req.params.id).lean();
      
      if (!appService) {
        return res.status(404).json({ error: "App service not found" });
      }
      
      // Transform the data
      const formattedService = {
        ...appService,
        id: appService._id.toString()
      };
      
      res.json(formattedService);
    } catch (error) {
      console.error(`Error fetching app service ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to fetch app service" });
    }
  });

  // Update an app service
  app.put("/api/appservices/:id", async (req, res) => {
    try {
      console.log(`Updating app service with ID: ${req.params.id}`);
      
      // Import the AppService model
      const { AppService } = await import('./models/AppService');
      
      // Find and update the app service
      const updatedService = await AppService.findByIdAndUpdate(
        req.params.id,
        { ...req.body, updatedAt: new Date() },
        { new: true, runValidators: true }
      );
      
      if (!updatedService) {
        return res.status(404).json({ error: "App service not found" });
      }
      
      console.log("App service updated successfully:", updatedService.toJSON());
      res.json(updatedService.toJSON());
    } catch (error) {
      console.error(`Error updating app service ${req.params.id}:`, error);
      res.status(500).json({ 
        error: "Failed to update app service", 
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Delete an app service
  app.delete("/api/appservices/:id", async (req, res) => {
    try {
      console.log(`Deleting app service with ID: ${req.params.id}`);
      
      // Import the AppService model
      const { AppService } = await import('./models/AppService');
      
      // Find and delete the app service
      const result = await AppService.deleteOne({ _id: req.params.id });
      
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: "App service not found" });
      }
      
      console.log("App service deleted successfully");
      res.status(204).end();
    } catch (error) {
      console.error(`Error deleting app service ${req.params.id}:`, error);
      res.status(500).json({ 
        error: "Failed to delete app service", 
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Services API endpoint - direct access to MongoDB
  app.get("/api/services", async (_req, res) => {
    try {
      // Import the Service model
      const { Service } = await import('./models/Service');
      
      // Fetch all services from the database
      const services = await Service.find().lean();
      
      console.log("Services from database (count):", services.length);
      
      if (services.length === 0) {
        console.log("No services found in database");
      } else {
        console.log("First service from database:", services[0]);
      }
      
      // Transform the data to match the expected format
      const formattedServices = services.map(service => {
        // Ensure _id is converted to id as a string
        const id = service._id ? service._id.toString() : '';
        
        // Create a new object with the correct structure
        return {
          ...service,
          id
        };
      });
      
      console.log("Formatted services (count):", formattedServices.length);
      
      if (formattedServices.length > 0) {
        console.log("First formatted service:", formattedServices[0]);
      }
      
      res.json(formattedServices);
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({ error: "Failed to fetch services" });
    }
  });

  // Create a new service
  app.post("/api/services", async (req, res) => {
    try {
      console.log("Creating service with data:", req.body);
      
      // Import the Service model
      const { Service } = await import('./models/Service');
      
      // Validate required fields
      const { title, description } = req.body;
      
      if (!title || !description) {
        return res.status(400).json({ error: "Title and description are required" });
      }
      
      // Create a new service with default values for required fields
      const newService = new Service({
        title,
        description,
        icon: req.body.icon || "📄", // Default icon
        features: req.body.features || ["New service"],
        eligibility: req.body.eligibility || ["Everyone is eligible"],
        process: req.body.process || [{
          title: "Simple Process",
          steps: ["Contact us to get started"]
        }],
        documents: req.body.documents || ["No documents required"],
        faqs: req.body.faqs || [{
          question: "How do I get started?",
          answer: "Contact us to learn more about this service."
        }],
        contactInfo: req.body.contactInfo || {
          phone: "123-456-7890",
          email: "contact@example.com"
        },
        category: req.body.category || "general",
        subcategoryIds: req.body.subcategoryIds || []
      });
      
      await newService.save();
      console.log("Service created successfully:", newService.toJSON());
      
      // If subcategories are provided, update the corresponding subcategories with this service ID
      if (req.body.subcategoryIds && req.body.subcategoryIds.length > 0) {
        const { Subcategory } = await import('./models/Subcategory');
        
        console.log(`Updating ${req.body.subcategoryIds.length} subcategories with this service ID`);
        
        const serviceId = newService._id ? newService._id.toString() : '';
        
        // Update each subcategory to include this service ID
        for (const subcategoryId of req.body.subcategoryIds) {
          const subcategory = await Subcategory.findById(subcategoryId);
          if (subcategory) {
            if (!subcategory.serviceIds.includes(serviceId)) {
              subcategory.serviceIds.push(serviceId);
              await subcategory.save();
              console.log(`Added service ID ${serviceId} to subcategory ${subcategoryId}`);
            }
          }
        }
      }
      
      res.status(201).json(newService.toJSON());
    } catch (error) {
      console.error("Error creating service:", error);
      res.status(500).json({ 
        error: "Failed to create service", 
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Test endpoint to create a service directly
  app.get("/api/test-create-service", async (_req, res) => {
    try {
      console.log("Test creating a service");
      
      // Import the Service model
      const { Service } = await import('./models/Service');
      
      // Check if any services exist
      const serviceCount = await Service.countDocuments();
      console.log("Current service count:", serviceCount);
      
      // Create a test service
      const testService = new Service({
        title: `Test Service ${Date.now()}`,
        icon: "🔍",
        description: "This is a test service created for demonstration purposes.",
        features: ["Feature 1", "Feature 2", "Feature 3"],
        eligibility: ["Anyone can use this service"],
        process: [{
          title: "Simple Process",
          steps: ["Step 1", "Step 2", "Step 3"]
        }],
        documents: ["No documents required"],
        faqs: [{
          question: "What is this service?",
          answer: "This is a test service created for demonstration purposes."
        }],
        contactInfo: {
          phone: "123-456-7890",
          email: "test@example.com"
        }
      });
      
      await testService.save();
      console.log("Test service created:", testService.toJSON());
      
      res.json({
        success: true,
        message: "Test service created successfully",
        service: testService.toJSON()
      });
    } catch (error: unknown) {
      console.error("Error creating test service:", error);
      res.status(500).json({ 
        success: false,
        error: "Failed to create test service", 
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : "No stack trace available"
      });
    }
  });

  // Get a specific service
  app.get("/api/services/:id", async (req, res) => {
    try {
      // Import the Service model
      const { Service } = await import('./models/Service');
      
      // Find the service by ID
      const service = await Service.findById(req.params.id).lean();
      
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }
      
      // Transform the data
      const formattedService = {
        ...service,
        id: service._id.toString()
      };
      
      console.log(`Service ${req.params.id} fetched successfully`);
      res.json(formattedService);
    } catch (error: unknown) {
      console.error(`Error fetching service ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to fetch service" });
    }
  });

  // Update a service
  app.put("/api/services/:id", async (req, res) => {
    try {
      console.log(`Updating service with ID: ${req.params.id}`);
      console.log("Update data:", req.body);
      
      // Import the Service model
      const { Service } = await import('./models/Service');
      const { Subcategory } = await import('./models/Subcategory');
      
      // First, get current service to track subcategory changes
      const currentService = await Service.findById(req.params.id);
      if (!currentService) {
        return res.status(404).json({ error: "Service not found" });
      }
      
      const oldSubcategoryIds = currentService.subcategoryIds || [];
      const newSubcategoryIds = req.body.subcategoryIds || [];
      
      // Find and update the service
      const updatedService = await Service.findByIdAndUpdate(
        req.params.id,
        { ...req.body, updatedAt: new Date() },
        { new: true, runValidators: true }
      );
      
      if (!updatedService) {
        return res.status(404).json({ error: "Service not found" });
      }
      
      // Handle subcategory relationships
      const serviceId = updatedService._id ? updatedService._id.toString() : '';
      
      // Handle removed subcategories - remove this service from those subcategories
      const removedSubcategoryIds = oldSubcategoryIds.filter(id => !newSubcategoryIds.includes(id));
      for (const subcategoryId of removedSubcategoryIds) {
        const subcategory = await Subcategory.findById(subcategoryId);
        if (subcategory) {
          subcategory.serviceIds = subcategory.serviceIds.filter(id => id !== serviceId);
          await subcategory.save();
          console.log(`Removed service ID ${serviceId} from subcategory ${subcategoryId}`);
        }
      }
      
      // Handle added subcategories - add this service to those subcategories
      const addedSubcategoryIds = newSubcategoryIds.filter(id => !oldSubcategoryIds.includes(id));
      for (const subcategoryId of addedSubcategoryIds) {
        const subcategory = await Subcategory.findById(subcategoryId);
        if (subcategory) {
          if (!subcategory.serviceIds.includes(serviceId)) {
            subcategory.serviceIds.push(serviceId);
            await subcategory.save();
            console.log(`Added service ID ${serviceId} to subcategory ${subcategoryId}`);
          }
        }
      }
      
      console.log("Service updated successfully:", updatedService.toJSON());
      res.json(updatedService.toJSON());
    } catch (error) {
      console.error(`Error updating service ${req.params.id}:`, error);
      res.status(500).json({ 
        error: "Failed to update service", 
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  
  // Delete a service
  app.delete("/api/services/:id", async (req, res) => {
    try {
      console.log(`Deleting service with ID: ${req.params.id}`);
      
      // Import the Service model
      const { Service } = await import('./models/Service');
      const { Subcategory } = await import('./models/Subcategory');
      
      // Find the service to delete
      const service = await Service.findById(req.params.id);
      
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }
      
      // Remove this service from any subcategories that reference it
      if (service.subcategoryIds && service.subcategoryIds.length > 0) {
        const serviceId = service._id.toString();
        
        for (const subcategoryId of service.subcategoryIds) {
          const subcategory = await Subcategory.findById(subcategoryId);
          if (subcategory) {
            subcategory.serviceIds = subcategory.serviceIds.filter(id => id !== serviceId);
            await subcategory.save();
            console.log(`Removed service ID ${serviceId} from subcategory ${subcategoryId}`);
          }
        }
      }
      
      // Delete the service
      await Service.deleteOne({ _id: req.params.id });
      console.log(`Service ${req.params.id} deleted successfully`);
      
      res.status(204).end();
    } catch (error) {
      console.error(`Error deleting service ${req.params.id}:`, error);
      res.status(500).json({ 
        error: "Failed to delete service", 
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Serve the test category form
  app.get("/test-categories", async (_req, res) => {
    import('path').then(path => {
      res.sendFile(path.default.join(__dirname, 'test-category-form.html'));
    }).catch((error: unknown) => {
      console.error("Error importing path module:", error);
      res.status(500).send("Error serving test form");
    });
  });
  
  // Tickets API endpoints
  app.post("/api/tickets", async (req, res) => {
    try {
      // Check if user is authenticated
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      console.log("Creating ticket with data:", req.body);
      
      // Import the Ticket model
      const { Ticket } = await import('./models/Ticket');
      
      // Validate required fields
      const { serviceId, serviceName } = req.body;
      
      if (!serviceId || !serviceName) {
        return res.status(400).json({ error: "Service ID and name are required" });
      }
      
      // Create a new ticket
      const newTicket = new Ticket({
        serviceId,
        serviceName,
        userId: req.user.id,
        title: req.body.title || `${serviceName} Service Request`, // Default title if not provided
        description: req.body.description || `Request for ${serviceName} service.`, // Default description if not provided
        status: req.body.status || 'new',
        priority: req.body.priority || 'medium',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      await newTicket.save();
      console.log("Ticket created successfully:", newTicket.toJSON());
      
      // Broadcast notification to all connected clients
      if (req.app.locals.broadcastNotification) {
        req.app.locals.broadcastNotification({
          type: 'notification',
          message: `New ticket created: ${newTicket.title}`,
          notificationType: 'info',
          taskId: newTicket._id.toString()
        });
      }
      
      res.status(201).json(newTicket.toJSON());
    } catch (error: unknown) {
      console.error("Error creating ticket:", error);
      res.status(500).json({ 
        error: "Failed to create ticket", 
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get all tickets for authenticated user
  app.get("/api/tickets", async (req, res) => {
    try {
      // Check if user is authenticated
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Import the Ticket model
      const { Ticket } = await import('./models/Ticket');
      
      // Find tickets for this user
      const tickets = await Ticket.find({ userId: req.user.id }).lean();
      
      console.log(`Found ${tickets.length} tickets for user ${req.user.id}`);
      
      // Transform the data
      const formattedTickets = tickets.map(ticket => ({
        ...ticket,
        id: ticket._id.toString()
      }));
      
      res.json(formattedTickets);
    } catch (error: unknown) {
      console.error("Error fetching tickets:", error);
      res.status(500).json({ error: "Failed to fetch tickets" });
    }
  });

  // Get a specific ticket
  app.get("/api/tickets/:id", async (req, res) => {
    try {
      // Check if user is authenticated
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Import the Ticket model
      const { Ticket } = await import('./models/Ticket');
      
      // Find the ticket by ID and ensure it belongs to the user
      const ticket = await Ticket.findOne({
        _id: req.params.id,
        userId: req.user.id
      }).lean();
      
      if (!ticket) {
        return res.status(404).json({ error: "Ticket not found" });
      }
      
      // Transform the data
      const formattedTicket = {
        ...ticket,
        id: ticket._id.toString()
      };
      
      res.json(formattedTicket);
    } catch (error: unknown) {
      console.error(`Error fetching ticket ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to fetch ticket" });
    }
  });
  
  // Delete a ticket (for regular users)
  app.delete("/api/tickets/:id", async (req, res) => {
    try {
      // Check if user is authenticated
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      console.log(`User ${req.user.id} attempting to delete ticket ${req.params.id}`);
      
      // Import the Ticket model
      const { Ticket } = await import('./models/Ticket');
      
      // Find the ticket and ensure it belongs to the user
      const ticket = await Ticket.findOne({
        _id: req.params.id,
        userId: req.user.id
      });
      
      if (!ticket) {
        console.log(`Ticket ${req.params.id} not found or doesn't belong to user ${req.user.id}`);
        return res.status(404).json({ error: "Ticket not found" });
      }
      
      // Delete the ticket
      await Ticket.deleteOne({ _id: req.params.id });
      console.log(`Ticket ${req.params.id} successfully deleted by user ${req.user.id}`);
      
      res.status(204).end();
    } catch (error) {
      console.error(`Error deleting ticket ${req.params.id}:`, error);
      res.status(500).json({ 
        error: "Failed to delete ticket", 
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  
  // Get tasks for a user's ticket
  app.get("/api/tickets/:id/tasks", async (req, res) => {
    try {
      // Check if user is authenticated
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Import the models
      const { Ticket } = await import('./models/Ticket');
      const { Task } = await import('./models/Task');
      const { TaskView } = await import('./models/TaskView');
      
      // Find the ticket by ID and verify it belongs to the user
      const ticket = await Ticket.findOne({
        _id: req.params.id,
        userId: req.user.id
      });
      
      if (!ticket) {
        return res.status(404).json({ error: "Ticket not found" });
      }
      
      // Find tasks for this ticket
      const tasks = await Task.find({ ticketId: req.params.id }).lean();
      
      // Get viewed tasks for this user
      const viewedTasks = await TaskView.find({
        userId: req.user.id,
        taskId: { $in: tasks.map(task => task._id) }
      }).lean();

      const viewedTaskIds = new Set(viewedTasks.map(view => view.taskId.toString()));
      
      // Get assignee information for each task and add viewed status
      const { User } = await import('./models/User');
      const tasksWithAssigneeInfo = await Promise.all(
        tasks.map(async (task) => {
          try {
            if (task.assigneeId) {
              const assignee = await User.findById(task.assigneeId).lean();
              if (assignee) {
                return {
                  ...task,
                  id: task._id.toString(),
                  assigneeName: `${assignee.firstName} ${assignee.lastName}`,
                  viewed: viewedTaskIds.has(task._id.toString())
                };
              }
            }
            return {
              ...task,
              id: task._id.toString(),
              viewed: viewedTaskIds.has(task._id.toString())
            };
          } catch (err) {
            return {
              ...task,
              id: task._id.toString(),
              viewed: viewedTaskIds.has(task._id.toString())
            };
          }
        })
      );
      
      res.json(tasksWithAssigneeInfo);
    } catch (error: unknown) {
      console.error(`Error fetching tasks for ticket ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  });
  
  // Mark a task as viewed
  app.post("/api/tasks/:taskId/view", async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { TaskView } = await import('./models/TaskView');
      const { Task } = await import('./models/Task');

      // Verify task exists
      const task = await Task.findById(req.params.taskId);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }

      // Create or update task view
      await TaskView.findOneAndUpdate(
        { 
          userId: req.user.id,
          taskId: req.params.taskId
        },
        { 
          $set: { viewedAt: new Date() }
        },
        { 
          upsert: true,
          new: true
        }
      );

      res.json({ success: true });
    } catch (error: unknown) {
      console.error('Error marking task as viewed:', error);
      res.status(500).json({ error: "Failed to mark task as viewed" });
    }
  });

  // Get viewed status for multiple tasks
  app.post("/api/tasks/viewed-status", async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const taskIds = req.body.taskIds;
      if (!Array.isArray(taskIds)) {
        return res.status(400).json({ error: "taskIds must be an array" });
      }

      const { TaskView } = await import('./models/TaskView');

      const viewedTasks = await TaskView.find({
        userId: req.user.id,
        taskId: { $in: taskIds }
      }).lean();

      const viewedTaskIds = viewedTasks.map(view => view.taskId.toString());

      res.json({
        viewedTasks: taskIds.reduce((acc: Record<string, boolean>, taskId: string) => {
          acc[taskId] = viewedTaskIds.includes(taskId);
          return acc;
        }, {})
      });
    } catch (error: unknown) {
      console.error('Error fetching viewed status:', error);
      res.status(500).json({ error: "Failed to fetch viewed status" });
    }
  });

  // Mark multiple tasks as viewed in batch
  app.post("/api/tasks/viewed-status/batch", async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { taskIds } = req.body;
      if (!Array.isArray(taskIds)) {
        return res.status(400).json({ error: "taskIds must be an array" });
      }

      const { TaskView } = await import('./models/TaskView');
      const { Task } = await import('./models/Task');

      // Verify all tasks exist
      const tasks = await Task.find({ _id: { $in: taskIds } });
      if (tasks.length !== taskIds.length) {
        return res.status(404).json({ error: "Some tasks not found" });
      }

      // Create task views in bulk
      const operations = taskIds.map(taskId => ({
        updateOne: {
          filter: { userId: req.user.id, taskId },
          update: { $set: { viewedAt: new Date() } },
          upsert: true
        }
      }));

      await TaskView.bulkWrite(operations);

      res.json({ success: true });
    } catch (error: unknown) {
      console.error('Error marking tasks as viewed in batch:', error);
      res.status(500).json({ error: "Failed to mark tasks as viewed" });
    }
  });

  // Admin Ticket Management API Endpoints

  // Get all tickets with pagination and filtering
  app.get("/api/admin/tickets", isAdmin, async (req, res) => {
    try {
      console.log("=== Admin ticket fetch request received ===");
      console.log("User:", req.user ? `ID: ${req.user.id}, isAdmin: ${req.user.isAdmin}` : "No user");
      
      // Parse query parameters
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      console.log("Pagination:", { page, limit });
      
      // Build filter object based on query parameters
      const filter: Record<string, any> = {};
      if (req.query.status && req.query.status !== 'all') filter.status = req.query.status;
      if (req.query.priority && req.query.priority !== 'all') filter.priority = req.query.priority;
      if (req.query.userId) filter.userId = req.query.userId;
      if (req.query.serviceId) filter.serviceId = req.query.serviceId;
      
      console.log("Applied filters:", filter);
      
      // Make sure the MongoDB connection is available
      if (mongoose.connection.readyState !== 1) {
        console.error("MongoDB connection is not open. Current state:", mongoose.connection.readyState);
        return res.status(500).json({ 
          error: "Database connection is not available", 
          detail: "Database connection state: " + mongoose.connection.readyState 
        });
      }
      
      console.log("Calling storage.getTickets method");
      const result = await storage.getTickets(page, limit, filter);
      console.log(`Received ${result.tickets.length} tickets from storage`);
      
      const response = {
        tickets: result.tickets,
        pagination: {
          page,
          limit,
          total: result.total,
          pages: Math.ceil(result.total / limit)
        }
      };
      
      console.log("Sending response with pagination:", response.pagination);
      res.json(response);
    } catch (error: unknown) {
      console.error("Admin ticket fetch error:", error);
      // Detailed error logging
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
      
      // Send appropriate error response
      res.status(500).json({ 
        error: "Failed to fetch tickets",
        message: error instanceof Error ? error.message : "Unknown error occurred",
        timestamp: new Date().toISOString()
      });
    }
  });

  // Get a specific ticket with detailed information
  app.get("/api/admin/tickets/:id", isAdmin, async (req, res) => {
    try {
      console.log(`=== Admin fetch for specific ticket ${req.params.id} ===`);
      console.log("User:", req.user ? `ID: ${req.user.id}` : "No user");
      
      // Fetch ticket
      console.log("Fetching ticket with ID:", req.params.id);
      const ticket = await storage.getTicketById(req.params.id);
      console.log("Ticket fetched successfully:", ticket.id);
      
      // Get user information for this ticket
      let user = null;
      try {
        console.log("Fetching user for ticket, user ID:", ticket.userId);
        user = await storage.getUser(ticket.userId);
        console.log("User fetched successfully");
      } catch (userError) {
        console.error(`Error fetching user for ticket ${req.params.id}:`, userError);
        console.log("Continuing without user information");
      }
      
      // Get tasks for this ticket
      console.log("Fetching tasks for ticket ID:", ticket.id);
      const tasks = await storage.getTasks(req.params.id);
      console.log(`Found ${tasks.length} tasks for this ticket`);
      
      const response = {
        ticket,
        user,
        tasks
      };
      
      console.log("Sending full ticket details response");
      res.json(response);
    } catch (error) {
      console.error(`Error fetching ticket ${req.params.id}:`, error);
      
      // Detailed error logging
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
      
      // Send appropriate error response
      const statusCode = error.message?.includes("not found") ? 404 : 500;
      res.status(statusCode).json({ 
        error: statusCode === 404 ? "Ticket not found" : "Failed to fetch ticket details",
        message: error instanceof Error ? error.message : "Unknown error occurred",
        ticketId: req.params.id,
        timestamp: new Date().toISOString()
      });
    }
  });

  // Update a ticket
  app.put("/api/admin/tickets/:id", isAdmin, async (req, res) => {
    try {
      const ticketData = updateTicketSchema.parse(req.body);
      const ticket = await storage.updateTicket(req.params.id, ticketData);
      res.json(ticket);
    } catch (error: unknown) {
      console.error(`Error updating ticket ${req.params.id}:`, error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: "Invalid ticket data" });
      }
    }
  });

  // Delete a ticket
  app.delete("/api/admin/tickets/:id", isAdmin, async (req, res) => {
    try {
      const success = await storage.deleteTicket(req.params.id);
      if (success) {
        res.status(204).end();
      } else {
        res.status(404).json({ error: "Ticket not found" });
      }
    } catch (error: unknown) {
      console.error(`Error deleting ticket ${req.params.id}:`, error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Failed to delete ticket" });
      }
    }
  });

  // Get tasks for a specific ticket
  app.get("/api/admin/tickets/:id/tasks", isAdmin, async (req, res) => {
    try {
      const tasks = await storage.getTasks(req.params.id);
      res.json(tasks);
    } catch (error: unknown) {
      console.error(`Error fetching tasks for ticket ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  });

  // Create a task for a specific ticket
  app.post("/api/admin/tickets/:id/tasks", isAdmin, async (req, res) => {
    try {
      // Ensure the ticketId in the body matches the URL parameter
      const taskData = insertTaskSchema.parse({
        ...req.body,
        ticketId: req.params.id
      });
      
      const task = await storage.createTask(taskData);

      // Broadcast notification to all connected clients
      if (req.app.locals.broadcastNotification) {
        req.app.locals.broadcastNotification({
          type: 'notification',
          message: `New task assigned: ${task.title}`,
          notificationType: 'info',
          taskId: task.id
        });
      }
      
      res.status(201).json(task);
    } catch (error: unknown) {
      console.error(`Error creating task for ticket ${req.params.id}:`, error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: "Invalid task data" });
      }
    }
  });

  // Update a task
  app.put("/api/admin/tasks/:id", isAdmin, async (req, res) => {
    try {
      const taskData = updateTaskSchema.parse(req.body);
      const task = await storage.updateTask(req.params.id, taskData);
      res.json(task);
    } catch (error: unknown) {
      console.error(`Error updating task ${req.params.id}:`, error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: "Invalid task data" });
      }
    }
  });

  // Delete a task
  app.delete("/api/admin/tasks/:id", isAdmin, async (req, res) => {
    try {
      const success = await storage.deleteTask(req.params.id);
      if (success) {
        res.status(204).end();
      } else {
        res.status(404).json({ error: "Task not found" });
      }
    } catch (error: unknown) {
      console.error(`Error deleting task ${req.params.id}:`, error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Failed to delete task" });
      }
    }
  });

  // Get all users (admin only)
  app.get("/api/admin/users", isAdmin, async (req, res) => {
    try {
      // Import the User model
      const { User } = await import('./models/User');
      
      // Find all users, excluding password field
      const users = await User.find({}, { password: 0 });
      
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ 
        error: "Failed to fetch users", 
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Delete a user (admin only)
  app.delete("/api/admin/users/:id", isAdmin, async (req, res) => {
    try {
      // Import the User model
      const { User } = await import('./models/User');
      
      // Find the user to delete
      const user = await User.findById(req.params.id);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Prevent admin from deleting themselves
      if (user._id.toString() === req.user._id.toString()) {
        return res.status(400).json({ error: "Cannot delete your own admin account" });
      }

      // Delete the user
      await User.deleteOne({ _id: req.params.id });
      
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ 
        error: "Failed to delete user", 
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Request OTP
  app.post("/api/auth/request-otp", otpLimiter, async (req, res) => {
    try {
      const { username } = req.body;
      const deviceInfo = getDeviceInfo(req);

      if (!username) {
        return res.status(400).json({ 
          message: "Username is required" 
        });
      }

      // Check if user exists
      let user = await storage.getUserByUsername(username);
      
      if (!user) {
        // For new users, create an account
        try {
          user = await storage.createUser({ username });
          console.log('New user created:', username);
        } catch (error) {
          console.error('User creation error:', error);
          return res.status(500).json({ 
            message: error instanceof Error ? error.message : "Error creating user"
          });
        }
      }

      // Generate OTP
      try {
        const otp = await otpService.createOTP(user.id, deviceInfo);
        
        // In production, you would send this OTP via SMS
        // For now, it's logged to console in otpService

        res.json({ 
          message: "OTP sent successfully",
          userId: user.id 
        });
      } catch (error) {
        console.error("OTP generation error:", error);
        return res.status(500).json({ 
          message: error instanceof Error ? error.message : "Failed to generate OTP"
        });
      }
    } catch (error) {
      console.error("OTP request error:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to send OTP" 
      });
    }
  });

  // Verify OTP and login
  app.post("/api/auth/verify-otp", otpVerificationLimiter, async (req, res) => {
    try {
      const { userId, otp } = req.body;
      const deviceInfo = getDeviceInfo(req);

      if (!userId || !otp) {
        return res.status(400).json({ 
          message: "User ID and OTP are required" 
        });
      }

      try {
        // Verify OTP
        const isValid = await otpService.verifyOTP(userId, otp, deviceInfo);

        if (!isValid) {
          return res.status(401).json({ 
            message: "Invalid OTP" 
          });
        }

        // Get user
        const user = await storage.getUser(userId);
        
        if (!user) {
          return res.status(404).json({ 
            message: "User not found" 
          });
        }

        // Login the user
        req.login(user, (loginErr) => {
          if (loginErr) {
            console.error("Session creation error:", loginErr);
            return res.status(500).json({ 
              message: "Error creating session" 
            });
          }
          
          // Return user without sensitive data
          const safeUser = {
            id: user.id,
            username: user.username,
            createdAt: user.createdAt
          };
          
          return res.json(safeUser);
        });
      } catch (error) {
        if (error instanceof Error && error.message === 'OTP has expired') {
          return res.status(401).json({ 
            message: "OTP has expired" 
          });
        }
        if (error instanceof Error && 
           (error.message.includes('Account is locked') || 
            error.message.includes('Maximum attempts exceeded'))) {
          return res.status(429).json({ 
            message: error.message 
          });
        }
        throw error;
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to verify OTP" 
      });
    }
  });

  // Return the configured app (don't start the server here)
  return app;
}