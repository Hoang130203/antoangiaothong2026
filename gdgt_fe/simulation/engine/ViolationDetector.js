/**
 * Checks state-based violation rules each frame.
 * Event-based rules (no detect fn) are handled by Rapier sensors in the scene.
 *
 * @param {object} gameState - { speed, ... } from useGameStore
 * @param {Array} violationRules - ViolationRule[] from scenario config
 * @returns {ViolationRule|null} first matching rule, or null
 */
export function checkStateBasedViolations(gameState, violationRules) {
  for (const rule of violationRules) {
    if (typeof rule.detect === 'function' && rule.detect(gameState)) {
      return rule
    }
  }
  return null
}
