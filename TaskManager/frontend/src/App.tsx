import React, { type FC, type ReactNode } from "react";

// Styles
import "./App.css";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Navigate, Route, Router, Routes } from "react-router-dom";
import { useToast } from "./hooks/useToast";
import Navbar from "./components/Layout/Navbar";
import LoginForm from "./components/Auth/LoginForm";
import RegisterForm from "./components/Auth/RegisterForm";
import TaskBoard from "./components/Tasks/TaskBoard";
import ToastContainer from "./components/Layout/ToastContainer";
import { TaskProvider } from "./contexts/TaskContext";

const ProtectedRoute: FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="loading-full">Loading...</div>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="loading-full">Loading...</div>;
  }

  return !isAuthenticated ? <>{children}</> : <Navigate to="/" />;
};

function AppContent() {
  useToast(); // Initialize toast system

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
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <ToastContainer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <TaskProvider>
          <AppContent />
        </TaskProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
