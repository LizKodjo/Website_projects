export default function Header({ theme, toggleTheme }) {
  return (
    <>
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            COVID-19 Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Track global coronavirus statistics
          </p>
        </div>

        <button
          onClick={toggleTheme}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </header>
    </>
  );
}
