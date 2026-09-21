import type { Vehicle } from "./data/vehicles";

export type NetworkInformationLike = {
  saveData?: boolean;
  effectiveType?: string;
};

export function shouldPrefetchStills(
  connection: NetworkInformationLike | null | undefined = readNavigatorConnection(),
): boolean {
  if (!connection) return true;
  if (connection.saveData) return false;
  const effective = connection.effectiveType?.toLowerCase();
  if (effective === "slow-2g" || effective === "2g") return false;
  return true;
}

export function readNavigatorConnection(): NetworkInformationLike | null {
  if (typeof navigator === "undefined") return null;
  const nav = navigator as Navigator & {
    connection?: NetworkInformationLike;
    mozConnection?: NetworkInformationLike;
    webkitConnection?: NetworkInformationLike;
  };
  return nav.connection ?? nav.mozConnection ?? nav.webkitConnection ?? null;
}

/** 1x + 2x still URLs for every vehicle except the selected one. */
export function siblingStillUrls(
  vehicles: readonly Pick<Vehicle, "id" | "stillSrc" | "stillSrcSet">[],
  selectedId: string,
): string[] {
  const urls = new Set<string>();
  for (const vehicle of vehicles) {
    if (vehicle.id === selectedId) continue;
    urls.add(vehicle.stillSrc);
    for (const part of vehicle.stillSrcSet.split(",")) {
      const url = part.trim().split(/\s+/)[0];
      if (url) urls.add(url);
    }
  }
  return [...urls];
}

export type PrefetchImage = {
  new (): { src: string };
};

/** Warm the HTTP cache via Image() loads (no DOM attach). */
export function prefetchStillUrls(
  urls: readonly string[],
  ImageCtor: PrefetchImage = Image as unknown as PrefetchImage,
): void {
  for (const url of urls) {
    const image = new ImageCtor();
    image.src = url;
  }
}

export function prefetchSiblingStills(
  vehicles: readonly Pick<Vehicle, "id" | "stillSrc" | "stillSrcSet">[],
  selectedId: string,
  opts: {
    connection?: NetworkInformationLike | null;
    ImageCtor?: PrefetchImage;
    schedule?: (cb: () => void) => void;
  } = {},
): string[] {
  if (!shouldPrefetchStills(opts.connection)) return [];
  const urls = siblingStillUrls(vehicles, selectedId);
  const run = () => prefetchStillUrls(urls, opts.ImageCtor);
  if (opts.schedule) {
    opts.schedule(run);
  } else {
    const ric = (globalThis as typeof globalThis & {
      requestIdleCallback?: (cb: () => void) => number;
    }).requestIdleCallback;
    if (typeof ric === "function") {
      ric(run);
    } else {
      globalThis.setTimeout(run, 0);
    }
  }
  return urls;
}
