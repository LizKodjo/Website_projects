import WritingArea from "../components/WritingArea";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi } from "vitest";

const mockSessionId = "test-session";

global.alert = vi.fn();

describe("WritingArea", () => {
  it("renders textarea and countdown", () => {
    render(<WritingArea sessionId={mockSessionId} />);
    expect(screen.getByPlaceholderText(/start typing/i)).toBeInTheDocument();
    expect(screen.getByText(/time left/i)).toBeInTheDocument();
  });

  it("resets countdown on typing", async () => {
    render(<WritingArea sessionId={mockSessionId} />);
    const textarea = screen.getByPlaceholderText(/start typing/i);
    fireEvent.change(textarea, { target: { value: "Hello" } });

    await waitFor(() => {
      expect(screen.getByText(/time left: 5s/i)).toBeTruthy();
    });
  });

  it("clears text after timeout", async () => {
    vi.useFakeTimers();

    render(<WritingArea sessionId={mockSessionId} />);

    const textarea = screen.getByPlaceholderText(/start typing/i);
    fireEvent.change(textarea, { target: { value: "Hello" } });

    // Advance timers inside act()

    await act(() => {
      vi.advanceTimersByTime(6000);
    });

    // Flush any pending updates
    await act(() => Promise.resolve());

    await waitFor(
      () => {
        expect(textarea.value).toBe("");
      },
      { timeout: 10000 }
    );

    vi.useRealTimers();
  }, 10000);
});
