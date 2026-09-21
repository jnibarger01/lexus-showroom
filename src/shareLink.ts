/** Absolute URL for the current Pages route + hash (model / compare / filter). */
export function currentShareUrl(
  location: Pick<Location, "origin" | "pathname" | "search" | "hash"> = window.location,
): string {
  return `${location.origin}${location.pathname}${location.search}${location.hash}`;
}

export type CopyShareResult = "copied" | "fallback" | "failed";

/**
 * Copy `text` to the clipboard. Prefers `navigator.clipboard`; falls back to a
 * temporary textarea + `document.execCommand("copy")` when the Clipboard API
 * is missing or rejects (permissions / insecure context).
 */
export async function copyShareText(
  text: string,
  opts: {
    clipboard?: Pick<Clipboard, "writeText"> | null;
    document?: Document;
  } = {},
): Promise<CopyShareResult> {
  const clipboard =
    opts.clipboard === undefined
      ? typeof navigator !== "undefined"
        ? navigator.clipboard
        : null
      : opts.clipboard;
  const doc = opts.document ?? (typeof document !== "undefined" ? document : undefined);

  if (clipboard && typeof clipboard.writeText === "function") {
    try {
      await clipboard.writeText(text);
      return "copied";
    } catch {
      // fall through to legacy path
    }
  }

  if (!doc?.body) return "failed";

  const textarea = doc.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  textarea.style.top = "0";
  doc.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  try {
    const ok = doc.execCommand("copy");
    return ok ? "fallback" : "failed";
  } catch {
    return "failed";
  } finally {
    doc.body.removeChild(textarea);
  }
}
