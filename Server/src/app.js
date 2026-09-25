import express from "express"
import connectDB from "./config/db.js";
import "dotenv/config";

const app = express();



connectDB();
app.get("/", (req,res) => {
    res.send("Radhe Radhe")
})


export default app;