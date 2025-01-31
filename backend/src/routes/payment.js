import express from "express";
import { makePayment } from "../controllers/paymentController.js";
import requireAuth from "../middleware/requireAuth.js";

const router = express.Router();

// POST /api/payment - Make a new payment
router.post("/make", requireAuth, makePayment);

export default router;
