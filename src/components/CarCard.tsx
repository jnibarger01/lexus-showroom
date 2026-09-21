import { useState } from "react";
import type { Vehicle } from "../data/vehicles";
import Button from "./Button";
import { formatUsd } from "../formatUsd";

interface CarCardProps {
  vehicle: Vehicle;
  isSelected: boolean;
  onViewSpecs: (vehicleId: string) => void;
}

export default function CarCard({ vehicle, isSelected, onViewSpecs }: CarCardProps) {
  const titleId = `car-card-title-${vehicle.id}`;
  const [stillFailed, setStillFailed] = useState(false);

  return (
    <article
      aria-labelledby={titleId}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-surface transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-graphite/20 ${
        isSelected ? "border-accent" : "border-line/10 hover:border-line/25"
      }`}
    >
      {isSelected && (
        <span className="sr-only">Currently selected in the showroom</span>
      )}

      <div
        className="relative flex h-44 items-center justify-center overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${vehicle.accentColor}70, #1a1a1a 68%)` }}
      >
        {stillFailed ? (
          <div
            role="img"
            aria-label={`${vehicle.name} — image unavailable`}
            data-testid={`still-fallback-${vehicle.id}`}
            className="flex h-full w-full flex-col items-center justify-center gap-2 px-4 text-center"
          >
            <span className="text-3xl font-bold tracking-tight text-ink/90">
              {vehicle.name.replace(/^Lexus\s+/i, "")}
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
              Image unavailable
            </span>
          </div>
        ) : (
          <img
            src={vehicle.stillSrc}
            srcSet={vehicle.stillSrcSet}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            alt={vehicle.name}
            width={640}
            height={356}
            loading="lazy"
            decoding="async"
            data-testid={`still-${vehicle.id}`}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            onError={() => setStillFailed(true)}
          />
        )}
      </div>

      {isSelected && (
        <span className="absolute left-4 top-4 rounded-full bg-canvas/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink">
          Selected
        </span>
      )}

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-bright">
            {vehicle.bodyStyle}
          </p>
          <h3 id={titleId} className="mt-2 text-2xl font-bold tracking-tight text-ink">
            {vehicle.name}
          </h3>
          <p className="mt-2 text-sm leading-6 text-muted">{vehicle.tagline}</p>
        </div>
        <p className="text-sm leading-6 text-muted">{vehicle.description}</p>
        <div className="mt-auto flex items-end justify-between gap-3 border-t border-line/10 pt-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] text-muted">
              Starting at (MSRP + DPH)
            </p>
            <p className="mt-1 text-lg font-bold text-ink">
              {formatUsd(vehicle.startingPrice)}
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-muted">
              Approx. · 2026 MY entry
            </p>
          </div>
          <Button
            type="button"
            variant="secondary"
            className="shrink-0 px-4 py-2.5 text-xs"
            onClick={() => onViewSpecs(vehicle.id)}
          >
            View specs
            <span className="sr-only"> for {vehicle.name}</span>
          </Button>
        </div>
      </div>
    </article>
  );
}
