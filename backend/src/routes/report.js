import express from "express";
import {
  getMainAccountSummary,
  getLoanPortfolioOverview,
  getLoanPerformanceReport,
  getInterestEarningsReport,
  getOverdueLoansReport,
  getBorrowerRepaymentHistory,
} from "../controllers/reportController.js";

const router = express.Router();

// Reporting APIs
router.get("/summary", getMainAccountSummary);
router.get("/portfolio", getLoanPortfolioOverview);
router.get("/performance", getLoanPerformanceReport);
router.get("/interest", getInterestEarningsReport);
router.get("/overdue", getOverdueLoansReport);
router.get("/borrower/:nic", getBorrowerRepaymentHistory);

export default router;
