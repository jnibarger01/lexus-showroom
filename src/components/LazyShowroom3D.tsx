import { lazy, Suspense, useEffect, useRef, useState } from "react";
import type { Vehicle } from "../data/vehicles";
import Button from "./Button";

const CarShowroom3D = lazy(() => import("./CarShowroom3D"));

interface LazyShowroom3DProps {
  vehicle: Vehicle;
}

function ShowroomPlaceholder({
  vehicleName,
  onLoad,
}: {
  vehicleName: string;
  onLoad: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#101010] shadow-2xl shadow-black/30">
      <div className="flex flex-col gap-3 border-b border-white/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-lexus-accent-bright">
            Interactive 3D
          </p>
          <h3 className="mt-1 text-xl font-bold text-white">{vehicleName}</h3>
        </div>
        <p className="text-xs text-lexus-silver">
          Loads on demand so first paint stays lean
        </p>
      </div>
      <div
        className="relative flex h-[360px] flex-col items-center justify-center gap-4 bg-[radial-gradient(circle_at_50%_40%,rgba(139,29,44,0.22),transparent_55%)] px-6 sm:h-[520px]"
        aria-label={`3D viewer for ${vehicleName} — not loaded yet`}
      >
        <p className="max-w-sm text-center text-sm leading-6 text-lexus-silver">
          The WebGL canvas and model stay off the critical path until you ask
          for them (or scroll this section into view).
        </p>
        <Button type="button" variant="primary" onClick={onLoad}>
          Load 3D view
        </Button>
      </div>
    </div>
  );
}

function ShowroomChunkFallback({ vehicleName }: { vehicleName: string }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#101010] shadow-2xl shadow-black/30">
      <div className="border-b border-white/10 px-4 py-4 sm:px-5">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-lexus-accent-bright">
          Interactive 3D
        </p>
        <h3 className="mt-1 text-xl font-bold text-white">{vehicleName}</h3>
      </div>
      <div
        className="relative flex h-[360px] items-center justify-center sm:h-[520px]"
        role="status"
        aria-live="polite"
      >
        <p className="text-sm text-lexus-silver">Loading 3D viewer…</p>
      </div>
    </div>
  );
}

/**
 * Keeps Three.js / R3F / GLB off the initial JS path.
 * Mounts the canvas after intent (button) or when the showroom enters the viewport.
 */
export default function LazyShowroom3D({ vehicle }: LazyShowroom3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (shouldLoad) return;
    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "160px 0px", threshold: 0.08 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [shouldLoad]);

  return (
    <div ref={containerRef} data-testid="lazy-showroom-3d">
      {!shouldLoad ? (
        <ShowroomPlaceholder
          vehicleName={vehicle.name}
          onLoad={() => setShouldLoad(true)}
        />
      ) : (
        <Suspense
          fallback={<ShowroomChunkFallback vehicleName={vehicle.name} />}
        >
          <CarShowroom3D vehicle={vehicle} />
        </Suspense>
      )}
    </div>
  );
}
