import { useState } from "react";
import { exportService } from "../../services/exportService";

export default function ExportControls({
  historicalData,
  countriesData,
  selectedCountry,
  worldwideData,
}) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async (type, format) => {
    setExporting(true);

    try {
      const filename = `covid-${
        selectedCountry === "worldwide"
          ? "global"
          : selectedCountry.toLowerCase()
      }`;

      switch (type) {
        case "historical":
          const historicalExport =
            exportService.formatHistoricalForExport(historicalData);
          if (format === "csv") {
            exportService.exportToCSV(
              historicalExport,
              `${filename}-historical`
            );
          } else {
            exportService.exportToExcel(
              historicalExport,
              `${filename}-historical`
            );
          }
          break;

        case "countries":
          const countriesExport =
            exportService.formatCountriesForExport(countriesData);
          if (format === "csv") {
            exportService.exportToCSV(countriesExport, `${filename}-countries`);
          } else {
            exportService.exportToExcel(
              countriesExport,
              `${filename}-countries`
            );
          }
          break;

        case "summary":
          const summaryData = [
            {
              Location:
                selectedCountry === "worldwide"
                  ? "Global"
                  : worldwideData?.country,
              "Total Cases": worldwideData?.cases,
              "Total Deaths": worldwideData?.deaths,
              "Total Recovered": worldwideData?.recovered,
              "Active Cases": worldwideData?.active,
              "Cases Today": worldwideData?.todayCases,
              "Deaths Today": worldwideData?.todayDeaths,
              "Last Updated": new Date().toLocaleDateString(),
            },
          ];

          if (format === "csv") {
            exportService.exportToCSV(summaryData, `${filename}-summary`);
          } else {
            exportService.exportToExcel(summaryData, `${filename}-summary`);
          }
          break;

        case "chart-line":
          await exportService.exportChartAsPNG(
            "line-chart",
            `${filename}-trends`
          );
          break;

        case "chart-bar":
          await exportService.exportChartAsPNG(
            "bar-chart",
            `${filename}-comparison`
          );
          break;

        default:
          break;
      }
    } catch (error) {
      console.error("Export failed: ", error);
      alert("Export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Export Data
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Download data in multiple formats for analysis
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Data Export Buttons */}
            <div className="dropdown relative">
              <button
                disabled={exporting}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {exporting ? "Exporting..." : "📊 Export Data"}
              </button>
              <div className="dropdown-menu absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 z-10 opacity-0 invisible transition-all duration-200 transform scale-95 group-hover:opacity-100 group-hover:visible group-hover:scale-100">
                <div className="p-2">
                  <button
                    onClick={() => handleExport("historical", "csv")}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md flex items-center gap-2"
                  >
                    📈 Historical Data (CSV)
                  </button>
                  <button
                    onClick={() => handleExport("historical", "excel")}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md flex items-center gap-2"
                  >
                    📈 Historical Data (Excel)
                  </button>
                  <button
                    onClick={() => handleExport("countries", "csv")}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md flex items-center gap-2"
                  >
                    🌍 Country Comparison (CSV)
                  </button>
                  <button
                    onClick={() => handleExport("countries", "excel")}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md flex items-center gap-2"
                  >
                    🌍 Country Comparison (Excel)
                  </button>
                  <button
                    onClick={() => handleExport("summary", "csv")}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md flex items-center gap-2"
                  >
                    📝 Current Summary (CSV)
                  </button>
                </div>
              </div>
            </div>
            {/* Chart Export Buttons */}
            <div className="dropdown relative">
              <button
                disabled={exporting}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {exporting ? "Exporting..." : "📸 Export Charts"}
              </button>
              <div className="dropdown-menu absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 z-10 opacity-0 invisible transition-all duration-200">
                <div className="p-2">
                  <button
                    onClick={() => handleExport("chart-line", "png")}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md flex items-center gap-2"
                  >
                    📈 Trends Chart (PNG)
                  </button>
                  <button
                    onClick={() => handleExport("chart-bar", "png")}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md flex items-center gap-2"
                  >
                    📊 Comparison Chart(PNG)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {historicalData.length}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Data Points
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {countriesData.length}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Countries
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              3
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Formats
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              2
            </div>

            <div className="text-xs text-gray-600 dark:text-gray-400">
              Chart Types
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
