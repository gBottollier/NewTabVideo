const clockVisible = "clockVisible"
  const soundEnabled = "soundEnabled"
  const videoIndex = "videoIndex"
  var videoElement = document.getElementById('backgroundVideo');

var vIndex = 0;

document.addEventListener("DOMContentLoaded", function () {
  const div = document.getElementById("buttons");
  const buttons = document.querySelectorAll(".options");

  buttons.forEach(function (button) {
    button.addEventListener("click", buttonsClick);
    buttonsInit(button.id);
  })

  var closeButton = document.getElementById("closeButton");
  closeButton.addEventListener("click", folderButtonClicked);

  var help = document.querySelector('.help');
  help.addEventListener("click", folderButtonClicked);

  console.log(window.location.href);
});

function buttonsInit(buttonId) {
  switch (buttonId) {
  case "clockButton":
    clockButtonInit();
    return;
  case "soundButton":
    soundButtonInit();
    return;
  case "folderButton":
    folderButtonInit();
    return;
  default:
    return;
  }
}

function buttonsClick(event) {
  switch (event.target.id) {
  case "clockButton":
    clockButtonClicked();
    return;
  case "soundButton":
    soundButtonClicked();
    return;
  case "folderButton":
    folderButtonClicked();
    return;
  default:
    return;
  }
}

/**************************************/
/***          CLOCK BUTTON          ***/
/**************************************/
function clockButtonInit() {
  var isVisible = localStorage.getItem(clockVisible);
  setClockVisibility(isVisible);
  console.log("Clock Init");
}

function clockButtonClicked() {
  var isVisible = localStorage.getItem(clockVisible) === "true" ? "false" : "true";
  localStorage.setItem(clockVisible, isVisible);
  setClockVisibility(isVisible);
  console.log("Clock Set To : " + isVisible);
}

function setClockVisibility(isVisible) {
  var clock = document.getElementById("clock");
  var button = document.getElementById("clockButton");

  var display = isVisible === "true" ? "block" : "none";
  var icon = isVisible === "true" ? "timeOn.png" : "timeOff.png";

  clock.style.display = display;
  button.style.backgroundImage = "url('icons/" + icon + "')";
}

/**************************************/
/***          SOUND BUTTON          ***/
/**************************************/
function soundButtonInit() {
  var isEnabled = localStorage.getItem(soundEnabled);
  setSoundEnabled(isEnabled);
  console.log("Sound Init");
}

function soundButtonClicked() {
  var isEnabled = localStorage.getItem(soundEnabled) === "true" ? "false" : "true";
  localStorage.setItem(soundEnabled, isEnabled);
  setSoundEnabled(isEnabled);
  console.log("Sound Set To : " + isEnabled);
}

function setSoundEnabled(isEnabled) {
  var button = document.getElementById("soundButton");
  var video = document.getElementById("backgroundVideo");

  var muted = isEnabled === "true" ? true : false;
  var icon = isEnabled === "true" ? "soundOn.png" : "soundOff.png";

  video.muted = muted;
  button.style.backgroundImage = "url('icons/" + icon + "')";
}

/**************************************/
/***          FOLDER BUTTON         ***/
/**************************************/
function folderButtonInit() {
  var button = document.getElementById("folderButton");
  button.style.backgroundImage = "url('icons/folder.png')";

  var leftPane = document.getElementById('leftPane');
  leftPane.style.display = 'none';
}

function folderButtonClicked() {
  var leftPane = document.getElementById('leftPane');

  if (leftPane.style.display === 'none') {
    leftPane.style.display = 'flex';
    LoadGallery();
  } else {
    leftPane.style.display = 'none';
  }
}

function LoadVideoIndex(videos) {
  var vOldIndex = localStorage.getItem(videoIndex);
  if (isNaN(vOldIndex)) {
    localStorage.setItem(videoIndex, 0);
    vOldIndex = 0;
  }

  vIndex = (parseInt(vOldIndex) + 1) % videos.length;
  localStorage.setItem(videoIndex, vIndex);
  console.log("Video index :" + vIndex);
}

function IsVideoLoaded() {
  if (videoElement.readyState === 4)
    return true;
  return false;
}