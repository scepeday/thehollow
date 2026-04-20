const scannerMessage = document.querySelector("[data-scanner-message]");
const scanAreaButton = document.querySelector('[data-action="open-scanner"]');

let scannerStream = null;
let scannerTimer = null;
let scannerVideo = document.createElement("video");
scannerVideo.setAttribute("playsinline", "");
scannerVideo.muted = true;

function getScannerVideo() {
  return scannerVideo;
}

function showScannerMessage(message) {
  if (scannerMessage) {
    scannerMessage.textContent = message;
  }
}

function stopQrScanner() {
  if (scannerTimer) {
    clearInterval(scannerTimer);
    scannerTimer = null;
  }

  if (scannerStream) {
    const tracks = scannerStream.getTracks();

    for (let i = 0; i < tracks.length; i += 1) {
      tracks[i].stop();
    }

    scannerStream = null;
  }

  const video = getScannerVideo();

  if (video) {
    video.pause();
    video.srcObject = null;
  }

  if (scanAreaButton) {
    scanAreaButton.disabled = false;
  }
}

function requestCameraPermission() {
  return navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: "environment"
    }
  });
}

function canBrowserScanQrCodes() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    return false;
  }

  if (typeof BarcodeDetector === "undefined") {
    return false;
  }

  return true;
}

function handleScannedQr(qrValue) {
  const scannedCard = findCardByQrValue(qrValue);

  if (!scannedCard) {
    showScannerMessage("That QR code was not found in the game data yet.");
    return;
  }

  saveScannedCard(scannedCard);
  stopQrScanner();

  if (scannedCard.type === "fragment") {
    showFragmentScreen(scannedCard.id);
  }

  if (scannedCard.type === "chapter") {
    showChapterScreen(scannedCard.id);
  }
}

function scanQrCode() {
  const video = getScannerVideo();

  if (!video || !canBrowserScanQrCodes()) {
    showScannerMessage("This browser cannot scan inside the game. Use your phone Camera app to scan the card QR code.");
    return;
  }

  const barcodeDetector = new BarcodeDetector({
    formats: ["qr_code"]
  });

  scannerTimer = setInterval(function () {
    barcodeDetector.detect(video)
      .then(function (barcodes) {
        if (barcodes.length > 0) {
          handleScannedQr(barcodes[0].rawValue);
        }
      })
      .catch(function () {
        showScannerMessage("Scanning is still trying to read the QR code.");
      });
  }, 1000);
}

function startQrScanner() {
  const video = getScannerVideo();

  if (!canBrowserScanQrCodes()) {
    showScannerMessage("This browser cannot scan inside the game. Use your phone Camera app to scan the card QR code.");
    return;
  }

  showScannerMessage("Allow camera access to scan your card.");

  requestCameraPermission()
    .then(function (stream) {
      scannerStream = stream;

      if (video) {
        video.srcObject = stream;
        video.play();
      }

      if (scanAreaButton) {
        scanAreaButton.disabled = true;
      }

      showScannerMessage("Point your camera at a Chapter or Fragment QR card.");
      scanQrCode();
    })
    .catch(function () {
      showScannerMessage("Camera access is needed to scan your card.");
    });
}
