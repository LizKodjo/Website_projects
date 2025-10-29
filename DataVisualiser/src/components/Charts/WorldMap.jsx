import { scaleLinear } from "d3-scale";
import { useEffect, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";

export default function WorldMap({ countriesData, onCountryClick }) {
  const [mapData, setMapData] = useState([]);
  const [tooltip, setTooltip] = useState(null);

  // GeoJSON URL for world countries
  const geoUrl =
    "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

  // Collor for cases
  const colorScale = scaleLinear()
    .domain([0, 100000, 1000000, 10000000, 50000000])
    .range(["#e5f5e0", "#a1d99b", "#31a354", "#006d2c", "#00441b"]);

  useEffect(() => {
    if (countriesData && countriesData.length > 0) {
      setMapData(countriesData);
    }
  }, [countriesData]);

  const getCountryColor = (countryName) => {
    const country = mapData.find(
      (c) =>
        c.name?.toLowerCase() === countryName?.toLowerCase() ||
        c.country?.toLowerCase() === countryName?.toLowerCase()
    );

    if (!country || !country.cases) return "#e5e5e5";
    return colorScale(country.cases);
  };

  const getCountryCases = (countryName) => {
    const country = mapData.find(
      (c) =>
        c.name?.toLowerCase() === countryName?.toLowerCase() ||
        c.country?.toLowerCase() === countryName?.toLowerCase()
    );
    return country ? country.cases : 0;
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          Global COVID-19 Cases Map
        </h2>

        {/* Legend */}
        <div className="flex items-center justify-between mb-4 text-sm">
          <div className="flex items-center spacd-x-2">
            <span className="text-gray-600 dark:text-gray-300">
              Fewer cases
            </span>
            {[0, 100000, 1000000, 10000000, 50000000].map((value, index) => (
              <div
                key={value}
                className="w-4 h-4"
                style={{ backgroundColor: colorScale(value) }}
              />
            ))}
            <span className="text-gray-600 dark:text-gray-300">More cases</span>
          </div>
        </div>

        {/* Map Container */}
        <div className="relative border border-gray-200 dark:border-gray-700 rounded-lg">
          <ComposableMap
            projectionConfig={{ scale: 130, rotation: [-10, 0, 0] }}
            height={400}
          >
            <ZoomableGroup center={[0, 20]} zoom={1}>
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const countryName = geo.properties.name;
                    const cases = getCountryCases(countryName);

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={getCountryColor(countryName)}
                        stroke="#ffffff"
                        strokeWidth={0.5}
                        style={{
                          default: { outline: "none", cursor: "pointer" },
                          hover: {
                            fill: "#4f46e5",
                            outline: "none",
                            cursor: "pointer",
                          },
                          pressed: { fill: "#3730a3", outline: "none" },
                        }}
                        onMouseEnter={() => {
                          setTooltip({
                            country: countryName,
                            cases: cases,
                            x: 0,
                            y: 0,
                          });
                        }}
                        onMouseMove={(event) => {
                          setTooltip((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  x: event.clientX,
                                  y: event.clientY,
                                }
                              : null
                          );
                        }}
                        onMouseLeave={() => {
                          setTooltip(null);
                        }}
                        onClick={() => {
                          if (onCountryClick && cases > 0) {
                            onCountryClick(countryName);
                          }
                        }}
                      />
                    );
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>

          {/* Tooltip */}

          {tooltip && (
            <div
              className="absolute bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-3 pointer-events-none z-10"
              style={{
                left: tooltip.x + 10,
                top: tooltip.y - 10,
                transform: "translateY(-100%",
              }}
            >
              <div className="text-sm font-semibold text-gray-800 dark:text-white">
                {tooltip.country}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-300">
                Cases: {new Intl.NumberFormat().format(tooltip.cases)}
              </div>
            </div>
          )}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 text-center">
          Click on a country to view its detailed data
        </p>
      </div>
    </>
  );
}
