import { describe, expect, it } from "vitest";
import {
  VEHICLE_STILL_FILES,
  vehicleStillSrc,
  vehicleStillSrcSet,
  vehicles,
} from "./vehicles";

describe("per-model stills", () => {
  it("maps each lineup vehicle to a distinct still src + srcset", () => {
    const ids = vehicles.map((v) => v.id);
    expect(ids).toEqual(["es", "nx", "rx", "lx"]);

    const srcs = vehicles.map((v) => v.stillSrc);
    expect(new Set(srcs).size).toBe(4);

    for (const vehicle of vehicles) {
      const files = VEHICLE_STILL_FILES[vehicle.id as keyof typeof VEHICLE_STILL_FILES];
      expect(files).toBeTruthy();
      expect(vehicle.stillSrc).toBe(vehicleStillSrc(vehicle.id));
      expect(vehicle.stillSrcSet).toBe(vehicleStillSrcSet(vehicle.id));
      expect(vehicle.stillSrc).toMatch(new RegExp(`/stills/${files.src}$`));
      expect(vehicle.stillSrcSet).toContain(`${files.src} 1x`);
      expect(vehicle.stillSrcSet).toContain(`${files.src2x} 2x`);
    }
  });
});
