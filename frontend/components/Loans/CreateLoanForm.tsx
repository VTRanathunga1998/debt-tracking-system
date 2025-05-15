import { useState, useEffect } from "react";
import { XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/context/AuthContext";

interface Borrower {
  id: string;
  name: string;
  email: string;
}

interface CreateLoanFormProps {
  isOpen: boolean;
  onClose: () => void;
  borrowerId?: string;
  borrowerName?: string;
}

export default function CreateLoanForm({
  isOpen,
  onClose,
  borrowerId: initialBorrowerId,
  borrowerName: initialBorrowerName,
}: CreateLoanFormProps) {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [borrowers, setBorrowers] = useState<Borrower[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBorrower, setSelectedBorrower] = useState<Borrower | null>(
    initialBorrowerId && initialBorrowerName 
      ? { id: initialBorrowerId, name: initialBorrowerName, email: "" }
      : null
  );
  
  const [loanData, setLoanData] = useState({
    amount: "",
    interestRate: "",
    term: "",
    paymentFrequency: "monthly",
    startDate: "",
    purpose: "",
  });

  useEffect(() => {
    const fetchBorrowers = async () => {
      if (!token || !searchQuery.trim()) {
        setBorrowers([]);
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/borrowers/search?q=${searchQuery}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch borrowers");

        const data = await response.json();
        setBorrowers(data);
      } catch (err) {
        console.error("Error fetching borrowers:", err);
        setBorrowers([]);
      }
    };

    const debounceTimer = setTimeout(fetchBorrowers, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, token]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBorrower) {
      setError("Please select a borrower");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/loans/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          borrowerId: selectedBorrower.id,
          ...loanData,
          amount: parseFloat(loanData.amount),
          interestRate: parseFloat(loanData.interestRate),
          term: parseInt(loanData.term),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create loan");
      }

      onClose();
    } catch (err) {
      setError("Failed to create loan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLoanData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black opacity-30"></div>
        
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Create New Loan
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Borrower Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Select Borrower
              </label>
              {selectedBorrower ? (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-500">{selectedBorrower.name}</p>
                    {selectedBorrower.email && (
                      <p className="text-sm text-gray-500">{selectedBorrower.email}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedBorrower(null)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search borrowers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 text-gray-500 placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  {borrowers.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-48 overflow-auto">
                      {borrowers.map((borrower) => (
                        <button
                          key={borrower.id}
                          type="button"
                          onClick={() => {
                            setSelectedBorrower(borrower);
                            setSearchQuery("");
                          }}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-50"
                        >
                          <p className="font-medium">{borrower.name}</p>
                          <p className="text-sm text-gray-500">{borrower.email}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                  Loan Amount ($)
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={loanData.amount}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 text-gray-500 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700 mb-1">
                  Interest Rate (%)
                </label>
                <input
                  type="number"
                  id="interestRate"
                  name="interestRate"
                  value={loanData.interestRate}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 text-gray-500 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  min="0"
                  max="100"
                  step="0.01"
                />
              </div>

              <div>
                <label htmlFor="term" className="block text-sm font-medium text-gray-700 mb-1">
                  Loan Term (months)
                </label>
                <input
                  type="number"
                  id="term"
                  name="term"
                  value={loanData.term}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 text-gray-500 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  min="1"
                />
              </div>

              <div>
                <label htmlFor="paymentFrequency" className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Frequency
                </label>
                <select
                  id="paymentFrequency"
                  name="paymentFrequency"
                  value={loanData.paymentFrequency}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 text-gray-500 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                </select>
              </div>

              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={loanData.startDate}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 text-gray-500 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-1">
                Loan Purpose
              </label>
              <textarea
                id="purpose"
                name="purpose"
                value={loanData.purpose}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating..." : "Create Loan"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}