const videoFolder = "videos";

playRandomVideo();

function playRandomVideo() 
{
  // Fetch the list of video files
  chrome.runtime.getPackageDirectoryEntry(function(directoryEntry) 
  {
	// Play the video from folder entry
    directoryEntry.getDirectory(videoFolder, {}, function(folderEntry) { playRandomVideoFile(folderEntry); });
  });
}

function playRandomVideoFile(folderEntry) 
{
  const randomVideo = document.getElementById("randomVideo");
  const reader = folderEntry.createReader();

  // Read all video files in the folder
  reader.readEntries(function(entries) 
  {
	// getting video list
    const videoFiles = entries.filter(entry => entry.isFile && entry.name.endsWith(".mp4"));

	// testing if there is video files
    if (videoFiles.length === 0) 
	{
      console.error("No video files found in the 'videos' folder.");
      return;
    }

	// get random index
    const randomIndex = Math.floor(Math.random() * videoFiles.length);
    const randomVideoFileName = videoFiles[randomIndex].name;

    // Set the source of the video element to the random video file
    randomVideo.src = `chrome-extension://${chrome.runtime.id}/${videoFolder}/${randomVideoFileName}`;

    // Load and play the video
    randomVideo.load();
    randomVideo.play();
	
    console.log("Video Playing");
  });
}