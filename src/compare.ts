/** Parse `#compare=es,nx` (or `?compare=es,nx`) into two distinct catalog ids. */
export function compareIdsFromLocation(
  locationLike: { hash: string; search: string },
  vehicleIds: readonly string[],
): [string, string] | undefined {
  const allowed = new Set(vehicleIds.map((id) => id.toLowerCase()));

  const fromHash = parseCompareParam(locationLike.hash.replace(/^#/, ""), allowed);
  if (fromHash) return fromHash;

  const params = new URLSearchParams(locationLike.search);
  const queryValue = params.get("compare");
  if (queryValue) {
    return parseComparePair(queryValue, allowed);
  }
  return undefined;
}

/** Build a shareable hash fragment for a two-model compare. */
export function compareHash(leftId: string, rightId: string): string {
  return `#compare=${leftId},${rightId}`;
}

function parseCompareParam(
  hashBody: string,
  allowed: Set<string>,
): [string, string] | undefined {
  const match = /^compare=([^&]+)/i.exec(hashBody);
  if (!match) return undefined;
  return parseComparePair(match[1], allowed);
}

function parseComparePair(
  raw: string,
  allowed: Set<string>,
): [string, string] | undefined {
  const parts = raw
    .split(/[,+]/)
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean);
  if (parts.length < 2) return undefined;
  const left = parts[0];
  const right = parts[1];
  if (!allowed.has(left) || !allowed.has(right) || left === right) {
    return undefined;
  }
  return [left, right];
}
