const MAX_TILT = 100;
const STARTING_TILT = 20;
const MAX_ENERGY = 3;
const HAND_SIZE = 5;
const CARDS_PER_REWARD = 3;
const ACT_COUNT = 3;
const FLOORS_PER_ACT = 12;
const BURN_TILT_PER_STACK = 5;

const NT = {
  COMBAT: 'COMBAT',
  ELITE: 'ELITE',
  BOSS: 'BOSS',
  SHOP: 'SHOP',
  REST: 'REST',
  EVENT: 'EVENT',
  ALLY: 'ALLY'
};

const CT = {
  ATTACK: 'ATTACK',
  SKILL: 'SKILL',
  POWER: 'POWER'
};

const R = {
  COMMON: 'COMMON',
  UNCOMMON: 'UNCOMMON',
  RARE: 'RARE',
  BOSS: 'BOSS'
};

const S = {
  VULNERABLE: 'VULNERABLE',
  WEAK: 'WEAK',
  BURN: 'BURN',
  MUTED: 'MUTED'
};

const SCR = {
  MENU: 'MENU',
  MAP: 'MAP',
  COMBAT: 'COMBAT',
  REWARD: 'REWARD',
  SHOP: 'SHOP',
  EVENT: 'EVENT',
  REST: 'REST',
  GAME_OVER: 'GAME_OVER',
  VICTORY: 'VICTORY',
  ALLY: 'ALLY',
  ACT_TRANSITION: 'ACT_TRANSITION',
  DECK_VIEW: 'DECK_VIEW'
};

const NODE_ICONS = {
  [NT.COMBAT]: '⚔️',
  [NT.ELITE]: '💀',
  [NT.BOSS]: '👑',
  [NT.SHOP]: '🛒',
  [NT.REST]: '🛋️',
  [NT.EVENT]: '❓',
  [NT.ALLY]: '🤝'
};

const ACT_NAMES = {
  1: 'RV There Yet?',
  2: 'Counter-Strike 2',
  3: 'League of Legends — ARAM'
};

const ACT_EMOJIS = {
  1: '🚐',
  2: '🔫',
  3: '⚔️'
};
