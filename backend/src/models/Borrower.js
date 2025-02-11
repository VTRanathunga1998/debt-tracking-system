import mongoose from "mongoose";

const borrowerSchema = new mongoose.Schema(
  {
    nic: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    creditScore: { type: Number, default: 600 },
    employmentStatus: {
      type: String,
      enum: ["Employed", "Unemployed", "Self-Employed"],
      required: true,
    },
    monthlyIncome: { type: Number, required: true },
    activeLoans: [{ type: mongoose.Schema.Types.ObjectId, ref: "Loan" }],
    repaymentHistory: [
      {
        loanId: mongoose.Schema.Types.ObjectId,
        amount: Number,
        date: Date,
      },
    ],
  },
  { timestamps: true }
);

const Borrower = mongoose.model("Borrower", borrowerSchema);

export default Borrower;
