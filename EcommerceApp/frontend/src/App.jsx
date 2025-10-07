import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { jwtDecode } from "jwt-decode";
import ProductList from "./components/ProductList";
import AdminDashboard from "./pages/AdminDashboard";
import Unauthorized from "./components/Unauthorized";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Checkout from "./pages/Checkout";

const AdminRoute = ({ children }) => {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" />;
  const role = jwtDecode(token).role;
  return role == "admin" ? children : <Navigate to="/unauthorized" />;
};

function App() {
  return (
    // <>
    <Routes>
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />

      <Route path="/shop" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
    </Routes>
    // </>
  );
}

export default App;
