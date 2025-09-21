import React from "react";
import ReactDOM from "react-dom/client";
import Router from "./router";
import "./styles/index.scss";
import AOS from "aos";
import "aos/dist/aos.css";

AOS.init({ duration: 800, once: true, easing: "ease-in-out" });

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>
);
