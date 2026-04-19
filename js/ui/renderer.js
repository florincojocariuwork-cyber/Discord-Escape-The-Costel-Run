function renderGame() {
  const root = document.getElementById('game-root');
  if (!root) return;
  root.innerHTML = '';

  switch (GameState.screen) {
    case SCR.MENU:          renderMenu(root); break;
    case SCR.MAP:           renderMap(root); break;
    case SCR.COMBAT:        renderCombat(root); break;
    case SCR.REWARD:        renderReward(root); break;
    case SCR.SHOP:          renderShop(root); break;
    case SCR.EVENT:         renderEvent(root); break;
    case SCR.ALLY:          renderAlly(root); break;
    case SCR.REST:          renderRest(root); break;
    case SCR.GAME_OVER:     renderGameOver(root); break;
    case SCR.VICTORY:       renderVictory(root); break;
    case SCR.ACT_TRANSITION: renderActTransition(root); break;
    case SCR.DECK_VIEW:     renderDeckView(root); break;
  }
}

function makeBtn(text, onClick, cls) {
  const btn = document.createElement('button');
  btn.className = 'btn ' + (cls || '');
  btn.innerHTML = text;
  btn.onclick = onClick;
  return btn;
}

function makeCard(cardEntry, opts) {
  opts = opts || {};
  const { id, upgraded } = cardEntry;
  const card = getCardData(id, upgraded);
  if (!card) return document.createElement('div');

  const el = document.createElement('div');
  el.className = `card card-${card.rarity.toLowerCase()} card-${card.type.toLowerCase()}`;
  if (opts.selected) el.classList.add('selected');
  if (opts.disabled) el.classList.add('disabled');
  if (opts.playable === false) el.classList.add('unplayable');

  const costEl = document.createElement('div');
  costEl.className = 'card-cost';
  costEl.textContent = card.cost;

  const artEl = document.createElement('div');
  artEl.className = 'card-art';
  artEl.textContent = card.art;

  const nameEl = document.createElement('div');
  nameEl.className = 'card-name';
  nameEl.textContent = upgraded ? (card.upgradedName || card.name + '+') : card.name;

  const descEl = document.createElement('div');
  descEl.className = 'card-desc';
  descEl.textContent = card.desc(upgraded);

  const typeEl = document.createElement('div');
  typeEl.className = 'card-type';
  typeEl.textContent = card.type;

  el.appendChild(costEl);
  el.appendChild(artEl);
  el.appendChild(nameEl);
  el.appendChild(descEl);
  el.appendChild(typeEl);

  if (opts.onClick) el.onclick = opts.onClick;
  return el;
}

function makeTiltBar(tilt, maxTilt) {
  const pct = (tilt / maxTilt) * 100;
  let cls = 'tilt-low';
  if (pct >= 70) cls = 'tilt-high';
  else if (pct >= 40) cls = 'tilt-mid';

  const wrap = document.createElement('div');
  wrap.className = 'tilt-bar-wrap';

  const label = document.createElement('div');
  label.className = 'tilt-label';
  label.innerHTML = `😤 TILT: ${tilt}/${maxTilt}`;

  const barOuter = document.createElement('div');
  barOuter.className = 'tilt-bar-outer';

  const barInner = document.createElement('div');
  barInner.className = `tilt-bar-inner ${cls}`;
  barInner.style.width = pct + '%';

  barOuter.appendChild(barInner);
  wrap.appendChild(label);
  wrap.appendChild(barOuter);
  if (pct >= 70) wrap.classList.add('tilt-shake');
  return wrap;
}

function makeDetBar(current, max) {
  const pct = (current / max) * 100;
  const wrap = document.createElement('div');
  wrap.className = 'det-bar-wrap';
  const barOuter = document.createElement('div');
  barOuter.className = 'det-bar-outer';
  const barInner = document.createElement('div');
  barInner.className = 'det-bar-inner';
  barInner.style.width = pct + '%';
  barOuter.appendChild(barInner);
  const label = document.createElement('div');
  label.className = 'det-label';
  label.textContent = `${current}/${max}`;
  wrap.appendChild(barOuter);
  wrap.appendChild(label);
  return wrap;
}

function makeStatusBadges(statuses) {
  const wrap = document.createElement('div');
  wrap.className = 'status-badges';
  const icons = { [S.VULNERABLE]: '💥', [S.WEAK]: '🌧️', [S.BURN]: '🔥', [S.MUTED]: '🔕' };
  for (const [key, val] of Object.entries(statuses)) {
    if (val > 0) {
      const badge = document.createElement('span');
      badge.className = 'status-badge';
      badge.textContent = `${icons[key] || '?'} ${val}`;
      badge.title = key;
      wrap.appendChild(badge);
    }
  }
  return wrap;
}
