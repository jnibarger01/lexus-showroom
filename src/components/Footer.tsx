import { GITHUB_REPO_URL, SITE_LAST_UPDATED } from "../siteMeta";

const focusRing =
  "rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink";

export default function Footer() {
  return (
    <footer
      className="border-t border-line/10 bg-canvas py-10"
      data-testid="site-footer"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-gutter text-sm text-muted">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="tracking-[0.2em] text-ink">LEXUS SHOWROOM</p>
          <p className="text-xs sm:text-right">
            Last updated{" "}
            <time dateTime={SITE_LAST_UPDATED}>{SITE_LAST_UPDATED}</time>
          </p>
        </div>

        <p className="max-w-3xl leading-relaxed" data-testid="footer-disclaimer">
          Unofficial demo — not affiliated with, endorsed by, or an offer from
          Lexus or Toyota Motor Corporation. Specs and MSRP are illustrative
          2026 MY entry-trim figures (MSRP + DPH) for comparison only, not a
          dealer quote or purchase offer.
        </p>

        <p>
          <a
            href={GITHUB_REPO_URL}
            className={`underline underline-offset-4 transition-colors hover:text-ink ${focusRing}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            View source on GitHub
          </a>
        </p>
      </div>
    </footer>
  );
}
