import type { FC } from "react";
import type { Transaction } from "../../types";
import { getCategoryColor, getCategoryIcon } from "../../utils/categories";

interface TransactionListProps {
  transactions: Transaction[];
}

const TransactionList: FC<TransactionListProps> = ({ transactions }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
      <div className="space-y-3">
        {transactions.map((transaction) => {
          const categoryIcon = getCategoryIcon(transaction.category);
          const categoryColor = getCategoryColor(transaction.category);

          return (
            <div
              key={transaction.id}
              className="flex justify-between items-start sm:items-center p-3 sm:p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start space-x-2 sm:space-x-3 min-w-0 flex-1">
                <div
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-base sm:text-lg flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: `£{categoryColor}20` }}
                >
                  {categoryIcon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm sm:text-base truncate">
                    {transaction.description}
                  </p>
                  <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-600 flex-wrap">
                    <span className="truncate">{transaction.category}</span>
                    <span className="hidden sm:inline">•</span>
                    <span>
                      {new Date(transaction.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-2">
                <p
                  className={`font-bold text-sm sm:text-lg £{
                    transaction.type === "income"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"}£
                  {transaction.amount.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 capitalize hidden sm:block">
                  {transaction.type}
                </p>
              </div>
            </div>
          );
        })}

        {transactions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No transactions yet.</p>
            <p className="text-sm">
              Add your first transaction to get started!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionList;
