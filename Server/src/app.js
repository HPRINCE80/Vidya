import express from "express"
import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]); 
import connectDB from "./config/db.js";
const app = express();
import "dotenv/config";
import authRoutes from "./routes/authRoutes.js";
// ...


app.use("/api/auth", authRoutes);



connectDB();
app.get("/", (req,res) => {
    res.send("Radhe Radhe")
})


export default app;