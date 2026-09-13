import { describe, expect, it } from "vitest";
import { parseVehicleCatalog } from "./vehicleSchema";
import { vehicles } from "./vehicles";

function cloneCatalog() {
  return structuredClone(vehicles) as unknown as Record<string, unknown>[];
}

describe("vehicle catalog schema", () => {
  it("parses the live catalog", () => {
    const result = parseVehicleCatalog(vehicles);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toHaveLength(vehicles.length);
      expect(result.data.map((v) => v.id)).toEqual(["es", "nx", "rx", "lx"]);
    }
  });

  it("requires unique ids/slugs", () => {
    const catalog = cloneCatalog();
    catalog.push({ ...catalog[0], name: "Duplicate ES" });

    const result = parseVehicleCatalog(catalog);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(
        result.issues.some((issue) =>
          issue.message.includes('duplicate slug/id "es"'),
        ),
      ).toBe(true);
    }
  });

  it("requires numeric positive MSRP (startingPrice)", () => {
    const missing = cloneCatalog();
    delete missing[0].startingPrice;

    const missingResult = parseVehicleCatalog(missing);
    expect(missingResult.ok).toBe(false);
    if (!missingResult.ok) {
      expect(
        missingResult.issues.some(
          (issue) =>
            issue.path === "[0].startingPrice" &&
            issue.message.includes("MSRP"),
        ),
      ).toBe(true);
    }

    const nonPositive = cloneCatalog();
    nonPositive[0].startingPrice = 0;

    const nonPositiveResult = parseVehicleCatalog(nonPositive);
    expect(nonPositiveResult.ok).toBe(false);
    if (!nonPositiveResult.ok) {
      expect(
        nonPositiveResult.issues.some(
          (issue) =>
            issue.path === "[0].startingPrice" &&
            issue.message.includes("positive number"),
        ),
      ).toBe(true);
    }
  });

  it("rejects missing required fields", () => {
    const catalog = cloneCatalog();
    delete catalog[1].name;
    delete catalog[1].bodyStyle;

    const result = parseVehicleCatalog(catalog);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      const paths = result.issues.map((issue) => issue.path);
      expect(paths).toContain("[1].name");
      expect(paths).toContain("[1].bodyStyle");
    }
  });
});
