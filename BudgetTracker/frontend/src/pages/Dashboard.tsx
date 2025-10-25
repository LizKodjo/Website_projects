import { useEffect, useState, type FC } from "react";
import { useAuth } from "../contexts/AuthContext";
import type { Budget, Transaction } from "../types";
import { budgetAPI, transactionAPI } from "../utils/api";
import TransactionForm from "../components/Transaction/TransactionForm";
import TransactionList from "../components/Transaction/TransactionList";
import BudgetOverview from "../components/Budget/BudgetOverview";
import SpendingChart from "../components/Budget/SpendingChart";
import ThemeToggle from "../components/Theme/ThemeToggle";
import { useTheme } from "../contexts/ThemeContext";
import { expenseCategories } from "../utils/categories";

const Dashboard: FC = () => {
  const { user, logout } = useAuth();
  const { theme } = useTheme(); // Add this line to get the theme
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchTransactions(), fetchBudgets()]);
      setError(null);
    } catch (err) {
      console.error("Error loading user data:", err);
      setError("Failed to load your data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await transactionAPI.getAll(user!.id);
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const fetchBudgets = async () => {
    try {
      const response = await budgetAPI.getAll(user!.id);
      setBudgets(response.data);
    } catch (error) {
      console.error("Error fetching budgets:", error);
    }
  };

  const handleAddTransaction = async (transactionData: any) => {
    try {
      await transactionAPI.create(transactionData, user!.id);
      await fetchTransactions();
    } catch (error: any) {
      console.error("Error adding transaction:", error);
      setError(
        `Failed to add transaction: ${
          error.response?.data?.detail || error.message
        }`
      );
    }
  };

  const handleAddBudget = async (budgetData: any) => {
    try {
      await budgetAPI.create(budgetData, user!.id);
      await fetchBudgets();
    } catch (error: any) {
      console.error("Error adding budget:", error);
      setError(
        `Failed to add budget: ${error.response?.data?.detail || error.message}`
      );
    }
  };

  const handleLogout = () => {
    logout();
  };

  // Calculate financial summary
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const netBalance = totalIncome - totalExpenses;

  if (loading) {
    return (
      <div
        className={`min-h-screen transition-colors duration-200 ${
          theme === "dark"
            ? "bg-gray-900 text-white"
            : "bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800"
        } flex items-center justify-center`}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg">Loading your data...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        theme === "dark"
          ? "bg-gray-900"
          : "bg-gradient-to-br from-blue-50 to-indigo-100"
      }`}
    >
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 transition-colors duration-200">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
                💰 BudgetTracker
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
                Welcome back, {user?.full_name}!
              </p>
            </div>
            <div className="flex items-center space-x-3 self-end sm:self-auto">
              <ThemeToggle />
              <div className="text-right hidden sm:block">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {user?.email}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  User #{user?.id}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center">
              <span className="text-red-500 mr-2">⚠</span>
              <span>{error}</span>
              <button
                onClick={loadUserData}
                className="ml-auto bg-red-100 hover:bg-red-200 dark:bg-red-800 dark:hover:bg-red-700 text-red-800 dark:text-red-200 px-3 py-1 rounded text-sm"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Financial Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-600">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <span className="text-green-600 dark:text-green-400 text-xl">
                  ↑
                </span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Income
                </p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  ${totalIncome.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-600">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <span className="text-red-600 dark:text-red-400 text-xl">
                  ↓
                </span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Expenses
                </p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  ${totalExpenses.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-600">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <span className="text-blue-600 dark:text-blue-400 text-xl">
                  ⚖
                </span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Net Balance
                </p>
                <p
                  className={`text-2xl font-bold ${
                    netBalance >= 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  ${netBalance.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Forms and Transactions */}
          <div className="xl:col-span-2 space-y-6">
            <TransactionForm onSubmit={handleAddTransaction} />

            {/* Quick Budget Form */}
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border dark:border-gray-600">
              <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-800 dark:text-white">
                Set Budget
              </h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  handleAddBudget({
                    category: formData.get("category"),
                    amount: parseFloat(formData.get("amount") as string),
                    period: formData.get("period"),
                  });
                  e.currentTarget.reset();
                }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
              >
                <div className="sm:col-span-2 lg:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Category
                  </label>
                  <select
                    name="category"
                    required
                    className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-400 text-sm sm:text-base"
                  >
                    <option value="">Select category</option>
                    {expenseCategories.map((category) => (
                      <option key={category.name} value={category.name}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Amount
                  </label>
                  <input
                    name="amount"
                    type="number"
                    step="0.01"
                    required
                    className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-400 text-sm sm:text-base"
                    placeholder="500.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Period
                  </label>
                  <select
                    name="period"
                    required
                    className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-400 text-sm sm:text-base"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="weekly">Weekly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
                <div className="sm:col-span-2 lg:col-span-1 flex items-end">
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base transition-colors"
                  >
                    Set Budget
                  </button>
                </div>
              </form>
            </div>

            <TransactionList transactions={transactions} />
          </div>

          {/* Right Column - Budgets and Stats */}
          <div className="space-y-6">
            <BudgetOverview budgets={budgets} transactions={transactions} />
            <SpendingChart transactions={transactions} />

            {/* Quick Stats */}
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border dark:border-gray-600">
              <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-800 dark:text-white">
                📊 Quick Stats
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Transactions
                  </p>
                  <p className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
                    {transactions.length}
                  </p>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Active Budgets
                  </p>
                  <p className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
                    {budgets.length}
                  </p>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Savings Rate
                  </p>
                  <p className="text-lg sm:text-xl font-bold text-green-600 dark:text-green-400">
                    {totalIncome > 0
                      ? ((netBalance / totalIncome) * 100).toFixed(1)
                      : "0"}
                    %
                  </p>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Net Balance
                  </p>
                  <p
                    className={`text-lg sm:text-xl font-bold ${
                      netBalance >= 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    ${netBalance.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
