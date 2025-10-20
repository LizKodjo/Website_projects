import type { FC } from "react";
import type { Transaction } from "../../types";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface SpendingChartProps {
  transactions: Transaction[];
}

const SpendingChart: FC<SpendingChartProps> = ({ transactions }) => {
  // Calculate category spending
  const categorySpending = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, transaction) => {
      const category = transaction.category || "Uncategorised";
      acc[category] = (acc[category] || 0) + transaction.amount;
      return acc;
    }, {} as Record<string, number>);

  // Prepare data for doughnut chart
  const doughnutData = {
    labels: Object.keys(categorySpending),
    datasets: [
      {
        data: Object.values(categorySpending),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#FF6384",
          "#C9CBCF",
        ],
        borderWidth: 2,
        borderColor: "#FFF",
      },
    ],
  };

  // Prepare data for monthly spending bar chart
  const monthlySpending = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, transaction) => {
      const month = new Date(transaction.date).toLocaleDateString("en-UK", {
        month: "short",
        year: "numeric",
      });

      acc[month] = (acc[month] || 0) + transaction.amount;
      return acc;
    }, {} as Record<string, number>);

  const barData = {
    labels: Object.keys(monthlySpending),
    datasets: [
      {
        label: "Monthly Spending",
        data: Object.values(monthlySpending),
        backgroundColor: "#3B82F6",
        borderColor: "#1D4ED8",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      title: {
        display: true,
        text: "Spending Overview",
      },
    },
  };

  const doughnutOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        display: true,
        text: "Spending by Category",
      },
    },
  };

  const barOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        display: true,
        text: "Monthly Spending Trend",
      },
    },
  };

  if (transactions.filter((t) => t.type === "expense").length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h2 className="text-xl font-bold mb-4">📊 Spending Analytics</h2>
        <div className="text-center py-8 text-gray-500">
          <p>No spending data yet.</p>
          <p className="text-sm">Add some expenses to see charts here!</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h2 className="text-xl font-bold mb-4">📊 Speding Analytics</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category spending doughnut chart */}
          <div>
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>

          {/* Monthly Spending Bar charg */}
          <div>
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

        {/* Spending Summary */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Total Categories</p>
            <p className="text-lg font-bold text-blue-600">
              {Object.keys(categorySpending).length}
            </p>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <p className="text-sm text-gray-600">Total Spending</p>
            <p className="text-lg font-bold text-red-600">
              {Object.keys(categorySpending).length}
            </p>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <p className="text-sm text-gray-600">Total Spending</p>
            <p className="text-lg font-bold text-red-600">
              £
              {Object.values(categorySpending)
                .reduce((a, b) => a + b, 0)
                .toFixed(2)}
            </p>
          </div>

          <div className="text-center p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600">Largest Category</p>
            <p className="text-lg font-bold text-green-600">
              {Object.keys(categorySpending).length > 0
                ? Object.entries(categorySpending).sort(
                    (a, b) => b[1] - a[1]
                  )[0][0]
                : "N/A"}
            </p>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-600">Avg. per Category</p>
            <p className="text-lg font-bold text-purple-600">
              £
              {Object.keys(categorySpending).length > 0
                ? (
                    Object.values(categorySpending).reduce((a, b) => a + b, 0) /
                    Object.keys(categorySpending).length
                  ).toFixed(2)
                : "0.00"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SpendingChart;
