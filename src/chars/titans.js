// 4 Giant (4.2x-5.0x) Bespoke 3D Boss Visitors for JJ & Mikey vs Tung Tung Sahur: McDonald's Burger Battle 3D!:
// 1. tralalero_tralala (★1 Cursed Land Pixel Ghost: snow-white pixel ghost from Mikey's $1 Cursed Land with mossy cobblestone & red ketchup paintbrush)
// 2. bombardiro_crocodilo (★2 Sneaky Burger Robber Bandit: black domino mask, black-and-white burglar stripes, red McDonald's cap, golden burger loot sack & red plunger)
// 3. brr_brr_patapim (★3 TNT Rotten-Burger Golem: red-and-white TNT demolition block golem crowned with Mikey's smelly green rotten-meat burger & green fries)
// 4. golden_sahur_king (★4 Tung Tung Sahur Burger King: giant 5.0x crowned golden Kentungan Titan Chef with Triple Cheeseburger Value Combo tray & Golden Taiko Drum Mallet)
// Zero CJK text, metalness <= 0.20, 100% deterministic.

import * as THREE from '../../vendor/three.module.min.js';
import { HUB_LAYOUT, TITAN_ORDER, TITANS, resolveBossId } from '../data/catalog.js';
import {
  buildRainbowSpringCloudMesh,
  buildVoxelGroup,
  getFlashVoxelMaterial,
  getGlowVoxelMaterial,
} from './props3d.js';

const SPAWN_DURATION = 0.65;
const LAUGH_DURATION = 1.15;
const SQUASH_DURATION = 0.36;
const FLASH_DURATION = 0.13;
const DIZZY_DURATION = 1.65;
const PINATA_DURATION = 0.75;
const CLOUD_DURATION = 1.20;

const CANDY_COLORS = [
  0xff595e,
  0xff922b,
  0xffd43b,
  0x51cf66,
  0x39d5ff,
  0x9775fa,
  0xff6b9d,
  0xfff3bf,
];

function round3(n) {
  return Math.round(n * 1000) / 1000;
}

function setGroupFlash(meshList, flashing) {
  const flashMat = getFlashVoxelMaterial();
  for (let i = 0; i < meshList.length; i++) {
    const m = meshList[i];
    m.material = flashing ? flashMat : m.userData.baseMaterial;
  }
}

// ---------------------------------------------------------------------------
// Articulated Voxel Rig Builders for Each of the 4 Towering Burger Battle Bosses
// ---------------------------------------------------------------------------

