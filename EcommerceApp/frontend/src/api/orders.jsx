import api from "./axios";

export const getOrders = () => api.get("/orders");
export const updateOrdersStatus = (id, status) =>
  api.put(`/orders/${id}`, { status });
export const exportOrdersCSV = () =>
  api.get("/orders/export", { responseType: "blob" });
