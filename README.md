# Insurance Services Application with MongoDB

This application has been connected to MongoDB Atlas for data persistence.

## MongoDB Connection Setup

The application is now configured to use MongoDB Atlas as its database. Here's what has been set up:

1. **MongoDB Connection**: The application connects to MongoDB Atlas using the provided connection string.
2. **Models**: MongoDB models have been created for Users, Complaints, Blog Posts, and Services.
3. **Session Store**: Express sessions are now stored in MongoDB instead of memory.
4. **Environment Variables**: Database credentials are stored in environment variables.

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```

2. Set up environment variables:
   - Copy `.env.example` to `.env.development` for development
   - Copy `.env.example` to `.env.production` for production
   - Copy `.env.example` to `.env.test` for testing
   - Update the values in each file according to your environment

   Example `.env.development` file:
   ```
   MONGODB_URI=mongodb://localhost:27017/claimsutra
   SESSION_SECRET=dev-session-secret
   NODE_ENV=development
   PORT=3000
   ```

3. Seed the database with initial data:
   ```
   npm run db:seed
   ```

4. Start the development server:
   ```
   npm run dev
   ```

## Environment Variables

The application uses environment variables for configuration. See [ENV_VARS.md](ENV_VARS.md) for a complete list of environment variables and their descriptions.

Key environment variables include:

- `MONGODB_URI`: MongoDB connection string
- `SESSION_SECRET`: Secret for session cookies
- `NODE_ENV`: Application environment (development, production, test)
- `PORT`: Server port number

## Database Structure

The application uses the following MongoDB collections:

- **Users**: Stores user accounts and authentication information
- **Complaints**: Stores customer complaints
- **BlogPosts**: Stores blog articles
- **Services**: Stores insurance service information
- **Sessions**: Stores user sessions

## MongoDB Storage Implementation

The application now uses a MongoDB-based storage implementation that replaces the previous in-memory storage. This provides:

1. **Data Persistence**: All data is now stored in MongoDB Atlas and persists across server restarts.
2. **Scalability**: MongoDB Atlas can scale as your application grows.
3. **Security**: Data is stored securely in MongoDB Atlas with proper authentication.

## Admin User

During the database seeding process, an admin user is created with the following credentials:

- Username: `admin`
- Password: `admin123`

You can use these credentials to log in to the application.

## Services Data

The services data from your client-side application is now stored in MongoDB. When you add, update, or delete services through the dashboard, these changes will be persisted in the database.

## Troubleshooting

If you encounter any issues with the MongoDB connection:

1. Check that the MongoDB Atlas cluster is running and accessible
2. Verify that the connection string in your environment file is correct
3. Check the server logs for any connection errors
4. Ensure that your IP address is whitelisted in MongoDB Atlas Network Access settings

## Security Notes

- Never commit `.env` files to version control
- Use different secrets for different environments
- Rotate secrets periodically
- Use environment-specific database instances to prevent test data from affecting production