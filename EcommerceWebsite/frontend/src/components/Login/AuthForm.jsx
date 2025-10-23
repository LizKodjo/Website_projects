import { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import { useNavigate } from "react-router-dom";

// Debug: Check if components are imported correctly
console.log("🔧 Login component: ", Login);
console.log("🔧 Register component: ", Register);

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const toggleMode = () => {
    console.log(
      "🔄 Toggling auth mode from",
      isLogin ? "login" : "register",
      "to",
      !isLogin ? "login" : "register"
    );
    setIsLogin(!isLogin);
  };

  const handleAuthSuccess = () => {
    // Redirect to home page after successful login/register
    navigate("/");
  };

  console.log("🎯 Rendering AuthForm, isLogin", isLogin);

  return (
    <>
      <div className="auth-container">
        <div className="auth-card">
          {isLogin ? (
            <Login onToggleMode={toggleMode} onSuccess={handleAuthSuccess} />
          ) : (
            <Register onToggleMode={toggleMode} onSuccess={handleAuthSuccess} />
          )}

          {/* Toggle section */}
          <div className="auth-toggle-section">
            {isLogin ? (
              <p className="auth-toggle">
                Don't have an account?
                <button
                  type="button"
                  onClick={toggleMode}
                  className="auth-toggle-button"
                >
                  Sign up here
                </button>
              </p>
            ) : (
              <p className="auth-toggle">
                Already have an account?
                <button onClick={toggleMode} className="auth-toggle-button">
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
