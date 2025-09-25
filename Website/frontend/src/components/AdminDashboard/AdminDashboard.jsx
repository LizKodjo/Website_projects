import { useEffect, useState } from "react";
import styles from "./AdminDashboard.module.scss";

export default function AdminDashboard() {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const token = import.meta.env.VITE_ADMIN_TOKEN;

  useEffect(() => {
    if (!token) return setError("Unauthorized");

    fetch("http://localhost:5001/admin/messages", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setMessages(data);
      })
      .catch(() => setError("Network error"));
  }, []);

  if (error) return <p>{error}</p>;

  return (
    <>
      <section className={styles.adminDashboard}>
        <h2>Admin Messages</h2>
        {messages.map((msg) => (
          <div key={msg.id} className={styles.message}>
            <p>
              <strong>{msg.name}</strong>({msg.email})
            </p>
            <p>{msg.message}</p>
            <p>
              <em>{new Date(msg.timestamp).toLocaleString()}</em>
            </p>
            <hr />
          </div>
        ))}
      </section>
    </>
  );
}
