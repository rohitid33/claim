# Environment Variables Documentation

This document describes all environment variables used in the ClaimSutra application.

## Database Configuration

### `MONGODB_URI`

- **Description**: MongoDB connection string
- **Required**: Yes (in production)
- **Default**: `mongodb://localhost:27017/claimsutra` (in development)
- **Example**: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`

### `DATABASE_URL`

- **Description**: PostgreSQL connection string (only used if PostgreSQL storage is enabled)
- **Required**: No (only if using PostgreSQL)
- **Default**: `postgres://postgres:postgres@localhost:5432/claimsutra`
- **Example**: `postgres://username:password@host:port/database`

## Server Configuration

### `PORT`

- **Description**: The port on which the server will listen
- **Required**: No
- **Default**: `3000`
- **Example**: `8080`

### `NODE_ENV`

- **Description**: The environment in which the application is running
- **Required**: No
- **Default**: `development`
- **Valid Values**: `development`, `production`, `test`
- **Notes**: This affects various behaviors like error verbosity, SSL requirements, etc.

### `HOST`

- **Description**: The hostname on which the server will listen
- **Required**: No
- **Default**: `localhost`
- **Example**: `0.0.0.0` (to listen on all interfaces)

## Authentication

### `SESSION_SECRET`

- **Description**: Secret used to sign session cookies
- **Required**: Yes (in production)
- **Default**: `dev-session-secret-replace-in-production` (in development)
- **Notes**: Should be a long, random string in production

### `JWT_SECRET`

- **Description**: Secret used to sign JWT tokens (if JWT authentication is used)
- **Required**: No (only if using JWT)
- **Default**: `dev-jwt-secret-replace-in-production` (in development)
- **Notes**: Should be a long, random string in production

## Setting Up Environment Variables

### Development

1. Copy `.env.example` to `.env.development`
2. Fill in appropriate values for your development environment
3. The application will automatically load `.env.development` when `NODE_ENV` is set to `development`

### Production

1. Set environment variables according to your hosting platform:
   - Heroku: Use the dashboard or `heroku config:set`
   - AWS: Use Parameter Store or Secrets Manager
   - Docker: Use environment variables in your Docker Compose file or Kubernetes secrets
   - Azure: Use Application Settings

2. Generate secure random values for secrets:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

### Testing

1. Copy `.env.example` to `.env.test`
2. Configure test-specific values (like test database URLs)
3. The application will automatically load `.env.test` when `NODE_ENV` is set to `test`

## Security Notes

- Never commit `.env` files to version control
- Use different secrets for different environments
- Rotate secrets periodically
- Use environment-specific database instances to prevent test data from affecting production