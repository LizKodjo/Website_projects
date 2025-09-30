import { useAuth } from "./services/AuthContext";
import jwt_decode from "jwt-decode";

function App() {
  const AdminRoute = ({ children }) => {
    const { token } = useAuth();
    if (!token) return <Navigate to="/login" />;
    const role = jwt_decode(token).role;
    return role == "admin" ? children : <Navigate to="/unauthorized" />;
  };

  return (
    <>
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
    </>
  );
}

export default App;
