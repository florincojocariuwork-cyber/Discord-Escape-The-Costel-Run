function generateReward(tier, gold) {
  let pool = [];

  if (tier === 'REGULAR') {
    pool = [
      ...shuffle(REWARD_POOL[R.COMMON]).slice(0, 2),
      ...shuffle(REWARD_POOL[R.UNCOMMON]).slice(0, 1)
    ];
  } else if (tier === 'ELITE') {
    pool = [
      ...shuffle(REWARD_POOL[R.COMMON]).slice(0, 1),
      ...shuffle(REWARD_POOL[R.UNCOMMON]).slice(0, 2)
    ];
  } else if (tier === 'BOSS') {
    pool = [
      ...shuffle(REWARD_POOL[R.UNCOMMON]).slice(0, 1),
      ...shuffle(REWARD_POOL[R.RARE]).slice(0, 2)
    ];
  }

  const cards = shuffle(pool).slice(0, CARDS_PER_REWARD).map(id => ({ id }));

  let relicOffer = null;
  if (tier === 'ELITE') {
    const ownedIds = GameState.relics.map(r => r.id);
    const available = Object.values(RELICS)
      .filter(r => !ownedIds.includes(r.id) && (r.rarity === R.COMMON || r.rarity === R.UNCOMMON));
    if (available.length) {
      relicOffer = available[Math.floor(Math.random() * available.length)];
    }
  } else if (tier === 'BOSS') {
    const ownedIds = GameState.relics.map(r => r.id);
    const bossRelics = Object.values(RELICS).filter(r => r.rarity === R.BOSS && !ownedIds.includes(r.id));
    const rareRelics = Object.values(RELICS).filter(r => r.rarity === R.RARE && !ownedIds.includes(r.id));
    const available = [...bossRelics, ...rareRelics];
    if (available.length) {
      relicOffer = available[Math.floor(Math.random() * available.length)];
    }
  }

  return { cards, gold, relicOffer, tier };
}

function pickRewardCard(cardId) {
  if (cardId) addCardToDeck(cardId, false);
  GameState.rewardData = null;
  GameState.screen = SCR.MAP;
  saveRun();
  renderGame();
}

function pickRewardRelic(relicId) {
  if (relicId && RELICS[relicId] && !GameState.relics.find(r => r.id === relicId)) {
    GameState.relics.push(RELICS[relicId]);
  }
  GameState.rewardData = null;
  GameState.screen = SCR.MAP;
  saveRun();
  renderGame();
}

function skipReward() {
  GameState.rewardData = null;
  GameState.screen = SCR.MAP;
  saveRun();
  renderGame();
}
