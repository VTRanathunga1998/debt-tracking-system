import express from "express";
import { makePayment } from "../controllers/paymentController.js";

const router = express.Router();

// POST /api/payment - Make a new payment
router.post("/make", makePayment);

export default router;
