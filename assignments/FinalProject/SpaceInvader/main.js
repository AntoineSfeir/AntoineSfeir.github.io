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
let font;

let shieldPowerUps = [];
let dropShield = false;
let dropLives = false;
let xtraLives = [];
let speedShots = [];
let ShieldOn = false;
let shieldImg;

let ship;
let aliens = []; // array of aliens
let bonusAliens = []; // array of bonus aliens
let lasers = []; // array of lasers
let barriers = []; // array of barriers
let explosions = []; // array of explosions
let enemyLasers = []; // array of enemy lasers
let rockets = []; // array of rockets
let points = 0;
let lives = 4;
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

let backdropImg, overlayImg, tintMask, bezelImg, bezelMask;

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
    bgSynth.triggerAttackRelease(note, "8n", time);
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
  font = loadFont("font/digital-7 (mono).ttf");
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
  shieldImg = loadImage("images/shield.png");
  // background images
  backdropImg = loadImage("images/cabinet-artwork/invaders.png");
  overlayImg = loadImage("images/cabinet-artwork/tintover.png");
  tintMask = loadImage("images/cabinet-artwork/tintmask.png");
  bezelImg = loadImage("images/cabinet-artwork/invadbez-1.jpg");
  bezelMask = loadImage("images/cabinet-artwork/invadmask.png");
  soundFX = new Tone.Players({
    playerHit: "soundFX/explosion.wav",
    enemyHit: "soundFX/invaderkilled.wav",
    shoot: "soundFX/shoot.wav",
  }).toMaster();
}

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function setup() {
  createCanvas(770, 800);
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
    connectButton.position(width - 130, height - 80);
    connectButton.mousePressed(connect);

    // Disconnect button
    disconnectButton = createButton("Disconnect");
    disconnectButton.position(width - 140, height - 40);
    disconnectButton.mousePressed(disconnect);
  }
  reset();
}

function reset() {
  ship = new Ship();
  lives = 4;
  point = 0;
  lvlCount = 1;
  let barrierX = 155;
  let barrierY = height - 200;
  for (let i = 0; i < 5; i++) {
    barriers[i] = new Barrier(
      barrierX,
      barrierY,
      barrier0,
      barrier1,
      barrier2,
      barrier3
    );
    barrierX += 120;
  }
  level1();

  game.elapsedTime = 0;
  game.score = 0;

  Tone.Transport.stop("0");
  startGameMelody.start();
  Tone.Transport.start("+8n");
}

let numStars = 50;
function drawStars() {
  color1 = "gold";
  color2 = "white";
  fill(color1);
  noStroke();
  for (let i = 0; i < numStars; i++) {
    let diameter = random(0, 5);
    let xPos = random(width - 80, 100);
    let yPos = random(height - 140, 270);
    ellipse(xPos, yPos, diameter, diameter);
  }

  fill(color2);
  noStroke();
  for (let i = 0; i < numStars; i++) {
    let diameter = random(0, 5);
    let xPos = random(width - 80, 100);
    let yPos = random(height - 140, 270);
    ellipse(xPos, yPos, diameter, diameter);
  }
}

let backdrop = {
  file: "images/cabinet-artwork/invaders.png",
  layer: "backdrop",
  priority: -2,
  visible: true,
  position: [0.0, -0.14, 1.29, 1.15],
};

let overlay = {
  file: "images/cabinet-artwork/tintover.png",
  alphafile: "images/cabinet-artwork/tintmask.png",
  layer: "overlay",
  priority: -1,
  visible: true,
  position: [0.0, 0.0, 1.0, 1.0],
};

let bezel = {
  file: "images/cabinet-artwork/invadbez.png",
  alphafile: "images/cabinet-artwork/invadmask.png",
  layer: "bezel",
  priority: 0,
  visible: true,
  position: [-0.3333, -0.8206, 1.7179, 1.7851],
  brightness: 1.0,
};

