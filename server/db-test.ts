/**
 * Database test utility for MongoDB
 * This is the consolidated version of all the database testing scripts
 */

import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';
import { env, validateEnv } from './config/env';

// Validate environment variables before testing
validateEnv();

/**
 * Test MongoDB connection using native driver
 */
export async function testMongoDBNative() {
  let client: MongoClient | null = null;
  
  try {
    console.log('Connecting to MongoDB using native driver...');
    client = new MongoClient(env.database.mongodb.uri);
    
    await client.connect();
    console.log('Connected successfully!');
    
    // List all databases
    const databasesList = await client.db().admin().listDatabases();
    console.log('Databases:');
    databasesList.databases.forEach(db => {
      console.log(`- ${db.name} (${db.sizeOnDisk} bytes)`);
    });
    
    // Get the database name from the connection string
    const dbName = env.database.mongodb.uri.split('/').pop()?.split('?')[0] || 'claimsutra';
    console.log(`\nUsing database: ${dbName}`);
    
    // Connect to the database
    const db = client.db(dbName);
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('Collections:');
    collections.forEach(collection => {
      console.log(`- ${collection.name} (${collection.type})`);
    });
    
    return { success: true, message: 'MongoDB native connection test successful' };
  } catch (error) {
    console.error('Error in native MongoDB test:', error);
    return { success: false, message: `MongoDB native connection test failed: ${error.message}` };
  } finally {
    if (client) {
      console.log('Closing MongoDB connection...');
      await client.close();
    }
  }
}

/**
 * Test MongoDB connection using Mongoose
 */
export async function testMongooseConnection() {
  try {
    console.log('Connecting to MongoDB using Mongoose...');
    await mongoose.connect(env.database.mongodb.uri);
    
    console.log('Connected to MongoDB via Mongoose!');
    console.log('Database name:', mongoose.connection.db.databaseName);
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    return { success: true, message: 'Mongoose connection test successful' };
  } catch (error) {
    console.error('Error in Mongoose connection test:', error);
    return { success: false, message: `Mongoose connection test failed: ${error.message}` };
  } finally {
    if (mongoose.connection.readyState !== 0) {
      console.log('Closing Mongoose connection...');
      await mongoose.connection.close();
    }
  }
}

/**
 * Test category creation using Mongoose
 */
export async function testCategoryCreation() {
  // Define a simple Category schema
  const CategorySchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true
    }
  }, {
    timestamps: true
  });

  // Create the Category model only if it doesn't exist
  const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
  
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(env.database.mongodb.uri);
    console.log('Connected to MongoDB!');
    
    // Create a test category
    console.log('Creating a test category...');
    const testCategory = new Category({
      name: `Test Category ${Date.now()}`
    });
    
    // Save the category
    console.log('Saving category...');
    const savedCategory = await testCategory.save();
    console.log('Category saved successfully:', savedCategory.toJSON());
    
    // Find all categories
    console.log('Finding all categories...');
    const allCategories = await Category.find();
    console.log('All categories:', allCategories.map(c => c.toJSON()));
    
    return { success: true, message: 'Category creation test successful' };
  } catch (error) {
    console.error('Error in category creation test:', error);
    return { success: false, message: `Category creation test failed: ${error.message}` };
  } finally {
    if (mongoose.connection.readyState !== 0) {
      console.log('Closing Mongoose connection...');
      await mongoose.connection.close();
    }
  }
}

// If this file is run directly, execute all tests
if (require.main === module) {
  (async () => {
    console.log('=== Running MongoDB Native Driver Test ===');
    await testMongoDBNative();
    
    console.log('\n=== Running Mongoose Connection Test ===');
    await testMongooseConnection();
    
    console.log('\n=== Running Category Creation Test ===');
    await testCategoryCreation();
    
    console.log('\nAll tests completed.');
  })().catch(err => {
    console.error('Error running tests:', err);
    process.exit(1);
  });
}