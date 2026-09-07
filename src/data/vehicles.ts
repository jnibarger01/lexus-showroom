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
  modelUrl: string;
  modelRotation: [number, number, number];
  specs: VehicleSpecs;
}

const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path}`;

export const vehicles: Vehicle[] = [
  {
    id: "es",
    name: "Lexus ES",
    bodyStyle: "Sedan",
    tagline: "Effortless elegance, refined for the everyday drive.",
    description:
      "The ES pairs a smooth, quiet ride with sharp styling and an intuitive cabin, making every commute feel like an occasion.",
    startingPrice: 43125,
    accentColor: "#8b1d2c",
    modelUrl: assetUrl("models/es.glb"),
    modelRotation: [0, Math.PI, 0],
    specs: {
      engine: "2.5L 4-Cylinder",
      horsepower: 203,
      zeroToSixty: "8.1s",
      mpgCombined: "29 combined",
      seating: 5,
      cargoCapacity: "16.7 cu ft",
      drivetrain: "FWD",
    },
  },
  {
    id: "nx",
    name: "Lexus NX",
    bodyStyle: "Compact SUV",
    tagline: "Bold proportions built for the modern commute.",
    description:
      "Compact on the outside, spacious within, the NX brings Lexus craftsmanship and available hybrid efficiency to a versatile SUV.",
    startingPrice: 39685,
    accentColor: "#2c2c2e",
    modelUrl: assetUrl("models/nx.glb"),
    modelRotation: [0, Math.PI, 0],
    specs: {
      engine: "2.5L 4-Cylinder Hybrid",
      horsepower: 239,
      zeroToSixty: "7.2s",
      mpgCombined: "39 combined",
      seating: 5,
      cargoCapacity: "22.7 cu ft",
      drivetrain: "AWD available",
    },
  },
  {
    id: "rx",
    name: "Lexus RX",
    bodyStyle: "SUV",
    tagline: "The original luxury SUV, reimagined for today.",
    description:
      "The RX blends a striking silhouette with a whisper-quiet cabin and advanced safety tech, all wrapped in a ride that feels planted at any speed.",
    startingPrice: 48800,
    accentColor: "#8b1d2c",
    modelUrl: assetUrl("models/rx.glb"),
    modelRotation: [0, Math.PI, 0],
    specs: {
      engine: "2.4L Turbo 4-Cylinder",
      horsepower: 275,
      zeroToSixty: "7.3s",
      mpgCombined: "27 combined",
      seating: 5,
      cargoCapacity: "29.6 cu ft",
      drivetrain: "AWD available",
    },
  },
  {
    id: "lx",
    name: "Lexus LX",
    bodyStyle: "Full-Size SUV",
    tagline: "Uncompromising capability, first-class comfort.",
    description:
      "Built on legendary off-road architecture and finished with premium materials throughout, the LX is ready for any terrain without sacrificing refinement.",
    startingPrice: 89900,
    accentColor: "#1a1a1a",
    modelUrl: assetUrl("models/lx.glb"),
    modelRotation: [0, Math.PI, 0],
    specs: {
      engine: "3.4L Twin-Turbo V6",
      horsepower: 409,
      zeroToSixty: "6.7s",
      mpgCombined: "19 combined",
      seating: 8,
      cargoCapacity: "40.8 cu ft",
      drivetrain: "4WD",
    },
  },
];
