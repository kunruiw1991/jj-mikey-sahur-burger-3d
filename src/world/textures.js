// Procedural 16x16 pixel-art CanvasTextures and 8x8 voxel atlas for JJ & Mikey vs Tung Tung Sahur: McDonald's Burger Battle 3D!
// Split-World Theme: Left = Mikey's $1 Cursed Cobblestone & Robber Alley | Right = JJ's $100,000 Red/Gold McDonald's & Cyan Diamond Boulevard.

import * as THREE from '../../vendor/three.module.min.js';
import { createRng } from '../core/rng.js';

const TILE_SIZE = 16;
const ATLAS_COLS = 8;
const ATLAS_ROWS = 8;
const ATLAS_SIZE = TILE_SIZE * ATLAS_COLS; // 128x128

export const TILE_INDEX = Object.freeze({
  grass_top: 0,
  grass_side: 1,
  dirt: 2,
  path_gold: 3,
  hub_plaza: 4,
  lucky_block: 5,
  flower_red_top: 6,
  flower_red_side: 7,
  flower_sun_top: 8,
  flower_sun_side: 9,
  oak_bark: 10,
  oak_top: 11,
  spruce_bark: 12,
  spruce_top: 13,
  leaves_lush: 14,
  leaves_frost: 15,
  hay_side: 16,
  hay_top: 17,
  pumpkin_front: 18,
  pumpkin_side: 19,
  pumpkin_top: 20,
  melon_side: 21,
  melon_top: 22,
  beehive_front: 23,
  beehive_side: 24,
  beehive_top: 25,
  ice_crystal: 26,
  snow_top: 27,
  snow_side: 28,
  castle_brick: 29,
  furnace_front: 30,
  furnace_side: 31,
  amethyst: 32,
  bedrock_gold: 33,
  mega_titan_side: 34,
  mega_titan_top: 35,
  chest_front: 36,
  chest_side: 37,
  chest_top: 38,
  water: 39,
  farm_soil: 40,
  lantern_glow: 41,
  mushroom_red: 42,
  snowman_face: 43,
});

function makeCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

function finalizePixelTexture(canvas, repeat = false) {
  const tex = new THREE.CanvasTexture(canvas);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.generateMipmaps = false;
  tex.colorSpace = THREE.SRGBColorSpace;
  if (repeat) {
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
  }
  tex.needsUpdate = true;
  return tex;
}

function fillNoise(ctx, rng, palette, x0 = 0, y0 = 0, w = 16, h = 16) {
  for (let y = y0; y < y0 + h; y++) {
    for (let x = x0; x0 + w > x; x++) {
      ctx.fillStyle = rng.pick(palette);
      ctx.fillRect(x, y, 1, 1);
    }
  }
}

function px(ctx, x, y, color, w = 1, h = 1) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawBitmap(ctx, rows, colorMap, ox = 0, oy = 0) {
  for (let y = 0; y < rows.length; y++) {
    const row = rows[y];
    for (let x = 0; x < row.length; x++) {
      const ch = row[x];
      if (ch !== '.' && colorMap[ch]) {
        ctx.fillStyle = colorMap[ch];
        ctx.fillRect(ox + x, oy + y, 1, 1);
      }
    }
  }
}

