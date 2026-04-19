function renderMenu(root) {
  const screen = document.createElement('div');
  screen.className = 'menu-screen';

  const titleArea = document.createElement('div');
  titleArea.className = 'menu-title-area';

  const art = document.createElement('div');
  art.className = 'menu-art';
  art.textContent = '🧑‍💻';

  const title = document.createElement('h1');
  title.className = 'menu-title';
  title.textContent = "Costel's Discord Escape";

  const subtitle = document.createElement('div');
  subtitle.className = 'menu-subtitle';
  subtitle.textContent = 'A roguelike about not tilting';

  const discord = document.createElement('div');
  discord.className = 'menu-discord-bar';
  discord.innerHTML = `
    <span class="discord-dot"></span>
    <span>Costel — Playing Games</span>
    <span class="discord-voice">🔊 Gaming with the boys</span>
  `;

  titleArea.appendChild(art);
  titleArea.appendChild(title);
  titleArea.appendChild(subtitle);
  titleArea.appendChild(discord);
  screen.appendChild(titleArea);

  const btnArea = document.createElement('div');
  btnArea.className = 'menu-btns';

  const newBtn = makeBtn('🎮 New Run', () => {
    clearSave();
    startNewRun();
  }, 'btn-primary btn-large');

  btnArea.appendChild(newBtn);

  if (hasSave()) {
    const contBtn = makeBtn('▶️ Continue', () => {
      if (loadRun()) renderGame();
      else startNewRun();
    }, 'btn-secondary btn-large');
    btnArea.appendChild(contBtn);
  }

  const howBtn = makeBtn('❓ How to Play', showHowToPlay, 'btn-secondary');
  btnArea.appendChild(howBtn);

  screen.appendChild(btnArea);

  const footer = document.createElement('div');
  footer.className = 'menu-footer';
  footer.innerHTML = `
    <div>Acts: 🚐 RV There Yet? → 🔫 CS2 → ⚔️ LoL ARAM</div>
    <div class="footer-tip">Don't tilt. Don't leave Discord. Win.</div>
  `;
  screen.appendChild(footer);

  root.appendChild(screen);
}

function showHowToPlay() {
  const overlay = document.createElement('div');
  overlay.className = 'how-to-overlay';
  overlay.innerHTML = `
    <div class="how-to-box">
      <h2>How to Play</h2>
      <ul>
        <li>😤 <b>Tilt</b> is your health. It goes up when enemies attack. Hit 100 = game over.</li>
        <li>⚡ <b>Energy</b> resets to 3 each turn. Spend it to play cards.</li>
        <li>⚔️ <b>Attack cards</b> reduce enemy Determination (their HP).</li>
        <li>🌬️ <b>Skill cards</b> reduce Tilt, gain Block, or draw cards.</li>
        <li>💪 <b>Power cards</b> give permanent combat buffs.</li>
        <li>🛡️ <b>Block</b> absorbs Tilt increases. Resets each turn (unless Anchored).</li>
        <li>🗺️ Navigate the map. Fight enemies, visit shops, rest, find events.</li>
        <li>👑 Defeat all 3 act bosses to win!</li>
      </ul>
      <div style="margin-top: 16px; font-size: 13px; color: var(--text-muted);">
        <b>Status Effects:</b> 💥 Vulnerable (takes more damage) | 🌧️ Weak (deals less) | 🔥 Burn (+tilt each turn) | 🔕 Muted (skips enemy action)
      </div>
      <button class="btn btn-primary" onclick="this.parentElement.parentElement.remove()">Got it!</button>
    </div>
  `;
  document.getElementById('game-root').appendChild(overlay);
}

