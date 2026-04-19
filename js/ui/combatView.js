function renderCombat(root) {
  const cs = GameState.combat;
  if (!cs) return;

  const screen = document.createElement('div');
  screen.className = 'combat-screen';

  // Top: Tilt bar
  const tiltBar = makeTiltBar(GameState.tilt, MAX_TILT);
  screen.appendChild(tiltBar);

  // Main combat area
  const arena = document.createElement('div');
  arena.className = 'combat-arena';

  // Left: Costel panel
  const costelPanel = document.createElement('div');
  costelPanel.className = 'costel-panel';

  const costelArt = document.createElement('div');
  costelArt.className = 'costel-art';
  costelArt.textContent = '🧑‍💻';

  const costelName = document.createElement('div');
  costelName.className = 'costel-name';
  costelName.textContent = 'Costel';

  const blockDisplay = document.createElement('div');
  blockDisplay.className = 'block-display';
  blockDisplay.innerHTML = cs.block > 0 ? `🛡️ <b>${cs.block}</b>` : '🛡️ 0';

  const energyDisplay = document.createElement('div');
  energyDisplay.className = 'energy-display';
  let energyStr = '';
  for (let i = 0; i < cs.baseEnergy; i++) energyStr += i < cs.energy ? '⚡' : '○';
  energyDisplay.innerHTML = `Energy: <b>${cs.energy}/${cs.baseEnergy}</b>`;

  const playerStatuses = makeStatusBadges(cs.playerStatuses);
  playerStatuses.classList.add('player-statuses');

  // Powers
  if (cs.powers.length > 0) {
    const powersDiv = document.createElement('div');
    powersDiv.className = 'active-powers';
    for (const p of cs.powers) {
      const pspan = document.createElement('div');
      pspan.className = 'power-badge';
      pspan.textContent = `⚡ ${CARDS[p.id] ? CARDS[p.id].name : p.id}`;
      powersDiv.appendChild(pspan);
    }
    costelPanel.appendChild(powersDiv);
  }

  costelPanel.appendChild(costelArt);
  costelPanel.appendChild(costelName);
  costelPanel.appendChild(blockDisplay);
  costelPanel.appendChild(energyDisplay);
  costelPanel.appendChild(playerStatuses);

  // Center: combat log
  const centerPanel = document.createElement('div');
  centerPanel.className = 'center-panel';

  const actLabel = document.createElement('div');
  actLabel.className = 'act-label';
  actLabel.textContent = `${ACT_EMOJIS[GameState.act]} Act ${GameState.act}: ${ACT_NAMES[GameState.act]}`;
  centerPanel.appendChild(actLabel);

  const logDiv = document.createElement('div');
  logDiv.className = 'combat-log';
  for (const line of cs.combatLog) {
    const p = document.createElement('p');
    p.textContent = line;
    logDiv.appendChild(p);
  }
  centerPanel.appendChild(logDiv);

  // Deck / Discard counters
  const deckCounters = document.createElement('div');
  deckCounters.className = 'deck-counters';
  deckCounters.innerHTML = `
    <span class="deck-count" title="Draw pile">🃏 ${cs.drawPile.length}</span>
    <span class="deck-count" title="Discard pile">♻️ ${cs.discardPile.length}</span>
    <span class="deck-count" title="Exhausted">🔥 ${cs.exhaustPile.length}</span>
  `;
  deckCounters.querySelector('[title="Draw pile"]').onclick = () => {
    GameState.screen = SCR.DECK_VIEW;
    GameState.deckViewMode = 'view';
    renderGame();
  };
  centerPanel.appendChild(deckCounters);

  // Right: Enemy panel
  const enemyPanel = document.createElement('div');
  enemyPanel.className = 'enemy-panel';
  const enemy = cs.enemy;

  const intentDisplay = document.createElement('div');
  intentDisplay.className = 'enemy-intent';
  const intent = getEnemyIntent(cs);
  if (intent) {
    intentDisplay.innerHTML = `<span class="intent-icon">${intent.icon}</span><span class="intent-label">${intent.label}</span>`;
  }

  const enemyArt = document.createElement('div');
  enemyArt.className = 'enemy-art';
  enemyArt.textContent = enemy.art;

  const enemyName = document.createElement('div');
  enemyName.className = 'enemy-name';
  enemyName.textContent = enemy.name;
  if (enemy.inPhase2) enemyName.innerHTML += ' <span class="phase2-badge">PHASE 2</span>';

  const enemyBlock = document.createElement('div');
  enemyBlock.className = 'enemy-block';
  if (enemy.block > 0) enemyBlock.innerHTML = `🛡️ <b>${enemy.block}</b>`;

  const detBar = makeDetBar(enemy.currentDetermination, enemy.maxDetermination);

  const enemyStatuses = makeStatusBadges(enemy.statuses);

  const loreDiv = document.createElement('div');
  loreDiv.className = 'enemy-lore';
  loreDiv.textContent = enemy.lore || '';

  enemyPanel.appendChild(intentDisplay);
  enemyPanel.appendChild(enemyArt);
  enemyPanel.appendChild(enemyName);
  enemyPanel.appendChild(enemyBlock);
  enemyPanel.appendChild(detBar);
  enemyPanel.appendChild(enemyStatuses);
  enemyPanel.appendChild(loreDiv);

  arena.appendChild(costelPanel);
  arena.appendChild(centerPanel);
  arena.appendChild(enemyPanel);
  screen.appendChild(arena);

  // Hand
  const handArea = document.createElement('div');
  handArea.className = 'hand-area';

  const handRow = document.createElement('div');
  handRow.className = 'hand-row';

  cs.hand.forEach((card, idx) => {
    const isPlayable = cs.energy >= card.cost || (cs.freeFirstCard && !cs.freeFirstCardUsed) || (card.type === CT.ATTACK && cs.freeAttacksRemaining > 0);
    const cardEl = makeCard({ id: card.id, upgraded: card.upgraded }, {
      playable: isPlayable,
      onClick: () => { if (!cs.combatOver) playCard(idx); }
    });
    cardEl.style.setProperty('--hand-idx', idx);
    handRow.appendChild(cardEl);
  });

  const endTurnBtn = makeBtn('End Turn ▶', endPlayerTurn, 'btn-end-turn');
  if (cs.combatOver) endTurnBtn.disabled = true;

  handArea.appendChild(handRow);
  handArea.appendChild(endTurnBtn);
  screen.appendChild(handArea);

  // Relics bar
  if (GameState.relics.length > 0) {
    const relicBar = document.createElement('div');
    relicBar.className = 'relic-bar';
    for (const relic of GameState.relics) {
      const r = document.createElement('div');
      r.className = 'relic-icon';
      r.textContent = relic.art;
      r.title = `${relic.name}: ${relic.description}`;
      relicBar.appendChild(r);
    }
    screen.insertBefore(relicBar, screen.firstChild);
  }

  root.appendChild(screen);
}
