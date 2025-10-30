import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function CovidBarChart({ data }) {
  function formatYAxis(tickItem) {
    if (tickItem >= 1000000) {
      return `${(tickItem / 1000000).toFixed(0)}M`;
    }
    if (tickItem >= 1000) {
      return `${(tickItem / 1000).toFixed(0)}K`;
    }
    return tickItem;
  }
  function CustomTooltip({ active, payload, label }) {
    if (active && payload && payload.length) {
      return (
        <>
          <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
            <p className="text-gray-900 dark:text-white font-semibold">
              {label}
            </p>
            <p className="text-blue-600">
              Cases: {new Intl.NumberFormat().format(payload[0].value)}
            </p>
            <p className="text-red-600">
              Deaths: {new Intl.NumberFormat().format(payload[1].value)}
            </p>
          </div>
        </>
      );
    }
    return null;
  }

  return (
    <>
      <div id="bar-chart">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="cases"
              fill="#3b82f6"
              name="Total Cases"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="deaths"
              fill="#ef4444"
              name="Total Deaths"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
