import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

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

  createProduct: (productData) => {
    return api.post("/products/", productData);
  },
};
export default api;
