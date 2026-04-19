// Central game state — single source of truth, mutated in place

const GameState = {
  screen: SCR.MENU,
  act: 1,
  floor: 0,
  gold: 100,
  tilt: STARTING_TILT,
  relics: [],
  deck: [],
  map: null,
  currentNodePath: [],
  combat: null,
  currentEvent: null,
  currentAlly: null,
  actTransitionData: null,
  shopInventory: null,
  rewardData: null,
  backupAccountUsed: false,
  bossKilled: false
};

function initGame() {
  GameState.screen = SCR.MENU;
  GameState.act = 1;
  GameState.floor = 0;
  GameState.gold = 100;
  GameState.tilt = STARTING_TILT;
  GameState.relics = [];
  GameState.deck = getStartingDeck();
  GameState.map = null;
  GameState.currentNodePath = [];
  GameState.combat = null;
  GameState.currentEvent = null;
  GameState.currentAlly = null;
  GameState.actTransitionData = null;
  GameState.shopInventory = null;
  GameState.rewardData = null;
  GameState.backupAccountUsed = false;
  GameState.bossKilled = false;
}

function startNewRun() {
  initGame();
  GameState.map = generateMap(1);
  GameState.screen = SCR.MAP;
  saveRun();
  renderGame();
}

function saveRun() {
  try {
    const save = {
      screen: GameState.screen === SCR.COMBAT ? SCR.MAP : GameState.screen,
      act: GameState.act,
      floor: GameState.floor,
      gold: GameState.gold,
      tilt: GameState.tilt,
      deck: GameState.deck,
      relics: GameState.relics.map(r => r.id),
      map: GameState.map,
      currentNodePath: GameState.currentNodePath,
      backupAccountUsed: GameState.backupAccountUsed
    };
    localStorage.setItem('costel_save', JSON.stringify(save));
  } catch(e) {}
}

function loadRun() {
  try {
    const raw = localStorage.getItem('costel_save');
    if (!raw) return false;
    const save = JSON.parse(raw);
    GameState.screen = save.screen || SCR.MAP;
    GameState.act = save.act || 1;
    GameState.floor = save.floor || 0;
    GameState.gold = save.gold || 100;
    GameState.tilt = save.tilt || STARTING_TILT;
    GameState.deck = save.deck || getStartingDeck();
    GameState.relics = (save.relics || []).map(id => RELICS[id]).filter(Boolean);
    GameState.map = save.map || generateMap(1);
    GameState.currentNodePath = save.currentNodePath || [];
    GameState.backupAccountUsed = save.backupAccountUsed || false;
    GameState.combat = null;
    GameState.currentEvent = null;
    GameState.shopInventory = null;
    GameState.rewardData = null;
    return true;
  } catch(e) {
    return false;
  }
}

function hasSave() {
  return !!localStorage.getItem('costel_save');
}

function clearSave() {
  localStorage.removeItem('costel_save');
}

function navigateToNode(nodeId) {
  const map = GameState.map;
  let node = null;
  for (const row of map) {
    for (const n of row) {
      if (n && n.id === nodeId) { node = n; break; }
    }
    if (node) break;
  }
  if (!node || !node.reachable || node.visited) return;

  node.visited = true;
  GameState.currentNodePath.push(nodeId);
  GameState.floor++;

  updateReachableNodes();
  saveRun();

  switch (node.type) {
    case NT.COMBAT:
    case NT.ELITE:
    case NT.BOSS:
      const enemyId = node.enemyId;
      startCombat(enemyId);
      break;
    case NT.SHOP:
      GameState.shopInventory = generateShop();
      GameState.screen = SCR.SHOP;
      renderGame();
      break;
    case NT.REST:
      GameState.screen = SCR.REST;
      renderGame();
      break;
    case NT.EVENT:
      GameState.currentEvent = getRandomEvent();
      GameState.screen = SCR.EVENT;
      renderGame();
      break;
    case NT.ALLY:
      GameState.currentAlly = getAllyEncounter();
      GameState.screen = SCR.ALLY;
      renderGame();
      break;
  }
}

function updateReachableNodes() {
  const map = GameState.map;
  const path = GameState.currentNodePath;

  for (const row of map) {
    for (const n of row) {
      if (n) n.reachable = false;
    }
  }

  if (path.length === 0) {
    // First row all reachable
    for (const n of map[0]) {
      if (n) n.reachable = true;
    }
    return;
  }

  const lastId = path[path.length - 1];
  let lastNode = null;
  for (const row of map) {
    for (const n of row) {
      if (n && n.id === lastId) { lastNode = n; break; }
    }
    if (lastNode) break;
  }

  if (lastNode && lastNode.connections) {
    for (const connId of lastNode.connections) {
      for (const row of map) {
        for (const n of row) {
          if (n && n.id === connId) { n.reachable = true; }
        }
      }
    }
  }
}
