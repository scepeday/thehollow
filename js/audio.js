// Audio is created in JavaScript so the app stays simple and music can keep
// playing when screens change.
const backgroundMusic = new Audio("assets/audio/music/AudioGameLoop.mp3");
backgroundMusic.loop = true;
backgroundMusic.preload = "auto";
backgroundMusic.volume = 0.6;

const startClickSound = new Audio("assets/audio/sfx/start-click.mp3");
startClickSound.preload = "auto";
startClickSound.volume = 0.9;

// TODO: Replace this placeholder path when the real Prologue narration file is ready.
const prologueAudioPath = "assets/audio/voice/prologue/prologue-narration.mp3";
const prologueAudio = new Audio();
prologueAudio.preload = "metadata";

const prologueAudioToggleButton = document.querySelector('[data-action="toggle-prologue-audio"]');
const prologueAudioProgress = document.querySelector("[data-prologue-progress]");
const prologueCurrentTime = document.querySelector("[data-prologue-current-time]");
const prologueDuration = document.querySelector("[data-prologue-duration]");
const fragmentAudio = new Audio();
fragmentAudio.preload = "metadata";
const fragmentAudioToggleButton = document.querySelector('[data-action="toggle-fragment-audio"]');
const fragmentAudioProgress = document.querySelector("[data-fragment-progress]");
const fragmentCurrentTime = document.querySelector("[data-fragment-current-time]");
const fragmentDuration = document.querySelector("[data-fragment-duration]");
const chapterAudio = new Audio();
chapterAudio.preload = "metadata";
const chapterAudioToggleButton = document.querySelector('[data-action="toggle-chapter-audio"]');
const chapterAudioProgress = document.querySelector("[data-chapter-progress]");
const chapterCurrentTime = document.querySelector("[data-chapter-current-time]");
const chapterDuration = document.querySelector("[data-chapter-duration]");
const finalStoryAudio = new Audio();
finalStoryAudio.preload = "metadata";
const finalAudioToggleButton = document.querySelector('[data-action="toggle-final-audio"]');
const finalAudioProgress = document.querySelector("[data-final-progress]");
const finalCurrentTime = document.querySelector("[data-final-current-time]");
const finalDuration = document.querySelector("[data-final-duration]");

let musicStarted = false;

function startBackgroundMusic() {
  if (musicStarted) {
    return;
  }

  backgroundMusic.play()
    .then(function () {
      musicStarted = true;
    })
    .catch(function (error) {
      console.warn("Background music could not start yet.", error);
    });
}

function playButtonSound() {
  startClickSound.currentTime = 0;

  startClickSound.play().catch(function (error) {
    // The file may not exist yet or the browser may block it. That is okay.
    console.warn("Start click sound is unavailable.", error);
  });
}

function formatAudioTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

function updatePrologueAudioPlayer() {
  if (!prologueAudioProgress || !prologueCurrentTime || !prologueDuration) {
    return;
  }

  const duration = Number.isFinite(prologueAudio.duration) ? prologueAudio.duration : 0;
  const currentTime = Number.isFinite(prologueAudio.currentTime) ? prologueAudio.currentTime : 0;
  const progressValue = duration > 0 ? (currentTime / duration) * 100 : 0;

  prologueAudioProgress.value = String(progressValue);
  prologueCurrentTime.textContent = formatAudioTime(currentTime);
  prologueDuration.textContent = formatAudioTime(duration);
}

function updatePrologueAudioButton() {
  if (!prologueAudioToggleButton) {
    return;
  }

  if (prologueAudio.paused) {
    prologueAudioToggleButton.textContent = "Play";
    prologueAudioToggleButton.setAttribute("aria-label", "Play prologue narration");
  } else {
    prologueAudioToggleButton.textContent = "Pause";
    prologueAudioToggleButton.setAttribute("aria-label", "Pause prologue narration");
  }
}

function loadPrologueAudio() {
  updatePrologueAudioPlayer();
  updatePrologueAudioButton();
}

function togglePrologueAudio() {
  if (!prologueAudio.src) {
    prologueAudio.src = prologueAudioPath;
    prologueAudio.load();
  }

  if (prologueAudio.paused) {
    prologueAudio.play().catch(function (error) {
      console.warn("Prologue narration is unavailable.", error);
    });
  } else {
    prologueAudio.pause();
  }

  updatePrologueAudioButton();
}

function pausePrologueAudio() {
  prologueAudio.pause();
  prologueAudio.currentTime = 0;
  updatePrologueAudioPlayer();
  updatePrologueAudioButton();
}

