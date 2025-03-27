# Code Index

This document provides an overview of the codebase structure and organization to help you navigate and understand the project.

## Project Overview

This is a full-stack web application built with:
- Frontend: React with TypeScript
- Backend: Express.js with TypeScript
- Database: MongoDB 
- Authentication: Express session-based authentication
- Styling: Tailwind CSS with additional UI components from Radix UI

The application appears to be a service management platform that allows users to browse services, submit tickets, and administrators to manage those tickets.

## Directory Structure

### Root Level

- `/client`: Frontend React application
- `/server`: Backend Express server
- `/shared`: Shared types and utilities used by both client and server
- `/dist`: Build output directory
- `/node_modules`: External dependencies

## Server-side Code

### Core Server Files

- `server/index.ts`: Entry point for the server application, sets up the Express server and connects to MongoDB
- `server/server.ts`: Main server configuration and setup
- `server/routes.ts`: API route definitions for the application
- `server/auth.ts`: Authentication setup and logic
- `server/admin-auth.ts`: Admin-specific authentication

### Database

- `server/db/mongodb-connection.ts`: MongoDB connection setup
- `server/db/schema.ts`: Database schema definitions
- `server/storage.ts`: Data access layer for the application
- `server/storage-mongo.ts`: MongoDB implementation of the storage interface

### Models

- `server/models/User.ts`: User model definition
- `server/models/AdminUser.ts`: Admin user model
- `server/models/Service.ts`: Service model definition
- `server/models/Category.ts`: Category model
- `server/models/Subcategory.ts`: Subcategory model
- `server/models/Ticket.ts`: Ticket model for user service requests
- `server/models/Task.ts`: Task model for ticket resolution
- `server/models/Complaint.ts`: User complaint model
- `server/models/BlogPost.ts`: Blog post content model
- `server/models/AppService.ts`: Application service definition

### Configuration

- `server/config/env`: Environment configuration
- `server/config/server-config.ts`: Server configuration

### Middleware

- `server/middleware/admin-auth.ts`: Admin authentication middleware

## Client-side Code

### Entry Points

- `client/src/main.tsx`: Main React entry point
- `client/src/App.tsx`: Root React component

### Components

- `client/src/components/ui/`: Shared UI components
- `client/src/components/layout/`: Layout components like header, footer
- `client/src/components/admin/`: Admin dashboard components
- `client/src/components/services/`: Service-related components
- `client/src/components/ticket/`: Ticket management components
- `client/src/components/search/`: Search functionality components
- `client/src/components/home/`: Homepage components

### Pages

- `client/src/pages/home.tsx`: Homepage
- `client/src/pages/auth.tsx`: Authentication page
- `client/src/pages/search.tsx`: Search page
- `client/src/pages/services.tsx`: Services listing page
- `client/src/pages/service/`: Individual service pages
- `client/src/pages/tickets.tsx`: User tickets page
- `client/src/pages/ticket/`: Individual ticket pages
- `client/src/pages/admin-dashboard/`: Admin dashboard pages
- `client/src/pages/complaint.tsx`: User complaint submission page
- `client/src/pages/apply.tsx`: Service application page

### Hooks

- `client/src/hooks/use-auth.tsx`: Authentication hook
- `client/src/hooks/use-admin-auth.tsx`: Admin authentication hook
- `client/src/hooks/use-tickets.tsx`: Tickets data hook
- `client/src/hooks/use-ticket-tasks.tsx`: Ticket tasks hook
- `client/src/hooks/use-notifications.tsx`: Notifications hook
- `client/src/hooks/use-mobile.tsx`: Mobile detection hook
- `client/src/hooks/use-theme.tsx`: Theme management hook
- `client/src/hooks/use-toast.ts`: Toast notification hook

### Utilities

- `client/src/lib/utils.ts`: General utilities
- `client/src/lib/protected-route.tsx`: Route protection for authenticated users
- `client/src/lib/admin-protected-route.tsx`: Route protection for admin users
- `client/src/lib/queryClient.ts`: React Query client setup

### Data

- `client/src/data/categories-data.ts`: Category data
- `client/src/data/services-data.ts`: Services data
- `client/src/data/subcategories-data.ts`: Subcategories data

