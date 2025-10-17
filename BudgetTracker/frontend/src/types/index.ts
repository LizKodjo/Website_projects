export interface Transaction {
  id: number;
  amount: number;
  description: string;
  category: string;
  type: "income" | "expense";
  date: string;
  user_id: number;
}

export interface Budget {
  id: number;
  category: string;
  amount: number;
  period: "monthly" | "weekly" | "yearly";
  user_id: number;
}

export interface User {
  id: number;
  email: string;
  full_name: string;
  created_at: string;
}
