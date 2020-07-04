(function () {
  var output = document.querySelector('#output');
  var download = document.querySelector('#download');
  var canvas = document.querySelector('canvas');
  var outputString = '';

  document.querySelector('#getfile').addEventListener('change', getfile, false);

  function getfile(e) {
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];

    // Get exif data
    EXIF.getData(file,
      function() {
        outputString = 'Removed Data:<br><ul>';
        var exifTags = EXIF.getAllTags(this);

        // Write exifTags to outputString
        for (var tag in exifTags) {
          if (tag === 'MakerNote') { continue; } // skip MakerNote because it can be huge!
          value = exifTags[tag];
          outputString += '<li>' + tag + ': ' + value + '</li>';
        }
        // Set output - tags
        output.innerHTML = outputString + '</ul>';

        // Check for tags, if not image is clean
        if (Object.keys(exifTags).length > 0) {
          var filereader = new FileReader();
          filereader.readAsDataURL(file);
          filereader.onload = function(ev) {
            loadImage(ev.target.result, file.name);
          };
        } else {
          // Set output and download url - no tags
          output.innerHTML = 'Removed Data: <br>No EXIF data found, image is already clean! 🎉';
          download.innerHTML = '<a class="btn btn-warning btn-lg" href="#" disabled >Download your photo</a>';
        }
      });
    }

    function loadImage(file, fileName) {
      var img = new Image();
      img.src = file;
      img.onload = function() {
        imagetocanvas(this, img.naturalWidth, img.naturalHeight, fileName);
      };
    }

    // Canvas will only have image data no metadata
    function imagetocanvas(img, w, h, fileName) {
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      var dlFileName = 'Cleaned_' + fileName;

      // convert to blob, because href limit
      var imgData = canvas.toDataURL('image/jpeg', 10);
      var blob = dataURLtoBlob(imgData);
      var objurl = URL.createObjectURL(blob);

      // Create download link
      download.innerHTML = '<a class="btn btn-success btn-lg" href="' + objurl + '" ' + 'download="' + dlFileName + '">Download your photo</a>';

      // Scroll to download link
      if (!inViewport(download)){
        download.scrollIntoView();
      }
    }

    function dataURLtoBlob(dataurl) {
      var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    }

    function inViewport (el) {
      var r, html;
      if ( !el || 1 !== el.nodeType ) { return false; }
      html = document.documentElement;
      r = el.getBoundingClientRect();
      return ( !!r
        && r.bottom >= 0
        && r.right >= 0
        && r.top <= html.clientHeight
        && r.left <= html.clientWidth
      );
    }
  })();
