import express from "express";
import connectDB from "./config/db.js";

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();
app.use(express.json());

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
