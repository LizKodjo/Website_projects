import { render, screen, fireEvent, waitFor } from "../test/test-utils";
import App from "../App";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { transactionAPI, budgetAPI } from "../utils/api";

// Mock the API
vi.mock("../utils/api");

const mockedTransactionAPI = vi.mocked(transactionAPI);
const mockedBudgetAPI = vi.mocked(budgetAPI);

describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock API responses
    mockedTransactionAPI.getAll.mockResolvedValue({
      data: [
        {
          id: 1,
          amount: 100,
          description: "Existing transaction",
          category: "Food",
          type: "expense",
          date: "2024-01-15T10:30:00Z",
          user_id: 1,
        },
      ],
    });

    mockedBudgetAPI.getAll.mockResolvedValue({
      data: [
        {
          id: 1,
          category: "Food",
          amount: 500,
          period: "monthly",
          user_id: 1,
        },
      ],
    });

    mockedTransactionAPI.create.mockResolvedValue({
      data: {
        id: 2,
        amount: 200,
        description: "New transaction",
        category: "Entertainment",
        type: "expense",
        date: "2024-01-16T10:30:00Z",
        user_id: 1,
      },
    });
  });

  it("renders main application", async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Budget Tracker")).toBeInTheDocument();
      expect(
        screen.getByText("Manage your finances effectively")
      ).toBeInTheDocument();
    });
  });

  it("loads and displays transactions and budgets", async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Existing transaction")).toBeInTheDocument();
      expect(screen.getByText("Food")).toBeInTheDocument();
    });
  });

  it("adds new transaction", async () => {
    render(<App />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText("Existing transaction")).toBeInTheDocument();
    });

    // Fill out the transaction form
    fireEvent.change(screen.getByLabelText(/amount/i), {
      target: { value: "150" },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: "New transaction" },
    });
    fireEvent.change(screen.getByLabelText(/category/i), {
      target: { value: "Shopping" },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /add transaction/i }));

    await waitFor(() => {
      expect(mockedTransactionAPI.create).toHaveBeenCalledWith(
        {
          amount: 150,
          description: "New transaction",
          category: "Shopping",
          type: "expense",
        },
        1
      );
    });
  });

  it("displays financial summary correctly", async () => {
    render(<App />);

    await waitFor(() => {
      // Check if financial summary is displayed
      expect(screen.getByText("Financial Summary")).toBeInTheDocument();
      expect(screen.getByText("Total Income:")).toBeInTheDocument();
      expect(screen.getByText("Total Expenses:")).toBeInTheDocument();
      expect(screen.getByText("Net:")).toBeInTheDocument();
    });
  });
});
