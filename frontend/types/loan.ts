export interface Loan {
  id: string;
  borrowerName: string;
  borrowerId: string;
  amount: number;
  interestRate: number;
  term: number;
  paymentFrequency: 'weekly' | 'biweekly' | 'monthly' | 'quarterly';
  startDate: string;
  nextPaymentDate: string;
  totalPaid: number;
  remainingAmount: number;
  status: 'active' | 'overdue' | 'completed';
}