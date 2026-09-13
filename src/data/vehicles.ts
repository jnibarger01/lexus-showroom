export type BodyStyle = "Sedan" | "Compact SUV" | "SUV" | "Full-Size SUV";

export interface VehicleSpecs {
  engine: string;
  horsepower: number;
  zeroToSixty: string;
  mpgCombined: string;
  seating: number;
  cargoCapacity: string;
  drivetrain: string;
}

export interface Vehicle {
  id: string;
  name: string;
  bodyStyle: BodyStyle;
  tagline: string;
  description: string;
  startingPrice: number;
  accentColor: string;
  /** BASE_URL-prefixed path to the per-vehicle GLB (`models/{id}.glb`). */
  modelUrl: string;
  modelRotation: [number, number, number];
  specs: VehicleSpecs;
}

const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path}`;

/**
 * Documented filenames under `public/models`.
 * Runtime URLs are `{import.meta.env.BASE_URL}models/<file>` so GitHub Pages
 * (`/lexus-showroom/`) and `vite` dev both resolve the same relative path.
 *
 *   es.glb  — Lexus ES
 *   nx.glb  — Lexus NX
 *   rx.glb  — Lexus RX
 *   lx.glb  — Lexus LX
 *   hero.glb — shared stylized hero (bundled). Used when a per-vehicle
 *              file is missing so the canvas still shows 3D.
 */
export const VEHICLE_MODEL_FILES = {
  es: "es.glb",
  nx: "nx.glb",
  rx: "rx.glb",
  lx: "lx.glb",
} as const;

export const HERO_MODEL_FILE = "hero.glb";

export const heroModelUrl = assetUrl(`models/${HERO_MODEL_FILE}`);

export function vehicleModelUrl(vehicleId: keyof typeof VEHICLE_MODEL_FILES | string): string {
  const file =
    vehicleId in VEHICLE_MODEL_FILES
      ? VEHICLE_MODEL_FILES[vehicleId as keyof typeof VEHICLE_MODEL_FILES]
      : HERO_MODEL_FILE;
  return assetUrl(`models/${file}`);
}

/**
 * 2026 MY entry-trim headline figures sourced from Lexus USA Newsroom
 * press releases (MSRP includes Delivery, Processing, and Handling).
 * Dealer price, packages, and EPA labels may vary — shown for showroom
 * comparison, not a final quote.
 */
export const vehicleDataDisclaimer =
  "2026 MY entry-trim specs and MSRP + DPH from Lexus USA Newsroom. Approximate for comparison; dealer price and configuration vary.";

export const vehicles: Vehicle[] = [
  {
    id: "es",
    name: "Lexus ES",
    bodyStyle: "Sedan",
    tagline: "All-electric refinement in the eighth-generation ES.",
    description:
      "The 2026 ES 350e opens the lineup with a whisper-quiet cabin, LSS+ 4.0, and a 307-mile EPA-estimated range — the first battery-electric ES for everyday luxury.",
    startingPrice: 48895,
    accentColor: "#8b1d2c",
    modelUrl: vehicleModelUrl("es"),
    modelRotation: [0, Math.PI, 0],
    specs: {
      engine: "Single electric motor (74.7-kWh)",
      horsepower: 221,
      zeroToSixty: "7.4s",
      mpgCombined: "307 mi EPA range",
      seating: 5,
      cargoCapacity: "13.3 cu ft",
      drivetrain: "FWD",
    },
  },
  {
    id: "nx",
    name: "Lexus NX",
    bodyStyle: "Compact SUV",
    tagline: "Compact luxury crossover with hybrid efficiency first.",
    description:
      "The NX 350h FWD leads the compact lineup with a 2.5L hybrid system, up to 40 mpg combined, and Lexus craftsmanship in a versatile five-seat package.",
    startingPrice: 45570,
    accentColor: "#2c2c2e",
    modelUrl: vehicleModelUrl("nx"),
    modelRotation: [0, Math.PI, 0],
    specs: {
      engine: "2.5L 4-Cylinder Hybrid",
      horsepower: 240,
      zeroToSixty: "8.2s",
      mpgCombined: "40 mpg combined",
      seating: 5,
      cargoCapacity: "22.7 cu ft",
      drivetrain: "FWD (AWD available)",
    },
  },
  {
    id: "rx",
    name: "Lexus RX",
    bodyStyle: "SUV",
    tagline: "The original luxury SUV, tuned for every drive.",
    description:
      "The RX 350 pairs a 2.4L turbo four with a quiet GA-K platform cabin, generous cargo space, and available AWD — still the benchmark midsize luxury crossover.",
    startingPrice: 52775,
    accentColor: "#8b1d2c",
    modelUrl: vehicleModelUrl("rx"),
    modelRotation: [0, Math.PI, 0],
    specs: {
      engine: "2.4L Turbo 4-Cylinder",
      horsepower: 275,
      zeroToSixty: "~7.6s",
      mpgCombined: "25 mpg combined",
      seating: 5,
      cargoCapacity: "29.6 cu ft",
      drivetrain: "FWD (AWD available)",
    },
  },
  {
    id: "lx",
    name: "Lexus LX",
    bodyStyle: "Full-Size SUV",
    tagline: "Flagship capability with first-class comfort.",
    description:
      "The LX 600 Premium brings a twin-turbo 3.4L V6, full-time 4WD, and up to seven seats — built for serious off-road duty without leaving luxury behind.",
    startingPrice: 108050,
    accentColor: "#1a1a1a",
    modelUrl: vehicleModelUrl("lx"),
    modelRotation: [0, Math.PI, 0],
    specs: {
      engine: "3.4L Twin-Turbo V6",
      horsepower: 409,
      zeroToSixty: "6.7s",
      mpgCombined: "19 mpg combined",
      seating: 7,
      cargoCapacity: "44.0 cu ft (2nd row)",
      drivetrain: "Full-time 4WD",
    },
  },
];
