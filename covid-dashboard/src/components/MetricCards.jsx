export default function MetricCards({ data }) {
  const formatNumber = (num) => {
    if (!num && num !== 0) return "N/A";
    return new Intl.NumberFormat().format(num);
  };

  const cards = [
    {
      title: "Total Cases",
      value: data.cases,
      today: data.todayCases,
      color: "#3b82f6",
      borderClass: "border-l-blue-500",
      textClass: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Total Deaths",
      value: data.deaths,
      today: data.todayDeaths,
      color: "#ef4444",
      borderClass: "border-l-red-500",
      textClass: "text-red-600 dark:text-red-400",
    },
    {
      title: "Total Recovered",
      value: data.recovered,
      today: null,
      color: "#10b981",
      borderClass: "border-l-green-500",
      textClass: "text-green-600 dark:text-green-400",
    },
    {
      title: "Active Cases",
      value: data.active,
      today: null,
      color: "#eab308",
      borderClass: "border-l-yellow-500",
      textClass: "text-yellow-600 dark:text-yellow-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 ${card.borderClass}`}
          style={{ borderLeft: `4px solid ${card.color}` }}
        >
          <h3 className={`text-sm font-medium mb-2 ${card.textClass}`}>
            {card.title}
          </h3>
          <p className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
            {formatNumber(card.value)}
          </p>
          {card.today > 0 && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              +{formatNumber(card.today)} today
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
