"use client";
import { useEffect, useState } from "react";
import {
  CurrencyDollarIcon,
  UsersIcon,
  DocumentTextIcon
} from "@heroicons/react/24/outline";

// Types
import { Transaction } from "../../types/transaction";
import { useAuth } from "@/context/AuthContext";
import MetricCard from "../UI/MetricCard";
import RecentActivities from "./RecentActivities";

interface DashboardData {
  balance: number;
  totalLent: number;
  interestEarned: number;
  activeBorrowers: number;
  overdueBorrowers: number;
  recentTransactions: Transaction[];
}

export default function DashboardContent() {
  const { lender } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    balance: 0,
    totalLent: 0,
    interestEarned: 0,
    activeBorrowers: 0,
    overdueBorrowers: 0,
    recentTransactions: []
  });

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, this would be an API call
        // For demo purposes, we'll use mock data
        setTimeout(() => {
          setDashboardData({
            balance: 25000,
            totalLent: 150000,
            interestEarned: 8500,
            activeBorrowers: 12,
            overdueBorrowers: 3,
            recentTransactions: [
              {
                type: "loan",
                amount: 5000,
                date: new Date(2024, 3, 15),
                referenceId: "LOAN-12345"
              },
              {
                type: "payment",
                amount: 1200,
                date: new Date(2024, 3, 10),
                referenceId: "PMT-67890"
              },
              {
                type: "interest",
                amount: 350,
                date: new Date(2024, 3, 1),
                referenceId: "INT-24680"
              }
            ]
          });
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    if (lender) {
      fetchData();
    }
  }, [lender]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-gray-500">Loading dashboard data...</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Account Balance Card */}
      <MetricCard
        icon={<CurrencyDollarIcon className="h-6 w-6 text-yellow-600" />}
        iconBgColor="bg-yellow-100"
        title="Account Balance"
        value={`$${dashboardData.balance.toLocaleString()}`}
      />

      {/* Total Loans Card */}
      <MetricCard
        icon={<CurrencyDollarIcon className="h-6 w-6 text-green-600" />}
        iconBgColor="bg-green-100"
        title="Total Loans"
        value={`$${dashboardData.totalLent.toLocaleString()}`}
      />

      {/* Active Borrowers Card */}
      <MetricCard
        icon={<UsersIcon className="h-6 w-6 text-blue-600" />}
        iconBgColor="bg-blue-100"
        title="Active Borrowers"
        value={dashboardData.activeBorrowers.toString()}
      />

      {/* Overdue Payments Card */}
      <MetricCard
        icon={<DocumentTextIcon className="h-6 w-6 text-red-600" />}
        iconBgColor="bg-red-100"
        title="Overdue Payments"
        value={dashboardData.overdueBorrowers.toString()}
      />

      {/* Chart Section */}
      <div className="md:col-span-3 lg:col-span-3 bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg text-gray-700 font-semibold mb-4">
          Loan Overview
        </h3>
        <div className="h-64 bg-gray-50 rounded-lg p-4 flex items-center justify-center">
          <div className="text-gray-400">
            Chart Component
            {/* In a real implementation, this would be a chart library like Chart.js or Recharts */}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg text-gray-700 font-semibold mb-4">
          Recent Activities
        </h3>
        <RecentActivities transactions={dashboardData.recentTransactions} />
      </div>
    </div>
  );
}