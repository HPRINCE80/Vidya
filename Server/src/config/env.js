import dotenv from "dotenv";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const serverDirectory = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
dotenv.config({ path: resolve(serverDirectory, ".env") });

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

export const env = {
  port: Number(process.env.PORT || 3000),
  mongoUri: (process.env.MONGO_URI || process.env.MONGODB_URI || "").trim(),
  jwtSecret: (process.env.JWT_SECRET || "").trim(),
  teacherRegistrationCode: (process.env.TEACHER_REGISTRATION_CODE || "").trim(),
  adminRegistrationCode: (process.env.ADMIN_REGISTRATION_CODE || "").trim(),
  allowedOrigins,
  nodeEnv: process.env.NODE_ENV || "development",
};

export const assertRequiredEnv = () => {
  const missing = [];
  if (!env.mongoUri) missing.push("MONGO_URI");
  if (!env.jwtSecret) missing.push("JWT_SECRET");

  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
};
