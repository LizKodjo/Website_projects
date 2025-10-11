import { createContext, useContext, useState } from "react";
import { productService } from "../services/api";

const ProductContext = createContext();

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProduct must be used within a ProductProvider");
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  const fetchProducts = async (category = null, filters = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await productService.getProducts(category, filters);
      setProducts(response.data);
    } catch (err) {
      setError("Failed to fetch products");
      console.error("Error fetching products: ", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await productService.getCategories();
      setCategories(response.data.categories);
    } catch (err) {
      console.error("Error fetching categories: ", err);
    }
  };

  const getProduct = async (id) => {
    try {
      const response = await productService.getProduct(id);
      return response.data;
    } catch (err) {
      console.error("Error fetching product: ", err);
      throw err;
    }
  };

  const value = {
    products,
    loading,
    error,
    categories,
    fetchProducts,
    fetchCategories,
    getProduct,
  };

  return (
    <>
      <ProductContext.Provider value={value}>
        {children}
      </ProductContext.Provider>
    </>
  );
};
