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
import LoanList from "./LoanList";
import { Loan } from "@/types/loan";

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
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchLoanData = async () => {
      try {
        const [statsRes, loansRes] = await Promise.all([
          fetch(`${fetchUrl}/loans/loan-details`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          fetch(`${fetchUrl}/loans`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
        ]);

        const [statsData, loansData] = await Promise.all([
          statsRes.json(),
          loansRes.json(),
        ]);

        setLoanStats(statsData);
        setLoans(loansData);
      } catch (error) {
        console.error("Failed to fetch loan data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoanData();
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
          {/* Total Loans */}
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <CurrencyDollarIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-700">Total Loans</p>
                <p className="text-xl font-bold text-gray-900">
                  ${loanStats.totalLoanAmount.toLocaleString()}
                </p>
                <p className="text-xs text-gray-600">
                  {loanStats.totalLoans} loans
                </p>
              </div>
            </div>
          </div>

          {/* Active Loans */}
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <ClockIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-700">Active Loans</p>
                <p className="text-xl font-bold text-gray-900">
                  ${loanStats.activeLoanAmount.toLocaleString()}
                </p>
                <p className="text-xs text-gray-600">
                  (calculated from active loans)
                </p>
              </div>
            </div>
          </div>

          {/* Overdue Loans */}
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <DocumentTextIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-700">Overdue Loans</p>
                <p className="text-xl font-bold text-gray-900">
                  ${loanStats.overdueLoanAmount.toLocaleString()}
                </p>
                <p className="text-xs text-gray-600">
                  (calculated from overdue loans)
                </p>
              </div>
            </div>
          </div>

          {/* Average Interest Rate */}
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <ArrowTrendingUpIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-700">Avg. Interest Rate</p>
                <p className="text-xl font-bold text-gray-900">
                  {loanStats.averageInterestRate}%
                </p>
                <p className="text-xs text-gray-600">Across all loans</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-600">Loading loan stats...</p>
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

      {/* Loan List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading loans...</p>
          </div>
        ) : (
          <LoanList loans={loans} view={activeView} />
        )}
      </div>

      {/* Create Loan Dialog */}
      <CreateLoanForm
        isOpen={isCreateLoanOpen}
        onClose={() => setIsCreateLoanOpen(false)}
      />
    </div>
  );
}
