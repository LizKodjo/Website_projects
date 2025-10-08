import { useState } from "react";
import { createProduct } from "../../api/products";

export default function ProductForm({ onSuccess }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("all");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProduct({
        name,
        description,
        price: parseFloat(price),
        category,
      });
      onSuccess(); // Refresh product list
      // Clear form
      setName("");
      setDescription("");
      setPrice("");
      setCategory("");
    } catch (err) {
      // Handle error
      setError("Failed to create product: " + err.message);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="product-formW">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="books">Books</option>
          <option value="tech">Tech</option>
          <option value="fashion">Fashion</option>
        </select>
        <button type="submit">Create Product</button>
        {error && <p className="error">{error}</p>}
      </form>
    </>
  );
}
