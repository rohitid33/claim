import mongoose from 'mongoose';
import AdminUser from './models/AdminUser';
import dotenv from 'dotenv';
import { connectToMongoDB } from './db/mongodb-connection';

dotenv.config();

const seedAdmin = async () => {
  try {
    // Connect to MongoDB using the same connection mechanism as the main app
    console.log('Connecting to MongoDB...');
    await connectToMongoDB();
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await AdminUser.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists with username:', existingAdmin.username);
      console.log('Admin email:', existingAdmin.email);
      
      // Create a new admin with a different username
      console.log('Creating a new admin user with username: admin2');
      const admin2 = new AdminUser({
        username: 'admin2',
        email: 'admin2@example.com',
        password: 'adminPassword123', // This will be hashed by the pre-save hook
        role: 'admin',
        isAdmin: true
      });

      await admin2.save();
      console.log('Second admin user created successfully with username: admin2');
      console.log('Please use these credentials to log in:');
      console.log('Username: admin2');
      console.log('Password: adminPassword123');
      
      await mongoose.disconnect();
      return;
    }

    // Create admin user
    const admin = new AdminUser({
      username: 'admin',
      email: 'admin@example.com',
      password: 'adminPassword123', // This will be hashed by the pre-save hook
      role: 'admin',
      isAdmin: true
    });

    await admin.save();
    console.log('Admin user created successfully with username: admin');
    console.log('Please use these credentials to log in:');
    console.log('Username: admin');
    console.log('Password: adminPassword123');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exit(1);
  }
};

seedAdmin();