function drawBackground() {
  // Draw the backdrop
  image(backdropImg, width / 2, height / 2, width, height);

  // Draw the overlay with blue tint
  push();
  tint(220);
  image(overlayImg, width / 2, height / 2, width, height);
  pop();

  // Apply the overlay alpha mask
  blendMode(MULTIPLY);
  image(tintMask, width / 2, height / 2, width, height);
  blendMode(BLEND);

  // Draw the bezel with brightness
  push();
  tint(255, 255 * bezel.brightness);
  image(bezelImg, width / 2, height / 2, width, height);
  pop();

  // Apply the bezel alpha mask
  blendMode(MULTIPLY);
  image(bezelMask, width / 2, height / 2, width, height);
  blendMode(BLEND);
}

// 90 points
function level1() {
  // create the bottom row of aliens
  let startX = 200;
  let xVal = 80;
  let startY = 350;
  for (let i = 0; i < 6; i++) {
    if (i == 0) {
      aliens[i] = new Alien(
        startX + startX,
        startY,
        alien1a,
        alien1b,
        explosions,
        10
      );
    }
    aliens[i] = new Alien(
      i * xVal + startX,
      startY,
      alien1a,
      alien1b,
      explosions,
      10
    );
  }
  bonus = new bonusAlien(width / 2, 300, alien5, explosions, 50);
  bonusAliens.push(bonus);
}
// 180 points
function level2() {
  // create the bottom row of aliens
  let startX = 200;
  let xVal = 80;
  let startY = 350;
  for (let i = 0; i < 6; i++) {
    if (i == 0) {
      aliens[i] = new Alien(
        startX + startX,
        startY,
        alien1a,
        alien1b,
        explosions,
        10
      );
    }
    aliens[i] = new Alien(
      i * xVal + startX,
      startY,
      alien1a,
      alien1b,
      explosions,
      10
    );
  }

  // create the top row of aliens
  startY = 400;
  let offset = 0;
  for (let j = 6; j < 12; j++) {
    if (j == 6) {
      aliens[j] = new Alien(
        startX + startX,
        startY,
        alien2a,
        alien2b,
        explosions,
        20
      );
    }
    aliens[j] = new Alien(
      offset * xVal + startX,
      startY,
      alien2a,
      alien2b,
      explosions,
      20
    );
    offset++;
  }

  if (barriers.length == 0) {
    let barrierX = 155;
    let barrierY = height - 200;
    for (let i = 0; i < 5; i++) {
      barriers[i] = new Barrier(
        barrierX,
        barrierY,
        barrier0,
        barrier1,
        barrier2,
        barrier3
      );
      barrierX += 120;
    }
  }
}

// 210 points
function level3() {
  // create the bottom row of aliens
  let startX = 200;
  let xVal = 80;
  let startY = 350;
  for (let i = 0; i < 6; i++) {
    if (i == 0) {
      aliens[i] = new Alien(
        startX + startX,
        startY,
        alien1a,
        alien1b,
        explosions,
        10
      );
    }
    aliens[i] = new Alien(
      i * xVal + startX,
      startY,
      alien1a,
      alien1b,
      explosions,
      10
    );
  }

  // create the top row of aliens
  startY = 400;
  let offset = 0;
  for (let j = 6; j < 12; j++) {
    if (j == 6) {
      aliens[j] = new Alien(
        startX + startX,
        startY,
        alien2a,
        alien2b,
        explosions,
        20
      );
    }
    aliens[j] = new Alien(
      offset * xVal + startX,
      startY,
      alien2a,
      alien2b,
      explosions,
      20
    );
    offset++;
  }
  bonus = new bonusAlien(width / 2, 300, alien5, explosions, 50);
  bonusAliens.push(bonus);
  if (barriers.length == 0) {
    let barrierX = 155;
    let barrierY = height - 200;
    for (let i = 0; i < 5; i++) {
      barriers[i] = new Barrier(
        barrierX,
        barrierY,
        barrier0,
        barrier1,
        barrier2,
        barrier3
      );
      barrierX += 120;
    }
  }
}

