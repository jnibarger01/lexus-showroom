import type { Vehicle } from "./vehicles";
import { formatUsd } from "../formatUsd";

/** Shared headline rows for SpecTable and side-by-side CompareTable. */
export const SPEC_ROWS: { label: string; getValue: (v: Vehicle) => string }[] = [
  { label: "Starting MSRP + DPH", getValue: (v) => formatUsd(v.startingPrice) },
  { label: "Engine", getValue: (v) => v.specs.engine },
  { label: "Horsepower", getValue: (v) => `${v.specs.horsepower} hp` },
  { label: "0–60 mph", getValue: (v) => v.specs.zeroToSixty },
  { label: "Fuel economy", getValue: (v) => v.specs.mpgCombined },
  { label: "Seating", getValue: (v) => `${v.specs.seating} passengers` },
  { label: "Cargo capacity", getValue: (v) => v.specs.cargoCapacity },
  { label: "Drivetrain", getValue: (v) => v.specs.drivetrain },
];
