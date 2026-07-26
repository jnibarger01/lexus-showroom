import type { Vehicle } from "../data/vehicles";
import Button from "./Button";

interface CarCardProps {
  vehicle: Vehicle;
  onViewSpecs: (vehicleId: string) => void;
}

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default function CarCard({ vehicle, onViewSpecs }: CarCardProps) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-lexus-charcoal transition-transform duration-300 hover:-translate-y-1 hover:border-white/20">
      <div
        className="flex h-48 items-center justify-center"
        style={{
          background: `linear-gradient(135deg, ${vehicle.accentColor}33, transparent 70%)`,
        }}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 200 90"
          className="h-24 w-auto opacity-90"
          role="img"
          aria-label={`${vehicle.name} placeholder illustration`}
        >
          <rect
            x="10"
            y="40"
            width="180"
            height="30"
            rx="10"
            fill={vehicle.accentColor}
          />
          <path
            d="M35 40 Q60 12 100 12 Q140 12 165 40 Z"
            fill={vehicle.accentColor}
            opacity="0.75"
          />
          <circle cx="55" cy="72" r="12" fill="#0b0b0b" />
          <circle cx="150" cy="72" r="12" fill="#0b0b0b" />
        </svg>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-lexus-accent">
            {vehicle.bodyStyle}
          </p>
          <h3 className="mt-1 text-2xl font-bold text-white">
            {vehicle.name}
          </h3>
          <p className="mt-2 text-sm text-lexus-silver">{vehicle.tagline}</p>
        </div>

        <p className="text-sm leading-relaxed text-lexus-silver/80">
          {vehicle.description}
        </p>

        <div className="mt-auto flex items-center justify-between pt-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-lexus-silver/70">
              Starting at
            </p>
            <p className="text-lg font-bold text-white">
              {priceFormatter.format(vehicle.startingPrice)}
            </p>
          </div>
          <Button variant="secondary" onClick={() => onViewSpecs(vehicle.id)}>
            View Specs
          </Button>
        </div>
      </div>
    </article>
  );
}
