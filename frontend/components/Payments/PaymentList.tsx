import { useState } from "react";
import { Payment } from "@/types/payment";
import { UserCircleIcon, CalendarIcon } from "@heroicons/react/24/outline";

interface PaymentListProps {
  payments: Payment[];
}

export default function PaymentList({ payments }: PaymentListProps) {
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  const formatDate = (dateString: Date | string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
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
              Loan ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Paid Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Payment Date
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {payments.map((payment) => (
            <tr
              key={payment._id.toString()}
              className={`hover:bg-gray-50 ${
                selectedPayment === payment._id.toString() ? "bg-indigo-50" : ""
              }`}
              onClick={() => setSelectedPayment(payment._id.toString())}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <UserCircleIcon className="h-10 w-10 text-gray-400" />
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {payment.nic}
                    </div>
                  </div>
                </div>
              </td>

              {/* ✅ Added Loan ID cell */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{payment.loanId}</div>
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {formatCurrency(payment.paidAmount)}
                </div>
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                  <span>{formatDate(payment.date)}</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {payments.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No payments found.</p>
        </div>
      )}
    </div>
  );
}
