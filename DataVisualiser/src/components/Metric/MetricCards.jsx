export default function MetricCards({ data }) {
  const formatNumber = (num) => {
    if (!num && num !== 0) return "N/A";
    return new Intl.NumberFormat().format(num);
  };

  const cards = [
    {
      title: "Total Cases",
      value: formatNumber(data.cases),
      today: data.todayCases,
      color: "border-l-blue-500",
      textColor: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      title: "Total Deaths",
      value: formatNumber(data.deaths),
      today: data.todayDeaths,
      color: "border-l-red-500",
      textColor: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-50 dark:bg-red-900/20",
    },
    {
      title: "Total Recovered",
      value: formatNumber(data.recovered),
      today: null,
      color: "border-l-green-500",
      textColor: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      title: "Active Cases",
      value: formatNumber(data.active),
      today: null,
      color: "border-l-yellow-500",
      textColor: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 ${card.borderColor} ${card.color} border-gray-200 dark:border-gray-700`}
          >
            <h3 className={`text-sm font-medium ${card.textColor} mb-2`}>
              {card.title}
            </h3>
            <p className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
              {card.value}
            </p>
            {card.today !== null && card.today !== undefined && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                +{formatNumber(card.today)} today
              </p>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
