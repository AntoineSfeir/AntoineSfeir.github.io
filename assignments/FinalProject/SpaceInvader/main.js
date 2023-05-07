let connectButton;
let disconnectButton;
let port;
let writer, reader;
let sliderLED;
let sliderBlue;
let red, green, blue;
let joySwitch;
let toggleState = false;
let sensorData;

let ship;
let aliens = []; // array of aliens
let bonusAliens = []; // array of bonus aliens
let lasers = []; // array of lasers
let barriers = []; // array of barriers
let explosions = []; // array of explosions
let enemyLasers = []; // array of enemy lasers
let rockets = []; // array of rockets
let points = 0;
let lives = 3;
let bonus, bonus1;
let bonusActive = 0;
let lvlCount = 1;


let shootCooldown = 500; // milliseconds
let canShoot = false;
let lastFrameTime = 0;



let alien1a,
  alien1b,
  alien2a,
  alien2b,
  alien3a,
  alien3b,
  alien4a,
  alien4b,
  alien5;

let barrier0, barrier1, barrier2, barrier3;
let rocketImg;

let soundFX;

var audioContext = null;

function init() {
  var button = document.getElementById("startButton");
  button.addEventListener("click", function () {
    // create or resume the AudioContext object here
    audioContext = new AudioContext();
  });
}

let synth = new Tone.PolySynth().toMaster();
let dSynth = new Tone.PolySynth();

let lowpass = new Tone.Filter(800, "lowpass").toMaster();
dSynth.connect(lowpass);

const speedUp = new Tone.Sequence(
  (time, note) => {
    dSynth.triggerAttackRelease(note, "4n", time);
  },
  [
    ["C4", "E4", "G4"],
    ["F4", "A4", "C5"],
    ["G4", "B4", "D5"],
    ["A4", "C5", "E5"],
  ]
);

const endGameMelody = new Tone.Sequence(
  (time, note) => {
    dSynth.triggerAttackRelease(note, "2n", time);
  },
  ["C3", "G2", "C2", "G1"]
);

const bgSynth = new Tone.AMSynth({
  oscillator: {
    type: "square",
  },
  envelope: {
    attack: 0.1,
    decay: 0.1,
    sustain: 0.5,
    release: 0.1,
  },
}).toMaster();

const bgMelody = new Tone.Sequence(
  (time, note) => {
    bgSynth.triggerAttackRelease(note, "4n", time);
  },
  ["C3", "C3", "G3", "G3", "E3", "E3", "C3", "C3"]
);

const delay = new Tone.FeedbackDelay("8n", 0.2).toMaster();
bgSynth.connect(delay);

// start the sequence
Tone.Transport.bpm.value = 100;
bgMelody.loop = true;

const startGameMelody = new Tone.Sequence(
  (time, note) => {
    bgSynth.triggerAttackRelease(note, "16n", time);
  },
  ["C4", "C4", "G4", "G4", "E4", "E4", "C4", "C4"]
);

const GameState = {
  Start: "Start",
  Playing: "Playing",
  GameOver: "GameOver",
};

let game = {
  score: 0,
  elapsedTime: 0,
  state: GameState.Start,
};

function preload() {
  alien1a = loadImage("images/alien1a.png");
  alien1b = loadImage("images/alien1b.png");
  alien2a = loadImage("images/alien2a.png");
  alien2b = loadImage("images/alien2b.png");
  alien3a = loadImage("images/alien3a.png");
  alien3b = loadImage("images/alien3b.png");
  alien4a = loadImage("images/alien4a.png");
  alien4b = loadImage("images/alien4b.png");
  alien5 = loadImage("images/alien5.png");
  barrier0 = loadImage("images/barrier0.png");
  barrier1 = loadImage("images/barrier1.png");
  barrier2 = loadImage("images/barrier2.png");
  barrier3 = loadImage("images/barrier3.png");
  rocketImg = loadImage("images/rocket.png");
  explosions[0] = loadImage("images/explosion1.png");
  explosions[1] = loadImage("images/explosion2.png");

  soundFX = new Tone.Players({
    playerHit: "soundFX/explosion.wav",
    enemyHit: "soundFX/invaderkilled.wav",
    shoot: "soundFX/shoot.wav",
  }).toMaster();
}

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function setup() {
  createCanvas(600, 400);
  imageMode(CENTER);
  angleMode(DEGREES);
  frameRate(10);
  soundFX.player = function (name) {
    return soundFX.get(name);
  };

  // The Web Serial API is supported
  if ("serial" in navigator) {
    // Connect button
    connectButton = createButton("connect");
    connectButton.position(50, 10);
    connectButton.mousePressed(connect);

    // Disconnect button
    disconnectButton = createButton("Disconnect");
    disconnectButton.position(150, 10);
    disconnectButton.mousePressed(disconnect);
  }
  reset();
}