function getTitanPartSpecs(rawTitanId) {
  const titanId = resolveBossId(rawTitanId);
  if (titanId === 'tralalero_tralala') {
    // ★1 Cursed Land Pixel Ghost: Giant floating snow-white pixel ghost from Mikey's $1 Cursed Land thumbnail
    // (0xffffff shroud with pixelated bottom fringe, hollow black eyes & open "O" mouth, mossy cobblestone block & red ketchup-handprint paintbrush!)
    return {
      glowEmissive: 0x39d5ff,
      glowIntensity: 0.34,
      leg: [
        // Floating snow-white pixelated ghost shroud bottom fringe with black pixel border trim
        { s: [0.30, 0.30, 0.30], p: [0, -0.15, 0], c: 0xffffff, glow: true },
        { s: [0.18, 0.18, 0.22], p: [-0.08, -0.34, 0.04], c: 0xe2e8f0, glow: true },
        { s: [0.18, 0.14, 0.22], p: [0.08, -0.32, -0.04], c: 0xffffff, glow: true },
        { s: [0.32, 0.06, 0.32], p: [0, -0.42, 0], c: 0x182232 },
      ],
      torso: [
        // Billowing snow-white pixel ghost sheet body + black pixel side border + red ketchup handprint splat on chest!
        { s: [0.88, 0.66, 0.66], p: [0, 0.34, 0], c: 0xffffff, glow: true },
        { s: [0.92, 0.56, 0.10], p: [0, 0.34, -0.30], c: 0xe2e8f0, glow: true },
        { s: [0.08, 0.60, 0.58], p: [-0.44, 0.34, 0], c: 0x182232 },
        { s: [0.08, 0.60, 0.58], p: [0.44, 0.34, 0], c: 0x182232 },
        // Spooky-cute Red Ketchup Handprint badge on chest (+Z)
        { s: [0.24, 0.22, 0.08], p: [0, 0.34, 0.33], c: 0xe03131, glow: true },
        { s: [0.06, 0.12, 0.09], p: [-0.08, 0.48, 0.33], c: 0xff595e, glow: true },
        { s: [0.06, 0.14, 0.09], p: [0, 0.50, 0.33], c: 0xff595e, glow: true },
        { s: [0.06, 0.12, 0.09], p: [0.08, 0.48, 0.33], c: 0xff595e, glow: true },
      ],
      armL: [
        // Left white ghost sleeve holding a Mossy Cobblestone Block from Mikey's $1 Noob Shack!
        { s: [0.30, 0.36, 0.30], p: [0.08, -0.10, 0], c: 0xffffff, glow: true },
        { s: [0.36, 0.36, 0.36], p: [0.12, -0.40, 0.10], c: 0x767b82 },
        { s: [0.38, 0.16, 0.38], p: [0.12, -0.36, 0.10], c: 0x5c8a3c, glow: true },
      ],
      armR: [
        // Right white ghost sleeve holding a Red Ketchup-Handprint Paintbrush!
        { s: [0.30, 0.36, 0.30], p: [-0.08, -0.10, 0], c: 0xffffff, glow: true },
        { s: [0.12, 0.42, 0.12], p: [-0.10, -0.38, 0.14], r: [0.45, 0, 0], c: 0x8f5a2a },
        { s: [0.22, 0.24, 0.18], p: [-0.10, -0.54, 0.28], r: [0.45, 0, 0], c: 0xe03131, glow: true },
      ],
      head: [
        // Snow-white pixel ghost head with hollow black eyes & open square "O" mouth (exact thumbnail ghost!)
        { s: [0.76, 0.58, 0.64], p: [0, 0.29, 0], c: 0xffffff, glow: true },
        { s: [0.64, 0.10, 0.56], p: [0, 0.60, 0], c: 0xffffff, glow: true },
        { s: [0.78, 0.08, 0.66], p: [0, 0.64, 0], c: 0x182232 },
        // Spooky-cute vertical hollow black pixel eyes
        { s: [0.14, 0.20, 0.08], p: [-0.18, 0.36, 0.31], c: 0x182232 },
        { s: [0.14, 0.20, 0.08], p: [0.18, 0.36, 0.31], c: 0x182232 },
        { s: [0.06, 0.06, 0.09], p: [-0.16, 0.41, 0.32], c: 0x39d5ff, glow: true },
        { s: [0.06, 0.06, 0.09], p: [0.20, 0.41, 0.32], c: 0x39d5ff, glow: true },
        // Iconic square open "O" ghost mouth!
        { s: [0.20, 0.20, 0.08], p: [0, 0.15, 0.31], c: 0x182232 },
      ],
      topperY: 0.58,
      topper: [
        // Floating $1 Cursed Land Dirt-Block "M" & Glowing Ghost Halo!
        { s: [0.56, 0.08, 0.56], p: [0, 0.10, 0], c: 0x39d5ff, glow: true },
        { s: [0.14, 0.36, 0.14], p: [-0.18, 0.30, 0], c: 0x8f5a2a },
        { s: [0.14, 0.36, 0.14], p: [0.18, 0.30, 0], c: 0x8f5a2a },
        { s: [0.14, 0.20, 0.14], p: [0, 0.32, 0], c: 0x7c4d25 },
      ],
    };
  }

  if (titanId === 'bombardiro_crocodilo') {
    // ★2 Sneaky Burger Robber Bandit: The masked robber from 12:13 in the video
    // (black domino mask, black-and-white burglar stripes, red McDonald's cap, overflowing golden burger-coin loot sack on his back, and silly red plunger pop-blaster!)
    return {
      glowEmissive: 0xffd43b,
      glowIntensity: 0.34,
      leg: [
        // Sneaky charcoal bandit pants + black-and-gold sneaker boots
        { s: [0.28, 0.34, 0.28], p: [0, -0.17, 0], c: 0x212529 },
        { s: [0.34, 0.16, 0.40], p: [0, -0.39, 0.04], c: 0x182232 },
        { s: [0.36, 0.06, 0.42], p: [0, -0.45, 0.04], c: 0xffd43b, glow: true },
      ],
      torso: [
        // Classic Black-and-White Horizontal Burglar Stripes Shirt!
        { s: [0.86, 0.14, 0.56], p: [0, 0.10, 0], c: 0x182232 },
        { s: [0.86, 0.14, 0.56], p: [0, 0.24, 0], c: 0xffffff, glow: true },
        { s: [0.86, 0.14, 0.56], p: [0, 0.38, 0], c: 0x182232 },
        { s: [0.86, 0.14, 0.56], p: [0, 0.52, 0], c: 0xffffff, glow: true },
        { s: [0.86, 0.12, 0.56], p: [0, 0.64, 0], c: 0x182232 },
        // Golden Dollar/Burger belt buckle on front (+Z)
        { s: [0.24, 0.14, 0.08], p: [0, 0.12, 0.28], c: 0xffd43b, glow: true },
        // Overflowing Golden Burger-Coin Loot Sack slung on his back (-Z)!
        { s: [0.68, 0.58, 0.44], p: [0, 0.36, -0.42], c: 0xd99b66 },
        { s: [0.48, 0.16, 0.36], p: [0, 0.68, -0.42], c: 0xffd43b, glow: true },
        { s: [0.34, 0.14, 0.28], p: [0, 0.80, -0.42], c: 0xffe066, glow: true },
      ],
      armL: [
        // Burglar striped left arm holding a stolen Golden Burger Stack!
        { s: [0.28, 0.16, 0.28], p: [0.06, 0.02, 0], c: 0x182232 },
        { s: [0.26, 0.16, 0.26], p: [0.06, -0.14, 0], c: 0xffffff, glow: true },
        { s: [0.26, 0.16, 0.26], p: [0.06, -0.30, 0], c: 0x182232 },
        { s: [0.34, 0.22, 0.34], p: [0.08, -0.48, 0.08], c: 0xffd43b, glow: true },
      ],
      armR: [
        // Burglar striped right arm wielding a Silly Red Plunger Pop-Blaster!
        { s: [0.28, 0.16, 0.28], p: [-0.06, 0.02, 0], c: 0x182232 },
        { s: [0.26, 0.16, 0.26], p: [-0.06, -0.14, 0], c: 0xffffff, glow: true },
        { s: [0.12, 0.44, 0.12], p: [-0.08, -0.36, 0.16], r: [0.5, 0, 0], c: 0x8f5a2a },
        { s: [0.36, 0.22, 0.36], p: [-0.08, -0.54, 0.34], r: [0.5, 0, 0], c: 0xe03131, glow: true },
      ],
      head: [
        // Bandit head + Black Domino Mask + glowing eyes + Red McDonald's Cap!
        { s: [0.68, 0.54, 0.60], p: [0, 0.27, 0], c: 0xffd8b8 },
        // Wide Black Domino Mask across the eyes
        { s: [0.72, 0.20, 0.64], p: [0, 0.35, 0.02], c: 0x182232 },
        { s: [0.16, 0.12, 0.08], p: [-0.18, 0.35, 0.32], c: 0xffffff, glow: true },
        { s: [0.16, 0.12, 0.08], p: [0.18, 0.35, 0.32], c: 0xffffff, glow: true },
        { s: [0.08, 0.08, 0.09], p: [-0.16, 0.35, 0.33], c: 0x182232 },
        { s: [0.08, 0.08, 0.09], p: [0.16, 0.35, 0.33], c: 0x182232 },
        // Mischievous bandit grin
        { s: [0.34, 0.09, 0.06], p: [0, 0.14, 0.30], c: 0xffffff, glow: true },
        // Red McDonald's Robber Cap + Golden "M" badge
        { s: [0.72, 0.16, 0.64], p: [0, 0.54, 0], c: 0xe03131 },
        { s: [0.58, 0.07, 0.24], p: [0, 0.49, 0.38], c: 0xc92a2a },
        { s: [0.18, 0.12, 0.08], p: [0, 0.56, 0.32], c: 0xffd43b, glow: true },
      ],
      topperY: 0.58,
      topper: [
        // Spinning Golden Burger-Coin Loot Rotor atop his Red McDonald's Cap!
        { s: [0.22, 0.20, 0.22], p: [0, 0.10, 0], c: 0xe03131, glow: true },
        { s: [0.92, 0.08, 0.16], p: [0, 0.22, 0], c: 0xffd43b, glow: true },
        { s: [0.16, 0.08, 0.92], p: [0, 0.22, 0], c: 0xffd43b, glow: true },
      ],
    };
  }

  if (titanId === 'brr_brr_patapim') {
    // ★3 TNT Rotten-Burger Golem: Giant red-and-white TNT demolition block golem (0xe03131 red dynamite sticks + white TNT band)
    // crowned with Mikey's smelly green rotten-meat burger and green french fries (0x51cf66 / 0x94d82d) from 07:45 and 14:03!
    return {
      glowEmissive: 0x94d82d,
      glowIntensity: 0.34,
      leg: [
        // Bundled red TNT dynamite legs + glowing green rotten-sauce stompers!
        { s: [0.30, 0.34, 0.30], p: [0, -0.17, 0], c: 0xe03131 },
        { s: [0.32, 0.08, 0.32], p: [0, -0.16, 0], c: 0xffffff, glow: true },
        { s: [0.40, 0.16, 0.48], p: [0, -0.40, 0.06], c: 0x51cf66, glow: true },
      ],
      torso: [
        // Massive Red-and-White TNT Demolition Block Chest!
        { s: [0.92, 0.68, 0.64], p: [0, 0.34, 0], c: 0xe03131 },
        // Crisp White "TNT" Center Band wrapping around the chest
        { s: [0.96, 0.26, 0.68], p: [0, 0.34, 0], c: 0xffffff, glow: true },
        // Bold Black "T N T" pixel bars on the front white band (+Z)
        { s: [0.16, 0.05, 0.06], p: [-0.26, 0.41, 0.33], c: 0x182232 },
        { s: [0.06, 0.18, 0.06], p: [-0.26, 0.34, 0.33], c: 0x182232 },
        { s: [0.16, 0.18, 0.06], p: [0, 0.34, 0.33], c: 0x182232 },
        { s: [0.16, 0.05, 0.06], p: [0.26, 0.41, 0.33], c: 0x182232 },
        { s: [0.06, 0.18, 0.06], p: [0.26, 0.34, 0.33], c: 0x182232 },
        // Dark grey gunpowder top/bottom caps
        { s: [0.88, 0.06, 0.60], p: [0, 0.66, 0], c: 0x3b384a },
      ],
      armL: [
        // Red TNT bundle arm + Smelly Green French-Fry Club!
        { s: [0.32, 0.42, 0.32], p: [0.06, -0.16, 0], c: 0xe03131 },
        { s: [0.34, 0.12, 0.34], p: [0.06, -0.16, 0], c: 0xffffff, glow: true },
        { s: [0.34, 0.24, 0.34], p: [0.06, -0.48, 0.04], c: 0x94d82d, glow: true },
      ],
      armR: [
        { s: [0.32, 0.42, 0.32], p: [-0.06, -0.16, 0], c: 0xe03131 },
        { s: [0.34, 0.12, 0.34], p: [-0.06, -0.16, 0], c: 0xffffff, glow: true },
        { s: [0.34, 0.24, 0.34], p: [-0.06, -0.48, 0.04], c: 0x51cf66, glow: true },
      ],
      head: [
        // Red TNT block head + glowing green rotten-burger eyes + chomping grin
        { s: [0.72, 0.56, 0.62], p: [0, 0.28, 0], c: 0xe03131 },
        { s: [0.74, 0.14, 0.64], p: [0, 0.18, 0], c: 0xffffff, glow: true },
        { s: [0.22, 0.08, 0.08], p: [-0.18, 0.44, 0.31], r: [0, 0, -0.14], c: 0x94d82d, glow: true },
        { s: [0.22, 0.08, 0.08], p: [0.18, 0.44, 0.31], r: [0, 0, 0.14], c: 0x94d82d, glow: true },
        { s: [0.18, 0.16, 0.06], p: [-0.18, 0.34, 0.31], c: 0x94d82d, glow: true },
        { s: [0.18, 0.16, 0.06], p: [0.18, 0.34, 0.31], c: 0x94d82d, glow: true },
        { s: [0.08, 0.09, 0.07], p: [-0.16, 0.34, 0.32], c: 0x182232 },
        { s: [0.08, 0.09, 0.07], p: [0.16, 0.34, 0.32], c: 0x182232 },
        { s: [0.38, 0.10, 0.06], p: [0, 0.12, 0.32], c: 0x182232 },
      ],
      topperY: 0.56,
      topper: [
        // Crowned with Mikey's Smelly Green Rotten-Meat Burger & Green French Fries!
        { s: [0.78, 0.12, 0.74], p: [0, 0.08, 0], c: 0xd99b66 },
        { s: [0.88, 0.18, 0.84], p: [0, 0.22, 0], c: 0x51cf66, glow: true },
        { s: [0.82, 0.10, 0.78], p: [0, 0.34, 0], c: 0x94d82d, glow: true },
        { s: [0.74, 0.14, 0.70], p: [0, 0.44, 0], c: 0xd99b66 },
        // Green French Fries & sparkling TNT fuse sticking out of the crown!
        { s: [0.10, 0.28, 0.10], p: [-0.22, 0.60, 0], r: [0, 0, 0.22], c: 0x94d82d, glow: true },
        { s: [0.10, 0.32, 0.10], p: [0, 0.64, 0], c: 0xffd43b, glow: true },
        { s: [0.10, 0.28, 0.10], p: [0.22, 0.60, 0], r: [0, 0, -0.22], c: 0x51cf66, glow: true },
      ],
    };
  }

  // ★4 golden_sahur_king: Giant 5.0x Crowned Golden Tung Tung Tung Sahur Burger King!
  // Wearing a royal golden McDonald's Burger Crown, holding a giant Triple Cheeseburger Value Combo tray in one hand
  // and a blazing Golden Taiko Drum Mallet in the other!
  return {
    glowEmissive: 0xffc038,
    glowIntensity: 0.40,
    leg: [
      { s: [0.32, 0.36, 0.34], p: [0, -0.18, 0], c: 0x8f5a2a },
      { s: [0.34, 0.12, 0.36], p: [0, -0.16, 0.02], c: 0xffd43b, glow: true },
      { s: [0.36, 0.16, 0.42], p: [0, -0.41, 0.04], c: 0x228be6, glow: true },
      { s: [0.38, 0.06, 0.44], p: [0, -0.47, 0.04], c: 0xffffff, glow: true },
    ],
    torso: [
      // Royal golden-teakwood Kentungan Titan Chef torso + crimson royal cape + Golden Arches Kentungan Core
      { s: [0.94, 0.66, 0.58], p: [0, 0.34, 0], c: 0xb87c44 },
      { s: [0.98, 0.14, 0.62], p: [0, 0.09, 0], c: 0xffc038, glow: true },
      { s: [0.98, 0.12, 0.62], p: [0, 0.58, 0], c: 0xffc038, glow: true },
      { s: [0.88, 0.62, 0.10], p: [0, 0.30, -0.32], c: 0xe03131 },
      // Carved Kentungan acoustic slit + Golden "M" Burger King emblem on chest
      { s: [0.14, 0.44, 0.08], p: [0, 0.34, 0.28], c: 0x3b230a },
      { s: [0.34, 0.28, 0.12], p: [0, 0.38, 0.30], c: 0xffd43b, glow: true },
      { s: [0.22, 0.18, 0.14], p: [0, 0.38, 0.31], c: 0xe03131, glow: true },
    ],
    armL: [
      // Left Arm holding a Giant Triple Cheeseburger Value Combo Tray (Burger + Crispy Fries + Fizzy Cola)!
      { s: [0.40, 0.26, 0.38], p: [0.06, 0.06, 0], c: 0xe03131 },
      { s: [0.42, 0.10, 0.40], p: [0.06, 0.18, 0], c: 0xffd43b, glow: true },
      { s: [0.28, 0.38, 0.30], p: [0.04, -0.22, 0], c: 0xb87c44 },
      // Silver-gold Value Combo Tray + Triple Cheeseburger + Red Fries Carton + Cyan Cola Cup!
      { s: [0.64, 0.06, 0.52], p: [0.12, -0.44, 0.18], c: 0xf8f9fa, glow: true },
      { s: [0.30, 0.24, 0.30], p: [0.02, -0.30, 0.20], c: 0xf59f00, glow: true },
      { s: [0.32, 0.08, 0.32], p: [0.02, -0.30, 0.20], c: 0x51cf66, glow: true },
      { s: [0.20, 0.26, 0.18], p: [0.28, -0.29, 0.22], c: 0xe03131, glow: true },
      { s: [0.18, 0.14, 0.16], p: [0.28, -0.12, 0.22], c: 0xffd43b, glow: true },
    ],
    armR: [
      // Right Arm wielding a Blazing Golden Taiko Drum Mallet!
      { s: [0.40, 0.26, 0.38], p: [-0.06, 0.06, 0], c: 0xe03131 },
      { s: [0.42, 0.10, 0.40], p: [-0.06, 0.18, 0], c: 0xffd43b, glow: true },
      { s: [0.28, 0.38, 0.30], p: [-0.04, -0.22, 0], c: 0xb87c44 },
      { s: [0.14, 0.46, 0.14], p: [-0.06, -0.42, 0.18], r: [0.45, 0, 0], c: 0x8f5a2a },
      { s: [0.42, 0.36, 0.54], p: [-0.06, -0.58, 0.36], r: [0.45, 0, 0], c: 0xffd43b, glow: true },
    ],
    head: [
      { s: [0.70, 0.58, 0.62], p: [0, 0.29, 0], c: 0xc98d52 },
      { s: [0.54, 0.12, 0.12], p: [0, 0.19, 0.31], c: 0xffd43b, glow: true },
      { s: [0.36, 0.14, 0.10], p: [0, 0.08, 0.31], c: 0xffffff, glow: true },
      { s: [0.22, 0.08, 0.08], p: [-0.18, 0.45, 0.31], r: [0, 0, -0.14], c: 0xffd43b, glow: true },
      { s: [0.22, 0.08, 0.08], p: [0.18, 0.45, 0.31], r: [0, 0, 0.14], c: 0xffd43b, glow: true },
      { s: [0.18, 0.16, 0.06], p: [-0.18, 0.33, 0.31], c: 0xffffff, glow: true },
      { s: [0.18, 0.16, 0.06], p: [0.18, 0.33, 0.31], c: 0xffffff, glow: true },
      { s: [0.09, 0.10, 0.07], p: [-0.17, 0.33, 0.32], c: 0x182232 },
      { s: [0.09, 0.10, 0.07], p: [0.17, 0.33, 0.32], c: 0x182232 },
    ],
    topperY: 0.58,
    topper: [
      // Giant Royal Golden McDonald's Burger Crown!
      { s: [0.76, 0.18, 0.70], p: [0, 0.09, 0], c: 0xffd43b, glow: true },
      { s: [0.54, 0.18, 0.54], p: [0, 0.24, 0], c: 0xf59f00, glow: true },
      { s: [0.58, 0.08, 0.58], p: [0, 0.30, 0], c: 0x51cf66, glow: true },
      { s: [0.15, 0.24, 0.15], p: [-0.28, 0.28, 0.26], c: 0xfff3bf, glow: true },
      { s: [0.18, 0.34, 0.16], p: [0, 0.34, 0.28], c: 0xffd43b, glow: true },
      { s: [0.15, 0.24, 0.15], p: [0.28, 0.28, 0.26], c: 0xfff3bf, glow: true },
      { s: [0.15, 0.24, 0.15], p: [-0.28, 0.28, -0.26], c: 0xfff3bf, glow: true },
      { s: [0.15, 0.24, 0.15], p: [0.28, 0.28, -0.26], c: 0xfff3bf, glow: true },
      { s: [0.16, 0.16, 0.08], p: [0, 0.12, 0.36], c: 0xe03131, glow: true },
      { s: [0.13, 0.13, 0.08], p: [-0.22, 0.11, 0.35], c: 0x39d5ff, glow: true },
      { s: [0.13, 0.13, 0.08], p: [0.22, 0.11, 0.35], c: 0x51cf66, glow: true },
    ],
  };
}

