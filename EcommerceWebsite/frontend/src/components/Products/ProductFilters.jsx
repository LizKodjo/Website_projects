import { useState } from "react";

export default function ProductFilters({
  categories,
  currentCategory,
  filters,
  onFilterChange,
}) {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = { minPrice: "", maxPrice: "", search: "" };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <>
      <div className="product-filters">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Search products..."
            value={localFilters.search || ""}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-group">
          <input
            type="number"
            placeholder="Min price"
            value={localFilters.minPrice || ""}
            onChange={(e) => handleFilterChange("minPrice", e.target.value)}
            className="price-input"
          />
          <input
            type="number"
            placeholder="Max price"
            value={localFilters.maxPrice || ""}
            onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
            className="price-input"
          />
        </div>

        <button onClick={clearFilters} className="clear-filters">
          Clear Filters
        </button>
      </div>
    </>
  );
}
