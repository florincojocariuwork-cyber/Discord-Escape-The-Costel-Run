// ── Combat helpers (used by cards.js and enemies.js effect functions) ──────

function dealDamage(enemy, baseDamage, skipVulnCheck) {
  const cs = GameState.combat;
  let dmg = baseDamage + (cs.attackBonus || 0);

  if (!skipVulnCheck && (enemy.statuses[S.VULNERABLE] || 0) > 0) {
    dmg = Math.floor(dmg * 1.5);
  }

  if (enemy.block > 0) {
    const blocked = Math.min(enemy.block, dmg);
    enemy.block -= blocked;
    dmg -= blocked;
  }

  enemy.currentDetermination = Math.max(0, enemy.currentDetermination - dmg);
  addCombatLog(`⚔️ Dealt ${dmg} Chill damage. (${enemy.name}: ${enemy.currentDetermination}/${enemy.maxDetermination})`);
}

function changeTilt(delta) {
  if (delta > 0) {
    const cs = GameState.combat;
    const payload = { amount: delta };

    triggerRelics('onTiltIncrease', payload);

    if (payload.capAt !== undefined) {
      GameState.tilt = payload.capAt;
      return;
    }

    if (cs) {
      if (cs.feedIgnoreChance && Math.random() < cs.feedIgnoreChance) {
        addCombatLog('🙈 Tilt increase ignored! (Feed Ignored)');
        return;
      }
      payload.amount = Math.max(1, payload.amount - (cs.tiltIncreaseReduction || 0));
    }

    GameState.tilt = Math.min(MAX_TILT, GameState.tilt + payload.amount);
  } else {
    GameState.tilt = Math.max(0, GameState.tilt + delta);
  }
}

function gainBlock(amount) {
  GameState.combat.block = (GameState.combat.block || 0) + amount;
}

function gainEnemyBlock(enemy, amount) {
  enemy.block = (enemy.block || 0) + amount;
}

function gainEnergy(amount) {
  GameState.combat.energy += amount;
}

function applyStatus(target, status, stacks) {
  if (target.isPlayer) {
    const cs = GameState.combat;
    if (!cs) return;
    if (status === S.BURN && cs.burnImmune) return;
    cs.playerStatuses[status] = (cs.playerStatuses[status] || 0) + stacks;
    addCombatLog(`💊 Applied ${stacks} ${status} to Costel.`);
  } else {
    target.statuses[status] = (target.statuses[status] || 0) + stacks;
    addCombatLog(`💊 Applied ${stacks} ${status} to ${target.name}.`);
  }
}

function addCombatLog(msg) {
  const cs = GameState.combat;
  if (!cs) return;
  cs.combatLog.unshift(msg);
  if (cs.combatLog.length > 8) cs.combatLog.pop();
}

// ── Combat lifecycle ────────────────────────────────────────────────────────

function startCombat(enemyId) {
  const enemyDef = ENEMIES[enemyId];
  if (!enemyDef) { console.error('Unknown enemy:', enemyId); return; }

  const cs = {
    enemy: createEnemyInstance(enemyDef),
    hand: [],
    drawPile: [],
    discardPile: [],
    exhaustPile: [],
    energy: MAX_ENERGY,
    baseEnergy: MAX_ENERGY,
    block: 0,
    playerStatuses: {},
    powers: [],
    turn: 1,
    combatLog: [],
    blockAnchored: false,
    freeFirstCard: false,
    freeFirstCardUsed: false,
    feedIgnoreChance: 0,
    attackBonus: 0,
    tiltIncreaseReduction: 0,
    burnImmune: false,
    freeAttacksRemaining: 0,
    streamHighlightUsed: false,
    bsodUsed: false,
    combatOver: false,
    forceEndTurn: false,
    _speedrunReplayed: false
  };

  GameState.combat = cs;
  initDrawPile(cs);
  triggerRelics('onCombatStart');
  drawCards(HAND_SIZE);
  GameState.screen = SCR.COMBAT;
  renderGame();
}

function startPlayerTurn() {
  const cs = GameState.combat;
  cs.turn++;
  cs.energy = cs.baseEnergy;
  cs.streamHighlightUsed = false;
  cs.forceEndTurn = false;
  cs._speedrunReplayed = false;

  if (!cs.blockAnchored) cs.block = 0;

  // Apply Burn to player
  const burnStacks = cs.playerStatuses[S.BURN] || 0;
  if (burnStacks > 0 && !cs.burnImmune) {
    const burnDmg = burnStacks * BURN_TILT_PER_STACK;
    addCombatLog(`🔥 Burn! +${burnDmg} Tilt`);
    changeTilt(burnDmg);
  }

  // Tick down player status durations
  for (const key of [S.VULNERABLE, S.WEAK]) {
    if (cs.playerStatuses[key]) {
      cs.playerStatuses[key]--;
      if (cs.playerStatuses[key] <= 0) delete cs.playerStatuses[key];
    }
  }

  triggerRelics('onTurnStart');

  // Power card effects on turn start
  for (const power of cs.powers) {
    if (power.id === 'chill_guy') changeTilt(-power.tiltPerTurn);
  }

  drawCards(HAND_SIZE);
  checkCombatEnd();
  if (!cs.combatOver) renderGame();
}

