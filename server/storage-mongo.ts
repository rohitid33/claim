import { 
  type Complaint, 
  type InsertComplaint, 
  type BlogPost, 
  type InsertBlogPost, 
  type User, 
  type InsertUser,
  type Category,
  type InsertCategory,
  type UpdateCategory,
  type Subcategory,
  type InsertSubcategory,
  type UpdateSubcategory,
  type Ticket,
  type InsertTicket,
  type UpdateTicket,
  type Task,
  type InsertTask,
  type UpdateTask
} from "@shared/schema";
import session from "express-session";
import { IStorage } from "./storage";
import mongoose, { Document } from 'mongoose'; // Add mongoose import
import { User as UserModel, IUser } from "./models/User";
import { Complaint as ComplaintModel } from "./models/Complaint";
import { BlogPost as BlogPostModel } from "./models/BlogPost";
import { Category as CategoryModel } from "./models/Category";
import { Subcategory as SubcategoryModel } from "./models/Subcategory";
import { Ticket as TicketModel } from "./models/Ticket";
import { Task as TaskModel } from "./models/Task";
import { connectToMongoDB } from "./db/mongodb-connection";
import MongoStore from "connect-mongo";
import { env } from './config/env';

interface MongoDocument extends Document {
  _id: mongoose.Types.ObjectId;
}

