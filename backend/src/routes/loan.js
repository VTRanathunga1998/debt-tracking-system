import express from "express";
import {
  createLoan,
  getLoans,
  updateLoanStatus,
} from "../controllers/loanController.js";
import requireAuth from "../middleware/requireAuth.js";

const router = express.Router();

// POST /api/loans - Create a new loan
router.post("/", requireAuth, createLoan);

// GET /api/loans - Fetch all loans
router.get("/", requireAuth, getLoans);

// PATCH /api/loans/:id - Update loan status
router.patch("/:id", requireAuth, updateLoanStatus);

export default router;
