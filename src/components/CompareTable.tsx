import type { Vehicle } from "../data/vehicles";
import { SPEC_ROWS } from "../data/specRows";

interface CompareTableProps {
  vehicles: Vehicle[];
  leftId: string;
  rightId: string;
  onChangeLeft: (vehicleId: string) => void;
  onChangeRight: (vehicleId: string) => void;
}

function shortName(vehicle: Vehicle) {
  return vehicle.name.replace("Lexus ", "");
}

export default function CompareTable({
  vehicles,
  leftId,
  rightId,
  onChangeLeft,
  onChangeRight,
}: CompareTableProps) {
  const left = vehicles.find((vehicle) => vehicle.id === leftId) ?? vehicles[0];
  const right =
    vehicles.find((vehicle) => vehicle.id === rightId) ??
    vehicles.find((vehicle) => vehicle.id !== left.id) ??
    vehicles[1] ??
    vehicles[0];

  const pickOptions = (otherId: string) =>
    vehicles.filter((vehicle) => vehicle.id !== otherId);

  return (
    <div
      className="overflow-hidden rounded-2xl border border-line/10 bg-surface shadow-2xl shadow-graphite/20"
      data-testid="compare-table"
    >
      <div className="grid gap-4 border-b border-line/10 p-4 sm:grid-cols-2 sm:gap-6 sm:p-5">
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
            Model A
          </span>
          <select
            aria-label="Compare model A"
            value={left.id}
            onChange={(event) => onChangeLeft(event.target.value)}
            className="rounded-xl border border-line/15 bg-canvas px-3 py-2.5 text-sm font-semibold text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            {pickOptions(right.id).map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
            Model B
          </span>
          <select
            aria-label="Compare model B"
            value={right.id}
            onChange={(event) => onChangeRight(event.target.value)}
            className="rounded-xl border border-line/15 bg-canvas px-3 py-2.5 text-sm font-semibold text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            {pickOptions(left.id).map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Mobile: stacked columns per aligned row */}
      <div className="sm:hidden" data-testid="compare-mobile">
        <div className="grid grid-cols-2 gap-px border-b border-line/10 bg-line/10">
          <div className="bg-surface px-4 py-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-accent-bright">
              {left.bodyStyle}
            </p>
            <p className="mt-1 text-lg font-bold tracking-tight text-ink">
              {shortName(left)}
            </p>
          </div>
          <div className="bg-surface px-4 py-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-accent-bright">
              {right.bodyStyle}
            </p>
            <p className="mt-1 text-lg font-bold tracking-tight text-ink">
              {shortName(right)}
            </p>
          </div>
        </div>
        <dl>
          {SPEC_ROWS.map((row, index) => (
            <div
              key={row.label}
              className={`border-b border-line/10 ${
                index % 2 === 0 ? "bg-ink/[0.035]" : ""
              }`}
            >
              <dt className="px-4 pt-3 text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
                {row.label}
              </dt>
              <dd className="grid grid-cols-2 gap-3 px-4 pb-3.5 pt-1.5">
                <span className="min-w-0 break-words text-sm font-semibold text-ink">
                  {row.getValue(left)}
                </span>
                <span className="min-w-0 break-words text-sm font-semibold text-ink">
                  {row.getValue(right)}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Desktop: side-by-side table */}
      <div className="hidden overflow-x-auto overscroll-x-contain sm:block">
        <table className="w-full min-w-[36rem] border-collapse text-left">
          <caption className="sr-only">
            Side-by-side specifications for {left.name} and {right.name}
          </caption>
          <thead>
            <tr className="border-b border-line/10">
              <th
                scope="col"
                className="w-1/3 px-8 py-5 text-xs font-semibold uppercase tracking-[0.16em] text-muted"
              >
                Specification
              </th>
              <th scope="col" className="w-1/3 px-8 py-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-accent-bright">
                  {left.bodyStyle}
                </p>
                <p className="mt-1 text-xl font-bold tracking-tight text-ink">
                  {left.name}
                </p>
              </th>
              <th scope="col" className="w-1/3 px-8 py-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-accent-bright">
                  {right.bodyStyle}
                </p>
                <p className="mt-1 text-xl font-bold tracking-tight text-ink">
                  {right.name}
                </p>
              </th>
            </tr>
          </thead>
          <tbody>
            {SPEC_ROWS.map((row, index) => (
              <tr
                key={row.label}
                className={index % 2 === 0 ? "bg-ink/[0.035]" : undefined}
              >
                <th
                  scope="row"
                  className="px-8 py-4 text-sm font-medium uppercase tracking-[0.12em] text-muted"
                >
                  {row.label}
                </th>
                <td className="px-8 py-4 text-base font-semibold text-ink">
                  {row.getValue(left)}
                </td>
                <td className="px-8 py-4 text-base font-semibold text-ink">
                  {row.getValue(right)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
