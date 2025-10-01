import { useCart } from "../services/CartContext";

export default function Cart() {
  const { cart, removeFromCart, clearCart } = useCart();

  const total = cart.reduce((sum, total) => +item.price * item.quantity, 0);

  return (
    <div className="container">
      <h2>Your Cart</h2>
      {cart.length == 0 ? (
        <p>Cart is empty</p>
      ) : (
        <>
          <ul>
            {cart.map((item) => (
              <li key={item.id}>
                {item.name} x {item.quanity} - £
                {(item.price * item.quanity).toFixed(2)}
                <button onClick={() => removeFromCart(item.id)}>Remove</button>
              </li>
            ))}
          </ul>
          {/* //  </> */}
          <p>Total: £{total.toFixed(2)}</p>
          <button onClick={clearCart}>Clear Cart</button>
        </>
      )}
    </div>
  );
}
