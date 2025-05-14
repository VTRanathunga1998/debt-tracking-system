import { useState, useMemo, useEffect } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  ArrowUpDown,
  UserCircle,
  Eye,
  Pencil,
  Trash,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";

interface Borrower {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalLoans: number;
  activeLoans: number;
  lastPayment: string;
  status: "active" | "overdue" | "completed";
}

export default function BorrowersTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Borrower;
    direction: "asc" | "desc";
  } | null>({ key: "name", direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);
  const [borrowers, setBorrowers] = useState<Borrower[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { token } = useAuth();

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  console.log(borrowers);

  // Fetch borrowers from backend
  useEffect(() => {
    const fetchBorrowers = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/borrower`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch borrowers");
        }
        const data: Borrower[] = await response.json();
        setBorrowers(data);
      } catch (err) {
        const error = err as Error;
        setError(error.message || "An error occurred while fetching borrowers");
      } finally {
        setLoading(false);
      }
    };

    fetchBorrowers();
  }, []);

  // Handle sort
  const handleSort = (key: keyof Borrower) => {
    let direction: "asc" | "desc" = "asc";

    if (sortConfig && sortConfig.key === key) {
      direction = sortConfig.direction === "asc" ? "desc" : "asc";
    }

    setSortConfig({ key, direction });
  };

  // Get sorted and filtered borrowers
  const filteredAndSortedBorrowers = useMemo(() => {
    // Filter based on search
    let filtered = borrowers.filter((borrower) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        borrower.name.toLowerCase().includes(searchLower) ||
        borrower.email.toLowerCase().includes(searchLower) ||
        borrower.phone.includes(searchQuery) ||
        borrower.id.toLowerCase().includes(searchLower)
      );
    });

    // Sort if sortConfig exists
    if (sortConfig) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [borrowers, searchQuery, sortConfig]);

  // Pagination
  const paginatedBorrowers = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredAndSortedBorrowers.slice(
      startIndex,
      startIndex + rowsPerPage
    );
  }, [filteredAndSortedBorrowers, currentPage, rowsPerPage]);

  // Total pages calculation
  const totalPages = Math.ceil(filteredAndSortedBorrowers.length / rowsPerPage);

  // Handle action menu toggle
  const toggleActionMenu = (id: string) => {
    setActionMenuOpen(actionMenuOpen === id ? null : id);
  };

  // Handle row actions (would connect to actual functionality in a real app)
  const handleViewBorrower = (id: string) => {
    console.log(`View borrower ${id}`);
    setActionMenuOpen(null);
  };

  const handleEditBorrower = (id: string) => {
    console.log(`Edit borrower ${id}`);
    setActionMenuOpen(null);
  };

  const handleDeleteBorrower = async (nic: string) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/borrower/${nic}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete borrower");
      }

      const data = await res.json();
      console.log("Delete response:", data);

      // Refresh the table or refetch data
      // e.g. fetchBorrowers() or trigger a state update if using SWR or React Query

      setActionMenuOpen(null);
    } catch (error) {
      console.error("Error deleting borrower:", error);
    }
  };

  // Format date string to more readable format
  const formatDate = (dateString: string) => {
    if (dateString === "N/A") return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  // Render status badge with appropriate color
  const renderStatusBadge = (status: Borrower["status"]) => {
    let bgColor = "";
    let textColor = "";

    switch (status) {
      case "active":
        bgColor = "bg-green-100";
        textColor = "text-green-800";
        break;
      case "overdue":
        bgColor = "bg-red-100";
        textColor = "text-red-800";
        break;
      case "completed":
        bgColor = "bg-blue-100";
        textColor = "text-blue-800";
        break;
      default:
        bgColor = "bg-gray-100";
        textColor = "text-gray-800";
    }

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor} capitalize`}
      >
        {status}
      </span>
    );
  };

  // Render loading or error states
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 text-center">
        <p className="text-gray-500">Loading borrowers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Table Header with Search */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Search borrowers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                <button
                  className="flex items-center space-x-1 group"
                  onClick={() => handleSort("name")}
                >
                  <span>Borrower</span>
                  {sortConfig?.key === "name" ? (
                    sortConfig.direction === "asc" ? (
                      <ChevronUp className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    )
                  ) : (
                    <ArrowUpDown className="h-4 w-4 text-gray-300 group-hover:text-gray-500" />
                  )}
                </button>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                <button
                  className="flex items-center space-x-1 group"
                  onClick={() => handleSort("totalLoans")}
                >
                  <span>Loans</span>
                  {sortConfig?.key === "totalLoans" ? (
                    sortConfig.direction === "asc" ? (
                      <ChevronUp className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    )
                  ) : (
                    <ArrowUpDown className="h-4 w-4 text-gray-300 group-hover:text-gray-500" />
                  )}
                </button>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                <button
                  className="flex items-center space-x-1 group"
                  onClick={() => handleSort("lastPayment")}
                >
                  <span>Last Payment</span>
                  {sortConfig?.key === "lastPayment" ? (
                    sortConfig.direction === "asc" ? (
                      <ChevronUp className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    )
                  ) : (
                    <ArrowUpDown className="h-4 w-4 text-gray-300 group-hover:text-gray-500" />
                  )}
                </button>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                <button
                  className="flex items-center space-x-1 group"
                  onClick={() => handleSort("status")}
                >
                  <span>Status</span>
                  {sortConfig?.key === "status" ? (
                    sortConfig.direction === "asc" ? (
                      <ChevronUp className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    )
                  ) : (
                    <ArrowUpDown className="h-4 w-4 text-gray-300 group-hover:text-gray-500" />
                  )}
                </button>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedBorrowers.length > 0 ? (
              paginatedBorrowers.map((borrower) => (
                <tr
                  key={borrower.id}
                  className="hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-indigo-100 rounded-full">
                        <UserCircle className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {borrower.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {borrower.email}
                        </div>
                        <div className="text-xs text-gray-400">
                          {borrower.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {borrower.totalLoans} total
                    </div>
                    <div className="text-sm text-gray-500">
                      {borrower.activeLoans} active
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(borrower.lastPayment)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderStatusBadge(borrower.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                    <button
                      onClick={() => toggleActionMenu(borrower.id)}
                      className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500"
                      aria-label="Actions"
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </button>

                    {actionMenuOpen === borrower.id && (
                      <div
                        className="absolute right-8 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                        role="menu"
                        aria-orientation="vertical"
                      >
                        <div className="py-1" role="none">
                          <button
                            onClick={() => handleViewBorrower(borrower.id)}
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            role="menuitem"
                          >
                            <Eye className="h-4 w-4 mr-2 text-gray-500" />
                            View details
                          </button>
                          <button
                            onClick={() => handleEditBorrower(borrower.id)}
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            role="menuitem"
                          >
                            <Pencil className="h-4 w-4 mr-2 text-gray-500" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteBorrower(borrower.id)}
                            className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            role="menuitem"
                          >
                            <Trash className="h-4 w-4 mr-2 text-red-500" />
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-10 text-center text-gray-500 italic"
                >
                  {searchQuery
                    ? "No borrowers match your search"
                    : "No borrowers found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredAndSortedBorrowers.length > 0 && (
        <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">
                  {Math.min(
                    (currentPage - 1) * rowsPerPage + 1,
                    filteredAndSortedBorrowers.length
                  )}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(
                    currentPage * rowsPerPage,
                    filteredAndSortedBorrowers.length
                  )}
                </span>{" "}
                of{" "}
                <span className="font-medium">
                  {filteredAndSortedBorrowers.length}
                </span>{" "}
                borrowers
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400"
                      : "bg-white text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  <ChevronDown className="h-5 w-5 rotate-90" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === page
                          ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400"
                      : "bg-white text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <span className="sr-only">Next</span>
                  <ChevronUp className="h-5 w-5 rotate-90" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
