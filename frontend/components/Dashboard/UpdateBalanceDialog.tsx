"use client";

import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface UpdateBalanceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalance: number;
  onUpdate: (newBalance: number) => void;
}

export default function UpdateBalanceDialog({
  isOpen,
  onClose,
  currentBalance,
  onUpdate,
}: UpdateBalanceDialogProps) {
  const [balance, setBalance] = useState(currentBalance);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(balance);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black opacity-30"></div>
        
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Update Balance</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="balance"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                New Balance
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  $
                </span>
                <input
                  type="number"
                  id="balance"
                  value={balance}
                  onChange={(e) => setBalance(Number(e.target.value))}
                  className="block w-full pl-8 pr-4 py-2 rounded-lg border text-black border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}