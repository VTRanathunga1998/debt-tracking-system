export interface Loan {
  _id: string; // add this property for MongoDB document ID
  nic: string;
  amount: number;
  interestRate: number;
  startDate: string; // or Date, depends on what you use in frontend
  repaymentType: "interest-only" | "installment";
  numOfInstallments: number;
  nextInstallmentDate: string;
  dueDate?: string;
  totalAmount: number;
  installmentAmount: number;
  dueAmount: number;
  status: "active" | "completed" | "overdue";
  overdueNotificationSent: boolean;
  lenderId: string;

  // plus any other fields you want
  borrowerName?: string; // as per your UI
  borrowerId?: string; // as per your UI
  totalPaid?: number;
  remainingAmount?: number;
  nextPaymentDate?: string;
  paymentFrequency?: string;
  term?: number;
}
