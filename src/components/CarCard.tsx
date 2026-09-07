import type { Vehicle } from "../data/vehicles";
import Button from "./Button";

interface CarCardProps {
  vehicle: Vehicle;
  isSelected: boolean;
  onViewSpecs: (vehicleId: string) => void;
}

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default function CarCard({ vehicle, isSelected, onViewSpecs }: CarCardProps) {
  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-2xl border bg-lexus-charcoal transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/30 ${
        isSelected ? "border-lexus-accent" : "border-white/10 hover:border-white/25"
      }`}
    >
      <div
        className="relative flex h-44 items-center justify-center overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${vehicle.accentColor}70, #1a1a1a 68%)` }}
        aria-hidden="true"
      >
        <span className="absolute -right-9 -top-10 h-32 w-32 rounded-full border border-white/15" />
        <svg viewBox="0 0 200 90" className="relative h-24 w-auto transition duration-500 group-hover:scale-105">
          <path d="M12 59h176v10H12z" fill="white" opacity=".15" />
          <path d="M18 54c8-14 19-26 38-31 24-6 69-7 91 0 18 6 28 17 35 31l12 5c4 2 6 6 6 11v4H8v-5c0-6 3-10 10-12Z" fill="white" opacity=".9" />
          <path d="M57 29c18-6 59-6 78 0 9 3 18 12 23 22H35c5-10 12-19 22-22Z" fill="#2c2c2e" />
          <path d="M18 60h164" stroke={vehicle.accentColor} strokeWidth="4" />
          <circle cx="53" cy="72" r="13" fill="#0b0b0b" /><circle cx="53" cy="72" r="6" fill="#a1a1aa" />
          <circle cx="151" cy="72" r="13" fill="#0b0b0b" /><circle cx="151" cy="72" r="6" fill="#a1a1aa" />
        </svg>
        {isSelected && <span className="absolute left-4 top-4 rounded-full bg-lexus-black/75 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">Selected</span>}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-lexus-accent">{vehicle.bodyStyle}</p>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-white">{vehicle.name}</h3>
          <p className="mt-2 text-sm leading-6 text-lexus-silver">{vehicle.tagline}</p>
        </div>
        <p className="text-sm leading-6 text-lexus-silver/80">{vehicle.description}</p>
        <div className="mt-auto flex items-end justify-between gap-3 border-t border-white/10 pt-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] text-lexus-silver/70">Starting at</p>
            <p className="mt-1 text-lg font-bold text-white">{priceFormatter.format(vehicle.startingPrice)}</p>
          </div>
          <Button variant="secondary" className="shrink-0 px-4 py-2.5 text-xs" onClick={() => onViewSpecs(vehicle.id)}>
            View specs<span className="sr-only"> for {vehicle.name}</span>
          </Button>
        </div>
      </div>
    </article>
  );
}
