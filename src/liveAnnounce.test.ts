import { describe, expect, it } from "vitest";
import {
  announceBodyStyleFilter,
  announceComparePair,
  announceVehicleSelection,
} from "./liveAnnounce";

const vehicles = [
  { id: "es", name: "Lexus ES" },
  { id: "nx", name: "Lexus NX" },
  { id: "rx", name: "Lexus RX" },
];

describe("liveAnnounce", () => {
  it("announces vehicle selection", () => {
    expect(announceVehicleSelection(vehicles, "rx")).toBe("Showing Lexus RX");
  });

  it("announces filter with count", () => {
    expect(announceBodyStyleFilter("sedan", 1)).toBe("Filter: Sedan — 1 model");
    expect(announceBodyStyleFilter("all", 4)).toBe("Filter: All — 4 models");
  });

  it("announces compare pair", () => {
    expect(announceComparePair(vehicles, "es", "nx")).toBe(
      "Comparing Lexus ES and Lexus NX",
    );
  });
});
