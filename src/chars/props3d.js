// 3D Voxel Burger/Sahur Weapons, 3-Tier Poor-vs-Rich McDonald's Shop Stations, Golden Burger Trophies, Gear,
// Sesame Burger-Bun Bounce Cloud & 2D 16x16 Pixel Icons for JJ & Mikey vs Tung Tung Sahur: McDonald's Burger Battle 3D!
// Zero CJK text, metalness <= 0.20 on all materials.

import * as THREE from '../../vendor/three.module.min.js';
import { WEAPONS, resolveBossId, resolveWeaponId } from '../data/catalog.js';

const UNIT_BOX = new THREE.BoxGeometry(1, 1, 1);
const BASE_POS = UNIT_BOX.attributes.position;
const BASE_NORM = UNIT_BOX.attributes.normal;
const BASE_INDEX = UNIT_BOX.index;

const _mat4 = new THREE.Matrix4();
const _normMat = new THREE.Matrix3();
const _pos = new THREE.Vector3();
const _quat = new THREE.Quaternion();
const _euler = new THREE.Euler();
const _scale = new THREE.Vector3();
const _v3 = new THREE.Vector3();
const _color = new THREE.Color();

let sharedMatteMaterial = null;
let sharedFlashMaterial = null;
const glowMaterialCache = new Map();
const iconDataUrlCache = new Map();

export function getMatteVoxelMaterial() {
  if (!sharedMatteMaterial) {
    sharedMatteMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      vertexColors: true,
      roughness: 0.66,
      metalness: 0.08,
      emissive: new THREE.Color(0x181c26),
      emissiveIntensity: 0.16,
    });
  }
  return sharedMatteMaterial;
}

export function getGlowVoxelMaterial(emissiveHex = 0xffc940, intensity = 0.34) {
  const clampedIntensity = Math.max(0.15, Math.min(0.44, Number(intensity) || 0.34));
  const key = `${emissiveHex}:${clampedIntensity.toFixed(2)}`;
  let mat = glowMaterialCache.get(key);
  if (!mat) {
    mat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      vertexColors: true,
      roughness: 0.36,
      metalness: 0.16,
      emissive: new THREE.Color(emissiveHex),
      emissiveIntensity: clampedIntensity,
    });
    glowMaterialCache.set(key, mat);
  }
  return mat;
}

export function getFlashVoxelMaterial() {
  if (!sharedFlashMaterial) {
    sharedFlashMaterial = new THREE.MeshStandardMaterial({
      color: 0xfff9db,
      roughness: 0.32,
      metalness: 0.12,
      emissive: new THREE.Color(0xffe066),
      emissiveIntensity: 0.44,
    });
  }
  return sharedFlashMaterial;
}

export function createSafeSpriteMaterial(options = {}) {
  return new THREE.SpriteMaterial({
    transparent: true,
    depthWrite: false,
    ...options,
    toneMapped: false,
    fog: false,
  });
}

