function renderShop(root) {
  const inv = GameState.shopInventory;
  if (!inv) { GameState.screen = SCR.MAP; renderGame(); return; }

  const screen = document.createElement('div');
  screen.className = 'shop-screen';

  const header = document.createElement('div');
  header.className = 'shop-header';
  header.innerHTML = `<h2>🛒 Discord Store</h2><div class="gold-display">💰 ${GameState.gold}g</div>`;
  screen.appendChild(header);

  const desc = document.createElement('p');
  desc.className = 'shop-desc';
  desc.textContent = '"Cumpără ceva sau pleacă, bă." — shopkeeper';
  screen.appendChild(desc);

  // Cards for sale
  const cardsSection = document.createElement('div');
  cardsSection.className = 'shop-section';
  const cardsTitle = document.createElement('h3');
  cardsTitle.textContent = '🃏 Cards';
  cardsSection.appendChild(cardsTitle);

  const cardsRow = document.createElement('div');
  cardsRow.className = 'shop-cards-row';

  for (const item of inv.cards) {
    const wrap = document.createElement('div');
    wrap.className = 'shop-item-wrap';

    if (item.sold) {
      wrap.classList.add('sold');
      wrap.innerHTML = '<div class="sold-label">SOLD</div>';
    } else {
      const canAfford = GameState.gold >= item.price;
      const cardEl = makeCard({ id: item.id, upgraded: false }, {
        disabled: !canAfford,
        onClick: () => buyCard(item.id, item.price)
      });
      const priceTag = document.createElement('div');
      priceTag.className = `price-tag ${canAfford ? '' : 'cant-afford'}`;
      priceTag.textContent = `💰 ${item.price}g`;
      wrap.appendChild(cardEl);
      wrap.appendChild(priceTag);
    }

    cardsRow.appendChild(wrap);
  }
  cardsSection.appendChild(cardsRow);
  screen.appendChild(cardsSection);

  // Relics for sale
  const relicsSection = document.createElement('div');
  relicsSection.className = 'shop-section';
  const relicsTitle = document.createElement('h3');
  relicsTitle.textContent = '✨ Relics';
  relicsSection.appendChild(relicsTitle);

  const relicsRow = document.createElement('div');
  relicsRow.className = 'shop-relics-row';

  for (const item of inv.relics) {
    const relic = RELICS[item.id];
    if (!relic) continue;
    const wrap = document.createElement('div');
    wrap.className = 'shop-item-wrap';

    if (item.sold) {
      wrap.classList.add('sold');
      wrap.innerHTML = '<div class="sold-label">SOLD</div>';
    } else {
      const canAfford = GameState.gold >= item.price;
      const relicEl = document.createElement('div');
      relicEl.className = `relic-card ${canAfford ? '' : 'cant-afford'}`;
      relicEl.innerHTML = `
        <div class="relic-card-art">${relic.art}</div>
        <div class="relic-card-name">${relic.name}</div>
        <div class="relic-card-desc">${relic.description}</div>
      `;
      relicEl.onclick = () => buyRelic(item.id, item.price);
      const priceTag = document.createElement('div');
      priceTag.className = `price-tag ${canAfford ? '' : 'cant-afford'}`;
      priceTag.textContent = `💰 ${item.price}g`;
      wrap.appendChild(relicEl);
      wrap.appendChild(priceTag);
    }
    relicsRow.appendChild(wrap);
  }
  relicsSection.appendChild(relicsRow);
  screen.appendChild(relicsSection);

  // Services
  const services = document.createElement('div');
  services.className = 'shop-services';
  const servTitle = document.createElement('h3');
  servTitle.textContent = '🔧 Services';
  services.appendChild(servTitle);

  const remBtn = makeBtn(`🗑️ Remove Card (${inv.removalPrice}g)`, buyRemoval,
    GameState.gold < inv.removalPrice ? 'btn-secondary disabled' : 'btn-secondary');
  const upgBtn = makeBtn(`⬆️ Upgrade Card (${inv.upgradePrice}g)`, buyUpgrade,
    GameState.gold < inv.upgradePrice ? 'btn-secondary disabled' : 'btn-secondary');

  services.appendChild(remBtn);
  services.appendChild(upgBtn);
  screen.appendChild(services);

  const leaveBtn = makeBtn('🚪 Leave Shop', leaveShop, 'btn-primary');
  screen.appendChild(leaveBtn);

  root.appendChild(screen);
}
