import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ProductContext } from "../../contexts/ProductContext";
import ProductCard from "./ProductCard";
import ProductFilters from "./ProductFilters";

export default function ProductList() {
  const {
    products,
    loading,
    error,
    fetchProducts,
    categories,
    fetchCategories,
  } = useContext(ProductContext);
  const { category } = useParams();
  const [filters, setFilters] = useState({ minPrice: "", maxPrice: "" });

  useEffect(() => {
    fetchProducts(category, filters);
    fetchCategories();
  }, [category, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  if (loading) return <p className="loading">Loading products...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <>
      <div className="product-list">
        <h1>{category ? `${category} Products` : "All Products"}</h1>

        <ProductFilters
          categories={categories}
          currentCategory={category}
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        <div className="products-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {products.length == 0 && !loading && (
          <div className="no-products">No products found</div>
        )}
      </div>
    </>
  );
}
