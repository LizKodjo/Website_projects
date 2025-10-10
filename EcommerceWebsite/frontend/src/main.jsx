import { StrictMode } from "react";
import ReactDom from "react-dom/client";
import "./styles/global.scss";
import App from "./App.jsx";

ReactDom.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
