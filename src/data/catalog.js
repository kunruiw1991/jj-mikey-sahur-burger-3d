// Frozen canonical catalog for JJ & Mikey vs Tung Tung Sahur: McDonald's Burger Battle 3D! (owner: burger-data-vo).
// Single source of truth imported by world, chars, game, ui, fx, and main so every ID and number matches 100%.

export const STORAGE_KEY = 'sahur_island_progress';

export const ISLAND_BOUNDS = Object.freeze({
  minX: -34,
  maxX: 34,
  minZ: -34,
  maxZ: 34,
  size: 72,
  hubRadius: 11.5,
  gardenLingerRadius: 5.8,
  hubProximityRadius: 8.5,
});

export const TOTEM_PADS = Object.freeze([
  Object.freeze({
    padIdx: 0,
    id: 'cappuccino_cafe',
    name: 'Mikey $1 Noob Shack',
    shortName: 'MIKEY SHACK',
    helperId: 'ballerina_cappuccina',
    helperName: 'Mikey Turtle Chef',
    emoji: '🐢🍔',
    x: -4.5,
    y: 1,
    z: 1.6,
  }),
  Object.freeze({
    padIdx: 1,
    id: 'banana_treehouse',
    name: 'JJ $100K Pro McDonalds',
    shortName: 'JJ BURGER',
    helperId: 'chimpanzini_bananini',
    helperName: 'JJ Pro Chef',
    emoji: '👑🍟',
    x: 4.5,
    y: 1,
    z: 1.6,
  }),
  Object.freeze({
    padIdx: 2,
    id: 'cactus_oasis_clock',
    name: 'Tung Tung Sahur Drive-Thru',
    shortName: 'SAHUR DRUM',
    helperId: 'lirili_larila',
    helperName: 'Tung Tung Tung Sahur',
    emoji: '🥁🍔',
    x: -4.5,
    y: 1,
    z: -2.6,
  }),
  Object.freeze({
    padIdx: 3,
    id: 'sneaker_beach_hut',
    name: 'Secret Underground Gold Vault',
    shortName: 'GOLD VAULT',
    helperId: 'cappuccino_assassino',
    helperName: 'Security Guard Squad',
    emoji: '🏦💎',
    x: 4.5,
    y: 1,
    z: -2.6,
  }),
]);

export const FLOWERPOT_PADS = TOTEM_PADS;

export const HUB_LAYOUT = Object.freeze({
  spawn: Object.freeze({ x: 0, y: 1, z: 4.5, facingX: 0, facingZ: 1.5 }),
  starterBlock: Object.freeze({ x: 0, y: 1, z: 2.0 }),
  boingLanding: Object.freeze({ x: 0, y: 1, z: 3.4 }),
  rouletteWheel: Object.freeze({ x: 0, y: 1, z: -1.6 }),
  rouletteChest: Object.freeze({ x: 0, y: 1, z: -1.6 }),
  totemPads: TOTEM_PADS,
  flowerpotPads: TOTEM_PADS,
  trophyPedestals: Object.freeze([
    Object.freeze({ idx: 0, titanId: 'tralalero_tralala', bossId: 'tralalero_tralala', x: -4.8, y: 1, z: -7.5 }),
    Object.freeze({ idx: 1, titanId: 'bombardiro_crocodilo', bossId: 'bombardiro_crocodilo', x: -1.6, y: 1, z: -8.2 }),
    Object.freeze({ idx: 2, titanId: 'brr_brr_patapim', bossId: 'brr_brr_patapim', x: 1.6, y: 1, z: -8.2 }),
    Object.freeze({ idx: 3, titanId: 'golden_sahur_king', bossId: 'golden_sahur_king', x: 4.8, y: 1, z: -7.5 }),
  ]),
});