function buildDizzyStarsMesh() {
  const starBoxes = [];
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2;
    const rx = Math.cos(a) * 0.56;
    const rz = Math.sin(a) * 0.56;
    const col = i % 2 === 0 ? 0xffd43b : 0x39d5ff;
    starBoxes.push(
      { s: [0.18, 0.18, 0.08], p: [rx, 0, rz], r: [0, a, 0.785], c: col, glow: true },
      { s: [0.08, 0.08, 0.18], p: [rx, 0, rz], r: [0.785, a, 0], c: 0xffffff, glow: true }
    );
  }
  return buildVoxelGroup(starBoxes, {
    name: 'boss_dizzy_stars',
    glowEmissive: 0xffe066,
    glowIntensity: 0.42,
    castShadow: false,
  });
}

function buildTitanRig(titanId) {
  const parts = getTitanPartSpecs(titanId);
  const tag = { interactKind: 'titan', kind: 'titan', titanId };

  const root = new THREE.Group();
  root.name = `titan_${titanId}`;
  root.visible = false;

  const animGroup = new THREE.Group();
  animGroup.name = `${titanId}_anim`;
  root.add(animGroup);

  const opts = {
    glowEmissive: parts.glowEmissive,
    glowIntensity: parts.glowIntensity,
    userData: tag,
  };

  const legL = buildVoxelGroup(parts.leg, { ...opts, name: `${titanId}_leg_l` });
  legL.position.set(0.24, 0.44, 0);
  animGroup.add(legL);

  const legR = buildVoxelGroup(parts.leg, { ...opts, name: `${titanId}_leg_r` });
  legR.position.set(-0.24, 0.44, 0);
  animGroup.add(legR);

  const torsoPivot = new THREE.Group();
  torsoPivot.position.set(0, 0.44, 0);
  animGroup.add(torsoPivot);

  const torsoMesh = buildVoxelGroup(parts.torso, { ...opts, castShadow: true, name: `${titanId}_torso` });
  torsoPivot.add(torsoMesh);

  const armL = buildVoxelGroup(parts.armL, { ...opts, name: `${titanId}_arm_l` });
  armL.position.set(0.58, 0.54, 0);
  armL.rotation.z = 0.14;
  torsoPivot.add(armL);

  const armR = buildVoxelGroup(parts.armR, { ...opts, name: `${titanId}_arm_r` });
  armR.position.set(-0.58, 0.54, 0);
  armR.rotation.z = -0.14;
  torsoPivot.add(armR);

  const headPivot = new THREE.Group();
  headPivot.position.set(0, 0.58, 0);
  torsoPivot.add(headPivot);

  const headMesh = buildVoxelGroup(parts.head, { ...opts, name: `${titanId}_head` });
  headPivot.add(headMesh);

  const topperPivot = new THREE.Group();
  topperPivot.position.set(0, parts.topperY * 0.92, 0);
  headPivot.add(topperPivot);

  const topperMesh = buildVoxelGroup(parts.topper, { ...opts, name: `${titanId}_topper` });
  topperMesh.scale.setScalar(0.88);
  topperPivot.add(topperMesh);

  const dizzyStars = buildDizzyStarsMesh();
  dizzyStars.position.set(0, 1.46, 0);
  dizzyStars.visible = false;
  animGroup.add(dizzyStars);

  const voxelMeshes = [
    ...legL.userData.voxelMeshes,
    ...legR.userData.voxelMeshes,
    ...torsoMesh.userData.voxelMeshes,
    ...armL.userData.voxelMeshes,
    ...armR.userData.voxelMeshes,
    ...headMesh.userData.voxelMeshes,
    ...topperMesh.userData.voxelMeshes,
  ];

  return {
    root,
    animGroup,
    legL,
    legR,
    torsoPivot,
    armL,
    armR,
    headPivot,
    topperPivot,
    dizzyStars,
    voxelMeshes,
  };
}