function reset() {
  ship = new Ship();
  lives = 3;
  point = 0;
  lvlCount = 1;
  let barrierX = 90;
  let barrierY = height - 50;
  for (let i = 0; i < 5; i++) {
    barriers[i] = new Barrier(
      barrierX,
      barrierY,
      barrier0,
      barrier1,
      barrier2,
      barrier3
    );
    barrierX += 110;
  }
  level1();

  game.elapsedTime = 0;
  game.score = 0;

  Tone.Transport.stop("0");
  //startGameMelody.start();
  Tone.Transport.start("+8n");
}

let numStars = 50;
function drawBackground() {
  color1 = "gold";
  color2 = "white";
  fill(color1);
  noStroke();
  for (let i = 0; i < numStars; i++) {
    let diameter = random(0, 5);
    let xPos = random(width, 0);
    let yPos = random(height, 0);
    ellipse(xPos, yPos, diameter, diameter);
  }

  fill(color2);
  noStroke();
  for (let i = 0; i < numStars; i++) {
    let diameter = random(0, 5);
    let xPos = random(width, 0);
    let yPos = random(height, 0);
    ellipse(xPos, yPos, diameter, diameter);
  }
}

// 90 points
function level1() {
  // create the bottom row of aliens
  let startX = 80;
  let startY = 100;
  for (let i = 0; i < 6; i++) {
    aliens[i] = new Alien(
      i * startX + 80,
      startY,
      alien1a,
      alien1b,
      explosions,
      5
    );
  }
  // bonus = new bonusAlien(width - 25, 30, alien5, explosions, 40);
  // bonusAliens.push(bonus);
  // create the top row of aliens
  startY = 50;
  let offset = 0;
  for (let j = 6; j < 12; j++) {
    aliens[j] = new Alien(
      offset * startX + 80,
      startY,
      alien2a,
      alien2b,
      explosions,
      10
    );
    offset++;
  }
}

// 180 points
function level2() {
  // create the bottom row of aliens
  let startX = 80;
  let startY = 150;
  for (let i = 0; i < 6; i++) {
    aliens[i] = new Alien(
      i * startX + 80,
      startY,
      alien1a,
      alien1b,
      explosions,
      5
    );
  }
  // create the middle row of aliens
  startY = 100;
  let offset = 0;
  for (let j = 6; j < 12; j++) {
    aliens[j] = new Alien(
      offset * startX + 80,
      startY,
      alien3a,
      alien3b,
      explosions,
      15
    );
    offset++;
  }
  // create the top row of aliens
  offset = 0;
  startY = 50;
  for (let k = 12; k < 18; k++) {
    aliens[k] = new Alien(
      offset * startX + 80,
      startY,
      alien2a,
      alien2b,
      explosions,
      10
    );
    offset++;
  }

  bonus = new bonusAlien(width - 25, 30, alien5, explosions, 40);
  bonusAliens.push(bonus);
}

// 210 points
function level3() {
  // create the bottom row of aliens
  let startX = 80;
  let startY = 150;
  for (let i = 0; i < 6; i++) {
    aliens[i] = new Alien(
      i * startX + 80,
      startY,
      alien1a,
      alien1b,
      explosions,
      5
    );
  }
  // create the middle row of aliens
  startY = 100;
  let offset = 0;
  for (let j = 6; j < 12; j++) {
    aliens[j] = new Alien(
      offset * startX + 80,
      startY,
      alien3a,
      alien3b,
      explosions,
      15
    );
    offset++;
  }
  // create the top row of aliens
  offset = 0;
  startY = 50;
  for (let k = 12; k < 18; k++) {
    aliens[k] = new Alien(
      offset * startX + 80,
      startY,
      alien4a,
      alien4b,
      explosions,
      20
    );
    offset++;
  }

  bonus = new bonusAlien(width - 25, 30, alien5, explosions, 40);
  bonusAliens.push(bonus);
  bonus1 = new bonusAlien(25, 30, alien5, explosions, 40);
  bonusAliens.push(bonus1);
}

function incrementLevel(lvlCount) {
  if (lvlCount === 1) {
    level1();
  }
  if (lvlCount === 2) {
    level2();
  } else if (lvlCount === 3) {
    level3();
  }
}

function updateHUD() {
  fill(255);
  text("Points: " + points, width - 350, 20);
  text("Aliens Remaining: " + aliens.length, width - 280, 20);
  text("Lives: " + lives, width - 150, 20);
  text("Wave: " + lvlCount, width - 90, 20);
}

function reload(sprite) {
  // add a new bullet to the bullets array
  let laser = new Laser(sprite.x, sprite.y, "enemy");
  enemyLasers.push(laser);
}

