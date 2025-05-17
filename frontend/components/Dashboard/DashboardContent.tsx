"use client";

import { useEffect, useState } from "react";
import {
  CurrencyDollarIcon,
  UsersIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

import { useAuth } from "@/context/AuthContext";
import { Transaction } from "../../types/transaction";
import MetricCard from "../UI/MetricCard";
import RecentActivities from "./RecentActivities";
import UpdateBalanceDialog from "./UpdateBalanceDialog";
import LoanOverviewChart from "./LoanOverviewChart";

interface DashboardData {
  balance: number;
  totalLent: number;
  interestEarned: number;
  activeBorrowers: number;
  overdueBorrowers: number;
  recentTransactions: Transaction[];
}

interface DecodedToken {
  _id: string;
  email: string;
  name: string;
  nic: string;
  exp: number;
}

export default function DashboardContent() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isUpdateBalanceOpen, setIsUpdateBalanceOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    balance: 0,
    totalLent: 0,
    interestEarned: 0,
    activeBorrowers: 0,
    overdueBorrowers: 0,
    recentTransactions: [],
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token || !API_URL) return;

      try {
        const response = await fetch(`${API_URL}/user/account-statements`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error("Failed to fetch dashboard data");
          throw new Error("Failed to fetch dashboard data");
        }

        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  const handleUpdateBalance = async (newBalance: number) => {
    if (!token || !API_URL) return;

    try {
      const response = await fetch(`${API_URL}/user/update-balance`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ balance: newBalance }),
      });

      if (!response.ok) {
        throw new Error("Failed to update balance");
      }

      setDashboardData((prev) => ({
        ...prev,
        balance: newBalance,
      }));
    } catch (error) {
      console.error("Error updating balance:", error);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-500">Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        onClick={() => setIsUpdateBalanceOpen(true)}
        className="cursor-pointer"
      >
        <MetricCard
          icon={<CurrencyDollarIcon className="h-6 w-6 text-yellow-600" />}
          iconBgColor="bg-yellow-100"
          title="Account Balance"
          value={`$${dashboardData.balance.toLocaleString()}`}
        />
      </div>

      <MetricCard
        icon={<CurrencyDollarIcon className="h-6 w-6 text-green-600" />}
        iconBgColor="bg-green-100"
        title="Total Loans"
        value={`$${dashboardData.totalLent.toLocaleString()}`}
      />

      <MetricCard
        icon={<UsersIcon className="h-6 w-6 text-blue-600" />}
        iconBgColor="bg-blue-100"
        title="Active Borrowers"
        value={dashboardData.activeBorrowers.toString()}
      />

      <MetricCard
        icon={<DocumentTextIcon className="h-6 w-6 text-red-600" />}
        iconBgColor="bg-red-100"
        title="Overdue Payments"
        value={dashboardData.overdueBorrowers.toString()}
      />

      <div className="md:col-span-3 lg:col-span-3 bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg text-gray-700 font-semibold mb-4">
          Loan Overview
        </h3>
        <div className="h-64">
          <LoanOverviewChart />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg text-gray-700 font-semibold mb-4">
          Recent Activities
        </h3>
        <RecentActivities transactions={dashboardData.recentTransactions} />
      </div>

      <UpdateBalanceDialog
        isOpen={isUpdateBalanceOpen}
        onClose={() => setIsUpdateBalanceOpen(false)}
        currentBalance={dashboardData.balance}
        onUpdate={handleUpdateBalance}
      />
    </div>
  );
}
