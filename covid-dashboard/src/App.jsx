import { useState, useEffect } from "react";
import MetricCards from "./components/MetricCards";
import CountrySelector from "./components/CountrySelector";
// import LoadingSpinner from "./components/LoadingSpinner";
import {
  covidApi,
  formatHistoricalData,
  formatCountryData,
} from "./services/covidApi";
import CovidLineChart from "./components/Charts/LineChart";
import CovidBarChart from "./components/Charts/BarChart";
import Header from "./components/Layout/Header";
import LoadingSpinner from "./components/Layout/LoadingSpinner";
import DebugBorder from "./components/DebugBorder";
import EmergencyMetricCards from "./components/EmergencyMetricCards";

function App() {
  const [theme, setTheme] = useState("light");
  const [selectedCountry, setSelectedCountry] = useState("worldwide");
  const [worldwideData, setWorldwideData] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [countriesData, setCountriesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async (country = "worldwide") => {
    try {
      setLoading(true);
      setError(null);

      if (country === "worldwide") {
        const [worldwide, historical, countries] = await Promise.all([
          covidApi.getWorldwide(),
          covidApi.getHistoricalAll("365"), // Last 365 days for better performance
          covidApi.getCountries(),
        ]);

        setWorldwideData(worldwide);
        setHistoricalData(formatHistoricalData(historical));
        setCountriesData(formatCountryData(countries));
      } else {
        const [countryHistorical, countries] = await Promise.all([
          covidApi.getHistoricalCountry(country, "365"),
          covidApi.getCountries(),
        ]);

        // For country-specific view, we'll use the country data from the countries list
        const countryData = countries.find(
          (c) => c.countryInfo.iso3 === country || c.country === country
        );
        setWorldwideData(countryData);
        setHistoricalData(formatHistoricalData(countryHistorical.timeline));
        setCountriesData(formatCountryData(countries));
      }
    } catch (err) {
      setError("Failed to fetch data. Please try again later.");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    fetchData(country);
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  if (loading && !worldwideData) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            Error
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => fetchData()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={
        theme === "dark"
          ? "dark bg-gray-900 min-h-screen"
          : "bg-gray-50 min-h-screen"
      }
    >
      <div className="container mx-auto px-4 py-8">
        <Header theme={theme} toggleTheme={toggleTheme} />
        <DebugBorder />

        {/* Add this right after the Header to test */}
        <div className="mb-8">
          <div className="bg-white p-6 border-l-4 border-l-blue-500 border-2 border-red-500">
            <h3 className="text-blue-600">
              TEST CARD - Blue border should be visible on left
            </h3>
            <p>
              If you see a red border, Tailwind is working but border-left isn't
            </p>
          </div>
        </div>

        {/* Country Selector */}
        <div className="mb-8">
          <CountrySelector
            selectedCountry={selectedCountry}
            onCountryChange={handleCountryChange}
            countries={countriesData}
          />
        </div>

        {loading && <LoadingSpinner />}

        {worldwideData && (
          <>
            <div className="mb-8">
              {/* <MetricCards data={worldwideData} /> */}
              <EmergencyMetricCards data={worldwideData} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                  {selectedCountry === "worldwide"
                    ? "Global"
                    : worldwideData.country}{" "}
                  COVID-19 Trends
                </h2>
                <CovidLineChart data={historicalData} />
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                  Top 10 Countries by Cases
                </h2>
                <CovidBarChart data={countriesData} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