function reloadRockets(sprite) {
  // add a new bullet to the bullets array
  let rocket = new Rocket(sprite.x, sprite.y, rocketImg, explosions);
  console.log("explosions loaded", explosions.length);
  rockets.push(rocket);
}

function drawPlayingState() {
  // endGameMelody.stop();
  // startGameMelody.stop();
  // bgMelody.start();
  drawBackground();
  ship.show();
  let currentTime = millis();
  let deltaTime = currentTime - lastFrameTime;
  lastFrameTime = currentTime;
  // check if we can shoot
  if (!canShoot) {
    // Decrease the cooldown timer
    shootCooldown -= deltaTime;
    if (shootCooldown <= 0) {
      // Reset the cooldown timer and allow shooting again
      canShoot = true;
      shootCooldown = 500;
    }
  }
  ship.move();
  // show barriers
  for (let i = 0; i < barriers.length; i++) {
    barriers[i].show();
  }

  // Show and move the aliens
  let edge = false;
  let attack = false;
  for (let i = 0; i < aliens.length; i++) {
    aliens[i].show();
    aliens[i].move();
    if (aliens[i].x > width - 20 || aliens[i].x < 20) {
      edge = true;
    }
    if (aliens[i].y < height - 30) {
      bonusActive = true;
    }
  }

  // check for collision
  if (edge) {
    for(let j = 0; j < aliens.length; j++) {
      aliens[j].shiftDown();
    }
  }

  // Show and move bonus alien
  let edge1 = false
  if (bonusActive) {
    for (let i = 0; i < bonusAliens.length; i++) {
      bonusAliens[i].show();
      bonusAliens[i].move();
      if (frameCount % 50 == 0) {
        reloadRockets(bonusAliens[i]);
        console.log("loaded " + bonusAliens[i]);
      }
      if (bonusAliens[i].x >= width - bonusAliens[i].radius || bonusAliens[i].x <= bonusAliens[i].radius) {
        edge1 = true;
      }
    }
  }

  if (edge1) {
    for (let i = 0; i < bonusAliens.length; i++) {
      bonusAliens[i].changeDir();
    }
  }

  // Enemies shoot back
  let attackTime = 5000;
  let attackStart = 0;
  let attackProb = 0.2;
  while (!attack && millis() - attackStart > attackTime) {
    attack = true;
    attackStart = millis();
    attackProb = 0.2 + random(-1, 1); // update attack probability randomly
    for (let i = 0; i < aliens.length; i++) {
      if (random(50) < attackProb) {
        reload(aliens[i]);
      }
    }
  }

  // Enemy Laser loop 
  for (let i = 0; i < enemyLasers.length; i++) {
    enemyLasers[i].show();
    enemyLasers[i].move();
    // check for collisions with barriers
    for (let j = 0; j < barriers.length; j++) {
      if (enemyLasers[i].hits(barriers[j])) {
        enemyLasers[i].remove();
        barriers[j].hitCount += 0.5;
        barriers[j].update(barriers[j].hitCount);
        if(barriers[j].hitCount == 3) {
          barriers[j].remove();
        }
      }
    }
    // check for collisions with player
    if (enemyLasers[i].hits(ship)) {
      ship.isHit();
      soundFX.player("playerHit").start();
      enemyLasers[i].remove();
      lives--;
    }
    if (enemyLasers[i].offscreen() || enemyLasers[i].toDelete == true) {
      enemyLasers.splice(i, 1);
    }
  } // end Enemy Laser loop

  // reset attack flag after a certain time
  if (attack && millis() - attackStart > attackTime) {
    // adjust break time as needed
    attack = false;
    attackStart = millis();
  }

  // Rocket loop1
  for (let i = 0; i < rockets.length; i++) {
    rockets[i].show();
    rockets[i].move(ship);
    // check for collisions for rocket with player
    if (rockets[i].hits(ship)) {
      rockets[i].remove();
      rockets[i].explode();
      rockets[i].update();
    }
    // check for collisions for rocket with barriers
    for (let j = 0; j < barriers.length; j++) {
      if (rockets[i].hits(barriers[j])) {
        rockets[i].remove();
        rockets[i].explode();
        rockets[i].update(2);
        barriers[j].hitCount++;
        barriers[j].update(barriers[j].hitCount);
        if(barriers[j].hitCount == 3) {
          barriers[j].remove();
        }
        barriers[j].remove();
      }
    }
  } // end of rocket loop1

  for (let i = 0; i < rockets.length; i++) {
    if (rockets[i].toDelete || rockets[i].offscreen()) {
      rockets.splice(i, 1);
    }
  }



  // laser loop
  for (let las = 0; las < lasers.length; las++) {
    lasers[las].show();
    lasers[las].move();
    // check for collision
    for (let ali = 0; ali < aliens.length; ali++) {
      if (lasers[las].hits(aliens[ali])) {
        lasers[las].remove();
        soundFX.player("enemyHit").start();
        points = points + aliens[ali].pts;
        aliens[ali].explode();
        aliens[ali].update();
        aliens.splice(ali, 1); // removes alien from array
        ali--; // decrement index to account for removed alien
      }
    } // end of alien loop
    // check for collision with bonus alien
    for (let b = 0; b < bonusAliens.length; b++) {
      if (lasers[las].hits(bonusAliens[b])) {
        lasers[las].remove();
        bonusAliens[b].explode();
        bonusAliens[b].update();
        points = points + bonusAliens[b].pts;
        bonusAliens.splice(b, 1); // removes alien from array
      }
    } // end of bonus alien loop
    // Does not currently work
    // check for collision with barriers
    for (let bar = 0; bar < barriers.length; bar++) {
      if (lasers[las].hits(barriers[bar])) {
        lasers[las].remove();
        barriers[bar].hitCount++;
        barriers[bar].update(barriers[bar].hitCount);
        if(barriers[bar].hitCount == 3) {
          barriers[bar].remove();
        }
      }
    } // end of barrier loop
  } // end of laser loop #1

  // loop through lasers; remove lasers with flag
  for (let i = lasers.length - 1; i >= 0; i--) {
    if (lasers[i].toDelete) {
      lasers.splice(i, 1);
    }
  } // end of laser loop #2

  // barrier loop
  for (let i = barriers.length - 1; i >= 0; i--) {
    if(barriers[i].toDelete) {
      barriers.splice(i, 1);
    }
  }

  // add HUD
  updateHUD();
  // check for level up
  if (aliens.length === 0) {
    lvlCount++;
    incrementLevel(lvlCount);
  }
  //check for game over
  if (lives == 0) game.state = GameState.GameOver;
}

