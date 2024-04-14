import express from "express";
import connectDB from "./config/db.js";
import userRouter from "./routes/user.route.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

//database
connectDB();

//middleware
app.use(express.json());
app.use(cors());

//routes
app.use("/api", userRouter);

//server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