export const BIOMES = Object.freeze({
  hub: Object.freeze({
    id: 'hub',
    name: 'Burger Battle Plaza',
    titanId: null,
    bossId: null,
    groundColor: 0x62cf57,
  }),
  meadow: Object.freeze({
    id: 'meadow',
    name: 'Mikey $1 Cursed Lot',
    quadrant: 'SW',
    bounds: Object.freeze({ minX: -31, maxX: -7, minZ: 6, maxZ: 31 }),
    megaTitanPos: Object.freeze({ x: -18, y: 1, z: 18 }),
    titanId: 'tralalero_tralala',
    bossId: 'tralalero_tralala',
    groundColor: 0x58c94e,
  }),
  snow: Object.freeze({
    id: 'snow',
    name: 'Robber Alley & Register',
    quadrant: 'NW',
    bounds: Object.freeze({ minX: -31, maxX: -7, minZ: -31, maxZ: -6 }),
    megaTitanPos: Object.freeze({ x: -18, y: 2, z: -18 }),
    titanId: 'bombardiro_crocodilo',
    bossId: 'bombardiro_crocodilo',
    groundColor: 0xdff5ff,
  }),
  farm: Object.freeze({
    id: 'farm',
    name: 'TNT Rotten Burger Yard',
    quadrant: 'SE',
    bounds: Object.freeze({ minX: 7, maxX: 31, minZ: 6, maxZ: 31 }),
    megaTitanPos: Object.freeze({ x: 18, y: 1, z: 18 }),
    titanId: 'brr_brr_patapim',
    bossId: 'brr_brr_patapim',
    groundColor: 0x9fd448,
  }),
  castle: Object.freeze({
    id: 'castle',
    name: 'JJ $100K Diamond Hilltop',
    quadrant: 'NE',
    bounds: Object.freeze({ minX: 7, maxX: 31, minZ: -31, maxZ: -6 }),
    megaTitanPos: Object.freeze({ x: 20, y: 2, z: -20 }),
    titanId: 'golden_sahur_king',
    bossId: 'golden_sahur_king',
    groundColor: 0xd6b556,
  }),
});

export const WEAPON_ORDER = Object.freeze([
  'wooden_kentungan_bat',
  'bronze_temple_gong',
  'golden_sahur_mallet',
  'neon_thunder_taiko',
  'rainbow_mega_hammer',
]);

export const DRUM_CLUB_ORDER = WEAPON_ORDER;

export const WEAPONS = Object.freeze({
  wooden_kentungan_bat: Object.freeze({
    id: 'wooden_kentungan_bat',
    name: 'Golden Burger Spatula',
    shortName: 'SPATULA',
    tier: 1,
    damage: 24,
    mineHitsNormal: 2,
    mineHitsTough: 2,
    mineHitsLucky: 3,
    bonusGems: 0,
    color: '#c68642',
    accentColor: '#68d354',
    emoji: '🍔',
    voId: 'guide_welcome',
  }),
  bronze_temple_gong: Object.freeze({
    id: 'bronze_temple_gong',
    name: 'Crispy Fries Fryer Gong',
    shortName: 'FRYER',
    tier: 2,
    damage: 34,
    mineHitsNormal: 2,
    mineHitsTough: 2,
    mineHitsLucky: 3,
    bonusGems: 0,
    color: '#e69938',
    accentColor: '#ffe055',
    emoji: '🍟',
    voId: 'vo_wpn_gong',
  }),
  golden_sahur_mallet: Object.freeze({
    id: 'golden_sahur_mallet',
    name: 'Tung Tung Sahur Mallet',
    shortName: 'SAHUR',
    tier: 3,
    damage: 50,
    mineHitsNormal: 2,
    mineHitsTough: 2,
    mineHitsLucky: 3,
    bonusGems: 0,
    color: '#ffd43b',
    accentColor: '#39d5ff',
    emoji: '🥁',
    voId: 'vo_wpn_mallet',
  }),
  neon_thunder_taiko: Object.freeze({
    id: 'neon_thunder_taiko',
    name: 'Fizzy Cola Taiko Blaster',
    shortName: 'COLA',
    tier: 4,
    damage: 72,
    mineHitsNormal: 1,
    mineHitsTough: 1,
    mineHitsLucky: 3,
    bonusGems: 0,
    color: '#9775fa',
    accentColor: '#3bc9db',
    emoji: '🥤',
    voId: 'vo_wpn_taiko',
  }),
  rainbow_mega_hammer: Object.freeze({
    id: 'rainbow_mega_hammer',
    name: 'Rainbow Mega Burger Hammer',
    shortName: 'MEGA',
    tier: 5,
    damage: 92,
    mineHitsNormal: 1,
    mineHitsTough: 1,
    mineHitsLucky: 3,
    bonusGems: 1,
    color: '#ff6b9d',
    accentColor: '#ffe066',
    emoji: '🌈',
    voId: 'vo_wpn_rainbow',
  }),
});

