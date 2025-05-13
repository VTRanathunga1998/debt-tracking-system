import { Transaction } from "../../types/transaction";

interface RecentActivitiesProps {
  transactions: Transaction[];
}

export default function RecentActivities({ transactions }: RecentActivitiesProps) {
  // Helper function to get a human-readable activity label
  const getActivityLabel = (type: string): string => {
    switch (type) {
      case "loan":
        return "Loan Issued";
      case "payment":
        return "Payment Received";
      case "interest":
        return "Interest Earned";
      default:
        return "Unknown Activity";
    }
  };

  // Helper function to format the date
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  };

  // Helper to get dot color based on transaction type
  const getDotColor = (type: string): string => {
    switch (type) {
      case "loan":
        return "bg-green-600";
      case "payment":
        return "bg-indigo-600";
      case "interest":
        return "bg-yellow-600";
      default:
        return "bg-gray-600";
    }
  };

  return (
    <>
      {transactions.length > 0 ? (
        <ul className="space-y-4">
          {transactions.map((transaction, index) => (
            <li key={index} className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <div
                  className={`h-2 w-2 rounded-full ${getDotColor(transaction.type)}`}
                ></div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">
                  {getActivityLabel(transaction.type)}
                </p>
                <p className="text-xs text-gray-500">
                  {transaction.referenceId || "No Reference"}
                </p>
                <p className="text-xs text-gray-400">
                  {formatDate(transaction.date)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No recent activities.</p>
      )}
    </>
  );
}