import { BODY_STYLE_FILTERS, type BodyStyleFilterId } from "./bodyStyleFilter";
import type { Vehicle } from "./data/vehicles";

export function vehicleAnnounceName(
  vehicles: readonly Pick<Vehicle, "id" | "name">[],
  id: string,
): string {
  return vehicles.find((vehicle) => vehicle.id === id)?.name ?? id;
}

export function announceVehicleSelection(
  vehicles: readonly Pick<Vehicle, "id" | "name">[],
  id: string,
): string {
  return `Showing ${vehicleAnnounceName(vehicles, id)}`;
}

export function announceBodyStyleFilter(
  filter: BodyStyleFilterId,
  matchCount: number,
): string {
  const label =
    BODY_STYLE_FILTERS.find((option) => option.id === filter)?.label ?? filter;
  if (filter === "all") {
    return `Filter: All — ${matchCount} models`;
  }
  const noun = matchCount === 1 ? "model" : "models";
  return `Filter: ${label} — ${matchCount} ${noun}`;
}

export function announceComparePair(
  vehicles: readonly Pick<Vehicle, "id" | "name">[],
  leftId: string,
  rightId: string,
): string {
  return `Comparing ${vehicleAnnounceName(vehicles, leftId)} and ${vehicleAnnounceName(vehicles, rightId)}`;
}
