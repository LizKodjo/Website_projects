import { useState } from "react";
import Login from "./Login";
import Register from "./Register";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <>
      <div className="auth-container">
        <div className="auth-card">
          {isLogin ? (
            <Login on toggleMode={toggleMode} />
          ) : (
            <Register onToggleMode={toggleMode} />
          )}
        </div>
      </div>
    </>
  );
}
