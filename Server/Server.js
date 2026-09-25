import express from "express"
import app from "./src/app.js"
// const app = express();



app.listen(3000 , (req,res) => {
    console.log("Server is running on 3000");
})