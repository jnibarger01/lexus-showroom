import {
  Component,
  Suspense,
  useEffect,
  useMemo,
  useState,
  type ErrorInfo,
  type ReactNode,
} from "react";
import { Canvas } from "@react-three/fiber";
import {
  Bounds,
  ContactShadows,
  Environment,
  Html,
  OrbitControls,
  useGLTF,
  useProgress,
} from "@react-three/drei";
import * as THREE from "three";
import { heroModelUrl, type Vehicle } from "../data/vehicles";

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

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl"),
    );
  } catch {
    return false;
  }
}

async function assetExists(url: string): Promise<boolean> {
  try {
    const head = await fetch(url, { method: "HEAD" });
    if (head.ok) return true;
    if (head.status === 405 || head.status === 501) {
      const ranged = await fetch(url, { headers: { Range: "bytes=0-0" } });
      return ranged.ok || ranged.status === 206;
    }
    return false;
  } catch {
    return false;
  }
}

type ModelResolveState =
  | { status: "checking"; url: null; usedFallback: false }
  | { status: "ready"; url: string; usedFallback: boolean }
  | { status: "missing"; url: null; usedFallback: false };

function useResolvedModelUrl(preferredUrl: string, fallbackUrl: string): ModelResolveState {
  const [state, setState] = useState<ModelResolveState>({
    status: "checking",
    url: null,
    usedFallback: false,
  });

  useEffect(() => {
    let cancelled = false;
    setState({ status: "checking", url: null, usedFallback: false });

    void (async () => {
      if (await assetExists(preferredUrl)) {
        if (!cancelled) {
          setState({ status: "ready", url: preferredUrl, usedFallback: false });
        }
        return;
      }
      if (preferredUrl !== fallbackUrl && (await assetExists(fallbackUrl))) {
        if (!cancelled) {
          setState({ status: "ready", url: fallbackUrl, usedFallback: true });
        }
        return;
      }
      if (!cancelled) {
        setState({ status: "missing", url: null, usedFallback: false });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [preferredUrl, fallbackUrl]);

  return state;
}

function OverlayCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#101010]/90 p-6">
      <div
        role="status"
        className="w-full max-w-sm rounded-2xl border border-white/15 bg-black/75 p-5 text-center text-white shadow-2xl backdrop-blur"
      >
        <p className="text-sm font-semibold">{title}</p>
        <div className="mt-2 text-xs leading-5 text-white/70">{children}</div>
      </div>
    </div>
  );
}

function LoadingModel() {
  const { progress } = useProgress();
  const pct = Math.min(100, Math.round(progress));

  return (
    <Html center>
      <div
        role="status"
        aria-live="polite"
        className="w-64 rounded-2xl border border-white/15 bg-black/75 p-5 text-center text-white shadow-2xl backdrop-blur"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.16em]">
          Loading 3D model
        </p>
        <div
          className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
          aria-label="3D model load progress"
        >
          <div
            className="h-full rounded-full bg-lexus-accent transition-[width] duration-200"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-2 text-[11px] tabular-nums text-white/70">{pct}%</p>
      </div>
    </Html>
  );
}

function MissingModel({
  vehicle,
  attemptedUrl,
}: {
  vehicle: Vehicle;
  attemptedUrl: string;
}) {
  return (
    <Html center>
      <div className="w-72 rounded-2xl border border-white/15 bg-black/75 p-5 text-center text-white shadow-2xl backdrop-blur">
        <p className="text-sm font-semibold">3D model unavailable</p>
        <p className="mt-2 text-xs leading-5 text-white/70">
          Could not load a GLB for {vehicle.name}. Add a licensed model at
          <code className="mt-2 block break-all rounded bg-white/10 px-2 py-1 text-[11px]">
            {vehicle.modelUrl}
          </code>
          or the shared hero at
          <code className="mt-2 block break-all rounded bg-white/10 px-2 py-1 text-[11px]">
            {heroModelUrl}
          </code>
        </p>
        <p className="sr-only">Last attempted URL: {attemptedUrl}</p>
      </div>
    </Html>
  );
}

function CarModel({ url, rotation }: { url: string; rotation: Vehicle["modelRotation"] }) {
  const gltf = useGLTF(url);

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

  return <primitive object={scene} rotation={rotation} />;
}

export default function CarShowroom3D({ vehicle }: CarShowroom3DProps) {
  const [webgl] = useState(detectWebGL);
  const resolved = useResolvedModelUrl(vehicle.modelUrl, heroModelUrl);

  useEffect(() => {
    if (resolved.status === "ready") {
      useGLTF.preload(resolved.url);
    }
  }, [resolved]);

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#101010] shadow-2xl shadow-black/30">
      <div className="flex flex-col gap-3 border-b border-white/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-lexus-accent-bright">
            Interactive 3D
          </p>
          <h3 className="mt-1 text-xl font-bold text-white">{vehicle.name}</h3>
        </div>
        <div className="min-w-0 text-xs text-lexus-silver">
          {resolved.usedFallback ? (
            <p className="mb-1 break-words text-lexus-silver">
              Showing shared hero — add{" "}
              <code className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-white/80">
                public/models/{vehicle.id}.glb
              </code>{" "}
              for this vehicle
            </p>
          ) : null}
          <p className="sm:hidden">Drag to rotate · Pinch to zoom</p>
          <p className="hidden sm:block">
            Drag to rotate · Scroll to zoom · Double-click to reset
          </p>
        </div>
      </div>

      <div
        className="relative h-[360px] touch-none overscroll-none sm:h-[520px]"
        style={{ touchAction: "none" }}
        aria-label={`Interactive 360-degree view of ${vehicle.name}`}
      >
        {!webgl ? (
          <OverlayCard title="WebGL is not available">
            <p>
              This browser or device cannot render the 3D showroom. Try a
              current browser with hardware acceleration enabled, or view the
              lineup specs below.
            </p>
          </OverlayCard>
        ) : null}

        {webgl && resolved.status === "checking" ? (
          <OverlayCard title="Finding 3D model">
            <p>Checking {vehicle.name} GLB, then the shared hero fallback…</p>
          </OverlayCard>
        ) : null}

        {webgl && resolved.status === "missing" ? (
          <OverlayCard title="3D model unavailable">
            <p>
              No GLB found for {vehicle.name}. Add a licensed file at
              <code className="mt-2 block break-all rounded bg-white/10 px-2 py-1 text-[11px] text-white">
                {vehicle.modelUrl}
              </code>
              or the shared hero at
              <code className="mt-2 block break-all rounded bg-white/10 px-2 py-1 text-[11px] text-white">
                {heroModelUrl}
              </code>
            </p>
          </OverlayCard>
        ) : null}

        {webgl && resolved.status === "ready" ? (
          <Canvas
            shadows
            dpr={[1, 1.75]}
            camera={{ position: [5.5, 2.5, 6.5], fov: 38 }}
            gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
            style={{ touchAction: "none" }}
            onCreated={({ gl }) => {
              gl.outputColorSpace = THREE.SRGBColorSpace;
              gl.toneMappingExposure = 1.05;
              gl.domElement.style.touchAction = "none";
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
                resetKey={`${vehicle.id}:${resolved.url}`}
                fallback={
                  <MissingModel vehicle={vehicle} attemptedUrl={resolved.url} />
                }
              >
                <Bounds fit clip observe margin={1.25}>
                  <CarModel
                    url={resolved.url}
                    rotation={vehicle.modelRotation}
                  />
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
              enableDamping
              dampingFactor={0.08}
              rotateSpeed={0.85}
              minDistance={3}
              maxDistance={12}
              minPolarAngle={Math.PI / 5}
              maxPolarAngle={Math.PI / 2.05}
              target={[0, 0.3, 0]}
              // One-finger rotate; two-finger pinch zoom — avoids page-scroll fights with touch-action:none
              touches={{ ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN }}
            />
          </Canvas>
        ) : null}
      </div>
    </div>
  );
}

