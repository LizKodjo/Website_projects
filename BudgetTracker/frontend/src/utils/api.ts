import axios from "axios";

const API_BASE_URL = "http://localhost:8001";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});


export const transactionAPI = {
  create: (transaction: any, userId: number) =>
    api.post('/transactions/', {
      transaction: transaction,
      user_id: userId
    }),
  getAll: (userId: number) => api.get('/transactions/', { 
    params: { user_id: userId }
  }),
};

export const budgetAPI = {
  create: (budget: any, userId: number) =>
    api.post("/budgets/", {
      budget: budget, // Wrap in 'budget' object
      user_id: userId, // Include user_id in body
    }),
  getAll: (userId: number) =>
    api.get("/budgets/", {
      params: { user_id: userId },
    }),
};

export const healthCheck = async () => {
  try {
    const response = await api.get("/health");
    return { status: "healthy", data: response.data };
  } catch (error: any) {
    return {
      status: "unhealthy",
      error: error.message,
    };
  }
};
