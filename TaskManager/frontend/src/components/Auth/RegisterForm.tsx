import { useState, type ChangeEvent, type FC, type FormEvent } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../hooks/useToast";
import { Link, useNavigate } from "react-router-dom";

const RegisterForm: FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await register(formData);
      addToast("Account created successfully!", "success");
      navigate("/");
    } catch (error: any) {
      addToast(error.response?.data?.detail || "Registration faile", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="auth-container">
        <div className="auth-card">
          <h2>Create Account</h2>
          <p className="auth-subtitle">Get started with TaskFlow Pro</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="full_name">Full Name (Optional)</label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="Enter your full name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading}
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={isLoading}
                placeholder="Create a password"
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="auth-button primary"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="auth-link">
                Sign inhere
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterForm;
