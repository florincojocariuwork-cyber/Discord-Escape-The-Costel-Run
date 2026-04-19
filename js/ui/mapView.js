function renderMap(root) {
  const screen = document.createElement('div');
  screen.className = 'map-screen';

  // Header
  const header = document.createElement('div');
  header.className = 'map-header';
  header.innerHTML = `
    <div class="map-title">${ACT_EMOJIS[GameState.act]} Act ${GameState.act}: ${ACT_NAMES[GameState.act]}</div>
    <div class="map-stats">
      <span>😤 Tilt: ${GameState.tilt}/${MAX_TILT}</span>
      <span>💰 ${GameState.gold}g</span>
      <span>🃏 ${GameState.deck.length} cards</span>
    </div>
  `;

  // Relic bar
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
    header.appendChild(relicBar);
  }

  screen.appendChild(header);

  // Map container
  const mapContainer = document.createElement('div');
  mapContainer.className = 'map-container';

  const mapGrid = document.createElement('div');
  mapGrid.className = 'map-grid';
  mapGrid.style.position = 'relative';

  const map = GameState.map;
  if (!map) { root.appendChild(screen); return; }

  const CELL_W = 68;
  const CELL_H = 52;
  const COLS = 6;

  // SVG for connections
  const svgNS = 'http://www.w3.org/2000/svg';
  const svgEl = document.createElementNS(svgNS, 'svg');
  svgEl.setAttribute('class', 'map-svg');
  svgEl.style.position = 'absolute';
  svgEl.style.top = '0';
  svgEl.style.left = '0';
  svgEl.style.pointerEvents = 'none';
  const totalW = COLS * CELL_W;
  const totalH = map.length * CELL_H;
  svgEl.setAttribute('width', totalW);
  svgEl.setAttribute('height', totalH);
  svgEl.setAttribute('viewBox', `0 0 ${totalW} ${totalH}`);

  // Build id → node lookup
  const nodeById = {};
  for (const row of map) {
    for (const n of row) {
      if (n) nodeById[n.id] = n;
    }
  }

  // Draw connections
  for (const row of map) {
    for (const node of row) {
      if (!node) continue;
      for (const connId of node.connections) {
        const target = nodeById[connId];
        if (!target) continue;
        const x1 = node.col * CELL_W + CELL_W / 2;
        const y1 = (map.length - 1 - node.row) * CELL_H + CELL_H / 2;
        const x2 = target.col * CELL_W + CELL_W / 2;
        const y2 = (map.length - 1 - target.row) * CELL_H + CELL_H / 2;
        const line = document.createElementNS(svgNS, 'line');
        line.setAttribute('x1', x1); line.setAttribute('y1', y1);
        line.setAttribute('x2', x2); line.setAttribute('y2', y2);
        line.setAttribute('class', node.visited ? 'map-line visited' : 'map-line');
        svgEl.appendChild(line);
      }
    }
  }

  mapGrid.style.width = totalW + 'px';
  mapGrid.style.height = totalH + 'px';

  // Draw nodes (bottom to top display order)
  const displayRows = [...map].reverse();
  displayRows.forEach((row, displayRowIdx) => {
    for (const node of row) {
      if (!node) continue;
      const nodeEl = document.createElement('div');
      const classes = ['map-node', `node-${node.type.toLowerCase()}`];
      if (node.visited) classes.push('visited');
      if (node.reachable && !node.visited) classes.push('reachable');
      nodeEl.className = classes.join(' ');

      const x = node.col * CELL_W + CELL_W / 2 - 24;
      const y = displayRowIdx * CELL_H + CELL_H / 2 - 24;
      nodeEl.style.left = x + 'px';
      nodeEl.style.top = y + 'px';

      const icon = document.createElement('div');
      icon.className = 'node-icon';
      icon.textContent = NODE_ICONS[node.type] || '?';

      const nodeLabel = document.createElement('div');
      nodeLabel.className = 'node-label';
      nodeLabel.textContent = node.type === NT.BOSS ? 'BOSS' : node.type.charAt(0) + node.type.slice(1).toLowerCase();

      nodeEl.appendChild(icon);
      nodeEl.appendChild(nodeLabel);

      if (node.reachable && !node.visited) {
        nodeEl.onclick = () => navigateToNode(node.id);
      }
      mapGrid.appendChild(nodeEl);
    }
  });

  mapGrid.appendChild(svgEl);
  mapContainer.appendChild(mapGrid);
  screen.appendChild(mapContainer);

  // Deck viewer button
  const deckBtn = makeBtn('🃏 View Deck', () => {
    GameState.screen = SCR.DECK_VIEW;
    GameState.deckViewMode = 'view';
    renderGame();
  }, 'btn-secondary');
  deckBtn.style.margin = '8px auto';
  screen.appendChild(deckBtn);

  root.appendChild(screen);
}
