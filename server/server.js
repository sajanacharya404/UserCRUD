import express from "express";
import connectDB from "./config/db.js";
import userRouter from "./routes/user.route.js";

const app = express();
const PORT = process.env.PORT || 3000;

//database
connectDB();

//middleware
app.use(express.json());

//routes
app.use("/api", userRouter);

//server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
