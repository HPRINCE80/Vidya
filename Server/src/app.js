dns.setServers(["8.8.8.8", "8.8.4.4"]);
import dns from "dns";
import express from "express";
import cors from "cors";
import "dotenv/config";

// Import routes
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import attendanceRoutes from "./routes/attendance.routes.js";
import feesRoutes from "./routes/fees.routes.js";
import classRoutes from "./routes/class.routes.js";
import resultRoutes from "./routes/result.routes.js";

const app = express();

//middleware
app.use(express.json());

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));

// Routes
app.use("/api/attendance", attendanceRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/fees", feesRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/results", resultRoutes);

connectDB(); //connect to the database



export default app;