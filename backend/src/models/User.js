import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    telephone: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const validateSriLankanPhoneNumber = (phoneNumber) => {
  const regex = /^(?:\+94|0)(?:\d{9}|\d{2}-\d{7}|\d{2} \d{7})$/;
  return regex.test(phoneNumber);
};

// Static method for user signup
userSchema.statics.signup = async function (
  username,
  email,
  telephone,
  password
) {
  // Validate all fields
  if (!email || !password || !username || !telephone) {
    throw Error("All fields must be filled");
  }

  // Validate email
  if (!validator.isEmail(email)) {
    throw Error("Email is not valid");
  }

  // Validate telephone
  // if (!validator.isMobilePhone(telephone)) {
  //   throw Error("Telephone number is not valid");
  // }

  // Validate Sri Lankan phone number
  if (!validateSriLankanPhoneNumber(telephone)) {
    throw Error("Telephone number is not valid for Sri Lanka");
  }

  // Validate password strength
  if (
    !validator.isStrongPassword(password, {
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
  ) {
    throw Error(
      "Password must be at least 6 characters long and include a number, uppercase letter, and symbol."
    );
  }

  // Check if email already exists
  const existsEmail = await this.findOne({ email });
  if (existsEmail) {
    throw Error("Email already in use");
  }

  // Check if username already exists
  const existsUsername = await this.findOne({ username });
  if (existsUsername) {
    throw Error("Username already in use");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  // Create user
  const userData = { email, username, password: hash, telephone };
  const user = await this.create(userData);

  return user;
};

// Static method for user login
userSchema.statics.login = async function (email, password) {
  // Validate fields
  if (!email || !password) {
    throw Error("All fields must be filled");
  }

  // Find user by email
  const user = await this.findOne({ email });
  if (!user) {
    throw Error("Incorrect email");
  }

  // Compare passwords
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error("Incorrect password");
  }

  return user;
};

const User = mongoose.model("User", userSchema);

export default User;
