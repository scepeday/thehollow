// Audio is created in JavaScript so the app stays simple and music can keep
// playing when screens change.
const backgroundMusic = new Audio("assets/audio/music/AudioGameLoop.mp3");
backgroundMusic.loop = true;
backgroundMusic.preload = "auto";
backgroundMusic.volume = 0.6;

const startClickSound = new Audio("assets/audio/sfx/start-click.mp3");
startClickSound.preload = "auto";
startClickSound.volume = 0.9;

let musicStarted = false;

async function startBackgroundMusic() {
  if (musicStarted) {
    return;
  }

  try {
    await backgroundMusic.play();
    musicStarted = true;
  } catch (error) {
    console.warn("Background music could not start yet.", error);
  }
}

async function playButtonSound() {
  try {
    startClickSound.currentTime = 0;
    await startClickSound.play();
  } catch (error) {
    // The file may not exist yet or the browser may block it. That is okay.
    console.warn("Start click sound is unavailable.", error);
  }
}
