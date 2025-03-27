import { connectToDatabase, closeConnection } from './db/connection';
import mongoose from 'mongoose';

async function checkModels() {
  console.log('Connecting to database...');
  await connectToDatabase();
  
  try {
    // Get all registered models
    const modelNames = mongoose.modelNames();
    console.log('Registered Mongoose models:');
    modelNames.forEach(name => {
      const model = mongoose.model(name);
      const collectionName = model.collection.name;
      console.log(`- Model: ${name}, Collection: ${collectionName}`);
    });
    
    // Check Category model specifically
    if (modelNames.includes('Category')) {
      const CategoryModel = mongoose.model('Category');
      console.log('\nCategory model details:');
      console.log(`Collection name: ${CategoryModel.collection.name}`);
      console.log('Schema paths:');
      Object.keys(CategoryModel.schema.paths).forEach(path => {
        console.log(`- ${path}: ${CategoryModel.schema.paths[path].instance}`);
      });
    } else {
      console.log('\nCategory model is not registered!');
    }
    
    // Check database connection
    console.log('\nDatabase connection:');
    console.log(`Database name: ${mongoose.connection.db.databaseName}`);
    console.log(`Connection state: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Not connected'}`);
    
  } catch (error) {
    console.error('Error checking models:', error);
  } finally {
    await closeConnection();
  }
}

// Run the check function
checkModels();