export function createTitanManager(ctx = {}) {
  const group = new THREE.Group();
  group.name = 'titans_group';
  if (ctx && ctx.scene) {
    ctx.scene.add(group);
  }

  const shockwaveMat = new THREE.MeshBasicMaterial({
    color: 0xffe066,
    transparent: true,
    opacity: 0.0,
    side: THREE.DoubleSide,
    depthWrite: false,
    toneMapped: false,
    fog: false,
  });
  const shockwaveRing = new THREE.Mesh(new THREE.RingGeometry(0.55, 0.95, 24), shockwaveMat);
  shockwaveRing.rotation.x = -Math.PI * 0.5;
  shockwaveRing.visible = false;
  group.add(shockwaveRing);

  const rainbowCloud = buildRainbowSpringCloudMesh();
  rainbowCloud.visible = false;
  group.add(rainbowCloud);

  const pinataBoxGeo = new THREE.BoxGeometry(0.45, 0.45, 0.45);
  const pinataMat = getGlowVoxelMaterial(0xffe066, 0.40);
  const pinataInstanced = new THREE.InstancedMesh(pinataBoxGeo, pinataMat, 16);
  pinataInstanced.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  const tmpColor = new THREE.Color();
  for (let i = 0; i < 16; i++) {
    tmpColor.setHex(CANDY_COLORS[i % CANDY_COLORS.length]);
    pinataInstanced.setColorAt(i, tmpColor);
  }
  if (pinataInstanced.instanceColor) pinataInstanced.instanceColor.needsUpdate = true;
  pinataInstanced.visible = false;
  pinataInstanced.frustumCulled = false;
  group.add(pinataInstanced);

  const _dummy = new THREE.Object3D();
  const _hitBox = new THREE.Box3();
  const _hitPoint = new THREE.Vector3();

  let cloudTimer = 0;
  const cloudOrigin = { x: 0, y: 1, z: 0 };
  let shockwaveTimer = 0;
  const shockwaveOrigin = { x: 0, y: 1, z: 0 };
  let pinataBurstTimer = 0;
  const pinataOrigin = { x: 0, y: 2, z: 0 };

  const records = new Map();
  let lastSpawnedId = null;

  for (let i = 0; i < TITAN_ORDER.length; i++) {
    const id = TITAN_ORDER[i];
    const spec = TITANS[id];
    const rig = buildTitanRig(id);
    group.add(rig.root);

    records.set(id, {
      id,
      titanId: id,
      spec,
      rig,
      x: spec.spawnPos.x,
      y: spec.spawnPos.y,
      z: spec.spawnPos.z,
      yaw: 0,
      hp: spec.maxHp,
      maxHp: spec.maxHp,
      scale: spec.scale,
      requiredTier: spec.requiredTier,
      biome: spec.biome,
      name: spec.name,
      shortName: spec.shortName,
      active: false,
      spawned: false,
      defeated: false,
      state: 'dormant',
      spawnTimer: 0,
      laughTimer: 0,
      squashTimer: 0,
      flashTimer: 0,
      dizzyTimer: 0,
      topperSpinTimer: 0,
      pinataTimer: 0,
      napReturnTimer: 0,
      idleNapTimer: 0,
      isSurprise: false,
      boingCount: 0,
      hitCount: 0,
      age: 0,
    });
  }

  function toPublicTitan(rec) {
    if (!rec) return null;
    return {
      id: rec.id,
      titanId: rec.titanId,
      name: rec.name,
      shortName: rec.shortName,
      biome: rec.biome,
      requiredTier: rec.requiredTier,
      hp: rec.hp,
      maxHp: rec.maxHp,
      scale: rec.scale,
      rewardGems: rec.spec.rewardGems,
      x: round3(rec.x),
      y: round3(rec.y),
      z: round3(rec.z),
      active: rec.active,
      spawned: rec.spawned,
      defeated: rec.defeated,
      state: rec.state,
      boingCount: rec.boingCount,
      hitCount: rec.hitCount,
    };
  }

  function spawn(rawTitanId, pos = null, opts = {}) {
    const titanId = resolveBossId(rawTitanId);
    const rec = records.get(titanId);
    if (!rec) return null;

    for (const [otherId, other] of records.entries()) {
      if (otherId !== titanId && other.active && !other.defeated) {
        other.active = false;
        other.state = 'hidden';
        other.rig.root.visible = false;
        other.rig.dizzyStars.visible = false;
        setGroupFlash(other.rig.voxelMeshes, false);
        ctx?.world?.restoreMegaBlock?.(otherId);
      }
    }

    let x = pos?.x ?? rec.spec.spawnPos.x;
    let z = pos?.z ?? rec.spec.spawnPos.z;
    let y = pos?.y ?? rec.spec.spawnPos.y;

    if (pos?.y === undefined && ctx?.world && typeof ctx.world.getGroundY === 'function') {
      const gy = ctx.world.getGroundY(x, z);
      if (Number.isFinite(gy) && gy > -50) y = gy;
    }

    const player = ctx?.state?.player;
    const faceTargetX = player?.x ?? HUB_LAYOUT.spawn.x;
    const faceTargetZ = player?.z ?? HUB_LAYOUT.spawn.z;
    const yaw = Math.atan2(faceTargetX - x, faceTargetZ - z);

    rec.x = x;
    rec.y = y;
    rec.z = z;
    rec.yaw = yaw;
    rec.hp = rec.maxHp;
    rec.active = true;
    rec.spawned = true;
    rec.defeated = false;
    rec.isSurprise = Boolean(opts?.surprise);
    rec.state = 'spawning';
    rec.spawnTimer = SPAWN_DURATION;
    rec.laughTimer = 0;
    rec.squashTimer = 0;
    rec.flashTimer = 0;
    rec.dizzyTimer = 0;
    rec.topperSpinTimer = 0;
    rec.pinataTimer = 0;
    rec.napReturnTimer = 0;
    rec.idleNapTimer = rec.isSurprise ? 14.0 : 0;
    rec.boingCount = 0;
    rec.age = 0;

    setGroupFlash(rec.rig.voxelMeshes, false);
    rec.rig.dizzyStars.visible = false;
    rec.rig.root.visible = true;
    rec.rig.root.position.set(x, y, z);
    rec.rig.root.rotation.set(0, yaw, 0);
    rec.rig.root.scale.setScalar(rec.scale * 0.08);

    shockwaveOrigin.x = x;
    shockwaveOrigin.y = y + 0.08;
    shockwaveOrigin.z = z;
    shockwaveTimer = SPAWN_DURATION;
    shockwaveRing.position.set(x, y + 0.08, z);
    shockwaveRing.scale.setScalar(0.5);
    shockwaveRing.visible = true;
    shockwaveMat.color.setHex(rec.spec.accentColor || 0xffe066);
    shockwaveMat.opacity = 0.92;

    lastSpawnedId = titanId;
    return toPublicTitan(rec);
  }

  function hit(rawTitanId, damage = 10, canBeat = true) {
    const titanId = resolveBossId(rawTitanId);
    const rec = records.get(titanId);
    if (!rec || (!rec.active && rec.defeated)) {
      return {
        valid: false,
        canBeat: Boolean(canBeat),
        boinged: false,
        defeated: Boolean(rec?.defeated),
        hp: rec ? rec.hp : 0,
        maxHp: rec ? rec.maxHp : 0,
        titanId,
      };
    }

    if (!canBeat) {
      rec.boingCount += 1;
      rec.laughTimer = LAUGH_DURATION;
      rec.state = 'laughing';
      rec.idleNapTimer = 0;
      rec.napReturnTimer = rec.isSurprise
        ? 2.4
        : rec.boingCount >= 2
          ? 2.2
          : 5.5;

      const player = ctx?.state?.player;
      const cx = player?.x ?? rec.x + Math.sin(rec.yaw) * 3.0;
      const cy = player?.y ?? rec.y;
      const cz = player?.z ?? rec.z + Math.cos(rec.yaw) * 3.0;

      cloudOrigin.x = cx;
      cloudOrigin.y = cy;
      cloudOrigin.z = cz;
      cloudTimer = CLOUD_DURATION;
      rainbowCloud.position.set(cx, cy + 0.05, cz);
      rainbowCloud.scale.set(1.15, 0.55, 1.15);
      rainbowCloud.visible = true;

      if (ctx?.particles && typeof ctx.particles.spawnSpringCloud === 'function') {
        ctx.particles.spawnSpringCloud(cx, cy, cz);
      }

      return {
        valid: true,
        canBeat: false,
        boinged: true,
        defeated: false,
        hp: rec.hp,
        maxHp: rec.maxHp,
        titanId: rec.id,
        x: round3(rec.x),
        y: round3(rec.y),
        z: round3(rec.z),
        cloudPos: { x: round3(cx), y: round3(cy), z: round3(cz) },
      };
    }

    const dmg = Math.max(1, Number(damage) || 10);
    rec.hitCount += 1;
    rec.hp = Math.max(0, rec.hp - dmg);
    rec.napReturnTimer = 0;
    rec.idleNapTimer = 0;
    rec.squashTimer = SQUASH_DURATION;
    rec.flashTimer = FLASH_DURATION;
    rec.dizzyTimer = DIZZY_DURATION;
    rec.topperSpinTimer = 0.90;
    setGroupFlash(rec.rig.voxelMeshes, true);

    if (rec.hp <= 0) {
      rec.hp = 0;
      rec.active = false;
      rec.defeated = true;
      rec.state = 'defeating';
      rec.pinataTimer = PINATA_DURATION;
      pinataOrigin.x = rec.x;
      pinataOrigin.y = rec.y + rec.scale * 0.9;
      pinataOrigin.z = rec.z;

      return {
        valid: true,
        canBeat: true,
        boinged: false,
        defeated: true,
        hp: 0,
        maxHp: rec.maxHp,
        rewardGems: rec.spec.rewardGems,
        titanId: rec.id,
        x: round3(rec.x),
        y: round3(rec.y),
        z: round3(rec.z),
      };
    }

    rec.state = 'stunned';
    return {
      valid: true,
      canBeat: true,
      boinged: false,
      defeated: false,
      hp: rec.hp,
      maxHp: rec.maxHp,
      titanId: rec.id,
      x: round3(rec.x),
      y: round3(rec.y),
      z: round3(rec.z),
    };
  }

  function focus(rawTitanId) {
    const titanId = resolveBossId(rawTitanId);
    const rec = records.get(titanId);
    if (rec && rec.active && !rec.defeated && rec.hp > 0) {
      lastSpawnedId = titanId;
      return toPublicTitan(rec);
    }
    return null;
  }

  function getActive() {
    const px = ctx?.state?.player?.x;
    const pz = ctx?.state?.player?.z;
    if (Number.isFinite(px) && Number.isFinite(pz)) {
      let nearest = null;
      let nearestDistSq = 14 * 14;
      for (let i = 0; i < TITAN_ORDER.length; i++) {
        const rec = records.get(TITAN_ORDER[i]);
        if (!rec || !rec.active || rec.defeated || rec.hp <= 0) continue;
        const dx = rec.x - px;
        const dz = rec.z - pz;
        const dSq = dx * dx + dz * dz;
        if (dSq <= nearestDistSq) {
          nearestDistSq = dSq;
          nearest = rec;
        }
      }
      if (nearest) {
        return toPublicTitan(nearest);
      }
    }

    const stateId = ctx?.state?.activeTitanId ? resolveBossId(ctx.state.activeTitanId) : null;
    if (stateId) {
      const stRec = records.get(stateId);
      if (stRec && stRec.active && !stRec.defeated && stRec.hp > 0) {
        return toPublicTitan(stRec);
      }
    }
    if (lastSpawnedId) {
      const last = records.get(lastSpawnedId);
      if (last && last.active && !last.defeated && last.hp > 0) {
        return toPublicTitan(last);
      }
    }
    for (let i = 0; i < TITAN_ORDER.length; i++) {
      const rec = records.get(TITAN_ORDER[i]);
      if (rec && rec.active && !rec.defeated && rec.hp > 0) {
        return toPublicTitan(rec);
      }
    }
    return null;
  }

  function getActiveList() {
    const out = [];
    for (let i = 0; i < TITAN_ORDER.length; i++) {
      const rec = records.get(TITAN_ORDER[i]);
      if (rec && rec.active && !rec.defeated && rec.hp > 0) {
        out.push(toPublicTitan(rec));
      }
    }
    return out;
  }

  function getTitan(rawTitanId) {
    if (!rawTitanId) return null;
    const rec = records.get(resolveBossId(rawTitanId));
    return rec ? toPublicTitan(rec) : null;
  }

  function findNear(x, z, radius = 4.5) {
    let best = null;
    let bestDistSq = radius * radius;
    for (let i = 0; i < TITAN_ORDER.length; i++) {
      const rec = records.get(TITAN_ORDER[i]);
      if (!rec || !rec.active || rec.defeated || rec.hp <= 0) continue;
      const dx = rec.x - x;
      const dz = rec.z - z;
      const dSq = dx * dx + dz * dz;
      if (dSq <= bestDistSq) {
        bestDistSq = dSq;
        best = rec;
      }
    }
    if (!best) return null;
    return {
      ...toPublicTitan(best),
      dist: Math.sqrt(bestDistSq),
    };
  }

  function raycast(raycaster) {
    if (!raycaster) return null;
    let closest = null;
    let bestDistance = Infinity;

    for (let i = 0; i < TITAN_ORDER.length; i++) {
      const rec = records.get(TITAN_ORDER[i]);
      if (!rec || !rec.active || rec.defeated || rec.hp <= 0) continue;

      const halfW = rec.scale * 0.62;
      const fullH = rec.scale * 2.05;
      _hitBox.min.set(rec.x - halfW, rec.y - 0.2, rec.z - halfW);
      _hitBox.max.set(rec.x + halfW, rec.y + fullH, rec.z + halfW);

      const hitPt = raycaster.ray.intersectBox(_hitBox, _hitPoint);
      if (hitPt) {
        const dist = raycaster.ray.origin.distanceTo(hitPt);
        if (dist < bestDistance) {
          bestDistance = dist;
          closest = {
            kind: 'titan',
            id: rec.id,
            titanId: rec.id,
            titan: toPublicTitan(rec),
            point: hitPt.clone(),
            distance: dist,
          };
        }
      }
    }
    return closest;
  }

  function update(dt = 1 / 60, time = 0, heroPos = null) {
    const stepDt = Math.max(0, Math.min(0.1, Number(dt) || 0));
    const t = Number(time) || 0;
    const targetHero = heroPos || ctx?.state?.player || null;

    if (shockwaveTimer > 0) {
      shockwaveTimer = Math.max(0, shockwaveTimer - stepDt);
      const u = 1 - shockwaveTimer / SPAWN_DURATION;
      const rScale = 0.8 + u * 6.4;
      shockwaveRing.position.set(shockwaveOrigin.x, shockwaveOrigin.y, shockwaveOrigin.z);
      shockwaveRing.scale.set(rScale, rScale, 1);
      shockwaveMat.opacity = Math.max(0, (1 - u) * 0.90);
      shockwaveRing.visible = shockwaveTimer > 0.01;
    } else {
      shockwaveRing.visible = false;
    }

    if (cloudTimer > 0) {
      cloudTimer = Math.max(0, cloudTimer - stepDt);
      const u = 1 - cloudTimer / CLOUD_DURATION;
      const springBounce = 1 + Math.sin(u * Math.PI * 4) * Math.exp(-u * 3.2) * 0.45;
      const fade = u > 0.72 ? 1 - (u - 0.72) / 0.28 : 1;
      rainbowCloud.position.set(
        cloudOrigin.x,
        cloudOrigin.y + Math.sin(Math.min(1, u * 2.2) * Math.PI) * 0.45,
        cloudOrigin.z
      );
      rainbowCloud.rotation.y = u * 2.4;
      rainbowCloud.scale.set(
        (1.22 / Math.sqrt(Math.max(0.5, springBounce))) * fade,
        springBounce * fade,
        (1.22 / Math.sqrt(Math.max(0.5, springBounce))) * fade
      );
      rainbowCloud.visible = cloudTimer > 0.01 && fade > 0.03;
    } else {
      rainbowCloud.visible = false;
    }

    if (pinataBurstTimer > 0) {
      pinataBurstTimer = Math.max(0, pinataBurstTimer - stepDt);
      const u = 1 - pinataBurstTimer / 0.48;
      const shrink = Math.max(0.01, 1 - u * u);
      for (let i = 0; i < 16; i++) {
        const ang = (i / 16) * Math.PI * 2 + (i % 3) * 0.25;
        const spd = 4.2 + (i % 4) * 1.4;
        const upVel = 5.5 + (i % 3) * 2.0;
        const bx = pinataOrigin.x + Math.cos(ang) * spd * u;
        const bz = pinataOrigin.z + Math.sin(ang) * spd * u;
        const by = pinataOrigin.y + upVel * u - 9.5 * u * u;
        _dummy.position.set(bx, Math.max(pinataOrigin.y - 2.5, by), bz);
        _dummy.rotation.set(u * 8 + i, u * 10, u * 6);
        _dummy.scale.setScalar(shrink * 1.35);
        _dummy.updateMatrix();
        pinataInstanced.setMatrixAt(i, _dummy.matrix);
      }
      pinataInstanced.instanceMatrix.needsUpdate = true;
      pinataInstanced.visible = pinataBurstTimer > 0.01;
    } else {
      pinataInstanced.visible = false;
    }

    for (let i = 0; i < TITAN_ORDER.length; i++) {
      const rec = records.get(TITAN_ORDER[i]);
      if (!rec.rig.root.visible) continue;

      rec.age += stepDt;
      const { rig } = rec;

      if (rec.flashTimer > 0) {
        rec.flashTimer = Math.max(0, rec.flashTimer - stepDt);
        if (rec.flashTimer <= 0) {
          setGroupFlash(rig.voxelMeshes, false);
        }
      }

      if (rec.pinataTimer > 0) {
        rec.pinataTimer = Math.max(0, rec.pinataTimer - stepDt);
        const u = 1 - rec.pinataTimer / PINATA_DURATION;
        if (u < 0.72) {
          const p = u / 0.72;
          const inflate = 1 + p * 0.34 + Math.sin(p * Math.PI * 6) * 0.06;
          rig.root.rotation.y = rec.yaw + p * p * Math.PI * 5;
          rig.root.position.set(rec.x, rec.y + p * 0.9, rec.z);
          rig.root.scale.set(
            rec.scale * inflate,
            rec.scale * (1 + p * 0.26),
            rec.scale * inflate
          );
          rig.armL.rotation.set(-2.4, 0, 0.5);
          rig.armR.rotation.set(-2.4, 0, -0.5);
          setGroupFlash(rig.voxelMeshes, Math.floor(p * 12) % 2 === 0);
        } else {
          if (pinataBurstTimer <= 0 && rec.state === 'defeating') {
            pinataBurstTimer = 0.48;
            rec.state = 'defeated';
          }
          setGroupFlash(rig.voxelMeshes, false);
          rig.dizzyStars.visible = false;
          rig.root.visible = false;
        }
        if (rec.pinataTimer <= 0) {
          setGroupFlash(rig.voxelMeshes, false);
          rig.dizzyStars.visible = false;
          rig.root.visible = false;
          rec.state = 'defeated';
        }
        continue;
      }

      if (!rec.active) {
        rig.root.visible = false;
        continue;
      }

      if (rec.napReturnTimer > 0) {
        rec.napReturnTimer = Math.max(0, rec.napReturnTimer - stepDt);
        if (rec.napReturnTimer <= 0) {
          rec.active = false;
          rec.state = 'dormant';
          setGroupFlash(rig.voxelMeshes, false);
          rig.dizzyStars.visible = false;
          rig.root.visible = false;
          if (ctx?.state?.activeTitanId === rec.id) {
            ctx.state.activeTitanId = null;
          }
          ctx?.ui?.hideBossBanner?.(rec.id);
          ctx?.bossBanner?.hide?.(rec.id);
          continue;
        }
      } else if (rec.idleNapTimer > 0) {
        rec.idleNapTimer = Math.max(0, rec.idleNapTimer - stepDt);
        if (rec.idleNapTimer <= 0) {
          rec.active = false;
          rec.state = 'dormant';
          setGroupFlash(rig.voxelMeshes, false);
          rig.dizzyStars.visible = false;
          rig.root.visible = false;
          if (ctx?.state?.activeTitanId === rec.id) {
            ctx.state.activeTitanId = null;
          }
          ctx?.ui?.hideBossBanner?.(rec.id);
          ctx?.bossBanner?.hide?.(rec.id);
          continue;
        }
      }

      if (targetHero && Number.isFinite(targetHero.x) && Number.isFinite(targetHero.z)) {
        const dx = targetHero.x - rec.x;
        const dz = targetHero.z - rec.z;
        if (dx * dx + dz * dz > 0.04) {
          const desiredYaw = Math.atan2(dx, dz);
          let diff = desiredYaw - rec.yaw;
          while (diff > Math.PI) diff -= Math.PI * 2;
          while (diff < -Math.PI) diff += Math.PI * 2;
          rec.yaw += diff * Math.min(1, stepDt * 5.0);
        }
      }

      let spawnScale = 1.0;
      let spawnLiftY = 0.0;
      if (rec.spawnTimer > 0) {
        rec.spawnTimer = Math.max(0, rec.spawnTimer - stepDt);
        const u = 1 - rec.spawnTimer / SPAWN_DURATION;
        if (u < 0.72) {
          const p = u / 0.72;
          spawnScale = 0.08 + (1 - Math.pow(1 - p, 3)) * 1.10;
        } else {
          const p = (u - 0.72) / 0.28;
          spawnScale = 1.18 - p * 0.18;
        }
        spawnLiftY = -(1 - Math.min(1, u * 1.35)) * 2.2;
        if (rec.spawnTimer <= 0 && rec.state === 'spawning') {
          rec.state = 'idle';
        }
      }

      let sx = 1.0;
      let sy = 1.0;
      if (rec.squashTimer > 0) {
        rec.squashTimer = Math.max(0, rec.squashTimer - stepDt);
        const u = 1 - rec.squashTimer / SQUASH_DURATION;
        const wave = Math.sin(u * Math.PI * 2) * (1 - u);
        sx = 1 + wave * 0.26;
        sy = 1 - wave * 0.24;
        if (rec.squashTimer <= 0 && rec.state === 'stunned') {
          rec.state = 'idle';
        }
      }

      rig.root.position.set(rec.x, rec.y + spawnLiftY, rec.z);
      rig.root.rotation.set(0, rec.yaw, 0);
      rig.root.scale.set(rec.scale * spawnScale * sx, rec.scale * spawnScale * sy, rec.scale * spawnScale * sx);

      if (rec.dizzyTimer > 0) {
        rec.dizzyTimer = Math.max(0, rec.dizzyTimer - stepDt);
        rig.dizzyStars.visible = rec.dizzyTimer > 0.02;
        rig.dizzyStars.rotation.y = t * 5.2;
        rig.dizzyStars.position.y = 1.56 + Math.sin(t * 7.0) * 0.06;
      } else {
        rig.dizzyStars.visible = false;
      }

      // Sneaky Burger Robber's loot rotor spins continuously!
      if (rec.id === 'bombardiro_crocodilo') {
        rig.topperPivot.rotation.set(0, t * 14.0, 0);
      } else if (rec.topperSpinTimer > 0) {
        rec.topperSpinTimer = Math.max(0, rec.topperSpinTimer - stepDt);
        const w = rec.topperSpinTimer / 0.90;
        rig.topperPivot.rotation.y = (1 - w) * Math.PI * 4;
        rig.topperPivot.rotation.z = Math.sin(t * 24) * 0.26 * w;
      } else {
        rig.topperPivot.rotation.set(0, 0, Math.sin(t * 2.6 + i) * 0.04);
      }

      if (rec.laughTimer > 0) {
        rec.laughTimer = Math.max(0, rec.laughTimer - stepDt);
        const jiggle = Math.sin(t * 26);
        rig.animGroup.position.y = Math.abs(jiggle) * 0.08;
        rig.torsoPivot.rotation.set(-0.26 + jiggle * 0.08, Math.sin(t * 10) * 0.14, Math.cos(t * 12) * 0.10);
        rig.headPivot.rotation.set(-0.56 + jiggle * 0.14, 0, Math.sin(t * 12) * 0.12);
        rig.armL.rotation.set(-0.85 + jiggle * 0.22, -0.35, -0.25);
        rig.armR.rotation.set(-0.85 - jiggle * 0.22, 0.35, 0.25);
        rig.legL.rotation.x = Math.sin(t * 16) * 0.18;
        rig.legR.rotation.x = -Math.sin(t * 16) * 0.18;
        if (rec.laughTimer <= 0 && rec.state === 'laughing') {
          rec.state = 'idle';
        }
      } else {
        const stomp = Math.sin(t * 2.8 + i * 1.3);
        rig.animGroup.position.y = Math.abs(stomp) * 0.035;
        rig.torsoPivot.rotation.set(0.03, Math.sin(t * 1.4 + i) * 0.06, stomp * 0.04);
        rig.headPivot.rotation.set(Math.sin(t * 2.1) * 0.05, Math.sin(t * 1.6) * 0.08, 0);
        rig.armL.rotation.set(-0.22 + stomp * 0.22, 0, 0.18);
        rig.armR.rotation.set(-0.22 - stomp * 0.22, 0, -0.18);
        rig.legL.rotation.x = Math.max(0, stomp) * 0.20;
        rig.legR.rotation.x = Math.max(0, -stomp) * 0.20;
      }
    }
  }

  function getSnapshot() {
    return TITAN_ORDER.map((id) => toPublicTitan(records.get(id)));
  }

  function reset() {
    lastSpawnedId = null;
    shockwaveTimer = 0;
    cloudTimer = 0;
    pinataBurstTimer = 0;
    shockwaveRing.visible = false;
    rainbowCloud.visible = false;
    pinataInstanced.visible = false;

    for (let i = 0; i < TITAN_ORDER.length; i++) {
      const rec = records.get(TITAN_ORDER[i]);
      rec.x = rec.spec.spawnPos.x;
      rec.y = rec.spec.spawnPos.y;
      rec.z = rec.spec.spawnPos.z;
      rec.yaw = 0;
      rec.hp = rec.maxHp;
      rec.active = false;
      rec.spawned = false;
      rec.defeated = false;
      rec.state = 'dormant';
      rec.spawnTimer = 0;
      rec.laughTimer = 0;
      rec.squashTimer = 0;
      rec.flashTimer = 0;
      rec.dizzyTimer = 0;
      rec.topperSpinTimer = 0;
      rec.pinataTimer = 0;
      rec.napReturnTimer = 0;
      rec.idleNapTimer = 0;
      rec.isSurprise = false;
      rec.boingCount = 0;
      rec.hitCount = 0;
      rec.age = 0;

      setGroupFlash(rec.rig.voxelMeshes, false);
      rec.rig.dizzyStars.visible = false;
      rec.rig.root.visible = false;
    }
  }

  return {
    group,
    spawn,
    focus,
    hit,
    getActive,
    getActiveList,
    getTitan,
    findNear,
    raycast,
    update,
    getSnapshot,
    reset,
  };
}
