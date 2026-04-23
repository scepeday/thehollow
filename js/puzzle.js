const solveChaptersContainer = document.querySelector("[data-solve-chapters]");
const solveFragmentSlotsContainer = document.querySelector("[data-solve-fragment-slots]");
const solveDeckContainer = document.querySelector("[data-solve-deck]");
const solveMessage = document.querySelector("[data-solve-message]");

let selectedSolveCardId = "";
let solvePlacements = getSolvePlacements();
let hasCheckedSolveAnswer = false;

function normalizeSolvePlacements() {
  if (!solvePlacements.chapterSlots) {
    solvePlacements.chapterSlots = {};
  }

  if (!solvePlacements.fragmentSlots) {
    solvePlacements.fragmentSlots = {};
  }

  normalizePlacedCardIds("chapterSlots", 3);
  normalizePlacedCardIds("fragmentSlots", 9);
}

function showSolveMessage(message) {
  if (solveMessage) {
    solveMessage.textContent = message;
  }
}

function getExpectedCardId(groupName, slotNumber) {
  if (groupName === "chapterSlots") {
    const chapters = getSolveChapters();
    const chapter = chapters[slotNumber - 1];

    return chapter ? chapter.id : "";
  }

  if (groupName === "fragmentSlots") {
    const fragments = getFragmentCards();
    const fragment = fragments[slotNumber - 1];

    return fragment ? fragment.id : "";
  }

  return "";
}

function isSlotCorrect(groupName, slotNumber) {
  const placedCardId = getPlacedCardId(groupName, slotNumber);
  const expectedCardId = getExpectedCardId(groupName, slotNumber);

  if (!placedCardId || !expectedCardId) {
    return false;
  }

  return cardIdsMatch(placedCardId, expectedCardId);
}

function getSolveProgressSummary() {
  let filledSlots = 0;
  let missingSlots = 0;
  let correctSlots = 0;
  let incorrectSlots = 0;
  const totalSlots = 12;

  for (let slotNumber = 1; slotNumber <= 3; slotNumber += 1) {
    const placedCardId = getPlacedCardId("chapterSlots", slotNumber);

    if (placedCardId) {
      filledSlots += 1;

      if (isSlotCorrect("chapterSlots", slotNumber)) {
        correctSlots += 1;
      } else {
        incorrectSlots += 1;
      }
    } else {
      missingSlots += 1;
    }
  }

  for (let slotNumber = 1; slotNumber <= 9; slotNumber += 1) {
    const placedCardId = getPlacedCardId("fragmentSlots", slotNumber);

    if (placedCardId) {
      filledSlots += 1;

      if (isSlotCorrect("fragmentSlots", slotNumber)) {
        correctSlots += 1;
      } else {
        incorrectSlots += 1;
      }
    } else {
      missingSlots += 1;
    }
  }

  return {
    totalSlots,
    filledSlots,
    missingSlots,
    correctSlots,
    incorrectSlots
  };
}

function getSolveInstructionMessage() {
  const progress = getSolveProgressSummary();

  if (progress.filledSlots === 0) {
    return "Scan cards to unlock them, then tap a grey card and tap an empty slot.";
  }

  if (selectedSolveCardId) {
    return `Card selected. ${progress.missingSlots} card${progress.missingSlots === 1 ? "" : "s"} still missing from the board.`;
  }

  return `${progress.filledSlots} of ${progress.totalSlots} cards placed. ${progress.missingSlots} card${progress.missingSlots === 1 ? "" : "s"} still missing.`;
}

function getPlacedCardId(groupName, slotNumber) {
  normalizeSolvePlacements();

  if (!solvePlacements[groupName]) {
    return "";
  }

  return solvePlacements[groupName][slotNumber] || "";
}

function getCanonicalCardId(cardId) {
  const deckCards = getSolveDeckCards();
  const cleanCardId = String(cardId || "").trim();

  if (!cleanCardId) {
    return "";
  }

  for (let i = 0; i < deckCards.length; i += 1) {
    if (deckCards[i].id === cleanCardId) {
      return cleanCardId;
    }
  }

  if (cleanCardId.indexOf("deck-") === 0) {
    const legacyCardId = cleanCardId.replace("deck-", "");

    for (let i = 0; i < deckCards.length; i += 1) {
      if (deckCards[i].id === legacyCardId) {
        return legacyCardId;
      }
    }
  }

  const matchedCard = findCardByQrValue(cleanCardId);

  if (matchedCard) {
    return matchedCard.id;
  }

  return cleanCardId;
}

function normalizePlacedCardIds(groupName, totalSlots) {
  for (let slotNumber = 1; slotNumber <= totalSlots; slotNumber += 1) {
    const placedCardId = solvePlacements[groupName][slotNumber];

    if (placedCardId) {
      solvePlacements[groupName][slotNumber] = getCanonicalCardId(placedCardId);
    }
  }
}

function findSolveDeckCardById(cardId) {
  const deckCards = getSolveDeckCards();
  const cleanCardId = getCanonicalCardId(cardId);

  for (let i = 0; i < deckCards.length; i += 1) {
    if (deckCards[i].id === cleanCardId) {
      return deckCards[i];
    }
  }

  return null;
}

