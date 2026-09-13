import type { BodyStyle, Vehicle, VehicleSpecs } from "./vehicles";

const BODY_STYLES: readonly BodyStyle[] = [
  "Sedan",
  "Compact SUV",
  "SUV",
  "Full-Size SUV",
];

export type VehicleSchemaIssue = {
  path: string;
  message: string;
};

export type VehicleSchemaResult =
  | { ok: true; data: Vehicle[] }
  | { ok: false; issues: VehicleSchemaIssue[] };

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isPositiveNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function isRotationTuple(value: unknown): value is [number, number, number] {
  return (
    Array.isArray(value) &&
    value.length === 3 &&
    value.every((n) => typeof n === "number" && Number.isFinite(n))
  );
}

function parseSpecs(
  value: unknown,
  path: string,
  issues: VehicleSchemaIssue[],
): VehicleSpecs | undefined {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    issues.push({ path, message: "specs must be an object" });
    return undefined;
  }

  const specs = value as Record<string, unknown>;
  let valid = true;

  for (const key of [
    "engine",
    "zeroToSixty",
    "mpgCombined",
    "cargoCapacity",
    "drivetrain",
  ] as const) {
    if (!isNonEmptyString(specs[key])) {
      issues.push({
        path: `${path}.${key}`,
        message: `${key} must be a non-empty string`,
      });
      valid = false;
    }
  }

  if (!isPositiveNumber(specs.horsepower)) {
    issues.push({
      path: `${path}.horsepower`,
      message: "horsepower must be a positive number",
    });
    valid = false;
  }

  if (!isPositiveNumber(specs.seating)) {
    issues.push({
      path: `${path}.seating`,
      message: "seating must be a positive number",
    });
    valid = false;
  }

  if (!valid) return undefined;

  return {
    engine: specs.engine as string,
    horsepower: specs.horsepower as number,
    zeroToSixty: specs.zeroToSixty as string,
    mpgCombined: specs.mpgCombined as string,
    seating: specs.seating as number,
    cargoCapacity: specs.cargoCapacity as string,
    drivetrain: specs.drivetrain as string,
  };
}

function parseVehicle(
  value: unknown,
  index: number,
  issues: VehicleSchemaIssue[],
): Vehicle | undefined {
  const path = `[${index}]`;

  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    issues.push({ path, message: "vehicle must be an object" });
    return undefined;
  }

  const row = value as Record<string, unknown>;
  let valid = true;

  // id doubles as the catalog slug used by routes / compare / lead form.
  if (!isNonEmptyString(row.id)) {
    issues.push({ path: `${path}.id`, message: "id (slug) is required" });
    valid = false;
  }

  if (!isNonEmptyString(row.name)) {
    issues.push({ path: `${path}.name`, message: "name is required" });
    valid = false;
  }

  if (
    typeof row.bodyStyle !== "string" ||
    !BODY_STYLES.includes(row.bodyStyle as BodyStyle)
  ) {
    issues.push({
      path: `${path}.bodyStyle`,
      message: `bodyStyle must be one of: ${BODY_STYLES.join(", ")}`,
    });
    valid = false;
  }

  for (const key of [
    "tagline",
    "description",
    "accentColor",
    "modelUrl",
    "stillSrc",
    "stillSrcSet",
  ] as const) {
    if (!isNonEmptyString(row[key])) {
      issues.push({
        path: `${path}.${key}`,
        message: `${key} must be a non-empty string`,
      });
      valid = false;
    }
  }

  // startingPrice is the catalog MSRP (+ DPH) field.
  if (!("startingPrice" in row)) {
    issues.push({
      path: `${path}.startingPrice`,
      message: "MSRP (startingPrice) is required",
    });
    valid = false;
  } else if (!isPositiveNumber(row.startingPrice)) {
    issues.push({
      path: `${path}.startingPrice`,
      message: "MSRP (startingPrice) must be a positive number",
    });
    valid = false;
  }

  if (!isRotationTuple(row.modelRotation)) {
    issues.push({
      path: `${path}.modelRotation`,
      message: "modelRotation must be a [number, number, number] tuple",
    });
    valid = false;
  }

  const specs = parseSpecs(row.specs, `${path}.specs`, issues);
  if (!specs) valid = false;

  if (!valid || !specs) return undefined;

  return {
    id: row.id as string,
    name: row.name as string,
    bodyStyle: row.bodyStyle as BodyStyle,
    tagline: row.tagline as string,
    description: row.description as string,
    startingPrice: row.startingPrice as number,
    accentColor: row.accentColor as string,
    modelUrl: row.modelUrl as string,
    stillSrc: row.stillSrc as string,
    stillSrcSet: row.stillSrcSet as string,
    modelRotation: row.modelRotation as [number, number, number],
    specs,
  };
}

/**
 * Validate a vehicle catalog (Zod/io-ts equivalent, hand-rolled to avoid a dep).
 * Enforces required fields, positive numeric MSRP, and unique id/slug values.
 */
export function parseVehicleCatalog(input: unknown): VehicleSchemaResult {
  const issues: VehicleSchemaIssue[] = [];

  if (!Array.isArray(input)) {
    return {
      ok: false,
      issues: [{ path: "", message: "catalog must be an array" }],
    };
  }

  const data: Vehicle[] = [];
  for (let i = 0; i < input.length; i += 1) {
    const vehicle = parseVehicle(input[i], i, issues);
    if (vehicle) data.push(vehicle);
  }

  const seen = new Set<string>();
  for (let i = 0; i < input.length; i += 1) {
    const row = input[i];
    if (row === null || typeof row !== "object" || Array.isArray(row)) continue;
    const id = (row as Record<string, unknown>).id;
    if (typeof id !== "string" || id.trim().length === 0) continue;
    if (seen.has(id)) {
      issues.push({
        path: `[${i}].id`,
        message: `duplicate slug/id "${id}"`,
      });
    } else {
      seen.add(id);
    }
  }

  if (issues.length > 0) {
    return { ok: false, issues };
  }

  return { ok: true, data };
}
