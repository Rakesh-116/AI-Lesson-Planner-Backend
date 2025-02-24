import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./database/connect.db.js";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ 
  origin: ["http://localhost:5173", "https://ai-lesson-planner-wine.vercel.app"], 
  credentials: true 
}));


import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

connectDB();

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
