const injectShell = () => {
  // MODAL CSS STYLE
  const modalStyle = document.createElement('style');
  modalStyle.innerHTML = `
  /* Greeting Modal Container */
  #greeting-modal {
    visibility: hidden;
    opacity: 0;
    transition: all 0.1s cubic-bezier(0.075, 0.82, 0.165, 1);
  }

  /* Greeting Modal Container - when open */
  #greeting-modal:target {
    visibility: visible;
    opacity: 1;
  }

  /* Greeting Modal */
  #greeting-modal #modal {
    opacity: 0;
    transform: translateY(-1rem);
    transition: all 0.1s cubic-bezier(0.075, 0.82, 0.165, 1);
    transition-delay: 0.1s;
  }

  /* Greeting Modal - when open */
  #greeting-modal:target #modal {
  transform: translateY(0);
  opacity: 1;
  }

  /* Modal Container Styles for flex box */
  .modal-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    backdrop-filter: blur(5px);
  }

  /* Modal Background Styles */
  .modal-bg {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(5px);
  }

  /* Modal Body Styles */
  #modal {
    z-index: 1;
    background-color: white;
    width: max-content; /* 500px */
    padding: 1rem;
    border-radius: 8px;
  }

  #modal .close {
    position: absolute;
    right: -16px;
    top: -16px;
    width: 32px;
    height: 32px;
    opacity: 0.3;
  }
  #modal .close:hover {
    opacity: 1;
  }

  #modal .close:before, .close:after {
    position: absolute;
    left: 16px;
    content: ' ';
    height: 34px;
    width: 3px;
    background-color: #333;
  }
  #modal .close:before {
    transform: rotate(45deg);
  }
  #modal .close:after {
    transform: rotate(-45deg);
  }


`;

  // attach modal css style to head
  document.head.appendChild(modalStyle);

  // MODAL & VIDEO DOM FRAGMENTS
  const modalDOM = document.createRange().createContextualFragment(`
  <!-- Modal container -->
  <div class="modal-container" id="greeting-modal">

    <!-- Modal  -->
    <div id="modal">
      <video id="video-preview" muted style="display: none;"></video>
      <video id="video-playback" controls style="display: none"></video>
      <div id="modal-content"></div>
      <a href="#" class="close">
    </div>

    <!-- Background, click to close -->
    <a href="#" class="modal-bg"></a>
  </div>
`);

  // attach modal DOM fragment to body
  document.body.appendChild(modalDOM);
};

injectShell();

// logs all Audio/Video IO connections:
navigator.mediaDevices
  .enumerateDevices()
  .then((devices) => {
    devices.forEach((device) => {
      console.log(device.kind.toUpperCase(), device.label); // , device.deviceId
    });
  })
  .catch((err) => {
    console.log(err.name, err.message);
  });

// UTILITY FUNCTIONS
const toggleModal = () => {
  // check for injected modal components
  if (!document.getElementById('greeting-modal')) {
    injectShell();
  }
  window.location.href = window.location.href.indexOf('#greeting-modal') !== -1
    ? '#'
    : '#greeting-modal';
};

const modalContent = (htmlContent, backgroundColor = 'white') => {
  const getModalContent = document.getElementById('modal-content');
  const getModalBackground = document.getElementById('modal');
  // override default background
  getModalBackground.style.backgroundColor = backgroundColor;

  if (htmlContent === '#video-preview') {
    // make sure to hide #video-playback
    document.getElementById('video-playback').style.display = 'none';
    // make sure the clean residual content in getModalContent
    getModalContent.innerHTML = '';
    // show #video-preview
    document.getElementById('video-preview').style.display = 'block';
  } else if (htmlContent === '#video-playback') {
    // make sure to hide #video-preview
    document.getElementById('video-preview').style.display = 'none';
    getModalContent.innerHTML = '';
    // show #video-playback
    document.getElementById('video-playback').style.display = 'block';
  } else {
    // make sure to hide both
    document.getElementById('video-preview').style.display = 'none';
    document.getElementById('video-playback').style.display = 'none';
    // show provided html cotent
    getModalContent.innerHTML = htmlContent;
  }
  // show modal
  window.location.href = '#greeting-modal';
};

