import { Component, Suspense, useMemo, type ErrorInfo, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Bounds,
  ContactShadows,
  Environment,
  Html,
  OrbitControls,
  useGLTF,
} from "@react-three/drei";
import * as THREE from "three";
import type { Vehicle } from "../data/vehicles";

interface CarShowroom3DProps {
  vehicle: Vehicle;
}

interface ModelErrorBoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
  resetKey: string;
}

interface ModelErrorBoundaryState {
  hasError: boolean;
}

class ModelErrorBoundary extends Component<
  ModelErrorBoundaryProps,
  ModelErrorBoundaryState
> {
  state: ModelErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ModelErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Unable to load 3D vehicle model", error, info);
  }

  componentDidUpdate(previousProps: ModelErrorBoundaryProps) {
    if (
      previousProps.resetKey !== this.props.resetKey &&
      this.state.hasError
    ) {
      this.setState({ hasError: false });
    }
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

function LoadingModel() {
  return (
    <Html center>
      <div className="whitespace-nowrap rounded-full border border-white/15 bg-black/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white backdrop-blur">
        Loading 3D model
      </div>
    </Html>
  );
}

function MissingModel({ vehicle }: { vehicle: Vehicle }) {
  return (
    <Html center>
      <div className="w-64 rounded-2xl border border-white/15 bg-black/75 p-5 text-center text-white shadow-2xl backdrop-blur">
        <p className="text-sm font-semibold">3D asset required</p>
        <p className="mt-2 text-xs leading-5 text-white/70">
          Add the licensed {vehicle.name} model at
          <code className="mt-2 block break-all rounded bg-white/10 px-2 py-1 text-[11px]">
            {vehicle.modelUrl}
          </code>
        </p>
      </div>
    </Html>
  );
}

function CarModel({ vehicle }: { vehicle: Vehicle }) {
  const gltf = useGLTF(vehicle.modelUrl);

  const scene = useMemo(() => {
    const clonedScene = gltf.scene.clone(true);

    clonedScene.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;

      object.castShadow = true;
      object.receiveShadow = true;

      const materials = Array.isArray(object.material)
        ? object.material
        : [object.material];

      const tunedMaterials = materials.map((material) => {
        const clone = material.clone();

        if (
          clone instanceof THREE.MeshStandardMaterial ||
          clone instanceof THREE.MeshPhysicalMaterial
        ) {
          clone.envMapIntensity = 1.35;
          clone.needsUpdate = true;
        }

        return clone;
      });

      object.material = Array.isArray(object.material)
        ? tunedMaterials
        : tunedMaterials[0];
    });

    return clonedScene;
  }, [gltf.scene]);

  return <primitive object={scene} rotation={vehicle.modelRotation} />;
}

export default function CarShowroom3D({ vehicle }: CarShowroom3DProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#101010] shadow-2xl shadow-black/30">
      <div className="flex flex-col gap-3 border-b border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-lexus-accent">
            Interactive 3D
          </p>
          <h3 className="mt-1 text-xl font-bold text-white">{vehicle.name}</h3>
        </div>
        <p className="text-xs text-lexus-silver/75">
          Drag to rotate · Scroll to zoom · Double-click to reset
        </p>
      </div>

      <div className="relative h-[420px] sm:h-[520px]" aria-label={`Interactive 360-degree view of ${vehicle.name}`}>
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{ position: [5.5, 2.5, 6.5], fov: 38 }}
          gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
          onCreated={({ gl }) => {
            gl.outputColorSpace = THREE.SRGBColorSpace;
            gl.toneMappingExposure = 1.05;
          }}
        >
          <color attach="background" args={["#101010"]} />
          <ambientLight intensity={0.35} />
          <directionalLight
            castShadow
            intensity={2.4}
            position={[4, 7, 5]}
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />

          <Suspense fallback={<LoadingModel />}>
            <Environment preset="city" background={false} blur={0.15} />
            <ModelErrorBoundary
              resetKey={vehicle.id}
              fallback={<MissingModel vehicle={vehicle} />}
            >
              <Bounds fit clip observe margin={1.25}>
                <CarModel vehicle={vehicle} />
              </Bounds>
            </ModelErrorBoundary>
            <ContactShadows
              position={[0, -1.05, 0]}
              opacity={0.55}
              scale={14}
              blur={2.4}
              far={8}
            />
          </Suspense>

          <OrbitControls
            makeDefault
            enablePan={false}
            minDistance={3}
            maxDistance={12}
            minPolarAngle={Math.PI / 5}
            maxPolarAngle={Math.PI / 2.05}
            target={[0, 0.3, 0]}
          />
        </Canvas>
      </div>
    </div>
  );
}
