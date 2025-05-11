import express from "express";
import {
  createBorrower,
  getAllBorrowers,
  getBorrowerById,
  getBorrowerByNIC,
  updateBorrower,
  deleteBorrower,
  addRepayment,
} from "../controllers/borrowerController.js";
import requireAuth from "../middleware/requireAuth.js";

const router = express.Router();

// Create a new borrower
router.post("/", requireAuth, createBorrower);

// Get all borrowers
router.get("/", requireAuth, getAllBorrowers);

// Get borrower by MongoDB ID
router.get("/id/:id", requireAuth, getBorrowerById);

// Get borrower by NIC
router.get("/nic/:nic", requireAuth, getBorrowerByNIC);

// Update borrower
router.put("/:id", requireAuth, updateBorrower);

// Delete borrower
router.delete("/:id", requireAuth, deleteBorrower);

// Add repayment history to a borrower
router.post("/:id/repayment", addRepayment);

export default router;
