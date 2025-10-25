import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import Navbar from "./components/Layout/Navbar";
import ProductList from "./components/Products/ProductList";
import ProductDetail from "./components/Products/ProductDetail";
import Cart from "./components/Layout/Cart";
import { AuthProvider } from "./contexts/AuthContext";
import AuthForm from "./components/Login/AuthForm";
import Checkout from "./components/Order/Checkout";
import OrderSuccess from "./components/Order/OrderSuccess";

function App() {
  return (
    // <>
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<ProductList />} />
                <Route path="/category/:category" element={<ProductList />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-success" element={<OrderSuccess />} />
                <Route path="/login" element={<AuthForm />} />
              </Routes>
            </main>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
    // </>
  );
}

export default App;
