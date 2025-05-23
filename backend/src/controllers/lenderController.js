import Lender from "../models/Lender.js";
import jwt from "jsonwebtoken";
import validator from "validator";
import mongoose from "mongoose";
import Loan from "../models/Loan.js";

// CREATE TOKEN
const createToken = (_id, nic, email, name) => {
  return jwt.sign({ _id, nic, email, name }, process.env.SECRET_KEY, {
    expiresIn: "3d",
  });
};

// LOGIN lender
const loginLender = async (req, res) => {
  const { email, password } = req.body;
  try {
    const lender = await Lender.login(email, password);

    // Create token
    const token = createToken(
      lender._id,
      lender.nic,
      lender.email,
      lender.name
    );

    // Include lender details in the response
    res.status(200).json({
      email,
      token,
      lender: {
        name: lender.name,
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// SIGNUP lender
const signupLender = async (req, res) => {
  const { nic, email, name, telephone, address, password, account } = req.body;

  try {
    // Create a new lender
    const lender = await Lender.signup(
      nic,
      email,
      name,
      telephone,
      address,
      password,
      account
    );

    // Create a token
    const token = createToken(lender._id, lender.nic);

    res.status(200).json({ email, nic, token, id: lender._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.error(error);
  }
};

const validateSriLankanPhoneNumber = (phoneNumber) => {
  const regex = /^(?:\+94|0)(?:\d{9}|\d{2}-\d{7}|\d{2} \d{7})$/;
  return regex.test(phoneNumber);
};

const updateLender = async (req, res) => {
  const lenderId = req.lender._id;
  const { name, email, telephone, address } = req.body;

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(lenderId)) {
    return res.status(400).json({ error: "Invalid lender ID" });
  }

  // Require at least one field
  if (!name && !email && !telephone && !address) {
    return res.status(400).json({
      error: "At least one field must be provided to update",
    });
  }

  // Validate email
  if (email && !validator.isEmail(email)) {
    return res.status(400).json({ error: "Email is not valid" });
  }

  // Validate telephone
  if (telephone && !validateSriLankanPhoneNumber(telephone)) {
    return res
      .status(400)
      .json({ error: "Telephone number is not valid for Sri Lanka" });
  }

  try {
    const lender = await Lender.findById(lenderId);
    if (!lender) {
      return res.status(404).json({ error: "Lender not found" });
    }

    // Update only provided fields
    if (name) lender.name = name;
    if (email) lender.email = email;
    if (telephone) lender.telephone = telephone;
    if (address) lender.address = address;

    await lender.save();

    res.status(200).json({ message: "Lender updated successfully", lender });
  } catch (error) {
    console.error("Error updating lender:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET /api/lenders/getlender
const getLender = async (req, res) => {
  try {
    const lender = await Lender.findById(req.lender._id);

    if (!lender) {
      return res.status(404).json({ error: "Lender not found" });
    }

    const lenderData = {
      nic: lender.nic,
      name: lender.name,
      email: lender.email,
      telephone: lender.telephone,
      address: lender.address,
    };

    res.status(200).json(lenderData);
  } catch (error) {
    console.error("Error fetching lender:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// DELETE LENDER
const deleteLender = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid lender ID" });
  }

  try {
    const lender = await Lender.findByIdAndDelete(id);

    if (!lender) {
      return res.status(404).json({ error: "Lender not found" });
    }

    res.status(200).json({ message: "Lender deleted successfully", lender });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const depositFunds = async (req, res) => {
  try {
    const lenderId = req.lender._id;

    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid deposit amount" });
    }

    const lender = await Lender.findById(lenderId);
    if (!lender) return res.status(404).json({ error: "Lender not found" });

    lender.account.balance += amount;
    lender.transactions.push({
      type: "deposit",
      amount: amount,
    });

    await lender.save();
    res.status(200).json(lender);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
};

const withdrawFunds = async (req, res) => {
  try {
    const { lenderId, amount } = req.body;

    const lender = await Lender.findById(lenderId);
    if (!lender) return res.status(404).json({ error: "Lender not found" });

    if (lender.account.balance < amount) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    lender.account.balance -= amount;
    lender.account.totalWithdrawn += amount;
    lender.transactions.push({
      type: "withdrawal",
      amount: -amount,
    });

    await lender.save();
    res.status(200).json(lender);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAccountStatement = async (req, res) => {
  try {
    const lender = await Lender.findById(req.lender._id);

    if (!lender) {
      return res.status(404).json({ error: "Lender not found" });
    }

    // Count active borrowers (loans with status "active")
    const activeBorrowers = await Loan.countDocuments({
      lenderId: lender._id,
      status: { $in: ["active", "overdue"] },
    });

    const overdueBorrowers = await Loan.countDocuments({
      lenderId: lender._id,
      status: "overdue",
    });

    // Get the latest 3 transactions
    // const recentTransactions = lender.transactions
    //   .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date (newest first)
    //   .slice(0, 3); // Take the first 3

    const recentTransactions = lender.transactions.slice(-3);

    res.status(200).json({
      balance: lender.account.balance,
      totalLent: lender.account.totalLent,
      interestEarned: lender.account.interestEarned,
      activeBorrowers, // Include active borrowers count
      overdueBorrowers,
      recentTransactions, // Add recent transactions to the response
    });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
};

export {
  signupLender,
  loginLender,
  getLender,
  deleteLender,
  updateLender,
  getAccountStatement,
  depositFunds,
  withdrawFunds,
};
