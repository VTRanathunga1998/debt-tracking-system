"use client";
import BorrowersTable from "./BorrowersTable";
import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";

export default function BorrowersContent() {
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Manage Borrowers</h2>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Borrower
        </button>
      </div>
      
      {/* Add Borrower Form (simplified, would be expanded in real app) */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Add New Borrower</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input 
                type="text" 
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input 
                type="email" 
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input 
                type="tel" 
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                placeholder="(555) 123-4567"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input 
                type="text" 
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                placeholder="123 Main St, City, State"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button 
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              Add Borrower
            </button>
          </div>
        </div>
      )}
      
      <BorrowersTable />
    </div>
  );
}