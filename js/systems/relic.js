function triggerRelics(hookName, payload) {
  payload = payload || {};
  for (const relic of GameState.relics) {
    if (relic.trigger === hookName) {
      relic.effect(GameState, GameState.combat, payload);
    }
  }
  return payload;
}
