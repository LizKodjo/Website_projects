export default function ProductCard({ product }) {
  return (
    <>
      <div className="card">
        <img src={product.image_url} alt={product.name} />
        <h3>{product.name}</h3>
        <p>£{product.price.toFixed(2)}</p>
      </div>
    </>
  );
}