export const DRUM_CLUBS = WEAPONS;

export const LEGACY_WEAPON_ALIASES = Object.freeze({
  wood_stick: 'wooden_kentungan_bat',
  sparkle_sword: 'bronze_temple_gong',
  gold_pickaxe: 'bronze_temple_gong',
  ocean_trident: 'golden_sahur_mallet',
  thunder_hammer: 'neon_thunder_taiko',
  rainbow_blade: 'rainbow_mega_hammer',
});

export function resolveWeaponId(id) {
  if (!id) return 'wooden_kentungan_bat';
  if (WEAPONS[id]) return id;
  if (LEGACY_WEAPON_ALIASES[id]) return LEGACY_WEAPON_ALIASES[id];
  return 'wooden_kentungan_bat';
}

export const ROULETTE_COSTS = Object.freeze([28, 88, 112, 120, 270, 290]);

export const TOTEM_TIERS = Object.freeze({
  0: Object.freeze({
    tier: 0,
    id: 'sleepy_cottage',
    name: 'Empty $1 Burger Stand',
    shortName: 'OPEN SHOP!',
    gemYield: 0,
    intervalSec: 0,
    costGems: 6,
    voId: null,
  }),
  1: Object.freeze({
    tier: 1,
    id: 'cottage_totem',
    name: 'Noob Burger Shack',
    shortName: 'SHACK ★1',
    gemYield: 2,
    intervalSec: 3.3,
    costGems: 6,
    color: '#ffd43b',
    voId: 'vo_totem_tier1',
  }),
  2: Object.freeze({
    tier: 2,
    id: 'rhythm_pavilion',
    name: 'Pro Combo Diner',
    shortName: 'DINER ★2',
    gemYield: 4,
    intervalSec: 2.9,
    costGems: 12,
    color: '#4dabf7',
    voId: 'vo_totem_tier2',
  }),
  3: Object.freeze({
    tier: 3,
    id: 'ultimate_sahur_tower',
    name: '$100K Diamond McDonalds',
    shortName: 'MEGA SHOP ★3',
    gemYield: 8,
    intervalSec: 2.5,
    costGems: 20,
    color: '#ff6b9d',
    voId: 'vo_totem_tier3',
  }),
});

export const FLOWERPOT_TIERS = TOTEM_TIERS;