function paintTile(name, ctx, emCtx, rng) {
  switch (name) {
    case 'grass_top': {
      // Mikey's $1 Cursed Mossy Cobblestone Pavement (Clean, smooth low-contrast stone + moss)
      fillNoise(ctx, rng, ['#6c757d', '#636b73', '#747d85', '#5a626a']);
      px(ctx, 0, 0, '#495057', 16, 1);
      px(ctx, 0, 8, '#495057', 16, 1);
      px(ctx, 7, 0, '#495057', 1, 8);
      px(ctx, 13, 8, '#495057', 1, 8);
      // Soft mossy patches
      px(ctx, 2, 2, '#69b55c', 3, 2);
      px(ctx, 10, 5, '#69b55c', 2, 2);
      px(ctx, 4, 11, '#69b55c', 3, 2);
      break;
    }

    case 'grass_side': {
      fillNoise(ctx, rng, ['#5c4d42', '#52443a', '#66564a']);
      fillNoise(ctx, rng, ['#6c757d', '#747d85', '#5a626a'], 0, 0, 16, 5);
      px(ctx, 0, 5, '#495057', 16, 1);
      px(ctx, 3, 2, '#69b55c', 3, 2);
      break;
    }

    case 'dirt': {
      // Mikey's Brown Dirt Sign & Foundation Block
      fillNoise(ctx, rng, ['#7c5333', '#6e482b', '#8a5d3b', '#613f25']);
      px(ctx, 2, 4, '#9c6c46', 2, 2);
      px(ctx, 10, 11, '#9c6c46', 2, 2);
      break;
    }

    case 'farm_soil': {
      // Clean Warm Golden Sandstone Patio Tile (East Drive-Thru Patio)
      fillNoise(ctx, rng, ['#f5deb3', '#eed29e', '#fae6be', '#e5c58a']);
      px(ctx, 0, 0, '#d9b26f', 16, 1);
      px(ctx, 0, 0, '#d9b26f', 1, 16);
      px(ctx, 2, 2, '#fff5d6', 3, 1);
      px(ctx, 10, 10, '#fff5d6', 3, 1);
      break;
    }

    case 'path_gold': {
      // Clean Dark-Slate City Asphalt Road with Subtle Yellow Center Dash
      fillNoise(ctx, rng, ['#343a46', '#2f3540', '#3a414e']);
      px(ctx, 0, 0, '#495057', 16, 1);
      px(ctx, 0, 15, '#495057', 16, 1);
      px(ctx, 5, 7, '#ffd43b', 6, 2);
      break;
    }

    case 'hub_plaza': {
      // Clean Smooth Cream-White Quartz Marble Plaza Tile (JJ's $100K Rich Side)
      fillNoise(ctx, rng, ['#f8f4e8', '#f2ecdc', '#fcf9f0']);
      px(ctx, 0, 0, '#e3cfa1', 16, 1);
      px(ctx, 0, 15, '#e3cfa1', 16, 1);
      px(ctx, 0, 0, '#e3cfa1', 1, 16);
      px(ctx, 15, 0, '#e3cfa1', 1, 16);
      px(ctx, 6, 6, '#f3d98b', 4, 4);
      px(ctx, 7, 7, '#fff9db', 2, 2);
      break;
    }

    case 'lucky_block': {
      // Golden Happy Meal '?' Surprise Box (McDonald's Red + Golden Arches + '?')
      fillNoise(ctx, rng, ['#e01e2b', '#c91420', '#f02e3a']);
      // Golden Arches frame
      px(ctx, 0, 0, '#ffd43b', 16, 2);
      px(ctx, 0, 14, '#e69d00', 16, 2);
      px(ctx, 0, 0, '#ffd43b', 2, 16);
      px(ctx, 14, 0, '#e69d00', 2, 16);
      const qRows = [
        '..YYYY..',
        '.YYYYYYS',
        '.YY..YYS',
        '....YYYS',
        '...YYYS.',
        '...YYS..',
        '...SSS..',
        '...YY...',
        '...YYS..',
        '....SS..',
      ];
      drawBitmap(ctx, qRows, { Y: '#fff3a1', S: '#7c2d00' }, 4, 3);
      drawBitmap(emCtx, qRows, { Y: '#ffe066', S: '#331000' }, 4, 3);
      px(emCtx, 0, 0, '#7a5c00', 16, 2);
      px(emCtx, 0, 14, '#7a5c00', 16, 2);
      break;
    }

    case 'flower_red_top': {
      // Crispy Golden French Fries Top (overflowing golden fries)
      fillNoise(ctx, rng, ['#c9182b', '#e0243c']);
      for (let x = 2; x <= 12; x += 2) {
        px(ctx, x, 2, x % 4 === 0 ? '#ffe066' : '#fab005', 2, 12);
        px(ctx, x, 2, '#fff9db', 1, 3);
      }
      break;
    }

    case 'flower_red_side': {
      // Red McDonald's Fry Carton Side with Golden Fries sticking out top
      fillNoise(ctx, rng, ['#d91e2a', '#c41622', '#eb2835'], 0, 5, 16, 11);
      fillNoise(ctx, rng, ['#2b303c', '#363c4a'], 0, 0, 16, 5);
      for (let x = 1; x < 15; x += 2) {
        const fh = (x % 4 === 1) ? 0 : 1;
        px(ctx, x, fh, '#ffd43b', 2, 6 - fh);
        px(ctx, x, fh, '#fff3a1', 1, 2);
      }
      // Golden 'M' arch on red carton
      drawBitmap(
        ctx,
        [
          '.YY..YY.',
          'Y..YY..Y',
          'Y..YY..Y',
          'Y......Y',
        ],
        { Y: '#ffd43b' },
        4,
        9
      );
      break;
    }

    case 'flower_sun_top': {
      // Sesame Cheeseburger Bun Top
      fillNoise(ctx, rng, ['#e69938', '#d98826', '#f2a949']);
      px(ctx, 0, 0, '#b86b14', 16, 1);
      px(ctx, 0, 15, '#b86b14', 16, 1);
      px(ctx, 0, 0, '#b86b14', 1, 16);
      px(ctx, 15, 0, '#b86b14', 1, 16);
      // Sesame seeds
      px(ctx, 3, 3, '#fff9db', 2, 1);
      px(ctx, 10, 4, '#fff9db', 2, 1);
      px(ctx, 6, 7, '#fff9db', 2, 1);
      px(ctx, 11, 10, '#fff9db', 2, 1);
      px(ctx, 4, 12, '#fff9db', 2, 1);
      break;
    }

    case 'flower_sun_side': {
      // Double Cheeseburger Layers Side (Bun -> Lettuce -> Tomato -> Melted Cheese -> Beef Patty -> Bottom Bun)
      px(ctx, 0, 0, '#e69938', 16, 4); // Top bun
      px(ctx, 0, 4, '#51cf66', 16, 2); // Crisp lettuce
      px(ctx, 0, 6, '#e03131', 16, 2); // Tomato slice
      px(ctx, 0, 8, '#ffd43b', 16, 2); // Melted yellow cheese
      px(ctx, 0, 10, '#6b3416', 16, 3); // Sizzling beef patty
      px(ctx, 0, 13, '#d98826', 16, 3); // Bottom bun
      // Cheese corners dripping
      px(ctx, 3, 10, '#ffd43b', 2, 2);
      px(ctx, 11, 10, '#ffd43b', 2, 2);
      break;
    }

    case 'oak_bark': {
      // Tung Tung Sahur Kentungan Slit-Drum Block Side
      for (let x = 0; x < 16; x++) {
        const col = x % 4 === 0 ? '#7c451e' : x % 2 === 0 ? '#9c5a2b' : '#b56c37';
        px(ctx, x, 0, col, 1, 16);
      }
      // Golden rhythm bands + vertical acoustic slit
      px(ctx, 0, 1, '#ffd43b', 16, 2);
      px(ctx, 0, 13, '#ffd43b', 16, 2);
      px(ctx, 6, 4, '#2b1406', 4, 8);
      break;
    }

    case 'oak_top': {
      // Kentungan Drumhead Top
      px(ctx, 0, 0, '#7c451e', 16, 16);
      px(ctx, 2, 2, '#ffd43b', 12, 12);
      px(ctx, 4, 4, '#f3d9a4', 8, 8);
      px(ctx, 7, 7, '#9c5a2b', 2, 2);
      break;
    }

    case 'spruce_bark': {
      // Mikey's $1 Mossy Cobble & Wooden Crate Side
      fillNoise(ctx, rng, ['#525864', '#434852', '#646b78']);
      px(ctx, 0, 0, '#6e4e2e', 16, 2);
      px(ctx, 0, 14, '#6e4e2e', 16, 2);
      px(ctx, 0, 0, '#6e4e2e', 2, 16);
      px(ctx, 14, 0, '#6e4e2e', 2, 16);
      px(ctx, 3, 5, '#51cf66', 4, 2);
      px(ctx, 9, 10, '#51cf66', 4, 2);
      break;
    }

    case 'spruce_top': {
      fillNoise(ctx, rng, ['#525864', '#434852', '#646b78']);
      px(ctx, 0, 0, '#6e4e2e', 16, 2);
      px(ctx, 0, 14, '#6e4e2e', 16, 2);
      px(ctx, 0, 0, '#6e4e2e', 2, 16);
      px(ctx, 14, 0, '#6e4e2e', 2, 16);
      break;
    }

    case 'leaves_lush': {
      // Glowing Red & Gold McDonald's Sign Block
      fillNoise(ctx, rng, ['#d91e2a', '#c41622', '#e82936']);
      px(ctx, 0, 0, '#ffd43b', 16, 2);
      px(ctx, 0, 14, '#ffd43b', 16, 2);
      drawBitmap(
        ctx,
        [
          '..YY..YY..',
          '.Y..YY..Y.',
          'Y...YY...Y',
          'Y...YY...Y',
          'Y........Y',
          'Y........Y',
        ],
        { Y: '#ffe066' },
        3,
        5
      );
      break;
    }

    case 'leaves_frost': {
      // JJ's $100K Cyan Diamond Glass Skyscraper Block
      fillNoise(ctx, rng, ['#15aabf', '#22b8cf', '#3bc9db', '#99e9f2']);
      px(ctx, 0, 0, '#ffd43b', 16, 2);
      px(ctx, 0, 14, '#ffd43b', 16, 2);
      px(ctx, 0, 0, '#ffd43b', 2, 16);
      px(ctx, 14, 0, '#ffd43b', 2, 16);
      px(ctx, 4, 4, '#ffffff', 3, 3);
      px(ctx, 9, 9, '#e3fafc', 3, 3);
      break;
    }

    case 'hay_side': {
      // Crispy Chicken McNuggets Golden Box Side
      for (let y = 0; y < 16; y++) {
        for (let x = 0; x < 16; x++) {
          px(ctx, x, y, (x + y * 2) % 3 === 0 ? '#e6992e' : '#ffd447');
        }
      }
      px(ctx, 0, 4, '#d91e2a', 16, 3);
      px(ctx, 0, 11, '#d91e2a', 16, 2);
      px(ctx, 5, 5, '#fff9db', 6, 1);
      break;
    }

    case 'hay_top': {
      fillNoise(ctx, rng, ['#e6992e', '#ffd447', '#d98218', '#ffe066']);
      px(ctx, 2, 6, '#d91e2a', 12, 4);
      px(ctx, 5, 7, '#ffd43b', 6, 2);
      break;
    }

    case 'pumpkin_side': {
      // Mikey's Smelly Green Rotten-Burger Block Side
      px(ctx, 0, 0, '#7a9e35', 16, 4); // Moldy green top bun
      px(ctx, 0, 4, '#51cf66', 16, 3); // Slimy green lettuce
      px(ctx, 0, 7, '#a9e34b', 16, 2); // Sour green cheese
      px(ctx, 0, 9, '#49592a', 16, 4); // Rotten green patty
      px(ctx, 0, 13, '#6c8c2d', 16, 3); // Moldy bottom bun
      break;
    }

    case 'pumpkin_front': {
      // Mikey's Smelly Green Rotten-Burger Block Front (Silly green face!)
      px(ctx, 0, 0, '#7a9e35', 16, 4);
      px(ctx, 0, 4, '#5c940d', 16, 9);
      px(ctx, 0, 13, '#6c8c2d', 16, 3);
      const face = [
        '..GGG.....GGG..',
        '.GYYYG...GYYYG.',
        '.GYYYG...GYYYG.',
        '...............',
        '..GG.......GG..',
        '..GYYGGGGGGYYG.',
        '...GYYYYYYYYG..',
        '....GGGGGGGG...',
      ];
      drawBitmap(ctx, face, { G: '#1e2e05', Y: '#d8f5a2' }, 0, 4);
      drawBitmap(emCtx, face, { G: '#0b1400', Y: '#94d82d' }, 0, 4);
      break;
    }

    case 'pumpkin_top': {
      fillNoise(ctx, rng, ['#7a9e35', '#82c91e', '#5c940d']);
      px(ctx, 4, 4, '#d8f5a2', 2, 1);
      px(ctx, 10, 6, '#d8f5a2', 2, 1);
      px(ctx, 6, 11, '#d8f5a2', 2, 1);
      break;
    }

    case 'melon_side': {
      // Fizzy Red & White Striped Cola Cup Block Side
      for (let x = 0; x < 16; x++) {
        const isRed = Math.floor(x / 2) % 2 === 0;
        px(ctx, x, 0, isRed ? '#e02430' : '#fff8eb', 1, 16);
      }
      px(ctx, 0, 0, '#ffffff', 16, 2); // Plastic lid rim
      px(ctx, 4, 6, '#ffd43b', 8, 4); // Golden badge
      break;
    }

    case 'melon_top': {
      // Cola Lid with Red Straw
      fillNoise(ctx, rng, ['#f1f3f5', '#dee2e6', '#ffffff']);
      px(ctx, 2, 2, '#adb5bd', 12, 12);
      px(ctx, 4, 4, '#ffffff', 8, 8);
      px(ctx, 6, 6, '#e02430', 4, 4); // Straw
      break;
    }

    case 'beehive_side': {
      // Cash Register & Dollar Vault Block Side
      fillNoise(ctx, rng, ['#ced4da', '#adb5bd', '#e9ecef']);
      px(ctx, 0, 0, '#ffd43b', 16, 2);
      px(ctx, 0, 14, '#495057', 16, 2);
      px(ctx, 3, 5, '#2b8a3e', 10, 6);
      px(ctx, 5, 7, '#b2f2bb', 6, 2);
      break;
    }

    case 'beehive_front': {
      // Cash Register Front with Glowing Green '$$$' Screen & Keypad
      fillNoise(ctx, rng, ['#ced4da', '#adb5bd', '#e9ecef']);
      px(ctx, 0, 0, '#ffd43b', 16, 2);
      px(ctx, 2, 3, '#1b4332', 12, 5); // Digital screen
      px(ctx, 4, 4, '#69db7c', 8, 3); // Glowing green readout
      // Register buttons
      for (let x = 3; x <= 11; x += 3) {
        px(ctx, x, 9, '#e03131', 2, 2);
        px(ctx, x, 12, '#ffd43b', 2, 2);
      }
      px(emCtx, 4, 4, '#51cf66', 8, 3);
      break;
    }

    case 'beehive_top': {
      fillNoise(ctx, rng, ['#dee2e6', '#ced4da', '#f8f9fa']);
      px(ctx, 1, 1, '#ffd43b', 14, 2);
      px(ctx, 1, 13, '#ffd43b', 14, 2);
      break;
    }

    case 'ice_crystal': {
      // JJ's $100,000 Sparkling Cyan Diamond Block
      for (let y = 0; y < 16; y++) {
        for (let x = 0; x < 16; x++) {
          const d = Math.abs(x - 7.5) + Math.abs(y - 7.5);
          const col = d < 4 ? '#ffffff' : d < 7 ? '#a5f3fc' : d < 10 ? '#22d3ee' : '#0891b2';
          px(ctx, x, y, col);
        }
      }
      px(ctx, 0, 0, '#ffd43b', 16, 1);
      px(ctx, 0, 15, '#ffd43b', 16, 1);
      px(ctx, 3, 3, '#ffffff', 2, 2);
      px(emCtx, 3, 3, '#38d9f5', 10, 10);
      break;
    }

    case 'snow_top': {
      // Robber's Heist Brushed Steel & Slate Vault Tile (Clean, zero dot clutter)
      fillNoise(ctx, rng, ['#5c6778', '#535d6e', '#657184']);
      px(ctx, 0, 0, '#788599', 16, 1);
      px(ctx, 0, 0, '#788599', 1, 16);
      px(ctx, 0, 15, '#434c59', 16, 1);
      px(ctx, 15, 0, '#434c59', 1, 16);
      break;
    }

    case 'snow_side': {
      // Steel Heist Vault Wall with Black & Yellow Caution Stripe
      fillNoise(ctx, rng, ['#343a46', '#2c313c', '#434a59']);
      for (let x = 0; x < 16; x += 4) {
        px(ctx, x, 0, '#ffd43b', 2, 4);
        px(ctx, x + 2, 0, '#212529', 2, 4);
      }
      px(ctx, 0, 4, '#adb5bd', 16, 1);
      break;
    }

    case 'castle_brick': {
      // Clean Cyan-Diamond & White Marble Hilltop Tile (JJ's $100,000 Hilltop)
      fillNoise(ctx, rng, ['#e3fafc', '#cef4f9', '#f0fcff']);
      px(ctx, 0, 0, '#66d9e8', 16, 1);
      px(ctx, 0, 15, '#66d9e8', 16, 1);
      px(ctx, 0, 0, '#66d9e8', 1, 16);
      px(ctx, 15, 0, '#66d9e8', 1, 16);
      px(ctx, 5, 5, '#3bc9db', 6, 6);
      px(ctx, 6, 6, '#ffd43b', 4, 4);
      break;
    }

    case 'furnace_side': {
      // Sizzling Kitchen Burger Grill Side
      fillNoise(ctx, rng, ['#495057', '#343a40', '#6c757d']);
      px(ctx, 0, 0, '#e02430', 16, 2);
      px(ctx, 0, 14, '#ffd43b', 16, 2);
      px(ctx, 7, 2, '#212529', 2, 12);
      break;
    }

    case 'furnace_front': {
      // Sizzling Kitchen Burger Grill Front with Glowing Flame Window
      fillNoise(ctx, rng, ['#495057', '#343a40', '#6c757d']);
      px(ctx, 0, 0, '#e02430', 16, 2);
      px(ctx, 0, 14, '#ffd43b', 16, 2);
      px(ctx, 2, 4, '#212529', 12, 9);
      px(ctx, 3, 5, '#ff6b1a', 10, 7);
      px(ctx, 4, 6, '#ffd43b', 8, 5);
      px(ctx, 5, 8, '#6b3416', 6, 2); // Burger patty on grill!
      px(emCtx, 3, 5, '#ff8822', 10, 7);
      px(emCtx, 5, 6, '#fff099', 6, 4);
      break;
    }

    case 'amethyst': {
      // Secret Underground 24K Gold Vault Bullion Stack
      for (let y = 0; y < 16; y++) {
        const band = y % 4;
        const col = band === 0 ? '#fff3a1' : band === 1 ? '#ffd43b' : band === 2 ? '#f59f00' : '#b86b14';
        px(ctx, 0, y, col, 16, 1);
      }
      px(ctx, 7, 0, '#b86b14', 2, 16);
      px(ctx, 2, 1, '#ffffff', 3, 1);
      px(ctx, 10, 5, '#ffffff', 3, 1);
      px(ctx, 3, 9, '#ffffff', 3, 1);
      px(emCtx, 1, 1, '#996e00', 14, 14);
      break;
    }

    case 'bedrock_gold': {
      // McDonald's Crimson & 24K Gold Architectural Trim
      fillNoise(ctx, rng, ['#b81420', '#9e101a', '#d01c2a']);
      px(ctx, 0, 0, '#ffd43b', 16, 3);
      px(ctx, 0, 13, '#ffd43b', 16, 3);
      px(ctx, 2, 6, '#ffe066', 4, 3);
      px(ctx, 10, 6, '#ffe066', 4, 3);
      px(emCtx, 2, 6, '#7a5c00', 4, 3);
      px(emCtx, 10, 6, '#7a5c00', 4, 3);
      break;
    }

    case 'mega_titan_side': {
      // 2x2x2 Giant Golden Drive-Thru Boss Speaker Cube
      fillNoise(ctx, rng, ['#b81420', '#d91e2a', '#8a0e17']);
      px(ctx, 0, 0, '#ffd43b', 16, 2);
      px(ctx, 0, 14, '#ffd43b', 16, 2);
      px(ctx, 0, 0, '#ffd43b', 2, 16);
      px(ctx, 14, 0, '#ffd43b', 2, 16);
      const emblem = [
        '.Y...Y...Y.',
        '.YY.YYY.YY.',
        '.YYYYYYYYY.',
        '..WWWWWWW..',
        '....WWW....',
        '....WWW....',
        '....WWW....',
        '...........',
        '....WWW....',
        '....WWW....',
      ];
      drawBitmap(ctx, emblem, { Y: '#ffe066', W: '#ffffff' }, 3, 3);
      drawBitmap(emCtx, emblem, { Y: '#ffb703', W: '#fff4bd' }, 3, 3);
      break;
    }

    case 'mega_titan_top': {
      fillNoise(ctx, rng, ['#d91e2a', '#b81420']);
      px(ctx, 0, 0, '#ffd43b', 16, 2);
      px(ctx, 0, 14, '#ffd43b', 16, 2);
      px(ctx, 0, 0, '#ffd43b', 2, 16);
      px(ctx, 14, 0, '#ffd43b', 2, 16);
      px(ctx, 4, 4, '#ffe066', 8, 8);
      px(ctx, 6, 6, '#ffffff', 4, 4);
      px(emCtx, 4, 4, '#ffaa33', 8, 8);
      break;
    }

    case 'chest_front': {
      // Giant Happy Meal Mystery Kiosk Box Front (Red + Golden Arches Clasp)
      fillNoise(ctx, rng, ['#e01e2b', '#c91420', '#f02e3a']);
      px(ctx, 0, 0, '#ffd43b', 16, 2);
      px(ctx, 0, 14, '#ffd43b', 16, 2);
      px(ctx, 0, 0, '#ffd43b', 2, 16);
      px(ctx, 14, 0, '#ffd43b', 2, 16);
      drawBitmap(
        ctx,
        [
          '.YYY..YYY.',
          'YY.YYYY.YY',
          'YY..YY..YY',
          'YY..YY..YY',
          'YY......YY',
          'YY......YY',
        ],
        { Y: '#ffe066' },
        3,
        5
      );
      drawBitmap(
        emCtx,
        [
          '.YYY..YYY.',
          'YY.YYYY.YY',
          'YY..YY..YY',
          'YY..YY..YY',
          'YY......YY',
          'YY......YY',
        ],
        { Y: '#ffb703' },
        3,
        5
      );
      break;
    }

    case 'chest_side': {
      fillNoise(ctx, rng, ['#e01e2b', '#c91420', '#f02e3a']);
      px(ctx, 0, 0, '#ffd43b', 16, 2);
      px(ctx, 0, 14, '#ffd43b', 16, 2);
      px(ctx, 0, 0, '#ffd43b', 2, 16);
      px(ctx, 14, 0, '#ffd43b', 2, 16);
      px(ctx, 4, 6, '#ffd43b', 8, 4);
      break;
    }

    case 'chest_top': {
      fillNoise(ctx, rng, ['#ffd43b', '#f59f00', '#ffe066']);
      px(ctx, 0, 0, '#e01e2b', 16, 2);
      px(ctx, 0, 14, '#e01e2b', 16, 2);
      px(ctx, 0, 0, '#e01e2b', 2, 16);
      px(ctx, 14, 0, '#e01e2b', 2, 16);
      px(ctx, 5, 3, '#fff9db', 6, 10);
      px(emCtx, 5, 3, '#996e00', 6, 10);
      break;
    }

    case 'water': {
      // Clean Smooth Dark-Slate City Highway Grid
      fillNoise(ctx, rng, ['#262b36', '#222731', '#2a303c']);
      px(ctx, 0, 0, '#323846', 16, 1);
      px(ctx, 0, 0, '#323846', 1, 16);
      px(ctx, 6, 7, '#495057', 4, 2);
      break;
    }

    case 'lantern_glow': {
      px(ctx, 0, 0, '#e02430', 16, 16);
      px(ctx, 2, 2, '#ffd43b', 12, 12);
      px(ctx, 4, 4, '#fff9db', 8, 8);
      px(emCtx, 1, 1, '#ffd43b', 14, 14);
      px(emCtx, 4, 4, '#ffffff', 8, 8);
      break;
    }

    case 'mushroom_red': {
      // Red & White Striped McDonald's Awning Block
      for (let x = 0; x < 16; x++) {
        const isRed = Math.floor(x / 4) % 2 === 0;
        px(ctx, x, 0, isRed ? '#e01e2b' : '#fff8eb', 1, 16);
      }
      px(ctx, 0, 14, '#ffd43b', 16, 2);
      break;
    }

    case 'snowman_face': {
      // Mikey's Cursed White Pixel Ghost Block (from the $1 Shack Wall!)
      fillNoise(ctx, rng, ['#f8f9fa', '#ffffff', '#e9ecef']);
      px(ctx, 3, 4, '#212529', 3, 3);
      px(ctx, 10, 4, '#212529', 3, 3);
      px(ctx, 6, 9, '#212529', 4, 4);
      px(ctx, 1, 13, '#adb5bd', 3, 3);
      px(ctx, 7, 13, '#adb5bd', 3, 3);
      px(ctx, 12, 13, '#adb5bd', 3, 3);
      break;
    }

    default: {
      fillNoise(ctx, rng, ['#ffd43b', '#e01e2b']);
      break;
    }
  }
}

