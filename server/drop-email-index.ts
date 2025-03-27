import mongoose from 'mongoose';
import { env } from './config/env';

const dropEmailIndex = async () => {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(env.database.mongodb.uri);
    console.log('Connected to MongoDB');

    // Get the users collection
    const usersCollection = mongoose.connection.collection('users');

    // List all indexes
    console.log('Current indexes:');
    const indexes = await usersCollection.indexes();
    console.log(indexes);

    // Drop the email index if it exists
    const emailIndex = indexes.find(index => index.key.email !== undefined);
    if (emailIndex) {
      console.log('Found email index, dropping it...');
      await usersCollection.dropIndex('email_1');
      console.log('Email index dropped successfully');
    } else {
      console.log('No email index found');
    }

    // List indexes after dropping
    console.log('\nRemaining indexes:');
    const remainingIndexes = await usersCollection.indexes();
    console.log(remainingIndexes);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

dropEmailIndex(); 