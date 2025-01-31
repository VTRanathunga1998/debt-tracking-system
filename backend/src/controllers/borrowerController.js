import Borrower from "../models/Borrower";

export const getBorrowerReport = async (req, res) => {
  try {
    const borrower = await Borrower.findOne({ nic: req.params.nic }).populate(
      "activeLoans"
    );

    res.status(200).json({
      creditScore: borrower.creditScore,
      activeLoans: borrower.activeLoans,
      repaymentHistory: borrower.repaymentHistory,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
