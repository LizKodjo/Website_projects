import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FaBoxOpen,
  FaClipboardList,
  FaUserCog,
  FaSignOutAlt,
  FaHome,
} from "react-icons/fa";

export default function Sidebar() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  // Optionally decode user info from token
  let user = null;
  if (token) {
    try {
      user = JSON.parse(atob(token.split(".")[1]));
    } catch {
      // ignore decode errors
    }
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <FaHome size={32} style={{ marginRight: 8 }} />
        <h2>Ecommerce Admin</h2>
      </div>
      {user && (
        <div className="sidebar-user">
          <FaUserCog size={20} style={{ marginRight: 6 }} />
          <span>{user.email || "Admin"}</span>
        </div>
      )}
      <nav className="sidebar-nav">
        <NavLink
          to="/admin"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <FaHome style={{ marginRight: 6 }} /> Dashboard
        </NavLink>
        <NavLink
          to="/products"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <FaBoxOpen style={{ marginRight: 6 }} /> Products
        </NavLink>
        <NavLink
          to="/orders"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <FaClipboardList style={{ marginRight: 6 }} /> Orders
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <FaUserCog style={{ marginRight: 6 }} /> Settings
        </NavLink>
      </nav>
      <button className="sidebar-logout" onClick={handleLogout}>
        <FaSignOutAlt style={{ marginRight: 6 }} /> Logout
      </button>
    </aside>
  );
}
