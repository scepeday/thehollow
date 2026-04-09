const screens = document.querySelectorAll("[data-screen]");

function goToScreen(screenName) {
  screens.forEach((screen) => {
    const isActive = screen.dataset.screen === screenName;

    screen.classList.toggle("is-active", isActive);
    screen.hidden = !isActive;
  });
}

function showInstructionsScreen() {
  goToScreen("instructions");
}
