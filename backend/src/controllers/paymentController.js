import Loan from "../models/Loan"; // Adjust the path as per your project structure
import Payment from "../models/Payment"; // Adjust the path as per your project structure

// Make a payment
export const makePayment = async (req, res) => {
  try {
    const { nic, amount, date } = req.body;

    // Validate required fields
    if (!nic || !amount || !date) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Find an active loan for the given NIC
    const existingLoan = await Loan.findOne({ nic, status: "active" });
    if (!existingLoan) {
      return res.status(400).json({ error: "No active loan found for this NIC" });
    }

    // Check if the payment exceeds the due amount
    const { totalAmount, installmentAmount, numOfInstallments } = existingLoan;
    const payments = await Payment.find({ loanId: existingLoan._id });

    const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const remainingAmount = totalAmount - totalPaid;

    if (amount > remainingAmount) {
      return res.status(400).json({ error: "Payment exceeds the remaining loan amount" });
    }

    // Update loan status if fully paid
    let updatedStatus = "active";
    if (remainingAmount - amount <= 0) {
      updatedStatus = "paid";
    }

    // Save the payment in the database
    const payment = new Payment({
      loanId: existingLoan._id,
      nic,
      amount,
      date,
      remainingAmount: remainingAmount - amount,
    });
    await payment.save();

    // Update the loan status
    await Loan.findByIdAndUpdate(existingLoan._id, { status: updatedStatus });

    res.status(201).json({
      message: "Payment successful",
      payment,
      remainingAmount: remainingAmount - amount,
      loanStatus: updatedStatus,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
