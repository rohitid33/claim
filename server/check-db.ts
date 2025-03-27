import { connectToDatabase, closeConnection } from './db/connection';
import { Category } from './models/Category';
import { Subcategory } from './models/Subcategory';
import mongoose from 'mongoose';

async function checkDatabase() {
  console.log('Connecting to database...');
  await connectToDatabase();
  
  try {
    // Get database name
    const dbName = mongoose.connection.db.databaseName;
    console.log(`Connected to database: ${dbName}`);
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections in database:');
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });
    
    // Check if categories collection exists
    const hasCategories = collections.some(c => c.name === 'categories');
    console.log(`Categories collection exists: ${hasCategories}`);
    
    // Check if subcategories collection exists
    const hasSubcategories = collections.some(c => c.name === 'subcategories');
    console.log(`Subcategories collection exists: ${hasSubcategories}`);
    
    // Count categories
    if (hasCategories) {
      const categoryCount = await Category.countDocuments();
      console.log(`Number of categories: ${categoryCount}`);
      
      if (categoryCount > 0) {
        const categories = await Category.find();
        console.log('Categories:');
        categories.forEach(category => {
          console.log(`- ${category.name} (ID: ${category._id})`);
        });
      }
    }
    
    // Count subcategories
    if (hasSubcategories) {
      const subcategoryCount = await Subcategory.countDocuments();
      console.log(`Number of subcategories: ${subcategoryCount}`);
      
      if (subcategoryCount > 0) {
        const subcategories = await Subcategory.find();
        console.log('Subcategories:');
        subcategories.forEach(subcategory => {
          console.log(`- ${subcategory.name} (Category ID: ${subcategory.categoryId})`);
        });
      }
    }
    
    // Check MongoDB connection string
    console.log(`MongoDB URI: ${process.env.MONGODB_URI || 'Using default connection string'}`);
    
  } catch (error) {
    console.error('Error checking database:', error);
  } finally {
    await closeConnection();
  }
}

// Run the check function
checkDatabase();