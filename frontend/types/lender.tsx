// types/lender.ts
export interface Lender {
  _id: string;
  nic: string;
  email: string;
  name: string;
  telephone: string;
  address: string;
  account: {
    balance: number;
    totalLent: number;
    interestEarned: number;
  };
  transactions?: Array<{
    type: "loan" | "payment" | "interest";
    referenceId: string;
    amount: number;
    date: Date;
  }>;
}
