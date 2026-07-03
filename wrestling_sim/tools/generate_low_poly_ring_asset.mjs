import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const outDir = new URL('../assets/ring/', import.meta.url);
mkdirSync(outDir, { recursive: true });

const materials = ['mat_white', 'line_black'];
const vertices = [];
const faces = [];
const faceMaterials = [];

function materialIndex(name) {
  return materials.indexOf(name);
}

const MAT_WHITE = materialIndex('mat_white');
const MAT_BLACK = materialIndex('line_black');

function addBox(center, size, material) {
  const [cx, cy, cz] = center;
  const [sx, sy, sz] = size;
  const x0 = cx - sx / 2;
  const x1 = cx + sx / 2;
  const y0 = cy - sy / 2;
  const y1 = cy + sy / 2;
  const z0 = cz - sz / 2;
  const z1 = cz + sz / 2;
  const base = vertices.length + 1;

  vertices.push(
    [x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0],
    [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]
  );

  const cubeFaces = [
    [base, base + 1, base + 2, base + 3],
    [base + 4, base + 7, base + 6, base + 5],
    [base, base + 4, base + 5, base + 1],
    [base + 1, base + 5, base + 6, base + 2],
    [base + 2, base + 6, base + 7, base + 3],
    [base + 3, base + 7, base + 4, base]
  ];

  for (const face of cubeFaces) {
    faces.push(face);
    faceMaterials.push(material);
  }
}

function buildRing() {
  addBox([0, 0, 0], [10.0, 10.0, 0.18], MAT_WHITE);

  addBox([0, -5.55, -0.02], [11.4, 0.35, 0.28], MAT_BLACK);
  addBox([0, 5.55, -0.02], [11.4, 0.35, 0.28], MAT_BLACK);
  addBox([-5.55, 0, -0.02], [0.35, 11.4, 0.28], MAT_BLACK);
  addBox([5.55, 0, -0.02], [0.35, 11.4, 0.28], MAT_BLACK);

  addBox([0, -5.03, 0.12], [10.1, 0.07, 0.04], MAT_BLACK);
  addBox([0, 5.03, 0.12], [10.1, 0.07, 0.04], MAT_BLACK);
  addBox([-5.03, 0, 0.12], [0.07, 10.1, 0.04], MAT_BLACK);
  addBox([5.03, 0, 0.12], [0.07, 10.1, 0.04], MAT_BLACK);

  addBox([0, -4.55, 0.12], [9.1, 0.035, 0.025], MAT_BLACK);
  addBox([0, 4.55, 0.12], [9.1, 0.035, 0.025], MAT_BLACK);
  addBox([-4.55, 0, 0.12], [0.035, 9.1, 0.025], MAT_BLACK);
  addBox([4.55, 0, 0.12], [0.035, 9.1, 0.025], MAT_BLACK);

  const ropePositions = [-5.9, -5.65, -5.4];
  for (const y of ropePositions) {
    addBox([0, y, 0.62], [10.7, 0.07, 0.07], MAT_BLACK);
    addBox([0, -y, 0.62], [10.7, 0.07, 0.07], MAT_BLACK);
  }

  for (const x of ropePositions) {
    addBox([x, 0, 0.62], [0.07, 10.7, 0.07], MAT_BLACK);
    addBox([-x, 0, 0.62], [0.07, 10.7, 0.07], MAT_BLACK);
  }

  for (const cx of [-5.35, 5.35]) {
    for (const cy of [-5.35, 5.35]) {
      const sx = cx > 0 ? 1 : -1;
      const sy = cy > 0 ? 1 : -1;

      addBox([cx, cy, 0.62], [0.82, 0.82, 0.22], MAT_BLACK);
      addBox([cx, cy, 0.74], [0.66, 0.66, 0.22], MAT_WHITE);
      addBox([cx + sx * 0.48, cy + sy * 0.48, 0.48], [0.9, 0.16, 0.16], MAT_BLACK);
      addBox([cx + sx * 0.95, cy + sy * 0.95, 0.45], [0.34, 0.34, 0.9], MAT_BLACK);
      addBox([cx + sx * 0.95, cy + sy * 0.95, 0.93], [0.46, 0.46, 0.12], MAT_BLACK);
    }
  }
}

function writeObj() {
  const lines = ['mtllib low_poly_top_down_ring_v1.mtl', 'o low_poly_top_down_wrestling_ring'];

  for (const vertex of vertices) {
    lines.push(`v ${vertex[0].toFixed(4)} ${vertex[1].toFixed(4)} ${vertex[2].toFixed(4)}`);
  }

  let activeMaterial = null;
  for (let index = 0; index < faces.length; index += 1) {
    const materialName = materials[faceMaterials[index]];
    if (materialName !== activeMaterial) {
      lines.push(`usemtl ${materialName}`);
      activeMaterial = materialName;
    }
    lines.push(`f ${faces[index].join(' ')}`);
  }

  writeFileSync(join(outDir.pathname, 'low_poly_top_down_ring_v1.obj'), `${lines.join('\n')}\n`);
}

function writeMtl() {
  const content = `newmtl mat_white
Kd 1.000 1.000 1.000
Ka 1.000 1.000 1.000
Ks 0.000 0.000 0.000

newmtl line_black
Kd 0.000 0.000 0.000
Ka 0.000 0.000 0.000
Ks 0.000 0.000 0.000
`;

  writeFileSync(join(outDir.pathname, 'low_poly_top_down_ring_v1.mtl'), content);
}

buildRing();
writeObj();
writeMtl();

console.log('Generated low poly top down ring OBJ and MTL in wrestling_sim/assets/ring/.');
