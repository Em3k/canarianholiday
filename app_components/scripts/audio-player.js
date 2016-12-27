console.log("### audio-player.js --> LOADED OK ###");



// Create a new instance of an audio object and adjust some of its properties
var audio = new Audio();
audio.src ='assets/audio/cactus_flower_low_volume.mp3'
audio.controls = false;
audio.loop = true;
audio.autoplay = true;

// Establish all variables that your analyser will use
var canvas, ctx, source, contex, analyser, fbc_array, bars, bar_x, bar_width, bar_height;

// Function initMp3Player();
function initMp3Player() {
  document.getElementById('audioPlayer__audioFile-container').appendChild(audio);
  context = new AudioContext();
  analyser = context.createAnalyser();
  canvas = document.getElementById('audioPlayer__equalizer');
  ctx = canvas.getContext('2d');
  // Re-route audio playback into the processing graph of the AudioContext
  source = context.createMediaElementSource(audio);
  source.connect(analyser);
  analyser.connect(context.destination);
  frameLooper();
}

// frameLooper() animates any style of graphics you wish to the audio frequency
function frameLooper() {
window.requestAnimationFrame(frameLooper);
fbc_array = new Uint8Array(analyser.frequencyBinCount);
analyser.getByteFrequencyData(fbc_array);
ctx.clearRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = "#ffffff";
bars = 5;
for (var i = 0; i < bars; i++) {
    bar_x = i * 60;
    bar_width = 42;
    bar_height = -(fbc_array[i] / 1.5);
    // fillRect (x, y, width, height)
    ctx.fillRect(bar_x, canvas.height, bar_width, bar_height);
  }
}
/////////////////////
//   MUTE BUTTON   //
////////////////////
var muteButton = document.getElementById('audioPlayer__mute-button');

muteButton.addEventListener('click', muteSound);

function muteSound() {
    if(audio.muted) {
        audio.muted = false;
    } else {
      audio.muted = true;
    }
}
