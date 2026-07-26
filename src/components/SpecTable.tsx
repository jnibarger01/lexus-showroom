import type { Vehicle } from "../data/vehicles";

interface SpecTableProps {
  vehicles: Vehicle[];
  selectedVehicleId: string;
  onSelectVehicle: (vehicleId: string) => void;
}

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const SPEC_ROWS: { label: string; getValue: (v: Vehicle) => string }[] = [
  { label: "Starting Price", getValue: (v) => priceFormatter.format(v.startingPrice) },
  { label: "Engine", getValue: (v) => v.specs.engine },
  { label: "Horsepower", getValue: (v) => `${v.specs.horsepower} hp` },
  { label: "0–60 mph", getValue: (v) => v.specs.zeroToSixty },
  { label: "Fuel Economy", getValue: (v) => v.specs.mpgCombined },
  { label: "Seating", getValue: (v) => `${v.specs.seating} passengers` },
  { label: "Cargo Capacity", getValue: (v) => v.specs.cargoCapacity },
  { label: "Drivetrain", getValue: (v) => v.specs.drivetrain },
];

export default function SpecTable({
  vehicles,
  selectedVehicleId,
  onSelectVehicle,
}: SpecTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-lexus-charcoal">
      <div className="flex flex-wrap gap-2 border-b border-white/10 p-4">
        {vehicles.map((vehicle) => {
          const isActive = vehicle.id === selectedVehicleId;
          return (
            <button
              key={vehicle.id}
              type="button"
              onClick={() => onSelectVehicle(vehicle.id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-wide transition-colors ${
                isActive
                  ? "bg-lexus-accent text-white"
                  : "bg-white/5 text-lexus-silver hover:bg-white/10 hover:text-white"
              }`}
              aria-pressed={isActive}
            >
              {vehicle.name}
            </button>
          );
        })}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] border-collapse text-left">
          <tbody>
            {SPEC_ROWS.map((row, index) => {
              const vehicle = vehicles.find((v) => v.id === selectedVehicleId);
              if (!vehicle) return null;
              return (
                <tr
                  key={row.label}
                  className={index % 2 === 0 ? "bg-white/[0.03]" : ""}
                >
                  <th
                    scope="row"
                    className="w-1/3 px-6 py-4 text-sm font-medium uppercase tracking-wide text-lexus-silver/80"
                  >
                    {row.label}
                  </th>
                  <td className="px-6 py-4 text-base font-semibold text-white">
                    {row.getValue(vehicle)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
