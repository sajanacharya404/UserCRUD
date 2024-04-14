import express from "express";
import {
  editUser,
  loginUser,
  registerUser,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/users/:id", editUser);

export default router;
