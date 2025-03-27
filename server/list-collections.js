import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://claimsutra:y2tmBpzEZHe8DVOl@claimsutra.vtcut.mongodb.net/test?retryWrites=true&w=majority&appName=claimsutra';

const listCollections = async () => {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\nCollections:');
    console.log(collections.map(c => c.name));

    // Get indexes for each collection
    for (const collection of collections) {
      const coll = mongoose.connection.db.collection(collection.name);
      const indexes = await coll.indexes();
      console.log(`\nIndexes for ${collection.name}:`);
      console.log(indexes);
    }

    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

listCollections(); 