function updateFragmentAudioPlayer() {
  if (!fragmentAudioProgress || !fragmentCurrentTime || !fragmentDuration) {
    return;
  }

  const duration = Number.isFinite(fragmentAudio.duration) ? fragmentAudio.duration : 0;
  const currentTime = Number.isFinite(fragmentAudio.currentTime) ? fragmentAudio.currentTime : 0;
  const progressValue = duration > 0 ? (currentTime / duration) * 100 : 0;

  fragmentAudioProgress.value = String(progressValue);
  fragmentCurrentTime.textContent = formatAudioTime(currentTime);
  fragmentDuration.textContent = formatAudioTime(duration);
}

function updateFragmentAudioButton() {
  if (!fragmentAudioToggleButton) {
    return;
  }

  if (fragmentAudio.paused) {
    fragmentAudioToggleButton.textContent = "Play";
    fragmentAudioToggleButton.setAttribute("aria-label", "Play fragment narration");
  } else {
    fragmentAudioToggleButton.textContent = "Pause";
    fragmentAudioToggleButton.setAttribute("aria-label", "Pause fragment narration");
  }
}

function loadFragmentAudio(audioPath) {
  fragmentAudio.pause();
  fragmentAudio.currentTime = 0;
  fragmentAudio.src = audioPath;
  fragmentAudio.load();
  updateFragmentAudioPlayer();
  updateFragmentAudioButton();
}

function toggleFragmentAudio() {
  if (!fragmentAudio.src) {
    return;
  }

  if (fragmentAudio.paused) {
    fragmentAudio.play().catch(function (error) {
      console.warn("Fragment narration is unavailable.", error);
    });
  } else {
    fragmentAudio.pause();
  }

  updateFragmentAudioButton();
}

function pauseFragmentAudio() {
  fragmentAudio.pause();
  fragmentAudio.currentTime = 0;
  updateFragmentAudioPlayer();
  updateFragmentAudioButton();
}

function updateChapterAudioPlayer() {
  if (!chapterAudioProgress || !chapterCurrentTime || !chapterDuration) {
    return;
  }

  const duration = Number.isFinite(chapterAudio.duration) ? chapterAudio.duration : 0;
  const currentTime = Number.isFinite(chapterAudio.currentTime) ? chapterAudio.currentTime : 0;
  const progressValue = duration > 0 ? (currentTime / duration) * 100 : 0;

  chapterAudioProgress.value = String(progressValue);
  chapterCurrentTime.textContent = formatAudioTime(currentTime);
  chapterDuration.textContent = formatAudioTime(duration);
}

function updateChapterAudioButton() {
  if (!chapterAudioToggleButton) {
    return;
  }

  if (chapterAudio.paused) {
    chapterAudioToggleButton.textContent = "Play";
    chapterAudioToggleButton.setAttribute("aria-label", "Play chapter narration");
  } else {
    chapterAudioToggleButton.textContent = "Pause";
    chapterAudioToggleButton.setAttribute("aria-label", "Pause chapter narration");
  }
}

function loadChapterAudio(audioPath) {
  chapterAudio.pause();
  chapterAudio.currentTime = 0;
  chapterAudio.src = audioPath;
  chapterAudio.load();
  updateChapterAudioPlayer();
  updateChapterAudioButton();
}

function toggleChapterAudio() {
  if (!chapterAudio.src) {
    return;
  }

  if (chapterAudio.paused) {
    chapterAudio.play().catch(function (error) {
      console.warn("Chapter narration is unavailable.", error);
    });
  } else {
    chapterAudio.pause();
  }

  updateChapterAudioButton();
}

function pauseChapterAudio() {
  chapterAudio.pause();
  chapterAudio.currentTime = 0;
  updateChapterAudioPlayer();
  updateChapterAudioButton();
}

function updateFinalAudioPlayer() {
  if (!finalAudioProgress || !finalCurrentTime || !finalDuration) {
    return;
  }

  const duration = Number.isFinite(finalStoryAudio.duration) ? finalStoryAudio.duration : 0;
  const currentTime = Number.isFinite(finalStoryAudio.currentTime) ? finalStoryAudio.currentTime : 0;
  const progressValue = duration > 0 ? (currentTime / duration) * 100 : 0;

  finalAudioProgress.value = String(progressValue);
  finalCurrentTime.textContent = formatAudioTime(currentTime);
  finalDuration.textContent = formatAudioTime(duration);
}

