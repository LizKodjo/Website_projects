import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <>
      <div className="product-card">
        <div className="product-image">
          <img
            src={product.image_url || "/placeholder-image.jpg"}
            alt={product.name}
            onError={(e) => {
              e.target.src = "/placeholder-image.jpg";
            }}
          />
        </div>
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-description">
            {product.description?.substring(0, 100)}
            {product.description?.length > 100 ? "..." : ""}
          </p>
          <div className="product-price">£{product.price}</div>
          <div className="product-category">{product.category}</div>
          <div className="product-stock">
            {product.stock_quantity > 0
              ? `${product.stock_quantity} in stock`
              : "Out of stock"}
          </div>
          <div className="product-actions">
            <button className="add-to-cart-btn">Add to Cart</button>
            <Link to={`/product/${product.id}`} className="view-details-btn">
              View Details
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
