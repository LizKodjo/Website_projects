import { useEffect, useState } from "react";
import axios from "axios";
import "./styles/global.scss";
import WritingArea from "./components/WritingArea";
import ThemeToggle from "./components/ThemeToggle";

export default function App() {
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    axios
      .post("http://localhost:8000/start-session")
      .then((res) => setSessionId(res.data.session_id))
      .catch((err) => console.error("Session error: ", err));
  }, []);

  return (
    <>
      <div>
        <h1>Write or Vanish</h1>
        {sessionId ? (
          <WritingArea sessionId={sessionId} />
        ) : (
          <p>Starting session...</p>
        )}
        <ThemeToggle />
      </div>
    </>
  );
}