function renderGameOver(root) {
  const cs = GameState.combat;
  const loseDialog = cs ? cs.loseDialog : 'Costel a parasit Discord-ul...';

  const screen = document.createElement('div');
  screen.className = 'gameover-screen';

  screen.innerHTML = `
    <div class="gameover-art">😵‍💫</div>
    <h1 class="gameover-title">TILTED</h1>
    <div class="gameover-sub">Costel a parasit Discord-ul.</div>
    <div class="gameover-dialog">${loseDialog}</div>
    <div class="gameover-stats">
      <div>Act reached: ${GameState.act}</div>
      <div>Gold: 💰${GameState.gold}</div>
      <div>Deck size: 🃏${GameState.deck.length}</div>
    </div>
  `;

  const retryBtn = makeBtn('🔄 Try Again', () => { clearSave(); startNewRun(); }, 'btn-primary btn-large');
  const menuBtn = makeBtn('🏠 Menu', () => { clearSave(); GameState.screen = SCR.MENU; renderGame(); }, 'btn-secondary');

  screen.appendChild(retryBtn);
  screen.appendChild(menuBtn);
  root.appendChild(screen);
}

function renderVictory(root) {
  const screen = document.createElement('div');
  screen.className = 'victory-screen';

  screen.innerHTML = `
    <div class="victory-art">🏆</div>
    <h1 class="victory-title">COSTEL A CÂȘTIGAT!</h1>
    <div class="victory-quote">"Bravo coaie, nu credeam că poți."</div>
    <div class="victory-sub">— Bibitz, după ce a pierdut</div>
    <div class="victory-acts">
      <span>🚐 RV There Yet? ✅</span>
      <span>🔫 CS2 ✅</span>
      <span>⚔️ LoL ARAM ✅</span>
    </div>
    <div class="victory-message">He didn't tilt. He didn't leave Discord.<br>He played every game to the end.<br><b>GG WP, Costel.</b></div>
  `;

  const menuBtn = makeBtn('🏠 Back to Menu', () => { clearSave(); GameState.screen = SCR.MENU; renderGame(); }, 'btn-primary btn-large');
  screen.appendChild(menuBtn);
  root.appendChild(screen);
}

function renderActTransition(root) {
  const data = GameState.actTransitionData;
  if (!data) { advanceToAct(2); return; }

  const screen = document.createElement('div');
  screen.className = 'act-transition-screen';

  const actNames = { 1: 'RV There Yet?', 2: 'CS2', 3: 'League of Legends ARAM' };
  const actEmojis = { 1: '🚐', 2: '🔫', 3: '⚔️' };

  screen.innerHTML = `
    <div class="transition-act-badge">${actEmojis[data.act]} Act ${data.act} Complete!</div>
    <div class="transition-boss">👑 ${data.bossName} has been defeated!</div>
    <div class="transition-dialog">"${data.bossDialog.replace(/^"|"$/g, '')}"</div>
    <div class="transition-next">Next: ${actEmojis[data.nextAct]} Act ${data.nextAct} — ${actNames[data.nextAct]}</div>
    <div class="transition-tilt-heal">😌 Tilt reduced by 10 (breathing room)</div>
  `;

  // Pick a relic
  const ownedIds = GameState.relics.map(r => r.id);
  const relicPool = Object.values(RELICS).filter(r => !ownedIds.includes(r.id) && r.rarity !== R.BOSS);
  const relicChoices = shuffle(relicPool).slice(0, 3);

  if (relicChoices.length > 0) {
    const relicTitle = document.createElement('div');
    relicTitle.className = 'transition-relic-title';
    relicTitle.textContent = '✨ Choose a Relic:';
    screen.appendChild(relicTitle);

    const relicRow = document.createElement('div');
    relicRow.className = 'transition-relic-row';

    for (const relic of relicChoices) {
      const relicEl = document.createElement('div');
      relicEl.className = 'relic-card transition-relic';
      relicEl.innerHTML = `
        <div class="relic-card-art">${relic.art}</div>
        <div class="relic-card-name">${relic.name}</div>
        <div class="relic-card-desc">${relic.description}</div>
      `;
      relicEl.onclick = () => {
        GameState.relics.push(relic);
        GameState.actTransitionData = null;
        advanceToAct(data.nextAct);
      };
      relicRow.appendChild(relicEl);
    }
    screen.appendChild(relicRow);
  } else {
    const continueBtn = makeBtn(`Continue to Act ${data.nextAct} →`, () => {
      GameState.actTransitionData = null;
      advanceToAct(data.nextAct);
    }, 'btn-primary btn-large');
    screen.appendChild(continueBtn);
  }

  root.appendChild(screen);
}
