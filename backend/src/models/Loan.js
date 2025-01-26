import mongoose from "mongoose";

const loanSchema = new mongoose.Schema({
  borrowerName: { type: String, required: true },
  amount: { type: Number, required: true },
  interestRate: { type: Number, default: 0 },
  startDate: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ["active", "paid", "overdue"],
    default: "active",
  },
});

const Loan = mongoose.model("Loan", loanSchema);

export default Loan;
