import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/nameLogo.png";

export default function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="navbar">
        <div className="container">
          <div className="nav-content">
            {/* Logo that links to home */}
            <Link to="/" className="logo-link">
              <img src={logo} alt="EK Logo" className="logo-image" />
              <span className="logo-text">EK</span>
            </Link>

            {/* Navigation Links */}
            <ul className="nav-links">
              <li>
                <Link to="/" className={isActive("/") ? "active" : ""}>
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/projects"
                  className={isActive("/projects") ? "active" : ""}
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className={isActive("/contact") ? "active" : ""}
                >
                  Contact
                </Link>
              </li>
            </ul>

            {/* Mobile button */}
            <button className="mobile-menu-btn">
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
