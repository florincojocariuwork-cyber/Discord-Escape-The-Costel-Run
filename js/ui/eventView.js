function renderEvent(root) {
  const event = GameState.currentEvent;
  if (!event) { GameState.screen = SCR.MAP; renderGame(); return; }

  const screen = document.createElement('div');
  screen.className = 'event-screen';

  const artEl = document.createElement('div');
  artEl.className = 'event-art';
  artEl.textContent = event.art;

  const title = document.createElement('h2');
  title.textContent = event.title;

  const desc = document.createElement('p');
  desc.className = 'event-desc';
  desc.textContent = event.description;

  screen.appendChild(artEl);
  screen.appendChild(title);
  screen.appendChild(desc);

  const resultDiv = document.createElement('div');
  resultDiv.className = 'event-result';
  resultDiv.style.display = 'none';

  const choicesDiv = document.createElement('div');
  choicesDiv.className = 'event-choices';

  for (const choice of event.choices) {
    const btn = document.createElement('div');
    btn.className = 'event-choice';
    btn.innerHTML = `<div class="choice-label">${choice.label}</div><div class="choice-desc">${choice.desc}</div>`;
    btn.onclick = () => {
      if (resultDiv.style.display !== 'none') return;
      const result = choice.effect(GameState);
      resultDiv.textContent = result || '';
      resultDiv.style.display = 'block';
      choicesDiv.querySelectorAll('.event-choice').forEach(c => c.style.pointerEvents = 'none');
      setTimeout(() => {
        GameState.currentEvent = null;
        GameState.screen = SCR.MAP;
        saveRun();
        renderGame();
      }, 1800);
    };
    choicesDiv.appendChild(btn);
  }

  screen.appendChild(choicesDiv);
  screen.appendChild(resultDiv);

  root.appendChild(screen);
}

function renderAlly(root) {
  const ally = GameState.currentAlly;
  if (!ally) { GameState.screen = SCR.MAP; renderGame(); return; }

  const screen = document.createElement('div');
  screen.className = 'event-screen ally-screen';

  const artEl = document.createElement('div');
  artEl.className = 'event-art';
  artEl.textContent = ally.art;

  const title = document.createElement('h2');
  title.className = 'ally-title';
  title.textContent = ally.title;

  const desc = document.createElement('p');
  desc.className = 'event-desc';
  desc.textContent = ally.description;

  screen.appendChild(artEl);
  screen.appendChild(title);
  screen.appendChild(desc);

  const resultDiv = document.createElement('div');
  resultDiv.className = 'event-result';
  resultDiv.style.display = 'none';

  const choicesDiv = document.createElement('div');
  choicesDiv.className = 'event-choices';

  for (const choice of ally.choices) {
    const btn = document.createElement('div');
    btn.className = 'event-choice ally-choice';
    btn.innerHTML = `<div class="choice-label">${choice.label}</div><div class="choice-desc">${choice.desc}</div>`;
    btn.onclick = () => {
      if (resultDiv.style.display !== 'none') return;
      const result = choice.effect(GameState);
      resultDiv.textContent = result || '';
      resultDiv.style.display = 'block';
      choicesDiv.querySelectorAll('.event-choice').forEach(c => c.style.pointerEvents = 'none');
      setTimeout(() => {
        GameState.currentAlly = null;
        GameState.screen = SCR.MAP;
        saveRun();
        renderGame();
      }, 1800);
    };
    choicesDiv.appendChild(btn);
  }

  screen.appendChild(choicesDiv);
  screen.appendChild(resultDiv);
  root.appendChild(screen);
}

function renderRest(root) {
  const screen = document.createElement('div');
  screen.className = 'event-screen rest-screen';

  const artEl = document.createElement('div');
  artEl.className = 'event-art';
  artEl.textContent = '🛋️';

  const title = document.createElement('h2');
  title.textContent = 'Rest Site';

  const desc = document.createElement('p');
  desc.className = 'event-desc';
  desc.textContent = 'Costel closes the game for a bit. What does he do?';

  const resultDiv = document.createElement('div');
  resultDiv.className = 'event-result';
  resultDiv.style.display = 'none';

  const choices = document.createElement('div');
  choices.className = 'event-choices';

  const logOffBtn = document.createElement('div');
  logOffBtn.className = 'event-choice';
  logOffBtn.innerHTML = `<div class="choice-label">📴 Log Off Early</div><div class="choice-desc">Reduce Tilt by ${TILT_HEAL_REST}.</div>`;
  logOffBtn.onclick = () => {
    changeTilt(-TILT_HEAL_REST);
    resultDiv.textContent = `-${TILT_HEAL_REST} Tilt. Breathing room.`;
    resultDiv.style.display = 'block';
    choices.querySelectorAll('.event-choice').forEach(c => c.style.pointerEvents = 'none');
    setTimeout(() => { GameState.screen = SCR.MAP; saveRun(); renderGame(); }, 1600);
  };

  const grindBtn = document.createElement('div');
  grindBtn.className = 'event-choice';
  grindBtn.innerHTML = `<div class="choice-label">⬆️ Grind</div><div class="choice-desc">Upgrade a card from your deck.</div>`;
  grindBtn.onclick = () => {
    GameState.screen = SCR.DECK_VIEW;
    GameState.deckViewMode = 'upgrade_rest';
    renderGame();
  };

  choices.appendChild(logOffBtn);
  choices.appendChild(grindBtn);

  screen.appendChild(artEl);
  screen.appendChild(title);
  screen.appendChild(desc);
  screen.appendChild(choices);
  screen.appendChild(resultDiv);
  root.appendChild(screen);
}
