// Map generation — 6 rows per act: 2-3 fights + optional elite/event/shop + rest + boss

function generateMap(act) {
  const rows = FLOORS_PER_ACT; // 6
  const COLS = 4;
  const map = [];

  // Row structure for a short, punchy act:
  // 0: COMBAT (always — first encounter)
  // 1: COMBAT / EVENT / ALLY
  // 2: ELITE / SHOP / REST  (branching choice node)
  // 3: COMBAT / EVENT / ALLY
  // 4: REST (forced — breather before boss)
  // 5: BOSS
  function pickType(row) {
    if (row === rows - 1) return NT.BOSS;
    if (row === rows - 2) return NT.REST;
    if (row === rows - 3) return weighted([NT.COMBAT, NT.EVENT, NT.ALLY], [55, 28, 17]);
    if (row === rows - 4) return weighted([NT.ELITE, NT.SHOP, NT.REST], [35, 38, 27]);
    if (row === 1)        return weighted([NT.COMBAT, NT.EVENT, NT.ALLY], [60, 25, 15]);
    return NT.COMBAT; // row 0
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

  // Active columns per row (2-3 branches for variety)
  const activePerRow = [];
  for (let row = 0; row < rows; row++) {
    if (row === rows - 1) {
      activePerRow.push([1]); // Boss centered
    } else if (row === rows - 2) {
      activePerRow.push([0, 2]); // Two rest options
    } else {
      const count = row === 0 ? 3 : 2 + (Math.random() < 0.5 ? 1 : 0);
      const available = [0, 1, 2, 3];
      const chosen = shuffle(available).slice(0, Math.min(count, COLS));
      chosen.sort((a, b) => a - b);
      activePerRow.push(chosen);
    }
  }

  // Build node grid
  for (let row = 0; row < rows; row++) {
    const rowArr = new Array(COLS).fill(null);
    for (const col of activePerRow[row]) {
      const type = pickType(row);
      rowArr[col] = {
        id: `r${row}c${col}`,
        row, col, type,
        visited: false,
        reachable: row === 0,
        connections: [],
        enemyId: assignEnemy(act, type)
      };
    }
    map.push(rowArr);
  }

  // Connect nodes — each connects to 1-2 closest nodes in next row
  for (let row = 0; row < rows - 1; row++) {
    const current = activePerRow[row];
    const next = activePerRow[row + 1];
    for (const col of current) {
      const node = map[row][col];
      if (!node) continue;
      const sorted = [...next].sort((a, b) => Math.abs(a - col) - Math.abs(b - col));
      const targets = sorted.slice(0, Math.min(2, sorted.length));
      for (const t of targets) {
        if (map[row + 1][t]) node.connections.push(`r${row + 1}c${t}`);
      }
      if (node.connections.length === 0 && next.length > 0) {
        node.connections.push(`r${row + 1}c${next[0]}`);
      }
    }
  }

  return map;
}

function assignEnemy(act, type) {
  const regulars = Object.values(ENEMIES).filter(e => e.act === act && e.tier === 'REGULAR');
  const elites   = Object.values(ENEMIES).filter(e => e.act === act && e.tier === 'ELITE');
  const boss     = Object.values(ENEMIES).find(e => e.act === act && e.tier === 'BOSS');
  if (type === NT.BOSS   && boss)           return boss.id;
  if (type === NT.ELITE  && elites.length)  return elites[Math.floor(Math.random() * elites.length)].id;
  if (type === NT.COMBAT && regulars.length) return regulars[Math.floor(Math.random() * regulars.length)].id;
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
