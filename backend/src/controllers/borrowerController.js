import Borrower from "../models/Borrower.js"; 


// Create a new borrower
export const createBorrower = async (req, res) => {
  try {
    const newBorrower = new Borrower(req.body);
    const savedBorrower = await newBorrower.save();
    res.status(201).json(savedBorrower);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all borrowers
export const getAllBorrowers = async (req, res) => {
  try {
    const borrowers = await Borrower.find().populate("activeLoans");
    res.status(200).json(borrowers);
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

// Delete borrower
export const deleteBorrower = async (req, res) => {
  try {
    const deleted = await Borrower.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Borrower not found" });
    res.status(200).json({ message: "Borrower deleted successfully" });
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
