export const mockData = {
  worldwide: {
    cases: 687042861,
    deaths: 6869259,
    recovered: 660419413,
    todayCases: 125842,
    todayDeaths: 342,
  },
  historical: {
    cases: {
      "1/22/20": 557,
      "1/23/20": 657,
      "1/24/20": 941,
      // ... we'll add more dates for the chart
      "1/1/23": 661093410,
      "1/2/23": 661219252,
    },
    deaths: {
      "1/22/20": 17,
      "1/23/20": 18,
      "1/24/20": 26,
      // ...
      "1/1/23": 6686543,
      "1/2/23": 6686885,
    },
    recovered: {
      "1/22/20": 30,
      "1/23/20": 30,
      "1/24/20": 36,
      // ...
      "1/1/23": 636182314,
      "1/2/23": 636306839,
    },
  },
  countries: [
    { name: "USA", cases: 102648270, deaths: 1113938 },
    { name: "India", cases: 44682763, deaths: 530707 },
    { name: "France", cases: 39861751, deaths: 166093 },
    { name: "Germany", cases: 38106678, deaths: 174979 },
    { name: "Brazil", cases: 37043172, deaths: 699276 },
    { name: "Japan", cases: 33205663, deaths: 73014 },
    { name: "S. Korea", cases: 31548083, deaths: 34657 },
    { name: "Italy", cases: 25585758, deaths: 190708 },
    { name: "UK", cases: 24614771, deaths: 220288 },
    { name: "Russia", cases: 22946824, deaths: 398919 },
  ],
};

// Helper function to format the historical data for Recharts
export const formatHistoricalData = (historical) => {
  const cases = historical.cases;
  const deaths = historical.deaths;
  const recovered = historical.recovered;

  return Object.keys(cases).map((date) => ({
    date,
    cases: cases[date],
    deaths: deaths[date],
    recovered: recovered[date],
  }));
};
