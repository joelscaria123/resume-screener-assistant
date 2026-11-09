
import { describe, expect, it } from "vitest";
import { historyQuerySchema } from "./history-query";

describe("History Query Validation", () => {
  it("accepts valid search parameters", () => {
    const result = historyQuerySchema.safeParse({
      search: "React Developer",
      minScore: "70",
      maxScore: "95",
      page: "1",
      limit: "10",
    });

    expect(result.success).toBe(true);
  });

  it("applies default values when parameters are missing", () => {
    const result = historyQuerySchema.safeParse({});

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.search).toBe("");
      expect(result.data.page).toBe(1);
      expect(result.data.limit).toBe(10);
    }
  });

  it("converts score strings into numbers", () => {
    const result = historyQuerySchema.safeParse({
      minScore: "75",
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.minScore).toBe(75);
    }
  });

  it("rejects scores below 0", () => {
    const result = historyQuerySchema.safeParse({
      minScore: "-1",
    });

    expect(result.success).toBe(false);
  });

  it("rejects scores above 100", () => {
    const result = historyQuerySchema.safeParse({
      maxScore: "101",
    });

    expect(result.success).toBe(false);
  });

  it("rejects search text longer than 200 characters", () => {
    const result = historyQuerySchema.safeParse({
      search: "A".repeat(201),
    });

    expect(result.success).toBe(false);
  });

  it("rejects invalid pagination values", () => {
    const result = historyQuerySchema.safeParse({
      page: "0",
      limit: "100",
    });

    expect(result.success).toBe(false);
  });
});
