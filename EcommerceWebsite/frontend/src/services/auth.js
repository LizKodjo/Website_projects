import api from "./api";

export const authService = {
  login: async (email, password) => {
    try {
      console.log("🔐 Attempting login for:", email);

      const formData = new FormData();
      formData.append("username", email);
      formData.append("password", password);

      const response = await api.post("/auth/login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      console.log("✅ Login successful, token received");

      if (response.data.access_token) {
        localStorage.setItem("access_token", response.data.access_token);
      }

      return response.data;
    } catch (error) {
      console.error("❌ Login service error:", error);
      console.error("❌ Error response:", error.response);
      throw error;
    }
  },

  register: async (userData) => {
    try {
      console.log("👤 Attempting registration for:", userData.email);
      console.log("📤 Sending data:", userData);

      const response = await api.post("/auth/register", userData);

      console.log("✅ Registration successful");
      return response.data;
    } catch (error) {
      console.error("❌ Register service error:", error);
      console.error("❌ Error response:", error.response);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("access_token");
  },

  getCurrentUser: async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.log("🔐 No token found");
      return null;
    }

    try {
      console.log("🔍 Getting current user with token");
      const response = await api.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("✅ Current user:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Get current user error:", error);
      localStorage.removeItem("access_token");
      return null;
    }
  },

  getToken: () => {
    return localStorage.getItem("access_token");
  },
};
