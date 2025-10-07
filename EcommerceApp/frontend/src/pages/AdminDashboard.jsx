import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

export default function AdminDashboard() {
  const { token } = useAuth();
  const { logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    image_url: "",
    category: "",
    description: "",
  });

  useEffect(() => {
    axios
      .get("/api/v1/orders/all", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setOrders(res.data));
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios
      .post("/api/v1/products/create", form, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setOrders(res.data));
    alert("Product created!");
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="container">
        <h2>Create Product</h2>
        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="image_url"
          placeholder="Image URL"
          onChange={handleChange}
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
        ></textarea>
        <button type="submit">Create</button>
      </form>

      <div className="container">
        <h1 className="text-center">Admin Dashboard</h1>
        {orders.length == 0 ? (
          <p>No orders yet</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="shadowed roundedW">
              <p>Order #{order.id}</p>
              <p>Total: £{order.total.toFixed(2)}</p>
              <p>Status: {order.status}</p>
              <p>Placed: {new Date(order.created_at).toLocaleString()}</p>
            </div>
          ))
        )}

        {/* <div className="grid-responsive mt-lg">
          <div className="shadowed rounded">
            <h3>Total Users</h3>
            <p>123</p>
          </div>
          <div className="shadowed rounded">
            <h3>Total Orders</h3>
            <p>456</p>
          </div>
          <div className="shadowed rounded">
            <h3>Revenue</h3>
            <p>£12,345</p>
          </div>
        </div> */}
        <button onClick={logout}>Logout</button>
      </div>
    </>
  );
}
