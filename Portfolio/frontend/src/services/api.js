import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const projectsAPI = {
  getAll: async (featured = null) => {
    try {
      const params = {};
      if (featured !== null) {
        params.featured = featured;
      }
      const response = await api.get("/projects", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching projects:", error);
      throw new Error("Failed to fetch projects");
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/projects/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching project ${id}:`, error);
      throw new Error("Failed to fetch project");
    }
  },
};

export const contactAPI = {
  send: async (data) => {
    try {
      const response = await api.post("/contact", data);
      return response.data;
    } catch (error) {
      console.error("Error sending contact form:", error);
      throw new Error("Failed to send message");
    }
  },
};

// Test API connection
export const testConnection = async () => {
  try {
    const response = await api.get("/health");
    return response.data;
  } catch (error) {
    console.error("API connection test failed:", error);
    throw new Error("Cannot connect to backend");
  }
};

export default api;
