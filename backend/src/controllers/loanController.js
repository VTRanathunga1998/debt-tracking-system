import moment from "moment";
import Loan from "../models/Loan.js";
import Lender from "../models/Lender.js";
import Borrower from "../models/Borrower.js";
import Payment from "../models/Payment.js";

import mongoose from "mongoose";

export const createLoan = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const {
      nic,
      amount,
      interestRate,
      startDate,
      numOfInstallments,
      repaymentType,
    } = req.body;

    const lenderId = req.lender._id;

    // Validate required fields
    if (!nic || !amount || !interestRate || !startDate || !repaymentType) {
      throw new Error("All fields are required");
    }

    // Check if borrower exists
    const borrower = await Borrower.findOne({ nic }).session(session);
    if (!borrower) {
      throw new Error("Borrower with the provided NIC does not exist");
    }

    // Parse startDate into a moment object
    const parsedStartDate = moment(startDate, "YYYY-MM-DD");

    // Validate that startDate is within one month before today and not in the future
    const today = moment().startOf("day"); // Start of today
    const oneMonthAgo = moment().subtract(1, "month").startOf("day"); // One month ago

    if (!parsedStartDate.isValid()) {
      throw new Error("Invalid start date format");
    }

    if (parsedStartDate.isBefore(oneMonthAgo)) {
      throw new Error("Start date cannot be older than one month from today");
    }

    if (parsedStartDate.isAfter(today)) {
      throw new Error("Start date cannot be in the future");
    }

    // Check for existing active loan (within transaction)
    const existingLoan = await Loan.findOne({
      nic,
      status: "active",
      lenderId: lenderId,
    }).session(session);

    if (existingLoan) {
      throw new Error("An active loan already exists for this NIC");
    }

    // Atomically update lender's balance and totalLent
    const updatedLender = await Lender.findOneAndUpdate(
      {
        _id: lenderId,
        "account.balance": { $gte: amount },
      },
      {
        $inc: {
          "account.balance": -amount,
          "account.totalLent": amount,
        },
      },
      { new: true, session }
    );

    if (!updatedLender) {
      throw new Error("Insufficient funds or lender not found");
    }

    // Calculate loan terms
    let totalAmount, installmentAmount, totalInterest, dueDate;

    if (repaymentType === "installment") {
      if (!numOfInstallments || numOfInstallments <= 0) {
        throw new Error("Number of installments required");
      }

      totalInterest = (amount * interestRate * numOfInstallments) / 100;
      totalAmount = amount + totalInterest;
      installmentAmount = Math.round(totalAmount / numOfInstallments);
      dueDate = moment(startDate).add(numOfInstallments, "months").toDate();
    } else if (repaymentType === "interest-only") {
      totalAmount = amount;
      totalInterest = 0;
      installmentAmount = Math.round((amount * interestRate) / 100);
      dueDate = null;
    } else {
      throw new Error("Invalid repayment type");
    }

    // Create and save loan within transaction
    const loan = new Loan({
      nic,
      amount,
      interestRate,
      startDate,
      numOfInstallments:
        repaymentType === "installment" ? numOfInstallments : 0,
      dueDate,
      totalAmount,
      installmentAmount,
      dueAmount: totalAmount,
      repaymentType,
      lenderId,
    });

    await loan.save({ session });

    // Add loan to borrower's activeLoans array
    await Borrower.findOneAndUpdate(
      { nic },
      { $push: { activeLoans: loan._id } },
      { session }
    );

    // Add transaction for loan issuance
    const transaction = {
      type: "loan",
      referenceId: loan._id,
      amount: -amount, // Negative because funds are leaving the lender's account
      date: new Date(),
      description: `Loan issued to NIC ${nic}`,
    };

    updatedLender.transactions.push(transaction); // Add transaction to lender's transactions array

    await updatedLender.save({ session }); // Save updated lender with the transaction

    await session.commitTransaction();
    res.status(201).json(loan);
  } catch (error) {
    await session.abortTransaction();
    console.error(error.message);
    res.status(400).json({ error: error.message });
  } finally {
    session.endSession();
  }
};

// Get all loans
export const getLoans = async (req, res) => {
  try {
    const loans = await Loan.find();
    res.status(200).json(loans);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Update loan status
export const updateLoanStatus = async (req, res) => {
  try {
    const loan = await Loan.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.status(200).json(loan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getLoanSummaryForLender = async (req, res) => {
  try {
    const lenderId = req.lender._id;

    // Get all loans associated with this lender
    const loans = await Loan.find({ lenderId });

    if (loans.length === 0) {
      return res.status(200).json({
        totalLoanAmount: 0,
        activeLoanAmount: 0,
        overdueLoanAmount: 0,
        averageInterestRate: 0,
        totalLoans: 0,
      });
    }

    // Initialize totals
    let totalLoanAmount = 0;
    let activeLoanAmount = 0;
    let overdueLoanAmount = 0;
    let totalInterestRate = 0;

    // Aggregate values
    loans.forEach((loan) => {
      totalLoanAmount += loan.amount;
      totalInterestRate += loan.interestRate;

      if (loan.status === "active") {
        activeLoanAmount += loan.amount;
      } else if (loan.status === "overdue") {
        overdueLoanAmount += loan.amount;
      }
    });

    const averageInterestRate = totalInterestRate / loans.length;

    return res.status(200).json({
      totalLoanAmount,
      activeLoanAmount,
      overdueLoanAmount,
      averageInterestRate: parseFloat(averageInterestRate.toFixed(2)),
      totalLoans: loans.length,
    });
  } catch (error) {
    console.error("Error fetching loan summary:", error);
    res.status(500).json({ error: "Failed to fetch loan summary" });
  }
};

export const getMonthlyLoanOverview = async (req, res) => {
  try {
    const result = await Loan.aggregate([
      {
        $lookup: {
          from: "payments",
          localField: "_id",
          foreignField: "loanId",
          as: "payments",
        },
      },
      {
        $addFields: {
          totalPaid: { $sum: "$payments.paidAmount" },
          month: {
            $dateToString: {
              format: "%B %Y", // Or "%Y-%m" for more structured sorting
              date: { $ifNull: ["$createdAt", "$$NOW"] },
            },
          },
        },
      },
      {
        $group: {
          _id: "$month",
          totalLoans: { $sum: "$amount" },
          activeLoans: {
            $sum: {
              $cond: [{ $lt: ["$totalPaid", "$amount"] }, "$amount", 0],
            },
          },
          repaidLoans: {
            $sum: {
              $cond: [{ $gte: ["$totalPaid", "$amount"] }, "$amount", 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id",
          totalLoans: 1,
          activeLoans: 1,
          repaidLoans: 1,
        },
      },
      {
        $sort: { month: 1 },
      },
    ]);

    res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching monthly loan overview:", err);
    res.status(500).json({ message: "Server error" });
  }
};
