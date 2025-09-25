import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.scss";
import { useState } from "react";
import logo from "../../assets/logo.png";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.left}>
          <div className={`${styles.logo} gold-gradient`}>
            <img src={logo} alt="Company Logo" width={100} height={100} />
          </div>
        </div>
        <div className={styles.right}>
          <button
            className={`${styles.menuButton} ${menuOpen ? styles.open : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        <ul className={`${styles.links} ${menuOpen ? styles.showMenu : ""}`}>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? styles.active : "")}
              onClick={handleLinkClick}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              className={({ isActive }) => (isActive ? styles.active : "")}
              onClick={handleLinkClick}
            >
              About
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/portfolio"
              className={({ isActive }) => (isActive ? styles.active : "")}
              onClick={handleLinkClick}
            >
              Portfolio
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contact"
              className={({ isActive }) => (isActive ? styles.active : "")}
              onClick={handleLinkClick}
            >
              Contact
            </NavLink>
          </li>
        </ul>
      </nav>
    </>
  );
}
