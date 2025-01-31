import Loan from "../models/Loan.js";
import Lender from "../models/Lender.js";
import Payment from "../models/Payment.js";
import moment from "moment";

// Helper function to validate required fields
const validateRequiredFields = (nic, payAmount, date) => {
  if (!nic || !payAmount || !date) {
    throw new Error("All fields are required");
  }
};

// Helper function to find an active loan for the given NIC
const findActiveLoan = async (nic) => {
  const loan = await Loan.findOne({ nic, status: "active" });
  if (!loan) {
    throw new Error("No active loan found for this NIC");
  }
  return loan;
};

// Helper function to validate payment date
const validatePaymentDate = (
  paymentDate,
  lastPaymentDate,
  nextInstallmentDate
) => {
  if (paymentDate.isBefore(lastPaymentDate, "month")) {
    throw new Error(
      `Payment date cannot be before the last payment date: ${lastPaymentDate.format(
        "YYYY-MM-DD"
      )}`
    );
  }

  if (paymentDate.isBefore(moment(nextInstallmentDate), "day")) {
    throw new Error(
      `Payment date cannot be before the next installment date: ${moment(
        nextInstallmentDate
      ).format("YYYY-MM-DD")}`
    );
  }

  if (paymentDate.isAfter(moment(), "day")) {
    throw new Error("Payment date cannot be in the future");
  }
};

// Helper function to validate payment amount
const validatePaymentAmount = (
  payAmount,
  amount,
  requiredPayment,
  repaymentType,
  installmentAmount,
  dueAmount,
  monthsGap
) => {
  if (payAmount < requiredPayment) {
    throw new Error(
      `You need to pay at least ${requiredPayment} as ${monthsGap} installments are due.`
    );
  }

  if (
    payAmount > requiredPayment &&
    payAmount - amount !== installmentAmount * monthsGap
  ) {
    throw new Error(
      `You need to pay only ${requiredPayment} as ${monthsGap} installments are due.`
    );
  }

  if (repaymentType === "installment" && payAmount % installmentAmount !== 0) {
    throw new Error("Amount should be a multiple of installment amount");
  }

  if (repaymentType !== "installment" && payAmount % installmentAmount !== 0) {
    throw new Error("Amount should be a multiple of installment amount");
  }

  if (repaymentType === "installment" && payAmount > dueAmount) {
    throw new Error("Payment exceeds the remaining loan amount");
  }
};

// Helper function to check for duplicate payments
const checkDuplicatePayment = async (loanId, paymentDate) => {
  const existingPayment = await Payment.findOne({
    loanId,
    date: {
      $gte: paymentDate.toDate(),
      $lt: moment(paymentDate).endOf("month").toDate(),
    },
  });

  if (existingPayment) {
    throw new Error("A payment for this month has already been made");
  }
};

// Helper function to update loan details after payment
const updateLoanDetails = async (
  loan,
  payAmount,
  coveredInstallments,
  monthsGap,
  repaymentType
) => {
  let remainingAmount;
  let updatedNumOfInstallments;
  let updatedStatus;

  if (repaymentType === "installment") {
    remainingAmount = Math.max(0, loan.dueAmount - payAmount);
    updatedNumOfInstallments = loan.numOfInstallments - coveredInstallments;
    updatedStatus = remainingAmount > 0 ? "active" : "paid";
  } else {
    remainingAmount = loan.amount;
    updatedNumOfInstallments = loan.numOfInstallments;

    if (payAmount - loan.amount == loan.installmentAmount * monthsGap) {
      updatedStatus = "paid";
    } else {
      updatedStatus = "active";
    }
  }

  let nextInstallmentDate = loan.nextInstallmentDate;
  if (updatedStatus === "active") {
    nextInstallmentDate = new Date(
      new Date(nextInstallmentDate).setMonth(
        new Date(nextInstallmentDate).getMonth() + monthsGap
      )
    );
  } else {
    nextInstallmentDate = null;
  }

  await Loan.findByIdAndUpdate(loan._id, {
    dueAmount: remainingAmount,
    status: updatedStatus,
    numOfInstallments: updatedNumOfInstallments,
    nextInstallmentDate: nextInstallmentDate,
  });

  // Update lender's account
  const lender = await Lender.findById(loan.lenderId);
  if (lender) {
    lender.account.balance += payAmount;

    let interestEarned;

    if (repaymentType === "installment") {
      interestEarned = loan.amount * loan.interestRate;
    } else {
      interestEarned = payAmount;
    }

    if (interestEarned > 0) {
      lender.account.interestEarned += interestEarned;
    }

    await lender.save();
  }

  return { remainingAmount, updatedStatus };
};

// Main function to handle payment
export const makePayment = async (req, res) => {
  try {
    const { nic, payAmount, date } = req.body;

    // Validate required fields
    validateRequiredFields(nic, payAmount, date);

    // Parse the date in the correct format
    const paymentDate = moment(date, "YYYY-M-D").startOf("month");

    // Find an active loan for the given NIC
    const existingLoan = await findActiveLoan(nic);

    const { installmentAmount, dueAmount, repaymentType, amount } =
      existingLoan;

    // Find the last payment or use the loan start date
    const lastPayment = await Payment.findOne({
      loanId: existingLoan._id,
    }).sort({ date: -1 });

    const lastPaymentDate = lastPayment
      ? moment(lastPayment.date)
      : moment(existingLoan.startDate);

    // Validate payment date
    validatePaymentDate(
      paymentDate,
      lastPaymentDate,
      existingLoan.nextInstallmentDate
    );

    // Calculate the number of months since the last payment
    const monthsGap = paymentDate.diff(lastPaymentDate, "months") + 1;

    // Calculate the required payment to cover overdue installments
    const requiredPayment =
      existingLoan.installmentAmount * Math.ceil(monthsGap);

    // Validate payment amount
    validatePaymentAmount(
      payAmount,
      amount,
      requiredPayment,
      repaymentType,
      installmentAmount,
      dueAmount,
      monthsGap
    );

    // Check for duplicate payments
    await checkDuplicatePayment(existingLoan._id, paymentDate);

    // Calculate the number of installments covered by this payment
    const coveredInstallments =
      repaymentType === "installment" ? amount / installmentAmount : 1;

    // Update loan details
    const { remainingAmount, updatedStatus } = await updateLoanDetails(
      existingLoan,
      payAmount,
      coveredInstallments,
      monthsGap,
      repaymentType
    );

    // Save payment
    const payment = new Payment({
      loanId: existingLoan._id,
      nic,
      paidAmount: amount,
      date,
      dueAmount: remainingAmount,
    });

    await payment.save();

    res.status(201).json({
      message: "Payment successful",
      payment,
      remainingAmount,
      loanStatus: updatedStatus,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