export class MongoStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    // Initialize MongoDB connection with proper error handling
    connectToMongoDB()
      .then(() => {
        console.log('MongoDB connection established in MongoStorage');
      })
      .catch(err => {
        console.error('Failed to connect to MongoDB in MongoStorage:', err);
      });

    // Create MongoDB session store with improved configuration
    this.sessionStore = MongoStore.create({
      mongoUrl: env.database.mongodb.uri,
      collectionName: 'sessions',
      ttl: env.auth.sessionDuration / 1000, // Convert from ms to seconds
      autoRemove: 'disabled', // Disable automatic removal to prevent premature session deletion
      touchAfter: 60, // Update session every minute if there are changes
      crypto: {
        secret: env.auth.sessionSecret
      },
      mongoOptions: {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        family: 4
      },
      stringify: false, // Don't stringify session data
      autoReconnect: true,
      fallbackMemory: true // Use memory as fallback if DB connection fails
    });

    // Handle session store errors
    this.sessionStore.on('error', (error) => {
      console.error('Session store error:', error);
    });

    // Log session store events in development
    if (env.isDevelopment) {
      this.sessionStore.on('create', (sessionId) => {
        console.log('Session created:', sessionId);
      });
      this.sessionStore.on('touch', (sessionId) => {
        console.log('Session touched:', sessionId);
      });
      this.sessionStore.on('destroy', (sessionId) => {
        console.log('Session destroyed:', sessionId);
      });
    }
  }

  // Helper method to validate MongoDB connection
  private validateConnection(): void {
    if (mongoose.connection.readyState !== 1) {
      console.error("MongoDB connection is not open. Current state:", mongoose.connection.readyState);
      throw new Error("Database connection is not available");
    }
  }

  async createComplaint(insertComplaint: InsertComplaint): Promise<Complaint> {
    const complaint = new ComplaintModel(insertComplaint);
    await complaint.save();
    return complaint.toJSON() as Complaint;
  }

  async getComplaints(): Promise<Complaint[]> {
    const complaints = await ComplaintModel.find().sort({ createdAt: -1 });
    return complaints.map(complaint => complaint.toJSON() as Complaint);
  }

  async getBlogPosts(): Promise<BlogPost[]> {
    const blogPosts = await BlogPostModel.find().sort({ createdAt: -1 });
    return blogPosts.map(post => post.toJSON() as BlogPost);
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const blogPost = new BlogPostModel(insertPost);
    await blogPost.save();
    return blogPost.toJSON() as BlogPost;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user = new UserModel(insertUser);
    await user.save();
    const userDoc = user.toObject();
    return {
      id: user._id.toString(),
      username: userDoc.username,
      createdAt: userDoc.createdAt,
      preferredAuthMethod: userDoc.preferredAuthMethod
    };
  }

  async getUser(id: string | number): Promise<User> {
    try {
      // Validate MongoDB connection
      this.validateConnection();

      // Validate ID format
      if (!mongoose.Types.ObjectId.isValid(id)) {
        console.error('Invalid MongoDB ID format:', id);
        throw new Error("Invalid user ID format");
      }

      const user = await UserModel.findById(id);
      if (!user) {
        console.error('User not found for ID:', id);
        throw new Error("User not found");
      }

      const userDoc = user.toObject();
      return {
        id: user._id.toString(),
        username: userDoc.username,
        createdAt: userDoc.createdAt,
        preferredAuthMethod: userDoc.preferredAuthMethod
      };
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw new Error("User not found or invalid ID format");
    }
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const user = await UserModel.findOne({ username });
    if (!user) return null;
    
    const userDoc = user.toObject();
    return {
      id: user._id.toString(),
      username: userDoc.username,
      createdAt: userDoc.createdAt,
      preferredAuthMethod: userDoc.preferredAuthMethod
    };
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    const categories = await CategoryModel.find().sort({ name: 1 });
    return categories.map(category => category.toJSON() as Category);
  }

  async getCategoryById(id: string): Promise<Category> {
    try {
      const category = await CategoryModel.findById(id);
      if (!category) {
        throw new Error("Category not found");
      }
      return category.toJSON() as Category;
    } catch (error) {
      console.error('Error fetching category by ID:', error);
      throw new Error("Category not found or invalid ID format");
    }
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    try {
      console.log("MongoStorage: Creating category with data:", insertCategory);
      
      // Check if the category already exists
      const existingCategory = await CategoryModel.findOne({ name: insertCategory.name });
      if (existingCategory) {
        console.log("MongoStorage: Category already exists:", existingCategory);
        return existingCategory.toJSON() as Category;
      }
      
      const category = new CategoryModel(insertCategory);
      console.log("MongoStorage: Category model instance created:", category);
      
      const savedCategory = await category.save();
      console.log("MongoStorage: Category saved to database:", savedCategory);
      
      return savedCategory.toJSON() as Category;
    } catch (error) {
      console.error('Error creating category in MongoDB:', error);
      if ((error as any).code === 11000) {
        throw new Error("A category with this name already exists");
      }
      throw new Error(`Failed to create category: ${error.message}`);
    }
  }

  async updateCategory(id: string, updateData: UpdateCategory): Promise<Category> {
    try {
      const category = await CategoryModel.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      );
      
      if (!category) {
        throw new Error("Category not found");
      }
      
      return category.toJSON() as Category;
    } catch (error) {
      console.error('Error updating category:', error);
      if ((error as any).code === 11000) {
        throw new Error("A category with this name already exists");
      }
      throw new Error("Failed to update category");
    }
  }

  async deleteCategory(id: string): Promise<boolean> {
    try {
      // Check if there are any subcategories using this category
      const subcategoryCount = await SubcategoryModel.countDocuments({ categoryId: id });
      if (subcategoryCount > 0) {
        throw new Error("Cannot delete category that has subcategories");
      }
      
      const result = await CategoryModel.deleteOne({ _id: id });
      return result.deletedCount === 1;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }

  // Subcategory methods
  async getSubcategories(): Promise<Subcategory[]> {
    const subcategories = await SubcategoryModel.find().sort({ name: 1 });
    return subcategories.map(subcategory => subcategory.toJSON() as Subcategory);
  }

  async getSubcategoriesByCategory(categoryId: string): Promise<Subcategory[]> {
    const subcategories = await SubcategoryModel.find({ categoryId }).sort({ name: 1 });
    return subcategories.map(subcategory => subcategory.toJSON() as Subcategory);
  }

  async getSubcategoryById(id: string): Promise<Subcategory> {
    try {
      const subcategory = await SubcategoryModel.findById(id);
      if (!subcategory) {
        throw new Error("Subcategory not found");
      }
      return subcategory.toJSON() as Subcategory;
    } catch (error) {
      console.error('Error fetching subcategory by ID:', error);
      throw new Error("Subcategory not found or invalid ID format");
    }
  }

  async createSubcategory(insertSubcategory: InsertSubcategory): Promise<Subcategory> {
    try {
      console.log("MongoStorage: Creating subcategory with data:", insertSubcategory);
      
      // Verify that the category exists
      const categoryExists = await CategoryModel.exists({ _id: insertSubcategory.categoryId });
      if (!categoryExists) {
        console.error("MongoStorage: Category not found for subcategory creation:", insertSubcategory.categoryId);
        throw new Error("Category not found");
      }
      
      console.log("MongoStorage: Category exists, creating subcategory model");
      const subcategory = new SubcategoryModel(insertSubcategory);
      console.log("MongoStorage: Subcategory model created, saving to database");
      
      const savedSubcategory = await subcategory.save();
      console.log("MongoStorage: Subcategory saved successfully:", savedSubcategory);
      
      return savedSubcategory.toJSON() as Subcategory;
    } catch (error) {
      console.error('Error creating subcategory in MongoDB:', error);
      if ((error as any).code === 11000) {
        throw new Error("A subcategory with this name already exists in this category");
      }
      throw error;
    }
  }

  async updateSubcategory(id: string, updateData: UpdateSubcategory): Promise<Subcategory> {
    try {
      // If categoryId is being updated, verify that the new category exists
      if (updateData.categoryId) {
        const categoryExists = await CategoryModel.exists({ _id: updateData.categoryId });
        if (!categoryExists) {
          throw new Error("Category not found");
        }
      }
      
      const subcategory = await SubcategoryModel.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      );
      
      if (!subcategory) {
        throw new Error("Subcategory not found");
      }
      
      return subcategory.toJSON() as Subcategory;
    } catch (error) {
      console.error('Error updating subcategory:', error);
      if ((error as any).code === 11000) {
        throw new Error("A subcategory with this name already exists in this category");
      }
      throw error;
    }
  }

  async deleteSubcategory(id: string): Promise<boolean> {
    try {
      const result = await SubcategoryModel.deleteOne({ _id: id });
      return result.deletedCount === 1;
    } catch (error) {
      console.error('Error deleting subcategory:', error);
      throw error;
    }
  }

  // Ticket methods
  async getTickets(page = 1, limit = 10, filter = {}): Promise<{ tickets: Ticket[], total: number }> {
    try {
      console.log("=== getTickets method called ===");
      console.log("Parameters:", { page, limit, filter });
      
      const skip = (page - 1) * limit;
      
      // Validate MongoDB connection using helper method
      this.validateConnection();
      
      console.log("MongoDB connection is available, proceeding with query");
      
      // Find tickets with optional filtering
      console.log("Executing query with filter:", JSON.stringify(filter));
      const tickets = await TicketModel.find(filter)
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
      
      console.log(`Query executed successfully, found ${tickets.length} tickets`);
      
      // Get total count for pagination
      const total = await TicketModel.countDocuments(filter);
      console.log(`Total tickets matching filter: ${total}`);
      
      // Map tickets to return format
      const formattedTickets = tickets.map(ticket => {
        console.log(`Processing ticket ID: ${ticket._id}`);
        return {
          ...ticket,
          id: ticket._id.toString()
        };
      }) as Ticket[];
      
      console.log("Successfully formatted tickets for response");
      return {
        tickets: formattedTickets,
        total
      };
    } catch (error) {
      console.error('Error fetching tickets:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
        console.error('Error stack:', error.stack);
      }
      throw new Error(`Failed to fetch tickets: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getTicketsByUser(userId: string): Promise<Ticket[]> {
    try {
      console.log(`=== getTicketsByUser called for user ID: ${userId} ===`);
      
      // Validate connection
      this.validateConnection();
      
      const tickets = await TicketModel.find({ userId })
        .sort({ updatedAt: -1 })
        .lean();
      
      console.log(`Found ${tickets.length} tickets for user ${userId}`);
      
      return tickets.map(ticket => ({
        ...ticket,
        id: ticket._id.toString()
      })) as Ticket[];
    } catch (error) {
      console.error('Error fetching user tickets:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
        console.error('Error stack:', error.stack);
      }
      throw new Error(`Failed to fetch user tickets: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getTicketById(id: string): Promise<Ticket> {
    try {
      console.log(`=== getTicketById called for ticket ID: ${id} ===`);
      
      // Validate connection
      this.validateConnection();
      
      const ticket = await TicketModel.findById(id).lean();
      
      if (!ticket) {
        console.error(`Ticket with ID ${id} not found`);
        throw new Error("Ticket not found");
      }
      
      console.log(`Successfully found ticket with ID: ${id}`);
      
      return {
        ...ticket,
        id: ticket._id.toString()
      } as Ticket;
    } catch (error) {
      console.error('Error fetching ticket by ID:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
        console.error('Error stack:', error.stack);
      }
      throw new Error(`Ticket not found or invalid ID format: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async createTicket(insertTicket: InsertTicket): Promise<Ticket> {
    try {
      console.log(`=== createTicket called ===`);
      console.log('Ticket data:', JSON.stringify(insertTicket, null, 2));
      
      // Validate connection
      this.validateConnection();
      
      // Check if userId exists
      if (insertTicket.userId) {
        const userExists = await UserModel.exists({ _id: insertTicket.userId });
        if (!userExists) {
          console.error(`User with ID ${insertTicket.userId} not found`);
        }
      }
      
      const ticket = new TicketModel(insertTicket);
      await ticket.save();
      
      console.log(`Ticket created successfully with ID: ${ticket._id}`);
      
      return {
        ...ticket.toJSON(),
        id: ticket._id.toString()
      } as Ticket;
    } catch (error) {
      console.error('Error creating ticket:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
        console.error('Error stack:', error.stack);
      }
      throw new Error(`Failed to create ticket: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateTicket(id: string, updateData: UpdateTicket): Promise<Ticket> {
    try {
      console.log(`=== updateTicket called for ticket ID: ${id} ===`);
      console.log('Update data:', JSON.stringify(updateData, null, 2));
      
      // Validate connection
      this.validateConnection();
      
      const ticket = await TicketModel.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      );
      
      if (!ticket) {
        console.error(`Ticket with ID ${id} not found for update`);
        throw new Error("Ticket not found");
      }
      
      console.log(`Ticket updated successfully: ${id}`);
      
      return {
        ...ticket.toJSON(),
        id: ticket._id.toString()
      } as Ticket;
    } catch (error) {
      console.error(`Error updating ticket ${id}:`, error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
        console.error('Error stack:', error.stack);
      }
      throw new Error(`Failed to update ticket: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteTicket(id: string): Promise<boolean> {
    try {
      console.log(`=== deleteTicket called for ticket ID: ${id} ===`);
      
      // Validate connection
      this.validateConnection();
      
      // Check if there are any tasks associated with this ticket
      const taskCount = await TaskModel.countDocuments({ ticketId: id });
      console.log(`Found ${taskCount} tasks associated with ticket ${id}`);
      
      if (taskCount > 0) {
        console.log(`Deleting ${taskCount} tasks associated with ticket ${id}`);
        // Delete all related tasks first
        const taskDeleteResult = await TaskModel.deleteMany({ ticketId: id });
        console.log(`Deleted ${taskDeleteResult.deletedCount} tasks`);
      }
      
      console.log(`Deleting ticket ${id}`);
      const result = await TicketModel.deleteOne({ _id: id });
      const success = result.deletedCount === 1;
      
      if (success) {
        console.log(`Successfully deleted ticket ${id}`);
      } else {
        console.log(`Ticket ${id} not found for deletion`);
      }
      
      return success;
    } catch (error) {
      console.error(`Error deleting ticket ${id}:`, error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
        console.error('Error stack:', error.stack);
      }
      throw new Error(`Failed to delete ticket: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Task methods
  async getTasks(ticketId: string): Promise<Task[]> {
    try {
      console.log(`=== getTasks called for ticket ID: ${ticketId} ===`);
      
      // Validate connection
      this.validateConnection();
      
      // Validate that ticket exists
      const ticketExists = await TicketModel.exists({ _id: ticketId });
      if (!ticketExists) {
        console.log(`Warning: Getting tasks for non-existent ticket ${ticketId}`);
      }
      
      const tasks = await TaskModel.find({ ticketId })
        .sort({ createdAt: -1 })
        .lean();
      
      console.log(`Found ${tasks.length} tasks for ticket ${ticketId}`);
      
      return tasks.map(task => ({
        ...task,
        id: task._id.toString()
      })) as Task[];
    } catch (error) {
      console.error(`Error fetching tasks for ticket ${ticketId}:`, error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
        console.error('Error stack:', error.stack);
      }
      throw new Error(`Failed to fetch tasks: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getTaskById(id: string): Promise<Task> {
    try {
      const task = await TaskModel.findById(id).lean();
      if (!task) {
        throw new Error("Task not found");
      }
      
      return {
        ...task,
        id: task._id.toString()
      } as Task;
    } catch (error) {
      console.error('Error fetching task by ID:', error);
      throw new Error("Task not found or invalid ID format");
    }
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    try {
      // Verify the ticket exists
      const ticketExists = await TicketModel.exists({ _id: insertTask.ticketId });
      if (!ticketExists) {
        throw new Error("Ticket not found");
      }
      
      // Verify the assignee exists
      const assigneeExists = await UserModel.exists({ _id: insertTask.assigneeId });
      if (!assigneeExists) {
        throw new Error("Assignee not found");
      }
      
      const task = new TaskModel(insertTask);
      await task.save();
      
      return {
        ...task.toJSON(),
        id: task._id.toString()
      } as Task;
    } catch (error) {
      console.error('Error creating task:', error);
      throw new Error(`Failed to create task: ${error.message}`);
    }
  }

  async updateTask(id: string, updateData: UpdateTask): Promise<Task> {
    try {
      // If ticketId is being updated, verify the ticket exists
      if (updateData.ticketId) {
        const ticketExists = await TicketModel.exists({ _id: updateData.ticketId });
        if (!ticketExists) {
          throw new Error("Ticket not found");
        }
      }
      
      // If assigneeId is being updated, verify the assignee exists
      if (updateData.assigneeId) {
        const assigneeExists = await UserModel.exists({ _id: updateData.assigneeId });
        if (!assigneeExists) {
          throw new Error("Assignee not found");
        }
      }
      
      const task = await TaskModel.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      );
      
      if (!task) {
        throw new Error("Task not found");
      }
      
      return {
        ...task.toJSON(),
        id: task._id.toString()
      } as Task;
    } catch (error) {
      console.error('Error updating task:', error);
      throw new Error("Failed to update task");
    }
  }

  async deleteTask(id: string): Promise<boolean> {
    try {
      const result = await TaskModel.deleteOne({ _id: id });
      return result.deletedCount === 1;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }
}

// Initialize and export the MongoDB storage instance
export const mongoStorage = new MongoStorage();
export default mongoStorage;