import { connectToDatabase, closeConnection } from './db/connection';
import { User } from './models/User';
import { BlogPost } from './models/BlogPost';
import { Service } from './models/Service';
import { Category } from './models/Category';
import { Subcategory } from './models/Subcategory';
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import { servicesData } from '../client/src/data/services-data';

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function seedDatabase() {
  console.log('Connecting to database...');
  await connectToDatabase();
  
  try {
    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await BlogPost.deleteMany({});
    await Service.deleteMany({});
    await Category.deleteMany({});
    await Subcategory.deleteMany({});
    
    // Create admin user
    console.log('Creating admin user...');
    const hashedPassword = await hashPassword('admin123');
    const adminUser = new User({
      username: 'admin',
      password: hashedPassword,
      email: 'admin@example.com',
      firstName: 'Admin',
      lastName: 'User',
    });
    await adminUser.save();
    
    // Create blog posts
    console.log('Creating blog posts...');
    const blogPosts = [
      {
        title: "Understanding Life Insurance Claims",
        content: "Life insurance claims can be complex...",
        imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40",
      },
      {
        title: "Health Insurance Policies Explained",
        content: "Navigate the complexities of health insurance...",
        imageUrl: "https://images.unsplash.com/photo-1558898268-92ae44e7670e",
      }
    ];
    
    await BlogPost.insertMany(blogPosts);
    
    // Create categories
    console.log('Creating categories...');
    const categories = [
      { name: "Legal Services" },
      { name: "Financial Services" },
      { name: "Business Services" }
    ];
    
    const createdCategories = await Category.insertMany(categories);
    
    // Create subcategories
    console.log('Creating subcategories...');
    const subcategories = [
      { 
        name: "Corporate Law", 
        categoryId: createdCategories[0]._id,
        serviceIds: []
      },
      { 
        name: "Tax Planning", 
        categoryId: createdCategories[1]._id,
        serviceIds: []
      },
      { 
        name: "Business Registration", 
        categoryId: createdCategories[2]._id,
        serviceIds: []
      }
    ];
    
    await Subcategory.insertMany(subcategories);
    
    // Create services
    console.log('Creating services...');
    for (const service of servicesData) {
      await Service.create(service);
    }
    
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await closeConnection();
  }
}

// Run the seed function
seedDatabase();