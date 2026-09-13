import { useEffect, useRef, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import CarCard from "./components/CarCard";
import LazyShowroom3D from "./components/LazyShowroom3D";
import SpecTable from "./components/SpecTable";
import CompareTable from "./components/CompareTable";
import LeadForm from "./components/LeadForm";
import Footer from "./components/Footer";
import { vehicleDataDisclaimer, vehicles } from "./data/vehicles";
import { compareHash, compareIdsFromLocation } from "./compare";
import {
  applyPageMeta,
  buildPageMeta,
  vehicleIdFromLocation,
} from "./seo";

const VEHICLE_IDS = vehicles.map((vehicle) => vehicle.id);

function scrollElIntoView(
  id: string,
  options?: ScrollIntoViewOptions,
) {
  const el = document.getElementById(id);
  // jsdom (vitest) does not implement scrollIntoView.
  el?.scrollIntoView?.(options);
}


function metaForVehicleId(vehicleId: string | undefined) {
  return buildPageMeta({
    vehicleId,
    origin: window.location.origin,
    basePath: import.meta.env.BASE_URL,
  });
}

function App() {
  const [selectedVehicleId, setSelectedVehicleId] = useState(() => {
    if (typeof window === "undefined") return vehicles[0].id;
    return vehicleIdFromLocation(window.location, VEHICLE_IDS) ?? vehicles[0].id;
  });
  const [comparePair, setComparePair] = useState<[string, string]>(() => {
    if (typeof window === "undefined") return ["es", "nx"];
    return compareIdsFromLocation(window.location, VEHICLE_IDS) ?? ["es", "nx"];
  });
  const specsHeadingRef = useRef<HTMLHeadingElement>(null);
  const selectedVehicle =
    vehicles.find((vehicle) => vehicle.id === selectedVehicleId) ?? vehicles[0];

  useEffect(() => {
    const focusShowroom = () => {
      const heading = document.getElementById("showroom-heading");
      scrollElIntoView("showroom", { behavior: "smooth" });
      heading?.focus({ preventScroll: true });
    };

    const focusHome = () => {
      scrollElIntoView("home", { behavior: "auto" });
    };

    const sectionHash = () =>
      window.location.hash.replace(/^#/, "").split(/[/?&]/)[0]?.toLowerCase() ?? "";

    const syncFromLocation = (options?: { restoreView?: boolean }) => {
      const compare = compareIdsFromLocation(window.location, VEHICLE_IDS);
      if (compare) setComparePair(compare);
      const fromLocation = vehicleIdFromLocation(window.location, VEHICLE_IDS);
      if (fromLocation) {
        setSelectedVehicleId(fromLocation);
        if (options?.restoreView) {
          // Defer until layout is ready (direct load / navbar hash / back-forward).
          requestAnimationFrame(() => focusShowroom());
        }
      } else if (options?.restoreView) {
        const hash = sectionHash();
        // Empty or #home after Back from a model — land on the hero again.
        if (!hash || hash === "home") {
          requestAnimationFrame(() => focusHome());
        }
      }
      applyPageMeta(metaForVehicleId(fromLocation));
    };

    // Initial deep link: select + scroll/focus the model showroom.
    syncFromLocation({ restoreView: true });
    const onHashOrPop = () => syncFromLocation({ restoreView: true });
    window.addEventListener("hashchange", onHashOrPop);
    window.addEventListener("popstate", onHashOrPop);
    return () => {
      window.removeEventListener("hashchange", onHashOrPop);
      window.removeEventListener("popstate", onHashOrPop);
    };
  }, []);

  const scrollTo = (id: string) => {
    scrollElIntoView(id, { behavior: "smooth" });
  };

  /** Push a model hash so Back returns to the previous route (home/section). */
  const selectVehicle = (
    vehicleId: string,
    historyMode: "push" | "replace" | "none" = "push",
  ) => {
    setSelectedVehicleId(vehicleId);
    if (historyMode !== "none") {
      const next = `${window.location.pathname}${window.location.search}#${vehicleId}`;
      const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      if (current !== next) {
        if (historyMode === "push") {
          window.history.pushState(null, "", next);
        } else {
          window.history.replaceState(null, "", next);
        }
      }
    }
    applyPageMeta(metaForVehicleId(vehicleId));
  };

  const handleViewSpecs = (vehicleId: string) => {
    selectVehicle(vehicleId, "push");
    scrollTo("showroom");
  };

  const handleSelectVehicle = (vehicleId: string) => {
    selectVehicle(vehicleId, "push");
  };

  /** Clear model hash (Home) while preserving a history entry for Back. */
  const goHome = () => {
    const next = `${window.location.pathname}${window.location.search}#home`;
    const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (current !== next) {
      window.history.pushState(null, "", next);
    }
    applyPageMeta(metaForVehicleId(undefined));
    scrollTo("home");
  };

  const updateCompareHash = (leftId: string, rightId: string) => {
    const next = `${window.location.pathname}${window.location.search}${compareHash(leftId, rightId)}`;
    const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (current !== next) {
      window.history.replaceState(null, "", next);
    }
  };

  const handleCompareLeft = (vehicleId: string) => {
    setComparePair(([, right]) => {
      const nextRight = vehicleId === right
        ? (VEHICLE_IDS.find((id) => id !== vehicleId) ?? right)
        : right;
      const next: [string, string] = [vehicleId, nextRight];
      updateCompareHash(next[0], next[1]);
      return next;
    });
  };

  const handleCompareRight = (vehicleId: string) => {
    setComparePair(([left]) => {
      const nextLeft = vehicleId === left
        ? (VEHICLE_IDS.find((id) => id !== vehicleId) ?? left)
        : left;
      const next: [string, string] = [nextLeft, vehicleId];
      updateCompareHash(next[0], next[1]);
      return next;
    });
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      <a
        href="#main-content"
        className="sr-only z-[60] rounded bg-ink px-4 py-2 font-semibold text-canvas focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Navbar onNavigateHome={goHome} />
      <main id="main-content">
        <Hero
          onExploreModels={() => scrollTo("models")}
          onCompareSpecs={() => scrollTo("compare")}
        />

        <section
          id="models"
          aria-labelledby="models-heading"
          className="mx-auto max-w-6xl px-gutter py-section sm:py-section-lg"
        >
          <div className="mb-10 flex flex-col justify-between gap-5 sm:mb-12 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-kicker text-accent-bright sm:text-sm">
                The lineup
              </p>
              <h2
                id="models-heading"
                className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl"
              >
                Find your Lexus
              </h2>
              <p className="mt-4 leading-7 text-muted">
                Four distinct vehicles, one standard of craftsmanship. Choose a
                model to open its interactive 360-degree view.
              </p>
            </div>
            <p className="border-l border-accent pl-4 text-sm leading-6 text-muted sm:max-w-xs">
              <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-accent-bright">
                Demo / approximate
              </span>
              {vehicleDataDisclaimer}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {vehicles.map((vehicle) => (
              <CarCard
                key={vehicle.id}
                vehicle={vehicle}
                isSelected={vehicle.id === selectedVehicleId}
                onViewSpecs={handleViewSpecs}
              />
            ))}
          </div>
        </section>

        <section
          id="showroom"
          aria-labelledby="showroom-heading"
          className="mx-auto max-w-6xl px-gutter pb-section sm:pb-section-lg"
        >
          <div className="mb-8 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-kicker text-accent-bright sm:text-sm">
              360 showroom
            </p>
            <h2
              id="showroom-heading"
              tabIndex={-1}
              className="mt-3 text-3xl font-bold tracking-tight text-ink outline-none sm:text-4xl"
            >
              Explore every angle
            </h2>
            <p className="mt-4 leading-7 text-muted">
              The viewer uses Three.js through React Three Fiber, physically based
              materials, real-time shadows, and HDRI image-based lighting.
            </p>
          </div>

          <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Choose a vehicle for the 3D viewer">
            {vehicles.map((vehicle) => (
              <button
                key={vehicle.id}
                type="button"
                onClick={() => handleSelectVehicle(vehicle.id)}
                aria-pressed={vehicle.id === selectedVehicleId}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas ${
                  vehicle.id === selectedVehicleId
                    ? "border-accent bg-accent text-white"
                    : "border-line/15 bg-ink/5 text-muted hover:border-line/35 hover:text-ink"
                }`}
              >
                {vehicle.name.replace("Lexus ", "")}
              </button>
            ))}
          </div>

          <LazyShowroom3D vehicle={selectedVehicle} />
        </section>

        <section
          id="specs"
          aria-labelledby="specs-heading"
          className="mx-auto max-w-6xl px-gutter pb-section sm:pb-section-lg"
        >
          <div className="mb-10 max-w-2xl sm:mb-12">
            <p className="text-xs font-semibold uppercase tracking-kicker text-accent-bright sm:text-sm">
              Compare
            </p>
            <h2
              id="specs-heading"
              ref={specsHeadingRef}
              tabIndex={-1}
              className="mt-3 text-3xl font-bold tracking-tight text-ink outline-none sm:text-4xl"
            >
              Specifications
            </h2>
            <p className="mt-4 leading-7 text-muted">
              Select a model to explore its key specifications. Figures reflect
              2026 MY entry trims and are approximate for comparison.
            </p>
          </div>

          <SpecTable
            vehicles={vehicles}
            selectedVehicleId={selectedVehicleId}
            onSelectVehicle={handleSelectVehicle}
          />
        </section>

        <section
          id="compare"
          aria-labelledby="compare-heading"
          className="mx-auto max-w-6xl px-gutter pb-section sm:pb-section-lg"
        >
          <div className="mb-10 max-w-2xl sm:mb-12">
            <p className="text-xs font-semibold uppercase tracking-kicker text-accent-bright sm:text-sm">
              Side by side
            </p>
            <h2
              id="compare-heading"
              className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl"
            >
              Compare two models
            </h2>
            <p className="mt-4 leading-7 text-muted">
              Pick any two vehicles to align headline specs in one shareable
              table. Deep-link with{" "}
              <code className="rounded bg-ink/5 px-1.5 py-0.5 text-sm text-ink">
                #compare=es,nx
              </code>
              .
            </p>
          </div>

          <CompareTable
            vehicles={vehicles}
            leftId={comparePair[0]}
            rightId={comparePair[1]}
            onChangeLeft={handleCompareLeft}
            onChangeRight={handleCompareRight}
          />
        </section>
        <LeadForm />
      </main>
      <Footer />
    </div>
  );
}

export default App;