function level4() {
  // create the bottom row of aliens
  let startX = 200;
  let xVal = 80;
  let startY = 350;
  for (let i = 0; i < 6; i++) {
    if (i == 0) {
      aliens[i] = new Alien(
        startX + startX,
        startY,
        alien1a,
        alien1b,
        explosions,
        10
      );
    }
    aliens[i] = new Alien(
      i * xVal + startX,
      startY,
      alien1a,
      alien1b,
      explosions,
      10
    );
  }

  // create the top row of aliens
  startY = 400;
  let offset = 0;
  for (let j = 6; j < 12; j++) {
    if (j == 6) {
      aliens[j] = new Alien(
        startX + startX,
        startY,
        alien2a,
        alien2b,
        explosions,
        20
      );
    }
    aliens[j] = new Alien(
      offset * xVal + startX,
      startY,
      alien2a,
      alien2b,
      explosions,
      20
    );
    offset++;
  }
  startY = 450;
  offset = 0;
  for (let k = 12; k < 18; k++) {
    if (k == 12) {
      aliens[k] = new Alien(
        startX + startX,
        startY,
        alien3a,
        alien3b,
        explosions,
        30
      );
    }
    aliens[k] = new Alien(
      offset * xVal + startX,
      startY,
      alien3a,
      alien3b,
      explosions,
      30
    );
    offset++;
  }
  bonus = new bonusAlien(width / 2, 300, alien5, explosions, 50);
  bonusAliens.push(bonus);
  if (barriers.length == 0) {
    let barrierX = 155;
    let barrierY = height - 200;
    for (let i = 0; i < 5; i++) {
      barriers[i] = new Barrier(
        barrierX,
        barrierY,
        barrier0,
        barrier1,
        barrier2,
        barrier3
      );
      barrierX += 120;
    }
  }
}

function level5() {
  // create the bottom row of aliens
  let startX = 200;
  let xVal = 80;
  let startY = 350;
  for (let i = 0; i < 6; i++) {
    if (i == 0) {
      aliens[i] = new Alien(
        startX + startX,
        startY,
        alien2a,
        alien2b,
        explosions,
        20
      );
    }
    aliens[i] = new Alien(
      i * xVal + startX,
      startY,
      alien1a,
      alien1b,
      explosions,
      20
    );
  }

  // create the top row of aliens
  startY = 400;
  let offset = 0;
  for (let j = 6; j < 12; j++) {
    if (j == 6) {
      aliens[j] = new Alien(
        startX + startX,
        startY,
        alien3a,
        alien3b,
        explosions,
        30
      );
    }
    aliens[j] = new Alien(
      offset * xVal + startX,
      startY,
      alien3a,
      alien3b,
      explosions,
      30
    );
    offset++;
  }
  offset = 0;
  startY = 450;
  for (let k = 12; k < 18; k++) {
    if (k == 12) {
      aliens[k] = new Alien(
        startX + startX,
        startY,
        alien4a,
        alien4b,
        explosions,
        40
      );
    }
    aliens[k] = new Alien(
      offset * xVal + startX,
      startY,
      alien4a,
      alien4b,
      explosions,
      40
    );
    offset++;
  }
  bonus = new bonusAlien(width / 2, 300, alien5, explosions, 50);
  bonusAliens.push(bonus);
  if (barriers.length == 0) {
    let barrierX = 155;
    let barrierY = height - 200;
    for (let i = 0; i < 5; i++) {
      barriers[i] = new Barrier(
        barrierX,
        barrierY,
        barrier0,
        barrier1,
        barrier2,
        barrier3
      );
      barrierX += 120;
    }
  }
}

