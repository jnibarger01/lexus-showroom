import { renderSVG } from "uqr";
import { currentShareUrl } from "./shareLink";

/** Build an SVG QR for the same absolute URL CopyShareLink would copy. */
export function shareQrSvg(
  url: string = currentShareUrl(),
  opts: { ecc?: "L" | "M" | "Q" | "H"; border?: number } = {},
): string {
  return renderSVG(url, {
    ecc: opts.ecc ?? "M",
    border: opts.border ?? 2,
  });
}

/** Payload helper kept separate so tests can assert QR text == share URL. */
export function shareQrPayload(
  location: Pick<Location, "origin" | "pathname" | "search" | "hash"> = window.location,
): string {
  return currentShareUrl(location);
}