export function mergeVoxelBoxes(boxes) {
  const count = boxes.length;
  const vertCount = count * 24;
  const idxCount = count * 36;

  const positions = new Float32Array(vertCount * 3);
  const normals = new Float32Array(vertCount * 3);
  const colors = new Float32Array(vertCount * 3);
  const indices = vertCount > 65535 ? new Uint32Array(idxCount) : new Uint16Array(idxCount);

  for (let i = 0; i < count; i++) {
    const b = boxes[i];
    const [sx, sy, sz] = b.s;
    const [px, py, pz] = b.p;
    _pos.set(px, py, pz);
    if (b.r) {
      _euler.set(b.r[0] || 0, b.r[1] || 0, b.r[2] || 0);
      _quat.setFromEuler(_euler);
    } else {
      _quat.identity();
    }
    _scale.set(sx, sy, sz);
    _mat4.compose(_pos, _quat, _scale);
    _normMat.getNormalMatrix(_mat4);

    _color.set(b.c !== undefined ? b.c : 0xffffff);
    const boost = b.glow ? 1.62 : 1.0;
    const cr = _color.r * boost;
    const cg = _color.g * boost;
    const cb = _color.b * boost;

    const vBase = i * 24;
    for (let v = 0; v < 24; v++) {
      const outIdx = (vBase + v) * 3;
      _v3.fromBufferAttribute(BASE_POS, v).applyMatrix4(_mat4);
      positions[outIdx] = _v3.x;
      positions[outIdx + 1] = _v3.y;
      positions[outIdx + 2] = _v3.z;

      _v3.fromBufferAttribute(BASE_NORM, v).applyMatrix3(_normMat).normalize();
      normals[outIdx] = _v3.x;
      normals[outIdx + 1] = _v3.y;
      normals[outIdx + 2] = _v3.z;

      colors[outIdx] = cr;
      colors[outIdx + 1] = cg;
      colors[outIdx + 2] = cb;
    }

    const iBase = i * 36;
    for (let k = 0; k < 36; k++) {
      indices[iBase + k] = vBase + BASE_INDEX.getX(k);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geo.setIndex(new THREE.BufferAttribute(indices, 1));
  geo.computeBoundingBox();
  geo.computeBoundingSphere();
  return geo;
}

export function buildVoxelGroup(boxes, opts = {}) {
  const {
    name = 'voxel_group',
    glowEmissive = 0xffc940,
    glowIntensity = 0.34,
    castShadow = false,
    receiveShadow = false,
    singleMesh = true,
    userData = null,
  } = opts;

  const group = new THREE.Group();
  group.name = name;
  if (userData) Object.assign(group.userData, userData);

  const meshes = [];
  if (singleMesh && boxes.length > 0) {
    let glowCount = 0;
    for (let i = 0; i < boxes.length; i++) {
      if (boxes[i].glow) glowCount++;
    }
    const allGlow = glowCount === boxes.length;
    const geo = mergeVoxelBoxes(boxes);
    const mat = allGlow
      ? getGlowVoxelMaterial(glowEmissive, glowIntensity)
      : getMatteVoxelMaterial();
    const mesh = new THREE.Mesh(geo, mat);
    mesh.name = `${name}_mesh`;
    mesh.castShadow = castShadow;
    mesh.receiveShadow = receiveShadow;
    mesh.userData.baseMaterial = mat;
    if (userData) Object.assign(mesh.userData, userData);
    group.add(mesh);
    meshes.push(mesh);
    group.userData.voxelMeshes = meshes;
    return group;
  }

  const matteBoxes = [];
  const glowBoxes = [];
  for (let i = 0; i < boxes.length; i++) {
    if (boxes[i].glow) glowBoxes.push(boxes[i]);
    else matteBoxes.push(boxes[i]);
  }

  if (matteBoxes.length > 0) {
    const matteGeo = mergeVoxelBoxes(matteBoxes);
    const matteMat = getMatteVoxelMaterial();
    const matteMesh = new THREE.Mesh(matteGeo, matteMat);
    matteMesh.name = `${name}_matte`;
    matteMesh.castShadow = castShadow;
    matteMesh.receiveShadow = receiveShadow;
    matteMesh.userData.baseMaterial = matteMat;
    if (userData) Object.assign(matteMesh.userData, userData);
    group.add(matteMesh);
    meshes.push(matteMesh);
  }

  if (glowBoxes.length > 0) {
    const glowGeo = mergeVoxelBoxes(glowBoxes);
    const glowMat = getGlowVoxelMaterial(glowEmissive, glowIntensity);
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);
    glowMesh.name = `${name}_glow`;
    glowMesh.castShadow = castShadow;
    glowMesh.receiveShadow = receiveShadow;
    glowMesh.userData.baseMaterial = glowMat;
    if (userData) Object.assign(glowMesh.userData, userData);
    group.add(glowMesh);
    meshes.push(glowMesh);
  }

  group.userData.voxelMeshes = meshes;
  return group;
}

// ---------------------------------------------------------------------------
// 1. 3D Voxel Burger & Sahur Weapons (all 5 canonical WEAPONS in catalog.js)
// Origin (0,0,0) sits cleanly in JJ's right hand grip; weapon extends +Y
// ---------------------------------------------------------------------------

function getWeaponBoxes(rawWeaponId) {
  const weaponId = resolveWeaponId(rawWeaponId);
  switch (weaponId) {
    case 'wooden_kentungan_bat':
      // Golden Burger Spatula & Sahur Bat (stainless/gold burger flipper blade with grill slots + sizzling cheeseburger patty on top & teakwood Sahur grip)
      return {
        glowEmissive: 0xffc038,
        glowIntensity: 0.28,
        boxes: [
          // Warm teakwood Kentungan Sahur grip & golden pommel
          { s: [0.13, 0.36, 0.13], p: [0, 0.04, 0], c: 0x8f5a2a },
          { s: [0.17, 0.10, 0.17], p: [0, -0.14, 0], c: 0xffd43b, glow: true },
          { s: [0.15, 0.08, 0.15], p: [0, 0.22, 0], c: 0xe03131 },
          // Angled stainless neck & wide golden/silver slotted burger spatula blade
          { s: [0.10, 0.18, 0.08], p: [0, 0.34, 0.03], r: [-0.25, 0, 0], c: 0xdee2e6, glow: true },
          { s: [0.34, 0.42, 0.06], p: [0, 0.62, 0.06], c: 0xffd43b, glow: true },
          { s: [0.28, 0.34, 0.07], p: [0, 0.62, 0.06], c: 0xf8f9fa, glow: true },
          // Grill slots on spatula blade
          { s: [0.04, 0.24, 0.08], p: [-0.08, 0.62, 0.06], c: 0x495057 },
          { s: [0.04, 0.24, 0.08], p: [0, 0.62, 0.06], c: 0x495057 },
          { s: [0.04, 0.24, 0.08], p: [0.08, 0.62, 0.06], c: 0x495057 },
          // Sizzling Cheeseburger Patty & melted cheddar slice perched on the flipper!
          { s: [0.24, 0.08, 0.24], p: [0, 0.86, 0.06], c: 0x6e421b },
          { s: [0.26, 0.05, 0.26], p: [0, 0.92, 0.06], c: 0xffd43b, glow: true },
          { s: [0.22, 0.07, 0.22], p: [0, 0.97, 0.06], c: 0xe69938, glow: true },
        ],
      };

    case 'bronze_temple_gong':
      // Crispy Fries Fryer Gong (red McDonald's fry carton with golden French fries & glowing bronze gong disc)
      return {
        glowEmissive: 0xff922b,
        glowIntensity: 0.34,
        boxes: [
          // Red-and-gold fryer handle
          { s: [0.12, 0.50, 0.12], p: [0, 0.12, 0], c: 0xe03131 },
          { s: [0.18, 0.12, 0.18], p: [0, -0.15, 0], c: 0xffd43b, glow: true },
          { s: [0.16, 0.08, 0.16], p: [0, 0.36, 0], c: 0xffd43b, glow: true },
          // Glowing Bronze Fryer Gong Disc behind the fry carton
          { s: [0.46, 0.46, 0.12], p: [0, 0.68, -0.06], c: 0xd97706, glow: true },
          { s: [0.34, 0.34, 0.14], p: [0, 0.68, -0.06], c: 0xf59f00, glow: true },
          // Iconic Red McDonald's Fry Carton + Golden Arches stripe
          { s: [0.32, 0.32, 0.20], p: [0, 0.62, 0.06], c: 0xe03131 },
          { s: [0.18, 0.14, 0.22], p: [0, 0.60, 0.06], c: 0xffd43b, glow: true },
          // Crispy Golden French Fries sticking up out of the red carton!
          { s: [0.06, 0.28, 0.06], p: [-0.10, 0.86, 0.06], r: [0, 0, 0.12], c: 0xffd43b, glow: true },
          { s: [0.06, 0.32, 0.06], p: [-0.03, 0.89, 0.08], r: [0, 0, 0.03], c: 0xffe066, glow: true },
          { s: [0.06, 0.30, 0.06], p: [0.04, 0.88, 0.05], r: [0, 0, -0.04], c: 0xffd43b, glow: true },
          { s: [0.06, 0.26, 0.06], p: [0.11, 0.85, 0.07], r: [0, 0, -0.14], c: 0xfff3bf, glow: true },
        ],
      };

    case 'golden_sahur_mallet':
      // Tung Tung Sahur Golden Kentungan Mallet (twin-headed golden Sahur drum mallet with carved kentungan slit & golden arches emblem)
      return {
        glowEmissive: 0xffb830,
        glowIntensity: 0.36,
        boxes: [
          // Warm teakwood & gold shaft
          { s: [0.12, 0.72, 0.12], p: [0, 0.24, 0], c: 0x8f5a2a },
          { s: [0.18, 0.10, 0.18], p: [0, -0.14, 0], c: 0xffd43b, glow: true },
          { s: [0.16, 0.08, 0.16], p: [0, 0.26, 0], c: 0xffd43b, glow: true },
          { s: [0.16, 0.08, 0.16], p: [0, 0.56, 0], c: 0xe03131 },
          // Twin-headed Golden Sahur Kentungan Mallet barrel
          { s: [0.38, 0.38, 0.64], p: [0, 0.80, 0], c: 0xffd43b, glow: true },
          // Carved Kentungan resonance slit + red/gold McDonald's Arches crest on barrel sides
          { s: [0.40, 0.10, 0.32], p: [0, 0.80, 0], c: 0x3b230a },
          { s: [0.41, 0.22, 0.16], p: [0, 0.82, 0], c: 0xe03131 },
          { s: [0.42, 0.14, 0.10], p: [0, 0.84, 0], c: 0xfff3bf, glow: true },
          // Radiant white-gold drumheads (+Z and -Z) + burger crown topper
          { s: [0.36, 0.30, 0.08], p: [0, 0.80, 0.33], c: 0xfff9db, glow: true },
          { s: [0.36, 0.30, 0.08], p: [0, 0.80, -0.33], c: 0xfff9db, glow: true },
          { s: [0.22, 0.14, 0.22], p: [0, 1.04, 0], c: 0xff922b, glow: true },
        ],
      };

    case 'neon_thunder_taiko':
      // Fizzy Cola & Taiko Drum Blaster (red-and-white striped Cola cup with cyan ice fizz + neon purple/cyan Taiko drum barrel)
      return {
        glowEmissive: 0x3bc9db,
        glowIntensity: 0.36,
        boxes: [
          // Fizzy neon handle with cyan ice rings
          { s: [0.13, 0.74, 0.13], p: [0, 0.22, 0], c: 0x3b384a },
          { s: [0.18, 0.12, 0.18], p: [0, -0.16, 0], c: 0xffd43b, glow: true },
          { s: [0.16, 0.08, 0.16], p: [0, 0.20, 0], c: 0x39d5ff, glow: true },
          { s: [0.16, 0.08, 0.16], p: [0, 0.48, 0], c: 0xe03131, glow: true },
          // Neon Purple & Cyan Taiko Drum Barrel
          { s: [0.42, 0.38, 0.66], p: [0, 0.78, 0], c: 0x6741d9, glow: true },
          // Red & White Striped McDonald's Fizzy Cola Cup mounted on the barrel!
          { s: [0.46, 0.26, 0.34], p: [0, 0.80, 0], c: 0xe03131, glow: true },
          { s: [0.47, 0.08, 0.36], p: [0, 0.80, 0], c: 0xffffff, glow: true },
          // Glowing cyan fizzy ice drumheads (+Z and -Z)
          { s: [0.34, 0.30, 0.08], p: [0, 0.78, 0.35], c: 0x39d5ff, glow: true },
          { s: [0.20, 0.18, 0.10], p: [0, 0.78, 0.37], c: 0xe3fafc, glow: true },
          { s: [0.34, 0.30, 0.08], p: [0, 0.78, -0.35], c: 0x39d5ff, glow: true },
          { s: [0.20, 0.18, 0.10], p: [0, 0.78, -0.37], c: 0xe3fafc, glow: true },
          // White dome lid + bent cyan/red Fizzy Cola Straw & ice cubes on top!
          { s: [0.28, 0.10, 0.28], p: [0, 1.00, 0], c: 0xffffff, glow: true },
          { s: [0.07, 0.22, 0.07], p: [0.04, 1.14, 0.04], r: [0, 0, -0.28], c: 0x39d5ff, glow: true },
        ],
      };

    case 'rainbow_mega_hammer':
    default:
      // Rainbow Mega Cheeseburger & Sahur Hammer (giant triple-decker sesame-bun cheeseburger + lettuce + melted cheese + tomato + rainbow Sahur drum hammer)
      return {
        glowEmissive: 0xff99cc,
        glowIntensity: 0.38,
        boxes: [
          // White-gold royal handle with rainbow rings
          { s: [0.13, 0.72, 0.13], p: [0, 0.20, 0], c: 0xf8f9fa },
          { s: [0.20, 0.14, 0.20], p: [0, -0.18, 0], c: 0xffd43b, glow: true },
          { s: [0.18, 0.09, 0.18], p: [0, 0.22, 0], c: 0x39d5ff, glow: true },
          { s: [0.18, 0.09, 0.18], p: [0, 0.46, 0], c: 0xff6b9d, glow: true },
          // Giant Triple-Decker Cheeseburger + Rainbow Sahur Drum-Hammer Head!
          // Bottom golden bun
          { s: [0.46, 0.10, 0.62], p: [0, 0.62, 0], c: 0xe69938, glow: true },
          // Sizzling beef patty + melted yellow cheddar cheese
          { s: [0.48, 0.10, 0.64], p: [0, 0.72, 0], c: 0x6e421b },
          { s: [0.52, 0.07, 0.68], p: [0, 0.79, 0], c: 0xffd43b, glow: true },
          // Crisp green lettuce + juicy red tomato + rainbow Sahur rhythm core
          { s: [0.50, 0.08, 0.66], p: [0, 0.86, 0], c: 0x51cf66, glow: true },
          { s: [0.46, 0.08, 0.62], p: [0, 0.94, 0], c: 0xff595e, glow: true },
          { s: [0.48, 0.08, 0.64], p: [0, 1.02, 0], c: 0x39d5ff, glow: true },
          // Top golden sesame bun + white sesame seeds + radiant strike faces
          { s: [0.46, 0.12, 0.60], p: [0, 1.12, 0], c: 0xf59f00, glow: true },
          { s: [0.24, 0.05, 0.36], p: [0, 1.19, 0], c: 0xfff9db, glow: true },
          { s: [0.36, 0.36, 0.08], p: [0, 0.86, 0.36], c: 0xfff9db, glow: true },
          { s: [0.36, 0.36, 0.08], p: [0, 0.86, -0.36], c: 0xfff9db, glow: true },
          // Golden Arches Star Crown topper
          { s: [0.22, 0.22, 0.22], p: [0, 1.30, 0], r: [0, 0, 0.785], c: 0xffd43b, glow: true },
        ],
      };
  }
}

export function buildWeaponMesh(weaponId = 'wooden_kentungan_bat') {
  const validId = resolveWeaponId(weaponId);
  const spec = getWeaponBoxes(validId);
  return buildVoxelGroup(spec.boxes, {
    name: `weapon_${validId}`,
    glowEmissive: spec.glowEmissive,
    glowIntensity: spec.glowIntensity,
    castShadow: false,
    userData: { kind: 'weapon', weaponId: validId },
  });
}

// ---------------------------------------------------------------------------
// 2. 3-Tier Poor-vs-Rich McDonald's Burger Shop Stations (Tier 1..3)
// Rooted at y = 0 so they sit flush on the 4 Hub Burger Battle Pads!
// ---------------------------------------------------------------------------

function normalizePotTier(tier) {
  if (tier === 1 || tier === 'glow_pot' || tier === 'totem_tier_1') return 1;
  if (tier === 2 || tier === 'crystal_pot' || tier === 'totem_tier_2') return 2;
  if (tier === 3 || tier === 'ultimate_pot' || tier === 'totem_tier_3') return 3;
  return 0;
}

export function buildFlowerpotMesh(tier = 1) {
  const t = normalizePotTier(tier);
  if (t <= 0) {
    const empty = new THREE.Group();
    empty.name = 'flowerpot_tier_0';
    empty.userData = { kind: 'flowerpot', tier: 0 };
    return empty;
  }

  if (t === 1) {
    // Tier 1: Mikey's $1 NOOB Cobblestone Burger Shack (left side of /tmp/yt_sub/thumb.jpg!)
    // Mossy cobblestone + grey stone walls, oak door, cute white pixel ghost on the wall,
    // grey stone roof slab, yellow wool roof awning, and giant brown Dirt-Block "M" sign on top!
    const boxes = [
      // Grassy dirt & mossy cobblestone foundation
      { s: [1.24, 0.12, 1.06], p: [0, 0.06, 0], c: 0x5c8a3c },
      // Grey cobblestone shack walls + mossy green cobblestone patches
      { s: [1.14, 0.64, 0.94], p: [0, 0.44, 0], c: 0x767b82 },
      { s: [0.36, 0.26, 0.96], p: [-0.34, 0.28, 0], c: 0x5c8a3c },
      { s: [0.28, 0.22, 0.96], p: [0.36, 0.26, 0], c: 0x6b7280 },
      // Warm Oak Door on front-right (+Z) with dark window grille & wooden sign
      { s: [0.28, 0.50, 0.06], p: [0.22, 0.37, 0.46], c: 0xc98d52 },
      { s: [0.20, 0.18, 0.07], p: [0.22, 0.48, 0.47], c: 0x5c3a21 },
      { s: [0.20, 0.08, 0.07], p: [-0.04, 0.38, 0.47], c: 0xd99b66 },
      // Cute White Pixel Ghost painted on front-left cobblestone wall (+Z) with hollow black eyes & "O" mouth!
      { s: [0.32, 0.36, 0.06], p: [-0.26, 0.44, 0.46], c: 0xffffff, glow: true },
      { s: [0.06, 0.07, 0.07], p: [-0.33, 0.50, 0.47], c: 0x182232 },
      { s: [0.06, 0.07, 0.07], p: [-0.19, 0.50, 0.47], c: 0x182232 },
      { s: [0.08, 0.09, 0.07], p: [-0.26, 0.37, 0.47], c: 0x182232 },
      // Grey stone slab overhang + bright Yellow Wool roof band
      { s: [1.34, 0.16, 1.14], p: [0, 0.84, 0], c: 0x9ca3af },
      { s: [1.14, 0.18, 0.94], p: [0, 1.01, 0], c: 0xfcc419, glow: true },
      // Two stone support bases + Giant Brown Dirt-Block "M" Sign on top of the roof!
      { s: [0.18, 0.08, 0.18], p: [-0.26, 1.14, 0], c: 0x9ca3af },
      { s: [0.18, 0.08, 0.18], p: [0.26, 1.14, 0], c: 0x9ca3af },
      { s: [0.16, 0.54, 0.16], p: [-0.26, 1.44, 0], c: 0x8f5a2a },
      { s: [0.16, 0.54, 0.16], p: [0.26, 1.44, 0], c: 0x8f5a2a },
      { s: [0.14, 0.18, 0.16], p: [-0.12, 1.56, 0], c: 0x7c4d25 },
      { s: [0.14, 0.18, 0.16], p: [0.12, 1.56, 0], c: 0x7c4d25 },
      { s: [0.14, 0.22, 0.16], p: [0, 1.42, 0], c: 0x7c4d25 },
    ];
    return buildVoxelGroup(boxes, {
      name: 'flowerpot_tier_1',
      glowEmissive: 0xffb830,
      glowIntensity: 0.36,
      userData: { kind: 'flowerpot', tier: 1 },
    });
  }

  if (t === 2) {
    // Tier 2: JJ's $100,000 PRO 2-Story Diamond McDonald's (right side of /tmp/yt_sub/thumb.jpg!)
    // Crisp red/white/yellow 2-story modern restaurant, red carpet entrance, cyan diamond-block side tower,
    // 2nd-floor window dining room with Golden Arches, and a giant glowing Golden "JM" sign on the roof!
    const boxes = [
      // Clean concrete plaza curb + Red Carpet VIP entrance runner (+Z)
      { s: [1.44, 0.10, 1.18], p: [0, 0.05, 0], c: 0xdee2e6 },
      { s: [0.30, 0.06, 0.52], p: [-0.12, 0.09, 0.52], c: 0xe03131, glow: true },
      // Left 2-Story Modern Red & White Restaurant Wing (x = -0.22)
      { s: [0.88, 0.44, 0.92], p: [-0.20, 0.32, 0], c: 0xe03131 },
      // Red front entrance door frame + glass windows on 1st floor
      { s: [0.24, 0.38, 0.08], p: [-0.12, 0.29, 0.46], c: 0xc92a2a },
      { s: [0.56, 0.30, 0.06], p: [-0.20, 0.30, 0.45], c: 0x74c0fc, glow: true },
      // Crisp White mid-floor fascia band
      { s: [0.94, 0.12, 0.98], p: [-0.20, 0.60, 0.02], c: 0xffffff, glow: true },
      // 2nd-floor Golden Dining Room + panoramic glass window + Golden "M" inside window
      { s: [0.88, 0.42, 0.90], p: [-0.20, 0.86, 0], c: 0xffd43b, glow: true },
      { s: [0.74, 0.32, 0.06], p: [-0.20, 0.86, 0.44], c: 0x3bc9db, glow: true },
      { s: [0.22, 0.20, 0.08], p: [-0.38, 0.84, 0.45], c: 0xffe066, glow: true },
      // Bright Yellow 2nd-floor roof awning + Crisp White modern roof cornice
      { s: [0.96, 0.14, 1.00], p: [-0.20, 1.12, 0.04], c: 0xfcc419, glow: true },
      { s: [1.46, 0.10, 1.14], p: [0, 1.24, 0], c: 0xffffff, glow: true },
      // Right 2-Story Cyan Diamond-Block Side Tower (x = +0.44, exact Maizen PRO build!)
      { s: [0.46, 1.10, 0.96], p: [0.44, 0.65, 0.02], c: 0x39d5ff, glow: true },
      { s: [0.48, 0.10, 0.98], p: [0.44, 0.38, 0.02], c: 0x99e9f2, glow: true },
      { s: [0.48, 0.10, 0.98], p: [0.44, 0.74, 0.02], c: 0x99e9f2, glow: true },
      { s: [0.48, 0.10, 0.98], p: [0.44, 1.06, 0.02], c: 0x99e9f2, glow: true },
      // Red rooftop sign pedestal + Giant Glowing Golden "JM" Arches Sign on top!
      { s: [0.48, 0.12, 0.32], p: [-0.06, 1.34, 0], c: 0xe03131 },
      { s: [0.14, 0.48, 0.14], p: [-0.24, 1.62, 0], c: 0xffd43b, glow: true },
      { s: [0.14, 0.48, 0.14], p: [0.14, 1.62, 0], c: 0xffd43b, glow: true },
      { s: [0.46, 0.12, 0.14], p: [-0.05, 1.82, 0], c: 0xfff3bf, glow: true },
      { s: [0.14, 0.24, 0.14], p: [-0.05, 1.64, 0], c: 0xffd43b, glow: true },
      { s: [0.22, 0.12, 0.14], p: [-0.28, 1.44, 0], c: 0xffe066, glow: true },
    ];
    return buildVoxelGroup(boxes, {
      name: 'flowerpot_tier_2',
      glowEmissive: 0x4dabf7,
      glowIntensity: 0.35,
      userData: { kind: 'flowerpot', tier: 2 },
    });
  }

  // Tier 3: Ultimate JJ & Mikey & Tung Tung Sahur Mega Burger Palace + Secret Gold Vault!
  // Glowing underground Gold Vault base + 2-story Red/White/Gold McDonald's + Cyan Diamond Tower +
  // Tung Tung Sahur's Golden Kentungan Drive-Thru Archway + Giant Rotating Golden Burger & Sahur Star Topper!
  const baseBoxes = [
    // Secret Underground Gold Vault Foundation with glowing gold bullion & cyan diamond vault door
    { s: [1.54, 0.20, 1.44], p: [0, 0.10, 0], c: 0xffb830, glow: true },
    { s: [1.60, 0.08, 1.50], p: [0, 0.24, 0], c: 0xffd43b, glow: true },
    { s: [0.36, 0.18, 0.08], p: [0, 0.14, 0.72], c: 0x39d5ff, glow: true },
    // VIP Red Carpet & Golden Drive-Thru Lane
    { s: [0.36, 0.06, 0.42], p: [0, 0.27, 0.78], c: 0xe03131, glow: true },

    // Story 1: Grand Red & White Pro McDonald's Flagship + Cyan Diamond Side Towers
    { s: [1.28, 0.40, 1.12], p: [0, 0.48, 0], c: 0xe03131 },
    { s: [0.38, 0.82, 1.16], p: [0.52, 0.68, 0], c: 0x39d5ff, glow: true },
    { s: [0.38, 0.82, 1.16], p: [-0.52, 0.68, 0], c: 0x39d5ff, glow: true },
    { s: [1.38, 0.10, 1.22], p: [0, 0.70, 0], c: 0xffffff, glow: true },

    // Story 2: Golden Panorama Dining Room + Tung Tung Sahur Kentungan Drive-Thru Pillars
    { s: [1.04, 0.36, 0.96], p: [0, 0.92, 0], c: 0xffd43b, glow: true },
    { s: [0.76, 0.26, 0.08], p: [0, 0.92, 0.48], c: 0x99e9f2, glow: true },
    { s: [1.36, 0.12, 1.18], p: [0, 1.14, 0], c: 0xffffff, glow: true },

    // Story 3: Golden Sahur & McDonald's Penthouse + Giant Golden "JM" Arches
    { s: [0.78, 0.28, 0.74], p: [0, 1.34, 0], c: 0xe03131, glow: true },
    { s: [0.84, 0.10, 0.80], p: [0, 1.52, 0], c: 0xffd43b, glow: true },
    { s: [0.12, 0.32, 0.12], p: [-0.20, 1.68, 0.22], c: 0xffd43b, glow: true },
    { s: [0.12, 0.26, 0.12], p: [0, 1.66, 0.22], c: 0xfff3bf, glow: true },
    { s: [0.12, 0.32, 0.12], p: [0.20, 1.68, 0.22], c: 0xffd43b, glow: true },

    // Apex Rotating Golden Mega Cheeseburger & Sahur Star Topper (y ~ 1.98, merged into 1 single draw call!)
    { s: [0.46, 0.10, 0.46], p: [0, 1.82, 0], c: 0xf59f00, glow: true },
    { s: [0.50, 0.08, 0.50], p: [0, 1.90, 0], c: 0x51cf66, glow: true },
    { s: [0.48, 0.08, 0.48], p: [0, 1.97, 0], c: 0xffd43b, glow: true },
    { s: [0.44, 0.10, 0.44], p: [0, 2.05, 0], c: 0xf59f00, glow: true },
    { s: [0.56, 0.16, 0.14], p: [0, 2.18, 0], c: 0xffd43b, glow: true },
    { s: [0.16, 0.56, 0.14], p: [0, 2.18, 0], c: 0xfff9db, glow: true },
    { s: [0.42, 0.14, 0.12], p: [0, 2.18, 0], r: [0, 0, 0.785], c: 0xff6b9d, glow: true },
  ];

  return buildVoxelGroup(baseBoxes, {
    name: 'flowerpot_tier_3',
    glowEmissive: 0xffc038,
    glowIntensity: 0.40,
    userData: { kind: 'flowerpot', tier: 3 },
  });
}

// ---------------------------------------------------------------------------
// 3. 3D Hub Golden Burger Battle Trophies (for the 4 Trophy Stage Pedestals)
// ---------------------------------------------------------------------------

export function buildTrophyMesh(rawTitanId = 'tralalero_tralala') {
  const titanId = resolveBossId(rawTitanId);
  const accentMap = {
    tralalero_tralala: 0x39d5ff,
    bombardiro_crocodilo: 0xffd43b,
    brr_brr_patapim: 0x51cf66,
    golden_sahur_king: 0xff4d6d,
  };
  const accent = accentMap[titanId] || 0x39d5ff;

  const boxes = [
    { s: [0.76, 0.12, 0.76], p: [0, 0.06, 0], c: 0x3b384a },
    { s: [0.64, 0.10, 0.64], p: [0, 0.17, 0], c: 0xffd43b, glow: true },
    { s: [0.70, 0.08, 0.24], p: [0, 0.17, 0], c: 0xffec99, glow: true },
    { s: [0.24, 0.08, 0.70], p: [0, 0.17, 0], c: 0xffec99, glow: true },
    { s: [0.22, 0.28, 0.22], p: [0, 0.36, 0], c: 0xffb830, glow: true },
    { s: [0.30, 0.10, 0.30], p: [0, 0.52, 0], c: accent, glow: true },
    { s: [0.54, 0.38, 0.54], p: [0, 0.76, 0], c: 0xffd43b, glow: true },
    { s: [0.62, 0.10, 0.62], p: [0, 0.96, 0], c: 0xfff3bf, glow: true },
    { s: [0.10, 0.26, 0.12], p: [-0.36, 0.78, 0], c: 0xffec99, glow: true },
    { s: [0.10, 0.26, 0.12], p: [0.36, 0.78, 0], c: 0xffec99, glow: true },
    { s: [0.20, 0.20, 0.08], p: [0, 0.76, 0.28], c: accent, glow: true },
  ];

  if (titanId === 'tralalero_tralala') {
    // ★1 Cursed Land Pixel Ghost & Cobblestone Burger Trophy topper
    boxes.push(
      { s: [0.34, 0.32, 0.26], p: [0, 1.18, 0], c: 0xffffff, glow: true },
      { s: [0.07, 0.08, 0.06], p: [-0.08, 1.22, 0.14], c: 0x182232 },
      { s: [0.07, 0.08, 0.06], p: [0.08, 1.22, 0.14], c: 0x182232 },
      { s: [0.22, 0.10, 0.22], p: [0, 1.38, 0], c: 0xffd43b, glow: true }
    );
  } else if (titanId === 'bombardiro_crocodilo') {
    // ★2 Sneaky Burger Robber Loot Sack & Golden Burger Trophy topper
    boxes.push(
      { s: [0.36, 0.26, 0.34], p: [0, 1.14, 0], c: 0xffd43b, glow: true },
      { s: [0.38, 0.08, 0.12], p: [0, 1.18, 0.16], c: 0x182232 },
      { s: [0.28, 0.12, 0.28], p: [0, 1.32, 0], c: 0xe03131, glow: true }
    );
  } else if (titanId === 'brr_brr_patapim') {
    // ★3 TNT & Green Rotten-Burger Golem Trophy topper
    boxes.push(
      { s: [0.34, 0.24, 0.34], p: [0, 1.14, 0], c: 0xe03131, glow: true },
      { s: [0.36, 0.08, 0.36], p: [0, 1.14, 0], c: 0xffffff, glow: true },
      { s: [0.38, 0.14, 0.38], p: [0, 1.32, 0], c: 0x51cf66, glow: true }
    );
  } else {
    // ★4 Tung Tung Sahur Burger King Crown & Golden Cheeseburger Trophy topper
    boxes.push(
      { s: [0.44, 0.18, 0.44], p: [0, 1.10, 0], c: 0xffd43b, glow: true },
      { s: [0.12, 0.18, 0.12], p: [-0.16, 1.26, 0.16], c: 0xfff3bf, glow: true },
      { s: [0.12, 0.22, 0.12], p: [0, 1.28, 0.16], c: 0xff4d6d, glow: true },
      { s: [0.12, 0.18, 0.12], p: [0.16, 1.26, 0.16], c: 0xfff3bf, glow: true },
      { s: [0.26, 0.16, 0.26], p: [0, 1.30, 0], c: 0xf59f00, glow: true }
    );
  }

  return buildVoxelGroup(boxes, {
    name: `trophy_${titanId}`,
    glowEmissive: 0xffc038,
    glowIntensity: 0.38,
    userData: { kind: 'trophy', titanId },
  });
}

// ---------------------------------------------------------------------------
// 4. Reusable Hero Armor & Sesame Burger-Bun Bounce Cloud Builders
// ---------------------------------------------------------------------------

export function buildBlazingHelmetMesh() {
  const boxes = [
    { s: [0.76, 0.18, 0.74], p: [0, 0.30, 0], c: 0xffd43b, glow: true },
    { s: [0.68, 0.10, 0.66], p: [0, 0.42, 0], c: 0xfff3bf, glow: true },
    { s: [0.78, 0.12, 0.16], p: [0, 0.20, 0.32], c: 0xe03131, glow: true },
    { s: [0.18, 0.18, 0.10], p: [0, 0.26, 0.39], c: 0xffd43b, glow: true },
    { s: [0.10, 0.10, 0.08], p: [-0.18, 0.26, 0.38], c: 0x39d5ff, glow: true },
    { s: [0.10, 0.10, 0.08], p: [0.18, 0.26, 0.38], c: 0x51cf66, glow: true },
    { s: [0.76, 0.38, 0.14], p: [0, 0.06, -0.32], c: 0xffb830, glow: true },
    { s: [0.12, 0.34, 0.56], p: [-0.36, 0.06, -0.04], c: 0xffd43b, glow: true },
    { s: [0.12, 0.34, 0.56], p: [0.36, 0.06, -0.04], c: 0xffd43b, glow: true },
    { s: [0.16, 0.26, 0.16], p: [-0.46, 0.28, -0.02], r: [0, 0, 0.42], c: 0xffec99, glow: true },
    { s: [0.12, 0.22, 0.12], p: [-0.56, 0.46, -0.06], r: [-0.2, 0, 0.25], c: 0xffffff, glow: true },
    { s: [0.16, 0.26, 0.16], p: [0.46, 0.28, -0.02], r: [0, 0, -0.42], c: 0xffec99, glow: true },
    { s: [0.12, 0.22, 0.12], p: [0.56, 0.46, -0.06], r: [-0.2, 0, -0.25], c: 0xffffff, glow: true },
  ];
  return buildVoxelGroup(boxes, {
    name: 'blazing_gold_helmet',
    glowEmissive: 0xffc038,
    glowIntensity: 0.40,
    userData: { kind: 'gear', gear: 'helmet' },
  });
}

export function buildKingCrownMesh() {
  const boxes = [
    { s: [0.58, 0.14, 0.58], p: [0, 0.07, 0], c: 0xffd43b, glow: true },
    { s: [0.12, 0.18, 0.12], p: [-0.22, 0.21, 0.22], c: 0xfff3bf, glow: true },
    { s: [0.14, 0.24, 0.12], p: [0, 0.24, 0.24], c: 0xffd43b, glow: true },
    { s: [0.12, 0.18, 0.12], p: [0.22, 0.21, 0.22], c: 0xfff3bf, glow: true },
    { s: [0.12, 0.18, 0.12], p: [-0.22, 0.21, -0.22], c: 0xfff3bf, glow: true },
    { s: [0.12, 0.18, 0.12], p: [0.22, 0.21, -0.22], c: 0xfff3bf, glow: true },
    { s: [0.12, 0.12, 0.08], p: [0, 0.10, 0.29], c: 0xff4d6d, glow: true },
    { s: [0.10, 0.10, 0.08], p: [-0.18, 0.09, 0.28], c: 0x39d5ff, glow: true },
    { s: [0.10, 0.10, 0.08], p: [0.18, 0.09, 0.28], c: 0x51cf66, glow: true },
  ];
  return buildVoxelGroup(boxes, {
    name: 'king_crown',
    glowEmissive: 0xffc940,
    glowIntensity: 0.42,
    userData: { kind: 'gear', gear: 'crown' },
  });
}

export function buildStarCapeMesh() {
  const boxes = [
    { s: [0.56, 0.16, 0.07], p: [0, -0.08, 0], c: 0xe03131, glow: true },
    { s: [0.60, 0.18, 0.07], p: [0, -0.25, -0.02], c: 0xff922b, glow: true },
    { s: [0.64, 0.18, 0.07], p: [0, -0.43, -0.04], c: 0xffd43b, glow: true },
    { s: [0.68, 0.18, 0.07], p: [0, -0.61, -0.06], c: 0x39d5ff, glow: true },
    { s: [0.22, 0.22, 0.09], p: [0, -0.34, -0.05], r: [0, 0, 0.785], c: 0xfff9db, glow: true },
  ];
  return buildVoxelGroup(boxes, {
    name: 'royal_star_cape',
    glowEmissive: 0xd0bfff,
    glowIntensity: 0.32,
    userData: { kind: 'gear', gear: 'starCape' },
  });
}

export function buildWingedBootOverlay(side = 1) {
  // Complete leg + Blue Sneaker Zoom Boot (swaps 1 mesh -> 1 mesh, 0 extra draw calls!)
  const boxes = [
    { s: [0.22, 0.30, 0.22], p: [0, -0.15, 0], c: 0x1c7ed6 },
    { s: [0.28, 0.20, 0.35], p: [0, -0.36, 0.04], c: 0x228be6, glow: true },
    { s: [0.30, 0.07, 0.37], p: [0, -0.45, 0.04], c: 0xffffff, glow: true },
    { s: [0.08, 0.08, 0.22], p: [side * 0.14, -0.35, 0.05], c: 0xffffff, glow: true },
    // Crisp golden-fries & cyan zoom wing on outer ankle
    { s: [0.08, 0.18, 0.24], p: [side * 0.16, -0.26, -0.06], r: [0.25, side * 0.22, 0], c: 0x39d5ff, glow: true },
    { s: [0.07, 0.13, 0.18], p: [side * 0.20, -0.18, -0.15], r: [0.35, side * 0.28, 0], c: 0xffe066, glow: true },
  ];
  return buildVoxelGroup(boxes, {
    name: `winged_boot_${side < 0 ? 'r' : 'l'}`,
    glowEmissive: 0x66d9e8,
    glowIntensity: 0.34,
    userData: { kind: 'gear', gear: 'speedBoots' },
  });
}

export function buildRainbowSpringCloudMesh() {
  // Giant fluffy Sesame Burger-Bun, Melted Cheese, Lettuce & Ketchup Foam Spring Cloud (BOING!)
  // Bounces JJ, Mikey & Tung Tung Sahur safely back to the Hub in a single merged draw call!
  const boxes = [
    // Golden spring coil & bottom toasted burger bun
    { s: [0.68, 0.12, 0.68], p: [0, 0.08, 0], c: 0xffd43b, glow: true },
    { s: [1.18, 0.18, 1.08], p: [0, 0.22, 0], c: 0xe69938, glow: true },
    // Crisp green lettuce cushion & melted yellow cheddar cheese layer
    { s: [1.56, 0.22, 1.38], p: [0, 0.40, 0], c: 0x51cf66, glow: true },
    { s: [1.46, 0.18, 1.28], p: [0, 0.56, 0], c: 0xffd43b, glow: true },
    // Fluffy golden sesame top burger bun + white sesame seeds on top
    { s: [1.22, 0.26, 1.08], p: [0, 0.72, 0], c: 0xf59f00, glow: true },
    { s: [0.70, 0.08, 0.70], p: [0, 0.87, 0], c: 0xfff9db, glow: true },
    // 6 Ketchup, Mustard, Lettuce & Fizzy Cola foam puffballs ringing the burger cloud cushion
    { s: [0.56, 0.34, 0.56], p: [-0.74, 0.46, 0.38], c: 0xff595e, glow: true },
    { s: [0.56, 0.34, 0.56], p: [-0.76, 0.46, -0.32], c: 0xff922b, glow: true },
    { s: [0.56, 0.34, 0.56], p: [0, 0.48, 0.68], c: 0xffd43b, glow: true },
    { s: [0.56, 0.34, 0.56], p: [0.74, 0.46, 0.38], c: 0x51cf66, glow: true },
    { s: [0.56, 0.34, 0.56], p: [0.76, 0.46, -0.32], c: 0x39d5ff, glow: true },
    { s: [0.56, 0.34, 0.56], p: [0, 0.48, -0.68], c: 0xff6b9d, glow: true },
  ];
  return buildVoxelGroup(boxes, {
    name: 'rainbow_spring_cloud',
    glowEmissive: 0xfff0cc,
    glowIntensity: 0.36,
    castShadow: false,
    userData: { kind: 'spring_cloud' },
  });
}

// ---------------------------------------------------------------------------
// 5. Crisp 2D 16x16 Pixel-Art Burger/Sahur Weapon Icons (for Roulette Wheel & HUD)
// Zero text calls so l10n_audit canvas hooks see 0 strings!
// ---------------------------------------------------------------------------

const PIXEL_ICON_SPECS = {
  wooden_kentungan_bat: {
    bgTop: '#fff3bf',
    bgBot: '#d97706',
    ring: '#7c4d25',
    palette: {
      O: '#3a2210',
      W: '#8f5a2a',
      S: '#f8f9fa',
      G: '#ffd43b',
      B: '#e69938',
      R: '#e03131',
    },
    grid: [
      '................',
      '.....OOOOOO.....',
      '....OBBBBBBO....',
      '....OGGGGGGO....',
      '...OOOOOOOOOO...',
      '...OSSOSOSSSO...',
      '...OSSOSOSSSO...',
      '...OSSOSOSSSO...',
      '....OOOOOOOO....',
      '......ORRO......',
      '......OWWO......',
      '......OWWO......',
      '.....OOGGOO.....',
      '.....OGGGGO.....',
      '......OOOO......',
      '................',
    ],
  },
  bronze_temple_gong: {
    bgTop: '#fff9db',
    bgBot: '#f59f00',
    ring: '#d9480f',
    palette: {
      O: '#3b230a',
      G: '#ffd43b',
      Y: '#fff3bf',
      A: '#f08c00',
      R: '#e03131',
    },
    grid: [
      '................',
      '...OO.OOOO.OO...',
      '..OYG.OGYO.GYO..',
      '..OYGOOGYOOGYO..',
      '..OYGGGYGGGYGO..',
      '..OOOOOOOOOOOO..',
      '..ORRRRRRRRRRO..',
      '..ORROGGGGORRO..',
      '...OROGOOOGRO...',
      '...ORRRRRRRRO...',
      '....OOOOOOOO....',
      '......ORRO......',
      '......OGGO......',
      '.....OOGGOO.....',
      '......OOOO......',
      '................',
    ],
  },
  golden_sahur_mallet: {
    bgTop: '#fff9db',
    bgBot: '#ffd43b',
    ring: '#e67700',
    palette: {
      O: '#3b230a',
      G: '#ffd43b',
      Y: '#fff9db',
      R: '#e03131',
      W: '#8f5a2a',
    },
    grid: [
      '....OOOOOOOO....',
      '..OOYGGGGGGYOO..',
      '.OYGRRRRRRRRGYO.',
      '.OYGRGYGGYGRGYO.',
      '.OYGRGYOOYGRGYO.',
      '..OOYGGGGGGYOO..',
      '....OOOWWWOO....',
      '......OWWO......',
      '.....OOGGOO.....',
      '......OWWO......',
      '......OWWO......',
      '.....OOGGOO.....',
      '.....OGGGGO.....',
      '......OOOO......',
      '................',
      '................',
    ],
  },
  neon_thunder_taiko: {
    bgTop: '#f3f0ff',
    bgBot: '#9775fa',
    ring: '#5f3dc4',
    palette: {
      O: '#21183c',
      P: '#7950f2',
      W: '#ffffff',
      C: '#39d5ff',
      R: '#e03131',
      G: '#ffd43b',
    },
    grid: [
      '........OOOO....',
      '.......OCCC.....',
      '......OOCO......',
      '....OOOWWWOOO...',
      '..OOCRRRRRRRCOO.',
      '.OCRWWRRRRRWWRCO',
      '.OCRRRRGGGGGGRCO',
      '..OOCPPPPPPPCOO.',
      '....OOOPPPPOOO..',
      '......OOCO......',
      '......OORO......',
      '......OOCO......',
      '.....OOGGOO.....',
      '......OOOO......',
      '................',
      '................',
    ],
  },
  rainbow_mega_hammer: {
    bgTop: '#fff0f6',
    bgBot: '#ff85c0',
    ring: '#c2255c',
    palette: {
      O: '#2b193d',
      R: '#ff595e',
      A: '#f59f00',
      Y: '#ffd43b',
      E: '#51cf66',
      C: '#39d5ff',
      W: '#ffffff',
    },
    grid: [
      '....OOOOOOOO....',
      '..OOAAAWWAAAOO..',
      '.OAAAAAAAAAAAAO.',
      '.OEEEEEEEEEEEEO.',
      '.OYYYYYYYYYYYYO.',
      '.ORRRRRRRRRRRRO.',
      '..OOCCCCCCCCOO..',
      '....OOOWWWOO....',
      '......OWWO......',
      '.....OOCWOO.....',
      '......OYWO......',
      '......ORWO......',
      '.....OOYYOO.....',
      '......OOOO......',
      '................',
      '................',
    ],
  },
};

export function renderWeaponIconDataURL(weaponId = 'wooden_kentungan_bat', size = 128) {
  const validId = resolveWeaponId(weaponId);
  const pxSize = Math.max(32, Math.round(Number(size) || 128));
  const cacheKey = `${validId}:${pxSize}`;
  const cached = iconDataUrlCache.get(cacheKey);
  if (cached) return cached;

  const spec = PIXEL_ICON_SPECS[validId] || PIXEL_ICON_SPECS.wooden_kentungan_bat;

  if (typeof document === 'undefined' || typeof document.createElement !== 'function') {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${pxSize}" height="${pxSize}" viewBox="0 0 16 16"><rect width="16" height="16" rx="4" fill="${spec.bgBot}"/></svg>`;
    const fallback = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
    iconDataUrlCache.set(cacheKey, fallback);
    return fallback;
  }

  const canvas = document.createElement('canvas');
  canvas.width = pxSize;
  canvas.height = pxSize;
  const ctx2d = canvas.getContext('2d');
  if (!ctx2d) return '';
  ctx2d.imageSmoothingEnabled = false;

  const r = pxSize * 0.46;
  const cx = pxSize * 0.5;
  const cy = pxSize * 0.5;
  const grad = ctx2d.createRadialGradient(cx, cy * 0.78, pxSize * 0.08, cx, cy, r);
  grad.addColorStop(0, spec.bgTop);
  grad.addColorStop(1, spec.bgBot);

  ctx2d.fillStyle = grad;
  ctx2d.beginPath();
  ctx2d.arc(cx, cy, r, 0, Math.PI * 2);
  ctx2d.fill();

  ctx2d.lineWidth = Math.max(3, Math.round(pxSize * 0.055));
  ctx2d.strokeStyle = spec.ring;
  ctx2d.stroke();

  const pad = Math.round(pxSize * 0.14);
  const cell = (pxSize - pad * 2) / 16;
  for (let row = 0; row < 16; row++) {
    const line = spec.grid[row];
    for (let col = 0; col < 16; col++) {
      const ch = line[col];
      if (!ch || ch === '.') continue;
      const fill = spec.palette[ch];
      if (!fill) continue;
      ctx2d.fillStyle = fill;
      const x0 = Math.floor(pad + col * cell);
      const y0 = Math.floor(pad + row * cell);
      const x1 = Math.floor(pad + (col + 1) * cell);
      const y1 = Math.floor(pad + (row + 1) * cell);
      ctx2d.fillRect(x0, y0, Math.max(1, x1 - x0), Math.max(1, y1 - y0));
    }
  }

  ctx2d.fillStyle = '#ffffff';
  const sp = Math.max(3, Math.round(pxSize * 0.045));
  ctx2d.fillRect(Math.round(pxSize * 0.20), Math.round(pxSize * 0.22), sp, sp * 2.2);
  ctx2d.fillRect(Math.round(pxSize * 0.20 - sp * 0.6), Math.round(pxSize * 0.22 + sp * 0.6), sp * 2.2, sp);
  ctx2d.fillRect(Math.round(pxSize * 0.75), Math.round(pxSize * 0.72), sp, sp * 1.8);
  ctx2d.fillRect(Math.round(pxSize * 0.75 - sp * 0.4), Math.round(pxSize * 0.72 + sp * 0.4), sp * 1.8, sp);

  const url = canvas.toDataURL('image/png');
  iconDataUrlCache.set(cacheKey, url);
  return url;
}

export const buildWeaponPreviewDataURL = renderWeaponIconDataURL;
