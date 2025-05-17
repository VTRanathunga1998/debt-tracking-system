import { useState } from "react";
import { Loan } from "@/types/loan";
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  UserCircleIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

interface LoanListProps {
  loans: Loan[]; // Make sure Loan type matches your schema
  view: string;
}

export default function LoanList({ loans, view }: LoanListProps) {
  const [selectedLoan, setSelectedLoan] = useState<string | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <ArrowPathIcon className="h-5 w-5 text-green-500" />;
      case "completed":
        return <CheckCircleIcon className="h-5 w-5 text-blue-500" />;
      case "overdue":
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-medium";
    switch (status) {
      case "active":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "completed":
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case "overdue":
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: Date | string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredLoans = loans.filter((loan) => {
    if (view === "all") return true;
    return loan.status === view;
  });

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Borrower NIC
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Loan Details
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Payment Info
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredLoans.map((loan) => (
            <tr
              key={loan._id.toString()}
              className={`hover:bg-gray-50 ${
                selectedLoan === loan._id.toString() ? "bg-indigo-50" : ""
              }`}
              onClick={() => setSelectedLoan(loan._id.toString())}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <UserCircleIcon className="h-10 w-10 text-gray-400" />
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {loan.nic}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {formatCurrency(loan.amount)}
                </div>
                <div className="text-sm text-gray-500">
                  {loan.interestRate}% / {loan.numOfInstallments} months
                </div>
                <div className="text-sm text-gray-500">
                  {loan.repaymentType === "installment"
                    ? "Installment payments"
                    : "Interest-only payments"}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {/* Assuming totalPaid comes from props or you calculate it somewhere */}
                <div className="text-sm text-gray-900">
                  Paid: {/* formatCurrency(loan.totalPaid) or "-" */}
                  -
                </div>
                <div className="text-sm text-gray-500">
                  Remaining: {formatCurrency(loan.dueAmount)}
                </div>
                <div className="text-sm text-gray-500">
                  Next: {loan.nextInstallmentDate ? formatDate(loan.nextInstallmentDate) : "-"}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(loan.status)}
                  <span className={getStatusBadge(loan.status)}>
                    {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex space-x-2">
                  <button className="text-indigo-600 hover:text-indigo-900">
                    <EyeIcon className="h-5 w-5" />
                  </button>
                  <button className="text-green-600 hover:text-green-900">
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredLoans.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No loans found for the selected filter.</p>
        </div>
      )}
    </div>
  );
}

