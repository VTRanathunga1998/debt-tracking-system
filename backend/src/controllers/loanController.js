import moment from "moment";
import Loan from "../models/Loan.js";

// Create a new loan
export const createLoan = async (req, res) => {
  try {
    const { nic, amount, interestRate, startDate, numOfInstallments } =
      req.body;

    // Validate required fields
    if (!nic || !amount || !interestRate || !startDate || !numOfInstallments) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if there is an active loan for the same NIC
    const existingLoan = await Loan.findOne({ nic, status: "active" });
    if (existingLoan) {
      return res
        .status(400)
        .json({ error: "An active loan already exists for this NIC" });
    }

    // Calculate derived fields
    const totalInterest = (amount * interestRate * numOfInstallments) / 100;
    const totalAmount = amount + totalInterest;
    const installmentAmount = totalAmount / numOfInstallments;
    const dueDate = moment(startDate).add(numOfInstallments, "months").toDate();

    // Create the loan object
    const loan = new Loan({
      nic,
      amount,
      interestRate,
      startDate,
      numOfInstallments,
      dueDate,
      totalInterest,
      totalAmount,
      installmentAmount,
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
