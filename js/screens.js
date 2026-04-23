const screens = document.querySelectorAll("[data-screen]");
let isHandlingHashRoute = false;

function getHashForScreen(screenName) {
  if (screenName === "instructions") {
    return "#/instructions";
  }

  if (screenName === "prologue") {
    return "#/prologue";
  }

  if (screenName === "listen") {
    return "#/listen";
  }

  if (screenName === "solve") {
    return "#/solve";
  }

  if (screenName === "final") {
    return "#/final";
  }

  if (screenName === "chapter") {
    const currentChapterId = getCurrentChapterId();

    if (currentChapterId) {
      return `#/chapter/${currentChapterId}`;
    }
  }

  if (screenName === "fragment") {
    const currentFragmentId = getCurrentFragmentId();

    if (currentFragmentId) {
      return `#/fragment/${currentFragmentId}`;
    }
  }

  return "#/";
}

function cleanIndexHtmlFromUrl(hash) {
  const cleanPath = window.location.pathname.replace("index.html", "");
  const cleanUrl = cleanPath + hash;

  if (window.location.pathname.indexOf("index.html") !== -1) {
    window.history.replaceState(null, "", cleanUrl);
  }
}

function updatePageHash(hash) {
  cleanIndexHtmlFromUrl(hash);

  if (window.location.hash !== hash) {
    window.location.hash = hash;
  }
}

function goToScreen(screenName) {
  if (screenName !== "prologue") {
    pausePrologueAudio();
  }

  if (screenName !== "fragment") {
    pauseFragmentAudio();
  }

  if (screenName !== "chapter") {
    pauseChapterAudio();
  }

  if (screenName !== "final") {
    pauseFinalStoryAudio();
  }

  if (screenName !== "listen") {
    stopQrScanner();
    showScannerMessage("");
  }

  for (let i = 0; i < screens.length; i += 1) {
    const screen = screens[i];
    const isActive = screen.dataset.screen === screenName;

    screen.classList.toggle("is-active", isActive);
    screen.hidden = !isActive;
  }

  if (!isHandlingHashRoute) {
    updatePageHash(getHashForScreen(screenName));
  }
}

function showInstructionsScreen() {
  goToScreen("instructions");
}

function showPrologueScreen() {
  goToScreen("prologue");
}

function showListenScreen() {
  goToScreen("listen");
}

function showFragmentScreen(fragmentId) {
  let fragmentLoaded = false;

  if (fragmentId) {
    fragmentLoaded = loadFragmentById(fragmentId);
  } else {
    fragmentLoaded = loadCurrentFragment();
  }

  if (!fragmentLoaded) {
    goToScreen("listen");
    return;
  }

  goToScreen("fragment");
}

function showChapterScreen(chapterId) {
  let chapterLoaded = false;

  if (chapterId) {
    chapterLoaded = loadChapterById(chapterId);
  } else {
    chapterLoaded = loadCurrentChapter();
  }

  if (!chapterLoaded) {
    goToScreen("listen");
    return;
  }

  goToScreen("chapter");
}

function checkIfAllPuzzlesSolved() {
  const gameState = getGameState();

  return Boolean(gameState.solvedPuzzles["solve-screen"]);
}

function showFinalScreen() {
  if (!checkIfAllPuzzlesSolved()) {
    goToScreen("solve");
    return;
  }

  loadFinalStoryAudio("assets/audio/voice/chapters/full-novel/The Hollow.mp3");
  goToScreen("final");
  playFinalStoryAudio();
}

function handleHashRoute() {
  const hash = window.location.hash || "#/";

  isHandlingHashRoute = true;
  cleanIndexHtmlFromUrl(hash);

  if (hash === "#/" || hash === "") {
    goToScreen("landing");
    isHandlingHashRoute = false;
    return;
  }

  if (hash === "#/prologue") {
    showPrologueScreen();
    isHandlingHashRoute = false;
    return;
  }

  if (hash === "#/instructions") {
    showInstructionsScreen();
    isHandlingHashRoute = false;
    return;
  }

  if (hash === "#/listen") {
    showListenScreen();
    isHandlingHashRoute = false;
    return;
  }

  if (hash === "#/solve") {
    showSolveScreen();
    isHandlingHashRoute = false;
    return;
  }

  if (hash === "#/final") {
    showFinalScreen();
    isHandlingHashRoute = false;
    return;
  }

  if (hash.indexOf("#/chapter/") === 0) {
    const chapterId = hash.replace("#/chapter/", "");
    showChapterScreen(chapterId);
    isHandlingHashRoute = false;
    return;
  }

  if (hash.indexOf("#/fragment/") === 0) {
    const fragmentId = hash.replace("#/fragment/", "");
    showFragmentScreen(fragmentId);
    isHandlingHashRoute = false;
    return;
  }

  goToScreen("landing");
  isHandlingHashRoute = false;
}
