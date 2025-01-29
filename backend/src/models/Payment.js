import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  nic: { type: String, required: true },
  paidAmount: { type: Number, required: true },
  Date: { type: Date, default: Date.now },
  dueAmount: { type: Number, required: true },
});

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
