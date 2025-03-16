// database.js
var db;
var videoElement = document.getElementById('randomVideo');
document.addEventListener('DOMContentLoaded', initializeDatabase);

function initializeDatabase() 
{
	db = indexedDB.open('NewTab_videos_database', 1);
	
    db.onerror = OpenDatabaseError;
    db.onupgradeneeded = OpenDatabaseOldVersion;
    db.onsuccess = LoadVideoFromDatabase;
}

function OpenDatabaseError(event) 
{
    console.error("Database error: " + db.errorCode);
}

function OpenDatabaseOldVersion(event) 
{
	db = event.target.result;
    var objectStore = db.createObjectStore('videos', { keyPath: 'id', autoIncrement: true });
}

// Function to load video from IndexedDB
function LoadVideoFromDatabase(event) 
{
	db = event.target.result;
	var transaction = db.transaction(['videos'], 'readonly');
	var objectStore = transaction.objectStore('videos');
	var request = objectStore.getAll();

	request.onsuccess = function(event) 
	{
		var videos = event.target.result;
		LoadVideoIndex(videos);
		
		if (videos && videos.length > 0) 
		{
			// Assuming the first video in the database
			console.log(vIndex);
			var videoBlob = videos[vIndex].video;
			var blobUrl = URL.createObjectURL(videoBlob);
			videoElement.type = 'video/mp4';
			videoElement.src = blobUrl;
			videoElement.play();
			
			console.log('Video Init');
		} 
		else 
		{
			console.log('No videos found in the database.');
		}
	};

	request.onerror = function(event) 
	{
		console.error('Error loading videos from database: ' + event.target.errorCode);
	};
}

async function LoadGallery()
{
	var videoList = document.getElementById("videos");
    videoList.innerHTML = ''; // Remove all child elements
	
	var transaction = db.transaction(['videos'], 'readonly');
	var objectStore = transaction.objectStore('videos');
	var request = objectStore.getAll();
	
	request.onsuccess = function(event) 
	{
		var videos = event.target.result;
		for (var i = 0; i < videos.length; i++) 
		{
			var imageBlob = videos[i].thumbnail;
			var blobUrl = URL.createObjectURL(imageBlob);
			var img = document.createElement('img');
            img.src = blobUrl;
            img.alt = 'Thumbnail';
			
			videoList.appendChild(img);
		}
	};

	request.onerror = function(event) 
	{
		console.error('Error loading videos from database: ' + event.target.errorCode);
	};
}

// Function to save video and extract thumbnail to IndexedDB
async function saveVideo(videoFile) 
{
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
    const thumbnailFile = new File([thumbnailBlob], 'thumbnail.jpg', { type: 'image/jpeg' });
    
    // Save video and thumbnail to IndexedDB
    return new Promise((resolve, reject) => {
        var transaction = db.transaction(['videos'], 'readwrite');
        var objectStore = transaction.objectStore('videos');
        var request = objectStore.add({ video: videoFile, thumbnail: thumbnailFile });

        request.onsuccess = function (event) {
			const saveEvent = new CustomEvent('fileSaved', { detail: { fileId: event.target.result } });
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

// Function to extract thumbnail from a video element
async function extractThumbnail(videoElement) 
{
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



