import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/Product/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("/api/v1/products").then((res) => setProducts(res.data));
  }, []);

  return (
    <>
      <div className="grid">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </>
  );
}
