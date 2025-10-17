import { render, screen } from "../../test/test-utils";
import { describe, it, expect } from "vitest";
import TransactionList from "../Transaction/TransactionList";
import type { Transaction } from "../../types";

const mockTransactions: Transaction[] = [
  {
    id: 1,
    amount: 100.5,
    description: "Groceries",
    category: "Food",
    type: "expense",
    date: "2024-01-15T10:30:00Z",
    user_id: 1,
  },
  {
    id: 2,
    amount: 2000.0,
    description: "Salary",
    category: "Income",
    type: "income",
    date: "2024-01-01T00:00:00Z",
    user_id: 1,
  },
];

describe("TransactionList", () => {
  it("renders transaction list with correct items", () => {
    render(<TransactionList transactions={mockTransactions} />);

    expect(screen.getByText("Recent Transactions")).toBeInTheDocument();
    expect(screen.getByText("Groceries")).toBeInTheDocument();
    expect(screen.getByText("Salary")).toBeInTheDocument();
    expect(screen.getByText("Food")).toBeInTheDocument();
    expect(screen.getByText("Income")).toBeInTheDocument();
  });

  it("displays correct amount formatting", () => {
    render(<TransactionList transactions={mockTransactions} />);

    // Expense should show negative amount
    expect(screen.getByText("-$100.5")).toBeInTheDocument();
    // Income should show positive amount
    expect(screen.getByText("+$2000")).toBeInTheDocument();
  });

  it("displays correct date formatting", () => {
    render(<TransactionList transactions={mockTransactions} />);

    // Should format dates correctly
    expect(screen.getByText("1/15/2024")).toBeInTheDocument();
    expect(screen.getByText("1/1/2024")).toBeInTheDocument();
  });

  it("renders empty state when no transactions", () => {
    render(<TransactionList transactions={[]} />);

    expect(screen.getByText("Recent Transactions")).toBeInTheDocument();
    // No transaction items should be rendered
    expect(screen.queryByText("Groceries")).not.toBeInTheDocument();
  });
});
