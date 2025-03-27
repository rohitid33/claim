import { z } from "zod";

// Zod schemas for validation
export const userSchema = z.object({
  id: z.string().optional(), // MongoDB ObjectId is a string
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  createdAt: z.date().or(z.string()).optional(), // MongoDB might return date as string
  isAdmin: z.boolean().optional().default(false),
  preferredAuthMethod: z.enum(['otp', 'password']).optional().default('otp')
});

export const complaintSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  policyNumber: z.string().min(1, "Policy number is required"),
  insuranceType: z.string().min(1, "Insurance type is required"),
  message: z.string().min(1, "Message is required"),
  userId: z.string().optional(),
  createdAt: z.date().or(z.string()).optional(),
});

export const blogPostSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  imageUrl: z.string().min(1, "Image URL is required"),
  createdAt: z.date().or(z.string()).optional(),
});

// Category schema
export const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Category name is required"),
  icon: z.string().optional(),
  description: z.string().optional(),
  number: z.number().default(0),
  tags: z.array(z.string()).optional().default([]),
  createdAt: z.date().or(z.string()).optional(),
  updatedAt: z.date().or(z.string()).optional(),
});

// Subcategory schema
export const subcategorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Subcategory name is required"),
  categoryId: z.string().min(1, "Category ID is required"),
  serviceIds: z.array(z.string()).optional().default([]),
  createdAt: z.date().or(z.string()).optional(),
  updatedAt: z.date().or(z.string()).optional(),
});

// Ticket schema
export const ticketSchema = z.object({
  id: z.string().optional(),
  serviceId: z.string().min(1, "Service ID is required"),
  serviceName: z.string().min(1, "Service name is required"),
  userId: z.string().min(1, "User ID is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(['new', 'processing', 'completed', 'rejected']).default('new'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  createdAt: z.date().or(z.string()).optional(),
  updatedAt: z.date().or(z.string()).optional(),
});

// Task schema
export const taskSchema = z.object({
  id: z.string().optional(),
  ticketId: z.string().min(1, "Ticket ID is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(['pending', 'in_progress', 'completed']).default('pending'),
  createdAt: z.date().or(z.string()).optional(),
  dueDate: z.date().or(z.string()),
  assigneeId: z.string().min(1, "Assignee ID is required"),
  updatedAt: z.date().or(z.string()).optional(),
});

// Insert schemas (omitting auto-generated fields)
export const insertUserSchema = userSchema.omit({ 
  id: true,
  createdAt: true 
});

export const insertComplaintSchema = complaintSchema.omit({ 
  id: true,
  createdAt: true,
  userId: true 
});

export const insertBlogPostSchema = blogPostSchema.omit({ 
  id: true,
  createdAt: true 
});

export const insertCategorySchema = categorySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertSubcategorySchema = subcategorySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertTicketSchema = ticketSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertTaskSchema = taskSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// Update schemas
export const updateCategorySchema = insertCategorySchema.partial();
export const updateSubcategorySchema = insertSubcategorySchema.partial();
export const updateTicketSchema = insertTicketSchema.partial();
export const updateTaskSchema = insertTaskSchema.partial();

// Types
export type User = z.infer<typeof userSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Complaint = z.infer<typeof complaintSchema>;
export type InsertComplaint = z.infer<typeof insertComplaintSchema>;
export type BlogPost = z.infer<typeof blogPostSchema>;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type Category = z.infer<typeof categorySchema>;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type UpdateCategory = z.infer<typeof updateCategorySchema>;
export type Subcategory = z.infer<typeof subcategorySchema>;
export type InsertSubcategory = z.infer<typeof insertSubcategorySchema>;
export type UpdateSubcategory = z.infer<typeof updateSubcategorySchema>;
export type Ticket = z.infer<typeof ticketSchema>;
export type InsertTicket = z.infer<typeof insertTicketSchema>;
export type UpdateTicket = z.infer<typeof updateTicketSchema>;
export type Task = z.infer<typeof taskSchema>;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type UpdateTask = z.infer<typeof updateTaskSchema>;