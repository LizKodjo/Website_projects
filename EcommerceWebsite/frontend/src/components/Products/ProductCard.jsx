import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <>
      <div className="product-card">
        <img
          src={product.image_url || "/placeholder-image.jpg"}
          alt={product.name}
        />
        <div className="product-info">
          <h3>{product.name}</h3>
          <p className="price">£{product.price}</p>
          <p className="category">{product.category}</p>
          <Link to={`/product/${product.id}`} className="view-details">
            View Details
          </Link>
        </div>
      </div>
    </>
  );
}
