# Lexus 3D model assets

Place licensed, web-optimized vehicle assets in this directory using these exact names:

- `es.glb`
- `nx.glb`
- `rx.glb`
- `lx.glb`

The viewer also supports `.gltf` files, but each vehicle's `modelUrl` in `src/data/vehicles.ts` must match the chosen filename.

## Asset requirements

- Use only models you own or are licensed to publish.
- Prefer binary `.glb` with embedded textures.
- Keep each model under roughly 15 MB for mobile delivery; use Draco or Meshopt compression where practical.
- Use physically based materials (`metalness`, `roughness`, normal maps, and clearcoat where appropriate).
- Set real-world scale, center the vehicle near the origin, place the tires on the ground plane, and orient the front toward positive Z before export.
- Limit texture resolution to 2K for most surfaces; reserve 4K only for visibly important exterior details.
- Remove hidden geometry, unused materials, cameras, lights, and animation tracks unless the showroom needs them.

The React Three Fiber viewer applies HDRI image-based lighting, ACES tone mapping, shadows, orbit controls, and environment-map intensity tuning at runtime.
