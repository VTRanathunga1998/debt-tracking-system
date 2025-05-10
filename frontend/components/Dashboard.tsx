"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ChartBarIcon,
  UsersIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/context/AuthContext"; // Import the AuthContext

const navigation = [
  { name: "Dashboard", icon: ChartBarIcon, current: true },
  { name: "Borrowers", icon: UsersIcon, current: false },
  { name: "Loans", icon: CurrencyDollarIcon, current: false },
  { name: "Payments", icon: DocumentTextIcon, current: false },
  { name: "Settings", icon: Cog6ToothIcon, current: false },
];

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard");

  // Access lender details and logout function from AuthContext
  const { lender, logout } = useAuth();

  const [loading, setLoading] = useState(true);
  const [lenderDetails, setLenderDetails] = useState<{
    balance: number;
    totalLent: number;
    interestEarned: number;
    activeBorrowers: number;
  } | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchAccountStatement = async () => {
      try {
        const lenderId = lender?._id; // Use optional chaining to avoid errors
        if (!lenderId) {
          setLoading(false);
          return;
        }

        const response = await fetch(
          `http://localhost:4000/api/user/account-statements/${lenderId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch account statement");
        }

        const data = await response.json();
        setLenderDetails({
          balance: data.balance,
          totalLent: data.totalLent,
          interestEarned: data.interestEarned,
          activeBorrowers: data.activeBorrowers,
        });
      } catch (error) {
        console.error("Error fetching account statement:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountStatement();
  }, [lender]); // Add lender as a dependency to re-fetch data if lender changes

  // Early return for loading or missing lender
  if (!lender) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-700">Loading......</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-700">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Toggle */}
      <button
        className="md:hidden fixed top-4 right-4 z-50 p-2 text-gray-700 hover:bg-gray-100 rounded-full"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white shadow-xl transition duration-300 ease-in-out 
          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
      >
        <div className="flex flex-col h-full p-4">
          {/* Logo */}
          <div className="flex items-center mb-8 p-2">
            <CurrencyDollarIcon className="h-8 w-8 text-indigo-600" />
            <span className="ml-2 text-xl font-bold text-gray-800">
              DebtTracker
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  setActiveTab(item.name);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center p-3 rounded-lg transition-colors
                  ${
                    activeTab === item.name
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </button>
            ))}
          </nav>

          {/* Profile & Logout */}
          <div className="border-t pt-4">
            <div
              className="flex items-center p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
              onClick={logout} // Attach the logout function
            >
              <img
                src="https://via.placeholder.com/40"
                alt="Profile"
                className="h-8 w-8 rounded-full"
              />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">
                  {lender.name}
                </p>
                {/* Lender's Name */}
                <p className="text-xs text-gray-500">Lender</p>
              </div>
              <ArrowLeftOnRectangleIcon className="h-5 w-5 ml-auto text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="md:ml-64 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">{activeTab}</h1>
          </div>

          {/* Dashboard Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Account Balance Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <CurrencyDollarIcon className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Account Balance</p>
                  <p className="text-2xl text-black font-bold">
                    ${lenderDetails?.balance?.toLocaleString() || 0}{" "}
                    {/* Account Balance */}
                  </p>
                </div>
              </div>
            </div>

            {/* Total Loans Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Total Loans</p>
                  <p className="text-2xl text-black font-bold">
                    ${lenderDetails?.totalLent?.toLocaleString() || 0}{" "}
                    {/* Total Lent */}
                  </p>
                </div>
              </div>
            </div>

            {/* Active Borrowers Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <UsersIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Active Borrowers</p>
                  <p className="text-2xl text-black font-bold">
                    {lenderDetails?.activeBorrowers || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Overdue Payments Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center">
                <div className="p-3 bg-red-100 rounded-lg">
                  <DocumentTextIcon className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Overdue Payments</p>
                  <p className="text-2xl text-black font-bold">15</p>
                </div>
              </div>
            </div>

            {/* Chart Section */}
            <div className="md:col-span-3 lg:col-span-3 bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg text-gray-500 font-semibold mb-4">
                Loan Overview
              </h3>
              <div className="h-64 bg-gray-50 rounded-lg p-4">
                {/* Chart placeholder */}
                <div className="flex items-center justify-center h-full text-gray-400">
                  Chart Component
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg text-gray-500 font-semibold mb-4">
                Recent Activities
              </h3>
              <ul className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <li key={item} className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="h-2 w-2 bg-indigo-600 rounded-full"></div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">Payment Received</p>
                      <p className="text-xs text-gray-500">Loan #45 - $1,500</p>
                      <p className="text-xs text-gray-400">2 hours ago</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
