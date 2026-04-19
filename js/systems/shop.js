const CARD_PRICES = { [R.COMMON]: [50, 75], [R.UNCOMMON]: [100, 135], [R.RARE]: [150, 180] };
const RELIC_PRICES = [140, 175];

function generateShop() {
  const allCards = [
    ...REWARD_POOL[R.COMMON],
    ...REWARD_POOL[R.UNCOMMON],
    ...REWARD_POOL[R.RARE]
  ];
  const picked = shuffle(allCards).slice(0, 5);

  const shopCards = picked.map(id => {
    const card = CARDS[id];
    const range = CARD_PRICES[card.rarity] || CARD_PRICES[R.COMMON];
    return { id, price: rand(range[0], range[1]) };
  });

  const ownedRelicIds = GameState.relics.map(r => r.id);
  const availableRelics = Object.values(RELICS)
    .filter(r => !ownedRelicIds.includes(r.id) && r.rarity !== R.BOSS);
  const shopRelics = shuffle(availableRelics).slice(0, 2).map(r => ({
    id: r.id,
    price: rand(RELIC_PRICES[0], RELIC_PRICES[1])
  }));

  return { cards: shopCards, relics: shopRelics, removalPrice: 75, upgradePrice: 100 };
}

function buyCard(cardId, price) {
  if (GameState.gold < price) return false;
  GameState.gold -= price;
  addCardToDeck(cardId, false);
  const item = GameState.shopInventory.cards.find(c => c.id === cardId);
  if (item) item.sold = true;
  saveRun();
  renderGame();
  return true;
}

function buyRelic(relicId, price) {
  if (GameState.gold < price) return false;
  if (GameState.relics.find(r => r.id === relicId)) return false;
  GameState.gold -= price;
  GameState.relics.push(RELICS[relicId]);
  const item = GameState.shopInventory.relics.find(r => r.id === relicId);
  if (item) item.sold = true;
  saveRun();
  renderGame();
  return true;
}

function buyRemoval() {
  if (GameState.gold < GameState.shopInventory.removalPrice) return;
  if (GameState.deck.length <= 1) return;
  GameState.screen = SCR.DECK_VIEW;
  GameState.deckViewMode = 'remove';
  renderGame();
}

function buyUpgrade() {
  if (GameState.gold < GameState.shopInventory.upgradePrice) return;
  GameState.screen = SCR.DECK_VIEW;
  GameState.deckViewMode = 'upgrade';
  renderGame();
}

function leaveShop() {
  GameState.shopInventory = null;
  GameState.screen = SCR.MAP;
  renderGame();
}
