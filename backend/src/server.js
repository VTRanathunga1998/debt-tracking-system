import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import loanRoutes from "./routes/loans.js";
import userRoutes from "./routes/user.js";
import paymentRoutes from "./routes/payment.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/user", userRoutes);
app.use("/api/loans", loanRoutes);
app.use("/api/payments", paymentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