function cardIdsMatch(firstCardId, secondCardId) {
  const firstCleanCardId = getCanonicalCardId(firstCardId);
  const secondCleanCardId = getCanonicalCardId(secondCardId);

  if (firstCleanCardId === secondCleanCardId) {
    return true;
  }

  return false;
}

function isCardPlaced(cardId) {
  for (let slotNumber = 1; slotNumber <= 3; slotNumber += 1) {
    if (cardIdsMatch(getPlacedCardId("chapterSlots", slotNumber), cardId)) {
      return true;
    }
  }

  for (let slotNumber = 1; slotNumber <= 9; slotNumber += 1) {
    if (cardIdsMatch(getPlacedCardId("fragmentSlots", slotNumber), cardId)) {
      return true;
    }
  }

  return false;
}

function isSolveCardAvailable(card) {
  const gameState = getGameState();

  for (let i = 0; i < gameState.scannedCards.length; i += 1) {
    const scannedCard = gameState.scannedCards[i];

    if (scannedCard.qrValue === card.id || scannedCard.qrValue === card.qrValue) {
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

  if (!card) {
    placedCard.className = "solve-fragment-card is-placed";
    placedCard.textContent = "Card";
    return placedCard;
  }

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

  if (hasCheckedSolveAnswer) {
    if (!placedCardId) {
      slot.classList.add("is-missing");
    } else if (isSlotCorrect(groupName, slotNumber)) {
      slot.classList.add("is-correct");
    } else {
      slot.classList.add("is-incorrect");
    }
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
  showSolveMessage(getSolveInstructionMessage());
  goToScreen("solve");
}

function selectSolveCard(cardId) {
  if (selectedSolveCardId === cardId) {
    selectedSolveCardId = "";
  } else {
    selectedSolveCardId = cardId;
  }

  renderSolveScreen();
  showSolveMessage(getSolveInstructionMessage());
}

function removeSolveCardFromSlots(cardId) {
  for (let slotNumber = 1; slotNumber <= 3; slotNumber += 1) {
    if (cardIdsMatch(getPlacedCardId("chapterSlots", slotNumber), cardId)) {
      solvePlacements.chapterSlots[slotNumber] = "";
    }
  }

  for (let slotNumber = 1; slotNumber <= 9; slotNumber += 1) {
    if (cardIdsMatch(getPlacedCardId("fragmentSlots", slotNumber), cardId)) {
      solvePlacements.fragmentSlots[slotNumber] = "";
    }
  }
}

function removePlacedSolveCard(groupName, slotNumber) {
  normalizeSolvePlacements();
  solvePlacements[groupName][slotNumber] = "";
  saveSolvePlacements(solvePlacements);
  renderSolveScreen();
  showSolveMessage(getSolveInstructionMessage());
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
  renderSolveScreen();
  showSolveMessage(getSolveInstructionMessage());
}

function enableFragmentPlacement() {
  renderSolveScreen();
}

function checkPuzzleAnswer() {
  for (let slotNumber = 1; slotNumber <= 3; slotNumber += 1) {
    if (!isSlotCorrect("chapterSlots", slotNumber)) {
      return false;
    }
  }

  for (let slotNumber = 1; slotNumber <= 9; slotNumber += 1) {
    if (!isSlotCorrect("fragmentSlots", slotNumber)) {
      return false;
    }
  }

  return true;
}

function checkChapterAnswer() {
  const chapters = getSolveChapters();

  for (let i = 0; i < chapters.length; i += 1) {
    const placedChapterId = getPlacedCardId("chapterSlots", i + 1);

    if (!cardIdsMatch(placedChapterId, chapters[i].id)) {
      return false;
    }
  }

  return true;
}

function showPuzzleError() {
  const progress = getSolveProgressSummary();
  const messageParts = [];

  hasCheckedSolveAnswer = true;
  renderSolveScreen();

  if (progress.missingSlots > 0) {
    messageParts.push(`${progress.missingSlots} card${progress.missingSlots === 1 ? "" : "s"} still missing.`);
  }

  if (progress.incorrectSlots > 0) {
    messageParts.push(`${progress.incorrectSlots} card${progress.incorrectSlots === 1 ? " is" : "s are"} in the wrong spot.`);
  }

  if (progress.correctSlots > 0) {
    messageParts.push(`${progress.correctSlots} card${progress.correctSlots === 1 ? " is" : "s are"} correct.`);
  }

  if (checkChapterAnswer()) {
    messageParts.push("Your chapter row is correct.");
  }

  if (messageParts.length === 0) {
    messageParts.push("Keep arranging the cards.");
  }

  showSolveMessage(messageParts.join(" "));
}

function handleSolvedButton() {
  playButtonSound();

  if (checkPuzzleAnswer()) {
    hasCheckedSolveAnswer = true;
    renderSolveScreen();
    markPuzzleSolved("solve-screen");
    showSolveMessage("Puzzle solved.");
    showFinalScreen();
  } else {
    showPuzzleError();
  }
}
