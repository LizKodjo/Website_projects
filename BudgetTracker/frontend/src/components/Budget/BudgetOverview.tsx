import type { FC } from "react";
import type { Budget, Transaction } from "../../types";
import { getCategoryIcon } from "../../utils/categories";

interface BudgetOverviewProps {
  budgets: Budget[];
  transactions: Transaction[];
}

const BudgetOverview: FC<BudgetOverviewProps> = ({ budgets, transactions }) => {
  const calculateCategorySpending = (category: string): number => {
    return transactions
      .filter((t) => t.category === category && t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-600">
      <h2 className="text-xl font-bold mb-4">Budget Overview</h2>

      <div className="space-y-4">
        {budgets.map((budget) => {
          const spent = calculateCategorySpending(budget.category);
          const remaining = budget.amount - spent;
          const percentage = (spent / budget.amount) * 100;

          return (
            <div
              key={budget.id}
              className="border dark:border-gray-700 rounded-lg p-4 relative"
            >
              {/* Alert badge for exceeded budgets */}
              {percentage >= 100 && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  Over Budget!
                </div>
              )}

              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold flex items-center">
                  {getCategoryIcon(budget.category)}
                  <span className="ml-2">{budget.category}</span>
                </h3>
                <span
                  className={`text-sm font-medium ${
                    percentage >= 90
                      ? "text-red-600"
                      : percentage > 75
                      ? "text-yellow-600"
                      : "text-gray-600"
                  }`}
                >
                  £{spent.toFixed(2)} / £{budget.amount.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">{budget.category}</h3>
                <span className="text-sm text-gray-600">
                  £{spent.toFixed(2)} / £{budget.amount.toFixed(2)}
                </span>
              </div>

              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    percentage > 90
                      ? "bg-red-600"
                      : percentage > 75
                      ? "bg-yellow-500"
                      : "bg-green-600"
                  }`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                ></div>
              </div>

              <div className="flex justify-between text-sm mt-2">
                <span className="text-green-600">
                  Remaining: £{remaining.toFixed(2)}
                </span>
                <span className="text-gray-600">
                  {percentage.toFixed(1)}% used
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BudgetOverview;
