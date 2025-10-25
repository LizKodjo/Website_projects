import { Link, useLocation } from "react-router-dom";

export default function OrderSuccess() {
  const location = useLocation();
  const { orderNumber, total } = location.state || {};

  // Fallback if accessed directly
  if (!orderNumber) {
    return (
      <div className="order-success-container">
        <div className="order-success-card">
          <div className="success-icon">❓</div>
          <h1>Order Not Found</h1>
          <p>We couldn't find your order information.</p>
          <Link to="/" className="continue-shopping-btn">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="order-success-container">
        <div className="order-success-card">
          <div className="success-icon">🎉</div>
          <h1>Order Confirmed</h1>
          <p className="success-message">
            Thank you for your purchase. Your order has been confirmed and will
            be shipped soon.
          </p>

          <div className="order-details">
            <div className="detail-row">
              <span className="detail-label">Order Number:</span>
              <span className="detail-value">{orderNumber}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Total Amount</span>
              <span className="detail-value">£{total?.toFixed(2)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Estimated Delivery:</span>
              <span className="detail-value">3 - 5 business days</span>
            </div>
          </div>
          <div className="next-steps">
            <h3>What's Next</h3>
            <ul>
              <li>You will receive an email confirmation shortly.</li>
              <li>We'll notify you whn your order ships.</li>
              <li>Track your order in your account page.</li>
            </ul>
          </div>
          <div className="action-buttons">
            <Link to="/orders" className="view-orders-btn">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
