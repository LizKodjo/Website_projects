import { useEffect, useState, type FC } from "react";
import { useAuth } from "../contexts/AuthContext";
import type { Budget, Transaction } from "../types";
import { budgetAPI, transactionAPI } from "../utils/api";
import TransactionForm from "../components/Transaction/TransactionForm";
import TransactionList from "../components/Transaction/TransactionList";
import BudgetOverview from "../components/Budget/BudgetOverview";
import SpendingChart from "../components/Budget/SpendingChart";

const Dashboard: FC = () => {
  const { user, logout } = useAuth();
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading your data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                💰 BudgetTracker
              </h1>
              <p className="text-gray-600 text-sm">
                Welcome back, {user?.full_name}!
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">{user?.email}</p>
                <p className="text-xs text-gray-500">User #{user?.id}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Rest of your existing dashboard content from the previous App.tsx */}
      {/* Copy the main content from your working App.tsx here */}
      {/* Financial Summary Cards, TransactionForm, BudgetOverview, etc. */}

      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center">
              <span className="text-red-500 mr-2">⚠</span>
              <span>{error}</span>
              <button
                onClick={loadUserData}
                className="ml-auto bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded text-sm"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Financial Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-green-600 text-xl">↑</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Income</p>
                <p className="text-2xl font-bold text-green-600">
                  ${totalIncome.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <span className="text-red-600 text-xl">↓</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Expenses</p>
                <p className="text-2xl font-bold text-red-600">
                  ${totalExpenses.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-blue-600 text-xl">⚖</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Net Balance</p>
                <p
                  className={`text-2xl font-bold ${
                    netBalance >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  ${netBalance.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <TransactionForm onSubmit={handleAddTransaction} />

            {/* Quick Budget Form */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h2 className="text-xl font-bold mb-4">Set Budget</h2>
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
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <input
                    name="category"
                    type="text"
                    required
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="e.g., Food"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Amount
                  </label>
                  <input
                    name="amount"
                    type="number"
                    step="0.01"
                    required
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="500.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Period
                  </label>
                  <select
                    name="period"
                    required
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="weekly">Weekly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
                <div className="md:col-span-3">
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    Set Budget
                  </button>
                </div>
              </form>
            </div>

            <TransactionList transactions={transactions} />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <BudgetOverview budgets={budgets} transactions={transactions} />
            {/* Spending Charts */}
            <SpendingChart transactions={transactions} />

            {/* Quick Stats */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h2 className="text-xl font-bold mb-4">📊 Quick Stats</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Total Transactions</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {transactions.length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Budgets</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {budgets.length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Savings Rate</p>
                  <p className="text-2xl font-bold text-green-600">
                    {totalIncome > 0
                      ? ((netBalance / totalIncome) * 100).toFixed(1)
                      : "0"}
                    %
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
