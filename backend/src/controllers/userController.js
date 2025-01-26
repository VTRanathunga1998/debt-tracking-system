import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

const createToken = (_id, username) => {
  return jwt.sign({ _id, username }, process.env.SECRET_KEY, { expiresIn: "3d" });
};

// LOGIN user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    // Create token
    const token = createToken(user._id, user.username);

    res.status(200).json({
      email,
      token,
      userid: user._id,
      user: {
        username: user.username,
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// SIGNUP user
const signupUser = async (req, res) => {
  const { username, email, telephone, password } = req.body;

  try {
    // Create a new user
    const user = await User.signup(username, email, telephone, password);

    // Create a token
    const token = createToken(user._id, user.username);

    res.status(200).json({ email, username, token, id: user._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.error(error);
  }
};

// FORGOT PASSWORD
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Generate a unique token for the reset link
    const resetToken = crypto.randomBytes(64).toString("hex");

    // Find the user by email and update the resetToken and resetTokenExpiry
    const user = await User.findOneAndUpdate(
      { email },
      {
        resetToken,
        resetTokenExpiry: Date.now() + 3600000, // Token expires in 1 hour
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Send a reset password email with a link to your frontend reset password page
    const frontendURL = process.env.FRONTEND_URL;
    const resetLink = `${frontendURL}/resetpassword?token=${encodeURIComponent(
      resetToken
    )}`;
    sendMail(
      "Password Reset",
      email,
      `Click the link to reset your password: ${resetLink}`
    );

    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// RESET PASSWORD
const resetPassword = async (req, res) => {
  const { resetToken, newPassword } = req.body;

  try {
    // Find the user by resetToken and check if the token is not expired
    const user = await User.findOne({
      resetToken,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    // Hash the new password and update the user's password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);

    user.password = hash;
    user.resetToken = null;
    user.resetTokenExpiry = null;

    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET USER
const getUser = async (req, res) => {
  const { id } = req.params;
  console.log(`Request received for user ID: ${id}`);

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userData = {
      userid: user._id,
      username: user.username,
    };

    res.status(200).json(userData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// DELETE USER
const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid user ID" });
  }

  try {
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export {
  signupUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getUser,
  deleteUser,
};
