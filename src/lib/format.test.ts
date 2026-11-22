import { describe, expect, it, vi } from "vitest";
import { money, relativeDate, shortDate, truncate } from "./format";

describe("format helpers", () => {
  it("formats money as USD", () => {
    expect(money(85)).toBe("$85.00");
    expect(money(85.5)).toBe("$85.50");
  });

  it("formats dates consistently", () => {
    expect(shortDate("2026-02-01T00:00:00.000Z")).toBe("Feb 1, 2026");
  });

  it("describes relative dates", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-02-01T12:00:00.000Z"));
    expect(relativeDate("2026-02-01T00:00:00.000Z")).toBe("Today");
    expect(relativeDate("2026-02-02T00:00:00.000Z")).toBe("Tomorrow");
    expect(relativeDate("2026-01-31T00:00:00.000Z")).toBe("Yesterday");
    vi.useRealTimers();
  });

  it("truncates long strings", () => {
    expect(truncate("abcdefghij", 5)).toBe("abcde…");
    expect(truncate("abc", 5)).toBe("abc");
  });
});
