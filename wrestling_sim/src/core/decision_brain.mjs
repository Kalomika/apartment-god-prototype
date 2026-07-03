import { scoreMove } from './grapple_resolver.mjs';
import { availableChoicesFor, getSuggestionWeight, markChoiceAccepted, markChoiceIgnored } from './manager_choice.mjs';

export function chooseNextAction(wrestler, opponent, context, managerState) {
  const choices = availableChoicesFor(wrestler, opponent, context);
  const suggestionWeight = getSuggestionWeight(managerState);

  context.managerSuggestionWeight = suggestionWeight;

  if (managerState?.pendingChoice?.moveId === 'let_wrestler_decide') {
    managerState.pendingChoice = null;
  }

  const scoredChoices = choices
    .filter((choice) => choice.id !== 'let_wrestler_decide')
    .map((choice) => ({
      choice,
      score: scoreMove(choice, wrestler, opponent, context, managerState)
    }))
    .sort((a, b) => b.score - a.score);

  const selected = scoredChoices[0]?.choice ?? null;

  if (!selected) {
    return {
      id: 'idle',
      label: 'Reset stance',
      category: 'system',
      staminaCost: 0,
      damage: 0,
      risk: 0,
      crowd: 0
    };
  }

  if (managerState?.pendingChoice) {
    if (managerState.pendingChoice.moveId === selected.id) {
      markChoiceAccepted(managerState);
    } else {
      markChoiceIgnored(managerState, explainIgnoredChoice(managerState.pendingChoice.moveId, selected.id));
    }
  }

  return selected;
}

export function suggestedChoiceTray(wrestler, opponent, context, limit = 6) {
  const choices = availableChoicesFor(wrestler, opponent, context);
  return choices.slice(0, limit);
}

function explainIgnoredChoice(requestedMoveId, selectedMoveId) {
  return `Requested ${requestedMoveId}, selected ${selectedMoveId} because current state favored another action.`;
}
