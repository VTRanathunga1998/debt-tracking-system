import express from "express";
import {
  signupLender,
  loginLender,
  getLender,
  deleteLender,
  updateLender,
  getAccountStatement,
} from "../controllers/lenderController.js";
import requireAuth from "../middleware/requireAuth.js";

const router = express.Router();

// LOGIN route
router.post("/login", loginLender);

// SIGNUP route
router.post("/signup", signupLender);

// GET LENDER
router.get("/getlender/:id", requireAuth, getLender);

// DELETE LENDER
router.delete("/:id", requireAuth, deleteLender);

// UPDATE LENDER
router.put("/:id", requireAuth, updateLender);

//Get Account Statements
router.get("/account-statements/:id", requireAuth, getAccountStatement);

export default router;