function updateFinalAudioButton() {
  if (!finalAudioToggleButton) {
    return;
  }

  if (finalStoryAudio.paused) {
    finalAudioToggleButton.textContent = "Play";
    finalAudioToggleButton.setAttribute("aria-label", "Play full story audio");
  } else {
    finalAudioToggleButton.textContent = "Pause";
    finalAudioToggleButton.setAttribute("aria-label", "Pause full story audio");
  }
}

function loadFinalStoryAudio(audioPath) {
  finalStoryAudio.pause();
  finalStoryAudio.currentTime = 0;
  finalStoryAudio.src = audioPath;
  finalStoryAudio.load();
  updateFinalAudioPlayer();
  updateFinalAudioButton();
}

function toggleFinalStoryAudio() {
  if (!finalStoryAudio.src) {
    return;
  }

  if (finalStoryAudio.paused) {
    finalStoryAudio.play().catch(function (error) {
      console.warn("Final story audio is unavailable.", error);
    });
  } else {
    finalStoryAudio.pause();
  }

  updateFinalAudioButton();
}

function playFinalStoryAudio() {
  if (!finalStoryAudio.src) {
    return;
  }

  finalStoryAudio.play().catch(function (error) {
    // If the audio file is missing for now, the game should still open the final screen.
    console.warn("Final story audio could not start.", error);
  });

  updateFinalAudioButton();
}

function pauseFinalStoryAudio() {
  finalStoryAudio.pause();
  finalStoryAudio.currentTime = 0;
  updateFinalAudioPlayer();
  updateFinalAudioButton();
}

prologueAudio.addEventListener("loadedmetadata", updatePrologueAudioPlayer);
prologueAudio.addEventListener("timeupdate", updatePrologueAudioPlayer);
prologueAudio.addEventListener("ended", function () {
  prologueAudio.currentTime = 0;
  updatePrologueAudioPlayer();
  updatePrologueAudioButton();
});

fragmentAudio.addEventListener("loadedmetadata", updateFragmentAudioPlayer);
fragmentAudio.addEventListener("timeupdate", updateFragmentAudioPlayer);
fragmentAudio.addEventListener("ended", function () {
  fragmentAudio.currentTime = 0;
  updateFragmentAudioPlayer();
  updateFragmentAudioButton();
});

chapterAudio.addEventListener("loadedmetadata", updateChapterAudioPlayer);
chapterAudio.addEventListener("timeupdate", updateChapterAudioPlayer);
chapterAudio.addEventListener("ended", function () {
  chapterAudio.currentTime = 0;
  updateChapterAudioPlayer();
  updateChapterAudioButton();
});

finalStoryAudio.addEventListener("loadedmetadata", updateFinalAudioPlayer);
finalStoryAudio.addEventListener("timeupdate", updateFinalAudioPlayer);
finalStoryAudio.addEventListener("ended", function () {
  finalStoryAudio.currentTime = 0;
  updateFinalAudioPlayer();
  updateFinalAudioButton();
});

if (prologueAudioProgress) {
  prologueAudioProgress.addEventListener("input", function (event) {
    const progressValue = Number(event.target.value);

    if (Number.isFinite(prologueAudio.duration) && prologueAudio.duration > 0) {
      prologueAudio.currentTime = (progressValue / 100) * prologueAudio.duration;
      updatePrologueAudioPlayer();
    }
  });
}

if (fragmentAudioProgress) {
  fragmentAudioProgress.addEventListener("input", function (event) {
    const progressValue = Number(event.target.value);

    if (Number.isFinite(fragmentAudio.duration) && fragmentAudio.duration > 0) {
      fragmentAudio.currentTime = (progressValue / 100) * fragmentAudio.duration;
      updateFragmentAudioPlayer();
    }
  });
}

if (chapterAudioProgress) {
  chapterAudioProgress.addEventListener("input", function (event) {
    const progressValue = Number(event.target.value);

    if (Number.isFinite(chapterAudio.duration) && chapterAudio.duration > 0) {
      chapterAudio.currentTime = (progressValue / 100) * chapterAudio.duration;
      updateChapterAudioPlayer();
    }
  });
}

if (finalAudioProgress) {
  finalAudioProgress.addEventListener("input", function (event) {
    const progressValue = Number(event.target.value);

    if (Number.isFinite(finalStoryAudio.duration) && finalStoryAudio.duration > 0) {
      finalStoryAudio.currentTime = (progressValue / 100) * finalStoryAudio.duration;
      updateFinalAudioPlayer();
    }
  });
}

loadPrologueAudio();
updateFragmentAudioPlayer();
updateFragmentAudioButton();
updateChapterAudioPlayer();
updateChapterAudioButton();
updateFinalAudioPlayer();
updateFinalAudioButton();