function level6() {
  // create the bottom row of aliens
  let startX = 200;
  let xVal = 80;
  let startY = 350;
  for (let i = 0; i < 6; i++) {
    if (i == 0) {
      aliens[i] = new Alien(
        startX + startX,
        startY,
        alien2a,
        alien2b,
        explosions,
        20
      );
    }
    aliens[i] = new Alien(
      i * xVal + startX,
      startY,
      alien1a,
      alien1b,
      explosions,
      20
    );
  }

  // create the top row of aliens
  startY = 400;
  let offset = 0;
  for (let j = 6; j < 12; j++) {
    if (j == 6) {
      aliens[j] = new Alien(
        startX + startX,
        startY,
        alien3a,
        alien3b,
        explosions,
        30
      );
    }
    aliens[j] = new Alien(
      offset * xVal + startX,
      startY,
      alien3a,
      alien3b,
      explosions,
      30
    );
    offset++;
  }
  offset = 0;
  startY = 450;
  for (let k = 12; k < 18; k++) {
    if (k == 12) {
      aliens[k] = new Alien(
        startX + startX,
        startY,
        alien4a,
        alien4b,
        explosions,
        40
      );
    }
    aliens[k] = new Alien(
      offset * xVal + startX,
      startY,
      alien4a,
      alien4b,
      explosions,
      40
    );
    offset++;
  }
  bonus = new bonusAlien(width / 2 - 100, 300, alien5, explosions, 50);
  bonusAliens.push(bonus);
  bonus2 = new bonusAlien(width / 2 + 100, 300, alien5, explosions, 50);
  bonus2.changeDir();
  bonusAliens.push(bonus2);
  if (barriers.length == 0) {
    let barrierX = 155;
    let barrierY = height - 200;
    for (let i = 0; i < 5; i++) {
      barriers[i] = new Barrier(
        barrierX,
        barrierY,
        barrier0,
        barrier1,
        barrier2,
        barrier3
      );
      barrierX += 120;
    }
  }
}

function incrementLevel(lvlCount) {
  if (lvlCount === 1) {
    level1();
  }
  if (lvlCount === 2) {
    level2();
  }
  if (lvlCount === 3) {
    level3();
  }
  if (lvlCount === 4) {
    level4();
  }
  if (lvlCount === 5) {
    level5();
  }
  if (lvlCount === 6) {
    level6();
  }
}

function updateHUD() {
  fill(0);
  stroke("red"); // set the stroke color to red
  strokeWeight(4); // set the stroke weight to 4 pixels
  rect(100, height - 110, 200, 100);
  push();
  textSize(20);
  textFont(font);
  noStroke(); // disable the stroke for the text
  fill("gold");
  text("Points:" + points, 110, height - 80);
  text("Aliens Remaining:" + aliens.length, 110, height - 60);
  text("Lives:" + lives, 110, height - 40);
  text("Wave:" + lvlCount, 110, height - 20);
  if (lvlCount === 6) {
    text("FINAL WAVE", 110, height - 20);
  }
  pop();

  push();
  fill(0);
  rect(width - 160, height - 105, 110, 90);
  pop();
}

function reload(sprite) {
  // add a new bullet to the bullets array
  let laser = new Laser(sprite.x, sprite.y, "enemy");
  enemyLasers.push(laser);
}

function reloadRockets(sprite) {
  // add a new bullet to the bullets array
  let rocket = new Rocket(sprite.x, sprite.y, rocketImg, explosions);
  rockets.push(rocket);
}

function loadPowerUp(sprite, type) {
  // add a new bullet to the bullets array
  if (type === "shield") {
    let shield = new PowerUp(sprite.x, sprite.y, "shield", shieldImg);
    shieldPowerUps.push(shield);
  } else if (type === "xtraLife") {
    let xtraLife = new PowerUp(sprite.x, sprite.y, "xtraLife", shieldImg);
    xtraLives.push(xtraLife);
  }
}

