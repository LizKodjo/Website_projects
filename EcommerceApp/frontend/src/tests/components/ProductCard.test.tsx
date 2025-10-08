import { renderwithProviders } from "../utils/renderWithProviders";
import { fireEvent, screen } from "@testing-library/react";
import ProductCard from "../../components/Product/ProductCard";
import "@testing-library/jest-dom";
import { describe, expect, it, vi } from "vitest";

describe("ProductCard", () => {
  const mockProduct = {
    id: 1,
    name: "Luxury Candle",
    price: 25.0,
    image: "/candle.jpg",
    description: "A luxurious scented candle.",
  };
  it("renders product details", () => {
    renderwithProviders(<ProductCard product={mockProduct} />);
    expect(screen.getByText("Luxury Candle")).toBeInTheDocument();
    expect(screen.getByText("£25.00")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("src", "/candle.jpg");
  });

  it("calls addToCart on button click", () => {
    const addToCart = vi.fn();
    renderwithProviders(
      <ProductCard product={mockProduct} addToCart={addToCart} />
    );
    fireEvent.click(screen.getByText(/Add to Cart/i));
    expect(addToCart).toHaveBeenCalledWith(mockProduct);
  });
});
