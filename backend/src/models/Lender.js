import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

const lenderSchema = new mongoose.Schema(
  {
    nic: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    telephone: { type: String, required: true },
    address: { type: String, required: true },
    password: { type: String, required: true },
    account: {
      balance: { type: Number, default: 0 },
      totalLent: { type: Number, default: 0 },
      interestEarned: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

const validateSriLankanPhoneNumber = (phoneNumber) => {
  const regex = /^(?:\+94|0)(?:\d{9}|\d{2}-\d{7}|\d{2} \d{7})$/;
  return regex.test(phoneNumber);
};

// Static method for lender signup
lenderSchema.statics.signup = async function (
  nic,
  email,
  name,
  telephone,
  address,
  password,
  account
) {
  // Validate all fields
  if (!nic || !email || !name || !password || !telephone || !address) {
    throw Error("All fields must be filled");
  }

  // Validate email
  if (!validator.isEmail(email)) {
    throw Error("Email is not valid");
  }

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
  const existsUser = await this.findOne({ nic });
  if (existsUser) {
    throw Error("User already in use");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  // Create lender
  const lenderData = {
    nic,
    email,
    name,
    telephone,
    address,
    password: hash,
    ...(account && { account }),
  };

  const lender = await this.create(lenderData);

  return lender;
};

// Static method for lender login
lenderSchema.statics.login = async function (email, password) {
  // Validate fields
  if (!email || !password) {
    throw Error("All fields must be filled");
  }

  // Find lender by email
  const lender = await this.findOne({ email });
  if (!lender) {
    throw Error("Incorrect email");
  }

  // Compare passwords
  const match = await bcrypt.compare(password, lender.password);
  if (!match) {
    throw Error("Incorrect password");
  }

  return lender;
};

const Lender = mongoose.model("Lender", lenderSchema);

export default Lender;
