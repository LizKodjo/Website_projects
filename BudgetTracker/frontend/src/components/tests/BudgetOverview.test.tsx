import { render, screen } from "../../test/test-utils";
import { describe, it, expect } from "vitest";
import type { Budget, Transaction } from "../../types";
import BudgetOverview from "../Budget/BudgetOverview";

const mockBudgets: Budget[] = [
  {
    id: 1,
    category: "Food",
    amount: 500.0,
    period: "monthly",
    user_id: 1,
  },
  {
    id: 2,
    category: "Entertainment",
    amount: 200.0,
    period: "monthly",
    user_id: 1,
  },
];

const mockTransactions: Transaction[] = [
  {
    id: 1,
    amount: 300.0,
    description: "Groceries",
    category: "Food",
    type: "expense",
    date: "2024-01-15T10:30:00Z",
    user_id: 1,
  },
  {
    id: 2,
    amount: 50.0,
    description: "Movie",
    category: "Entertainment",
    type: "expense",
    date: "2024-01-10T20:00:00Z",
    user_id: 1,
  },
];

describe("BudgetOverview", () => {
  it("renders budget overview with correct items", () => {
    render(
      <BudgetOverview budgets={mockBudgets} transactions={mockTransactions} />
    );

    expect(screen.getByText("Budget Overview")).toBeInTheDocument();
    expect(screen.getByText("Food")).toBeInTheDocument();
    expect(screen.getByText("Entertainment")).toBeInTheDocument();
  });

  it("calculates and displays correct spending", () => {
    render(
      <BudgetOverview budgets={mockBudgets} transactions={mockTransactions} />
    );

    // Food budget: $500, spent: $300
    expect(screen.getByText("$300 / $500")).toBeInTheDocument();
    expect(screen.getByText("Remaining: $200")).toBeInTheDocument();
    expect(screen.getByText("60% used")).toBeInTheDocument();

    // Entertainment budget: $200, spent: $50
    expect(screen.getByText("$50 / $200")).toBeInTheDocument();
    expect(screen.getByText("Remaining: $150")).toBeInTheDocument();
    expect(screen.getByText("25% used")).toBeInTheDocument();
  });

  it("renders progress bars with correct percentages", () => {
    render(
      <BudgetOverview budgets={mockBudgets} transactions={mockTransactions} />
    );

    const progressBars = document.querySelectorAll(".bg-gray-200 > div");
    expect(progressBars).toHaveLength(2);

    // Food progress bar should be 60% width
    const foodProgressBar = progressBars[0] as HTMLDivElement;
    expect(foodProgressBar.style.width).toBe("60%");

    // Entertainment progress bar should be 25% width
    const entertainmentProgressBar = progressBars[1] as HTMLDivElement;
    expect(entertainmentProgressBar.style.width).toBe("25%");
  });

  it("renders empty state when no budgets", () => {
    render(<BudgetOverview budgets={[]} transactions={[]} />);

    expect(screen.getByText("Budget Overview")).toBeInTheDocument();
    // No budget items should be rendered
    expect(screen.queryByText("Food")).not.toBeInTheDocument();
  });
});