export function getAtlasUVRect(tileIdx) {
  const col = tileIdx % ATLAS_COLS;
  const row = Math.floor(tileIdx / ATLAS_COLS);
  const pad = 0.12 / ATLAS_SIZE;
  const u0 = (col * TILE_SIZE) / ATLAS_SIZE + pad;
  const u1 = ((col + 1) * TILE_SIZE) / ATLAS_SIZE - pad;
  const v1 = 1 - (row * TILE_SIZE) / ATLAS_SIZE - pad;
  const v0 = 1 - ((row + 1) * TILE_SIZE) / ATLAS_SIZE + pad;
  return { u0, v0, u1, v1 };
}

export function createAtlasBoxGeometry(faceTiles, w = 1, h = 1, d = 1) {
  const geo = new THREE.BoxGeometry(w, h, d);
  const uv = geo.attributes.uv;
  const tiles = [
    faceTiles.px ?? faceTiles.side,
    faceTiles.nx ?? faceTiles.side,
    faceTiles.py ?? faceTiles.top ?? faceTiles.side,
    faceTiles.ny ?? faceTiles.bottom ?? faceTiles.top ?? faceTiles.side,
    faceTiles.pz ?? faceTiles.front ?? faceTiles.side,
    faceTiles.nz ?? faceTiles.back ?? faceTiles.front ?? faceTiles.side,
  ];
  for (let f = 0; f < 6; f++) {
    const { u0, v0, u1, v1 } = getAtlasUVRect(tiles[f]);
    const base = f * 4;
    uv.setXY(base + 0, u0, v1);
    uv.setXY(base + 1, u1, v1);
    uv.setXY(base + 2, u0, v0);
    uv.setXY(base + 3, u1, v0);
  }
  uv.needsUpdate = true;
  return geo;
}

