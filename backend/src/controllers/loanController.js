import moment from "moment";
import Loan from "../models/Loan.js";

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

    // Validate required fields
    if (!nic || !amount || !interestRate || !startDate || !repaymentType) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if there is an active loan for the same NIC
    const existingLoan = await Loan.findOne({ nic, status: "active" });
    if (existingLoan) {
      return res
        .status(400)
        .json({ error: "An active loan already exists for this NIC" });
    }

    let totalAmount, installmentAmount, totalInterest, dueDate;

    if (repaymentType === "installment") {
      // Ensure numOfInstallments is provided
      if (!numOfInstallments || numOfInstallments <= 0) {
        return res
          .status(400)
          .json({
            error: "Number of installments required for installment loan",
          });
      }

      // Calculate total interest and total amount
      totalInterest = (amount * interestRate * numOfInstallments) / 100;
      totalAmount = amount + totalInterest;

      // Calculate monthly installment
      installmentAmount = totalAmount / numOfInstallments;

      // Set due date based on installments
      dueDate = moment(startDate).add(numOfInstallments, "months").toDate();
    } else if (repaymentType === "interest-only") {
      // Interest-only loan setup
      totalAmount = amount; // Principal remains unchanged
      totalInterest = 0; // No total interest calculation required
      installmentAmount = (amount * interestRate) / 100; // Monthly interest
      dueDate = undefined; // No fixed due date for interest-only loans
    } else {
      return res.status(400).json({ error: "Invalid repayment type" });
    }

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
