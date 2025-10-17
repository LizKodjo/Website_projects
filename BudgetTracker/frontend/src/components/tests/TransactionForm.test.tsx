import { render, screen, fireEvent, waitFor } from "../../test/test-utils";

import { describe, it, expect, vi, beforeEach } from "vitest";
import TransactionForm from "../Transaction/TransactionForm";

const mockOnSubmit = vi.fn();

describe("TransactionForm", () => {
  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it("renders all form fields", () => {
    render(<TransactionForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add transaction/i })
    ).toBeInTheDocument();
  });

  it("submits form with correct data", async () => {
    render(<TransactionForm onSubmit={mockOnSubmit} />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/amount/i), {
      target: { value: "100.50" },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: "Test transaction" },
    });
    fireEvent.change(screen.getByLabelText(/category/i), {
      target: { value: "Food" },
    });
    fireEvent.change(screen.getByLabelText(/type/i), {
      target: { value: "expense" },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /add transaction/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        amount: 100.5,
        description: "Test transaction",
        category: "Food",
        type: "expense",
      });
    });
  });

  it("validates required fields", async () => {
    render(<TransactionForm onSubmit={mockOnSubmit} />);

    // Try to submit without filling required fields
    fireEvent.click(screen.getByRole("button", { name: /add transaction/i }));

    // Form should not be submitted
    await waitFor(() => {
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  it("resets form after successful submission", async () => {
    render(<TransactionForm onSubmit={mockOnSubmit} />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/amount/i), {
      target: { value: "100.50" },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: "Test transaction" },
    });
    fireEvent.change(screen.getByLabelText(/category/i), {
      target: { value: "Food" },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /add transaction/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
      // Form should be reset
      expect(screen.getByLabelText(/amount/i)).toHaveValue(null);
      expect(screen.getByLabelText(/description/i)).toHaveValue("");
      expect(screen.getByLabelText(/category/i)).toHaveValue("");
    });
  });
});
