import { describe, expect, it } from "vitest";
import { vehicles } from "./data/vehicles";
import {
  bodyStyleCategory,
  filterFromLocation,
  filterHash,
  filterVehicles,
  vehicleMatchesFilter,
} from "./bodyStyleFilter";

describe("bodyStyleCategory", () => {
  it("maps Sedan to sedan and all SUV styles to suv", () => {
    expect(bodyStyleCategory("Sedan")).toBe("sedan");
    expect(bodyStyleCategory("Compact SUV")).toBe("suv");
    expect(bodyStyleCategory("SUV")).toBe("suv");
    expect(bodyStyleCategory("Full-Size SUV")).toBe("suv");
  });
});

describe("filterVehicles", () => {
  it("returns the full catalog for all", () => {
    expect(filterVehicles(vehicles, "all").map((v) => v.id)).toEqual([
      "es",
      "nx",
      "rx",
      "lx",
    ]);
  });

  it("sedan keeps ES and hides NX/RX/LX", () => {
    const ids = filterVehicles(vehicles, "sedan").map((v) => v.id);
    expect(ids).toEqual(["es"]);
    expect(ids).not.toContain("nx");
    expect(ids).not.toContain("rx");
    expect(ids).not.toContain("lx");
  });

  it("suv keeps NX/RX/LX and hides ES", () => {
    expect(filterVehicles(vehicles, "suv").map((v) => v.id)).toEqual([
      "nx",
      "rx",
      "lx",
    ]);
  });

  it("vehicleMatchesFilter respects all", () => {
    expect(vehicleMatchesFilter(vehicles[0], "all")).toBe(true);
  });
});

describe("filterFromLocation", () => {
  it("reads #filter=sedan", () => {
    expect(filterFromLocation({ hash: "#filter=sedan", search: "" })).toBe(
      "sedan",
    );
  });

  it("reads ?filter=suv query", () => {
    expect(filterFromLocation({ hash: "", search: "?filter=suv" })).toBe("suv");
  });

  it("accepts all and rejects unknown values", () => {
    expect(filterFromLocation({ hash: "#filter=all", search: "" })).toBe("all");
    expect(
      filterFromLocation({ hash: "#filter=wagon", search: "" }),
    ).toBeUndefined();
    expect(filterFromLocation({ hash: "#models", search: "" })).toBeUndefined();
  });

  it("prefers hash over query when both present", () => {
    expect(
      filterFromLocation({ hash: "#filter=sedan", search: "?filter=suv" }),
    ).toBe("sedan");
  });
});

describe("filterHash", () => {
  it("builds shareable fragments", () => {
    expect(filterHash("sedan")).toBe("#filter=sedan");
    expect(filterHash("suv")).toBe("#filter=suv");
    expect(filterHash("all")).toBe("#models");
  });
});
