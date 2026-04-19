// Card pool — effects reference global combat helpers (defined in combat.js, called at runtime)
const CARDS = {

  // ── STARTING DECK ─────────────────────────────────────────
  copium_inhale: {
    id: 'copium_inhale', name: 'Copium Inhale', upgradedName: 'Copium Inhale+',
    type: CT.ATTACK, rarity: R.COMMON, cost: 1,
    art: '😤',
    desc: (u) => `Deal ${u ? 9 : 6} Chill damage.`,
    effect: (cs, u) => { dealDamage(cs.enemy, u ? 9 : 6); }
  },

  breathe: {
    id: 'breathe', name: 'Breathe', upgradedName: 'Breathe+',
    type: CT.SKILL, rarity: R.COMMON, cost: 1,
    art: '🌬️',
    desc: (u) => `Reduce Tilt by ${u ? 9 : 6}.`,
    effect: (cs, u) => { changeTilt(-(u ? 9 : 6)); }
  },

  headset_on: {
    id: 'headset_on', name: 'Headset On', upgradedName: 'Headset On+',
    type: CT.SKILL, rarity: R.COMMON, cost: 1,
    art: '🎧',
    desc: (u) => `Gain ${u ? 8 : 5} Block.`,
    effect: (cs, u) => { gainBlock(u ? 8 : 5); }
  },

  skill_issue: {
    id: 'skill_issue', name: 'Skill Issue', upgradedName: 'Skill Issue+',
    type: CT.ATTACK, rarity: R.COMMON, cost: 1,
    art: '🎮',
    desc: (u) => `Deal ${u ? 6 : 4} Chill damage. Apply ${u ? 2 : 1} Vulnerable.`,
    effect: (cs, u) => {
      dealDamage(cs.enemy, u ? 6 : 4);
      applyStatus(cs.enemy, S.VULNERABLE, u ? 2 : 1);
    }
  },

  gg_wp: {
    id: 'gg_wp', name: 'GG WP', upgradedName: 'GG WP+',
    type: CT.SKILL, rarity: R.COMMON, cost: 0,
    art: '🤝',
    desc: (u) => `Reduce Tilt by ${u ? 4 : 3}. Draw ${u ? 2 : 1} card${u ? 's' : ''}.`,
    effect: (cs, u) => { changeTilt(-(u ? 4 : 3)); drawCards(u ? 2 : 1); }
  },

  // ── COMMON ATTACKS ─────────────────────────────────────────
  reported: {
    id: 'reported', name: 'Reported', upgradedName: 'Reported+',
    type: CT.ATTACK, rarity: R.COMMON, cost: 1,
    art: '🚩',
    desc: (u) => `Deal ${u ? 11 : 8} Chill damage.`,
    effect: (cs, u) => { dealDamage(cs.enemy, u ? 11 : 8); }
  },

  ping_spike: {
    id: 'ping_spike', name: 'Ping Spike', upgradedName: 'Ping Spike+',
    type: CT.ATTACK, rarity: R.COMMON, cost: 1,
    art: '📶',
    desc: (u) => `Deal ${u ? 7 : 5} Chill damage. If enemy is Vulnerable, deal ${u ? 14 : 10} instead.`,
    effect: (cs, u) => {
      const vuln = (cs.enemy.statuses[S.VULNERABLE] || 0) > 0;
      dealDamage(cs.enemy, vuln ? (u ? 14 : 10) : (u ? 7 : 5), true);
    }
  },

  mald: {
    id: 'mald', name: 'Mald', upgradedName: 'Mald+',
    type: CT.ATTACK, rarity: R.COMMON, cost: 0,
    art: '😡',
    desc: (u) => `Deal ${u ? 5 : 3} Chill damage.`,
    effect: (cs, u) => { dealDamage(cs.enemy, u ? 5 : 3); }
  },

  noscope: {
    id: 'noscope', name: 'No-Scope', upgradedName: 'No-Scope+',
    type: CT.ATTACK, rarity: R.COMMON, cost: 2,
    art: '🎯',
    desc: (u) => `Deal ${u ? 24 : 18} Chill damage.`,
    effect: (cs, u) => { dealDamage(cs.enemy, u ? 24 : 18); }
  },

  clutch_play: {
    id: 'clutch_play', name: 'Clutch Play', upgradedName: 'Clutch Play+',
    type: CT.ATTACK, rarity: R.COMMON, cost: 1,
    art: '🏆',
    desc: (u) => `Deal ${u ? 9 : 7} Chill damage. Draw ${u ? 2 : 1} card${u ? 's' : ''}.`,
    effect: (cs, u) => { dealDamage(cs.enemy, u ? 9 : 7); drawCards(u ? 2 : 1); }
  },

  uninstall_counter: {
    id: 'uninstall_counter', name: 'Uninstall Counter', upgradedName: 'Uninstall Counter+',
    type: CT.ATTACK, rarity: R.COMMON, cost: 2,
    art: '🗑️',
    desc: (u) => `Deal ${u ? 18 : 14} Chill damage.`,
    effect: (cs, u) => { dealDamage(cs.enemy, u ? 18 : 14); }
  },

  // ── COMMON SKILLS ─────────────────────────────────────────
  mute_all: {
    id: 'mute_all', name: 'Mute All', upgradedName: 'Mute All+',
    type: CT.SKILL, rarity: R.COMMON, cost: 1,
    art: '🔇',
    desc: (u) => `Apply ${u ? 3 : 2} Muted to enemy (skip actions).`,
    effect: (cs, u) => { applyStatus(cs.enemy, S.MUTED, u ? 3 : 2); }
  },

  touch_grass: {
    id: 'touch_grass', name: 'Touch Grass', upgradedName: 'Touch Grass+',
    type: CT.SKILL, rarity: R.COMMON, cost: 2,
    art: '🌱',
    desc: (u) => `Reduce Tilt by ${u ? 20 : 15}. Exhaust.`,
    exhaust: true,
    effect: (cs, u) => { changeTilt(-(u ? 20 : 15)); exhaustCard(cs, cs._playingCard); }
  },

  vibes_only: {
    id: 'vibes_only', name: 'Vibes Only', upgradedName: 'Vibes Only+',
    type: CT.SKILL, rarity: R.COMMON, cost: 1,
    art: '😌',
    desc: (u) => `Gain ${u ? 10 : 7} Block. Reduce Tilt by ${u ? 5 : 3}.`,
    effect: (cs, u) => { gainBlock(u ? 10 : 7); changeTilt(-(u ? 5 : 3)); }
  },

  it_is_what: {
    id: 'it_is_what', name: 'It Is What It Is', upgradedName: 'It Is What It Is+',
    type: CT.SKILL, rarity: R.COMMON, cost: 0,
    art: '🤷',
    desc: (u) => `Reduce Tilt by ${u ? 8 : 5}. Exhaust.`,
    exhaust: true,
    effect: (cs, u) => { changeTilt(-(u ? 8 : 5)); exhaustCard(cs, cs._playingCard); }
  },

  perspective: {
    id: 'perspective', name: 'Perspective', upgradedName: 'Perspective+',
    type: CT.SKILL, rarity: R.COMMON, cost: 1,
    art: '🔭',
    desc: (u) => `Reduce Tilt by 2 per 10 enemy Determination lost (min 5, max 20).${u ? '' : ' Exhaust.'}`,
    exhaust: (u) => !u,
    effect: (cs, u) => {
      const lost = cs.enemy.maxDetermination - cs.enemy.currentDetermination;
      const reduction = Math.max(5, Math.min(20, Math.floor(lost / 10) * 2));
      changeTilt(-reduction);
      if (!u) exhaustCard(cs, cs._playingCard);
    }
  },

  // ── UNCOMMON ATTACKS ──────────────────────────────────────
  diff: {
    id: 'diff', name: 'Diff', upgradedName: 'Diff+',
    type: CT.ATTACK, rarity: R.UNCOMMON, cost: 1,
    art: '📊',
    desc: (u) => `Deal ${u ? 13 : 10} Chill damage. Apply ${u ? 2 : 1} Weak.`,
    effect: (cs, u) => { dealDamage(cs.enemy, u ? 13 : 10); applyStatus(cs.enemy, S.WEAK, u ? 2 : 1); }
  },

  ez_clap: {
    id: 'ez_clap', name: 'EZ Clap', upgradedName: 'EZ Clap+',
    type: CT.ATTACK, rarity: R.UNCOMMON, cost: 1,
    art: '👏',
    desc: (u) => `Deal ${u ? 8 : 6} Chill damage. If Tilt < 50, deal ${u ? 16 : 12} instead.`,
    effect: (cs, u) => {
      const bonus = GameState.tilt < 50;
      dealDamage(cs.enemy, bonus ? (u ? 16 : 12) : (u ? 8 : 6));
    }
  },

  ratio: {
    id: 'ratio', name: 'Ratio', upgradedName: 'Ratio+',
    type: CT.ATTACK, rarity: R.UNCOMMON, cost: 2,
    art: '⚖️',
    desc: (u) => `Deal ${u ? 25 : 20} Chill damage. If this kills the enemy, reduce Tilt by ${u ? 15 : 10}.`,
    effect: (cs, u) => {
      const prevDet = cs.enemy.currentDetermination;
      dealDamage(cs.enemy, u ? 25 : 20);
      if (prevDet > 0 && cs.enemy.currentDetermination <= 0) changeTilt(-(u ? 15 : 10));
    }
  },

  vote_kick: {
    id: 'vote_kick', name: 'Vote Kick', upgradedName: 'Vote Kick+',
    type: CT.ATTACK, rarity: R.UNCOMMON, cost: 1,
    art: '🗳️',
    desc: (u) => `Deal 8 Chill damage. Apply 2 Vulnerable.${u ? '' : ' Discard 1 card.'}`,
    effect: (cs, u) => {
      dealDamage(cs.enemy, 8);
      applyStatus(cs.enemy, S.VULNERABLE, 2);
      if (!u && cs.hand.length > 0) {
        const idx = Math.floor(Math.random() * cs.hand.length);
        const card = cs.hand.splice(idx, 1)[0];
        cs.discardPile.push(card);
      }
    }
  },

  speedrun: {
    id: 'speedrun', name: 'Speedrun', upgradedName: 'Speedrun+',
    type: CT.ATTACK, rarity: R.UNCOMMON, cost: 1,
    art: '⚡',
    desc: (u) => `Deal 5 Chill damage.${u ? ' Draw 1 card.' : ''} If this kills the enemy, play again (once).`,
    effect: (cs, u) => {
      const prevDet = cs.enemy.currentDetermination;
      dealDamage(cs.enemy, 5);
      if (u) drawCards(1);
      if (prevDet > 0 && cs.enemy.currentDetermination <= 0 && !cs._speedrunReplayed) {
        cs._speedrunReplayed = true;
        dealDamage(cs.enemy, 5);
      }
    }
  },

  // ── UNCOMMON SKILLS ───────────────────────────────────────
  afk_farm: {
    id: 'afk_farm', name: 'AFK Farm', upgradedName: 'AFK Farm+',
    type: CT.SKILL, rarity: R.UNCOMMON, cost: 2,
    art: '🌾',
    desc: (u) => `Your next ${u ? 4 : 3} Attacks cost 0. Exhaust.`,
    exhaust: true,
    effect: (cs, u) => { cs.freeAttacksRemaining = (cs.freeAttacksRemaining || 0) + (u ? 4 : 3); exhaustCard(cs, cs._playingCard); }
  },

  copium_shield: {
    id: 'copium_shield', name: 'Copium Shield', upgradedName: 'Copium Shield+',
    type: CT.SKILL, rarity: R.UNCOMMON, cost: 1,
    art: '🛡️',
    desc: (u) => `Gain Block equal to your Tilt ÷ ${u ? 4 : 5} (min 4).`,
    effect: (cs, u) => { gainBlock(Math.max(4, Math.floor(GameState.tilt / (u ? 4 : 5)))); }
  },

  low_battery: {
    id: 'low_battery', name: 'Low Battery Mode', upgradedName: 'Low Battery Mode+',
    type: CT.SKILL, rarity: R.UNCOMMON, cost: 0,
    art: '🔋',
    desc: (u) => `Draw ${u ? 4 : 3} cards, then end your turn.${u ? '' : ' Exhaust.'}`,
    exhaust: (u) => !u,
    effect: (cs, u) => {
      drawCards(u ? 4 : 3);
      if (!u) exhaustCard(cs, cs._playingCard);
      cs.forceEndTurn = true;
    }
  },

  discord_call: {
    id: 'discord_call', name: 'Discord Call', upgradedName: 'Discord Call+',
    type: CT.SKILL, rarity: R.UNCOMMON, cost: 1,
    art: '📞',
    desc: (u) => `Reduce Tilt by ${u ? 8 : 5}. Gain 1 Energy.`,
    effect: (cs, u) => { changeTilt(-(u ? 8 : 5)); gainEnergy(1); }
  },

  slash_mute: {
    id: 'slash_mute', name: '/mute', upgradedName: '/mute+',
    type: CT.SKILL, rarity: R.UNCOMMON, cost: 2,
    art: '🔕',
    desc: (u) => `Apply ${u ? 4 : 3} Muted to enemy.${u ? '' : ' Exhaust.'}`,
    exhaust: (u) => !u,
    effect: (cs, u) => {
      applyStatus(cs.enemy, S.MUTED, u ? 4 : 3);
      if (!u) exhaustCard(cs, cs._playingCard);
    }
  },

  // ── UNCOMMON POWERS ───────────────────────────────────────
  chill_guy: {
    id: 'chill_guy', name: 'Chill Guy Mode', upgradedName: 'Chill Guy Mode+',
    type: CT.POWER, rarity: R.UNCOMMON, cost: 3,
    art: '😎',
    desc: (u) => `At the start of each turn, reduce Tilt by ${u ? 5 : 3}.`,
    effect: (cs, u) => { cs.powers.push({ id: 'chill_guy', tiltPerTurn: u ? 5 : 3 }); }
  },

  anchored_power: {
    id: 'anchored_power', name: 'Anchored', upgradedName: 'Anchored+',
    type: CT.POWER, rarity: R.UNCOMMON, cost: 1,
    art: '⚓',
    desc: (u) => `Block no longer resets at the start of your turn.${u ? ' Gain 4 Block.' : ''}`,
    effect: (cs, u) => { cs.blockAnchored = true; if (u) gainBlock(4); }
  },

  feed_ignored: {
    id: 'feed_ignored', name: 'Feed Ignored', upgradedName: 'Feed Ignored+',
    type: CT.POWER, rarity: R.UNCOMMON, cost: 2,
    art: '🙈',
    desc: (u) => `${u ? '40' : '30'}% chance to ignore Tilt increases.`,
    effect: (cs, u) => { cs.feedIgnoreChance = u ? 0.4 : 0.3; }
  },

  xp_boost: {
    id: 'xp_boost', name: 'XP Boost', upgradedName: 'XP Boost+',
    type: CT.POWER, rarity: R.UNCOMMON, cost: 1,
    art: '📈',
    desc: (u) => `All Attacks deal ${u ? 3 : 2} additional Chill damage.`,
    effect: (cs, u) => { cs.attackBonus = (cs.attackBonus || 0) + (u ? 3 : 2); }
  },

  // ── RARE ATTACKS ──────────────────────────────────────────
  nuclear_report: {
    id: 'nuclear_report', name: 'Nuclear Report', upgradedName: 'Nuclear Report+',
    type: CT.ATTACK, rarity: R.RARE, cost: 3,
    art: '💣',
    desc: (u) => `Deal ${u ? 45 : 35} Chill damage. Apply 3 Vulnerable.`,
    effect: (cs, u) => { dealDamage(cs.enemy, u ? 45 : 35); applyStatus(cs.enemy, S.VULNERABLE, 3); }
  },

  speedhack: {
    id: 'speedhack', name: 'Speedhack', upgradedName: 'Speedhack+',
    type: CT.ATTACK, rarity: R.RARE, cost: 1,
    art: '💻',
    desc: (u) => `Deal Chill damage equal to your current Block${u ? ' + 5' : ''}.`,
    effect: (cs, u) => { dealDamage(cs.enemy, cs.block + (u ? 5 : 0)); }
  },

  // ── RARE SKILLS ───────────────────────────────────────────
  serenity: {
    id: 'serenity', name: 'Serenity', upgradedName: 'Serenity+',
    type: CT.SKILL, rarity: R.RARE, cost: 0,
    art: '🕊️',
    desc: (u) => `Set Tilt to ${u ? 10 : 15}. Exhaust.`,
    exhaust: true,
    effect: (cs, u) => { GameState.tilt = u ? 10 : 15; exhaustCard(cs, cs._playingCard); renderGame(); }
  },

  cope_harder: {
    id: 'cope_harder', name: 'Cope Harder', upgradedName: 'Cope Harder+',
    type: CT.SKILL, rarity: R.RARE, cost: 2,
    art: '💊',
    desc: (u) => `Shuffle ${u ? 4 : 3} Breathe cards into your draw pile. Reduce Tilt by 10.`,
    effect: (cs, u) => {
      for (let i = 0; i < (u ? 4 : 3); i++) {
        const b = Object.assign({}, CARDS.breathe, { upgraded: false });
        cs.drawPile.splice(Math.floor(Math.random() * (cs.drawPile.length + 1)), 0, b);
      }
      changeTilt(-10);
    }
  },

  // ── RARE POWERS ───────────────────────────────────────────
  discord_zen: {
    id: 'discord_zen', name: 'Discord Zen', upgradedName: 'Discord Zen+',
    type: CT.POWER, rarity: R.RARE, cost: 3,
    art: '🧘',
    desc: (u) => `Immune to Burn. Tilt increases reduced by ${u ? 5 : 3} (min 1).`,
    effect: (cs, u) => { cs.burnImmune = true; cs.tiltIncreaseReduction = (cs.tiltIncreaseReduction || 0) + (u ? 5 : 3); }
  },

  carried: {
    id: 'carried', name: 'Carried', upgradedName: 'Carried+',
    type: CT.POWER, rarity: R.RARE, cost: 2,
    art: '🏋️',
    desc: (u) => `When you play a 0-cost card, deal ${u ? 5 : 3} Chill damage.`,
    effect: (cs, u) => { cs.powers.push({ id: 'carried', damage: u ? 5 : 3 }); }
  }
};

