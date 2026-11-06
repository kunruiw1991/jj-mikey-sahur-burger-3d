// Canonical 68-clip neural voiceover catalog for JJ & Mikey vs Tung Tung Sahur: McDonald's Burger Battle 3D! (owner: burger-data-vo).
// Synthesized via edge-tts (en-US-GuyNeural, en-US-ChristopherNeural, en-US-AnaNeural) into assets/voice/*.mp3.

export const VOICE_SPEAKERS = Object.freeze({
  narrator: Object.freeze({
    id: 'narrator',
    name: 'Burger Battle Announcer',
    voice: 'en-US-AnaNeural',
    rate: '+6%',
    pitch: '+6Hz',
  }),
  cappuccina: Object.freeze({
    id: 'cappuccina',
    name: 'JJ Pro Chef',
    voice: 'en-US-AnaNeural',
    rate: '+8%',
    pitch: '+12Hz',
  }),
  bananini: Object.freeze({
    id: 'bananini',
    name: 'Mikey Turtle Chef',
    voice: 'en-US-AnaNeural',
    rate: '+12%',
    pitch: '+16Hz',
  }),
  lirili: Object.freeze({
    id: 'lirili',
    name: 'Security Guard Captain',
    voice: 'en-US-AnaNeural',
    rate: '+5%',
    pitch: '+8Hz',
  }),
  sahur: Object.freeze({
    id: 'sahur',
    name: 'Tung Tung Tung Sahur',
    voice: 'en-US-GuyNeural',
    rate: '+8%',
    pitch: '+4Hz',
  }),
  tralalero: Object.freeze({
    id: 'tralalero',
    name: 'Cursed Land Ghost',
    voice: 'en-US-GuyNeural',
    rate: '+6%',
    pitch: '-6Hz',
  }),
  bombardiro: Object.freeze({
    id: 'bombardiro',
    name: 'Sneaky Burger Robber',
    voice: 'en-US-ChristopherNeural',
    rate: '+4%',
    pitch: '-10Hz',
  }),
  patapim: Object.freeze({
    id: 'patapim',
    name: 'TNT Rotten Burger Golem',
    voice: 'en-US-ChristopherNeural',
    rate: '+2%',
    pitch: '-14Hz',
  }),
  sahur_king: Object.freeze({
    id: 'sahur_king',
    name: 'Tung Tung Sahur Burger King',
    voice: 'en-US-GuyNeural',
    rate: '+2%',
    pitch: '-16Hz',
  }),
});

