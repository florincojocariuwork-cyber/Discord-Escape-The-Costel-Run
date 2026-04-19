// Enemy patterns use global combat helpers (defined in combat.js, called at runtime)

function mkIntent(label, icon, effectFn) {
  return { label, icon, effect: effectFn };
}

function tilting(amount, label) {
  return mkIntent(label || `Tilts Costel (${amount})`, '💢', (cs) => { changeTilt(amount); });
}

function blocking(amount, label) {
  return mkIntent(label || `Blocks (${amount})`, '🛡️', (cs) => { gainEnemyBlock(cs.enemy, amount); });
}

function tiltAndBurn(tilt, burn, label) {
  return mkIntent(label || `Tilts + Burns`, '🔥', (cs) => {
    changeTilt(tilt);
    if (!cs.burnImmune) applyStatus({ isPlayer: true }, S.BURN, burn);
  });
}

const ENEMIES = {

  // ═══════════════════════════════════════════════
  // ACT 1: RV THERE YET?
  // ═══════════════════════════════════════════════

  backseat_driver: {
    id: 'backseat_driver', name: 'The Backseat Driver', act: 1, tier: 'REGULAR',
    determination: 36, art: '🗣️',
    lore: 'Never touches the controls. Always has opinions.',
    pattern: [
      tilting(7, 'Blame! (7 Tilt)'),
      tilting(5, 'Backseat Advice (5 Tilt)'),
    ]
  },

  bear_attack: {
    id: 'bear_attack', name: 'Angry Bear', act: 1, tier: 'REGULAR',
    determination: 42, art: '🐻',
    lore: 'Nature\'s way of saying you drove too far.',
    pattern: [
      tilting(6, 'Growl (6 Tilt)'),
      tilting(12, 'Maul! (12 Tilt)'),
      tilting(4, 'Sniff (4 Tilt)'),
    ]
  },

  plank_destroyer: {
    id: 'plank_destroyer', name: 'Plank Destroyer', act: 1, tier: 'REGULAR',
    determination: 34, art: '🪵',
    lore: 'He placed the plank. He will also remove it.',
    pattern: [
      tilting(8, 'Drops Plank (8 Tilt)'),
      tilting(5, 'Laughs (5 Tilt)'),
    ]
  },

  winch_tangler: {
    id: 'winch_tangler', name: 'Winch Tangler', act: 1, tier: 'REGULAR',
    determination: 38, art: '🔧',
    lore: 'How does one even tangle a winch? Ask him.',
    pattern: [
      blocking(8, 'Tangle (Block 8)'),
      tilting(11, 'Snap! (11 Tilt)'),
    ]
  },

  terrain_terror: {
    id: 'terrain_terror', name: 'Terrain Terror', act: 1, tier: 'ELITE',
    determination: 65, art: '⛰️',
    lore: 'The mud, the slope, the rocks — they\'re all conspiring.',
    pattern: [
      tilting(9, 'Mudslide (9 Tilt)'),
      tilting(13, 'Stuck! (13 Tilt)'),
      tiltAndBurn(11, 1, 'Tipping! (11 Tilt + Burn)'),
    ]
  },

  bad_mechanic: {
    id: 'bad_mechanic', name: 'Bad Mechanic', act: 1, tier: 'ELITE',
    determination: 70, art: '🔩',
    lore: '"Trust me, I know what I\'m doing." Famous last words.',
    pattern: [
      tilting(10, 'Wrong Diagnosis (10 Tilt)'),
      tilting(12, 'Wrong Part (12 Tilt)'),
      tiltAndBurn(8, 1, 'Shrugs (8 Tilt + Burn)'),
    ]
  },

  valishic: {
    id: 'valishic', name: 'Valishic', act: 1, tier: 'BOSS',
    determination: 130, art: '🚐',
    lore: 'He took the wheel. He will drive you off the edge.',
    winDialog: '"Scuze Costel, eu am condus mai bine."',
    loseDialog: 'Costel a parasit Discord-ul...',
    pattern: [
      blocking(15, 'Takes the Wheel (Block 15)'),
      tilting(14, 'Sabotages Winch (14 Tilt)'),
      tilting(20, 'Drives Off Cliff! (20 Tilt)'),
    ],
    phase2Pattern: [
      blocking(20, 'DRIFT MODE (Block 20)'),
      tiltAndBurn(26, 2, 'RV FLIP! (26 Tilt + 2 Burn)'),
      tilting(18, 'Full Speed (18 Tilt)'),
    ],
    phase2Threshold: 65
  },

  // ═══════════════════════════════════════════════
  // ACT 2: COUNTER-STRIKE 2
  // ═══════════════════════════════════════════════

  the_rusher: {
    id: 'the_rusher', name: 'The Rusher', act: 2, tier: 'REGULAR',
    determination: 38, art: '💨',
    lore: 'A→ A→ A→. Every round. No plan. Full confidence.',
    pattern: [
      tilting(8, 'Flames (8 Tilt)'),
      tilting(5, 'Blames (5 Tilt)'),
    ]
  },

  awp_camper: {
    id: 'awp_camper', name: 'AWP Camper', act: 2, tier: 'REGULAR',
    determination: 45, art: '🎯',
    lore: 'Has been in that corner since the start of the match.',
    pattern: [
      blocking(6, 'Camping (Block 6)'),
      tilting(14, 'SNIPE! (14 Tilt)'),
      blocking(4, 'Reloading (Block 4)'),
    ]
  },

  spinbot: {
    id: 'spinbot', name: 'Spinbot', act: 2, tier: 'REGULAR',
    determination: 30, art: '🔄',
    lore: 'Spin to win. But mostly spin to ruin your day.',
    pattern: [
      blocking(10, 'Spinning (Block 10)'),
      tilting(9, 'Cheats! (9 Tilt)'),
    ]
  },

  eco_fragger: {
    id: 'eco_fragger', name: 'Eco-Fragger', act: 2, tier: 'REGULAR',
    determination: 35, art: '💰',
    lore: 'Bought a deagle. Tells you to save. Already fragged three.',
    pattern: [
      tilting(6, 'Eco Round (6 Tilt)'),
      tilting(11, 'ALL IN (11 Tilt)'),
    ]
  },

  toxic_soloq: {
    id: 'toxic_soloq', name: 'Toxic Soloq', act: 2, tier: 'ELITE',
    determination: 65, art: '🤬',
    lore: 'Queued as a duo. Blames the team for being a duo.',
    pattern: [
      tilting(10, 'Flames Hard (10 Tilt)'),
      tilting(8, 'Blame (8 Tilt)'),
      tiltAndBurn(12, 1, 'Kick Vote (12 Tilt + Burn)'),
    ]
  },

  wallhack_walter: {
    id: 'wallhack_walter', name: 'Wallhack Walter', act: 2, tier: 'ELITE',
    determination: 70, art: '👁️',
    lore: '"I can see you through the wall." We know, Walter.',
    pattern: [
      mkIntent('Sees All (10 Tilt + Vulnerable)', '🔎', (cs) => { changeTilt(10); applyStatus({ isPlayer: true }, S.VULNERABLE, 1); }),
      tilting(14, 'Exposes Position (14 Tilt)'),
      tilting(8, 'Gloats (8 Tilt)'),
    ]
  },

  argianu: {
    id: 'argianu', name: 'Argianu', act: 2, tier: 'BOSS',
    determination: 140, art: '🔥',
    lore: 'He\'s been in your head since the loading screen.',
    winDialog: '"Bine jucat, bă. Dar știi că am lagat, da?"',
    loseDialog: 'Costel a parasit Discord-ul...',
    pattern: [
      tilting(10, 'Trash Talk (10 Tilt)'),
      tilting(10, 'More Trash Talk (10 Tilt)'),
      tiltAndBurn(16, 2, 'Vote Kick (16 Tilt + 2 Burn)'),
    ],
    phase2Pattern: [
      tiltAndBurn(18, 3, 'RAGE MODE (18 Tilt + 3 Burn)'),
      tilting(14, 'Team Kill Attempt (14 Tilt)'),
      tiltAndBurn(16, 2, 'Still Going (16 Tilt + 2 Burn)'),
    ],
    phase2Threshold: 70
  },

  // ═══════════════════════════════════════════════
  // ACT 3: LEAGUE OF LEGENDS — ARAM
  // ═══════════════════════════════════════════════

  aram_reroller: {
    id: 'aram_reroller', name: 'The Reroller', act: 3, tier: 'REGULAR',
    determination: 38, art: '🎲',
    lore: 'Rerolled out of the one champion he can actually play.',
    pattern: [
      blocking(8, 'Rerolling (Block 8)'),
      tilting(7, 'Blames Team (7 Tilt)'),
    ]
  },

  bridge_camper: {
    id: 'bridge_camper', name: 'Bridge Camper', act: 3, tier: 'REGULAR',
    determination: 42, art: '🌉',
    lore: 'ARAM has one lane. He still found a bush to hide in.',
    pattern: [
      blocking(10, 'Hiding (Block 10)'),
      tilting(11, 'Ambush! (11 Tilt)'),
      tilting(6, 'Escapes (6 Tilt)'),
    ]
  },

  poke_spammer: {
    id: 'poke_spammer', name: 'Poke Spammer', act: 3, tier: 'REGULAR',
    determination: 40, art: '👆',
    lore: 'Ezreal. 450 ability haste. You can\'t even breathe.',
    pattern: [
      tilting(6, 'Poke (6 Tilt)'),
      tilting(6, 'More Poke (6 Tilt)'),
      tilting(12, 'BIG POKE (12 Tilt)'),
    ]
  },

  my_team_guy: {
    id: 'my_team_guy', name: '"My Team" Guy', act: 3, tier: 'REGULAR',
    determination: 36, art: '😩',
    lore: 'The only 5/0 guy who somehow still loses. Still your fault.',
    pattern: [
      tilting(8, 'Complains (8 Tilt)'),
      tilting(8, 'Complains More (8 Tilt)'),
      mkIntent('Goes AFK (Tilt +5 for 2 turns)', '💤', (cs) => {
        cs.enemy.burnTilt = (cs.enemy.burnTilt || 0) + 5;
        cs.enemy.burnTiltTurns = (cs.enemy.burnTiltTurns || 0) + 2;
        changeTilt(5);
      }),
    ]
  },

  infinite_scaler: {
    id: 'infinite_scaler', name: 'Infinite Scaler', act: 3, tier: 'ELITE',
    determination: 75, art: '📊',
    lore: 'Nasus. ARAM. Full stacks by minute 8. This is your fault somehow.',
    pattern: [
      blocking(12, 'Farming (Block 12)'),
      mkIntent('Scales Up (+5 future tilt)', '📈', (cs) => { cs.enemy.tiltBonus = (cs.enemy.tiltBonus || 0) + 5; }),
      mkIntent('Carries Hard', '💪', (cs) => { changeTilt(16 + (cs.enemy.tiltBonus || 0)); }),
    ]
  },

  the_feeder: {
    id: 'the_feeder', name: 'The Feeder', act: 3, tier: 'ELITE',
    determination: 68, art: '💀',
    lore: 'Dies to tower. Blames jungle. Tower isn\'t even on this map.',
    pattern: [
      tiltAndBurn(10, 1, 'Dies Again (10 Tilt + Burn)'),
      tilting(12, 'Blames You (12 Tilt)'),
      tiltAndBurn(10, 1, 'Yep, Dies Again (10 Tilt + Burn)'),
    ]
  },

  bibitz: {
    id: 'bibitz', name: 'Bibitz', act: 3, tier: 'BOSS',
    determination: 160, art: '⚡',
    lore: 'He carries. He knows he carries. He will never let you forget.',
    winDialog: '"Bravo coaie, nu credeam că poți."',
    loseDialog: 'Costel a parasit Discord-ul...',
    pattern: [
      blocking(12, 'Full Build (Block 12)'),
      tilting(16, 'All In Mid (16 Tilt)'),
      mkIntent('Snowballing (20 Tilt + Vulnerable)', '❄️', (cs) => {
        changeTilt(20);
        applyStatus({ isPlayer: true }, S.VULNERABLE, 1);
      }),
    ],
    phase2Pattern: [
      tiltAndBurn(28, 2, 'ULT SPAM (28 Tilt + 2 Burn)'),
      tilting(20, 'Unstoppable (20 Tilt)'),
      tiltAndBurn(22, 1, 'Pentakill (22 Tilt + 1 Burn)'),
    ],
    phase2Threshold: 80,
    healsPerTurn: 8
  }
};

function createEnemyInstance(enemyDef) {
  return {
    ...enemyDef,
    currentDetermination: enemyDef.determination,
    maxDetermination: enemyDef.determination,
    block: 0,
    statuses: {},
    intentIndex: 0,
    inPhase2: false,
    tiltBonus: 0
  };
}

function getActEnemies(act, tier) {
  return Object.values(ENEMIES).filter(e => e.act === act && e.tier === tier);
}