function getStartingDeck() {
  const deck = [];
  for (let i = 0; i < 4; i++) deck.push({ id: 'copium_inhale', upgraded: false });
  for (let i = 0; i < 2; i++) deck.push({ id: 'breathe', upgraded: false });
  for (let i = 0; i < 2; i++) deck.push({ id: 'headset_on', upgraded: false });
  deck.push({ id: 'skill_issue', upgraded: false });
  deck.push({ id: 'gg_wp', upgraded: false });
  return deck;
}

function getCardData(id, upgraded) {
  const base = CARDS[id];
  if (!base) return null;
  return Object.assign({}, base, { upgraded: !!upgraded });
}

function getCardsByRarity(rarity) {
  return Object.values(CARDS).filter(c => c.rarity === rarity && !['copium_inhale','breathe','headset_on','skill_issue','gg_wp'].includes(c.id));
}

const REWARD_POOL = {
  [R.COMMON]: ['reported','ping_spike','mald','noscope','clutch_play','uninstall_counter','mute_all','touch_grass','vibes_only','it_is_what','perspective'],
  [R.UNCOMMON]: ['diff','ez_clap','ratio','vote_kick','speedrun','afk_farm','copium_shield','low_battery','discord_call','slash_mute','chill_guy','anchored_power','feed_ignored','xp_boost'],
  [R.RARE]: ['nuclear_report','speedhack','serenity','cope_harder','discord_zen','carried']
};
