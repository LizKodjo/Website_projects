import { describe, expect, vi } from "vitest";
import { renderwithProviders } from "../utils/renderWithProviders";
import Sidebar from "../../components/utils/Sidebar";
import { fireEvent, screen } from "@testing-library/dom";
import { render } from "less";

describe("Sidebar", () => {
  const mockCart = [
    { id: 1, name: "Luxury Candle", price: 25, quantity: 2 },
    { id: 2, name: "Silk Scarf", price: 40, quantity: 1 },
  ];

  it("renders cart items and total", () => {
    renderwithProviders(<Sidebar cart={mockCart} />);
    expect(screen.getByText("Luxury Candle")).toBeInDocument();
    expect(screen.getByText("Silk Scarf")).toBeInDocument();
    expect(screen.getByText("90")).toBeInDocument(); // Total: 25*2 + 40*1 = 90
  });

  it("removes item when remove button is clicked", () => {
    const removeItem = vi.fn();
    renderwithProviders(<Sidebar cart={mockCart} removeItem={removeItem} />);
    fireEvent.click(screen.getAllByText(/Remove/i)[0]);
    expect(removeItem).toHaveBeenCalledWith(1);
  });
});
