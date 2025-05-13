"use client";
import { useState } from "react";
import { CurrencyDollarIcon, ClockIcon, CheckCircleIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

export default function PaymentsContent() {
  const [activeFilter, setActiveFilter] = useState("all");
  
  // This would come from API in a real app
  const paymentStats = {
    total: {
      count: 120,
      amount: 45000
    },
    thisMonth: {
      count: 12,
      amount: 4500
    },
    pending: {
      count: 5,
      amount: 1800
    },
    overdue: {
      count: 3,
      amount: 1200
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Payment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-indigo-100 rounded-lg">
              <CurrencyDollarIcon className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Payments</p>
              <p className="text-xl font-bold">${paymentStats.total.amount.toLocaleString()}</p>
              <p className="text-xs text-gray-500">{paymentStats.total.count} payments</p>
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
              <p className="text-xl font-bold">${paymentStats.thisMonth.amount.toLocaleString()}</p>
              <p className="text-xs text-gray-500">{paymentStats.thisMonth.count} payments</p>
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
              <p className="text-xl font-bold">${paymentStats.pending.amount.toLocaleString()}</p>
              <p className="text-xs text-gray-500">{paymentStats.pending.count} payments</p>
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
              <p className="text-xl font-bold">${paymentStats.overdue.amount.toLocaleString()}</p>
              <p className="text-xs text-gray-500">{paymentStats.overdue.count} payments</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Payment Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <div className="flex flex-wrap gap-2">
          <button 
            className={`px-4 py-2 rounded-lg ${activeFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setActiveFilter('all')}
          >
            All Payments
          </button>
          <button 
            className={`px-4 py-2 rounded-lg ${activeFilter === 'received' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setActiveFilter('received')}
          >
            Received
          </button>
          <button 
            className={`px-4 py-2 rounded-lg ${activeFilter === 'pending' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setActiveFilter('pending')}
          >
            Pending
          </button>
          <button 
            className={`px-4 py-2 rounded-lg ${activeFilter === 'overdue' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setActiveFilter('overdue')}
          >
            Overdue
          </button>
        </div>
      </div>
      
      {/* Payment List Placeholder */}
      <div className="bg-white p-6 rounded-xl shadow-sm min-h-[300px] flex items-center justify-center">
        <div className="text-center text-gray-500">
          <CurrencyDollarIcon className="h-12 w-12 mx-auto mb-3 text-gray-400" />
          <p className="text-lg font-medium">Payments Management</p>
          <p className="text-sm">Payment details would be displayed here based on the selected filter: {activeFilter}</p>
        </div>
      </div>
    </div>
  );
}