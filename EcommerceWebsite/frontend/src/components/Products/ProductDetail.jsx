import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { productService } from "../../services/api";
import { useCart } from "../../contexts/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await productService.getProduct(id);
        setProduct(response.data);
      } catch (err) {
        setError("Product not found");
        console.error("Error fetching product: ", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    alert(`${quantity} ${product.name} added to cart!`);
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (product?.stock_quantity || 1)) {
      setQuantity(newQuantity);
    }
  };

  if (loading)
    return (
      <div className="product-detail-loading">
        <div className="loading-spinner"></div>
        <p>Loading product...</p>
      </div>
    );

  if (error)
    return (
      <div className="product-detail-error">
        <h2>Product Not Found</h2>
        <p>{error}</p>
        <button className="back-to-home" onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    );

  if (!product)
    return (
      <div className="product-detail-error">
        <h2>Product Not Found</h2>
        <button className="back-to-home" onClick={() => navigate("/")}>
          Back To Home
        </button>
      </div>
    );

  return (
    <>
      <div className="product-detail">
        {/* Breadcrumb Navigtion */}
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          <span>&gt;</span>
          <Link to={`/category/${product.category}`}>
            {product.category}
          </Link>{" "}
          <span>&gt;</span>
          <span>{product.name}</span>
        </nav>

        <div className="product-detail-content">
          {/* Product Image */}
          <div className="product-image-section">
            <div className="main-image">
              <img
                src={product.image_url || "/placeholder-image.jpg"}
                alt={product.name}
                onError={(e) => {
                  e.target.src =
                    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5OTkiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk5vIEltYWdlIEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=";
                }}
              />
            </div>
          </div>

          {/* Product Information */}

          <div className="product-info-section">
            <h1 className="product-title">{product.name}</h1>

            <div className="product-price">£{product.price}</div>

            <div className="product-meta">
              <span
                className={`stock-status ${
                  product.stock_quantity > 0 ? "in-stock" : "out-of-stock"
                }`}
              >
                {product.stock_quantity > 0
                  ? `In Stock (${product.stock_quantity} available)`
                  : "Out of Stock"}
              </span>
              <span className="product-category">
                Category: {product.category}
              </span>
            </div>

            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>

            {/* Add to Cart Section */}
            {product.stock_quantity > 0 && (
              <div className="add-to-cart-section">
                <div className="quantity-selector">
                  <label>Quantity:</label>
                  <div className="quantity-controls">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="quantity-btn"
                    >
                      -
                    </button>
                    <span className="quantity-display">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stock_quantity}
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="add-to-cart-btn large"
                >
                  Add to Cart - £{(product.price * quantity).toFixed(2)}
                </button>
              </div>
            )}

            {/* Product Features */}
            <div className="product-features">
              <h3>Features</h3>
              <ul>
                <li>Free shipping on orders over £50</li>
                <li>30-day money-back guarantee</li>
                <li>Secure checkout</li>
                <li>24/7 customer support</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Related Products Call-to-Action */}
        <div className="related-products-cta">
          <h3>Looking for more?</h3>
          <p>
            Check out our other products in the{" "}
            <Link to={`/category/${product.category}`}>{product.category}</Link>{" "}
            category.
          </p>
          <button
            onClick={() => navigate(`/category/${product.category}`)}
            className="browse-category-btn"
          >
            Browse {product.category}
          </button>
        </div>
      </div>
    </>
  );
}
