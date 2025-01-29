import mongoose from "mongoose";

const loanSchema = new mongoose.Schema({
  nic: { type: String, required: true },
  amount: { type: Number, required: true },
  interestRate: { type: Number, default: 0 },
  startDate: { type: Date, default: Date.now },
  numOfInstallments: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  totalInterest: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  installmentAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["active", "paid", "overdue"],
    default: "active",
  },
});

const Loan = mongoose.model("Loan", loanSchema);

export default Loan;
