import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../services/CartContext";

export default function ProductDetail() {
  const { addToCart } = useCart();
  const { productId } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios
      .get(`/api/v1/products/${productId}`)
      .then((res) => setProduct(res.data));
  }, [productId]);

  if (!product) return <p>Loading...</p>;

  return (
    <>
      <div className="container">
        <img
          src={product.image_url}
          alt={product.name}
          className="img-fluid img-rounded"
        />
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <p>£{product.price.toFixed(2)}</p>
        <button onClick={() => addToCart(product)}>Add to Cart</button>
      </div>
    </>
  );
}
