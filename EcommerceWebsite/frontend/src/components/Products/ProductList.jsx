import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { productService } from "../../services/api";
// import "./ProductList.css";

// const ProductList = () => {
export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { category } = useParams();
  const location = useLocation();
  const { addToCart } = useCart();

  // Get search term from URL
  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get("search") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("🔄 Fetching ALL products...");
        setLoading(true);
        setError(null);

        // This will now get ALL products without limits
        const response = await productService.getProducts(category);
        console.log("✅ API Response - Total products:", response.data.length);

        setProducts(response.data);
      } catch (err) {
        console.error("❌ Error fetching products:", err);
        setError("Failed to fetch products: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  // Filter products based on search
  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      console.log(
        `🔍 Filtered ${filtered.length} products for search: "${searchTerm}"`
      );

      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [products, searchTerm]);

  const handleAddToCart = (product) => {
    addToCart(product);
    alert(`${product.name} added to cart!`);
  };

  const displayProducts = filteredProducts;

  console.log("🎨 Rendering ProductList:", {
    loading,
    error,
    productsCount: products.length,
  });

  if (loading)
    return (
      <div className="product-list-container">
        <h1>{category ? `${category} Products` : "All Products"}</h1>
        <div className="loading">Loading products...</div>
      </div>
    );

  if (error)
    return (
      <div className="product-list-container">
        <h1>{category ? `${category} Products` : "All Products"}</h1>
        <div className="error">Error: {error}</div>
      </div>
    );

  return (
    <div className="product-list-container">
      <h1>
        {searchTerm
          ? `Search Results for "${searchTerm}"`
          : category
          ? `${category} Products`
          : "All Products"}
      </h1>

      <div className="products-info">
        <p>
          Showing {displayProducts.length} product
          {displayProducts.length !== 1 ? "s" : ""}
          {searchTerm && ` matching "${searchTerm}"`}
        </p>
        {searchTerm && displayProducts.length === 0 && (
          <div className="no-results-help">
            <p>
              No products found for "{searchTerm}". Try searching with different
              keywords or browse our categories.
            </p>
            <Link to="/" className="clear-search-link">
              Clear search and view all products
            </Link>
          </div>
        )}
        {searchTerm && displayProducts.length > 0 && (
          <div className="search-help">
            <Link to="/" className="clear-search-link">
              Clear search
            </Link>
          </div>
        )}
      </div>

      {displayProducts.length === 0 && !loading ? (
        <div className="no-products">
          {searchTerm ? (
            <div className="no-search-results">
              <h3>No products found.</h3>
              <p>We couldn't find any products matching "{searchTerm}"</p>
              <div className="suggestions">
                <p>Try:</p>
                <ul>
                  <li>Using different keywords</li>
                  <li>Checking for spelling errors</li>
                  <li>Searching for broader terms</li>
                </ul>
              </div>
              <Link to="/" className="browse-all-btn">
                Browse All Products
              </Link>
            </div>
          ) : (
            <div className="no-products-message">
              <p>No products available at the moment.</p>
              <p>Please check back later or contact support.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <Link to={`/product/${product.id}`} className="product-link">
                <div className="product-image">
                  <img
                    src={product.image_url || "/placeholder-image.jpg"}
                    alt={product.name}
                    onError={(e) => {
                      e.target.src =
                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5OTkiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==";
                    }}
                  />
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-description">
                    {product.description?.substring(0, 80)}...
                  </p>
                  <p className="product-price">£{product.price}</p>
                  <p className="product-category">{product.category}</p>
                  <p className="product-stock">
                    {product.stock_quantity > 0
                      ? `${product.stock_quantity} in stock`
                      : "Out of stock"}
                  </p>
                </div>
              </Link>
              <button
                className="add-to-cart-btn"
                onClick={() => handleAddToCart(product)}
                disabled={product.stock_quantity === 0}
              >
                {product.stock_quantity > 0 ? "Add to Cart" : "Out of Stock"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// export default ProductList;
