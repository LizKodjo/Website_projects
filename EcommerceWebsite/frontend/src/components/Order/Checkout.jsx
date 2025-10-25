import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import { useState } from "react";

export default function Checkout() {
  const { items, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: user?.full_name || "",
    email: user?.email || "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    paymentMethod: "credit_card",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Prepare order data
      const orderData = {
        shipping_address: `${formData.address}, ${formData.city}, ${formData.postalCode}, ${formData.country}`,
        payment_method: formData.paymentMethod,
        items: items.map((item) => ({
          product_id: item.id,
          product_name: item.name,
          product_price: item.price,
          quantity: item.quantity,
        })),
      };

      console.log("📦 Creating order: ", orderData);

      // This would be where I would call the order API, but I will simulate a successful order
      setTimeout(() => {
        clearCart();
        navigate("/order-success", {
          state: {
            orderNumber: `ORD-${Date.now()}`,
            total: getCartTotal(),
          },
        });
      }, 1500);
    } catch (err) {
      setError("Failed to create order.  Please try again.");
      console.error("Order error: ", err);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="checkout-empty">
        <h2>Your cart is empty</h2>
        <p>Add some products to your cart before checking out.</p>
        <button onClick={() => navigate("/")} className="continue-shopping-btn">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>

      <div className="checkout-content">
        {/* Shipping Information */}
        <div className="checkout-form-section">
          <h2>Shipping Information</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="Street address"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Payment Method</label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
              >
                <option value="credit_card">Credit Card</option>
                <option value="paypal">PayPal</option>
                <option value="bank_transfer">Bank Transfer</option>
              </select>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="place-order-btn"
            >
              {loading
                ? "Placing Order..."
                : `Place Order - £${getCartTotal().toFixed(2)}`}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="order-items">
            {items.map((item) => (
              <div key={item.id} className="order-item">
                <div className="item-info">
                  <h4>{item.name}</h4>
                  <p>
                    ${item.price} x {item.quantity}
                  </p>
                </div>
                <div className="item-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="order-total">
            <div className="total-line">
              <span>Subtotal:</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>
            <div className="total-line">
              <span>Shipping:</span>
              <span>$0.00</span>
            </div>
            <div className="total-line grand-total">
              <span>Total:</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
