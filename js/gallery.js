var videoList = document.getElementById("videos");

document.addEventListener("DOMContentLoaded", function () {
  var buttonUpload = document.getElementById("upload");
  buttonUpload.addEventListener("click", uploadButtonClicked);
  console.log("Gallery Init");
});

function uploadButtonClicked() {
  var input = document.createElement('input');
  input.type = 'file';
  input.accept = 'video/mp4'; // Accept only mp4 files
  input.multiple = true; // Allow multiple file selection
  input.addEventListener('change', function (event) {
    (async function () { // Immediately-invoked asynchronous function
      var files = event.target.files; // Access files from event.target
      if (files && files.length > 0) { // Ensure files is not undefined
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          var filename = files[i].name;
          if (filename.toLowerCase().endsWith('.mp4') === false)
            continue;

          // In Mo
          var maxsize = 300;
          var filesize = file.size;
          if (filesize > maxsize * 1024 * 1024)
            continue;

          console.log("saving: " + filename);
          await saveVideo(file);
        }
        LoadGallery(); // Call LoadGallery after all files have been saved

        if (!IsVideoLoaded())
          LoadVideoFromDatabase();
      }
    })(); // Invoke the function immediately
  });
  input.click();
}
