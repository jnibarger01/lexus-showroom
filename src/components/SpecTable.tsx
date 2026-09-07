import type { Vehicle } from "../data/vehicles";

interface SpecTableProps {
  vehicles: Vehicle[];
  selectedVehicleId: string;
  onSelectVehicle: (vehicleId: string) => void;
}

const priceFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const SPEC_ROWS: { label: string; getValue: (v: Vehicle) => string }[] = [
  { label: "Starting price", getValue: (v) => priceFormatter.format(v.startingPrice) },
  { label: "Engine", getValue: (v) => v.specs.engine },
  { label: "Horsepower", getValue: (v) => `${v.specs.horsepower} hp` },
  { label: "0–60 mph", getValue: (v) => v.specs.zeroToSixty },
  { label: "Fuel economy", getValue: (v) => v.specs.mpgCombined },
  { label: "Seating", getValue: (v) => `${v.specs.seating} passengers` },
  { label: "Cargo capacity", getValue: (v) => v.specs.cargoCapacity },
  { label: "Drivetrain", getValue: (v) => v.specs.drivetrain },
];

export default function SpecTable({ vehicles, selectedVehicleId, onSelectVehicle }: SpecTableProps) {
  const selectedVehicle = vehicles.find((vehicle) => vehicle.id === selectedVehicleId) ?? vehicles[0];

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-lexus-charcoal shadow-2xl shadow-black/20">
      <div className="border-b border-white/10 p-4 sm:p-5">
        <div role="tablist" aria-label="Choose a Lexus model" className="flex gap-2 overflow-x-auto pb-1">
          {vehicles.map((vehicle) => {
            const isActive = vehicle.id === selectedVehicle.id;
            return (
              <button
                key={vehicle.id}
                id={`tab-${vehicle.id}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls="vehicle-specifications"
                tabIndex={isActive ? 0 : -1}
                onClick={() => onSelectVehicle(vehicle.id)}
                className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold uppercase tracking-wide transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${isActive ? "bg-lexus-accent text-white" : "bg-white/5 text-lexus-silver hover:bg-white/10 hover:text-white"}`}
              >
                {vehicle.name.replace("Lexus ", "")}
              </button>
            );
          })}
        </div>
      </div>

      <div id="vehicle-specifications" role="tabpanel" aria-labelledby={`tab-${selectedVehicle.id}`}>
        <div className="flex items-center justify-between gap-4 border-b border-white/10 px-6 py-5 sm:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lexus-accent">{selectedVehicle.bodyStyle}</p>
            <h3 className="mt-1 text-2xl font-bold tracking-tight text-white">{selectedVehicle.name}</h3>
          </div>
          <p className="hidden max-w-xs text-right text-sm leading-5 text-lexus-silver sm:block">{selectedVehicle.tagline}</p>
        </div>
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">Specifications for {selectedVehicle.name}</caption>
          <tbody>
            {SPEC_ROWS.map((row, index) => (
              <tr key={row.label} className={index % 2 === 0 ? "bg-white/[0.035]" : ""}>
                <th scope="row" className="w-[46%] px-6 py-4 text-xs font-medium uppercase tracking-[0.12em] text-lexus-silver/75 sm:w-1/3 sm:px-8 sm:text-sm">
                  {row.label}
                </th>
                <td className="px-6 py-4 text-sm font-semibold text-white sm:px-8 sm:text-base">{row.getValue(selectedVehicle)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
