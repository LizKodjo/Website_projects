import { utils, writeFile } from "xlsx";

export const exportService = {
  // Export data as CSV
  exportToCSV: (data, filename = "covid-data") => {
    if (!data || data.length === 0) return;
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header];
            // Handle values that might contain commas
            return typeof value === "string" && value.includes(",")
              ? `"${value}"`
              : value;
          })
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${filename}-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  // Export data as Excel
  exportToExcel: (data, filename = "covid-data") => {
    if (!data || data.length === 0) return;

    const worksheet = utils.json_to_sheet(data);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "COVID-19 Data");

    writeFile(
      workbook,
      `${filename}-${new Date().toISOString().split("T")[0]}.xlsx`
    );
  },

  // Export chart as PNG
  exportChartAsPNG: (chartId, filename = "chart") => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const chartElement = document.querySelector(`#${chartId} svg`);
        if (!chartElement) {
          console.error("Chart element not found.");
          resolve(false);
          return;
        }

        const svgData = new XMLSerializer().serializeToString(chartElement);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        const svgBlob = new Blob([svgData], {
          type: "image/svg+xml;charset=utf-8",
        });
        const url = URL.createObjectURL(svgBlob);

        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          canvas.toBlob((blob) => {
            const link = document.createElement("a");
            link.download = `${filename}-${
              new Date().toISOString().split("T")[0]
            }.png`;
            link.href = URL.createObjectURL(blob);
            link.click();
            URL.revokeObjectURL(url);
            resolve(true);
          });
        };
        img.src = url;
      }, 100);
    });
  },

  // Format historical data for export
  formatHistoricalForExport: (historicalData) => {
    return historicalData.map((item) => ({
      Date: item.date,
      "Total Cases": item.cases,
      "Total Deaths": item.deaths,
      "Total Recovered": item.recovered,
      "Active Cases": item.cases - item.deaths - item.recovered,
    }));
  },
  // Format country data for export
  formatCountriesForExport: (countriesData) => {
    return countriesData.map((country) => ({
      Country: country.name,
      "Total Cases": country.cases,
      "Total Deaths": country.deaths,
      "Total Recovered": country.recovered,
      "Active Cases": country.active,
      "Cases Today": country.todayCases || 0,
      "Deaths Today": country.todayDeaths || 0,
    }));
  },
};
