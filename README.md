# NewTabVideo
NewTabVideo is a Chrome extension that enhances your browsing experience by playing a random video from the videos folder of the extension each time a new tab is opened or refreshed.

## Video Preview
To see NewTabVideos in action, check out this [video preview](https://youtu.be/jPYcoJ4VupE).

https://github.com/gBottollier/NewTabVideo/assets/89708938/d5d71e77-8eca-4ba6-9ab5-d0cb4e81a1bd

## Installation Instructions
Quick Chrome Web Store Installation (Demo version)
Install NewTabVideo directly from the Chrome Web Store by following this [link](https://chromewebstore.google.com/detail/new-tab/hcllfencdjiekdlgkedhlbcddeocfiga).

### Google Chrome:
- Download or clone the repository from GitHub.
- Extract the downloaded ZIP file wherever you want.
- Open Chrome and navigate to chrome://extensions/.
- Enable Developer Mode (toggle switch in the top right corner).
- Click Load unpacked and select the extracted folder.
- Open a new tab
- you should see a black screen. Follow the instructions below to add a video.
The extension is now installed and ready to use !

### Mozilla Firefox:
- Download the signed firefox extension [here](https://addons.mozilla.org/fr/firefox/addon/newtabvideo).
- Once downloaded, click to install the add-on.
- Open a new tab
- you should see a black screen. Follow the instructions below to add a video.
The extension is now installed and ready to use !

### Adding Videos
Once you've installed the extension, follow these steps to add videos:

- Open a new tab.
- Click the folder button in the top left corner of the NewTabVideo extension (visible on mouse hover).
- It Open File Explorer (or your system’s equivalent).
- Select all the videos you want to add. (*.MP4, other format not tested)
- Click OK to confirm. The videos will be copied to your local file database (IndexedDB).
- Wait until the videos appear in the gallery to ensure they are fully imported.

When adding videos, you must use a dedicated folder on your computer to store them before importing.
Once imported, you may delete this folder if desired, as the videos are copied to your local file database. However, keeping it can serve as a backup.

### Removing Videos
Delete the IndexedDB database to clear all stored videos. The database name is NewTab_videos_database.
- Open Developer Tools in your browser (F12).
- Google Chrome: Go to the Application tab.
  Mozilla Firefox: Go to the Storage tab.
- Expand IndexedDB in the left panel.
- Expand NewTab_videos_database in the left panel. 
- Right-click on videos and select Clear.

All videos are cleared, you can add videos again using the gallery.

## Customizing Wallpaper
Enhance your NewTabVideo experience by personalizing it with your own video wallpapers.

- **Adding Videos**: Simply place your desired video files into the videos folder located within the extension's directory.
- **High-Quality Wallpapers**: For access to a variety of 4K video wallpapers, check out [MoeWalls.com](https://moewalls.com/resolution/3840x2160/)
- **Single Video Option**: If you prefer to have only one video playing, ensure that the videos folder contains just that single file.

## Additional Features
- **Time and Date Display:** NewTabVideo also displays the current time and date on each new tab, adding functionality to its aesthetic appeal.
- **Resolution Compatibility:** The extension is designed to handle all screen resolutions.
- **Settings**: Buttons shown to the top left on mouse over to controls Time and Sound

Enjoy NewTabVideo extension!
