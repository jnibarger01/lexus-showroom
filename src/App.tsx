import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import CarCard from "./components/CarCard";
import SpecTable from "./components/SpecTable";
import Footer from "./components/Footer";
import { vehicles } from "./data/vehicles";

function App() {
  const [selectedVehicleId, setSelectedVehicleId] = useState(vehicles[0].id);

  const handleViewSpecs = (vehicleId: string) => {
    setSelectedVehicleId(vehicleId);
    document.getElementById("specs")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />

      <section id="models" className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-12 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-lexus-accent">
            The Lineup
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            Find your Lexus
          </h2>
          <p className="mt-4 text-lexus-silver">
            Four distinct vehicles, one standard of craftsmanship. Compare
            specs below to see which fits your drive.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {vehicles.map((vehicle) => (
            <CarCard
              key={vehicle.id}
              vehicle={vehicle}
              onViewSpecs={handleViewSpecs}
            />
          ))}
        </div>
      </section>

      <section id="specs" className="mx-auto max-w-6xl px-6 pb-24">
        <div className="mb-12 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-lexus-accent">
            Compare
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            Specifications
          </h2>
          <p className="mt-4 text-lexus-silver">
            Select a model to see its full spec sheet.
          </p>
        </div>

        <SpecTable
          vehicles={vehicles}
          selectedVehicleId={selectedVehicleId}
          onSelectVehicle={setSelectedVehicleId}
        />
      </section>

      <Footer />
    </div>
  );
}

export default App;