function playCard(handIndex) {
  const cs = GameState.combat;
  if (!cs || cs.combatOver) return;

  const card = cs.hand[handIndex];
  if (!card) return;

  // Cost calculation
  let cost = card.cost;
  const isFirstCard = !cs.freeFirstCardUsed;

  const relicPayload = { freeCost: false };
  triggerRelics('onCardPlay', relicPayload);

  if (cs.freeFirstCard && isFirstCard) {
    cost = 0;
    cs.freeFirstCardUsed = true;
  } else if (relicPayload.freeCost) {
    cost = 0;
  } else if (card.type === CT.ATTACK && cs.freeAttacksRemaining > 0) {
    cost = 0;
    cs.freeAttacksRemaining--;
  }

  if (cs.energy < cost) {
    addCombatLog('❌ Not enough Energy!');
    renderGame();
    return;
  }

  cs.energy -= cost;

  // Remove from hand
  cs.hand.splice(handIndex, 1);
  cs._playingCard = card;

  // Execute effect
  card.effect(cs, card.upgraded);

  // Check for 'carried' power (0-cost cards)
  if (cost === 0) {
    for (const power of cs.powers) {
      if (power.id === 'carried') dealDamage(cs.enemy, power.damage);
    }
  }

  triggerRelics('onCardPlayed', card);

  if (!cs.exhaustPile.includes(card)) {
    cs.discardPile.push(card);
  }

  cs._playingCard = null;

  addCombatLog(`🃏 Played: ${card.name}`);

  checkCombatEnd();
  if (!cs.combatOver) {
    if (cs.forceEndTurn) {
      endPlayerTurn();
    } else {
      renderGame();
    }
  }
}

function endPlayerTurn() {
  const cs = GameState.combat;
  if (!cs || cs.combatOver) return;

  triggerRelics('onTurnEnd');
  discardHand();
  enemyTurn();
}

function enemyTurn() {
  const cs = GameState.combat;
  const enemy = cs.enemy;

  // Heal mechanic (Bibitz boss)
  if (enemy.healsPerTurn) {
    enemy.currentDetermination = Math.min(enemy.maxDetermination, enemy.currentDetermination + enemy.healsPerTurn);
    addCombatLog(`💚 ${enemy.name} heals ${enemy.healsPerTurn} Determination!`);
  }

  // Tick down enemy statuses
  if ((enemy.statuses[S.MUTED] || 0) > 0) {
    enemy.statuses[S.MUTED]--;
    addCombatLog(`🔕 ${enemy.name} is Muted — skips action!`);
    if (enemy.statuses[S.MUTED] <= 0) delete enemy.statuses[S.MUTED];
    triggerRelics('onEnemyTurnEnd');
    startPlayerTurn();
    return;
  }

  // Check phase transition
  if (enemy.phase2Threshold && !enemy.inPhase2 && enemy.currentDetermination <= enemy.phase2Threshold) {
    enemy.inPhase2 = true;
    enemy.intentIndex = 0;
    addCombatLog(`💥 ${enemy.name} enters PHASE 2!`);
  }

  const pattern = enemy.inPhase2 ? enemy.phase2Pattern : enemy.pattern;
  const intent = pattern[enemy.intentIndex % pattern.length];

  if (intent) {
    intent.effect(cs);
    addCombatLog(`👿 ${enemy.name}: ${intent.label}`);
  }

  enemy.intentIndex++;

  // Tick down enemy statuses after action
  for (const key of [S.VULNERABLE, S.WEAK]) {
    if (enemy.statuses[key]) {
      enemy.statuses[key]--;
      if (enemy.statuses[key] <= 0) delete enemy.statuses[key];
    }
  }

  triggerRelics('onEnemyTurnEnd');
  checkCombatEnd();
  if (!cs.combatOver) startPlayerTurn();
}

function checkCombatEnd() {
  const cs = GameState.combat;
  if (cs.combatOver) return;

  if (cs.enemy.currentDetermination <= 0) {
    cs.combatOver = true;
    triggerRelics('onEnemyDie');
    addCombatLog(`✅ ${cs.enemy.name} defeated!`);
    renderGame();
    setTimeout(() => endCombat(true), 900);
    return;
  }

  if (GameState.tilt >= MAX_TILT) {
    cs.combatOver = true;
    addCombatLog('😵 Costel has TILTED!');
    renderGame();
    setTimeout(() => endCombat(false), 900);
    return;
  }
}

function endCombat(win) {
  const enemy = GameState.combat.enemy;
  const tier = enemy.tier;

  if (win) {
    const gold = tier === 'BOSS' ? rand(60, 80) : tier === 'ELITE' ? rand(35, 55) : rand(10, 30);
    GameState.gold += gold;
    addCombatLog(`💰 +${gold} gold!`);

    if (tier === 'BOSS') {
      GameState.bossKilled = true;
      if (GameState.act < ACT_COUNT) {
        GameState.actTransitionData = {
          act: GameState.act,
          nextAct: GameState.act + 1,
          bossName: enemy.name,
          bossDialog: enemy.winDialog || '"..."',
          goldEarned: gold
        };
        GameState.screen = SCR.ACT_TRANSITION;
        saveRun();
        renderGame();
        return;
      } else {
        GameState.screen = SCR.VICTORY;
        clearSave();
        renderGame();
        return;
      }
    }

    GameState.rewardData = generateReward(tier, gold);
    GameState.screen = SCR.REWARD;
    saveRun();
    renderGame();
  } else {
    const bossDialog = enemy.loseDialog || 'Costel a parasit Discord-ul...';
    GameState.screen = SCR.GAME_OVER;
    GameState.combat.loseDialog = bossDialog;
    clearSave();
    renderGame();
  }
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getEnemyIntent(cs) {
  const enemy = cs.enemy;
  const pattern = enemy.inPhase2 ? enemy.phase2Pattern : enemy.pattern;
  return pattern[enemy.intentIndex % pattern.length];
}
