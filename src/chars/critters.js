// Friendly Bouncy 3D Burger Town Helpers:
// 1. mini_cappuccina: Mini Mikey Turtle Chef (bright green turtle with yellow belly shell, red tongue, and mini chef hat)
// 2. mini_bananini: Mini Tung Tung Sahur Drummer (warm teakwood kentungan log buddy with googly eyes and blue sneakers)
// 3. mini_lirili: Mini JJ Security Guard (JJ in red hoodie + cool dark security sunglasses & golden badge)
// Zero CJK text, metalness <= 0.20, 3-draw-call InstancedMesh, 100% deterministic.

import * as THREE from '../../vendor/three.module.min.js';
import { CRITTER_TYPES } from '../data/catalog.js';
import {
  createSafeSpriteMaterial,
  getMatteVoxelMaterial,
  mergeVoxelBoxes,
} from './props3d.js';

const CRITTER_ALIAS = Object.freeze({
  mini_cappuccina: 'mini_cappuccina',
  piggy: 'mini_cappuccina',
  mini_bananini: 'mini_bananini',
  bee: 'mini_bananini',
  mini_lirili: 'mini_lirili',
  chick: 'mini_lirili',
});

export function resolveCritterKind(kind) {
  return CRITTER_ALIAS[kind] || 'mini_cappuccina';
}

const AMBIENT_CRITTER_SPAWNS = Object.freeze([
  Object.freeze({ kind: 'mini_cappuccina', x: -12.5, z: 11.5 }),
  Object.freeze({ kind: 'mini_cappuccina', x: -22.5, z: 13.5 }),
  Object.freeze({ kind: 'mini_cappuccina', x: -14.5, z: 23.5 }),
  Object.freeze({ kind: 'mini_bananini', x: -10.5, z: 16.5 }),
  Object.freeze({ kind: 'mini_bananini', x: 12.5, z: 11.5 }),
  Object.freeze({ kind: 'mini_bananini', x: 22.5, z: 14.5 }),
  Object.freeze({ kind: 'mini_lirili', x: 11.5, z: 17.5 }),
  Object.freeze({ kind: 'mini_lirili', x: 15.5, z: 23.5 }),
  Object.freeze({ kind: 'mini_lirili', x: 23.5, z: 21.5 }),
]);

const CRITTER_KINDS = Object.freeze(['mini_cappuccina', 'mini_bananini', 'mini_lirili']);
const MAX_PER_KIND = 12;
const MAX_CRITTERS = 24;
const PET_DURATION = 0.85;
const HEART_POOL_SIZE = 4;

const sharedCritterGeos = new Map();
let sharedHeartTex = null;

function round3(n) {
  return Math.round(n * 1000) / 1000;
}

function hashSeed(seed, idx) {
  let h = ((Number(seed) >>> 0) ^ Math.imul(idx + 1, 0x9e3779b1)) >>> 0;
  h = Math.imul(h ^ (h >>> 16), 0x85ebca6b) >>> 0;
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35) >>> 0;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

function getHeartTexture() {
  if (sharedHeartTex) return sharedHeartTex;
  if (typeof document === 'undefined' || typeof document.createElement !== 'function') {
    return null;
  }
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const c2d = canvas.getContext('2d');
  if (!c2d) return null;
  c2d.imageSmoothingEnabled = false;

  const grid = [
    '................',
    '..OOOO....OOOO..',
    '.ORRRRO..ORRRRO.',
    'ORRWWROOORRRRRRO',
    'ORRWWRRRRRRRRRRO',
    'ORRRRRRRRRRRRRRO',
    'ORRRRRRRRRRRRRRO',
    '.ORRRRRRRRRRRRO.',
    '..ORRRRRRRRRRO..',
    '...ORRRRRRRRO...',
    '....ORRRRRRO....',
    '.....ORRRRO.....',
    '......ORRO......',
    '.......OO.......',
    '................',
    '................',
  ];
  const pal = { O: '#590d22', R: '#ff4d6d', W: '#fff0f3' };
  for (let r = 0; r < 16; r++) {
    for (let c = 0; c < 16; c++) {
      const ch = grid[r][c];
      if (ch === '.') continue;
      c2d.fillStyle = pal[ch];
      c2d.fillRect(c * 4, r * 4, 4, 4);
    }
  }
  sharedHeartTex = new THREE.CanvasTexture(canvas);
  sharedHeartTex.magFilter = THREE.NearestFilter;
  sharedHeartTex.minFilter = THREE.NearestFilter;
  sharedHeartTex.colorSpace = THREE.SRGBColorSpace;
  return sharedHeartTex;
}

