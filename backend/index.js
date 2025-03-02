import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import messageRoute from "./routes/message.route.js";
import { app, server } from "./socket/socket.js";
import path from "path";
 
dotenv.config();

app.get('https://socialmedia-app-n6xo.onrender.com/api/v1/search', async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ message: "Search query is required" });
    }

    try {
        // Search users by matching either the username or full name
        const users = await database.collection("user").find({
            $or: [
                { username: { $regex: query, $options: 'i' } }, // Case-insensitive regex for username
                { fullName: { $regex: query, $options: 'i' } }  // Case-insensitive regex for full name
            ]
        }).toArray();  // Convert the cursor to an array

        if (users.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }

        // Return the found users (excluding sensitive info like passwords)
        const result = users.map(user => ({
            id: user._id,
            username: user.username,
            fullName: user.fullName,
            bio: user.bio,
            gender: user.gender,
            dateOfBirth: user.dateOfBirth,
            profile_pic: user.profile_pic,
            accountPrivacy: user.accountPrivacy
        }));
        console.log(result);

        res.json({ users: result });
    } catch (error) {
        res.status(500).json({ message: "Error searching for users", error });
    }
});

const PORT = process.env.PORT || 3000;

const __dirname = path.resolve();

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
const corsOptions = {
    origin: process.env.URL,
    credentials: true
}
app.use(cors(corsOptions));

// yha pr apni api ayengi
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);
app.use("/api/v1/search");


app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get("*", (req,res)=>{
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
})


server.listen(PORT, () => {
    connectDB();
    console.log(`Server listen at port ${PORT}`);
});