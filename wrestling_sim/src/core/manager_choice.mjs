export const InteractionMode = Object.freeze({
  FULL_AUTO: 'full_auto',
  COACH_MODE: 'coach_mode',
  BOOKER_MODE: 'booker_mode'
});

export function createManagerChoiceState(mode = InteractionMode.FULL_AUTO) {
  return {
    mode,
    pendingChoice: null,
    acceptedChoices: 0,
    ignoredChoices: 0,
    ignoredReasons: []
  };
}

export function queueManagerChoice(managerState, moveId) {
  managerState.pendingChoice = {
    moveId,
    createdAtTurn: null
  };
}

export function getSuggestionWeight(managerState) {
  if (!managerState?.pendingChoice) return 0;

  switch (managerState.mode) {
    case InteractionMode.COACH_MODE:
      return 0.45;
    case InteractionMode.BOOKER_MODE:
      return 0.85;
    case InteractionMode.FULL_AUTO:
    default:
      return 0;
  }
}

export function markChoiceAccepted(managerState) {
  if (!managerState?.pendingChoice) return;
  managerState.acceptedChoices += 1;
  managerState.pendingChoice = null;
}

export function markChoiceIgnored(managerState, reason) {
  if (!managerState?.pendingChoice) return;
  managerState.ignoredChoices += 1;
  managerState.ignoredReasons.push(reason);
  managerState.pendingChoice = null;
}

export function availableChoicesFor(wrestlerState, opponentState, context) {
  const zoneTags = context.zoneTagsFor(wrestlerState.position);
  const opponentDown = opponentState.condition.stun > 0.62;

  const choices = wrestlerState.profile.moveSet.filter((move) => {
    if (move.zoneTags.includes('any')) return true;
    if (opponentDown && move.zoneTags.includes('ground')) return true;
    return move.zoneTags.some((tag) => zoneTags.includes(tag));
  });

  choices.push({
    id: 'let_wrestler_decide',
    label: 'Let wrestler decide',
    category: 'system',
    staminaCost: 0,
    damage: 0,
    risk: 0,
    crowd: 0
  });

  return choices;
}
