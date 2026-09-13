import { useRef, type KeyboardEvent } from "react";
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
  { label: "Starting MSRP + DPH", getValue: (v) => priceFormatter.format(v.startingPrice) },
  { label: "Engine", getValue: (v) => v.specs.engine },
  { label: "Horsepower", getValue: (v) => `${v.specs.horsepower} hp` },
  { label: "0–60 mph", getValue: (v) => v.specs.zeroToSixty },
  { label: "Fuel economy", getValue: (v) => v.specs.mpgCombined },
  { label: "Seating", getValue: (v) => `${v.specs.seating} passengers` },
  { label: "Cargo capacity", getValue: (v) => v.specs.cargoCapacity },
  { label: "Drivetrain", getValue: (v) => v.specs.drivetrain },
];

export default function SpecTable({
  vehicles,
  selectedVehicleId,
  onSelectVehicle,
}: SpecTableProps) {
  const selectedVehicle =
    vehicles.find((vehicle) => vehicle.id === selectedVehicleId) ?? vehicles[0];
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const focusTab = (index: number) => {
    const next = (index + vehicles.length) % vehicles.length;
    onSelectVehicle(vehicles[next].id);
    tabRefs.current[next]?.focus();
  };

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        focusTab(index + 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        focusTab(index - 1);
        break;
      case "Home":
        event.preventDefault();
        focusTab(0);
        break;
      case "End":
        event.preventDefault();
        focusTab(vehicles.length - 1);
        break;
      default:
        break;
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-line/10 bg-surface shadow-2xl shadow-graphite/20">
      <div className="border-b border-line/10 p-4 sm:p-5">
        <div className="relative">
          <div
            role="tablist"
            aria-label="Choose a Lexus model"
            className="flex gap-2 overflow-x-auto overscroll-x-contain pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {vehicles.map((vehicle, index) => {
              const isActive = vehicle.id === selectedVehicle.id;
              return (
                <button
                  key={vehicle.id}
                  id={`tab-${vehicle.id}`}
                  ref={(node) => {
                    tabRefs.current[index] = node;
                  }}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="vehicle-specifications"
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => onSelectVehicle(vehicle.id)}
                  onKeyDown={(event) => onTabKeyDown(event, index)}
                  className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold uppercase tracking-wide transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
                    isActive
                      ? "bg-accent text-white"
                      : "bg-ink/5 text-muted hover:bg-ink/10 hover:text-ink"
                  }`}
                >
                  {vehicle.name.replace("Lexus ", "")}
                </button>
              );
            })}
          </div>
          {/* Scroll affordance: edge fade hints more tabs off-screen on narrow viewports */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-surface to-transparent sm:hidden"
          />
        </div>
        <p className="mt-2 text-[11px] text-muted sm:hidden">
          Swipe tabs to compare models
        </p>
      </div>

      <div
        id="vehicle-specifications"
        role="tabpanel"
        aria-labelledby={`tab-${selectedVehicle.id}`}
        tabIndex={0}
        className="min-w-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ink"
      >
        <div className="flex items-center justify-between gap-4 border-b border-line/10 px-4 py-5 sm:px-8">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-bright">
              {selectedVehicle.bodyStyle}
            </p>
            <h3 className="mt-1 break-words text-2xl font-bold tracking-tight text-ink">
              {selectedVehicle.name}
            </h3>
          </div>
          <p className="hidden max-w-xs shrink-0 text-right text-sm leading-5 text-muted sm:block">
            {selectedVehicle.tagline}
          </p>
        </div>

        {/* Mobile: stacked cards — no page-level horizontal overflow */}
        <dl className="divide-y divide-line/10 sm:hidden">
          {SPEC_ROWS.map((row, index) => (
            <div
              key={row.label}
              className={`flex items-baseline justify-between gap-4 px-4 py-3.5 ${
                index % 2 === 0 ? "bg-ink/[0.035]" : ""
              }`}
            >
              <dt className="shrink-0 text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
                {row.label}
              </dt>
              <dd className="min-w-0 break-words text-right text-sm font-semibold text-ink">
                {row.getValue(selectedVehicle)}
              </dd>
            </div>
          ))}
        </dl>

        {/* sm+: classic table (intentional horizontal scroll if needed) */}
        <div className="hidden overflow-x-auto overscroll-x-contain sm:block">
          <table className="w-full min-w-[28rem] border-collapse text-left">
            <caption className="sr-only">
              Specifications for {selectedVehicle.name}
            </caption>
            <tbody>
              {SPEC_ROWS.map((row, index) => (
                <tr
                  key={row.label}
                  className={index % 2 === 0 ? "bg-ink/[0.035]" : undefined}
                >
                  <th
                    scope="row"
                    className="w-1/3 px-8 py-4 text-sm font-medium uppercase tracking-[0.12em] text-muted"
                  >
                    {row.label}
                  </th>
                  <td className="px-8 py-4 text-base font-semibold text-ink">
                    {row.getValue(selectedVehicle)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
