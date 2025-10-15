const BASE_URL = "https://disease.sh/v3/covid-19";

export const covidApi = {
  // Get worldwide data
  getWorldwide: async () => {
    const response = await fetch(`${BASE_URL}/all`);
    return response.json();
  },

  // Get historical data for worldwide
  getHistoricalAll: async (lastdays = "all") => {
    const response = await fetch(
      `${BASE_URL}/historical/all?lastdays=${lastdays}`
    );
    return response.json();
  },

  // Get country data
  getCountries: async () => {
    const response = await fetch(`${BASE_URL}/countries`);
    return response.json();
  },

  // Get historical data for specific country
  getHistoricalCountry: async (country, lastdays = "all") => {
    const response = await fetch(
      `${BASE_URL}/historical/${country}?lastdays=${lastdays}`
    );
    return response.json();
  },
};

// Helper function to format historical data for charts
export const formatHistoricalData = (historical) => {
  if (!historical || !historical.cases) return [];

  const cases = historical.cases;
  const deaths = historical.deaths || {};
  const recovered = historical.recovered || {};

  return Object.keys(cases).map((date) => ({
    date: new Date(date).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    }),
    timestamp: date,
    cases: cases[date],
    deaths: deaths[date] || 0,
    recovered: recovered[date] || 0,
  }));
};

// Helper to format country data for bar chart
export const formatCountryData = (countries) => {
  return countries
    .sort((a, b) => b.cases - a.cases)
    .slice(0, 10)
    .map((country) => ({
      name: country.country,
      cases: country.cases,
      deaths: country.deaths,
      recovered: country.recovered,
      active: country.active,
      todayCases: country.todayCases,
      todayDeaths: country.todayDeaths,
    }));
};
