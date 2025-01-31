import express from "express";
import {
  createLoan,
  getLoans,
  updateLoanStatus,
} from "../controllers/loanController.js";

const router = express.Router();

// POST /api/loans - Create a new loan
router.post("/", createLoan);

// GET /api/loans - Fetch all loans
router.get("/", getLoans);

// PATCH /api/loans/:id - Update loan status
router.patch("/:id", updateLoanStatus);

export default router;
