import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminLogin.module.scss";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5001/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (data.token) {
      localStorage.setItem("adminToken", data.token);
      navigate("/admin");
    } else {
      setError(data.error || "Login failed");
    }
  };
  return (
    <>
      <form onSubmit={handleLogin} className={styles.adminLogin}>
        <h2>Admin Login</h2>
        {error && <p>{error}</p>}
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
        />
        <button type="submit">Login</button>
      </form>
    </>
  );
}
