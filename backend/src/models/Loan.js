import mongoose from "mongoose";

const loanSchema = new mongoose.Schema({
  nic: { type: String, required: true },
  amount: { type: Number, required: true }, // Principal loan amount
  interestRate: { type: Number, default: 0 }, // Monthly interest rate %
  startDate: { type: Date, default: Date.now },
  repaymentType: {
    type: String,
    enum: ["interest-only", "installment"],
    required: true,
  },
  numOfInstallments: {
    type: Number,
    default: 0,
    validate: {
      validator: function (value) {
        return this.repaymentType === "installment" ? value > 0 : value === 0;
      },
      message:
        "numOfInstallments must be greater than 0 for installment loans.",
    },
  },
  dueDate: {
    type: Date,
    required: function () {
      return this.repaymentType === "installment";
    },
  },
  totalAmount: { type: Number, required: true },
  installmentAmount: { type: Number, required: true },
  dueAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["active", "paid", "overdue"],
    default: "active",
  },
});

// Pre-save hook to dynamically calculate fields
loanSchema.pre("save", function (next) {
  if (this.repaymentType === "installment") {
    if (!this.numOfInstallments || this.numOfInstallments <= 0) {
      return next(
        new Error(
          "numOfInstallments must be greater than 0 for installment loans."
        )
      );
    }

    // Calculate total amount including interest
    this.totalAmount =
      this.amount +
      (this.amount * this.interestRate * this.numOfInstallments) / 100;

    // Calculate installment amount
    this.installmentAmount = this.totalAmount / this.numOfInstallments;
  } else if (this.repaymentType === "interest-only") {
    this.numOfInstallments = 0; // No installments
    this.totalAmount = this.amount; // Principal remains unchanged
    this.installmentAmount = (this.amount * this.interestRate) / 100; // Monthly interest payment
    this.dueDate = undefined; // No fixed due date
  }

  next();
});

const Loan = mongoose.model("Loan", loanSchema);
export default Loan;
