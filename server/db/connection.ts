import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { env } from '../config/env';

// Database connection configuration
const pool = new Pool({
  connectionString: env.database.postgres.url,
  ssl: env.isProduction ? { rejectUnauthorized: false } : false,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2000, // How long to wait for a connection to become available
});

// Test the connection
pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
  process.exit(-1);
});

// Connect to the database and test the connection
async function connectToDatabase() {
  try {
    const client = await pool.connect();
    console.log('Successfully connected to PostgreSQL database');
    client.release();
    return db;
  } catch (error) {
    console.error('Error connecting to PostgreSQL database:', error);
    throw error;
  }
}

// Close the database connection
async function closeConnection() {
  try {
    await pool.end();
    console.log('PostgreSQL connection pool closed');
    return true;
  } catch (error) {
    console.error('Error closing PostgreSQL connection pool:', error);
    throw error;
  }
}

// Initialize Drizzle ORM with the PostgreSQL pool
const db = drizzle(pool);

// Test the connection immediately
connectToDatabase()
  .then(() => console.log('Initial database connection test successful'))
  .catch(err => console.error('Initial database connection test failed:', err));

export { connectToDatabase, closeConnection, pool };
export default db;