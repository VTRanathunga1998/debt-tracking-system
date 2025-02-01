import moment from "moment";
import Loan from "../models/Loan.js";
import Lender from "../models/Lender.js";

// Create a new loan
export const createLoan = async (req, res) => {
  try {
    const {
      nic,
      amount,
      interestRate,
      startDate,
      numOfInstallments,
      repaymentType,
    } = req.body;

    // Temporary lender ID (Replace with actual authentication logic)
    // const lenderId = "679cc95aa66cef6fe11e850b";
    const lenderId = req.lender._id;

    // Validate required fields
    if (!nic || !amount || !interestRate || !startDate || !repaymentType) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if an active loan already exists for this NIC
    const existingLoan = await Loan.findOne({ nic, status: "active" });
    if (existingLoan) {
      return res
        .status(400)
        .json({ error: "An active loan already exists for this NIC" });
    }

    // Fetch lender details
    const lender = await Lender.findById(lenderId);
    if (!lender) {
      return res.status(404).json({ error: "Lender not found" });
    }

    // Check if lender has enough balance
    if (lender.account.balance < amount) {
      return res
        .status(400)
        .json({ error: "Insufficient funds in lender's account" });
    }

    let totalAmount, installmentAmount, totalInterest, dueDate;

    if (repaymentType === "installment") {
      if (!numOfInstallments || numOfInstallments <= 0) {
        return res.status(400).json({
          error: "Number of installments required for installment loan",
        });
      }

      totalInterest = (amount * interestRate * numOfInstallments) / 100;
      totalAmount = amount + totalInterest;
      installmentAmount = Math.round(totalAmount / numOfInstallments).toFixed(
        0
      );
      dueDate = moment(startDate).add(numOfInstallments, "months").toDate();
    } else if (repaymentType === "interest-only") {
      totalAmount = amount;
      totalInterest = 0;
      installmentAmount = Math.round((amount * interestRate) / 100).toFixed(0);
      dueDate = undefined;
    } else {
      return res.status(400).json({ error: "Invalid repayment type" });
    }

    // Deduct loan amount from lender's balance
    lender.account.balance -= amount;
    lender.account.totalLent += amount;
    await lender.save(); // Save updated lender balance

    // Create the loan object
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
      dueAmount: totalAmount, // Initially, dueAmount = totalAmount
      repaymentType,
      lenderId,
    });

    // Save the loan in the database
    await loan.save();

    res.status(201).json(loan);
  } catch (error) {
    res.status(400).json({ error: error.message });
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
