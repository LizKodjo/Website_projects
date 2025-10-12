import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import Navbar from "./components/Layout/Navbar";
import ProductList from "./components/Products/ProductList";
import ProductDetail from "./components/Products/ProductDetail";
import Cart from "./components/Layout/Cart";

function App() {
  return (
    // <>
    <CartProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<ProductList />} />
              <Route path="/category/category" element={<ProductList />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
            </Routes>
          </main>
        </div>
      </Router>
    </CartProvider>
    // </>
  );
}

export default App;
