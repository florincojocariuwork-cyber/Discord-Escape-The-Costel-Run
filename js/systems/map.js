// Map generation — directed acyclic graph, 12 rows per act

function generateMap(act) {
  const rows = FLOORS_PER_ACT;
  const cols = 6;
  const map = [];

  // Assign node types to each row band
  function pickType(row) {
    if (row === rows - 1) return NT.BOSS;
    if (row === rows - 2) return NT.REST;
    if (row >= rows - 4 && row < rows - 2) {
      return weighted([NT.COMBAT, NT.ELITE, NT.SHOP, NT.REST], [30, 30, 20, 20]);
    }
    if (row >= rows - 7 && row < rows - 4) {
      return weighted([NT.COMBAT, NT.ELITE, NT.EVENT, NT.ALLY], [40, 25, 20, 15]);
    }
    if (row >= 4 && row < rows - 7) {
      return weighted([NT.COMBAT, NT.ELITE, NT.SHOP, NT.EVENT], [45, 20, 20, 15]);
    }
    if (row < 4) {
      return weighted([NT.COMBAT, NT.EVENT, NT.ALLY], [75, 15, 10]);
    }
    return NT.COMBAT;
  }

  function weighted(types, weights) {
    const total = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    for (let i = 0; i < types.length; i++) {
      r -= weights[i];
      if (r <= 0) return types[i];
    }
    return types[0];
  }

  // Generate active columns per row
  const activePerRow = [];
  for (let row = 0; row < rows; row++) {
    if (row === rows - 1) {
      activePerRow.push([2]); // Boss centered
    } else {
      const count = row < 3 ? 4 : (row < rows - 3 ? Math.floor(Math.random() * 2) + 3 : 3);
      const available = [0, 1, 2, 3, 4, 5];
      const chosen = shuffle(available).slice(0, Math.min(count, 4));
      chosen.sort((a, b) => a - b);
      activePerRow.push(chosen);
    }
  }

  // Build node grid
  for (let row = 0; row < rows; row++) {
    const rowArr = new Array(cols).fill(null);
    const active = activePerRow[row];
    for (const col of active) {
      const type = pickType(row);
      const node = {
        id: `r${row}c${col}`,
        row, col, type,
        visited: false,
        reachable: row === 0,
        connections: [],
        enemyId: null,
        eventId: null
      };
      node.enemyId = assignEnemy(act, type, row, rows);
      rowArr[col] = node;
    }
    map.push(rowArr);
  }

  // Connect nodes: each node connects to 1-2 nodes in next row, no crossings
  for (let row = 0; row < rows - 1; row++) {
    const current = activePerRow[row];
    const next = activePerRow[row + 1];

    for (const col of current) {
      const node = map[row][col];
      if (!node) continue;

      // Find closest columns in next row
      const sorted = [...next].sort((a, b) => Math.abs(a - col) - Math.abs(b - col));
      const targets = sorted.slice(0, Math.min(2, sorted.length));

      for (const t of targets) {
        const target = map[row + 1][t];
        if (target) node.connections.push(target.id);
      }
      if (node.connections.length === 0 && next.length > 0) {
        node.connections.push(map[row + 1][next[0]].id);
      }
    }
  }

  return map;
}

function assignEnemy(act, type, row, totalRows) {
  const regulars = Object.values(ENEMIES).filter(e => e.act === act && e.tier === 'REGULAR');
  const elites = Object.values(ENEMIES).filter(e => e.act === act && e.tier === 'ELITE');
  const boss = Object.values(ENEMIES).find(e => e.act === act && e.tier === 'BOSS');

  if (type === NT.BOSS && boss) return boss.id;
  if (type === NT.ELITE && elites.length) return elites[Math.floor(Math.random() * elites.length)].id;
  if ((type === NT.COMBAT) && regulars.length) return regulars[Math.floor(Math.random() * regulars.length)].id;
  return null;
}

function advanceToAct(nextAct) {
  GameState.act = nextAct;
  GameState.floor = 0;
  GameState.currentNodePath = [];
  GameState.map = generateMap(nextAct);
  changeTilt(-10);
  GameState.screen = SCR.MAP;
  saveRun();
  renderGame();
}
