import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../src/models/User";
import * as dotenv from "dotenv";
import path from "path";

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not defined in .env.local");
  process.exit(1);
}

async function seedAdmin() {
  try {
    await mongoose.connect(MONGODB_URI as string);
    console.log("Connected to MongoDB...");

    const adminEmail = "admin@calvarycogindia.com";
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log("Admin user already exists. Skipping seed.");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("calvarycogindia@2026", 12);

    const adminUser = new User({
      name: "Super Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
    });

    await adminUser.save();
    console.log("Initial admin user created successfully!");
    console.log(`Email: ${adminEmail}`);
    console.log("Role: admin");

  } catch (error) {
    console.error("Error seeding admin user:", error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

seedAdmin();
