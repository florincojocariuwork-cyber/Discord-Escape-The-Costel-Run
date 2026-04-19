function renderReward(root) {
  const data = GameState.rewardData;
  if (!data) { GameState.screen = SCR.MAP; renderGame(); return; }

  const screen = document.createElement('div');
  screen.className = 'reward-screen';

  const title = document.createElement('h2');
  title.textContent = data.tier === 'BOSS' ? '👑 Boss Defeated!' : data.tier === 'ELITE' ? '💀 Elite Defeated!' : '⚔️ Victory!';
  screen.appendChild(title);

  const goldEl = document.createElement('div');
  goldEl.className = 'reward-gold';
  goldEl.textContent = `💰 +${data.gold} gold earned!`;
  screen.appendChild(goldEl);

  const prompt = document.createElement('div');
  prompt.className = 'reward-prompt';
  prompt.textContent = 'Choose a card to add to your deck:';
  screen.appendChild(prompt);

  const cardsRow = document.createElement('div');
  cardsRow.className = 'reward-cards-row';

  for (const item of data.cards) {
    const cardEl = makeCard({ id: item.id, upgraded: false }, {
      onClick: () => pickRewardCard(item.id)
    });
    cardsRow.appendChild(cardEl);
  }

  screen.appendChild(cardsRow);

  const skipBtn = makeBtn('Skip (No Card)', skipReward, 'btn-secondary');
  screen.appendChild(skipBtn);

  if (data.relicOffer) {
    const relicSection = document.createElement('div');
    relicSection.className = 'relic-offer';

    const relicTitle = document.createElement('div');
    relicTitle.className = 'relic-offer-title';
    relicTitle.textContent = '— OR claim a relic —';

    const relic = data.relicOffer;
    const relicEl = document.createElement('div');
    relicEl.className = 'relic-card';
    relicEl.innerHTML = `
      <div class="relic-card-art">${relic.art}</div>
      <div class="relic-card-name">${relic.name}</div>
      <div class="relic-card-desc">${relic.description}</div>
    `;
    relicEl.onclick = () => pickRewardRelic(relic.id);

    relicSection.appendChild(relicTitle);
    relicSection.appendChild(relicEl);
    screen.appendChild(relicSection);
  }

  root.appendChild(screen);
}