function getCritterGeometry(rawKind) {
  const kind = resolveCritterKind(rawKind);
  let geo = sharedCritterGeos.get(kind);
  if (geo) return geo;

  let boxes;
  if (kind === 'mini_cappuccina') {
    // Mini Mikey Turtle Chef: bright green turtle (0x40c057) with yellow belly shell (0xffd43b),
    // goofy black eyes, bright red tongue (0xff4d6d) sticking out, and puffy white Mini Chef Hat!
    boxes = [
      // Stubby green turtle legs
      { s: [0.16, 0.14, 0.18], p: [-0.14, 0.07, 0.02], c: 0x40c057 },
      { s: [0.16, 0.14, 0.18], p: [0.14, 0.07, 0.02], c: 0x40c057 },
      // Green turtle body + dark green back shell + golden-yellow belly shell
      { s: [0.46, 0.36, 0.38], p: [0, 0.28, 0], c: 0x40c057 },
      { s: [0.34, 0.30, 0.06], p: [0, 0.28, 0.18], c: 0xffd43b, glow: true },
      { s: [0.30, 0.05, 0.07], p: [0, 0.28, 0.185], c: 0xe67700 },
      { s: [0.40, 0.32, 0.10], p: [0, 0.29, -0.20], c: 0x2b8a3e },
      // Green turtle head + big goofy black eyes + open mouth with bright red tongue!
      { s: [0.48, 0.34, 0.42], p: [0, 0.58, 0.02], c: 0x40c057 },
      { s: [0.09, 0.10, 0.06], p: [-0.16, 0.60, 0.22], c: 0x182232 },
      { s: [0.09, 0.10, 0.06], p: [0.16, 0.60, 0.22], c: 0x182232 },
      { s: [0.04, 0.04, 0.07], p: [-0.15, 0.62, 0.23], c: 0xffffff, glow: true },
      { s: [0.04, 0.04, 0.07], p: [0.17, 0.62, 0.23], c: 0xffffff, glow: true },
      { s: [0.20, 0.10, 0.06], p: [0, 0.49, 0.22], c: 0x182232 },
      { s: [0.11, 0.08, 0.07], p: [0.03, 0.48, 0.23], c: 0xff4d6d, glow: true },
      // Puffy White Mini Burger Chef Hat with Red & Gold Band!
      { s: [0.44, 0.08, 0.40], p: [0, 0.77, 0.02], c: 0xe03131 },
      { s: [0.14, 0.07, 0.06], p: [0, 0.77, 0.21], c: 0xffd43b, glow: true },
      { s: [0.50, 0.18, 0.46], p: [0, 0.88, 0.02], c: 0xffffff, glow: true },
    ];
  } else if (kind === 'mini_bananini') {
    // Mini Tung Tung Sahur Drummer: warm teakwood kentungan log buddy (0xb87c44) with golden rings,
    // big googly cartoon eyes, wide cheerful smile, sporty blue sneakers (0x228be6), and mini Sahur drumstick!
    boxes = [
      // Sporty bright blue sneakers with crisp white soles
      { s: [0.18, 0.12, 0.24], p: [-0.13, 0.07, 0.04], c: 0x228be6, glow: true },
      { s: [0.18, 0.12, 0.24], p: [0.13, 0.07, 0.04], c: 0x228be6, glow: true },
      { s: [0.20, 0.04, 0.26], p: [-0.13, 0.02, 0.04], c: 0xffffff, glow: true },
      { s: [0.20, 0.04, 0.26], p: [0.13, 0.02, 0.04], c: 0xffffff, glow: true },
      // Warm teakwood cylindrical kentungan drum log body + golden Sahur bands + carved slit
      { s: [0.44, 0.62, 0.40], p: [0, 0.42, 0], c: 0xb87c44 },
      { s: [0.38, 0.62, 0.46], p: [0, 0.42, 0], c: 0xc98d52 },
      { s: [0.48, 0.08, 0.48], p: [0, 0.18, 0], c: 0xffd43b, glow: true },
      { s: [0.46, 0.07, 0.46], p: [0, 0.70, 0], c: 0xffd43b, glow: true },
      { s: [0.07, 0.20, 0.06], p: [0, 0.32, 0.22], c: 0x3b230a },
      // Big googly white cartoon eyes + dark pupils + cheerful grin + mini golden Sahur drumstick
      { s: [0.14, 0.14, 0.06], p: [-0.11, 0.56, 0.22], c: 0xffffff, glow: true },
      { s: [0.14, 0.14, 0.06], p: [0.11, 0.56, 0.22], c: 0xffffff, glow: true },
      { s: [0.07, 0.08, 0.07], p: [-0.10, 0.56, 0.23], c: 0x182232 },
      { s: [0.07, 0.08, 0.07], p: [0.10, 0.56, 0.23], c: 0x182232 },
      { s: [0.20, 0.06, 0.06], p: [0, 0.44, 0.22], c: 0xffffff, glow: true },
      { s: [0.08, 0.28, 0.08], p: [0.28, 0.42, 0.12], r: [0.4, 0, -0.25], c: 0x8f5a2a },
      { s: [0.14, 0.14, 0.14], p: [0.32, 0.56, 0.18], c: 0xffd43b, glow: true },
    ];
  } else {
    // Mini JJ Security Guard: JJ in bright red hoodie over white shirt + cool dark security sunglasses & golden badge!
    boxes = [
      // Dark denim jeans & security boots
      { s: [0.17, 0.16, 0.20], p: [-0.13, 0.08, 0.02], c: 0x1c7ed6 },
      { s: [0.17, 0.16, 0.20], p: [0.13, 0.08, 0.02], c: 0x1c7ed6 },
      // Bright Red Hoodie over White Shirt + Golden Security Star Badge on chest!
      { s: [0.48, 0.36, 0.36], p: [0, 0.32, 0], c: 0xe03131, glow: true },
      { s: [0.18, 0.32, 0.06], p: [0, 0.32, 0.17], c: 0xffffff, glow: true },
      { s: [0.12, 0.12, 0.07], p: [0.14, 0.36, 0.18], r: [0, 0, 0.785], c: 0xffd43b, glow: true },
      // JJ Peach Head + Warm Brown Hair + Cool Dark Security Sunglasses & Guard Cap!
      { s: [0.46, 0.36, 0.40], p: [0, 0.62, 0.02], c: 0xffd8b8 },
      { s: [0.50, 0.14, 0.44], p: [0, 0.78, 0.02], c: 0x5c3a21 },
      { s: [0.50, 0.28, 0.12], p: [0, 0.64, -0.16], c: 0x5c3a21 },
      // Cool Dark Security Sunglasses with cyan lens glint!
      { s: [0.48, 0.11, 0.08], p: [0, 0.64, 0.21], c: 0x182232 },
      { s: [0.14, 0.09, 0.09], p: [-0.12, 0.64, 0.22], c: 0x182232 },
      { s: [0.14, 0.09, 0.09], p: [0.12, 0.64, 0.22], c: 0x182232 },
      { s: [0.05, 0.05, 0.10], p: [-0.14, 0.66, 0.225], c: 0x39d5ff, glow: true },
      { s: [0.05, 0.05, 0.10], p: [0.10, 0.66, 0.225], c: 0x39d5ff, glow: true },
      // Golden Security Cap emblem on forehead
      { s: [0.16, 0.10, 0.07], p: [0, 0.82, 0.23], c: 0xffd43b, glow: true },
    ];
  }

  geo = mergeVoxelBoxes(boxes);
  geo.scale(1.42, 1.42, 1.42);
  geo.computeBoundingBox();
  geo.computeBoundingSphere();
  sharedCritterGeos.set(kind, geo);
  return geo;
}

