import express from "express";
import {
  deleteUser,
  editUser,
  getUserById,
  getUsers,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/users/:id", editUser);
router.delete("/users/:id", deleteUser);
router.post("/reset-password", resetPassword);
router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.post("/logout", logoutUser);
export default router;
