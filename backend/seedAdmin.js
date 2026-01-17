import "dotenv/config";
import mongoose from "mongoose";
import User from "./models/userModel.js";

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB for seeding...");

    const adminExists = await User.findOne({ role: "admin" });

    const existingAdmin = await User.findOne({
      email: "siletiloita@gmail.com",
    });

    if (existingAdmin) {
      console.log("Admin user already exists:", existingAdmin.email);
      // Update their password just in case user wants to reset it via seed
      existingAdmin.name = "Loita Sileti";
      existingAdmin.phone = "0884211360";
      existingAdmin.password = "494949";
      existingAdmin.role = "admin";
      await existingAdmin.save();
      console.log("Admin account updated.");
      process.exit();
    }

    const admin = new User({
      name: "Loita Sileti",
      email: "siletiloita@gmail.com",
      phone: "0884211360",
      password: "494949",
      role: "admin",
    });

    await admin.save();
    console.log("Admin user seeded successfully!");
    console.log("Email: siletiloita@gmail.com");

    process.exit();
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();
