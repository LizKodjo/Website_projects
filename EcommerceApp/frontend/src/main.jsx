import { createRoot } from "react-dom/client";
import "./styles/global.scss";
import App from "./App.jsx";
import { AuthProvider } from "./services/AuthContext.jsx";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./services/CartContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <CartProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </CartProvider>
  </BrowserRouter>
);
