import mongoose from "mongoose";

const borrowerSchema = new mongoose.Schema(
  {
    nic: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    activeLoans: [{ type: mongoose.Schema.Types.ObjectId, ref: "Loan" }],
    repaymentHistory: [
      {
        loanId: { type: mongoose.Schema.Types.ObjectId, ref: "Loan" },
        amount: Number,
        date: Date,
      },
    ],
    lenderIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lender" }],
  },
  { timestamps: true }
);

const Borrower = mongoose.model("Borrower", borrowerSchema);

export default Borrower;
