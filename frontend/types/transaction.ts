export interface Transaction {
  _id: string;
  type: string;
  amount: number;
  date: Date;
  referenceId: string;
}
