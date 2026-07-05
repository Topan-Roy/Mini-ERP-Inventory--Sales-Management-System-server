import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './src/modules/auth/auth.model';

dotenv.config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('Connected to DB...');

    // Clear existing users
    await User.deleteMany({});

    // Create users
    await User.create([
      {
        name: 'Admin User',
        email: 'admin@minierp.com',
        password: 'password123',
        role: 'Admin'
      },
      {
        name: 'Manager User',
        email: 'manager@minierp.com',
        password: 'password123',
        role: 'Manager'
      },
      {
        name: 'Employee User',
        email: 'employee@minierp.com',
        password: 'password123',
        role: 'Employee'
      }
    ]);

    console.log('Users seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedUsers();
