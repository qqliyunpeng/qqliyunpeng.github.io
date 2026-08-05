const hideThreshold = 12;
const topThreshold = 4;

export function createHeaderScrollState(currentY = 0) {
  return {
    lastY: Math.max(0, currentY),
    downwardDistance: 0,
    hidden: false
  };
}

export function updateHeaderScrollState(state, currentY, focusWithin = false) {
  const nextY = Math.max(0, currentY);
  const delta = nextY - state.lastY;

  if (nextY <= topThreshold || focusWithin || delta < 0) {
    return { lastY: nextY, downwardDistance: 0, hidden: false };
  }

  if (delta === 0) return { ...state, lastY: nextY };

  const downwardDistance = state.downwardDistance + delta;
  if (downwardDistance >= hideThreshold) {
    return { lastY: nextY, downwardDistance: 0, hidden: true };
  }

  return { lastY: nextY, downwardDistance, hidden: state.hidden };
}
