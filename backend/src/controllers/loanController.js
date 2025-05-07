import moment from "moment";
import Loan from "../models/Loan.js";
import Lender from "../models/Lender.js";

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

    // Check for existing active loan (within transaction)
    const existingLoan = await Loan.findOne({ nic, status: "active" }).session(
      session
    );
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
