import { useMemo, useState } from "react";
import Button from "./Button";
import { shareQrPayload, shareQrSvg } from "../shareQr";

export interface ShareQrCardProps {
  className?: string;
  /** Injected for tests. */
  getUrl?: () => string;
}

/**
 * Optional QR for the current deep link. Closed by default so home first paint
 * and Lighthouse entry budgets stay clear of the QR SVG.
 */
export default function ShareQrCard({
  className = "",
  getUrl = shareQrPayload,
}: ShareQrCardProps) {
  const [open, setOpen] = useState(false);
  const url = getUrl();
  const svg = useMemo(() => (open ? shareQrSvg(url) : ""), [open, url]);

  return (
    <div
      className={`print-hide flex flex-col items-start gap-2 ${className}`}
      data-testid="share-qr-card"
    >
      <Button
        type="button"
        variant="ghost"
        aria-expanded={open}
        aria-controls="share-qr-panel"
        onClick={() => setOpen((value) => !value)}
        data-testid="share-qr-toggle"
      >
        {open ? "Hide QR" : "Show QR"}
      </Button>
      {open ? (
        <div
          id="share-qr-panel"
          className="rounded-2xl border border-line/15 bg-surface p-4"
          data-testid="share-qr-panel"
        >
          <div
            className="mx-auto h-40 w-40 text-ink [&_svg]:h-full [&_svg]:w-full"
            role="img"
            aria-label={`QR code for ${url}`}
            data-testid="share-qr-svg"
            // SVG from uqr is static markup for the current URL.
            dangerouslySetInnerHTML={{ __html: svg }}
          />
          <p className="mt-3 max-w-[16rem] break-all text-xs leading-5 text-muted">
            Scan to open this deep link on another device.
          </p>
        </div>
      ) : null}
    </div>
  );
}
