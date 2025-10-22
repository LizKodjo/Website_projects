import type { FC } from "react";
import { useTheme } from "../../contexts/ThemeContext";

const ThemeToggle: FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 dark:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <span className="sr-only">Toggle theme</span>
      <span
        className={`${
          theme === "light" ? "translate-x-6" : "translate-x-1"
        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform items-center justify-center`}
      >
        {theme === "light" ? (
          <span className="flex items-center justify-center text-yellow-500">
            ☀️
          </span>
        ) : (
          <span className="flex items-center justify-center text-blue-300">
            🌙
          </span>
        )}
      </span>
    </button>
  );
};

export default ThemeToggle;
