// components/BorrowersTable.tsx
"use client";
import { useState } from 'react';
import {
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

interface Borrower {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalLoans: number;
  activeLoans: number;
  lastPayment: string;
  status: 'active' | 'overdue' | 'completed';
}

export default function BorrowersTable() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Borrower; direction: 'asc' | 'desc' } | null>(null);

  const borrowers: Borrower[] = [
    {
      id: 'BOR-001',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '(555) 234-5678',
      totalLoans: 3,
      activeLoans: 2,
      lastPayment: '2024-02-15',
      status: 'active'
    },
    {
      id: 'BOR-002',
      name: 'Michael Chen',
      email: 'michael@example.com',
      phone: '(555) 345-6789',
      totalLoans: 5,
      activeLoans: 1,
      lastPayment: '2024-01-28',
      status: 'overdue'
    },
    // Add more sample data
  ];

  const sortedBorrowers = [...borrowers].sort((a, b) => {
    if (!sortConfig) return 0;
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key: keyof Borrower) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getStatusBadge = (status: 'active' | 'overdue' | 'completed') => {
    const statusClasses = {
      active: 'bg-green-100 text-green-800',
      overdue: 'bg-red-100 text-red-800',
      completed: 'bg-gray-100 text-gray-800'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm ${statusClasses[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm">
      {/* Search and Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Borrowers Management</h2>
        <div className="relative w-full md:w-72">
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search borrowers..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {[
                { key: 'name', label: 'Borrower' },
                { key: 'totalLoans', label: 'Total Loans' },
                { key: 'activeLoans', label: 'Active Loans' },
                { key: 'lastPayment', label: 'Last Payment' },
                { key: 'status', label: 'Status' },
                { label: 'Actions' }
              ].map((header) => (
                <th
                  key={header.key || header.label}
                  className="px-6 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                  onClick={() => header.key && requestSort(header.key as keyof Borrower)}
                >
                  <div className="flex items-center gap-1">
                    {header.label}
                    {header.key && (
                      <ChevronUpDownIcon className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedBorrowers.map((borrower) => (
              <tr key={borrower.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <UserCircleIcon className="h-8 w-8 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{borrower.name}</p>
                      <p className="text-sm text-gray-500">{borrower.email}</p>
                      <p className="text-sm text-gray-500">{borrower.phone}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">{borrower.totalLoans}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {borrower.activeLoans}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700">{borrower.lastPayment}</span>
                  </div>
                </td>
                <td className="px-6 py-4">{getStatusBadge(borrower.status)}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-indigo-600">
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-green-600">
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-red-600">
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden mt-4 space-y-4">
        {sortedBorrowers.map((borrower) => (
          <div key={borrower.id} className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <UserCircleIcon className="h-8 w-8 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">{borrower.name}</p>
                <p className="text-sm text-gray-500">{borrower.email}</p>
                <p className="text-sm text-gray-500">{borrower.phone}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500">Total Loans</p>
                <p>{borrower.totalLoans}</p>
              </div>
              <div>
                <p className="text-gray-500">Active Loans</p>
                <p className="text-blue-600">{borrower.activeLoans}</p>
              </div>
              <div>
                <p className="text-gray-500">Last Payment</p>
                <p>{borrower.lastPayment}</p>
              </div>
              <div>
                <p className="text-gray-500">Status</p>
                {getStatusBadge(borrower.status)}
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-3">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <EyeIcon className="h-5 w-5" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <PencilIcon className="h-5 w-5" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-between items-center">
        <span className="text-sm text-gray-700">
          Showing 1 to {borrowers.length} of {borrowers.length} results
        </span>
        <div className="flex gap-2">
          <button className="px-3 py-1 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200">
            Previous
          </button>
          <button className="px-3 py-1 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}