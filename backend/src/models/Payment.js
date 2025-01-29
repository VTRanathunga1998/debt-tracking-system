import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  loanId: { type: mongoose.Schema.Types.ObjectId, ref: "Loan", required: true },
  nic: { type: String, required: true },
  paidAmount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  dueAmount: { type: Number, required: true },
});

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
