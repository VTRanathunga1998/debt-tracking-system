"use client";
import { useState } from "react";
import { CurrencyDollarIcon, ClockIcon, DocumentTextIcon, ArrowTrendingUpIcon } from "@heroicons/react/24/outline";

export default function LoansContent() {
  const [activeView, setActiveView] = useState("all");
  
  // This would fetch from an API in a real app
  const loanStats = {
    total: {
      count: 25,
      amount: 175000,
      avgInterest: 8.5
    },
    active: {
      count: 15,
      amount: 120000,
      avgInterest: 9.2
    },
    overdue: {
      count: 3,
      amount: 15000,
      avgInterest: 10.1
    },
    completed: {
      count: 7,
      amount: 40000,
      avgInterest: 7.8
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Loan Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-indigo-100 rounded-lg">
              <CurrencyDollarIcon className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Loans</p>
              <p className="text-xl font-bold">${loanStats.total.amount.toLocaleString()}</p>
              <p className="text-xs text-gray-500">{loanStats.total.count} loans</p>
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
              <p className="text-xl font-bold">${loanStats.active.amount.toLocaleString()}</p>
              <p className="text-xs text-gray-500">{loanStats.active.count} loans</p>
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
              <p className="text-xl font-bold">${loanStats.overdue.amount.toLocaleString()}</p>
              <p className="text-xs text-gray-500">{loanStats.overdue.count} loans</p>
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
              <p className="text-xl font-bold">{loanStats.total.avgInterest}%</p>
              <p className="text-xs text-gray-500">Across all loans</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Loan Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <div className="flex flex-wrap gap-2">
          <button 
            className={`px-4 py-2 rounded-lg ${activeView === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setActiveView('all')}
          >
            All Loans
          </button>
          <button 
            className={`px-4 py-2 rounded-lg ${activeView === 'active' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setActiveView('active')}
          >
            Active
          </button>
          <button 
            className={`px-4 py-2 rounded-lg ${activeView === 'overdue' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setActiveView('overdue')}
          >
            Overdue
          </button>
          <button 
            className={`px-4 py-2 rounded-lg ${activeView === 'completed' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setActiveView('completed')}
          >
            Completed
          </button>
        </div>
      </div>
      
      {/* Loan List Placeholder */}
      <div className="bg-white p-6 rounded-xl shadow-sm min-h-[300px] flex items-center justify-center">
        <div className="text-center text-gray-500">
          <DocumentTextIcon className="h-12 w-12 mx-auto mb-3 text-gray-400" />
          <p className="text-lg font-medium">Loan Management</p>
          <p className="text-sm">Loan details would be displayed here based on the selected filter: {activeView}</p>
        </div>
      </div>
    </div>
  );
}