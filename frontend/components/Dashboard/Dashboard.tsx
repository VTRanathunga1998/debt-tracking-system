"use client";
import { useState } from "react";
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
import { useAuth } from "@/context/AuthContext";
import { decodeToken } from "@/utils/decodeToken";

// Tab components
import DashboardContent from "./DashboardContent";
import BorrowersContent from "../Borrowers/BorrowersContent";
import LoansContent from "../Loans/LoansContent";
import PaymentsContent from "../Payments/PaymentsContent";
import SettingsContent from "../Settings/SettingsContent";

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
  const { token, logout } = useAuth();

  // Decode token payload to get lender info
  const decoded = token ? decodeToken(token) : null;
  const lenderName = decoded?.name || "Unknown";

  if (!token || !decoded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-700">Loading...</p>
      </div>
    );
  }

  // Function to render the active tab content
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return <DashboardContent />;
      case "Borrowers":
        return <BorrowersContent />;
      case "Loans":
        return <LoansContent />;
      case "Payments":
        return <PaymentsContent />;
      case "Settings":
        return <SettingsContent />;
      default:
        return <DashboardContent />;
    }
  };

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
                  {lenderName}
                </p>
                <p className="text-xs text-gray-500">Lender</p>
              </div>
              <ArrowLeftOnRectangleIcon className="h-5 w-5 ml-auto text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="md:ml-64 p-6 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">{activeTab}</h1>
          </div>

          {/* Dynamic Content Based on Active Tab */}
          {renderActiveTabContent()}
        </div>
      </main>
    </div>
  );
}
