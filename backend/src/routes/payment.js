import express from "express";
import {
  makePayment,
  getPaymentSummary,
} from "../controllers/paymentController.js";
import requireAuth from "../middleware/requireAuth.js";

const router = express.Router();

// POST /api/payment - Make a new payment
router.post("/make", requireAuth, makePayment);

// GET /api/payment - Fetch all payments
router.get("/", requireAuth, getPaymentSummary);

export default router;
