import Borrower from "../models/Borrower.js";
import Loan from "../models/Loan.js";

export const createBorrower = async (req, res) => {
  try {
    const lenderId = req.lender._id;
    const { nic, ...rest } = req.body;

    if (!nic || !lenderId) {
      return res
        .status(400)
        .json({ message: "NIC and lenderId are required." });
    }

    // Check if borrower already exists
    const existingBorrower = await Borrower.findOne({ nic });

    if (existingBorrower) {
      // Check if lenderId already exists in lenderIds
      if (!existingBorrower.lenderIds.includes(lenderId)) {
        existingBorrower.lenderIds.push(lenderId);
        await existingBorrower.save();
      }
      return res.status(200).json(existingBorrower);
    }

    // Create new borrower if not exists
    const newBorrower = new Borrower({
      nic,
      lenderIds: [lenderId],
      ...rest,
    });

    const savedBorrower = await newBorrower.save();
    res.status(201).json(savedBorrower);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllBorrowers = async (req, res) => {
  try {
    const lenderId = req.lender._id;
    const borrowers = await Borrower.find({ lenderIds: lenderId })
      .populate("activeLoans")
      .lean();

    const formattedBorrowers = await Promise.all(
      borrowers.map(async (borrower) => {
        // Fetch total loans from Loan collection using NIC
        const totalLoansCount = await Loan.countDocuments({
          nic: borrower.nic,
        });

        const lastPayment = borrower.repaymentHistory?.length
          ? new Date(
              Math.max(
                ...borrower.repaymentHistory.map((p) =>
                  new Date(p.date).getTime()
                )
              )
            )
              .toISOString()
              .split("T")[0]
          : "N/A";

        const latestLoan = await Loan.findOne({
          nic: borrower.nic,
          lenderId: lenderId,
        })
          .sort({ createdAt: -1 }) // Get the most recent loan
          .select("status")
          .lean();

        const status = latestLoan?.status || "completed";

        return {
          id: borrower.nic,
          name: borrower.name,
          email: borrower.email,
          phone: borrower.phone,
          totalLoans: totalLoansCount,
          activeLoans: borrower.activeLoans?.length || 0,
          lastPayment,
          status,
        };
      })
    );

    res.status(200).json(formattedBorrowers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get borrower by ID
export const getBorrowerById = async (req, res) => {
  try {
    const borrower = await Borrower.findById(req.params.id).populate(
      "activeLoans"
    );
    if (!borrower)
      return res.status(404).json({ message: "Borrower not found" });
    res.status(200).json(borrower);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get borrower by NIC
export const getBorrowerByNIC = async (req, res) => {
  try {
    const borrower = await Borrower.findOne({ nic: req.params.nic }).populate(
      "activeLoans"
    );
    if (!borrower)
      return res.status(404).json({ message: "Borrower not found" });
    res.status(200).json(borrower);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update borrower
export const updateBorrower = async (req, res) => {
  try {
    const updated = await Borrower.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated)
      return res.status(404).json({ message: "Borrower not found" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Remove lenderId from borrower's lenderIds using NIC
export const deleteBorrower = async (req, res) => {
  try {
    const lenderId = req.lender._id;

    const updated = await Borrower.findOneAndUpdate(
      { nic: req.params.id }, // Use NIC instead of _id
      { $pull: { lenderIds: lenderId } },
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ message: "Borrower not found" });

    res
      .status(200)
      .json({ message: "Lender removed from borrower successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add repayment record
export const addRepayment = async (req, res) => {
  try {
    const { loanId, amount, date } = req.body;
    const borrower = await Borrower.findById(req.params.id);
    if (!borrower)
      return res.status(404).json({ message: "Borrower not found" });

    borrower.repaymentHistory.push({ loanId, amount, date });
    await borrower.save();
    res.status(200).json(borrower);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
