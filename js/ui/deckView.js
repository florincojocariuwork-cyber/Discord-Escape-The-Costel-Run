function renderDeckView(root) {
  const mode = GameState.deckViewMode || 'view';
  const screen = document.createElement('div');
  screen.className = 'deck-view-screen';

  const titles = {
    view: '🃏 Your Deck',
    remove: '🗑️ Remove a Card',
    upgrade: '⬆️ Upgrade a Card (Shop)',
    upgrade_rest: '⬆️ Upgrade a Card (Rest)'
  };

  const h2 = document.createElement('h2');
  h2.textContent = titles[mode] || '🃏 Deck';
  screen.appendChild(h2);

  if (mode !== 'view') {
    const hint = document.createElement('p');
    hint.className = 'deck-view-hint';
    hint.textContent = mode.startsWith('upgrade') ? 'Click a card to upgrade it.' : 'Click a card to remove it.';
    screen.appendChild(hint);
  }

  const grid = document.createElement('div');
  grid.className = 'deck-grid';

  const sorted = [...GameState.deck].sort((a, b) => {
    const ca = CARDS[a.id], cb = CARDS[b.id];
    if (!ca || !cb) return 0;
    const typeOrder = { ATTACK: 0, SKILL: 1, POWER: 2 };
    return (typeOrder[ca.type] || 0) - (typeOrder[cb.type] || 0);
  });

  sorted.forEach((entry, idx) => {
    const realIdx = GameState.deck.indexOf(entry);
    const cardEl = makeCard({ id: entry.id, upgraded: entry.upgraded }, {
      disabled: mode === 'remove' && GameState.deck.length <= 1,
      onClick: mode === 'view' ? null : () => {
        if (mode === 'remove') {
          if (GameState.deck.length <= 1) return;
          if (GameState.shopInventory) GameState.gold -= GameState.shopInventory.removalPrice;
          removeCardFromDeck(realIdx);
          GameState.screen = SCR.SHOP;
          saveRun();
          renderGame();
        } else if (mode === 'upgrade' || mode === 'upgrade_rest') {
          if (entry.upgraded) return;
          if (mode === 'upgrade' && GameState.shopInventory) GameState.gold -= GameState.shopInventory.upgradePrice;
          upgradeCardInDeck(realIdx);
          GameState.screen = mode === 'upgrade' ? SCR.SHOP : SCR.REST;
          saveRun();
          renderGame();
        }
      }
    });
    if (mode !== 'view') {
      const isUpgraded = entry.upgraded && mode.startsWith('upgrade');
      if (isUpgraded) cardEl.classList.add('disabled');
    }
    grid.appendChild(cardEl);
  });

  screen.appendChild(grid);

  const backBtn = makeBtn('← Back', () => {
    if (mode === 'view') {
      GameState.screen = GameState.combat ? SCR.COMBAT : SCR.MAP;
    } else if (mode === 'remove' || mode === 'upgrade') {
      GameState.screen = SCR.SHOP;
    } else if (mode === 'upgrade_rest') {
      GameState.screen = SCR.REST;
    }
    renderGame();
  }, 'btn-secondary');
  screen.appendChild(backBtn);

  root.appendChild(screen);
}
