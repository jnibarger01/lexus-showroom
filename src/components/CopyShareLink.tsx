import { useId, useState } from "react";
import Button from "./Button";
import { copyShareText, currentShareUrl } from "../shareLink";

export interface CopyShareLinkProps {
  /** Optional label override (default: Copy link). */
  label?: string;
  className?: string;
  /** Injected for tests. */
  getUrl?: () => string;
  copyText?: typeof copyShareText;
}

export default function CopyShareLink({
  label = "Copy link",
  className = "",
  getUrl = currentShareUrl,
  copyText = copyShareText,
}: CopyShareLinkProps) {
  const statusId = useId();
  const [status, setStatus] = useState("");

  const handleCopy = async () => {
    const url = getUrl();
    const result = await copyText(url);
    if (result === "copied" || result === "fallback") {
      setStatus("Link copied");
    } else {
      setStatus(`Could not copy. URL: ${url}`);
    }
  };

  return (
    <div className={`print-hide flex flex-col items-start gap-2 ${className}`}>
      <Button
        type="button"
        variant="ghost"
        onClick={() => {
          void handleCopy();
        }}
        aria-describedby={statusId}
        data-testid="copy-share-link"
      >
        {label}
      </Button>
      <p
        id={statusId}
        role="status"
        aria-live="polite"
        className="min-h-[1.25rem] text-sm text-muted"
        data-testid="copy-share-status"
      >
        {status}
      </p>
    </div>
  );
}
