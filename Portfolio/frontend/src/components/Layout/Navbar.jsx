import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/nameLogo.png";
import ResumeDownload from "../ResumeDownload";
import { useEffect, useState } from "react";

export default function Navbar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Close mobile menu when clicking outside or on a link
  useEffect(() => {
    const handleClickOutside = (event) => {
      const mobileMenu = document.querySelector(".mobile-menu-overlay");
      const mobileMenuBtn = document.querySelector(".mobile-menu-btn");

      if (
        isMobileMenuOpen &&
        !mobileMenu?.contains(event.target) &&
        !mobileMenuBtn?.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="container">
          <div className="nav-content">
            {/* Logo that links to home */}
            <Link to="/" className="logo-link">
              <img src={logo} alt="EK Portfolio Logo" className="logo-image" />
              <span className="logo-text">EK</span>
            </Link>

            {/* Desktop Navigation Links */}
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
              <li className="nav-resume">
                <ResumeDownload variant="primary" size="small" />
              </li>
            </ul>

            {/* Mobile menu button */}
            <button
              className={`mobile-menu-btn ${isMobileMenuOpen ? "active" : ""}`}
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>

            {/* Mobile Menu Overlay */}
            <div
              className={`mobile-menu-overlay ${
                isMobileMenuOpen ? "active" : ""
              }`}
            >
              <div className="mobile-menu-content">
                {/* Mobile Logo */}
                <div className="mobile-logo">
                  <img
                    src={logo}
                    alt="EK Portfolio Logo"
                    className="logo-image"
                  />
                  <span className="logo-text">EK Portfolio</span>
                </div>

                {/* Mobile Navigation Links */}
                <ul className="mobile-nav-links">
                  <li>
                    <Link
                      to="/"
                      className={isActive("/") ? "active" : ""}
                      onClick={handleMobileLinkClick}
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/projects"
                      className={isActive("/projects") ? "active" : ""}
                      onClick={handleMobileLinkClick}
                    >
                      Projects
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/contact"
                      className={isActive("/contact") ? "active" : ""}
                      onClick={handleMobileLinkClick}
                    >
                      Contact
                    </Link>
                  </li>
                  <li className="mobile-resume">
                    <ResumeDownload variant="primary" />
                  </li>
                </ul>

                {/* Mobile Social Links */}
                <div className="mobile-social">
                  <a
                    href="https://github.com/ek"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    onClick={handleMobileLinkClick}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38 4.77-1.59 8.2-6.09 8.2-11.39 0-6.63-5.37-12-12-12z" />
                    </svg>
                  </a>
                  <a
                    href="https://linkedin.com/in/ek"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    onClick={handleMobileLinkClick}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                  <a
                    href="mailto:hello@ekportfolio.com"
                    aria-label="Email"
                    onClick={handleMobileLinkClick}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 12.713l-11.985-9.713h23.97l-11.985 9.713zm0 2.574l-12-9.725v15.438h24v-15.438l-12 9.725z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
