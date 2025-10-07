import axios from "axios";
import { useCart } from "../context/CartContext";

export default function Checkout() {
  const { cart } = useCart();
  const token = localStorage.getItem("token");

  const handleCheckout = async () => {
    await axios.post(
      "/api/v1/orders",
      {
        total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        items: cart.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
        shipping_address: "123 Test Street",
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  };
  return (
    <>
      <div>
        <h2>Checkout</h2>
        <button onClick={handleCheckout}>Place Order</button>
      </div>
    </>
  );
}
