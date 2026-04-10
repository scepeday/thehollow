const startButton = document.querySelector('[data-action="start-game"]');
const instructionsBackButton = document.querySelector('[data-action="instructions-back"]');
const instructionsNextButton = document.querySelector('[data-action="instructions-next"]');
const prologueBackButton = document.querySelector('[data-action="prologue-back"]');
const prologueListenButton = document.querySelector('[data-action="prologue-listen"]');
const prologueSolveButton = document.querySelector('[data-action="prologue-solve"]');
const prologueAudioButton = document.querySelector('[data-action="toggle-prologue-audio"]');
const listenBackButton = document.querySelector('[data-action="listen-back"]');
const openScannerButton = document.querySelector('[data-action="open-scanner"]');
const fragmentBackButton = document.querySelector('[data-action="fragment-back"]');
const fragmentSolveButton = document.querySelector('[data-action="fragment-solve"]');
const fragmentAudioButton = document.querySelector('[data-action="toggle-fragment-audio"]');
const chapterBackButton = document.querySelector('[data-action="chapter-back"]');
const chapterSolveButton = document.querySelector('[data-action="chapter-solve"]');
const chapterAudioButton = document.querySelector('[data-action="toggle-chapter-audio"]');
const solveBackButton = document.querySelector('[data-action="solve-back"]');
const checkSolveButton = document.querySelector('[data-action="check-solve"]');
const finalAudioButton = document.querySelector('[data-action="toggle-final-audio"]');

const fragmentCardArea = document.querySelector("[data-fragment-card-area]");
const chapterCardArea = document.querySelector("[data-chapter-card-area]");

function renderCurrentFragmentCard(fragment) {
  if (!fragmentCardArea) {
    return;
  }

  fragmentCardArea.innerHTML = "";

  const card = document.createElement("div");
  const image = document.createElement("img");

  card.className = "fragment-card";
  image.className = "fragment-card__image";
  image.src = fragment.image;
  image.alt = fragment.id;

  card.appendChild(image);
  fragmentCardArea.appendChild(card);
}

function renderCurrentChapterCard(chapter) {
  if (!chapterCardArea) {
    return;
  }

  chapterCardArea.innerHTML = "";

  const card = document.createElement("div");
  const image = document.createElement("img");

  card.className = "chapter-card";
  image.className = "chapter-card__image";
  image.src = chapter.image;
  image.alt = chapter.title;

  card.appendChild(image);
  chapterCardArea.appendChild(card);
}

function loadCurrentFragment() {
  const currentFragmentId = getCurrentFragmentId();
  const currentFragment = findFragmentById(currentFragmentId);

  if (!currentFragment) {
    return false;
  }

  renderCurrentFragmentCard(currentFragment);
  loadFragmentAudio(currentFragment.audio);
  return true;
}

function loadFragmentById(fragmentId) {
  const fragment = findFragmentById(fragmentId);

  if (!fragment) {
    return false;
  }

  saveScannedCard(fragment);
  saveCurrentFragmentId(fragmentId);
  return loadCurrentFragment();
}

function loadCurrentChapter() {
  const currentChapterId = getCurrentChapterId();
  const currentChapter = findChapterById(currentChapterId);

  if (!currentChapter) {
    return false;
  }

  renderCurrentChapterCard(currentChapter);
  loadChapterAudio(currentChapter.audio);
  return true;
}

function loadChapterById(chapterId) {
  const chapter = findChapterById(chapterId);

  if (!chapter) {
    return false;
  }

  saveScannedCard(chapter);
  saveCurrentChapterId(chapterId);
  return loadCurrentChapter();
}

function handleStartGame() {
  startBackgroundMusic();
  playButtonSound();
  showInstructionsScreen();
}

function handleInstructionsBackButton() {
  playButtonSound();
  goToScreen("landing");
}

function handleInstructionsNextButton() {
  playButtonSound();
  showPrologueScreen();
}

function handlePrologueBackButton() {
  playButtonSound();
  goToScreen("instructions");
}

function handlePrologueListenButton() {
  playButtonSound();
  showListenScreen();
}

function handlePrologueSolveButton() {
  playButtonSound();
  showSolveScreen();
}

function handleListenBackButton() {
  playButtonSound();
  goToScreen("prologue");
}

function handleOpenScannerButton() {
  playButtonSound();
  startQrScanner();
}

function handleFragmentBackButton() {
  playButtonSound();
  goToScreen("listen");
}

function handleFragmentSolveButton() {
  playButtonSound();
  showSolveScreen();
}

function handleChapterBackButton() {
  playButtonSound();
  goToScreen("listen");
}

function handleChapterSolveButton() {
  playButtonSound();
  showSolveScreen();
}

function handleSolveBackButton() {
  playButtonSound();
  goToScreen("prologue");
}

if (startButton) {
  startButton.addEventListener("click", handleStartGame);
}

if (instructionsBackButton) {
  instructionsBackButton.addEventListener("click", handleInstructionsBackButton);
}

if (instructionsNextButton) {
  instructionsNextButton.addEventListener("click", handleInstructionsNextButton);
}

if (prologueBackButton) {
  prologueBackButton.addEventListener("click", handlePrologueBackButton);
}

if (prologueListenButton) {
  prologueListenButton.addEventListener("click", handlePrologueListenButton);
}

if (prologueSolveButton) {
  prologueSolveButton.addEventListener("click", handlePrologueSolveButton);
}

if (prologueAudioButton) {
  prologueAudioButton.addEventListener("click", togglePrologueAudio);
}

if (listenBackButton) {
  listenBackButton.addEventListener("click", handleListenBackButton);
}

if (openScannerButton) {
  openScannerButton.addEventListener("click", handleOpenScannerButton);
}

if (fragmentBackButton) {
  fragmentBackButton.addEventListener("click", handleFragmentBackButton);
}

if (fragmentSolveButton) {
  fragmentSolveButton.addEventListener("click", handleFragmentSolveButton);
}

if (fragmentAudioButton) {
  fragmentAudioButton.addEventListener("click", toggleFragmentAudio);
}

if (chapterBackButton) {
  chapterBackButton.addEventListener("click", handleChapterBackButton);
}

if (chapterSolveButton) {
  chapterSolveButton.addEventListener("click", handleChapterSolveButton);
}

if (chapterAudioButton) {
  chapterAudioButton.addEventListener("click", toggleChapterAudio);
}

if (solveBackButton) {
  solveBackButton.addEventListener("click", handleSolveBackButton);
}

if (checkSolveButton) {
  checkSolveButton.addEventListener("click", handleSolvedButton);
}

if (finalAudioButton) {
  finalAudioButton.addEventListener("click", toggleFinalStoryAudio);
}

window.addEventListener("hashchange", handleHashRoute);
window.addEventListener("DOMContentLoaded", handleHashRoute);
