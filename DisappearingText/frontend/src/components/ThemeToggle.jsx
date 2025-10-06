import { useEffect, useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("block");

  useEffect(() => {
    const stored = localStorage.getItem("theme") || "block";
    document.documentElement.setAttribute("data-theme", stored);
    setTheme(stored);
  }, []);

  const toggleTheme = () => {
    const next = theme == "block" ? "pastel" : "block";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    setTheme(next);
  };

  return (
    <>
      <button
        onClick={toggleTheme}
        style={{
          position: "fixed",
          bottom: "1rem",
          right: "1rem",
          borderRadius: "50%",
          fontSize: "1.5rem",
          padding: "0.5rem",
          backgroundColor: "var(--accent)",
          color: "var(--bg)",
          border: "none",
          cursor: "pointer",
        }}
        aria-label="Toggle them"
      >
        {theme == "block" ? <FaSun /> : <FaMoon />}
      </button>
    </>
  );
}
