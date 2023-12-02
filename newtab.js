// Call the function to play a random video when the page loads
playRandomVideo();

function playRandomVideo() {
  const videoFolder = "videos"; // Folder name where your videos are stored
  const randomVideo = document.getElementById("randomVideo");

  // Function to unload the video
  function unloadVideo() {
    randomVideo.pause();
    randomVideo.src = "";
  }

  // Fetch the list of video files
  chrome.runtime.getPackageDirectoryEntry(function (directoryEntry) 
  {
    directoryEntry.getDirectory(
      videoFolder,
      {},
      function (folderEntry) {
        const reader = folderEntry.createReader();
        let videoFileNames = [];

        // Read all video files in the folder
        reader.readEntries(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isFile && entry.name.endsWith(".mp4")) {
              videoFileNames.push(entry.name);
            }
          });

          if (videoFileNames.length === 0) {
            console.error("No video files found in the 'videos' folder.");
            return;
          }

          // Shuffle the videoFileNames array to randomize the order
          shuffleArray(videoFileNames);

          let currentIndex = 0;

          // Function to shuffle the array (Fisher-Yates algorithm)
          function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [array[i], array[j]] = [array[j], array[i]];
            }
          }

          function playNextVideo() {
            if (currentIndex >= videoFileNames.length) {
              // If all videos have been played, shuffle and start over
              shuffleArray(videoFileNames);
              currentIndex = 0;
            }

            const randomVideoFileName = videoFileNames[currentIndex];
            currentIndex++;

            // Set the source of the video element to the next random video file
            randomVideo.src = `chrome-extension://${chrome.runtime.id}/${videoFolder}/${randomVideoFileName}`;

            // Load and play the video
            randomVideo.load();
            randomVideo.play();
          }

          // Initial play
          playNextVideo();

          // Listen for tab removal events
          chrome.tabs.onRemoved.addListener(function (tabId) {
            if (tabId === chrome.tabs.TAB_ID_NONE) {
              unloadVideo();
            }
          });

          // Listen for navigation events (e.g., search)
          chrome.webNavigation.onBeforeNavigate.addListener(function (details) 
		  {
            if (details.tabId === randomVideo.tabId) {
              unloadVideo();
            }
          });

          // Listen for video ended event and play the next one
          randomVideo.addEventListener("ended", function () 
		  {
            playNextVideo();
          });
        });
      },
      function (error) {
        console.error("An error occurred while accessing the 'videos' folder:", error);
      }
    );
  });
}

document.addEventListener("DOMContentLoaded", function () 
{
  // Select the date and time elements
  var dateElement = document.querySelector(".date");
  var timeElement = document.querySelector(".time");

  var week = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  updateTime(); // Call it once to set initial values

  // Update time every second
  var timerID = setInterval(updateTime, 1000);

  function updateTime() 
  {
    var cd = new Date();
    var formattedTime =
      zeroPadding(cd.getHours(), 2) +
      ':' +
      zeroPadding(cd.getMinutes(), 2) +
      ':' +
      zeroPadding(cd.getSeconds(), 2);
    var formattedDate =
      zeroPadding(cd.getFullYear(), 4) +
      '-' +
      zeroPadding(cd.getMonth() + 1, 2) +
      '-' +
      zeroPadding(cd.getDate(), 2) +
      ' ' +
      week[cd.getDay()];

    // Update the content of date and time elements
    dateElement.textContent = formattedDate;
    timeElement.textContent = formattedTime;
  }

  function zeroPadding(num, digit) 
  {
    var zero = '';
    for (var i = 0; i < digit; i++) 
	{
      zero += '0';
    }
    return (zero + num).slice(-digit);
  }
});

