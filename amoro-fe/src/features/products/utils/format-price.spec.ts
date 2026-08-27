import { describe, expect, it } from "vitest";
import { formatPrice } from "./format-price";

describe("formatPrice", () => {
  it("formats a decimal string price as a rounded ILS amount", () => {
    expect(formatPrice("129.90")).toContain("130");
  });

  it("rounds to the nearest whole amount", () => {
    expect(formatPrice("80.40")).toContain("80");
  });
});
