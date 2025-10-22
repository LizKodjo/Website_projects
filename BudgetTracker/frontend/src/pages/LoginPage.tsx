import { useState, type FC } from "react";
import { useAuth } from "../contexts/AuthContext";
import LoginForm from "../components/Authentication/LoginForm";
import RegisterForm from "../components/Authentication/RegisterForm";
import { useTheme } from "../contexts/ThemeContext";

const LoginPage: FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { login, register, loading } = useAuth();
  const { theme } = useTheme();

  const handleLogin = async (email: string, password: string) => {
    try {
      setError(null);
      await login(email, password);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRegister = async (
    email: string,
    password: string,
    fullName: string
  ) => {
    try {
      setError(null);
      await register(email, password, fullName);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <>
      <div
        className={`min-h-screen transition-colors duration-200 ${
          theme === "dark"
            ? "bg-gray-900"
            : "bg-gradient-to-br from-blue-50 to-indigo-100"
        } flex items-center justify-center p-4`}
      >
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border dark:border-gray-600 max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              💰 BudgetTracker
            </h1>
            <p className="text-gray-600">Take control of your finances</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              <div className="flex items-center">
                <span className="text-red-500 mr-2">⚠️</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Loading Overlay */}
          {loading && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Please wait...</p>
              </div>
            </div>
          )}

          {/* Auth Forms */}
          {isLogin ? (
            <LoginForm
              onLogin={handleLogin}
              onSwitchToRegister={() => setIsLogin(false)}
            />
          ) : (
            <RegisterForm
              onRegister={handleRegister}
              onSwitchToLogin={() => setIsLogin(true)}
            />
          )}

          {/* Demo Info */}
          <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-center">
            <p className="text-sm text-blue-700">
              <strong>Demo Tip:</strong> You can register with any email and
              password to test the app!
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
