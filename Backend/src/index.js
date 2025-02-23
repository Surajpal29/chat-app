import express from 'express';
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"

import path from "path"

import authRoutes from "./routes/auth.routes.js"
import messageRoute from "./routes/message.routes.js"
import { connectDb } from './lib/db.js';

import {app,server} from "./lib/socket.js"

dotenv.config();


const port = process.env.PORT 
const __dirname = path.resolve()

app.use(express.json()); // Allows us to parse JSON requests
app.use(cookieParser()); // Allows us to parse cookies from requests
app.use(cors({origin:"http://localhost:5173",credentials:true})); 

app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoute)

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend","dist","index.html"));
    });
}

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    connectDb()
})