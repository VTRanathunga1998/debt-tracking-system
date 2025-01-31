import mongoose from "mongoose";

const borrowerSchema = new mongoose.Schema(
  {
    nic: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    creditScore: { type: Number, default: 600 },
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
