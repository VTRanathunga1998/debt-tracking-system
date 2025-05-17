export interface Payment {
  _id: string;
  loanId: string;
  nic: string;
  paidAmount: number;
  date: Date | string;
}
