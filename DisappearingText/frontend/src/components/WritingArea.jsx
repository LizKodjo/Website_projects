import axios from "axios";
import { useEffect, useRef, useState } from "react";

export default function WritingArea({ sessionId }) {
  const [text, setText] = useState("");
  const [countdown, setCountdown] = useState(5);
  const timerRef = useRef(null);

  // Reset timer on keystroke
  const handleChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    resetTimer();

    axios
      .post("http://localhost:8000/keystroke", {
        session_id: sessionId,
        text: newText,
      })
      .catch((err) => console.error("Keystroke error: ", err));
  };
  // Countdown logic
  const resetTimer = () => {
    setCountdown(5);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setText("");
          return 5;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSave = () => {
    axios
      .post("http://localhost:8000/save-text", {
        session_id: sessionId,
        text,
      })
      .then(() => alert("Draft saved!"))
      .catch(() => alert("Save failed"));
  };

  const handleResort = () => {
    axios
      .post("http://localhost:8000/get-text", {
        session_id: sessionId,
      })
      .then((res) => {
        setText(res.data.text);
        resetTimer();
        alert("Draft restored!");
      })
      .catch(() => alert("Restore failed."));
  };

  useEffect(() => {
    resetTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <>
      <div style={{ padding: "2rem" }}>
        <textarea
          value={text}
          onChange={handleChange}
          placeholder="Start typing or vanish..."
        />
        <p style={{ color: countdown <= 2 ? "#ff00ff" : "fff" }}>
          Time left: {countdown}s
        </p>
        <button onClick={handleSave}>💾 Save Draft</button>
        <button onClick={handleResort}>🔄️ Restore Draft</button>
      </div>
    </>
  );
}
