import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import App from "../src/App";

describe("App", () => {
  it("renders without crashing", () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(screen.getByText("Elizabeth Kodjo")).toBeInTheDocument();
  });
});

// Test for Home component
describe("Home", () => {
  it("displays hero section content", () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(
      screen.getByText("Full-Stack Developer & Software Engineer")
    ).toBeInTheDocument();
    expect(screen.getByText("View My Work")).toBeInTheDocument();
    expect(screen.getByText("Get In Touch")).toBeInTheDocument();
  });
});
