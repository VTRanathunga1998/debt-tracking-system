import { useEffect, useState } from "react";
import {
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import CreatePaymentForm from "./CreatePaymentForm";
import PaymentList from "./PaymentList";

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
  const [payments, setPayments] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const fetchUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchPaymentData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");

        // Fetch payment summary
        const summaryRes = await fetch(`${fetchUrl}/payments`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const summaryData = await summaryRes.json();
        setPaymentStats(summaryData);

        // Fetch all payments
        const paymentRes = await fetch(`${fetchUrl}/payments/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const paymentData = await paymentRes.json();
        setPayments(paymentData);
      } catch (error) {
        console.error("Failed to fetch payments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentData();
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
          {/* Total Payments */}
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <CurrencyDollarIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-700">Total Payments</p>
                <p className="text-xl font-bold text-gray-900">
                  ${paymentStats.totalPayments.toLocaleString()}
                </p>
                <p className="text-xs text-gray-600">
                  {paymentStats.totalCount} payments
                </p>
              </div>
            </div>
          </div>

          {/* This Month */}
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <ClockIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-700">This Month</p>
                <p className="text-xl font-bold text-gray-900">
                  ${paymentStats.thisMonth.toLocaleString()}
                </p>
                <p className="text-xs text-gray-600">
                  Payments made this month
                </p>
              </div>
            </div>
          </div>

          {/* Pending */}
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <ArrowPathIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-700">Pending</p>
                <p className="text-xl font-bold text-gray-900">
                  {paymentStats.pending}
                </p>
                <p className="text-xs text-gray-600">Pending payments</p>
              </div>
            </div>
          </div>

          {/* Overdue */}
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-700">Overdue</p>
                <p className="text-xl font-bold text-gray-900">
                  {paymentStats.overdue}
                </p>
                <p className="text-xs text-gray-600">Overdue payments</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-600">Loading payment stats...</p>
      )}

      {/* Payment Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <div className="flex flex-wrap gap-2">
          {["all"].map((filter) => (
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

      {/* Payment List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading payments...</p>
          </div>
        ) : (
          <PaymentList payments={payments} />
        )}
      </div>

      {/* Create Payment Form */}
      <CreatePaymentForm
        isOpen={isCreatePaymentOpen}
        onClose={() => setIsCreatePaymentOpen(false)}
      />
    </div>
  );
}