export const LOOT_TABLE = Object.freeze([
  Object.freeze({ id: 'drum_star_small', weight: 39, gems: 1, label: '+1 BURGER COIN!', color: '#ffd43b', voId: 'vo_drop_stars' }),
  Object.freeze({ id: 'star_shower_jackpot', weight: 4, gems: 5, label: 'GOLD VAULT JACKPOT!', color: '#ff922b', voId: 'vo_drop_jackpot' }),
  Object.freeze({ id: 'totem_seed', weight: 6, gems: 1, isSeed: true, label: 'SHOP BLUEPRINT!', color: '#51cf66', voId: 'vo_drop_seed' }),
  Object.freeze({ id: 'free_spin_token', weight: 3, gems: 1, isFreeSpin: true, label: 'FREE SPIN!', color: '#fcc419', voId: 'vo_drop_wheel' }),
  Object.freeze({ id: 'croissant_mango_feast', weight: 11, gems: 1, label: 'VALUE COMBO!', color: '#ffa94d', voId: 'vo_drop_mango' }),
  Object.freeze({ id: 'latte_speed_boost', weight: 9, gems: 1, shield: 1, latteBoost: true, label: 'COLA ZOOM!', color: '#f06595', voId: 'vo_drop_latte' }),
  Object.freeze({ id: 'mini_chimpanzini_dance', weight: 8, gems: 1, critter: 'mini_bananini', label: 'MINI SAHUR!', color: '#ffe066', voId: 'vo_drop_bananini' }),
  Object.freeze({ id: 'confetti_fireworks_pop', weight: 7, gems: 1, critter: 'mini_cappuccina', label: 'MINI MIKEY!', color: '#faa2c1', voId: 'vo_drop_confetti' }),
  Object.freeze({ id: 'silly_cushion_toot', weight: 6, gems: 1, critter: 'mini_lirili', label: 'MINI GUARD!', color: '#99e9f2', voId: 'vo_drop_toot' }),
  Object.freeze({ id: 'speed_boots', weight: 4, gems: 2, gear: 'speedBoots', label: 'SKATE SHOES!', color: '#3bc9db', voId: 'vo_gear_boots' }),
  Object.freeze({ id: 'gold_helmet', weight: 3, gems: 2, gear: 'helmet', label: 'PRO CHEF CROWN!', color: '#ffd43b', voId: 'vo_gear_crown' }),
  Object.freeze({ id: 'star_cape', weight: 4, gems: 2, gear: 'starCape', label: 'VIP BURGER CAPE!', color: '#cc5de8', voId: 'vo_gear_cape' }),
  Object.freeze({ id: 'surprise_boss', weight: 4, gems: 0, isSurpriseBoss: true, label: 'RUSH HOUR BOSS!', color: '#ff4d4f', voId: 'vo_boss_alert' }),
]);

export const CRITTER_TYPES = Object.freeze({
  mini_cappuccina: Object.freeze({
    id: 'mini_cappuccina',
    legacySpecies: 'piggy',
    name: 'Mini Mikey Turtle Chef',
    bonusGems: 4,
    color: 0xffb3d9,
    voId: 'vo_pet_cappuccina',
  }),
  mini_bananini: Object.freeze({
    id: 'mini_bananini',
    legacySpecies: 'bee',
    name: 'Mini Tung Tung Sahur',
    bonusGems: 4,
    color: 0xffe066,
    voId: 'vo_pet_bananini',
  }),
  mini_lirili: Object.freeze({
    id: 'mini_lirili',
    legacySpecies: 'chick',
    name: 'Mini JJ Security Guard',
    bonusGems: 3,
    color: 0x74d14c,
    voId: 'vo_pet_lirili',
  }),
});

export const TITAN_ORDER = Object.freeze([
  'tralalero_tralala',
  'bombardiro_crocodilo',
  'brr_brr_patapim',
  'golden_sahur_king',
]);

export const BOSS_ORDER = TITAN_ORDER;

export const LEGACY_TITAN_ALIASES = Object.freeze({
  moss_titan: 'tralalero_tralala',
  snow_titan: 'bombardiro_crocodilo',
  thunder_titan: 'brr_brr_patapim',
  bedrock_king: 'golden_sahur_king',
});

export function resolveBossId(id) {
  if (!id) return TITAN_ORDER[0];
  if (TITANS[id]) return id;
  if (LEGACY_TITAN_ALIASES[id]) return LEGACY_TITAN_ALIASES[id];
  return TITAN_ORDER[0];
}