export function createCritterManager(ctx = {}) {
  const group = new THREE.Group();
  group.name = 'critters_group';
  if (ctx && ctx.scene) {
    ctx.scene.add(group);
  }

  const instancedByKind = new Map();
  for (let i = 0; i < CRITTER_KINDS.length; i++) {
    const k = CRITTER_KINDS[i];
    const im = new THREE.InstancedMesh(getCritterGeometry(k), getMatteVoxelMaterial(), MAX_PER_KIND);
    im.name = `critters_instanced_${k}`;
    im.castShadow = false;
    im.receiveShadow = false;
    im.frustumCulled = false;
    im.count = 0;
    im.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    im.userData = { interactKind: 'critter', kind: 'critter', critterKind: k };
    group.add(im);
    instancedByKind.set(k, im);
  }

  const heartTex = getHeartTexture();
  const heartPool = [];
  for (let i = 0; i < HEART_POOL_SIZE; i++) {
    const sp = new THREE.Sprite(
      createSafeSpriteMaterial({
        map: heartTex || null,
        color: heartTex ? 0xffffff : 0xff4d6d,
        opacity: 1,
      })
    );
    sp.visible = false;
    group.add(sp);
    heartPool.push(sp);
  }

  const critters = [];
  const byId = new Map();
  let nextSeq = 1;
  let currentSeed = 2026;

  const _raySphere = new THREE.Sphere();
  const _hitPoint = new THREE.Vector3();
  const _parentMat = new THREE.Matrix4();
  const _localMat = new THREE.Matrix4();
  const _pos = new THREE.Vector3();
  const _quat = new THREE.Quaternion();
  const _euler = new THREE.Euler();
  const _scale = new THREE.Vector3();

  function resolveSurfacePosition(rawX, rawY, rawZ) {
    let x = Number(rawX) || 0;
    let z = Number(rawZ) || 0;
    let y = Number.isFinite(rawY) ? Number(rawY) : 1;

    const world = ctx?.world;
    if (world && typeof world.getGroundY === 'function') {
      const gy = world.getGroundY(x, z);
      if (Number.isFinite(gy) && gy > -50) {
        y = gy;
      } else if (typeof world.clampToWalkable === 'function') {
        const clamped = world.clampToWalkable(x, z);
        if (clamped) {
          x = clamped.x;
          y = Number.isFinite(clamped.y) ? clamped.y : 1;
          z = clamped.z;
        }
      }
    }
    return { x, y, z };
  }

  function removeCritterInternal(c) {
    byId.delete(c.id);
    const idx = critters.indexOf(c);
    if (idx !== -1) critters.splice(idx, 1);
  }

  function syncInstances(time = 0) {
    const counts = { mini_cappuccina: 0, mini_bananini: 0, mini_lirili: 0 };
    let heartSlot = 0;

    for (let i = 0; i < critters.length; i++) {
      const c = critters[i];
      const slot = counts[c.kind];
      if (slot >= MAX_PER_KIND) continue;
      counts[c.kind] = slot + 1;

      _pos.set(c.x, c.y, c.z);
      _euler.set(0, c.yaw, 0);
      _quat.setFromEuler(_euler);
      _scale.set(1, 1, 1);
      _parentMat.compose(_pos, _quat, _scale);

      let popScale = 1.0;
      if (c.spawnPopTimer > 0) {
        const u = 1 - c.spawnPopTimer / 0.45;
        popScale = u < 0.7 ? (u / 0.7) * 1.18 : 1.18 - ((u - 0.7) / 0.3) * 0.18;
      }

      const baseHover = c.kind === 'mini_bananini' ? 0.18 + Math.sin(time * 6.5 + c.phase) * 0.10 : 0;

      if (c.petTimer > 0) {
        const p = 1 - c.petTimer / PET_DURATION;
        const arcY = Math.sin(p * Math.PI) * 1.42;
        const flipPitch = -p * Math.PI * 2;
        const stretch = 1 + Math.sin(p * Math.PI * 2) * 0.14;

        _pos.set(0, baseHover + arcY, 0);
        _euler.set(flipPitch, 0, 0);
        _quat.setFromEuler(_euler);
        _scale.set(
          popScale / Math.sqrt(stretch),
          popScale * stretch,
          popScale / Math.sqrt(stretch)
        );
        _localMat.compose(_pos, _quat, _scale);

        if (heartSlot < HEART_POOL_SIZE && c.petTimer > 0.02) {
          const sp = heartPool[heartSlot++];
          sp.visible = true;
          sp.position.set(c.x, c.y + 1.15 + p * 1.10, c.z);
          const hs = 0.55 + Math.sin(p * Math.PI) * 0.38;
          sp.scale.set(hs, hs, 1);
        }
      } else {
        const hopWave = Math.abs(Math.sin(time * 5.2 + c.phase));
        const hopY = c.kind === 'mini_bananini' ? 0 : hopWave * 0.16;
        const waddleRoll = Math.sin(time * (c.kind === 'mini_bananini' ? 10 : 5.2) + c.phase) * 0.09;

        _pos.set(0, baseHover + hopY, 0);
        _euler.set(0, 0, waddleRoll);
        _quat.setFromEuler(_euler);
        _scale.set(popScale, popScale, popScale);
        _localMat.compose(_pos, _quat, _scale);
      }

      _parentMat.multiply(_localMat);
      instancedByKind.get(c.kind).setMatrixAt(slot, _parentMat);
    }

    for (let i = heartSlot; i < HEART_POOL_SIZE; i++) {
      heartPool[i].visible = false;
    }

    for (let i = 0; i < CRITTER_KINDS.length; i++) {
      const k = CRITTER_KINDS[i];
      const im = instancedByKind.get(k);
      im.count = counts[k];
      im.visible = counts[k] > 0;
      im.instanceMatrix.needsUpdate = true;
    }
  }

  function spawnInternal(rawKind, rawX, rawY, rawZ, isAmbient = false) {
    const validKind = resolveCritterKind(rawKind);
    const spec = CRITTER_TYPES[validKind] || CRITTER_TYPES.mini_cappuccina;

    const sameKindCount = critters.filter((item) => item.kind === validKind).length;
    if (critters.length >= MAX_CRITTERS || sameKindCount >= MAX_PER_KIND) {
      const removable =
        critters.find((item) => item.kind === validKind && !item.ambient) ||
        critters.find((item) => !item.ambient) ||
        critters.find((item) => item.kind === validKind);
      if (removable) removeCritterInternal(removable);
    }

    const seq = nextSeq++;
    const id = `critter_${seq}`;
    const pos = resolveSurfacePosition(rawX, rawY, rawZ);
    const phase = hashSeed(currentSeed, seq) * Math.PI * 2;

    const c = {
      id,
      seq,
      kind: validKind,
      ambient: isAmbient,
      homeX: pos.x,
      homeZ: pos.z,
      x: pos.x,
      y: pos.y,
      z: pos.z,
      yaw: phase,
      phase,
      age: isAmbient ? 1.0 : 0.0,
      spawnPopTimer: isAmbient ? 0.0 : 0.45,
      petTimer: 0.0,
      petCount: 0,
      bonusGems: spec.bonusGems,
      voId: spec.voId,
    };

    critters.push(c);
    byId.set(id, c);
    syncInstances(0);

    return {
      id: c.id,
      kind: c.kind,
      x: round3(c.x),
      y: round3(c.y),
      z: round3(c.z),
      petCount: c.petCount,
      bonusGems: c.bonusGems,
      voId: c.voId,
    };
  }

  function spawn(kind, x = 0, y = 1, z = 0) {
    return spawnInternal(kind, x, y, z, false);
  }

  function pet(idOrObj) {
    const id = typeof idOrObj === 'string' ? idOrObj : idOrObj?.id;
    if (!id) return null;
    const c = byId.get(id);
    if (!c) return null;

    c.petTimer = PET_DURATION;
    c.petCount += 1;
    return {
      id: c.id,
      kind: c.kind,
      x: round3(c.x),
      y: round3(c.y),
      z: round3(c.z),
      petCount: c.petCount,
      bonusGems: c.bonusGems,
      voId: c.voId,
    };
  }

  function findNear(x, z, radius = 2.2) {
    const rSq = radius * radius;
    let best = null;
    let bestDistSq = rSq;

    for (let i = 0; i < critters.length; i++) {
      const c = critters[i];
      const dx = c.x - x;
      const dz = c.z - z;
      const dSq = dx * dx + dz * dz;
      if (dSq <= bestDistSq) {
        bestDistSq = dSq;
        best = c;
      }
    }

    if (!best) return null;
    return {
      id: best.id,
      kind: best.kind,
      x: round3(best.x),
      y: round3(best.y),
      z: round3(best.z),
      bonusGems: best.bonusGems,
      voId: best.voId,
      dist: Math.sqrt(bestDistSq),
    };
  }

  function raycast(raycaster) {
    if (!raycaster || critters.length === 0) return null;
    let closest = null;
    let bestDistance = Infinity;

    for (let i = 0; i < critters.length; i++) {
      const c = critters[i];
      const centerY = c.y + (c.kind === 'mini_bananini' ? 0.56 : 0.42);
      _raySphere.center.set(c.x, centerY, c.z);
      _raySphere.radius = 0.92;
      const hit = raycaster.ray.intersectSphere(_raySphere, _hitPoint);
      if (hit) {
        const dist = raycaster.ray.origin.distanceTo(_hitPoint);
        if (dist < bestDistance) {
          bestDistance = dist;
          closest = {
            kind: 'critter',
            id: c.id,
            critter: {
              id: c.id,
              kind: c.kind,
              x: round3(c.x),
              y: round3(c.y),
              z: round3(c.z),
              bonusGems: c.bonusGems,
              voId: c.voId,
            },
            point: _hitPoint.clone(),
            distance: dist,
          };
        }
      }
    }
    return closest;
  }

  function update(dt = 1 / 60, time = 0) {
    const stepDt = Math.max(0, Math.min(0.1, Number(dt) || 0));
    const t = Number(time) || 0;
    const world = ctx?.world;

    for (let i = 0; i < critters.length; i++) {
      const c = critters[i];
      c.age += stepDt;
      if (c.spawnPopTimer > 0) c.spawnPopTimer = Math.max(0, c.spawnPopTimer - stepDt);
      if (c.petTimer > 0) c.petTimer = Math.max(0, c.petTimer - stepDt);

      const wanderSpeed = c.kind === 'mini_bananini' ? 1.05 : 0.72;
      const wanderRadius = c.kind === 'mini_bananini' ? 1.55 : 1.35;
      const angle = c.phase + c.age * wanderSpeed;
      const targetX = c.homeX + Math.cos(angle) * wanderRadius;
      const targetZ = c.homeZ + Math.sin(angle * 0.85) * wanderRadius;

      let canStep = true;
      let groundY = c.y;
      if (world && typeof world.getGroundY === 'function') {
        const gy = world.getGroundY(targetX, targetZ);
        if (Number.isFinite(gy) && gy > -50 && Math.abs(gy - c.y) <= 1.2) {
          groundY = gy;
        } else {
          canStep = false;
          const curGy = world.getGroundY(c.x, c.z);
          if (Number.isFinite(curGy) && curGy > -50) groundY = curGy;
        }
      }

      if (canStep && c.petTimer <= 0) {
        const dx = targetX - c.x;
        const dz = targetZ - c.z;
        const moveAlpha = Math.min(1, stepDt * 3.5);
        c.x += dx * moveAlpha;
        c.z += dz * moveAlpha;
        if (dx * dx + dz * dz > 0.0001) {
          c.yaw = Math.atan2(dx, dz);
        }
      }
      c.y = groundY;
    }

    syncInstances(t);
  }

  function getSnapshot() {
    return critters.map((c) => ({
      id: c.id,
      kind: c.kind,
      x: round3(c.x),
      y: round3(c.y),
      z: round3(c.z),
      petCount: c.petCount,
      bouncing: c.petTimer > 0,
    }));
  }

  function reset(seed = 2026) {
    currentSeed = Number(seed) || 2026;
    critters.length = 0;
    byId.clear();
    nextSeq = 1;

    for (let i = 0; i < AMBIENT_CRITTER_SPAWNS.length; i++) {
      const s = AMBIENT_CRITTER_SPAWNS[i];
      const jitterX = (hashSeed(currentSeed, i * 2 + 11) - 0.5) * 1.2;
      const jitterZ = (hashSeed(currentSeed, i * 2 + 12) - 0.5) * 1.2;
      spawnInternal(s.kind, s.x + jitterX, 1, s.z + jitterZ, true);
    }
    syncInstances(0);
  }

  reset(ctx?.state?.seed ?? 2026);

  return {
    group,
    spawn,
    pet,
    findNear,
    raycast,
    update,
    getSnapshot,
    reset,
  };
}
