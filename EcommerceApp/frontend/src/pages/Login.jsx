import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("/api/v1/login", { email, password });
      localStorage.setItem("token", res.data.access_token);
      window.location.href = "/dashboard";
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <>
      <div className="login-form">
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
        />
        <button onClick={handleLogin}>Login</button>
      </div>
    </>
  );
}
