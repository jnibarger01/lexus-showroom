import { useEffect, useRef, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import CarCard from "./components/CarCard";
import CarShowroom3D from "./components/CarShowroom3D";
import SpecTable from "./components/SpecTable";
import Footer from "./components/Footer";
import { vehicleDataDisclaimer, vehicles } from "./data/vehicles";
import {
  applyPageMeta,
  buildPageMeta,
  vehicleIdFromLocation,
} from "./seo";

const VEHICLE_IDS = vehicles.map((vehicle) => vehicle.id);

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
  const specsHeadingRef = useRef<HTMLHeadingElement>(null);
  const selectedVehicle =
    vehicles.find((vehicle) => vehicle.id === selectedVehicleId) ?? vehicles[0];

  useEffect(() => {
    const syncMetaFromLocation = () => {
      const fromLocation = vehicleIdFromLocation(window.location, VEHICLE_IDS);
      if (fromLocation) setSelectedVehicleId(fromLocation);
      applyPageMeta(metaForVehicleId(fromLocation));
    };
    syncMetaFromLocation();
    window.addEventListener("hashchange", syncMetaFromLocation);
    window.addEventListener("popstate", syncMetaFromLocation);
    return () => {
      window.removeEventListener("hashchange", syncMetaFromLocation);
      window.removeEventListener("popstate", syncMetaFromLocation);
    };
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const selectVehicle = (vehicleId: string) => {
    setSelectedVehicleId(vehicleId);
    const next = `${window.location.pathname}${window.location.search}#${vehicleId}`;
    const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (current !== next) {
      window.history.replaceState(null, "", next);
    }
    applyPageMeta(metaForVehicleId(vehicleId));
  };

  const handleViewSpecs = (vehicleId: string) => {
    selectVehicle(vehicleId);
    scrollTo("showroom");
  };

  const handleSelectVehicle = (vehicleId: string) => {
    selectVehicle(vehicleId);
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      <a
        href="#main-content"
        className="sr-only z-[60] rounded bg-white px-4 py-2 font-semibold text-lexus-black focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main-content">
        <Hero
          onExploreModels={() => scrollTo("models")}
          onCompareSpecs={() => scrollTo("specs")}
        />

        <section
          id="models"
          aria-labelledby="models-heading"
          className="mx-auto max-w-6xl px-6 py-20 sm:py-28"
        >
          <div className="mb-10 flex flex-col justify-between gap-5 sm:mb-12 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-lexus-accent-bright sm:text-sm">
                The lineup
              </p>
              <h2
                id="models-heading"
                className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl"
              >
                Find your Lexus
              </h2>
              <p className="mt-4 leading-7 text-lexus-silver">
                Four distinct vehicles, one standard of craftsmanship. Choose a
                model to open its interactive 360-degree view.
              </p>
            </div>
            <p className="border-l border-lexus-accent pl-4 text-sm leading-6 text-lexus-silver sm:max-w-xs">
              <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-lexus-accent-bright">
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
          className="mx-auto max-w-6xl px-6 pb-20 sm:pb-28"
        >
          <div className="mb-8 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-lexus-accent-bright sm:text-sm">
              360 showroom
            </p>
            <h2
              id="showroom-heading"
              className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl"
            >
              Explore every angle
            </h2>
            <p className="mt-4 leading-7 text-lexus-silver">
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
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-lexus-accent focus-visible:ring-offset-2 focus-visible:ring-offset-lexus-black ${
                  vehicle.id === selectedVehicleId
                    ? "border-lexus-accent bg-lexus-accent text-white"
                    : "border-white/15 bg-white/5 text-lexus-silver hover:border-white/35 hover:text-white"
                }`}
              >
                {vehicle.name.replace("Lexus ", "")}
              </button>
            ))}
          </div>

          <CarShowroom3D vehicle={selectedVehicle} />
        </section>

        <section
          id="specs"
          aria-labelledby="specs-heading"
          className="mx-auto max-w-6xl px-6 pb-20 sm:pb-28"
        >
          <div className="mb-10 max-w-2xl sm:mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-lexus-accent-bright sm:text-sm">
              Compare
            </p>
            <h2
              id="specs-heading"
              ref={specsHeadingRef}
              tabIndex={-1}
              className="mt-3 text-3xl font-bold tracking-tight text-white outline-none sm:text-4xl"
            >
              Specifications
            </h2>
            <p className="mt-4 leading-7 text-lexus-silver">
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
      </main>
      <Footer />
    </div>
  );
}

export default App;
