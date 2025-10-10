import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ProductProvider } from "./context/ProductContext";
import Navbar from "./components/Navbar";
import ProductList from "./components/Products/ProductList";
import Cart from "./components/Cart";
import ProductDetail from "./components/ProductDetail";
import "./App.css";

function App() {
  return (
    <>
      <ProductProvider>
        <Router>
          <div className="App">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<ProductList />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/category/:category" element={<ProductList />} />
              </Routes>
            </main>
          </div>
        </Router>
      </ProductProvider>
    </>
  );
}

export default App;
