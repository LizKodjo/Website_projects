import type { Budget, Transaction } from "../types";

export interface BudgetAlert {
  type: "warning" | "danger" | "info";
  message: string;
  category: string;
  currentSpending: number;
  budgetLimit: number;
  percentage: number;
}

export const checkBudgetAlerts = (
  budgets: Budget[],
  transactions: Transaction[]
): BudgetAlert[] => {
  const alerts: BudgetAlert[] = [];

  budgets.forEach((budget) => {
    // Calculate spending for this budget category
    const categorySpending = transactions
      .filter((t) => t.category === budget.category && t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const percentage = (categorySpending / budget.amount) * 100;

    // Generate alerts thresholds
    if (percentage >= 100) {
      alerts.push({
        type: "danger",
        message: `You've exceeded your ${budget.category} budget!`,
        category: budget.category,
        currentSpending: categorySpending,
        budgetLimit: budget.amount,
        percentage,
      });
    } else if (percentage >= 75) {
      alerts.push({
        type: "info",
        message: `You've used ${Math.round(percentage)}% of your ${
          budget.category
        } budget.`,
        category: budget.category,
        currentSpending: categorySpending,
        budgetLimit: budget.amount,
        percentage,
      });
    }
  });
  return alerts;
};

export const getAlertColor = (type: BudgetAlert["type"]): string => {
  switch (type) {
    case "danger":
      return "red";
    case "warning":
      return "yellow";
    case "info":
      return "blue";
    default:
      return "gray";
  }
};

export const getAlertIcon = (type: BudgetAlert["type"]): string => {
  switch (type) {
    case "danger":
      return "💥";
    case "warning":
      return "⚠️";
    case "info":
      return "💡";
    default:
      return "📢";
  }
};
