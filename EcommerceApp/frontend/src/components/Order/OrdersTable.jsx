import { useEffect, useState } from "react";
import {
  exportOrdersCSV,
  getOrders,
  updateOrdersStatus,
} from "../../api/orders";

export default function OrdersTable() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getOrders()
      .then((res) => setOrders(res.data))
      .catch(() => setError("Failed to load orders"));
  }, []);

  const handleStatusChange = async (id, status) => {
    await updateOrdersStatus(id, status);
    const updated = orders.map((o) => (o.id === id ? { ...o, status } : o));
    setOrders(updated);
  };

  const handleExport = async () => {
    const res = await exportOrdersCSV();
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "orders.csv");
    document.body.appendChild(link);
    link.click();
  };

  if (error) return <p className="error">{error}</p>;

  return (
    <>
      <button onClick={handleExport}>Export CSV</button>
      <table className="orders-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Status</th>
            <th>Update</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.customer_name}</td>
              <td>£{o.total}</td>
              <td>{o.status}</td>
              <td>
                <select
                  value={o.status}
                  onChange={(e) => handleStatusChange(o.id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="canceled">Canceled</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
