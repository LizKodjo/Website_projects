import { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import { useNavigate } from "react-router-dom";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate()

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  const handleAuthSuccess = () => {
    // Redirect to home page after successful login/register
    navigate('/')
  }

  return (
    <>
      <div className="auth-container">
        <div className="auth-card">
          {isLogin ? (
            <Login on toggleMode={toggleMode} onSuccess={handleAuthSuccess} />
          ) : (
            <Register onToggleMode={toggleMode} onSuccess={handleAuthSuccess} />
          )}
        </div>
      </div>
    </>
  );
}
