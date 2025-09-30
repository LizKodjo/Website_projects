const { createContext, useState, useContext } = require("react");
const { jwt_decode, useNavigate } = require("react-router");

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const navigate = useNavigate();

  const login = async (email, password) => {
    const res = await axios.post("/api/v1/login", { email, password });
    const token = res.data.access_token;
    localStorage.setItem("token", token);
    setToken(token);

    const decoded = jwt_decode(token);
    const role = decoded.role;

    if (role == "admin") {
      navigate("/admin");
    } else {
      navigate("/shop");
    }
  };

  const signup = async (email, password) => {
    await axios.post("/api/v1/signup", { email, password });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
  };

  return (
    <>
      <AuthContext.Provider value={{ token, login, signup, logout }}>
        {children}
      </AuthContext.Provider>
    </>
  );
};

export const useAuth = () => useContext(AuthContext);
