 /*
 Author:  Antoine Sfeir
 Date:    3/1/2023
 Class:   CSC 2463
 Purpose: Create a synth that plays notes when keys are pressed
*/

let synth, envelope, filter, bg, volSlider, reverbSlider;

const reverb = new Tone.JCReverb(0.4);

let oscType = 'sawtooth';
let attackTime = 0.2;
let decayTime = 0.2;
let sustainLevel = 1;
let releaseTime = 0.5;
let filterFreq = 4000;
let filterRes = 10;

function preload() {
  bg = loadImage("images/bg1.jpg");
}

function setup() {
  createCanvas(400, 400);

  // Create a new synth and connect it to the master output
  synth = new Tone.Synth().toMaster();

  // Connect reverb effect to the synth
  synth.connect(reverb);
  reverb.connect(Tone.Master);

  // Create a slider for the volume
  volSlider = createSlider(-24, 0, -12, 0.05);
  volSlider.position(10, 60);
  volSlider.mouseReleased(() => {
    synth.volume.value = volSlider.value();
  });

  // Create a slider for the reverb
  reverbSlider = createSlider(0, 1, 0.4, 0.05);
  reverbSlider.position(10, 90);
  reverbSlider.mouseReleased(() => {
    reverb.wet.value = reverbSlider.value();
  });

  // Create a new envelope for the synth
  envelope = new Tone.AmplitudeEnvelope({
    attack: attackTime,
    decay: decayTime,
    sustain: sustainLevel,
    release: releaseTime
  });

  // Create a new filter for the synth
  filter = new Tone.Filter({
    frequency: filterFreq,
    Q: filterRes
  });

  // Connect the envelope and filter to the synth
  synth.chain(envelope, filter, Tone.Master);
  window.addEventListener('keydown',keyPressed);
}

function draw() {
  // Draw the background image
  background(bg);
  // Draw the filter frequency and resonance
  fill(255);
  noStroke();
  text('Filter Frequency: ' + filterFreq, 10, 20);
  text('Filter Resonance: ' + filterRes, 10, 40);
  // Draw the volume and reverb sliders
  text('Volume: ' + volSlider.value(), 10,60);
  text('Reverb: ' + reverbSlider.value(), 10,90);
}

function keyPressed() {
  // If the 'q' key is pressed, play a C4 note
  if (key === 'q') {
    synth.triggerAttackRelease('C4', '4n');
  }
  // If the 'w' key is pressed, play a D4 note
  if (key === 'w') {
    synth.triggerAttackRelease('D4', '4n');
  }
  // If the 'e' key is pressed, play an E4 note
  if (key === 'e') {
    synth.triggerAttackRelease('E4', '4n');
  }
  // If the 'r' key is pressed, play an F4 note
  if (key === 'r') {
    synth.triggerAttackRelease('F4', '4n');
  }
  // If the 't' key is pressed, play a G4 note
  if (key === 't') {
    synth.triggerAttackRelease('G4', '4n');
  }
  // If the 'y' key is pressed, play an A4 note   
  if (key === 'y') {
    synth.triggerAttackRelease('A4', '4n');
  }
}

function mouseClicked() {
  // Change the oscillator type when the mouse is clicked
  if (oscType === 'sine') {
    oscType = 'triangle';
  } else if (oscType === 'triangle') {
    oscType = 'sawtooth';
  } else if (oscType === 'sawtooth') {
    oscType = 'square';
  } else if (oscType === 'square') {
    oscType = 'sine';
  }
  synth.oscillator.type = oscType;
}

function mouseMoved() {
  // Adjust the filter frequency and resonance when the mouse is moved
  filterFreq = map(mouseX, 0, width, 20, 20000);
  filter.frequency.value = filterFreq;
  
  filterRes = map(mouseY, 0, height, 0, 20);
  filter.Q.value = filterRes;
}
