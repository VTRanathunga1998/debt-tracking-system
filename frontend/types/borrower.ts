export interface Borrower {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalLoans: number;
  activeLoans: number;
  lastPayment: string;
  status: 'active' | 'overdue' | 'completed';
}