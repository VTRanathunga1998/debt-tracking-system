import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { CronJob } from "cron";

import lenderRoutes from "./routes/lender.js";
import loanRoutes from "./routes/loan.js";
import paymentRoutes from "./routes/payment.js";
import reportRoutes from "./routes/report.js";
import borrowerRoutes from "./routes/borrower.js";

import Loan from "./models/Loan.js";
import Borrower from "./models/Borrower.js";
import { sendEmail } from "./utils/email.js";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err.message));

// Daily overdue payment checker
const checkOverduePayments = async () => {
  try {
    const now = new Date();
    const loans = await Loan.find({
      status: "active",
      nextInstallmentDate: { $lt: now },
      overdueNotificationSent: false,
    });

    for (const loan of loans) {
      loan.status = "overdue";
      loan.overdueNotificationSent = true;
      await loan.save();

      const borrower = await Borrower.findOne({ nic: loan.nic });
      if (borrower) {
        const subject = "Loan Payment Overdue Notification";
        const message = `Dear ${
          borrower.name
        },\n\nYour loan is overdue.\n\nLoan Details:\n- Amount: $${
          loan.amount
        }\n- Due Date: ${loan.nextInstallmentDate.toDateString()}\n\nPlease make the payment as soon as possible.\n\nRegards,\nDebtTracker`;

        await sendEmail(
          "DebtTracker",
          process.env.MAIL_USER,
          borrower.email, // Email to borrower
          subject,
          message,
          null
        );
      }
    }

    console.log(`Overdue loans updated: ${loans.length}`);
  } catch (error) {
    console.error("Error in daily overdue check:", error.message);
  }
};

// Weekly reminder for overdue loans
const checkOverduePaymentsWeekly = async () => {
  try {
    const loans = await Loan.find({
      status: "overdue",
    });

    console.log(`Weekly overdue loans: ${loans.length}`);

    for (const loan of loans) {
      loan.overdueNotificationSent = true; // optional if you want to mark reminder sent
      await loan.save();

      const borrower = await Borrower.findOne({ nic: loan.nic });
      if (borrower) {
        const subject = "Weekly Loan Payment Reminder";
        const message = `Dear ${
          borrower.name
        },\n\nThis is a reminder that your loan is still overdue.\n\nLoan Details:\n- Amount: $${
          loan.amount
        }\n- Due Date: ${loan.nextInstallmentDate.toDateString()}\n\nPlease make the payment as soon as possible.\n\nRegards,\nDebtTracker`;

        await sendEmail(
          "DebtTracker",
          process.env.MAIL_USER,
          borrower.email,
          subject,
          message,
          null
        );
      }
    }

    console.log(`Weekly borrower reminders sent: ${loans.length}`);
  } catch (error) {
    console.error("Error in weekly overdue check:", error.message);
  }
};

// // Cron Jobs (for testing: every 5 and 10 minutes)
const overduePaymentJob = new CronJob("0 0 * * *", checkOverduePayments);
const weeklyOverdueJob = new CronJob("0 0 * * 1", checkOverduePaymentsWeekly);

// // Every minute
// const overduePaymentJob = new CronJob("*/1 * * * *", checkOverduePayments);

// // Every 3 minutes
// const weeklyOverdueJob = new CronJob("*/3 * * * *", checkOverduePaymentsWeekly);

overduePaymentJob.start();
weeklyOverdueJob.start();

// Routes
app.use("/api/user", lenderRoutes);
app.use("/api/loans", loanRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/borrower", borrowerRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
