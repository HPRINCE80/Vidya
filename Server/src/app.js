dns.setServers(["8.8.8.8", "8.8.4.4"]);
import dns from "dns";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env.js";

// Import routes
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import attendanceRoutes from "./routes/attendance.routes.js";
import feesRoutes from "./routes/fees.routes.js";
import classRoutes from "./routes/class.routes.js";
import resultRoutes from "./routes/result.routes.js";
import userRoutes from "./routes/user.routes.js";
import noticeRoutes from "./routes/notice.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

const app = express();

app.use(helmet());
app.use(express.json({ limit: "100kb" }));

app.use(cors({
	origin: (origin, callback) => {
		if (!origin || env.allowedOrigins.includes(origin)) return callback(null, true);
		return callback(new Error("Origin is not allowed by CORS"));
	},
}));

// Routes
app.use("/api/attendance", attendanceRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/fees", feesRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);



export default app;