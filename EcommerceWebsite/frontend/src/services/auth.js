import api from "./api";

export const authService = {
  login: async (email, password) => {
    try {
      const formData = new FormData();
      formData.append("username", email);
      formData.append("password", password);

      const response = await api.post("/auth/login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (response.data.access_token) {
        localStorage.setItem("access_token", response.data.access_token);
      }
      return response.data;
    } catch (error) {
      console.error("Login service error: ", error);
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post("/auth/register", userData);
      return response.data;
    } catch (error) {
      console.error("Register service error: ", error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("access_token");
  },

  getCurrentUser: async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return null;

    try {
      const response = await api.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      localStorage.removeItem("token");
      return null;
    }
  },

  getToken: () => {
    return localStorage.getItem("token");
  },
};
