export interface Transaction {
  type: string;
  amount: number;
  date: Date;
  referenceId: string;
}