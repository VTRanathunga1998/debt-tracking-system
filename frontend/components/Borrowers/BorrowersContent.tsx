"use client";
import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import BorrowersTable from "./BorrowersTable";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function BorrowersContent() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    nic: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isFormValid = Object.values(formData).every(
    (value) => value.trim() !== ""
  );

  const handleAddBorrower = async () => {
    if (!isFormValid) {
      alert("Please fill in all the fields.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/borrower`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to add borrower");
      }

      const data = await res.json();
      console.log("Borrower added:", data);

      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        nic: "",
      });
      setShowAddForm(false);
    } catch (error) {
      console.error("Error adding borrower:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          Manage Borrowers
        </h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Borrower
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-4">
            Add New Borrower
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["name", "email", "phone", "address", "nic"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field === "nic"
                    ? "NIC"
                    : field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  name={field}
                  type={field === "email" ? "email" : "text"}
                  value={formData[field as keyof typeof formData]}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder={`Enter ${field}`}
                />
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 border border-gray-700 text-gray-800 bg-white rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={handleAddBorrower}
              disabled={loading || !isFormValid}
              className={`px-4 py-2 rounded-lg text-white ${
                loading || !isFormValid
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {loading ? "Adding..." : "Add Borrower"}
            </button>
          </div>
        </div>
      )}

      <BorrowersTable />
    </div>
  );
}
