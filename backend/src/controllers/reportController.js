import Loan from "../models/Loan.js";
import Payment from "../models/Payment.js";

export const getMainAccountSummary = async (req, res) => {
  try {
    const loans = await Loan.find();
    const payments = await Payment.find();

    const totalLent = loans.reduce(
      (sum, loan) => sum + loan.principalAmount,
      0
    );
    const totalRepaid = payments.reduce(
      (sum, payment) => sum + payment.paidAmount,
      0
    );
    const totalInterestEarned = payments.reduce(
      (sum, payment) => sum + (payment.paidAmount - payment.principalRemaining),
      0
    );
    const totalOutstanding = loans
      .filter((loan) => loan.status === "active")
      .reduce((sum, loan) => sum + loan.dueAmount, 0);
    const totalOverdue = loans
      .filter((loan) => loan.status === "overdue")
      .reduce((sum, loan) => sum + loan.dueAmount, 0);

    res.status(200).json({
      totalLent,
      totalRepaid,
      totalInterestEarned,
      totalOutstanding,
      totalOverdue,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getLoanPortfolioOverview = async (req, res) => {
  try {
    const loans = await Loan.find();

    const activeLoans = loans.filter((loan) => loan.status === "active").length;
    const paidLoans = loans.filter((loan) => loan.status === "paid").length;
    const overdueLoans = loans.filter(
      (loan) => loan.status === "overdue"
    ).length;
    const totalPrincipalLent = loans.reduce(
      (sum, loan) => sum + loan.principalAmount,
      0
    );
    const totalInterestEarned = loans.reduce(
      (sum, loan) => sum + (loan.totalAmount - loan.principalAmount),
      0
    );

    res.status(200).json({
      activeLoans,
      paidLoans,
      overdueLoans,
      totalPrincipalLent,
      totalInterestEarned,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getLoanPerformanceReport = async (req, res) => {
  try {
    const loans = await Loan.find().lean();

    const loanPerformance = loans.map((loan) => ({
      loanId: loan._id,
      borrowerNic: loan.nic,
      principal: loan.principalAmount,
      interestRate: loan.interestRate,
      repaymentType: loan.repaymentType,
      totalRepaid: loan.totalAmount - loan.dueAmount,
      remainingBalance: loan.dueAmount,
      nextPaymentDate: loan.nextInstallmentDate,
      status: loan.status,
    }));

    res.status(200).json(loanPerformance);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getInterestEarningsReport = async (req, res) => {
  try {
    const payments = await Payment.find();

    const monthlyInterest = payments.reduce((acc, payment) => {
      const month = moment(payment.date).format("YYYY-MM");
      acc[month] =
        (acc[month] || 0) + (payment.paidAmount - payment.principalRemaining);
      return acc;
    }, {});

    const cumulativeInterest = Object.entries(monthlyInterest).reduce(
      (acc, [month, interest]) => {
        acc[month] = (acc[month - 1] || 0) + interest;
        return acc;
      },
      {}
    );

    res.status(200).json({ monthlyInterest, cumulativeInterest });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getOverdueLoansReport = async (req, res) => {
  try {
    const overdueLoans = await Loan.find({ status: "overdue" }).lean();

    const overdueReport = overdueLoans.map((loan) => ({
      loanId: loan._id,
      borrowerNic: loan.nic,
      overdueAmount: loan.dueAmount,
      daysOverdue: moment().diff(moment(loan.nextInstallmentDate), "days"),
      lastPaymentDate: loan.nextInstallmentDate,
    }));

    res.status(200).json(overdueReport);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getBorrowerRepaymentHistory = async (req, res) => {
  try {
    const { nic } = req.params;

    const loans = await Loan.find({ nic });
    const payments = await Payment.find({ nic });

    const repaymentHistory = payments.map((payment) => ({
      paymentId: payment._id,
      loanId: payment.loanId,
      paidAmount: payment.paidAmount,
      paymentDate: payment.date,
      principalRemaining: payment.principalRemaining,
      interestRemaining: payment.interestRemaining,
    }));

    res.status(200).json({ loans, repaymentHistory });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
