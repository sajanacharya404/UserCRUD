import express from "express";
import {
  deleteUser,
  editUser,
  loginUser,
  registerUser,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/users/:id", editUser);
router.delete("/users/:id", deleteUser);

export default router;