### Providers

- `client/src/providers/loading-provider.tsx`: Loading state provider

## API Endpoints

### Authentication
- `POST /api/auth/login`: User login
- `POST /api/auth/register`: User registration
- `POST /api/auth/logout`: User logout
- `GET /api/auth/me`: Get current user

### Admin Authentication
- `POST /api/admin-auth/login`: Admin login
- Various admin routes under `/api/admin` protected by admin middleware

### Services
- `GET /api/services`: Get all services
- `GET /api/services/:id`: Get specific service
- `POST /api/services`: Create new service (admin)
- `PUT /api/services/:id`: Update service (admin)
- `DELETE /api/services/:id`: Delete service (admin)

### Categories and Subcategories
- `GET /api/categories`: Get all categories
- `GET /api/categories/:id`: Get specific category
- `POST /api/categories`: Create new category (admin)
- `PUT /api/categories/:id`: Update category (admin)
- `DELETE /api/categories/:id`: Delete category (admin)
- Similar endpoints for subcategories under `/api/subcategories`

### Tickets
- `POST /api/tickets`: Create new ticket (authenticated user)
- `GET /api/tickets`: Get current user tickets
- `GET /api/tickets/:id`: Get specific ticket details
- `DELETE /api/tickets/:id`: Delete a ticket

### Admin Ticket Management
- `GET /api/admin/tickets`: Get all tickets with filtering (admin)
- `GET /api/admin/tickets/:id`: Get detailed ticket info (admin)
- `PUT /api/admin/tickets/:id`: Update ticket (admin)
- `DELETE /api/admin/tickets/:id`: Delete ticket (admin)

### Tasks
- `GET /api/admin/tickets/:id/tasks`: Get tasks for ticket (admin)
- `POST /api/admin/tickets/:id/tasks`: Create new task (admin)
- `PUT /api/admin/tasks/:id`: Update task (admin)
- `DELETE /api/admin/tasks/:id`: Delete task (admin)

## Database Schema

### User
- id: String (MongoDB ObjectId)
- email: String
- password: String (hashed)
- firstName: String
- lastName: String
- isAdmin: Boolean

### Service
- id: String (MongoDB ObjectId)
- title: String
- description: String
- icon: String
- features: String[]
- eligibility: String[]
- process: Object[]
- documents: String[]
- faqs: Object[]
- contactInfo: Object
- category: String
- subcategoryIds: String[]

### Category
- id: String (MongoDB ObjectId)
- name: String
- description: String (optional)

### Subcategory
- id: String (MongoDB ObjectId)
- name: String
- categoryId: String (reference to Category)
- serviceIds: String[] (references to Services)

### Ticket
- id: String (MongoDB ObjectId)
- userId: String (reference to User)
- serviceId: String (reference to Service)
- serviceName: String
- title: String
- description: String
- status: String ('new', 'in-progress', 'pending', 'resolved')
- priority: String ('low', 'medium', 'high')
- createdAt: Date
- updatedAt: Date

### Task
- id: String (MongoDB ObjectId)
- ticketId: String (reference to Ticket)
- title: String
- description: String
- status: String ('pending', 'in-progress', 'completed')
- assigneeId: String (reference to User, optional)
- createdAt: Date
- updatedAt: Date

## Authentication Flow

1. **User Authentication**:
   - Users register via `/api/auth/register`
   - Users login via `/api/auth/login`
   - The server uses express-session to maintain session information
   - Protected routes check for authenticated user via middleware

2. **Admin Authentication**:
   - Admins login via `/api/admin-auth/login`
   - Admin protected routes use the `isAdmin` middleware to check for admin privileges
   - Admin accounts appear to be created via a seeding process (`seed-admin.ts`)

## Development Workflow

1. Development mode:
   - Run `npm run dev` to start the development server
   - Uses Vite dev server for the frontend

2. Production build:
   - Run `npm run build` to build the app for production
   - Outputs client files to `/dist` and bundles the server

3. Database:
   - `db:push` script to update database schema
   - `db:seed` script to seed the database with initial data
   - `seed-admin` script to create an admin account