const startStream = (constraintObject = { audio: true, video: { facingMode: 'user', frameRate: { ideal: 10, max: 30 } } }) => {
  if (!document.getElementById('greeting-modal')) {
    injectShell();
  }
  navigator.mediaDevices
    .getUserMedia(constraintObject)
    .then((stream) => {
      window.localStream = stream;
      const video = document.querySelector('#video-preview');

      if ('srcObject' in video) {
        video.srcObject = stream;
      } else {
        // legacy version
        video.src = window.URL.createObjectURL(stream);
      }

      // Attach stream
      video.onloadedmetadata = () => video.play();
    })
    .catch((err) => console.log(err.name, err.message));
};

const stopStream = () => {
  if ('localStream' in window) {
    window.localStream.getTracks().forEach((track) => track.stop());
  }
};

const startRecorder = (constraintObject = { audio: true, video: { facingMode: 'user', frameRate: { ideal: 10, max: 30 } } }) => {
  // check if there is an active stream, if not start one
  if (!('localStream' in window && window.localStream.active)) {
    startStream(constraintObject);
  }
  // todo use a promise here instead of timeout
  setTimeout(() => {
    let options = { mimeType: 'video/webm;codecs=vp9,opus' };
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      console.error(`${options.mimeType} is not supported`);
      options = { mimeType: 'video/webm;codecs=vp8,opus' };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.error(`${options.mimeType} is not supported`);
        options = { mimeType: 'video/webm' };
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          console.error(`${options.mimeType} is not supported`);
          options = { mimeType: '' };
        }
      }
    }
    // recrod stream
    window.mediaRecorder = new MediaRecorder(window.localStream, options);
    window.dataChunks = [];
    window.mediaRecorder.start();
    console.log(window.mediaRecorder.state);
    window.mediaRecorder.ondataavailable = (e) => window.dataChunks.push(e.data);
  }, 2000);
};

const stopRecorder = () => {
  if ('mediaRecorder' in window && window.mediaRecorder.state === 'recording') {
    window.mediaRecorder.stop();
    console.log(window.mediaRecorder.state);
    window.mediaRecorder.onstop = () => {
      window.blob = new Blob(window.dataChunks, { type: 'video/webm' });
      // reset dataChunks (for consecutive videos)
      window.dataChunks = [];
      const videoURL = window.URL.createObjectURL(window.blob);
      // tack to the videoPlayback element
      const videoPlayback = document.getElementById('video-playback');
      videoPlayback.src = videoURL;
    };
  }
  stopStream();
};

// upload the blob
// default filename (fname) is ISO 8601 timestamp (character-adjusted due to filename limitations)
const uploadVideo = (modalObj) => {
  // only continue if there something if there is a video blob
  if ('blob' in window) {
    // prevent browser to close
    window.onbeforeunload = (e) => {
      // Cancel the event
      // If you prevent default behavior in Mozilla Firefox prompt will always be shown
      e.preventDefault();
      // Chrome requires returnValue to be set
      e.returnValue = '';
    };

    const modalObjectDefaults = {
      fname: new Date().toISOString().replaceAll(':', '-').replace('.', '-'),
      uploadContent: '<h1>Uploading</h1>',
      uploadColor: 'coral',
      successContent: '<h1>Successful</h1>',
      successColor: 'cyan',
    };

    // merge modal user object with the default modal object
    const modalObject = { ...modalObjectDefaults, ...modalObj };

    // show uploading dialog
    modalContent(modalObject.uploadContent, modalObject.uploadColor);

    // ☁️ upload process starts here...
    // define endpoint
    const endpoint = 'data/upload_video.php';
    // Create a FormData object
    const formData = new FormData();
    // append the video file (i.e., the recorded blob)
    formData.append('vidfile', window.blob, modalObject.fname);
    // post the file using fetch
    fetch(endpoint, {
      method: 'POST',
      body: formData, // formData
    }).then()
      .then(() => {
        // release closing lock
        window.onbeforeunload = null;
        modalContent(modalObject.successContent, modalObject.successColor);
      })
      .catch(console.error);
  } else {
    // if no blob is in window show warning:
    modalContent('<h1>No recording was found 😔</h1>', 'PeachPuff');
  }
};

module.exports = {
  injectShell,
  toggleModal,
  startStream,
  stopStream,
  startRecorder,
  stopRecorder,
  uploadVideo,
};
