const solveChaptersContainer = document.querySelector("[data-solve-chapters]");
const solveFragmentSlotsContainer = document.querySelector("[data-solve-fragment-slots]");
const solveDeckContainer = document.querySelector("[data-solve-deck]");
const solveMessage = document.querySelector("[data-solve-message]");

let selectedSolveCardId = "";
let solvePlacements = getSolvePlacements();

function normalizeSolvePlacements() {
  if (!solvePlacements.chapterSlots) {
    solvePlacements.chapterSlots = {};
  }

  if (!solvePlacements.fragmentSlots) {
    solvePlacements.fragmentSlots = {};
  }
}

function showSolveMessage(message) {
  if (solveMessage) {
    solveMessage.textContent = message;
  }
}

function getPlacedCardId(groupName, slotNumber) {
  normalizeSolvePlacements();

  if (!solvePlacements[groupName]) {
    return "";
  }

  return solvePlacements[groupName][slotNumber] || "";
}

function findSolveDeckCardById(cardId) {
  const deckCards = getSolveDeckCards();

  for (let i = 0; i < deckCards.length; i += 1) {
    if (deckCards[i].id === cardId) {
      return deckCards[i];
    }
  }

  return null;
}

function isCardPlaced(cardId) {
  for (let slotNumber = 1; slotNumber <= 3; slotNumber += 1) {
    if (getPlacedCardId("chapterSlots", slotNumber) === cardId) {
      return true;
    }
  }

  for (let slotNumber = 1; slotNumber <= 9; slotNumber += 1) {
    if (getPlacedCardId("fragmentSlots", slotNumber) === cardId) {
      return true;
    }
  }

  return false;
}

function isSolveCardAvailable(card) {
  if (card.type === "chapter-card") {
    return true;
  }

  const gameState = getGameState();

  for (let i = 0; i < gameState.scannedCards.length; i += 1) {
    if (gameState.scannedCards[i].qrValue === card.qrValue) {
      return true;
    }
  }

  return false;
}

function clearSelectedSolveCard() {
  selectedSolveCardId = "";
}

function renderSolveDeckCard(card) {
  const cardButton = document.createElement("button");
  const cardFrame = document.createElement("span");
  const cardImage = document.createElement("img");
  const cardAvailable = isSolveCardAvailable(card);
  const cardPlaced = isCardPlaced(card.id);

  cardButton.className = "solve-fragment-card";
  cardButton.type = "button";

  if (card.type === "chapter-card") {
    cardButton.classList.add("is-reference");
  }

  if (!cardAvailable) {
    cardButton.classList.add("is-locked");
    cardButton.disabled = true;
  }

  if (cardPlaced) {
    cardButton.classList.add("is-used");
    cardButton.disabled = true;
  }

  if (selectedSolveCardId === card.id) {
    cardButton.classList.add("is-selected");
  }

  cardFrame.className = "solve-fragment-card__frame";
  cardImage.className = "solve-fragment-card__image";
  cardImage.src = card.image;
  cardImage.alt = card.id;

  cardFrame.appendChild(cardImage);
  cardButton.appendChild(cardFrame);

  if (!cardButton.disabled) {
    cardButton.addEventListener("click", function () {
      selectSolveCard(card.id);
    });
  }

  return cardButton;
}

function renderSolveDeck() {
  if (!solveDeckContainer) {
    return;
  }

  const deckCards = getSolveDeckCards();
  solveDeckContainer.innerHTML = "";

  for (let i = 0; i < deckCards.length; i += 1) {
    solveDeckContainer.appendChild(renderSolveDeckCard(deckCards[i]));
  }
}

function createPlacedSolveCard(cardId) {
  const card = findSolveDeckCardById(cardId);
  const placedCard = document.createElement("div");
  const cardFrame = document.createElement("span");
  const cardImage = document.createElement("img");

  placedCard.className = "solve-fragment-card is-placed";
  cardFrame.className = "solve-fragment-card__frame";
  cardImage.className = "solve-fragment-card__image";
  cardImage.src = card.image;
  cardImage.alt = card.id;

  cardFrame.appendChild(cardImage);
  placedCard.appendChild(cardFrame);

  return placedCard;
}

function createSolveSlot(groupName, slotNumber, placeholderText) {
  const slot = document.createElement("button");
  const placedCardId = getPlacedCardId(groupName, slotNumber);

  slot.className = "solve-slot";
  slot.type = "button";

  if (selectedSolveCardId) {
    slot.classList.add("is-active");
  }

  if (placedCardId) {
    slot.appendChild(createPlacedSolveCard(placedCardId));
  } else {
    const slotText = document.createElement("span");
    slotText.className = "solve-slot__text";
    slotText.textContent = placeholderText;
    slot.appendChild(slotText);
  }

  slot.addEventListener("click", function () {
    placeSolveCard(groupName, slotNumber);
  });

  return slot;
}

