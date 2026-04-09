const startButton = document.querySelector('[data-action="start-game"]');
const backButton = document.querySelector('[data-action="go-back"]');
const nextButton = document.querySelector('[data-action="go-next"]');

async function handleStartGame() {
  await startBackgroundMusic();
  await playButtonSound();
  showInstructionsScreen();
}

async function handleBackButton() {
  await playButtonSound();
  goToScreen("landing");
}

async function handleNextButton() {
  await playButtonSound();
  goToScreen("next");
}

if (startButton) {
  startButton.addEventListener("click", handleStartGame);
}

if (backButton) {
  backButton.addEventListener("click", handleBackButton);
}

if (nextButton) {
  nextButton.addEventListener("click", handleNextButton);
}
