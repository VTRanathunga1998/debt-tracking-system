import express from "express";
import {
  signupUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getUser,
  deleteUser,
  updateUser,
} from "../controllers/userController.js";

const router = express.Router();

// LOGIN route
router.post("/login", loginUser);

// SIGNUP route
router.post("/signup", signupUser);

// FORGOT PASSWORD
router.post("/forgot-password", forgotPassword);

// RESET PASSWORD
router.post("/reset-password", resetPassword);

// GET USER
router.get("/getuser/:id", getUser);

// DELETE USER
router.delete("/:id", deleteUser);

// UPDATE USER
router.put("/:id", updateUser);

export default router;
