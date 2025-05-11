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

const router = express.Router();

// Create a new borrower
router.post("/", createBorrower);

// Get all borrowers
router.get("/", getAllBorrowers);

// Get borrower by MongoDB ID
router.get("/id/:id", getBorrowerById);

// Get borrower by NIC
router.get("/nic/:nic", getBorrowerByNIC);

// Update borrower
router.put("/:id", updateBorrower);

// Delete borrower
router.delete("/:id", deleteBorrower);

// Add repayment history to a borrower
router.post("/:id/repayment", addRepayment);

export default router;
