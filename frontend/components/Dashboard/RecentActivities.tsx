import { Transaction } from "../../types/transaction";

interface RecentActivitiesProps {
  transactions: Transaction[];
}

export default function RecentActivities({
  transactions,
}: RecentActivitiesProps) {
  const getActivityLabel = (type: string): string => {
    switch (type) {
      case "loan":
        return "Loan Issued";
      case "payment":
        return "Payment Received";
      case "interest":
        return "Interest Earned";
      case "deposit":
        return "Account Updated";
      default:
        return "Unknown Activity";
    }
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDotColor = (type: string): string => {
    switch (type) {
      case "loan":
        return "bg-green-500";
      case "payment":
        return "bg-blue-500";
      case "interest":
        return "bg-yellow-500";
      case "deposit":
        return "bg-purple-500";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="space-y-4 bg-white rounded-lg shadow-sm p-4">
      {transactions.length > 0 ? (
        <ul className="space-y-4">
          {transactions.map((transaction, index) => (
            <li key={index} className="flex items-start">
              <div className="flex-shrink-0 mt-1.5">
                <div
                  className={`h-3 w-3 rounded-full ${getDotColor(
                    transaction.type
                  )}`}
                ></div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-gray-800">
                  {getActivityLabel(transaction.type)}
                </p>
                <p className="text-sm text-gray-600">
                  Reference ID:{" "}
                  <span className="font-mono text-gray-800">
                    {transaction.referenceId || transaction._id || "N/A"}
                  </span>
                </p>
                <p className="text-xs text-gray-500">
                  {formatDate(transaction.date)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-sm">No recent activities.</p>
      )}
    </div>
  );
}
