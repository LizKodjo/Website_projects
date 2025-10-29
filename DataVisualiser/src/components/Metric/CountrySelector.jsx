import { useEffect, useState } from "react";
import { covidApi } from "../../services/covidApi";

export default function CountrySelector({
  selectedCountry,
  onCountryChange,
  countries,
}) {
  const [allCountries, setAllCountries] = useState([]);

  useEffect(() => {
    const fetchAllCountries = async () => {
      try {
        const countries = await covidApi.getCountries();
        setAllCountries(countries);
      } catch (error) {
        console.error("Error fetching countries: ", error);
      }
    };

    fetchAllCountries();
  }, []);

  const popularCountries = [
    { value: "worldwide", label: "🌍 Worldwide" },
    { value: "USA", label: "🇺🇸 United States" },
    { value: "India", label: "🇮🇳 India" },
    { value: "Brazil", label: "🇧🇷 Brazil" },
    { value: "UK", label: "🇬🇧 United Kingdom" },
    { value: "Germany", label: "🇩🇪 Germany" },
    { value: "France", label: "🇫🇷 France" },
    { value: "Japan", label: "🇯🇵 Japan" },
  ];

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex gap-2 flex-wrap">
          {popularCountries.map((country, index) => (
            <button
              key={index}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCountry === country.value
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }

            `}
            >
              {country.label}
            </button>
          ))}
        </div>

        <select
          value={selectedCountry}
          onChange={(e) => onCountryChange(e.target.value)}
          className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="worldwide">All Countries...</option>
          {allCountries.map((country) => (
            <option
              key={country.countryInfo._id || country.country}
              value={country.country}
            >
              {country.country}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
