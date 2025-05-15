import { useEffect, useState } from "react";
import {
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import CreatePaymentForm from "./CreatePaymentForm";

type PaymentStats = {
  totalPayments: number;
  totalCount: number;
  thisMonth: number;
  pending: number;
  overdue: number;
};

export default function PaymentsContent() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [paymentStats, setPaymentStats] = useState<PaymentStats | null>(null);
  const [isCreatePaymentOpen, setIsCreatePaymentOpen] = useState(false);

  const fetchUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchPaymentStats = async () => {
      try {
        const res = await fetch(`${fetchUrl}/payments`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        setPaymentStats(data);
      } catch (error) {
        console.error("Failed to fetch payment stats:", error);
      }
    };

    fetchPaymentStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header with Create Payment Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Manage Payments</h2>
        <button
          onClick={() => setIsCreatePaymentOpen(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Record Payment
        </button>
      </div>

      {/* Payment Stats */}
      {paymentStats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <CurrencyDollarIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Payments</p>
                <p className="text-xl font-bold">
                  ${paymentStats.totalPayments.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">
                  {paymentStats.totalCount} payments
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
                <p className="text-sm text-gray-500">This Month</p>
                <p className="text-xl font-bold">
                  ${paymentStats.thisMonth.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">
                  Payments made this month
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <ArrowPathIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-xl font-bold">{paymentStats.pending}</p>
                <p className="text-xs text-gray-500">Pending payments</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Overdue</p>
                <p className="text-xl font-bold">{paymentStats.overdue}</p>
                <p className="text-xs text-gray-500">Overdue payments</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">Loading payment stats...</p>
      )}

      {/* Payment Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <div className="flex flex-wrap gap-2">
          {["all", "received", "pending", "overdue"].map((filter) => (
            <button
              key={filter}
              className={`px-4 py-2 rounded-lg ${
                activeFilter === filter
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Payment List Placeholder */}
      <div className="bg-white p-6 rounded-xl shadow-sm min-h-[300px] flex items-center justify-center">
        <div className="text-center text-gray-500">
          <CurrencyDollarIcon className="h-12 w-12 mx-auto mb-3 text-gray-400" />
          <p className="text-lg font-medium">Payments Management</p>
          <p className="text-sm">
            Payment details would be displayed here based on the selected
            filter: {activeFilter}
          </p>
        </div>
      </div>

      {/* Create Payment Form */}
      <CreatePaymentForm
        isOpen={isCreatePaymentOpen}
        onClose={() => setIsCreatePaymentOpen(false)}
      />
    </div>
  );
}