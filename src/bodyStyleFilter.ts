import type { BodyStyle, Vehicle } from "./data/vehicles";

/** Lineup chip filters: Sedan vs SUV (all Compact/mid/full SUV body styles). */
export type BodyStyleFilterId = "all" | "sedan" | "suv";

export const BODY_STYLE_FILTERS: ReadonlyArray<{
  id: BodyStyleFilterId;
  label: string;
}> = [
  { id: "all", label: "All" },
  { id: "sedan", label: "Sedan" },
  { id: "suv", label: "SUV" },
];

/** Map catalog bodyStyle values onto the coarse Sedan / SUV chips. */
export function bodyStyleCategory(bodyStyle: BodyStyle): "sedan" | "suv" {
  return bodyStyle === "Sedan" ? "sedan" : "suv";
}

export function vehicleMatchesFilter(
  vehicle: Pick<Vehicle, "bodyStyle">,
  filter: BodyStyleFilterId,
): boolean {
  if (filter === "all") return true;
  return bodyStyleCategory(vehicle.bodyStyle) === filter;
}

export function filterVehicles<T extends Pick<Vehicle, "bodyStyle">>(
  list: readonly T[],
  filter: BodyStyleFilterId,
): T[] {
  return list.filter((vehicle) => vehicleMatchesFilter(vehicle, filter));
}

const FILTER_IDS = new Set<BodyStyleFilterId>(["all", "sedan", "suv"]);

/** Parse `#filter=sedan` (or `?filter=sedan`) into a chip id. */
export function filterFromLocation(
  locationLike: { hash: string; search: string },
): BodyStyleFilterId | undefined {
  const fromHash = parseFilterParam(locationLike.hash.replace(/^#/, ""));
  if (fromHash) return fromHash;

  const params = new URLSearchParams(locationLike.search);
  const queryValue = params.get("filter");
  if (queryValue) {
    return normalizeFilterId(queryValue);
  }
  return undefined;
}

/** Build a shareable hash fragment for a lineup body-style filter. */
export function filterHash(filter: BodyStyleFilterId): string {
  if (filter === "all") return "#models";
  return `#filter=${filter}`;
}

function parseFilterParam(hashBody: string): BodyStyleFilterId | undefined {
  const match = /^filter=([^&/?]+)/i.exec(hashBody);
  if (!match) return undefined;
  return normalizeFilterId(match[1]);
}

function normalizeFilterId(raw: string): BodyStyleFilterId | undefined {
  const id = raw.trim().toLowerCase() as BodyStyleFilterId;
  return FILTER_IDS.has(id) ? id : undefined;
}
