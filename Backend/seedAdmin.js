// backend/seedAdmin.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

const createAdminUsers = async () => {
  const password = await bcrypt.hash("admin123", 10);

  const users = [
    {
      username: "superadmin",
      email: "superadmin@vhg.com",
      password,
      role: "super-admin",
    }
  ];

  await User.insertMany(users);
  console.log("Super-admin created.");
  mongoose.disconnect();
};

createAdminUsers();
