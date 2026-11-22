import { describe, expect, it } from "vitest";
import {
  finalAmountSchema,
  profileSchema,
  requestSchema,
  serviceSchema,
  signInSchema,
  signUpSchema,
} from "./schemas";

describe("auth schemas", () => {
  it("accepts a valid sign-up payload", () => {
    const result = signUpSchema.safeParse({
      name: "Nadia Islam",
      email: "nadia@fixmate.test",
      password: "FixMate123!",
      role: "customer",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an admin role from the client", () => {
    const result = signUpSchema.safeParse({
      name: "Nadia Islam",
      email: "nadia@fixmate.test",
      password: "FixMate123!",
      role: "admin",
    });
    expect(result.success).toBe(false);
  });

  it("requires uppercase and lowercase letters in a password", () => {
    const result = signUpSchema.safeParse({
      name: "Nadia Islam",
      email: "nadia@fixmate.test",
      password: "lowercase123",
      role: "customer",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.message.includes("uppercase"))).toBe(true);
    }
  });

  it("validates the sign-in email", () => {
    expect(signInSchema.safeParse({ email: "not-an-email", password: "x" }).success).toBe(false);
    expect(signInSchema.safeParse({ email: "a@b.com", password: "x" }).success).toBe(true);
  });
});

describe("booking schemas", () => {
  const valid = {
    customerPhone: "+8801711000000",
    address: "House 12, Road 5, Dhanmondi, Dhaka",
    preferredDate: "2026-12-01",
    problemDescription: "The screen cracked after a drop and the touch no longer responds.",
  };

  it("accepts a complete repair request", () => {
    expect(requestSchema.safeParse(valid).success).toBe(true);
  });

  it("requires a problem description of at least 20 characters", () => {
    const result = requestSchema.safeParse({ ...valid, problemDescription: "Broken" });
    expect(result.success).toBe(false);
  });

  it("requires a positive final amount", () => {
    expect(finalAmountSchema.safeParse({ finalAmount: 0 }).success).toBe(false);
    expect(finalAmountSchema.safeParse({ finalAmount: 85.5 }).success).toBe(true);
  });
});

describe("service and profile schemas", () => {
  const validService = {
    title: "iPhone Screen Replacement",
    category: "Smartphone",
    description: "Genuine screen replacement with warranty.",
    image: "https://example.com/screen.jpg",
    basePrice: 85,
    estimatedDuration: "2-3 hours",
    serviceMode: "Shop Drop-off",
    serviceArea: "Dhanmondi, Dhaka",
  };

  it("accepts a valid service", () => {
    expect(serviceSchema.safeParse(validService).success).toBe(true);
  });

  it("rejects an invalid category", () => {
    expect(serviceSchema.safeParse({ ...validService, category: "Drone" }).success).toBe(false);
  });

  it("allows partial profile updates", () => {
    expect(profileSchema.safeParse({ name: "Nadia Islam" }).success).toBe(true);
  });
});
