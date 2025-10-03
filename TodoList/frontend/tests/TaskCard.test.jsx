import { fireEvent, render, screen } from "@testing-library/react";
import TaskCard from "../src/components/TaskCard";
import { test, expect, vi } from "vitest";
import "@testing-library/jest-dom";

test("renders task title", () => {
  render(<TaskCard task={{ title: "Test", completed: false }} />);
  expect(screen.getByText("Test")).toBeInTheDocument();
});

test("calls onToggle when checkbox is clicked", () => {
  const mockToggle = vi.fn();
  render(
    <TaskCard
      task={{ title: "Test", completed: false }}
      onToggle={mockToggle}
    />
  );
  fireEvent.click(screen.getByRole("checkbox"));
  expect(mockToggle).toHaveBeenCalled();
});
