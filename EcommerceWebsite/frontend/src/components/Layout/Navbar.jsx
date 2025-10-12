import { Link } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import SearchBar from "./SearchBar";

export default function Navbar() {
  const { getCartItemsCount } = useCart();

  return (
    <>
      <nav className="navbar">
        <div className="nav-brand">
          <Link to="/">🛒 Ecommerce Store</Link>
        </div>

        <div className="nav-center">
          <SearchBar />
        </div>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/category/electronics">Electronics</Link>
          <Link to="/category/clothing">Clothing</Link>
          <Link to="/category/home">Home</Link>
        </div>

        <div className="nav-actions">
          <Link to="/cart" className="cart-link">
            🛍 Cart ({getCartItemsCount()})
          </Link>
        </div>
      </nav>
    </>
  );
}
