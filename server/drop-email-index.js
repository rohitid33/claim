import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://claimsutra:y2tmBpzEZHe8DVOl@claimsutra.vtcut.mongodb.net/test?retryWrites=true&w=majority&appName=claimsutra';

const dropEmailIndex = async () => {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get the adminlogin collection
    const adminCollection = mongoose.connection.collection('adminlogin');

    // List all indexes
    console.log('Current indexes:');
    const indexes = await adminCollection.indexes();
    console.log(indexes);

    // Drop the email index if it exists
    const emailIndex = indexes.find(index => index.key.email !== undefined);
    if (emailIndex) {
      console.log('Found email index, dropping it...');
      await adminCollection.dropIndex('email_1');
      console.log('Email index dropped successfully');
    } else {
      console.log('No email index found');
    }

    // List indexes after dropping
    console.log('\nRemaining indexes:');
    const remainingIndexes = await adminCollection.indexes();
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