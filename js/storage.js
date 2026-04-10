const STORAGE_KEY = "the-hollow-game-state";

function getGameState() {
  const savedState = localStorage.getItem(STORAGE_KEY);

  if (!savedState) {
    return {
      scannedCards: [],
      currentChapterId: "",
      currentFragmentId: "",
      solvePlacements: {},
      solvedPuzzles: {}
    };
  }

  const parsedState = JSON.parse(savedState);

  if (!parsedState.solvePlacements) {
    parsedState.solvePlacements = {};
  }

  if (!parsedState.solvedPuzzles) {
    parsedState.solvedPuzzles = {};
  }

  if (!parsedState.scannedCards) {
    parsedState.scannedCards = [];
  }

  if (!parsedState.currentFragmentId) {
    parsedState.currentFragmentId = "";
  }

  if (!parsedState.currentChapterId) {
    parsedState.currentChapterId = "";
  }

  return parsedState;
}

function saveGameState(gameState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
}

function saveScannedCard(card) {
  const gameState = getGameState();
  let cardAlreadySaved = false;

  for (let i = 0; i < gameState.scannedCards.length; i += 1) {
    if (gameState.scannedCards[i].qrValue === card.qrValue) {
      cardAlreadySaved = true;
    }
  }

  if (!cardAlreadySaved) {
    gameState.scannedCards.push(card);
    saveGameState(gameState);
  }
}

function saveSolvePlacements(placements) {
  const gameState = getGameState();
  gameState.solvePlacements = placements;
  saveGameState(gameState);
}

function getSolvePlacements() {
  return getGameState().solvePlacements;
}

function markPuzzleSolved(puzzleId) {
  const gameState = getGameState();
  gameState.solvedPuzzles[puzzleId] = true;
  saveGameState(gameState);
}

function saveCurrentFragmentId(fragmentId) {
  const gameState = getGameState();
  gameState.currentFragmentId = fragmentId;
  saveGameState(gameState);
}

function getCurrentFragmentId() {
  return getGameState().currentFragmentId;
}

function saveCurrentChapterId(chapterId) {
  const gameState = getGameState();
  gameState.currentChapterId = chapterId;
  saveGameState(gameState);
}

function getCurrentChapterId() {
  return getGameState().currentChapterId;
}