export const TITANS = Object.freeze({
  tralalero_tralala: Object.freeze({
    id: 'tralalero_tralala',
    name: 'Cursed Land Ghost',
    shortName: 'GHOST ★1',
    biome: 'meadow',
    requiredTier: 1,
    requiresBoots: false,
    maxHp: 180,
    scale: 4.2,
    rewardGems: 6,
    spawnPos: Object.freeze({ x: -18, y: 1, z: 18 }),
    bodyColor: 0x2299dd,
    accentColor: 0x3bc9db,
    voSpawn: 'boss_tralalero_spawn',
    voBoing: 'boss_tralalero_boing',
    voOuch: 'boss_tralalero_ouch',
    voDefeat: 'boss_tralalero_defeat',
    voCheer: 'vo_win_tralalero',
  }),
  bombardiro_crocodilo: Object.freeze({
    id: 'bombardiro_crocodilo',
    name: 'Sneaky Burger Robber',
    shortName: 'ROBBER ★2',
    biome: 'snow',
    requiredTier: 2,
    requiresBoots: false,
    maxHp: 240,
    scale: 4.4,
    rewardGems: 8,
    spawnPos: Object.freeze({ x: -18, y: 2, z: -18 }),
    bodyColor: 0x4caf50,
    accentColor: 0xffd43b,
    voSpawn: 'boss_bombardiro_spawn',
    voBoing: 'boss_bombardiro_boing',
    voOuch: 'boss_bombardiro_ouch',
    voDefeat: 'boss_bombardiro_defeat',
    voCheer: 'vo_win_bombardiro',
  }),
  brr_brr_patapim: Object.freeze({
    id: 'brr_brr_patapim',
    name: 'TNT Rotten Burger Golem',
    shortName: 'TNT GOLEM ★3',
    biome: 'farm',
    requiredTier: 3,
    requiresBoots: true,
    maxHp: 370,
    scale: 4.6,
    rewardGems: 10,
    spawnPos: Object.freeze({ x: 18, y: 1, z: 18 }),
    bodyColor: 0x6d9e3f,
    accentColor: 0xc68642,
    voSpawn: 'boss_patapim_spawn',
    voBoing: 'boss_patapim_boing',
    voOuch: 'boss_patapim_ouch',
    voDefeat: 'boss_patapim_defeat',
    voCheer: 'vo_win_patapim',
  }),
  golden_sahur_king: Object.freeze({
    id: 'golden_sahur_king',
    name: 'Tung Tung Sahur Burger King',
    shortName: 'SAHUR KING ★4',
    biome: 'castle',
    requiredTier: 4,
    requiresBoots: true,
    maxHp: 540,
    scale: 5.0,
    rewardGems: 12,
    spawnPos: Object.freeze({ x: 20, y: 2, z: -20 }),
    bodyColor: 0xd99b26,
    accentColor: 0xffe066,
    voSpawn: 'boss_king_spawn',
    voBoing: 'boss_king_boing',
    voOuch: 'boss_king_ouch',
    voDefeat: 'boss_king_defeat',
    voCheer: 'vo_win_king',
  }),
});

export const BOSSES = TITANS;

export const MOVEMENT_TUNING = Object.freeze({
  baseSpeed: 8.5,
  bootsSpeed: 10.8,
  helmetSpeed: 10.8,
  latteSpeed: 10.8,
  swingIntervalSec: 0.30,
  autoHoldBonkMs: 300,
  comboShockwaveRadius: 4.0,
  comboBonusGems: 2,
  interactRange: 2.6,
  titanMeleeRange: 4.2,
  pickupMagnetRadius: 3.6,
  capeMagnetRadius: 5.8,
  jumpVelocity: 11.5,
  jumpGravityUp: 28.0,
  jumpGravityDown: 38.0,
  stickThrowRange: 6.2,
  stickOutboundSec: 0.32,
  stickHoverSec: 0.16,
  stickReturnSec: 0.34,
});
