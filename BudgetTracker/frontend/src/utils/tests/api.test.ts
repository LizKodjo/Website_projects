import { describe, it, expect, vi, beforeEach } from "vitest";
// import { transactionAPI, budgetAPI } from '../api'
import axios from "axios";
import { budgetAPI, transactionAPI } from "../api";

// Mock axios
vi.mock("axios");
const mockedAxios = vi.mocked(axios);

describe("API Utilities", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedAxios.create.mockReturnValue({
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    } as any);
  });

  describe("transactionAPI", () => {
    it("creates transaction with correct parameters", async () => {
      const mockPost = vi.fn().mockResolvedValue({ data: {} });
      mockedAxios.create.mockReturnValue({
        post: mockPost,
      } as any);

      const transactionData = {
        amount: 100,
        description: "Test",
        category: "Food",
        type: "expense" as const,
      };
      const userId = 1;

      await transactionAPI.create(transactionData, userId);

      expect(mockPost).toHaveBeenCalledWith("/transactions/", {
        ...transactionData,
        user_id: userId,
      });
    });

    it("fetches transactions for user", async () => {
      const mockGet = vi.fn().mockResolvedValue({ data: [] });
      mockedAxios.create.mockReturnValue({
        get: mockGet,
      } as any);

      const userId = 1;

      await transactionAPI.getAll(userId);

      expect(mockGet).toHaveBeenCalledWith("/transactions/?user_id=1");
    });
  });

  describe("budgetAPI", () => {
    it("creates budget with correct parameters", async () => {
      const mockPost = vi.fn().mockResolvedValue({ data: {} });
      mockedAxios.create.mockReturnValue({
        post: mockPost,
      } as any);

      const budgetData = {
        category: "Food",
        amount: 500,
        period: "monthly" as const,
      };
      const userId = 1;

      await budgetAPI.create(budgetData, userId);

      expect(mockPost).toHaveBeenCalledWith("/budgets/", {
        ...budgetData,
        user_id: userId,
      });
    });

    it("fetches budgets for user", async () => {
      const mockGet = vi.fn().mockResolvedValue({ data: [] });
      mockedAxios.create.mockReturnValue({
        get: mockGet,
      } as any);

      const userId = 1;

      await budgetAPI.getAll(userId);

      expect(mockGet).toHaveBeenCalledWith("/budgets/?user_id=1");
    });
  });
});
