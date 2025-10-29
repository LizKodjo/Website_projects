import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function CovidLineChart({ data }) {
  // Format large numbers for the Y-axis
  function formatYAxis(tickItem) {
    if (tickItem >= 1000000) {
      return `${(tickItem / 1000000).toFixed(0)}M`;
    }
    if (tickItem >= 1000) {
      return `${(tickItem / 1000).toFixed(0)}K`;
    }
    return tickItem;
  }

  //   Custom tooltip
  function CustomTooltip({ active, payload, label }) {
    if (active && payload && payload.length) {
      return (
        <>
          <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
            <p className="text-gray-900 dark:text-white font-semibold">
              {label}
            </p>
            {payload.map((entry, index) => (
              <p key={index} style={{ color: entry.color }}>
                {entry.name}: {new Intl.NumberFormat().format(entry.value)}
              </p>
            ))}
          </div>
        </>
      );
    }
    return null;
  }

  return (
    <>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
            interval="preserveStartEnd"
          />
          <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="cases"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            name="Total Cases"
          />
          <Line
            type="monotone"
            dataKey="deaths"
            stroke="#ef4444"
            strokeWidth={2}
            dot={false}
            name="Total Deaths"
          />
          <Line
            type="monotone"
            dataKey="recovered"
            stroke="#10b981"
            strokeWidth={2}
            dot={false}
            name="Total Recovered"
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}
