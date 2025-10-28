import { useEffect, useState } from "react";

import "./App.css";
import { formatHistoricalData, mockData } from "./data/mockData";
import Header from "./components/Layout/Header";
import MetricCards from "./components/Metric/MetricCards";
import CovidLineChart from "./components/Charts/LineChart";
import CovidBarChart from "./components/Charts/BarChart";
import { covidApi, formatCountryData } from "./services/covidApi";
import CountrySelector from "./components/Metric/CountrySelector";
import LoadingSpinner from "./components/Layout/LoadingSpinner";
import WorldMap from "./components/Charts/WorldMap";

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
          covidApi.getHistoricalAll("365"), // Last 365 days
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

        // For country specific view
        const countryData = countries.find(
          (c) => c.countryInfo.iso3 === country || c.country === country
        );
        setWorldwideData(countryData);
        setHistoricalData(formatHistoricalData(countryHistorical.timeline));
        setCountriesData(formatCountryData(countries));
      }
    } catch (err) {
      setError("Failed to fetch data.  Please try again later.");
      console.error("Error fetching data: ", err);
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

  const handleMapCountryClick = (countryName) => {
    setSelectedCountry(countryName);
    fetchData(countryName);
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  if (loading && !worldwideData) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <>
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
      </>
    );
  }

  return (
    <>
      <div
        className={
          theme === "dark"
            ? "dark bg-gray-900 min-h-screen"
            : "bg-gray-50 min-h-screen"
        }
      >
        <div className="container mx-auto px-4 py-8">
          <Header theme={theme} toggleTheme={toggleTheme} />

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
                <MetricCards data={worldwideData} />
              </div>

              {/* Charts and Map Grid */}

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
                    Top 10 Countries by Case
                  </h2>
                  <CovidBarChart data={countriesData} />
                </div>
              </div>

              {/* Full Width Map */}
              <div className="mb-8">
                <WorldMap
                  countriesData={countriesData}
                  onCountryClick={handleMapCountryClick}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
