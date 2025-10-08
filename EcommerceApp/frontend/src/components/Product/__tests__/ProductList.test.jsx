import { render, screen } from "@testing-library/react";
import ProductList from "../ProductList";
import React from "react";

describe("ProductList", () => {
  it("renders search input and category filter", () => {
    render(<ProductList />);
    expect(screen.getByPlaceholderText(/search products/i)).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });
});