function drawGameOverState() {
  // bgMelody.stop();
  // speedUp.stop();
  //endGameMelody.start();
  background(0);
  fill(255);
  textSize(40);
  textAlign(CENTER);
  text("Game Over!", width / 2, height / 2);
}

function drawStartState() {
  // bgMelody.stop();
  // speedUp.stop();
  // startGameMelody.start();
  background(0);
  fill(255);
  textSize(50);
  textAlign(CENTER);
  text("Space Inavder", width / 2, height / 2);
  textSize(30);
  text(
    "Toggle the joystick to begin\nIf you don't have a controller\npress any key to start",
    width / 2,
    height / 2 + 100
  );
}

function draw() {
  background(0);
  if (reader) {
    serialRead();
  }

  switch (game.state) {
    case GameState.Playing:
      drawPlayingState();
      break;
    case GameState.GameOver:
      drawGameOverState();
      break;
    case GameState.Start:
      drawStartState();
      break;
  }
}

function mousePressed() {
  switch (game.state) {
    case GameState.Start:
      game.state = GameState.Playing;
      break;
    case GameState.GameOver:
      reset();
      game.state = GameState.Playing;
      break;
  }
}

function keyReleased() {
  ship.setDir(0);
}

function keyPressed() {
  if (key === " " && canShoot) {
    let laser = new Laser(ship.x + 30, ship.y - 20, "player");
    lasers.push(laser);
    canShoot = false;
    soundFX.player("shoot").start();
  }
  if (keyCode === RIGHT_ARROW) {
    ship.setDir(1);
  } else if (keyCode === LEFT_ARROW) {
    ship.setDir(-1);
  }
}

async function serialRead() {
  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      reader.releaseLock();
      break;
    }
    sensorData = JSON.parse(value);
  }
}

async function connect() {
  port = await navigator.serial.requestPort();

  await port.open({ baudRate: 9600 });

  writer = port.writable.getWriter();

  reader = port.readable
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new TransformStream(new LineBreakTransformer()))
    .getReader();
}

async function disconnect() {
  if (port) {
    await port.close();
    port = null;
    console.log("Serial port closed successfully");
  } else {
    console.log("Port is not open");
  }
}

class LineBreakTransformer {
  constructor() {
    // A container for holding stream data until a new line.
    this.chunks = "";
  }

  transform(chunk, controller) {
    // Append new chunks to existing chunks.
    this.chunks += chunk;
    // For each line breaks in chunks, send the parsed lines out.
    const lines = this.chunks.split("\n");
    this.chunks = lines.pop();
    lines.forEach((line) => controller.enqueue(line));
  }

  flush(controller) {
    // When the stream is closed, flush any remaining chunks out.
    controller.enqueue(this.chunks);
  }
}
