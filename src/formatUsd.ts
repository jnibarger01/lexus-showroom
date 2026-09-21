/** Resolve a display locale for USD figures (never changes the currency). */
export function resolveDisplayLocale(
  locale: string | undefined | null = typeof navigator !== "undefined"
    ? navigator.language
    : undefined,
): string {
  if (locale && locale.trim()) return locale;
  return "en-US";
}

/** Format a USD amount with the visitor's locale grouping/currency style. */
export function formatUsd(
  amount: number,
  locale?: string | null,
): string {
  return new Intl.NumberFormat(resolveDisplayLocale(locale), {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}
