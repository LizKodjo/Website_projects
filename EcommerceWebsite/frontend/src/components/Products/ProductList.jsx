import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ProductContext } from "../context/ProductContext";
import ProductCard from "./ProductCard";

export default function ProductList() {
  const { products, loading, error, fetchProducts } =
    useContext(ProductContext);
  const { category } = useParams();

  useEffect(() => {
    fetchProducts(category);
  }, [category]);

  if (loading) return <p className="loading">Loading products...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <>
      <div className="product-list">
        <h1>{category ? `${category} Products` : "All Products"}</h1>
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </>
  );
}
