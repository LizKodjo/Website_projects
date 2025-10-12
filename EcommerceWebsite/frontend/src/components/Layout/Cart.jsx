import { Link } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";

export default function Cart() {
  const { items, removeFromCart, updateQuantity, clearCart, getCartTotal } =
    useCart();

  if (items.length === 0) {
    return (
      <div className="cart-container">
        <h1>Your Cart</h1>
        <div className="empty-cart">
          <p>Your cart is empty.</p>
          <Link to="/" className="continue-shopping">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="cart-container">
        <div className="cart-header">
          <h1>Your Cart ({items.length} items)</h1>
          <button className="clear-cart-btn" onClick={clearCart}>
            Clear Cart
          </button>
        </div>

        <div className="cart-items">
          {items.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="item-image">
                <img
                  src={item.image_url || "/placeholder-image.jpg"}
                  alt={item.name}
                />
              </div>

              <div className="item-details">
                <h3 className="item-name">{item.name}</h3>
                <p className="item-category">{item.category}</p>
                <p className="item-price">£{item.price}</p>
              </div>

              <div className="quantity-controls">
                <button
                  className="quantity-btn"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  {" "}
                  -{" "}
                </button>
                <span className="quantity">{item.quantity}</span>
                <button
                  className="quantity-btn"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  +
                </button>
              </div>

              <div className="item-total">
                £{(item.price * item.quantity).toFixed(2)}
              </div>

              <button
                className="remove-btn"
                onClick={() => removeFromCart(item.id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="total">
            <strong>Total: ${getCartTotal().toFixed(2)}</strong>
          </div>
          <div className="cart-actions">
            <Link to="/" className="continue-shopping">
              Continue Shopping
            </Link>
            <button className="checkout-btn">Proceed to Checkout</button>
          </div>
        </div>
      </div>
    </>
  );
}
