//Antoine Sfeir
let bg, fs, ds;
let labels = [];
let buttons = [],
  sampleNames = ["jazz", "rap", "blues", "edm"];
const delay = new Tone.FeedbackDelay("8n", 0.5);
let samples;

function preload() {
  bg = loadImage("assets/images/djBackground.jpeg");
  samples = new Tone.Players({
    "jazz": "assets/sounds/jazz.mp3",
    "rap": "assets/sounds/rap.mp3",
    "blues": "assets/sounds/blues.mp3",
    "edm": "assets/sounds/edm.mp3",
  }).toDestination();
}

function setup() {
  createCanvas(500, 600);
  samples.connect(delay);
  delay.toDestination();
  labels = ["Delay Time", "Feedback"];
  sampleNames.forEach((name, i) => {
    buttons[i] = createButton(name);
    buttons[i].position(75 + (i * 75), 200);
    buttons[i].mousePressed(() => toggleSound(name));
  });
  ds = createSlider(0, 1, 0, 0.05);
  ds.mouseReleased(() =>  { 
    delay.delayTime.value = ds.value();
  })
  fs = createSlider(0, 1, 0, 0.05);
  fs.mouseReleased(() => {
    delay.feedback.value = fs.value();
  })
}

function draw() {
  background(bg);
  for(let i = 0; i < labels.length; i++) {
    fill(255);
    text(labels[i], 35 + (i * 125), 595);
  }
}

function toggleSound(name) {
    if(samples.player(name).state != "started") {
        samples.player(name).start();
    } else {
        samples.player(name).stop();
    }
}