export const VOICE_CATALOG = Object.freeze([
  // 1. Onboarding, Rhythm Combo & Kid Coaching (10)
  Object.freeze({
    id: 'guide_title',
    speaker: 'narrator',
    text: 'Welcome to JJ, Mikey, and Sahur McDonalds Burger Battle! Tap Play!',
  }),
  Object.freeze({
    id: 'guide_welcome',
    speaker: 'sahur',
    text: 'Tung Tung Tung Sahur! Tap the glowing Happy Meal crate right in front of us!',
  }),
  Object.freeze({
    id: 'guide_starter_pop',
    speaker: 'narrator',
    text: 'Awesome! Golden Burger Coins, a Shop Blueprint, and a Free Wheel Spin!',
  }),
  Object.freeze({
    id: 'guide_tap_block',
    speaker: 'narrator',
    text: 'Tap any glowing Burger Crate to bonk it three times! Sizzle, flip, bonk!',
  }),
  Object.freeze({
    id: 'guide_combo_sahur',
    speaker: 'sahur',
    text: 'Tung, Tung, Tung Sahur! Super Cheeseburger shockwave combo!',
  }),
  Object.freeze({
    id: 'guide_boing_hint',
    speaker: 'narrator',
    text: 'Boing! Sesame bun bounce! Spin the wheel for a stronger tool first!',
  }),
  Object.freeze({
    id: 'guide_ready_tralalero',
    speaker: 'narrator',
    text: 'Spatula ready! Let us clear the Cursed Land Ghost at Mikey One Dollar Lot!',
  }),
  Object.freeze({
    id: 'guide_ready_bombardiro',
    speaker: 'narrator',
    text: 'Fries Fryer Gong ready! Time to stop the Sneaky Burger Robber at the Register!',
  }),
  Object.freeze({
    id: 'guide_ready_patapim',
    speaker: 'narrator',
    text: 'Skate Shoes on! Let us bonk the TNT Rotten Burger Golem in the Yard!',
  }),
  Object.freeze({
    id: 'guide_ready_king',
    speaker: 'narrator',
    text: 'Cola Blaster ready! Challenge the Sahur Burger King on JJ Hilltop!',
  }),

  // 2. 5 Burger & Sahur Weapons (5)
  Object.freeze({
    id: 'vo_wpn_bat',
    speaker: 'sahur',
    text: 'Golden Burger Spatula! Time to flip patties and bonk crates!',
  }),
  Object.freeze({
    id: 'vo_wpn_gong',
    speaker: 'sahur',
    text: 'Sizzle ding! The Crispy Fries Fryer Gong is super hot!',
  }),
  Object.freeze({
    id: 'vo_wpn_mallet',
    speaker: 'sahur',
    text: 'Tung Tung Tung! The Golden Sahur Mallet packs a rhythm punch!',
  }),
  Object.freeze({
    id: 'vo_wpn_taiko',
    speaker: 'sahur',
    text: 'Fizz boom! Fizzy Cola Taiko Blaster! One-tap crate smasher!',
  }),
  Object.freeze({
    id: 'vo_wpn_rainbow',
    speaker: 'sahur',
    text: 'Ultimate Jackpot! The Rainbow Mega Burger Hammer of Champions!',
  }),

  // 3. 4 Hub Burger Battle Stations & Chef Helpers (9)
  Object.freeze({
    id: 'vo_totem_tier1',
    speaker: 'bananini',
    text: 'Hey! My One Dollar Noob Burger Shack is open and flipping patties!',
  }),
  Object.freeze({
    id: 'vo_totem_tier2',
    speaker: 'cappuccina',
    text: 'Awesome upgrade! Our Pro Combo Diner is serving fries, nuggets, and coins!',
  }),
  Object.freeze({
    id: 'vo_totem_tier3',
    speaker: 'cappuccina',
    text: 'Whoa! The One Hundred Thousand Dollar Two-Story Diamond McDonalds is raining gold!',
  }),
  Object.freeze({
    id: 'helper_cappuccina_wake',
    speaker: 'bananini',
    text: 'Mikey Turtle Chef here! No more green rotten burgers, only golden coins!',
  }),
  Object.freeze({
    id: 'helper_bananini_wake',
    speaker: 'cappuccina',
    text: 'JJ Pro Chef reporting! Fresh Cheeseburger Value Combos coming right up!',
  }),
  Object.freeze({
    id: 'helper_lirili_wake',
    speaker: 'sahur',
    text: 'Tung Tung Sahur Drive-Thru open! Rhythm drums and hot crispy fries!',
  }),
  Object.freeze({
    id: 'helper_assassino_wake',
    speaker: 'lirili',
    text: 'Security Guard Squad on duty! The Secret Underground Gold Vault Elevator is open!',
  }),
  Object.freeze({
    id: 'fairy_pot_max',
    speaker: 'cappuccina',
    text: 'All four McDonalds stations are maxed out! Secret Gold Vault jackpot fountain!',
  }),
  Object.freeze({
    id: 'fairy_need_stars',
    speaker: 'narrator',
    text: 'Collect more Burger Coins or win the earlier Boss Trophy first!',
  }),

  // 4. Golden Burger & Sahur Roulette Wheel (3)
  Object.freeze({
    id: 'wheel_open',
    speaker: 'cappuccina',
    text: 'Spin the Golden Burger and Sahur Wheel for a pro kitchen upgrade!',
  }),
  Object.freeze({
    id: 'wheel_spinning',
    speaker: 'sahur',
    text: 'Round and round the sizzling Burger Wheel goes! Tung Tung Tung!',
  }),
  Object.freeze({
    id: 'wheel_jackpot',
    speaker: 'cappuccina',
    text: 'Gold Vault Jackpot! Bonus Burger Coins and a glowing shield heart!',
  }),

  // 5. 12 Wacky Mystery Crate Drops & Gear (13)
  Object.freeze({
    id: 'vo_drop_stars',
    speaker: 'narrator',
    text: 'Shiny Golden Burger Coins!',
  }),
  Object.freeze({
    id: 'vo_drop_jackpot',
    speaker: 'sahur',
    text: 'Whoa! Secret Underground Gold Vault Coin Shower!',
  }),
  Object.freeze({
    id: 'vo_drop_seed',
    speaker: 'cappuccina',
    text: 'A Restaurant Blueprint! Tap Shop to build or upgrade our McDonalds!',
  }),
  Object.freeze({
    id: 'vo_drop_wheel',
    speaker: 'cappuccina',
    text: 'Free Spin Token! Let us spin the Burger and Sahur Wheel!',
  }),
  Object.freeze({
    id: 'vo_drop_mango',
    speaker: 'narrator',
    text: 'Yum! Deluxe Cheeseburger, Golden Fries, and Chicken Nuggets Value Combo!',
  }),
  Object.freeze({
    id: 'vo_drop_latte',
    speaker: 'cappuccina',
    text: 'Ice-Cold Fizzy Cola Zoom! Super fast feet and a bonus shield heart!',
  }),
  Object.freeze({
    id: 'vo_drop_bananini',
    speaker: 'sahur',
    text: 'Haha! Mini Tung Tung Sahur popped out drumming!',
  }),
  Object.freeze({
    id: 'vo_drop_confetti',
    speaker: 'bananini',
    text: 'Hooray! Golden Fry Fireworks and Mini Mikey Turtle Chef!',
  }),
  Object.freeze({
    id: 'vo_drop_toot',
    speaker: 'lirili',
    text: 'Whoop whoop! VIP Drive-Thru Siren and Mini JJ Security Guard!',
  }),
  Object.freeze({
    id: 'vo_gear_boots',
    speaker: 'sahur',
    text: 'Drive-Thru Skate Shoes! Zoom across the Burger Plaza!',
  }),
  Object.freeze({
    id: 'vo_gear_crown',
    speaker: 'cappuccina',
    text: 'JJ Hundred-Thousand-Dollar Pro Chef Crown! Five glowing shield hearts!',
  }),
  Object.freeze({
    id: 'vo_gear_cape',
    speaker: 'cappuccina',
    text: 'VIP Golden Arches Cape! Super Burger Coin magnet!',
  }),
  Object.freeze({
    id: 'vo_boss_alert',
    speaker: 'sahur',
    text: 'Uh-oh! Rush hour alert! A Giant Restaurant Boss just showed up!',
  }),

  // 6. 3 Pattable Mini Helpers (3)
  Object.freeze({
    id: 'vo_pet_cappuccina',
    speaker: 'bananini',
    text: 'Hehe! Mini Mikey Turtle Chef loves high-fives! Extra Burger Coins!',
  }),
  Object.freeze({
    id: 'vo_pet_bananini',
    speaker: 'sahur',
    text: 'Tung Tung! Happy Mini Sahur drums up bonus coins for you!',
  }),
  Object.freeze({
    id: 'vo_pet_lirili',
    speaker: 'lirili',
    text: 'Vault secure! Mini JJ Security Guard shares golden coins!',
  }),

  // 7. 4 Giant Burger Battle Bosses (20)
  Object.freeze({
    id: 'boss_tralalero_spawn',
    speaker: 'tralalero',
    text: 'Boooo! I am the Cursed Land Ghost haunting Mikey One Dollar Burger Shack!',
  }),
  Object.freeze({
    id: 'boss_tralalero_boing',
    speaker: 'tralalero',
    text: 'Spooky handprint bounce! Boing back to the plaza on a giant sesame bun!',
  }),
  Object.freeze({
    id: 'boss_tralalero_ouch',
    speaker: 'tralalero',
    text: 'Yikes! That Golden Burger Spatula is chasing away my spooky fog!',
  }),
  Object.freeze({
    id: 'boss_tralalero_defeat',
    speaker: 'tralalero',
    text: 'The curse is lifted! Mikey land is clean! Take my Ghost Trophy!',
  }),
  Object.freeze({
    id: 'vo_win_tralalero',
    speaker: 'narrator',
    text: 'Hooray! We cleared the Cursed Land Ghost for Mikey! Trophy one!',
  }),

  Object.freeze({
    id: 'boss_bombardiro_spawn',
    speaker: 'bombardiro',
    text: 'Hands up! I am the Sneaky Burger Robber here to raid the cash register!',
  }),
  Object.freeze({
    id: 'boss_bombardiro_boing',
    speaker: 'bombardiro',
    text: 'Haha! Too slow! Grab a Fries Fryer Gong before guarding this register!',
  }),
  Object.freeze({
    id: 'boss_bombardiro_ouch',
    speaker: 'bombardiro',
    text: 'Ouch! JJ Security Guards and that Fryer Gong are too strong!',
  }),
  Object.freeze({
    id: 'boss_bombardiro_defeat',
    speaker: 'bombardiro',
    text: 'I surrender! Every coin stays in JJ Gold Vault! Take my Robber Trophy!',
  }),
  Object.freeze({
    id: 'vo_win_bombardiro',
    speaker: 'narrator',
    text: 'Awesome job! The Sneaky Burger Robber is defeated! Two trophies won!',
  }),

  Object.freeze({
    id: 'boss_patapim_spawn',
    speaker: 'patapim',
    text: 'Boom crunch! I am the TNT Rotten Burger Golem from Mikey sneaky trap!',
  }),
  Object.freeze({
    id: 'boss_patapim_boing',
    speaker: 'patapim',
    text: 'Kaboom bounce! Put on Drive-Thru Skate Shoes and a Sahur Mallet first!',
  }),
  Object.freeze({
    id: 'boss_patapim_ouch',
    speaker: 'patapim',
    text: 'Whoa! You are knocking the green mold and TNT blocks right off me!',
  }),
  Object.freeze({
    id: 'boss_patapim_defeat',
    speaker: 'patapim',
    text: 'No more TNT pranks or rotten burgers! Take my Golem Trophy!',
  }),
  Object.freeze({
    id: 'vo_win_patapim',
    speaker: 'narrator',
    text: 'Amazing! The TNT Rotten Burger Golem is our friend! Three trophies!',
  }),

  Object.freeze({
    id: 'boss_king_spawn',
    speaker: 'sahur_king',
    text: 'Tung Tung Tung Sahur! Behold the Burger King on JJ Diamond Hilltop!',
  }),
  Object.freeze({
    id: 'boss_king_boing',
    speaker: 'sahur_king',
    text: 'Boom boom! Bring the Cola Taiko Blaster or Mega Burger Hammer to match my rhythm!',
  }),
  Object.freeze({
    id: 'boss_king_ouch',
    speaker: 'sahur_king',
    text: 'Sizzle clang! What an incredible Poor versus Rich Burger combo!',
  }),
  Object.freeze({
    id: 'boss_king_defeat',
    speaker: 'sahur_king',
    text: 'Five stars! JJ, Mikey, and you are the McDonalds Champions! Take the crown!',
  }),
  Object.freeze({
    id: 'vo_win_king',
    speaker: 'narrator',
    text: 'We did it! All four Burger Battle Trophies won! Gold Vault party time!',
  }),

  // 8. Finale, Persistence & Modes (5)
  Object.freeze({
    id: 'vo_finale_parade',
    speaker: 'sahur',
    text: 'Grand McDonalds and Tung Tung Sahur Feast! Burgers, fries, and gold for everyone!',
  }),
  Object.freeze({
    id: 'vo_keep_playing',
    speaker: 'narrator',
    text: 'Welcome back to JJ and Mikey Burger Plaza! Let us keep cooking and drumming!',
  }),
  Object.freeze({
    id: 'vo_chaos_on',
    speaker: 'sahur',
    text: 'Rush Hour Chaos Mode on! Every Burger Crate pops double combo surprises!',
  }),
  Object.freeze({
    id: 'vo_chaos_off',
    speaker: 'narrator',
    text: 'Normal Restaurant Mode! Sunny McDonalds adventure!',
  }),
  Object.freeze({
    id: 'sahur_sleepy_zzz',
    speaker: 'narrator',
    text: 'Hold on! That Boss is locked! Win the earlier restaurant trophy first!',
  }),
]);

export const VOICE_BY_ID = Object.freeze(
  Object.fromEntries(VOICE_CATALOG.map((clip) => [clip.id, clip]))
);
