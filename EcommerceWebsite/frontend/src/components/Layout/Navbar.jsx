import { Link } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import SearchBar from "./SearchBar";
import { useAuth } from "../../contexts/AuthContext";

export default function Navbar() {
  const { getCartItemsCount } = useCart();
  const {user, logout} = useAuth()

  const handleLogout = () => {logout()}

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
          {user ? (
            <div className="user-menu">
              <span className="user-greeting">Hello, {user.name}</span>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
          ) : (
            <Link to="/login" className="login-btn">Login</Link>
          )}
          <Link to="/cart" className="cart-link">
            🛍 Cart ({getCartItemsCount()})
          </Link>
        </div>
      </nav>
    </>
  );
}
