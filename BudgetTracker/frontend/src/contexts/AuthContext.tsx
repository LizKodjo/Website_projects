import {
  createContext,
  useContext,
  useEffect,
  useState,
  type FC,
  type ReactNode,
} from "react";
import { api } from "../utils/api";

interface User {
  id: number;
  email: string;
  full_name: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [loading, setLoading] = useState(true);

  // Set up axis interceptor for auth tokens

  useEffect(() => {
    const interceptor = api.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    return () => {
      api.interceptors.request.eject(interceptor);
    };
  }, [token]);

  // Check if token is valid on app start
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const userData = JSON.parse(localStorage.getItem("user") || "null");
          setUser(userData);
        } catch (error) {
          console.error("Token validation failed: ", error);
          logout();
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("username", email);
      formData.append("password", password);

      const response = await api.post("/token", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const {
        access_token,
        user_id,
        email: userEmail,
        full_name,
      } = response.data;

      const userData: User = {
        id: user_id,
        email: userEmail,
        full_name: full_name,
      };

      setToken(access_token);
      setUser(userData);

      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error: any) {
      console.error("Login error: ", error);
      throw new Error(error.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    fullName: string
  ) => {
    try {
      setLoading(true);
      const response = await api.post("/register", {
        email,
        password,
        full_name: fullName,
      });

      // After registration, automatically log the user in
      await login(email, password);
    } catch (error: any) {
      console.error("Registration error: ", error);
      throw new Error(error.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };
  const value = { user, token, login, register, logout, loading };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
