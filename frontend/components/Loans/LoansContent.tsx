"use client";
import { useEffect, useState } from "react";
import {
  CurrencyDollarIcon,
  ClockIcon,
  DocumentTextIcon,
  ArrowTrendingUpIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import CreateLoanForm from "./CreateLoanForm";

type LoanStats = {
  totalLoanAmount: number;
  totalLoans: number;
  activeLoanAmount: number;
  overdueLoanAmount: number;
  averageInterestRate: number;
};

export default function LoansContent() {
  const [activeView, setActiveView] = useState("all");
  const [isCreateLoanOpen, setIsCreateLoanOpen] = useState(false);
  const [loanStats, setLoanStats] = useState<LoanStats | null>(null);

  const fetchUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchLoanStats = async () => {
      try {
        const res = await fetch(`${fetchUrl}/loans/loan-details`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        setLoanStats(data);
      } catch (error) {
        console.error("Failed to fetch loan stats:", error);
      }
    };

    fetchLoanStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header with Create Loan Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Manage Loans</h2>
        <button
          onClick={() => setIsCreateLoanOpen(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Create Loan
        </button>
      </div>

      {/* Loan Stats */}
      {loanStats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <CurrencyDollarIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Loans</p>
                <p className="text-xl font-bold">
                  ${loanStats.totalLoanAmount.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">
                  {loanStats.totalLoans} loans
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <ClockIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Active Loans</p>
                <p className="text-xl font-bold">
                  ${loanStats.activeLoanAmount.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">
                  (calculated from active loans)
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <DocumentTextIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Overdue Loans</p>
                <p className="text-xl font-bold">
                  ${loanStats.overdueLoanAmount.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">
                  (calculated from overdue loans)
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <ArrowTrendingUpIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Avg. Interest Rate</p>
                <p className="text-xl font-bold">
                  {loanStats.averageInterestRate}%
                </p>
                <p className="text-xs text-gray-500">Across all loans</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">Loading loan stats...</p>
      )}

      {/* Loan Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <div className="flex flex-wrap gap-2">
          {["all", "active", "overdue", "completed"].map((filter) => (
            <button
              key={filter}
              className={`px-4 py-2 rounded-lg ${
                activeView === filter
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setActiveView(filter)}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Loan List Placeholder */}
      <div className="bg-white p-6 rounded-xl shadow-sm min-h-[300px] flex items-center justify-center">
        <div className="text-center text-gray-500">
          <DocumentTextIcon className="h-12 w-12 mx-auto mb-3 text-gray-400" />
          <p className="text-lg font-medium">Loan Management</p>
          <p className="text-sm">
            Loan details would be displayed here based on the selected filter:{" "}
            {activeView}
          </p>
        </div>
      </div>

      {/* Create Loan Dialog */}
      <CreateLoanForm
        isOpen={isCreateLoanOpen}
        onClose={() => setIsCreateLoanOpen(false)}
      />
    </div>
  );
}
