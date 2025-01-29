import Loan from "../models/Loan.js";
import Payment from "../models/Payment.js";

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
      return res
        .status(400)
        .json({ error: "No active loan found for this NIC" });
    }

    // Check if the payment exceeds the due amount
    const { installmentAmount, numOfInstallments, dueAmount } = existingLoan;

    console.log(dueAmount)

    if (installmentAmount !== amount && installmentAmount < 0) {
      return res
        .status(400)
        .json({ error: "Invalid payment amount or already paid" });
    }

    if (amount > dueAmount) {
      return res
        .status(400)
        .json({ error: "Payment exceeds the remaining loan amount" });
    }

    const remainingAmount = dueAmount - amount;

    // Update loan status if fully paid
    let updatedStatus = "active";
    if (remainingAmount <= 0) {
      updatedStatus = "paid";
    }

    // Save the payment in the database
    const payment = new Payment({
      loanId: existingLoan._id,
      nic,
      paidAmount: amount,
      date,
      dueAmount: remainingAmount - amount,
    });
    await payment.save();

    // Update the loan status
    await Loan.findByIdAndUpdate(
      existingLoan._id,
      { status: updatedStatus },
      { dueAmount: remainingAmount },
      { numOfInstallments: numOfInstallments - 1 }
    );

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
