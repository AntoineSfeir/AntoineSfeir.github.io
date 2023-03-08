/*
Author:  Antoine Sfeir
Date:    3/7/2023
Class:   CSC 2463
Purpose: Create Sound Synthesis & Sound Effects
*/

let y = 400; // initial position of the rocket
let dy = 0; // initial velocity of the rocket
let thrust = 0.004; // acceleration due to rocket engines
let thrusting = false; // flag to indicate whether rocket engines are on or off

function setup() {
  createCanvas(400, 400);
  if(y > height) {
    fill(255);
    text("Launch Successful!", width/2, height/2);
  }

  var noises = [];
  var filters = [];
  var totalSynths = 8;

  for (var i = 0; i < totalSynths; i++) {
    filters[i] = new Tone.AutoFilter({
      frequency: "8m",
      min: 100,
      max: 15000,
      type: "square",
      filter: {
        type: "lowshelf",
        gain: 12,
        rolloff: -48,
        Q: 4
      }
    }).toDestination()

    noises[i] = new Tone.NoiseSynth({
      type: 'white',
      "envelope": {
        "attack": 3,
        "decay": 2,
        "sustain": 1,
        "release": 3
    }
    }).connect(filters[i]);
  }

  launch = createButton("Take off").mousePressed(() => {
    thrusting = true;
    for(var i = 0; i < totalSynths; i++) {
      noises[i].triggerAttackRelease("4m", `+${i}`);
      filters[i].frequency.rampTo(i*1.4,'8m')
      filters[i].filter.Q.setValueCurveAtTime([10, 15, 9, 1], '', '8m')
      noises[i].volume.setValueCurveAtTime([-30, -6, -10 ], '', '8m')
    }
  });
}

function draw() {
  background(0);
  rocket();
}

function rocket() {
  // update the rocket position and velocity
  if (thrusting) {
    dy -= thrust;
  }
  y += dy;
  
  // draw the rocket
  fill(200);
  rectMode(CENTER);
  rect(width/2, y, 40, 120);
  fill(255, 0, 0);
  triangle(width/2 - 20, y + 60, width/2, y + 100, width/2 + 20, y + 60);
  fill(255);
  rect(width/2, y + 60, 30, 15);
  fill(255, 200, 0);
  rect(width/2, y + 70, 20, 10);
  fill(200, 200, 255);
  ellipse(width/2, y - 40, 20, 20);
  fill('Grey');
  triangle(width/2 - 20, y - 60, width/2, y - 100, width/2 + 20, y - 60);
}

