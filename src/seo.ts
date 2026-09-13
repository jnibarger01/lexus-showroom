import { vehicles, type Vehicle } from "./data/vehicles";

export const PAGES_ORIGIN = "https://jnibarger01.github.io";
export const HOME_TITLE = "Lexus Showroom";
export const HOME_DESCRIPTION =
  "Lexus Showroom — explore the ES, RX, NX, and LX lineup.";

export type VehicleMetaSource = Pick<Vehicle, "id" | "name" | "tagline">;

export interface PageMeta {
  title: string;
  description: string;
  url: string;
  image?: string;
}

export interface BuildPageMetaInput {
  vehicleId?: string | null;
  origin: string;
  basePath: string;
  vehicles?: readonly VehicleMetaSource[];
  /** Public-asset path (e.g. `og.png`), resolved under origin + basePath. */
  imagePath?: string;
}

/** Join origin + Pages/Vite base path + optional hash without double slashes. */
export function joinAbsoluteUrl(
  origin: string,
  basePath: string,
  hash = "",
): string {
  const originTrim = origin.replace(/\/+$/, "");
  const trimmedBase = basePath.replace(/^\/+|\/+$/g, "");
  const path = trimmedBase ? `/${trimmedBase}/` : "/";
  const hashPart = hash
    ? hash.startsWith("#")
      ? hash
      : `#${hash}`
    : "";
  return `${originTrim}${path}${hashPart}`;
}

export function absoluteAssetUrl(
  origin: string,
  basePath: string,
  assetPath: string,
): string {
  const home = joinAbsoluteUrl(origin, basePath);
  return `${home}${assetPath.replace(/^\/+/, "")}`;
}

/** Read a vehicle id from a hash (`#rx`) or trailing path segment (`/lexus-showroom/rx`). */
export function vehicleIdFromLocation(
  locationLike: { hash: string; pathname: string },
  vehicleIds: readonly string[],
): string | undefined {
  const allowed = new Set(vehicleIds.map((id) => id.toLowerCase()));
  const hashId = locationLike.hash
    .replace(/^#/, "")
    .split(/[/?&]/)[0]
    ?.toLowerCase();
  if (hashId && allowed.has(hashId)) return hashId;

  const segments = locationLike.pathname.split("/").filter(Boolean);
  const last = segments[segments.length - 1]?.toLowerCase();
  if (last && allowed.has(last)) return last;
  return undefined;
}

export function buildPageMeta(input: BuildPageMetaInput): PageMeta {
  const list = input.vehicles ?? vehicles;
  const vehicle = input.vehicleId
    ? list.find((item) => item.id === input.vehicleId)
    : undefined;
  const image = input.imagePath
    ? absoluteAssetUrl(input.origin, input.basePath, input.imagePath)
    : undefined;

  if (!vehicle) {
    return {
      title: HOME_TITLE,
      description: HOME_DESCRIPTION,
      url: joinAbsoluteUrl(input.origin, input.basePath),
      ...(image ? { image } : {}),
    };
  }

  return {
    title: `${vehicle.name} | ${HOME_TITLE}`,
    description: vehicle.tagline,
    url: joinAbsoluteUrl(input.origin, input.basePath, vehicle.id),
    ...(image ? { image } : {}),
  };
}

function upsertMeta(
  doc: Document,
  attr: "name" | "property",
  key: string,
  content: string,
) {
  const selector = `meta[${attr}="${key}"]`;
  let el = doc.head.querySelector(selector);
  if (!el) {
    el = doc.createElement("meta");
    el.setAttribute(attr, key);
    doc.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function removeMeta(doc: Document, attr: "name" | "property", key: string) {
  doc.head.querySelector(`meta[${attr}="${key}"]`)?.remove();
}

/** Mutate document.title + description/OG/Twitter/canonical tags. */
export function applyPageMeta(meta: PageMeta, doc: Document = document) {
  doc.title = meta.title;
  upsertMeta(doc, "name", "description", meta.description);
  upsertMeta(doc, "property", "og:type", "website");
  upsertMeta(doc, "property", "og:site_name", HOME_TITLE);
  upsertMeta(doc, "property", "og:title", meta.title);
  upsertMeta(doc, "property", "og:description", meta.description);
  upsertMeta(doc, "property", "og:url", meta.url);
  upsertMeta(doc, "name", "twitter:card", meta.image ? "summary_large_image" : "summary");
  upsertMeta(doc, "name", "twitter:title", meta.title);
  upsertMeta(doc, "name", "twitter:description", meta.description);

  if (meta.image) {
    upsertMeta(doc, "property", "og:image", meta.image);
    upsertMeta(doc, "name", "twitter:image", meta.image);
  } else {
    removeMeta(doc, "property", "og:image");
    removeMeta(doc, "name", "twitter:image");
  }

  let canonical = doc.head.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = doc.createElement("link");
    canonical.setAttribute("rel", "canonical");
    doc.head.appendChild(canonical);
  }
  canonical.setAttribute("href", meta.url);
}
