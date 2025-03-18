import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";

import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();
const port = process.env.PORT || 5000;
connectDB();
const allowedOrigins = ['https://easyjudge.onrender.com']

app.use(express.json());
app.use(cookieParser());

app.use(cors({origin: allowedOrigins , credentials: true}));

app.get("/", (req, res) => {
  res.send("Hello World1!");
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port} in ${process.env.NODE_ENV || 'development'} mode`);
});