function drawPlayingState() {
  endGameMelody.stop();
  startGameMelody.stop();
  bgMelody.start();
  if (lvlCount >= 3) {
    bgMelody.stop();
    speedUp.start();
  }
  drawBackground();
  drawStars();

  ship.show();

  // timer to stop spamming bullets
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

  // update ships position
  JoyStickMoved();

  toggle();

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
    if (
      aliens[i].x >= width - 65 - aliens[i].radius ||
      aliens[i].x < 85 + aliens[i].radius
    ) {
      edge = true;
    }
    if (aliens[i].y < height - 30) {
      bonusActive = true;
    }
  }

  // check for collision
  if (edge) {
    for (let j = 0; j < aliens.length; j++) {
      aliens[j].shiftDown();
    }
  }

  // Show and move bonus alien
  let edge1 = false;
  if (bonusActive) {
    for (let i = 0; i < bonusAliens.length; i++) {
      bonusAliens[i].show();
      bonusAliens[i].move();
      if (frameCount % 50 == 0) {
        reloadRockets(bonusAliens[i]);
        loadPowerUp(bonusAliens[i], "shield");
        console.log("shield", shieldPowerUps.length);
      }
      if (
        bonusAliens[i].x >= width - 130 - bonusAliens[i].radius ||
        bonusAliens[i].x <= bonusAliens[i].radius + 130
      ) {
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
        barriers[j].hitCount += 1;
        barriers[j].update(barriers[j].hitCount);
        if (barriers[j].hitCount == 3) {
          barriers[j].remove();
        }
      }
    }
    // check for collisions with player
    if (enemyLasers[i].hits(ship)) {
      ship.isHit();
      controllerLight(255, 0, 0); // set red to maximum, green and blue to zero
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
      controllerLight(255, 0, 0); // set red to maximum, green and blue to zero
      soundFX.player("playerHit").start();
      rockets[i].remove();
      rockets[i].explode();
      rockets[i].update();
      ship.isHit();
      lives--;
    }
    // check for collisions for rocket with barriers
    for (let j = 0; j < barriers.length; j++) {
      if (rockets[i].hits(barriers[j])) {
        rockets[i].remove();
        rockets[i].explode();
        rockets[i].update(2);
        barriers[j].hitCount++;
        barriers[j].update(barriers[j].hitCount);
        if (barriers[j].hitCount == 3) {
          barriers[j].remove();
        }
      }
    }
  } // end of rocket loop1

  // Delete rockets that are offscreen or have hit something
  for (let i = 0; i < rockets.length; i++) {
    if (rockets[i].toDelete || rockets[i].offscreen()) {
      rockets.splice(i, 1);
    }
  }
  // Sheild power up loop
  for (let i = 0; i < shieldPowerUps; i++) {
    shieldPowerUps[i].show();
    shieldPowerUps[i].move();
  }

  // Life power up loop
  for (let i = 0; i < xtraLives; i++) {
    xtraLives[i].show();
    xtraLives[i].move();
  }

  // laser loop
  for (let las = 0; las < lasers.length; las++) {
    lasers[las].show();
    lasers[las].move();
    // check for collision
    for (let ali = 0; ali < aliens.length; ali++) {
      if (lasers[las].hits(aliens[ali])) {
        controllerLight(0, 255, 0); // set green to maximum, red and blue to zero
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
        soundFX.player("enemyHit").start();
        controllerLight(0, 0, 255); // set blue to maximum, red and green to zero
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
        if (barriers[bar].hitCount == 3) {
          barriers[bar].remove();
        }
      }
    } // end of barrier loop
  } // end of laser loop #1

  // loop through lasers; remove lasers with flag
  for (let i = lasers.length - 1; i >= 0; i--) {
    if (lasers[i].toDelete || lasers[i].offscreen()) {
      lasers.splice(i, 1);
    }
  } // end of laser loop #2

  // loop through barriers; remove barriers with flag
  for (let i = barriers.length - 1; i >= 0; i--) {
    if (barriers[i].toDelete) {
      barriers.splice(i, 1);
    }
  }

  for (let i = shieldPowerUps.length - 1; i >= 0; i--) {
    if (shieldPowerUps[i].toDelete || shieldPowerUps[i].offscreen()) {
      shieldPowerUps.splice(i, 1);
    }
  }

  for (let i = xtraLives.length - 1; i >= 0; i--) {
    if (xtraLives[i].toDelete || xtraLives[i].offscreen()) {
      console.log("xtra live removed");
      xtraLives.splice(i, 1);
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
  if (lives == 0 || lvlCount > 6) game.state = GameState.GameOver;
}

function drawGameOverState() {
  bgMelody.stop();
  speedUp.stop();
  endGameMelody.start();
  drawBackground();
  updateHUD();
  fill("yellow");
  textFont(font);
  textSize(40);
  textAlign(CENTER);
  textSize(30);
  text("Game Over!", width / 2, height / 2);
  text(
    "Thanks For Playing\n Toggle the joy to restart\n If You don't have one press enter",
    width / 2,
    height / 2 + 100
  );
}

function drawStartState() {
  bgMelody.stop();
  speedUp.stop();
  startGameMelody.start();
  drawBackground();
  updateHUD();
  fill("yellow");
  textFont(font);
  textSize(30);
  textAlign(CENTER);
  text(
    "Toggle the joystick to begin\nIf you don't have a controller\npress enter to start",
    width / 2,
    height / 2
  );
  textSize(30);
  text("By: Antoine Sfeir", width / 2, height / 2 + 200);
}

function draw() {
  background(0);
  if (reader) {
    serialRead();
  }
  switch (game.state) {
    case GameState.Playing:
      drawPlayingState();
      toggle();
      break;
    case GameState.GameOver:
      drawGameOverState();
      toggle();
      break;
    case GameState.Start:
      drawStartState();
      toggle();
      break;
  }
}

// function mousePressed() {
//   switch (game.state) {
//     case GameState.Start:
//       game.state = GameState.Playing;
//       break;
//     case GameState.GameOver:
//       reset();
//       game.state = GameState.Playing;
//       break;
//   }
// }

function keyReleased() {
  ship.setDir(0);
}
function toggle() {
  if (sensorData) {
    if (!toggleState && sensorData.Switch == 0) {
      toggleState = true;
      JoyStickPressed();
      console.log("pressed");
    } else {
      toggleState = false;
    }
  }
}
function JoyStickPressed() {
  switch (game.state) {
    case GameState.Playing:
      if (canShoot) {
        console.log("JoyStickPressed");
        let laser = new Laser(ship.x + 30, ship.y - 20, "player");
        lasers.push(laser);
        canShoot = false;
        soundFX.player("shoot").start();
      }
      break;
    case GameState.Start:
      game.state = GameState.Playing;
      break;
    case GameState.GameOver:
      reset();
      game.state = GameState.Playing;
      break;
  }
}

function JoyStickMoved() {
  if (sensorData) {
    console.log("JoyStickMoved");
    if (sensorData.Xaxis <= 255 && sensorData.Xaxis > 131) {
      ship.setDir(1); // move right
    } else if (sensorData.Xaxis < 131 && sensorData.Xaxis >= 0) {
      ship.setDir(-1); // move left
    } else {
      ship.setDir(0); // don't move horizontally
    }
  }
}

function keyPressed() {
  if (key === " " && canShoot) {
    let laser = new Laser(ship.x + 30, ship.y - 20, "player");
    lasers.push(laser);
    canShoot = false;
    soundFX.player("shoot").start();
  }
  if (keyCode === ENTER) {
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
    //console.log(sensorData);
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

function controllerLight(red, green, blue) {
  // Check if writer is available
  if (writer) {
    if (red == 255) {
      console.log("red");
    }
    if (green == 255) {
      console.log("green");
    }
    if (blue == 255) {
      console.log("blue");
    }
    // Write the new brightness values to the stream
    let writeString = red + ", " + green + ", " + blue + "\n";

    writer.write(encoder.encode(writeString));
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
