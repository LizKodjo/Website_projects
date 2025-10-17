import type { FC } from "react";
import type { Transaction } from "../../types";

interface TransactionListProps {
  transactions: Transaction[];
}

const TransactionList: FC<TransactionListProps> = ({ transactions }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
      <div className="space-y-3">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex justify-between items-center p-3 border rounded-lg"
          >
            <div>
              <p className="font-semibold">{transaction.description}</p>
              <p className="text-sm text-gray-600">{transaction.category}</p>
            </div>
            <div className="text-right">
              <p
                className={`font-bold ${
                  transaction.type === "income"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {transaction.type === "income" ? "+" : "-"}£{transaction.amount}
              </p>
              <p className="text-sm text-gray-600">
                {new Date(transaction.date).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionList;
