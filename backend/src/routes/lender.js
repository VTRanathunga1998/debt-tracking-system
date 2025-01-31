import express from "express";
import {
  signupLender,
  loginLender,
  getLender,
  deleteLender,
  updateLender,
} from "../controllers/lenderController.js";

const router = express.Router();

// LOGIN route
router.post("/login", loginLender);

// SIGNUP route
router.post("/signup", signupLender);

// GET LENDER
router.get("/getlender/:id", getLender);

// DELETE LENDER
router.delete("/:id", deleteLender);

// UPDATE LENDER
router.put("/:id", updateLender);

export default router;
