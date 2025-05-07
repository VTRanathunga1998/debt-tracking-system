import Lender from "../models/Lender.js";
import jwt from "jsonwebtoken";
import validator from "validator";
import mongoose from "mongoose";

// CREATE TOKEN
const createToken = (_id, nic) => {
  return jwt.sign({ _id, nic }, process.env.SECRET_KEY, {
    expiresIn: "3d",
  });
};

// LOGIN lender
const loginLender = async (req, res) => {
  const { email, password } = req.body;

  try {
    const lender = await Lender.login(email, password);

    // Create token
    const token = createToken(lender._id, lender.nic);

    res.status(200).json({
      email,
      token,
      lenderid: lender._id,
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

// UPDATE LENDER
const updateLender = async (req, res) => {
  const { id } = req.params;
  const { username, email, telephone, password } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid lender ID" });
  }

  if (!username && !email && !telephone && !password) {
    return res
      .status(400)
      .json({ error: "At least one field must be provided to update" });
  }

  if (email && !validator.isEmail(email)) {
    return res.status(400).json({ error: "Email is not valid" });
  }

  if (telephone && !validateSriLankanPhoneNumber(telephone)) {
    return res
      .status(400)
      .json({ error: "Telephone number is not valid for Sri Lanka" });
  }

  try {
    const lender = await Lender.findById(id);

    if (!lender) {
      return res.status(404).json({ error: "Lender not found" });
    }

    if (username) lender.username = username;
    if (email) lender.email = email;
    if (telephone) lender.telephone = telephone;
    if (password) lender.password = password;

    await lender.save();

    res.status(200).json({ message: "Lender updated successfully", lender });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET LENDER
const getLender = async (req, res) => {
  const { id } = req.params;

  try {
    const lender = await Lender.findById(id);
    if (!lender) {
      return res.status(404).json({ error: "Lender not found" });
    }

    const lenderData = {
      lenderid: lender._id,
      username: lender.username,
    };

    res.status(200).json(lenderData);
  } catch (error) {
    console.error(error);
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
    const { lenderId, amount } = req.body;

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
    const lender = await Lender.findById(req.params.id)
      .populate({
        path: "transactions.referenceId",
        strictPopulate: false, // Add this if using dynamic references
      })
      .exec();

    res.status(200).json({
      balance: lender.account.balance,
      totalLent: lender.account.totalLent,
      interestEarned: lender.account.interestEarned,
      transactions: lender.transactions,
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
