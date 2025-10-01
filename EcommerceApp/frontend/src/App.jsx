import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./services/AuthContext";
import { jwtDecode } from "jwt-decode";
import ProductList from "./pages/ProductList";
import AdminDashboard from "./pages/AdminDashboard";

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

      <Route path="/shop" element={<ProductList />} />
    </Routes>
    // </>
  );
}

export default App;
