/**
 * Builds an original, web-optimized stylized sedan GLB used as the shared
 * showroom hero until licensed per-vehicle assets are dropped in public/models.
 * Run: node scripts/generate-hero-glb.mjs
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const positions = [];
const normals = [];
const indices = [];

function addBox(cx, cy, cz, w, h, d) {
  const hw = w / 2;
  const hh = h / 2;
  const hd = d / 2;
  const faces = [
    { n: [0, 0, 1], v: [[-hw, -hh, hd], [hw, -hh, hd], [hw, hh, hd], [-hw, hh, hd]] },
    { n: [0, 0, -1], v: [[hw, -hh, -hd], [-hw, -hh, -hd], [-hw, hh, -hd], [hw, hh, -hd]] },
    { n: [0, 1, 0], v: [[-hw, hh, hd], [hw, hh, hd], [hw, hh, -hd], [-hw, hh, -hd]] },
    { n: [0, -1, 0], v: [[-hw, -hh, -hd], [hw, -hh, -hd], [hw, -hh, hd], [-hw, -hh, hd]] },
    { n: [1, 0, 0], v: [[hw, -hh, hd], [hw, -hh, -hd], [hw, hh, -hd], [hw, hh, hd]] },
    { n: [-1, 0, 0], v: [[-hw, -hh, -hd], [-hw, -hh, hd], [-hw, hh, hd], [-hw, hh, -hd]] },
  ];

  for (const face of faces) {
    const base = positions.length / 3;
    for (const [x, y, z] of face.v) {
      positions.push(x + cx, y + cy, z + cz);
      normals.push(...face.n);
    }
    indices.push(base, base + 1, base + 2, base, base + 2, base + 3);
  }
}

function addCylinder(cx, cy, cz, radius, height, segments = 12) {
  // Wheel: cylinder along X (axle).
  const hh = height / 2;
  const ring = [];
  for (let i = 0; i < segments; i += 1) {
    const a = (i / segments) * Math.PI * 2;
    ring.push([Math.sin(a) * radius, Math.cos(a) * radius]);
  }

  for (let i = 0; i < segments; i += 1) {
    const [y0, z0] = ring[i];
    const [y1, z1] = ring[(i + 1) % segments];
    const base = positions.length / 3;
    positions.push(cx - hh, cy + y0, cz + z0, cx + hh, cy + y0, cz + z0, cx + hh, cy + y1, cz + z1, cx - hh, cy + y1, cz + z1);
    const ny = (y0 + y1) / 2;
    const nz = (z0 + z1) / 2;
    const len = Math.hypot(ny, nz) || 1;
    for (let k = 0; k < 4; k += 1) normals.push(0, ny / len, nz / len);
    indices.push(base, base + 1, base + 2, base, base + 2, base + 3);
  }

  // Caps
  for (const [sign, n] of [[-1, -1], [1, 1]]) {
    const center = positions.length / 3;
    positions.push(cx + sign * hh, cy, cz);
    normals.push(n, 0, 0);
    for (let i = 0; i < segments; i += 1) {
      const [y, z] = ring[i];
      positions.push(cx + sign * hh, cy + y, cz + z);
      normals.push(n, 0, 0);
    }
    for (let i = 0; i < segments; i += 1) {
      const a = center + 1 + i;
      const b = center + 1 + ((i + 1) % segments);
      if (sign === 1) indices.push(center, a, b);
      else indices.push(center, b, a);
    }
  }
}

const primitives = [];

function flushPrimitive(material) {
  if (indices.length === 0) return;
  primitives.push({
    material,
    positions: Float32Array.from(positions),
    normals: Float32Array.from(normals),
    indices: Uint16Array.from(indices),
  });
  positions.length = 0;
  normals.length = 0;
  indices.length = 0;
}

// Paint body — Lexus-inspired red metallic sedan silhouette.
addBox(0, 0.52, 0.05, 1.86, 0.58, 4.35);
addBox(0, 0.28, 0.08, 1.9, 0.22, 4.2);
addBox(0, 0.78, 1.55, 1.78, 0.14, 1.05);
flushPrimitive(0);

// Cabin / glass
addBox(0, 1.08, -0.15, 1.62, 0.58, 2.05);
addBox(0, 1.18, -0.22, 1.52, 0.42, 1.7);
flushPrimitive(1);

// Wheels + hubs
const wheelX = 0.82;
const wheelZ = 1.38;
const wheelY = 0.34;
for (const x of [-wheelX, wheelX]) {
  for (const z of [-wheelZ, wheelZ]) {
    addCylinder(x, wheelY, z, 0.34, 0.26, 14);
  }
}
flushPrimitive(2);

addBox(-0.82, 0.34, 1.38, 0.08, 0.22, 0.22);
addBox(0.82, 0.34, 1.38, 0.08, 0.22, 0.22);
addBox(-0.82, 0.34, -1.38, 0.08, 0.22, 0.22);
addBox(0.82, 0.34, -1.38, 0.08, 0.22, 0.22);
flushPrimitive(3);

const materials = [
  {
    name: "paint",
    pbrMetallicRoughness: {
      baseColorFactor: [0.545, 0.114, 0.173, 1],
      metallicFactor: 0.45,
      roughnessFactor: 0.28,
    },
  },
  {
    name: "glass",
    pbrMetallicRoughness: {
      baseColorFactor: [0.08, 0.09, 0.11, 1],
      metallicFactor: 0.2,
      roughnessFactor: 0.08,
    },
  },
  {
    name: "rubber",
    pbrMetallicRoughness: {
      baseColorFactor: [0.07, 0.07, 0.07, 1],
      metallicFactor: 0,
      roughnessFactor: 0.92,
    },
  },
  {
    name: "hub",
    pbrMetallicRoughness: {
      baseColorFactor: [0.72, 0.72, 0.74, 1],
      metallicFactor: 0.85,
      roughnessFactor: 0.32,
    },
  },
];

const json = {
  asset: { version: "2.0", generator: "lexus-showroom hero placeholder" },
  scene: 0,
  scenes: [{ nodes: [0] }],
  nodes: [{ mesh: 0, name: "hero-sedan" }],
  meshes: [{ name: "hero-sedan", primitives: [] }],
  materials,
  accessors: [],
  bufferViews: [],
  buffers: [{ byteLength: 0 }],
};

const chunks = [];
let byteOffset = 0;

function align4(n) {
  return (n + 3) & ~3;
}

function pushBuffer(bytes, target) {
  const view = {
    buffer: 0,
    byteOffset,
    byteLength: bytes.byteLength,
    target,
  };
  json.bufferViews.push(view);
  chunks.push(bytes);
  byteOffset += align4(bytes.byteLength);
  return json.bufferViews.length - 1;
}

for (const primitive of primitives) {
  const posView = pushBuffer(primitive.positions, 34962);
  const nrmView = pushBuffer(primitive.normals, 34962);
  const idxView = pushBuffer(primitive.indices, 34963);

  const posMin = [Infinity, Infinity, Infinity];
  const posMax = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < primitive.positions.length; i += 3) {
    for (let c = 0; c < 3; c += 1) {
      const v = primitive.positions[i + c];
      posMin[c] = Math.min(posMin[c], v);
      posMax[c] = Math.max(posMax[c], v);
    }
  }

  const posAccessor = json.accessors.length;
  json.accessors.push({
    bufferView: posView,
    componentType: 5126,
    count: primitive.positions.length / 3,
    type: "VEC3",
    min: posMin,
    max: posMax,
  });
  const nrmAccessor = json.accessors.length;
  json.accessors.push({
    bufferView: nrmView,
    componentType: 5126,
    count: primitive.normals.length / 3,
    type: "VEC3",
  });
  const idxAccessor = json.accessors.length;
  json.accessors.push({
    bufferView: idxView,
    componentType: 5123,
    count: primitive.indices.length,
    type: "SCALAR",
  });

  json.meshes[0].primitives.push({
    attributes: { POSITION: posAccessor, NORMAL: nrmAccessor },
    indices: idxAccessor,
    material: primitive.material,
  });
}

json.buffers[0].byteLength = byteOffset;

const jsonText = JSON.stringify(json);
const jsonPad = align4(jsonText.length) - jsonText.length;
const jsonBytes = Buffer.from(jsonText + " ".repeat(jsonPad), "utf8");

const bin = Buffer.alloc(byteOffset);
let cursor = 0;
for (const chunk of chunks) {
  const data = Buffer.from(chunk.buffer, chunk.byteOffset, chunk.byteLength);
  data.copy(bin, cursor);
  cursor += align4(chunk.byteLength);
}

const header = Buffer.alloc(12);
header.writeUInt32LE(0x46546c67, 0);
header.writeUInt32LE(2, 4);

const jsonChunkHeader = Buffer.alloc(8);
jsonChunkHeader.writeUInt32LE(jsonBytes.length, 0);
jsonChunkHeader.writeUInt32LE(0x4e4f534a, 4);

const binChunkHeader = Buffer.alloc(8);
binChunkHeader.writeUInt32LE(bin.length, 0);
binChunkHeader.writeUInt32LE(0x004e4942, 4);

const total = 12 + 8 + jsonBytes.length + 8 + bin.length;
header.writeUInt32LE(total, 8);

const glb = Buffer.concat([header, jsonChunkHeader, jsonBytes, binChunkHeader, bin]);

const out = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "models", "hero.glb");
writeFileSync(out, glb);
console.log(`Wrote ${out} (${glb.length} bytes)`);