function renderChapterAreas() {
  if (!solveChaptersContainer) {
    return;
  }

  const chapters = getSolveChapters();
  solveChaptersContainer.innerHTML = "";

  for (let i = 0; i < chapters.length; i += 1) {
    const chapter = chapters[i];
    const chapterElement = document.createElement("div");
    const chapterTitle = document.createElement("img");
    const dropArea = document.createElement("div");

    chapterElement.className = "solve-chapter";
    chapterTitle.className = "solve-chapter__title";
    chapterTitle.src = chapter.titleImage;
    chapterTitle.alt = chapter.label;
    dropArea.className = "solve-chapter__drop-area";

    dropArea.appendChild(createSolveSlot("chapterSlots", i + 1, "Place chapter here"));

    chapterElement.appendChild(chapterTitle);
    chapterElement.appendChild(dropArea);
    solveChaptersContainer.appendChild(chapterElement);
  }
}

function renderFragmentSlots() {
  if (!solveFragmentSlotsContainer) {
    return;
  }

  solveFragmentSlotsContainer.innerHTML = "";

  for (let slotNumber = 1; slotNumber <= 9; slotNumber += 1) {
    solveFragmentSlotsContainer.appendChild(
      createSolveSlot("fragmentSlots", slotNumber, "Place fragment here")
    );
  }
}

function renderSolveScreen() {
  normalizeSolvePlacements();
  renderChapterAreas();
  renderFragmentSlots();
  renderSolveDeck();
}

function showSolveScreen() {
  solvePlacements = getSolvePlacements();
  normalizeSolvePlacements();
  renderSolveScreen();
  showSolveMessage("Tap a grey card, then tap a matching empty slot.");
  goToScreen("solve");
}

function selectSolveCard(cardId) {
  if (selectedSolveCardId === cardId) {
    selectedSolveCardId = "";
    showSolveMessage("Card unselected.");
  } else {
    selectedSolveCardId = cardId;
    showSolveMessage("Card selected. Now tap an empty slot.");
  }

  renderSolveScreen();
}

function removeSolveCardFromSlots(cardId) {
  for (let slotNumber = 1; slotNumber <= 3; slotNumber += 1) {
    if (getPlacedCardId("chapterSlots", slotNumber) === cardId) {
      solvePlacements.chapterSlots[slotNumber] = "";
    }
  }

  for (let slotNumber = 1; slotNumber <= 9; slotNumber += 1) {
    if (getPlacedCardId("fragmentSlots", slotNumber) === cardId) {
      solvePlacements.fragmentSlots[slotNumber] = "";
    }
  }
}

function removePlacedSolveCard(groupName, slotNumber) {
  normalizeSolvePlacements();
  solvePlacements[groupName][slotNumber] = "";
  saveSolvePlacements(solvePlacements);
  showSolveMessage("Card removed from the slot.");
  renderSolveScreen();
}

function placeSolveCard(groupName, slotNumber) {
  const placedCardId = getPlacedCardId(groupName, slotNumber);

  if (!selectedSolveCardId) {
    if (placedCardId) {
      removePlacedSolveCard(groupName, slotNumber);
    }

    return;
  }

  const selectedCard = findSolveDeckCardById(selectedSolveCardId);

  if (!selectedCard) {
    return;
  }

  if (groupName === "chapterSlots" && selectedCard.type !== "chapter-card") {
    showSolveMessage("Only chapter cards can go in the chapter row.");
    return;
  }

  if (groupName === "fragmentSlots" && selectedCard.type !== "fragment") {
    showSolveMessage("Only fragment cards can go in the fragment row.");
    return;
  }

  normalizeSolvePlacements();
  removeSolveCardFromSlots(selectedSolveCardId);
  solvePlacements[groupName][slotNumber] = selectedSolveCardId;
  saveSolvePlacements(solvePlacements);
  clearSelectedSolveCard();
  showSolveMessage("Card placed. Continue arranging the order.");
  renderSolveScreen();
}

function enableFragmentPlacement() {
  renderSolveScreen();
}

function checkPuzzleAnswer() {
  const chapters = getSolveChapters();
  const fragments = getFragmentCards();

  for (let i = 0; i < chapters.length; i += 1) {
    if (getPlacedCardId("chapterSlots", i + 1) !== chapters[i].id) {
      return false;
    }
  }

  for (let i = 0; i < fragments.length; i += 1) {
    if (getPlacedCardId("fragmentSlots", i + 1) !== fragments[i].id) {
      return false;
    }
  }

  return true;
}

function showPuzzleError() {
  showSolveMessage("Some cards are in the wrong place. Try again.");
}

function handleSolvedButton() {
  playButtonSound();

  if (checkPuzzleAnswer()) {
    markPuzzleSolved("solve-screen");
    showSolveMessage("Puzzle solved.");
    showFinalScreen();
  } else {
    showPuzzleError();
  }
}
