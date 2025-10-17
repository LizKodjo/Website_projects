import { useEffect, useState, type FC } from "react";
import "./App.css";
import { type Budget, type Transaction } from "./types";
import { budgetAPI, transactionAPI, healthCheck } from "./utils/api";
import TransactionForm from "./components/Transaction/TransactionForm";
import TransactionList from "./components/Transaction/TransactionList";
import BudgetOverview from "./components/Budget/BudgetOverview";

const App: FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [userId] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [backendStatus, setBackendStatus] = useState<
    "checking" | "healthy" | "unhealthy"
  >("checking");

  useEffect(() => {
    checkBackendAndLoadData();
  }, []);

  const checkBackendAndLoadData = async () => {
    try {
      setBackendStatus("checking");
      console.log("🔄 Starting backend health check...");

      const health = await healthCheck();

      if (health.status === "healthy") {
        console.log("✅ Backend is healthy, loading data...");
        setBackendStatus("healthy");
        await initializeData();
      } else {
        console.error("❌ Backend health check failed:", health.error);
        setBackendStatus("unhealthy");
        setError(
          `Backend connection failed: ${health.details || health.error}`
        );
      }
    } catch (err) {
      console.error("💥 Unexpected error during health check:", err);
      setBackendStatus("unhealthy");
      setError(
        "Unexpected error during backend connection. Check console for details."
      );
    } finally {
      setLoading(false);
    }
  };

  const initializeData = async () => {
    try {
      // For demo purposes, let's create some sample data if none exists
      await Promise.all([fetchTransactions(), fetchBudgets()]);

      // If no data exists, create sample data
      if (transactions.length === 0 && budgets.length === 0) {
        await createSampleData();
      }

      setError(null);
    } catch (err) {
      console.error("Data initialization error:", err);
      setError(
        "Failed to load data. You can still try adding new transactions."
      );
    }
  };

  const createSampleData = async () => {
    try {
      // Create sample budgets
      await budgetAPI.create(
        { category: "Food", amount: 500, period: "monthly" },
        userId
      );
      await budgetAPI.create(
        { category: "Entertainment", amount: 200, period: "monthly" },
        userId
      );
      await budgetAPI.create(
        { category: "Transport", amount: 150, period: "monthly" },
        userId
      );

      // Create sample transactions
      await transactionAPI.create(
        {
          amount: 45.5,
          description: "Groceries",
          category: "Food",
          type: "expense",
        },
        userId
      );

      await transactionAPI.create(
        {
          amount: 2000,
          description: "Salary",
          category: "Income",
          type: "income",
        },
        userId
      );

      await transactionAPI.create(
        {
          amount: 25,
          description: "Movie tickets",
          category: "Entertainment",
          type: "expense",
        },
        userId
      );

      // Reload data
      await fetchTransactions();
      await fetchBudgets();
    } catch (err) {
      console.error("Error creating sample data:", err);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await transactionAPI.getAll(userId);
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      // Don't throw error here - we want to continue even if transactions fail
    }
  };

  const fetchBudgets = async () => {
    try {
      const response = await budgetAPI.getAll(userId);
      setBudgets(response.data);
    } catch (error) {
      console.error("Error fetching budgets:", error);
      // Don't throw error here - we want to continue even if budgets fail
    }
  };

  const handleAddTransaction = async (transactionData: any) => {
    try {
      await transactionAPI.create(transactionData, userId);
      await fetchTransactions();
    } catch (error) {
      console.error("Error adding transaction:", error);
      setError("Failed to add transaction. Please try again.");
    }
  };

  const handleAddBudget = async (budgetData: any) => {
    try {
      await budgetAPI.create(budgetData, userId);
      await fetchBudgets();
    } catch (error) {
      console.error("Error adding budget:", error);
      setError("Failed to add budget. Please try again.");
    }
  };

  const retryConnection = () => {
    setLoading(true);
    setError(null);
    checkBackendAndLoadData();
  };

  // Show connection error state
  if (backendStatus === "unhealthy") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🔌</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Backend Connection Required
          </h1>
          <p className="text-gray-600 mb-6">
            The BudgetTracker frontend is running, but it cannot connect to the
            backend server.
          </p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-yellow-800 mb-2">To fix this:</h3>
            <ol className="list-decimal list-inside text-yellow-700 text-sm space-y-1">
              <li>Open a new terminal window</li>
              <li>
                Navigate to the{" "}
                <code className="bg-yellow-100 px-1 rounded">backend</code>{" "}
                folder
              </li>
              <li>
                Run:{" "}
                <code className="bg-yellow-100 px-1 rounded">
                  python run.py
                </code>
              </li>
              <li>Wait for "Application startup complete" message</li>
              <li>Click Retry below</li>
            </ol>
          </div>

          <div className="space-y-3">
            <button
              onClick={retryConnection}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              🔄 Retry Connection
            </button>
            <button
              onClick={() => window.open("http://localhost:8000", "_blank")}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              🌐 Check Backend Directly
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading Budget Tracker...</p>
          <p className="text-sm text-gray-500 mt-2">
            Connecting to backend server
          </p>
        </div>
      </div>
    );
  }

  // Calculate financial summary
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const netBalance = totalIncome - totalExpenses;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                💰 BudgetTracker
              </h1>
              <p className="text-gray-600 mt-1">
                Take control of your finances
              </p>
            </div>
            <div className="text-right">
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  backendStatus === "healthy"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full mr-2 ${
                    backendStatus === "healthy"
                      ? "bg-green-500"
                      : "bg-yellow-500"
                  }`}
                ></span>
                Backend {backendStatus}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center">
              <span className="text-red-500 mr-2">⚠</span>
              <span>{error}</span>
              <button
                onClick={retryConnection}
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

        {/* Demo Data Notice */}
        {transactions.length === 0 && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center">
              <span className="text-blue-500 mr-2">💡</span>
              <span>
                No data found. Sample data will be created when you add your
                first transaction or budget.
              </span>
            </div>
          </div>
        )}

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

export default App;