function createRingGlowTexture() {
  const size = 64;
  const canvas = makeCanvas(size, size);
  const ctx = canvas.getContext('2d');
  const cx = size / 2;
  const cy = size / 2;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const r = Math.hypot(x + 0.5 - cx, y + 0.5 - cy) / (size * 0.5);
      if (r > 1) continue;
      const ringBand = Math.exp(-Math.pow((r - 0.78) / 0.11, 2));
      const innerFill = r < 0.78 ? 0.24 * (1 - r * 0.5) : 0;
      const alpha = Math.min(1, ringBand * 0.92 + innerFill);
      if (alpha > 0.02) {
        ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.magFilter = THREE.LinearFilter;
  tex.minFilter = THREE.LinearFilter;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

function createSunTexture() {
  const size = 64;
  const canvas = makeCanvas(size, size);
  const ctx = canvas.getContext('2d');
  const cx = size / 2;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const r = Math.hypot(x + 0.5 - cx, y + 0.5 - cx) / cx;
      if (r < 1) {
        const glow = Math.pow(Math.max(0, 1 - r), 2.0) * 0.78;
        ctx.fillStyle = `rgba(255,215,90,${glow.toFixed(3)})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }
  // Crimson & Gold McDonald's Sky Billboard Sun
  px(ctx, 18, 18, '#e01e2b', 28, 28);
  px(ctx, 20, 20, '#ffd43b', 24, 24);
  px(ctx, 22, 22, '#d91e2a', 20, 20);
  // Golden Arches 'M' in sky emblem
  px(ctx, 24, 25, '#fff9db', 3, 14);
  px(ctx, 30, 27, '#fff9db', 4, 12);
  px(ctx, 37, 25, '#fff9db', 3, 14);
  px(ctx, 26, 24, '#fff9db', 5, 3);
  px(ctx, 33, 24, '#fff9db', 5, 3);
  const tex = new THREE.CanvasTexture(canvas);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.LinearFilter;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

function createSparkleTexture() {
  const size = 16;
  const canvas = makeCanvas(size, size);
  const ctx = canvas.getContext('2d');
  px(ctx, 7, 1, 'rgba(255,255,255,0.95)', 2, 14);
  px(ctx, 1, 7, 'rgba(255,255,255,0.95)', 14, 2);
  px(ctx, 5, 5, '#ffffff', 6, 6);
  return finalizePixelTexture(canvas, false);
}

export function createWorldTextures() {
  const rng = createRng(1337);
  const atlasCanvas = makeCanvas(ATLAS_SIZE, ATLAS_SIZE);
  const atlasCtx = atlasCanvas.getContext('2d');
  const emCanvas = makeCanvas(ATLAS_SIZE, ATLAS_SIZE);
  const emCtx = emCanvas.getContext('2d');
  emCtx.fillStyle = '#000000';
  emCtx.fillRect(0, 0, ATLAS_SIZE, ATLAS_SIZE);

  const tiles = {};

  for (const [name, idx] of Object.entries(TILE_INDEX)) {
    const tileCanvas = makeCanvas(TILE_SIZE, TILE_SIZE);
    const tCtx = tileCanvas.getContext('2d');
    const tileEmCanvas = makeCanvas(TILE_SIZE, TILE_SIZE);
    const tEmCtx = tileEmCanvas.getContext('2d');
    tEmCtx.fillStyle = '#000000';
    tEmCtx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);

    paintTile(name, tCtx, tEmCtx, rng);

    const col = idx % ATLAS_COLS;
    const row = Math.floor(idx / ATLAS_COLS);
    atlasCtx.drawImage(tileCanvas, col * TILE_SIZE, row * TILE_SIZE);
    emCtx.drawImage(tileEmCanvas, col * TILE_SIZE, row * TILE_SIZE);

    tiles[name] = finalizePixelTexture(tileCanvas, name === 'water');
  }

  const atlasTexture = finalizePixelTexture(atlasCanvas, false);
  const emissiveAtlasTexture = finalizePixelTexture(emCanvas, false);

  return {
    tiles,
    atlasTexture,
    emissiveAtlasTexture,
    ringGlowTex: createRingGlowTexture(),
    sunTex: createSunTexture(),
    sparkleTex: createSparkleTexture(),
  };
}
