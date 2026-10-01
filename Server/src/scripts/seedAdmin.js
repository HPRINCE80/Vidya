import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
import User from "../models/User.js";
import connectDB from "../config/db.js";
import { assertRequiredEnv } from "../config/env.js";

const seedAdmin = async () => {
  assertRequiredEnv();
  await connectDB();

  const name = process.env.ADMIN_NAME;
  const email = process.env.ADMIN_EMAIL?.toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!name || !email || !password || password.length < 6) {
    throw new Error("ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD (6+ characters) are required");
  }

  const existingAdmin = await User.findOne({ email });
  if (existingAdmin) {
    console.log(`Admin already exists for ${email}`);
    return;
  }

  await User.create({ name, email, password, role: "admin", active: true });
  console.log(`Admin created for ${email}`);
};

seedAdmin()
  .catch((error) => {
    console.error(`Unable to seed admin: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    const mongoose = await import("mongoose");
    await mongoose.default.disconnect();
  });