const chapterCards = [
  {
    id: "chapter-1",
    type: "chapter",
    title: "Chapter One",
    label: "Chapter One",
    subtitle: "Tulip",
    image: "assets/images/cards/chapter1/chapter-1.png",
    titleImage: "assets/images/ui/solveScreen/chapter-1.png",
    // TODO: Replace this placeholder chapter audio path with the real file.
    audio: "assets/audio/voice/chapters/chapter-1.mp3",
    route: "#/chapter/chapter-1",
    qrValue: "chapter-1"
  },
  {
    id: "chapter-2",
    type: "chapter",
    title: "Chapter Two",
    label: "Chapter Two",
    subtitle: "Winter",
    image: "assets/images/cards/chapter2/chapter-2.png",
    titleImage: "assets/images/ui/solveScreen/chapter-2.png",
    // TODO: Replace this placeholder chapter audio path with the real file.
    audio: "assets/audio/voice/chapters/chapter-2.mp3",
    route: "#/chapter/chapter-2",
    qrValue: "chapter-2"
  },
  {
    id: "chapter-3",
    type: "chapter",
    title: "Chapter Three",
    label: "Chapter Three",
    subtitle: "Autumn",
    image: "assets/images/cards/chapter3/chapter-3.png",
    titleImage: "assets/images/ui/solveScreen/chapter-3.png",
    // TODO: Replace this placeholder chapter audio path with the real file.
    audio: "assets/audio/voice/chapters/chapter-3.mp3",
    route: "#/chapter/chapter-3",
    qrValue: "chapter-3"
  }
];

const fragmentCards = [
  {
    id: "fragment-01",
    type: "fragment",
    chapter: "chapter-1",
    order: 1,
    image: "assets/images/cards/chapter1/chapter1-fragment1.png",
    // TODO: Replace this placeholder fragment audio path with the real file.
    audio: "assets/audio/voice/fragments/fragment-01.mp3",
    route: "#/fragment/fragment-01",
    qrValue: "fragment-01"
  },
  {
    id: "fragment-02",
    type: "fragment",
    chapter: "chapter-1",
    order: 2,
    image: "assets/images/cards/chapter1/chapter1-fragment2.png",
    // TODO: Replace this placeholder fragment audio path with the real file.
    audio: "assets/audio/voice/fragments/fragment-02.mp3",
    route: "#/fragment/fragment-02",
    qrValue: "fragment-02"
  },
  {
    id: "fragment-03",
    type: "fragment",
    chapter: "chapter-1",
    order: 3,
    image: "assets/images/cards/chapter1/chapter1-fragment3.png",
    // TODO: Replace this placeholder fragment audio path with the real file.
    audio: "assets/audio/voice/fragments/fragment-03.mp3",
    route: "#/fragment/fragment-03",
    qrValue: "fragment-03"
  },
  {
    id: "fragment-04",
    type: "fragment",
    chapter: "chapter-2",
    order: 1,
    image: "assets/images/cards/chapter2/chapter2-fragment1.png",
    // TODO: Replace this placeholder fragment audio path with the real file.
    audio: "assets/audio/voice/fragments/fragment-04.mp3",
    route: "#/fragment/fragment-04",
    qrValue: "fragment-04"
  },
  {
    id: "fragment-05",
    type: "fragment",
    chapter: "chapter-2",
    order: 2,
    image: "assets/images/cards/chapter2/chapter2-fragment2.png",
    // TODO: Replace this placeholder fragment audio path with the real file.
    audio: "assets/audio/voice/fragments/fragment-05.mp3",
    route: "#/fragment/fragment-05",
    qrValue: "fragment-05"
  },
  {
    id: "fragment-06",
    type: "fragment",
    chapter: "chapter-2",
    order: 3,
    image: "assets/images/cards/chapter2/chapter2-fragment3.png",
    // TODO: Replace this placeholder fragment audio path with the real file.
    audio: "assets/audio/voice/fragments/fragment-06.mp3",
    route: "#/fragment/fragment-06",
    qrValue: "fragment-06"
  },
  {
    id: "fragment-07",
    type: "fragment",
    chapter: "chapter-3",
    order: 1,
    image: "assets/images/cards/chapter3/chapter3-fragment1.png",
    // TODO: Replace this placeholder fragment audio path with the real file.
    audio: "assets/audio/voice/fragments/fragment-07.mp3",
    route: "#/fragment/fragment-07",
    qrValue: "fragment-07"
  },
  {
    id: "fragment-08",
    type: "fragment",
    chapter: "chapter-3",
    order: 2,
    image: "assets/images/cards/chapter3/chapter3-fragment2.png",
    // TODO: Replace this placeholder fragment audio path with the real file.
    audio: "assets/audio/voice/fragments/fragment-08.mp3",
    route: "#/fragment/fragment-08",
    qrValue: "fragment-08"
  },
  {
    id: "fragment-09",
    type: "fragment",
    chapter: "chapter-3",
    order: 3,
    image: "assets/images/cards/chapter3/chapter3-fragment3.png",
    // TODO: Replace this placeholder fragment audio path with the real file.
    audio: "assets/audio/voice/fragments/fragment-09.mp3",
    route: "#/fragment/fragment-09",
    qrValue: "fragment-09"
  }
];

function findChapterById(chapterId) {
  for (let i = 0; i < chapterCards.length; i += 1) {
    if (chapterCards[i].id === chapterId) {
      return chapterCards[i];
    }
  }

  return null;
}

function findFragmentById(fragmentId) {
  for (let i = 0; i < fragmentCards.length; i += 1) {
    if (fragmentCards[i].id === fragmentId) {
      return fragmentCards[i];
    }
  }

  return null;
}

function findCardByQrValue(qrValue) {
  for (let i = 0; i < chapterCards.length; i += 1) {
    if (chapterCards[i].qrValue === qrValue) {
      return chapterCards[i];
    }
  }

  for (let i = 0; i < fragmentCards.length; i += 1) {
    if (fragmentCards[i].qrValue === qrValue) {
      return fragmentCards[i];
    }
  }

  return null;
}

function getChapterCards() {
  return chapterCards;
}

function getFragmentCards() {
  return fragmentCards;
}

function getSolveFragments() {
  return fragmentCards;
}

function getSolveChapters() {
  return chapterCards;
}

function getSolveDeckCards() {
  const deckCards = [];

  for (let i = 0; i < chapterCards.length; i += 1) {
    deckCards.push({
      id: `deck-${chapterCards[i].id}`,
      type: "chapter-card",
      image: chapterCards[i].image,
      chapter: chapterCards[i].id
    });
  }

  for (let i = 0; i < fragmentCards.length; i += 1) {
    deckCards.push(fragmentCards[i]);
  }

  return deckCards;
}
