// database.js
var db;
var videoElement = document.getElementById('backgroundVideo');
var help = document.querySelector('.help');
document.addEventListener('DOMContentLoaded', initializeDatabase);

function initializeDatabase() {
  console.log("Database Init");
  db = indexedDB.open('NewTab_videos_database', 1);

  db.onerror = OpenDatabaseError;
  db.onupgradeneeded = OpenDatabaseOldVersion;
  db.onsuccess = function (event) {
    db = event.target.result;
    LoadVideoFromDatabase();
  }
}

function OpenDatabaseError(event) {
  console.error("Database error: " + db.errorCode);
}

function OpenDatabaseOldVersion(event) {
  // cree la database
  db = event.target.result;
  var objectStore = db.createObjectStore('videos', {
    keyPath: 'id',
    autoIncrement: true
  });
}

// Function to load video from IndexedDB
function LoadVideoFromDatabase() {
  var transaction = db.transaction(['videos'], 'readonly');
  var objectStore = transaction.objectStore('videos');
  var request = objectStore.getAll();

  request.onsuccess = function (event) {
    var videos = event.target.result;
    LoadVideoIndex(videos);

    if (videos && videos.length > 0) {
      help.style.visibility = 'hidden';

      // Assuming the first video in the database
      console.log(vIndex);
      var videoData = videos[vIndex];
      var videoBlob = videoData.video;
      var blobUrl = URL.createObjectURL(videoBlob);
      videoElement.dataset.videoId = videoData.id;
      videoElement.type = 'video/mp4';
      videoElement.src = blobUrl;
      videoElement.play();
      console.log('Video Init');
      UpdateSelected();
    } else {
      help.style.visibility = 'visible';
      console.log('No videos found in the database.');
    }
  };

  request.onerror = function (event) {
    console.error('Error loading videos from database: ' + event.target.errorCode);
  };
}

async function LoadGallery() {
  var videoList = document.getElementById("videos");
  videoList.innerHTML = ''; // Remove all child elements

  var transaction = db.transaction(['videos'], 'readonly');
  var objectStore = transaction.objectStore('videos');
  var request = objectStore.getAll();

  request.onsuccess = function (event) {
    var videos = event.target.result;
    for (var i = 0; i < videos.length; i++) {
      var videoData = videos[i];
      var blobUrl = URL.createObjectURL(videoData.thumbnail);

      var container = document.createElement('div');
      container.classList.add('video-container');

      var img = document.createElement('img');
      img.src = blobUrl;
      img.alt = 'Thumbnail';
      img.classList.add('thumbnail');
      img.dataset.videoId = videoData.id;

      // Click to play video
      img.addEventListener('click', function () {
        playVideo(this);
      });

      var removeButton = document.createElement('button');
      removeButton.classList.add('remove-btn');
      removeButton.dataset.videoId = videoData.id;
      removeButton.addEventListener('click', function (event) {
        event.stopPropagation(); // Prevent triggering video play
        removeVideo(this);
      });

      var icon = document.createElement('img');
      icon.src = 'icons/cross.png';
      icon.alt = 'Remove';

      container.appendChild(img);
      container.appendChild(removeButton);
      removeButton.appendChild(icon);
      videoList.appendChild(container);
    }
    UpdateSelected();
  };

  request.onerror = function (event) {
    console.error('Error loading videos from database: ' + event.target.errorCode);
  };
}

// Function to save video and extract thumbnail to IndexedDB
async function saveVideo(videoFile) {
  // Load video in background
  const videoElement = document.createElement('video');
  videoElement.src = URL.createObjectURL(videoFile);

  // Wait for video to start playing
  await new Promise(resolve => {
    videoElement.onplaying = resolve;
    videoElement.play().catch(error => {
      console.error('Error playing video:', error);
      resolve(); // Resolve even if video couldn't be played
    });
  });

  // Extract thumbnail from the video
  const thumbnailBlob = await extractThumbnail(videoElement);

  // Convert Blob to File
  const thumbnailFile = new File([thumbnailBlob], 'thumbnail.jpg', {
    type: 'image/jpeg'
  });

  // Save video and thumbnail to IndexedDB
  return new Promise((resolve, reject) => {
    var transaction = db.transaction(['videos'], 'readwrite');
    var objectStore = transaction.objectStore('videos');
    var request = objectStore.add({
      video: videoFile,
      thumbnail: thumbnailFile
    });

    request.onsuccess = function (event) {
      const saveEvent = new CustomEvent('fileSaved', {
        detail: {
          fileId: event.target.result
        }
      });
      window.dispatchEvent(saveEvent);
      resolve();
    };

    request.onerror = function (event) {
      console.error('Error saving video: ' + event.target.errorCode);
      reject(event.target.error);
    };
  }).finally(() => {
    // Unload video
    videoElement.src = '';
    URL.revokeObjectURL(videoElement.src);
  });
}

async function removeVideo(elementButton) {
  var index = elementButton.dataset.videoId;

  var transaction = db.transaction(['videos'], 'readwrite');
  var objectStore = transaction.objectStore('videos');
  var request = objectStore.delete(Number(index));

  if (index === videoElement.dataset.videoId)
    videoElement.src = "";

  request.onsuccess = function () {
    console.log('Video removed:', index);
    LoadGallery(); // Refresh the gallery after removal
  };

  request.onerror = function (event) {
    console.error('Error removing video:', event.target.errorCode);
  };
}

// Function to extract thumbnail from a video element
async function extractThumbnail(videoElement) {
  // Create canvas element
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // Set canvas dimensions
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;

  // Draw video frame on canvas
  ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

  // Convert canvas to Blob (thumbnail)
  return new Promise((resolve) => {
    canvas.toBlob(resolve, 'image/jpeg');
  });
}

// Function to play selected video
function playVideo(elementImg) {
  var index = elementImg.dataset.videoId;

  var transaction = db.transaction(['videos'], 'readonly');
  var objectStore = transaction.objectStore('videos');

  var request = objectStore.get(Number(index));

  request.onsuccess = function (event) {
    var data = event.target.result;
    var videoBlob = data.video;
    var blobUrl = URL.createObjectURL(videoBlob);
    var videoElement = document.getElementById('backgroundVideo');
    videoElement.dataset.videoId = index;
    videoElement.src = blobUrl;
    videoElement.type = 'video/mp4';
    videoElement.play();
    UpdateSelected();
  };

  request.onerror = function (event) {
    console.error('Error fetching video:', event.target.errorCode);
  };
}

function UpdateSelected() {
  var selectedId = videoElement.dataset.videoId;
  var videoContainers = document.querySelectorAll('.video-container');
  console.log(videoContainers);

  videoContainers.forEach(function (container) {
    var img = container.querySelector('.thumbnail');
    var videoId = img.dataset.videoId;

    if (videoId == selectedId) {
      console.log("set selection", selectedId);
      img.classList.add('playing');
    } else {
      img.classList.remove('playing');
    }
  });
}
