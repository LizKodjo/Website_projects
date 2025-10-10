import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ProductCard from "../Products/ProductCard";
import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";

const mockProduct = {
  id: 1,
  name: "Test Product",
  price: 29.99,
  category: "Electronics",
  image_url: "/test-image.jpg",
};

describe("ProductCard", () => {
  it("renders product information correctly", () => {
    render(
      <BrowserRouter>
        <ProductCard product={mockProduct} />
      </BrowserRouter>
    );

    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("£29.99")).toBeInTheDocument();
    expect(screen.getByText("Electronics")).toBeInTheDocument();
    expect(screen.getByAltText("Test Product")).toHaveAttribute(
      "src",
      "/test-image.jpg"
    );
  });

  it("has a link to product details", () => {
    render(
      <BrowserRouter>
        <ProductCard product={mockProduct} />
      </BrowserRouter>
    );
    const link = screen.getByText("View Details");
    expect(link).toHaveAttribute("href", "/product/1");
  });
});
