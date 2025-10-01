import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    axios
      .get("/api/v1/products", {
        params: { search, category },
      })
      .then((res) => setProducts(res.data));
  }, [search, category]);

  return (
    <>
      <div className="container">
        <h2 className="text-center">Shop All</h2>
        <input
          type="text"
          placeholder="Search products"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Category</option>
          <option value="skincare">Skincare</option>
          <option value="accessories">Accessories</option>
          <option value="stationery">Stationery</option>
        </select>
        <div className="grid-responsive mt-lg">
          {Array.isArray(products) ? (
            products.map((product) => (
              <Link
                to={`/product/${product.id}`}
                key={product.id}
                className="shadowed rounded"
              >
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="img-fluid img-rounded"
                />
                <h3>{product.name}</h3>
                <p>£{product.price.toFixed(2)}</p>
              </Link>
            ))
          ) : (
            <p>No products found.</p>
          )}
        </div>
      </div>
    </>
  );
}
