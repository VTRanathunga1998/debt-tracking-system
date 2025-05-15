import Loan from "../models/Loan.js";
import Lender from "../models/Lender.js";
import Payment from "../models/Payment.js";
import Borrower from "../models/Borrower.js";
import moment from "moment";

// Helper function to find an active loan for the given NIC
const findActiveLoan = async (nic, lenderId) => {
  const loan = await Loan.findOne({
    nic,
    lenderId,
    status: { $in: ["active", "overdue"] },
  });

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
  monthsGap
) => {
  if (payAmount < requiredPayment) {
    throw new Error(
      `You need to pay at least ${requiredPayment} as ${monthsGap} installments are due.`
    );
  }

  if (
    repaymentType === "installment" &&
    payAmount > requiredPayment &&
    payAmount - amount !== installmentAmount * monthsGap
  ) {
    throw new Error(
      `You need to pay only ${requiredPayment} as ${monthsGap} installments are due.`
    );
  }

  if (
    repaymentType === "interest-only" &&
    payAmount > requiredPayment &&
    payAmount - requiredPayment !== amount
  ) {
    throw new Error(
      `You need to pay only ${requiredPayment} as ${monthsGap} installments are due.`
    );
  }

  if (repaymentType === "installment" && payAmount % installmentAmount !== 0) {
    throw new Error("Amount should be a multiple of installment amount");
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
  let updatedStatus;

  if (repaymentType === "installment") {
    remainingAmount = Math.max(0, loan.dueAmount - payAmount);
    updatedStatus = remainingAmount > 0 ? "active" : "completed";

    if (updatedStatus === "completed") {
      // Remove loan from borrower's activeLoans array
      await Borrower.findOneAndUpdate(
        { nic: loan.nic },
        {
          $pull: {
            activeLoans: loan._id,
            lenderIds: loan.lenderId,
          },
        }
      );
    }
  } else {
    remainingAmount = loan.amount;

    if (payAmount - loan.amount == loan.installmentAmount * monthsGap) {
      updatedStatus = "completed";

      // Remove loan from borrower's activeLoans array
      await Borrower.findOneAndUpdate(
        { nic: loan.nic },
        {
          $pull: {
            activeLoans: loan._id,
            lenderIds: loan.lenderId, // 💡 Remove lenderId as well
          },
        }
      );
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
    const lenderId = req.lender._id;

    const { nic, payAmount, date } = req.body;

    // Validate required fields
    if (!nic || !payAmount || !date) {
      throw new Error("All fields are required");
    }

    // Parse the date in the correct format
    const paymentDate = moment(date, "YYYY-M-D");

    // Find an active loan for the given NIC
    const existingLoan = await findActiveLoan(nic, lenderId);

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
    const monthsGap = paymentDate.diff(lastPaymentDate, "months");

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
      paidAmount: payAmount,
      date,
      dueAmount: remainingAmount,
    });

    await payment.save();

    const borrower = await Borrower.findOne({ nic });

    if (borrower) {
      borrower.repaymentHistory.push({
        loanId: existingLoan._id,
        amount: payAmount,
        date: new Date(date),
      });
      await borrower.save();
    }

    // Update lender's transactions
    const lender = await Lender.findById(existingLoan.lenderId);
    if (lender) {
      lender.transactions.push({
        type: "payment",
        referenceId: payment._id,
        amount: payAmount,
        date: new Date(date),
      });

      await lender.save();
    }

    // Reset the overdue notification flag if applicable
    if (remainingAmount <= 0 || updatedStatus !== "overdue") {
      existingLoan.overdueNotificationSent = false; // Reset the flag
      await existingLoan.save();
    }

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

export const getPaymentSummary = async (req, res) => {
  try {
    const lenderId = req.lender._id;

    // Step 1: Get all loans for this lender
    const loans = await Loan.find({ lenderId }, "_id");
    const loanIds = loans.map((loan) => loan._id);

    // Step 2: Get payments related to those loans
    const payments = await Payment.find({ loanId: { $in: loanIds } });

    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Step 3: Calculate totals
    const totalPayments = payments.reduce((sum, p) => sum + p.paidAmount, 0);
    const thisMonth = payments
      .filter((p) => new Date(p.date) >= firstDayOfMonth)
      .reduce((sum, p) => sum + p.paidAmount, 0);

    // Optional: Pending and Overdue count based on loan status
    const pending = await Loan.countDocuments({ lenderId, status: "active" });
    const overdue = await Loan.countDocuments({ lenderId, status: "overdue" });

    res.status(200).json({
      totalPayments,
      thisMonth,
      pending,
      overdue,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
