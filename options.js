const clockVisible = "clockVisible"
const soundEnabled = "soundEnabled"

document.addEventListener("DOMContentLoaded", function() 
{
  const div = document.getElementById("buttons");
  const buttons = document.querySelectorAll(".options");
	
  buttons.forEach(function (button) 
  {
	button.addEventListener("click", buttonsClick);
	buttonsInit(button.id);
  })
  
  console.log(window.location.href);
});

function buttonsInit(buttonId)
{
  switch(buttonId)
  {
    case "clockButton":  clockButtonInit();  return;
    case "soundButton":  soundButtonInit();  return;
	case "folderButton": folderButtonInit(); return;
    default: 			                     return;
  }
}

function buttonsClick(event) 
{
  switch (event.target.id) 
  {
    case "clockButton": clockButtonClicked();   return;
    case "soundButton": soundButtonClicked();   return;
	case "folderButton": folderButtonClicked(); return;
    default: 			                        return;
  }
}

/**************************************/
/***          CLOCK BUTTON          ***/
/**************************************/
function clockButtonInit()
{
  var isVisible = localStorage.getItem(clockVisible);
  setClockVisibility(isVisible);
  console.log("Clock Init");
}

function clockButtonClicked() 
{
  var isVisible = localStorage.getItem(clockVisible) === "true" ? "false" : "true";
  localStorage.setItem(clockVisible, isVisible);
  setClockVisibility(isVisible);
  console.log("Clock Set To : " + isVisible);
}

function setClockVisibility (isVisible)
{
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
function soundButtonInit()
{
  var isEnabled = localStorage.getItem(soundEnabled);
  setSoundEnabled(isEnabled);
  console.log("Sound Init");
}

function soundButtonClicked() 
{
  var isEnabled = localStorage.getItem(soundEnabled) === "true" ? "false" : "true";
  localStorage.setItem(soundEnabled, isEnabled);
  setSoundEnabled(isEnabled);
  console.log("Sound Set To : " + isEnabled);
}

function setSoundEnabled (isEnabled)
{
  var button = document.getElementById("soundButton");
  var video = document.getElementById("randomVideo");
  
  var muted = isEnabled === "true" ? true : false;
  var icon = isEnabled === "true" ? "soundOn.png" : "soundOff.png";
  
  video.muted = muted;
  button.style.backgroundImage = "url('icons/" + icon + "')";
}

/**************************************/
/***          FOLDER BUTTON         ***/
/**************************************/
function folderButtonInit()
{
  var button = document.getElementById("folderButton");
  button.style.backgroundImage = "url('icons/folder.png')";
}

function folderButtonClicked() 
{
  const extensionId = chrome.runtime.id;
  const manifest = chrome.runtime.getManifest();
  const extensionVersion = manifest.version + "_0";
  
  var path = "%localappdata%/Google/Chrome/User Data/Default/Extensions/" + extensionId + "/" + extensionVersion;
  
  var msg  = "Path to video folder copied to clipboard!";
  navigator.clipboard.writeText(path).then(function() {showTemporaryMessage(msg) });
}

function showTemporaryMessage(msg)
{
  const messageElement = document.createElement("div");
  messageElement.textContent = msg;
  messageElement.style.position = "fixed";
  messageElement.style.top = "50%";
  messageElement.style.left = "50%";
  messageElement.style.transform = "translate(-50%, -50%)";
  messageElement.style.backgroundColor = "#f3f4f6";
  messageElement.style.padding = "15px";
  messageElement.style.borderRadius = "8px";
  messageElement.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
  messageElement.style.fontFamily = "Arial, sans-serif";
  messageElement.style.fontSize = "16px";
  messageElement.style.color = "#333";
  messageElement.style.textAlign = "center";
  messageElement.style.zIndex = "9999";
  
  // Append the message element to the document body
  document.body.appendChild(messageElement);
  
  // Remove the message element after a delay
  setTimeout(function() {
    document.body.removeChild(messageElement);
  }, 2000); // 2000 milliseconds (2 seconds)
}