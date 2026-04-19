function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildCombatDeck(deckList) {
  return deckList.map(entry => {
    const base = CARDS[entry.id];
    if (!base) return null;
    return Object.assign({}, base, { upgraded: entry.upgraded, _instanceId: Math.random().toString(36).slice(2) });
  }).filter(Boolean);
}

function initDrawPile(cs) {
  cs.drawPile = shuffle(buildCombatDeck(GameState.deck));
  cs.hand = [];
  cs.discardPile = [];
  cs.exhaustPile = [];
}

function drawCards(n) {
  const cs = GameState.combat;
  if (!cs) return;
  for (let i = 0; i < n; i++) {
    if (cs.drawPile.length === 0) {
      if (cs.discardPile.length === 0) break;
      cs.drawPile = shuffle(cs.discardPile);
      cs.discardPile = [];
      addCombatLog('Shuffled discard into draw pile.');
    }
    if (cs.drawPile.length > 0) {
      cs.hand.push(cs.drawPile.shift());
      triggerRelics('onDraw', { card: cs.hand[cs.hand.length - 1] });
    }
  }
}

function discardHand() {
  const cs = GameState.combat;
  while (cs.hand.length > 0) {
    cs.discardPile.push(cs.hand.shift());
  }
}

function exhaustCard(cs, card) {
  if (!card) return;
  const idx = cs.hand.indexOf(card);
  if (idx !== -1) cs.hand.splice(idx, 1);
  cs.exhaustPile.push(card);
}

function addCardToDeck(cardId, upgraded) {
  GameState.deck.push({ id: cardId, upgraded: !!upgraded });
}

function removeCardFromDeck(deckIndex) {
  GameState.deck.splice(deckIndex, 1);
}

function upgradeCardInDeck(deckIndex) {
  if (GameState.deck[deckIndex]) {
    GameState.deck[deckIndex].upgraded = true;
  }
}
