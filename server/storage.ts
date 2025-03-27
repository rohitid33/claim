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
import { MongoStorage } from "./storage-mongo";

/**
 * Storage interface for database operations
 * This is implemented by MongoStorage in the current application
 */
export interface IStorage {
  createComplaint(complaint: InsertComplaint): Promise<Complaint>;
  getComplaints(): Promise<Complaint[]>;
  getBlogPosts(): Promise<BlogPost[]>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;

  // User-related operations
  createUser(user: InsertUser): Promise<User>;
  getUser(id: number | string): Promise<User>;
  getUserByUsername(username: string): Promise<User | null>;

  // Category operations
  getCategories(): Promise<Category[]>;
  getCategoryById(id: string): Promise<Category>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: UpdateCategory): Promise<Category>;
  deleteCategory(id: string): Promise<boolean>;

  // Subcategory operations
  getSubcategories(): Promise<Subcategory[]>;
  getSubcategoriesByCategory(categoryId: string): Promise<Subcategory[]>;
  getSubcategoryById(id: string): Promise<Subcategory>;
  createSubcategory(subcategory: InsertSubcategory): Promise<Subcategory>;
  updateSubcategory(id: string, subcategory: UpdateSubcategory): Promise<Subcategory>;
  deleteSubcategory(id: string): Promise<boolean>;

  // Ticket operations
  getTickets(page?: number, limit?: number, filter?: Record<string, any>): Promise<{ tickets: Ticket[], total: number }>;
  getTicketsByUser(userId: string): Promise<Ticket[]>;
  getTicketById(id: string): Promise<Ticket>;
  createTicket(ticket: InsertTicket): Promise<Ticket>;
  updateTicket(id: string, ticket: UpdateTicket): Promise<Ticket>;
  deleteTicket(id: string): Promise<boolean>;

  // Task operations
  getTasks(ticketId: string): Promise<Task[]>;
  getTaskById(id: string): Promise<Task>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, task: UpdateTask): Promise<Task>;
  deleteTask(id: string): Promise<boolean>;

  // Session store
  sessionStore: session.Store;
}

// Initialize and export the MongoDB storage instance
export const storage = new MongoStorage();