function renderMap(root) {
  const screen = document.createElement('div');
  screen.className = 'map-screen';

  // Header
  const header = document.createElement('div');
  header.className = 'map-header';
  header.innerHTML = `
    <div class="map-title">${ACT_EMOJIS[GameState.act]} Act ${GameState.act}: ${ACT_NAMES[GameState.act]}</div>
    <div class="map-stats">
      <span>😤 ${GameState.tilt}/${MAX_TILT}</span>
      <span>💰 ${GameState.gold}g</span>
      <span>🃏 ${GameState.deck.length}</span>
    </div>
  `;

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

  const map = GameState.map;
  if (!map) { root.appendChild(screen); return; }

  // Responsive cell sizing — fill available space
  const COLS = 4;
  const isMobile = window.innerWidth <= 600;
  const availW = window.innerWidth - (isMobile ? 16 : 48);
  const headerH = isMobile ? 90 : 110;
  const footerH = 52;
  const availH = window.innerHeight - headerH - footerH;

  const CELL_W = Math.floor(Math.min(availW, 560) / COLS);
  const CELL_H = Math.max(60, Math.floor(availH / map.length));
  const NODE_SIZE = Math.min(52, Math.floor(CELL_W * 0.68));
  const NODE_HALF = Math.floor(NODE_SIZE / 2);

  const totalW = COLS * CELL_W;
  const totalH = map.length * CELL_H;

  const mapContainer = document.createElement('div');
  mapContainer.className = 'map-container';

  const mapGrid = document.createElement('div');
  mapGrid.className = 'map-grid';
  mapGrid.style.cssText = `position:relative; width:${totalW}px; height:${totalH}px;`;

  // SVG connections
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('class', 'map-svg');
  svg.setAttribute('width', totalW);
  svg.setAttribute('height', totalH);
  svg.setAttribute('viewBox', `0 0 ${totalW} ${totalH}`);
  svg.style.cssText = 'position:absolute;top:0;left:0;pointer-events:none;';

  const nodeById = {};
  for (const row of map) for (const n of row) { if (n) nodeById[n.id] = n; }

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
        svg.appendChild(line);
      }
    }
  }

  // Draw nodes
  const displayRows = [...map].reverse();
  displayRows.forEach((row, displayRowIdx) => {
    for (const node of row) {
      if (!node) continue;
      const nodeEl = document.createElement('div');
      const classes = ['map-node', `node-${node.type.toLowerCase()}`];
      if (node.visited) classes.push('visited');
      if (node.reachable && !node.visited) classes.push('reachable');
      nodeEl.className = classes.join(' ');

      const cx = node.col * CELL_W + CELL_W / 2;
      const cy = displayRowIdx * CELL_H + CELL_H / 2;
      nodeEl.style.cssText = `left:${cx - NODE_HALF}px; top:${cy - NODE_HALF}px; width:${NODE_SIZE}px; height:${NODE_SIZE}px;`;

      const iconSize = Math.max(14, Math.floor(NODE_SIZE * 0.42));
      const labelSize = Math.max(7, Math.floor(NODE_SIZE * 0.16));

      nodeEl.innerHTML = `
        <div class="node-icon" style="font-size:${iconSize}px">${NODE_ICONS[node.type] || '?'}</div>
        <div class="node-label" style="font-size:${labelSize}px">${node.type === NT.BOSS ? 'BOSS' : node.type.charAt(0) + node.type.slice(1).toLowerCase()}</div>
      `;

      if (node.reachable && !node.visited) {
        nodeEl.onclick = () => navigateToNode(node.id);
      }
      mapGrid.appendChild(nodeEl);
    }
  });

  mapGrid.appendChild(svg);
  mapContainer.appendChild(mapGrid);
  screen.appendChild(mapContainer);

  const deckBtn = makeBtn('🃏 Deck', () => {
    GameState.screen = SCR.DECK_VIEW;
    GameState.deckViewMode = 'view';
    renderGame();
  }, 'btn-secondary btn-small');
  deckBtn.style.cssText = 'display:block; margin:6px auto;';
  screen.appendChild(deckBtn);

  root.appendChild(screen);
}
