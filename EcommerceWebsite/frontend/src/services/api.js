import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api/v1"; // Make sure this is correct

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log("🚀 Making API request to:", config.url);
    console.log("🔧 Full URL:", config.baseURL + config.url);
    return config;
  },
  (error) => {
    console.error("❌ Request error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log("✅ API response:", response.status, response.data);
    return response;
  },
  (error) => {
    console.error("❌ API error:", error);
    console.error("❌ Error details:", error.response?.data);
    return Promise.reject(error);
  }
);

export const productService = {
  getProducts: (category = null, filters = {}) => {
    const params = { ...filters };
    if (category) params.category = category;
    return api.get("/products/", { params });
  },

  getProduct: (id) => {
    return api.get(`/products/${id}`);
  },

  getCategories: () => {
    return api.get("/products/categories/");
  },
};

export default api;
