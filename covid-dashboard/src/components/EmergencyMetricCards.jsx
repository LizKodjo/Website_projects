import React from "react";

const EmergencyMetricCards = ({ data, theme }) => {
  const formatNumber = (num) => {
    if (!num && num !== 0) return "N/A";
    return new Intl.NumberFormat().format(num);
  };

  const cardStyle = {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "1.5rem",
    marginBottom: "2rem",
  };

  const containerStyle = {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "0 1rem",
  };

  const isDark = theme === "dark";

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "1.5rem",
          }}
        >
          {/* Cases Card */}
          <div
            style={{
              backgroundColor: isDark ? "#1f2937" : "white",
              borderRadius: "0.5rem",
              padding: "1.5rem",
              borderLeft: "4px solid #3b82f6",
              border: "1px solid " + (isDark ? "#374151" : "#e5e7eb"),
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h3
              style={{
                fontSize: "0.875rem",
                fontWeight: "500",
                marginBottom: "0.5rem",
                color: isDark ? "#60a5fa" : "#2563eb",
              }}
            >
              Total Cases
            </h3>
            <p
              style={{
                fontSize: "1.5rem",
                fontWeight: "700",
                marginBottom: "0.25rem",
                color: isDark ? "white" : "#1f2937",
              }}
            >
              {formatNumber(data.cases)}
            </p>
            {data.todayCases > 0 && (
              <p
                style={{
                  fontSize: "0.875rem",
                  color: isDark ? "#d1d5db" : "#4b5563",
                }}
              >
                +{formatNumber(data.todayCases)} today
              </p>
            )}
          </div>

          {/* Add other cards similarly */}
        </div>
      </div>
    </div>
  );
};

export default EmergencyMetricCards;
