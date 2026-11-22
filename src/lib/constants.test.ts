import { describe, expect, it } from "vitest";
import { ACTIVE_BOOKING_STATUSES, CATEGORIES, DASHBOARD_HOME, STATUS_LABEL, STATUS_TONE } from "./constants";

describe("shared constants", () => {
  it("maps every booking status to a label and a tone", () => {
    const statuses = ["requested", "accepted", "in-progress", "completed", "rejected", "cancelled"] as const;
    for (const status of statuses) {
      expect(STATUS_LABEL[status]).toBeTruthy();
      expect(STATUS_TONE[status]).toBeTruthy();
    }
  });

  it("uses the required status badge colors", () => {
    expect(STATUS_TONE.requested).toBe("blue");
    expect(STATUS_TONE.accepted).toBe("indigo");
    expect(STATUS_TONE["in-progress"]).toBe("amber");
    expect(STATUS_TONE.completed).toBe("green");
    expect(STATUS_TONE.rejected).toBe("red");
    expect(STATUS_TONE.cancelled).toBe("gray");
  });

  it("routes each role to the correct dashboard", () => {
    expect(DASHBOARD_HOME.customer).toBe("/dashboard/customer");
    expect(DASHBOARD_HOME.technician).toBe("/dashboard/technician");
    expect(DASHBOARD_HOME.admin).toBe("/dashboard/admin");
  });

  it("contains all seven repair categories", () => {
    expect(CATEGORIES).toHaveLength(7);
    expect(CATEGORIES).toContain("Smartphone");
    expect(CATEGORIES).toContain("Electrical");
  });

  it("treats only requested, accepted and in-progress jobs as active", () => {
    expect(ACTIVE_BOOKING_STATUSES).toEqual(["requested", "accepted", "in-progress"]);
  });
});
