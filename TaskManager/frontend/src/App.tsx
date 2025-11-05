import React, { type FC, type ReactNode } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { TaskProvider } from "./contexts/TaskContext";
// import { ToastProvider } from "./contexts/ToastContext";

// Components
import Navbar from "./components/Layout/Navbar";
import ToastContainer from "./components/Layout/ToastContainer";
import LoginForm from "./components/Auth/LoginForm";
import RegisterForm from "./components/Auth/RegisterForm";
import TaskBoard from "./components/Tasks/TaskBoard";
// import LoadingSpinner from "@/components/UI/LoadingSpinner";

// Styles
import "./App.css";

// Protected Route Component
const ProtectedRoute: FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Public Route Component (for auth pages)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return !isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

// Import useAuth after component definition to avoid hook order issues
import { useAuth } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import LoadingSpinner from "./components/UI/LoadingSpinner";

// Main App Content Component
const AppContent: React.FC = () => {
  return (
    <div className="App">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginForm />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterForm />
              </PublicRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <TaskBoard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <TaskBoard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <ToastContainer />
    </div>
  );
};

// Main App Component
function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <TaskProvider>
            <AppContent />
          </TaskProvider>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
