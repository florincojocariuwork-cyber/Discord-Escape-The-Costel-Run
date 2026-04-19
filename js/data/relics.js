// Relics use hook-based trigger system (triggerRelics called from combat.js)

const RELICS = {

  discord_nitro: {
    id: 'discord_nitro', name: 'Discord Nitro', rarity: R.COMMON,
    art: '💜',
    description: 'Start each combat with 1 extra Energy.',
    trigger: 'onCombatStart',
    effect: (gs, cs) => { cs.energy += 1; cs.baseEnergy = (cs.baseEnergy || MAX_ENERGY) + 1; }
  },

  gaming_chair: {
    id: 'gaming_chair', name: 'Gaming Chair', rarity: R.COMMON,
    art: '🪑',
    description: 'Start each combat with 6 Block.',
    trigger: 'onCombatStart',
    effect: (gs, cs) => { cs.block += 6; }
  },

  noise_cancelling: {
    id: 'noise_cancelling', name: 'Noise Cancelling', rarity: R.COMMON,
    art: '🎧',
    description: 'Reduce all Tilt increases by 2 (min 1).',
    trigger: 'onTiltIncrease',
    effect: (gs, cs, payload) => { payload.amount = Math.max(1, payload.amount - 2); }
  },

  silent_mode: {
    id: 'silent_mode', name: 'Silent Mode', rarity: R.COMMON,
    art: '🔕',
    description: 'At the start of your turn, remove 1 Burn stack.',
    trigger: 'onTurnStart',
    effect: (gs, cs) => {
      if (cs.playerStatuses[S.BURN] && cs.playerStatuses[S.BURN] > 0) {
        cs.playerStatuses[S.BURN]--;
        if (cs.playerStatuses[S.BURN] <= 0) delete cs.playerStatuses[S.BURN];
      }
    }
  },

  moms_spaghetti: {
    id: 'moms_spaghetti', name: "Mom's Spaghetti", rarity: R.UNCOMMON,
    art: '🍝',
    description: 'The first card you play each turn costs 0.',
    trigger: 'onTurnStart',
    effect: (gs, cs) => { cs.freeFirstCard = true; }
  },

  six_hour_energy: {
    id: 'six_hour_energy', name: '6-Hour Energy', rarity: R.UNCOMMON,
    art: '⚡',
    description: 'If you have 4 or more cards in hand at the start of your turn, gain 1 extra Energy.',
    trigger: 'onTurnStart',
    effect: (gs, cs) => { if (cs.hand.length >= 4) cs.energy += 1; }
  },

  stream_highlights: {
    id: 'stream_highlights', name: 'Stream Highlights', rarity: R.UNCOMMON,
    art: '📹',
    description: 'Once per turn, when you play an Attack card, draw 1 card.',
    trigger: 'onCardPlayed',
    effect: (gs, cs, payload) => {
      if (payload.type === CT.ATTACK && !cs.streamHighlightUsed) {
        cs.streamHighlightUsed = true;
        drawCards(1);
      }
    }
  },

  ping_450: {
    id: 'ping_450', name: '450 Ping', rarity: R.UNCOMMON,
    art: '📡',
    description: '20% chance any card costs 0 when played.',
    trigger: 'onCardPlay',
    effect: (gs, cs, payload) => {
      if (Math.random() < 0.2) payload.freeCost = true;
    }
  },

  bsod: {
    id: 'bsod', name: 'Blue Screen of Hope', rarity: R.UNCOMMON,
    art: '💙',
    description: 'Once per combat, if Tilt would reach 100, set it to 99 instead.',
    trigger: 'onTiltIncrease',
    effect: (gs, cs, payload) => {
      if (cs && !cs.bsodUsed && gs.tilt + payload.amount >= MAX_TILT) {
        payload.capAt = MAX_TILT - 1;
        cs.bsodUsed = true;
      }
    }
  },

  win_streak: {
    id: 'win_streak', name: 'Win Streak', rarity: R.RARE,
    art: '🏆',
    description: 'After defeating an enemy, reduce Tilt by 8.',
    trigger: 'onEnemyDie',
    effect: (gs, cs) => { changeTilt(-8); }
  },

  touch_grass_irl: {
    id: 'touch_grass_irl', name: 'Touch Grass IRL', rarity: R.RARE,
    art: '🌱',
    description: 'Start each combat with Tilt reduced by 10.',
    trigger: 'onCombatStart',
    effect: (gs, cs) => { changeTilt(-10); }
  },

  rank_boost: {
    id: 'rank_boost', name: 'Rank Boost', rarity: R.RARE,
    art: '📈',
    description: 'If Tilt is 60 or higher when combat starts, gain 2 extra Energy.',
    trigger: 'onCombatStart',
    effect: (gs, cs) => { if (gs.tilt >= 60) cs.energy += 2; }
  },

  backup_account: {
    id: 'backup_account', name: 'Backup Account', rarity: R.BOSS,
    art: '🔄',
    description: 'Once per run, prevent a game over (Tilt set to 75 instead).',
    trigger: 'onTiltIncrease',
    effect: (gs, cs, payload) => {
      if (!gs.backupAccountUsed && gs.tilt + payload.amount >= MAX_TILT) {
        payload.capAt = 75;
        gs.backupAccountUsed = true;
        if (cs) addCombatLog('💾 Backup Account activated! Tilt capped at 75!');
      }
    }
  }
};

function getRelicsByRarity(rarity) {
  return Object.values(RELICS).filter(r => r.rarity === rarity);
}
