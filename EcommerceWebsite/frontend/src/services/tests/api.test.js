import { describe, it, expect, vi } from "vitest";
import { productService } from "../api";

// Mock axios
vi.mock("axios", () => ({
  default: {
    create: () => ({
      get: vi.fn(),
      post: vi.fn(),
    }),
  },
}));

describe("productService", () => {
  it("should get products without category", () => {
    const mockGet = vi.fn();
    productService.getProducts = mockGet;
    productService.getProducts();
    expect(mockGet).toHaveBeenCalledWith("products/", { params: {} });
  });

  it("should get products with category", () => {
    const mockGet = vi.fn();
    productService.getProducts = mockGet;
    productService.getProducts("Electronics");
    expect(mockGet).toHaveBeenCalledWith("/products/", {
      params: { category: "Electronics" },
    });
  });
});
