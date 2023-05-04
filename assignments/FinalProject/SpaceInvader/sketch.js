let ship;
let aliens = []; // array of aliens
let bounusAliens = []; // array of bonus aliens
let lasers = []; // array of lasers
let barriers = []; // array of barriers
let points = 0;
let lives = 3;
let barrierHits = 0;
let bonus;
let bonusActiveCount = 0;
let lvlCount = 0;

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

const GameState = {
  Start: "Start",
  Playing: "Playing",
  GameOver: "GameOver",
};

let game = {
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
}

function Game() {
  ship = new Ship();
  // create barrier
  let barrierX = 90;
  let barrierY = 400;
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
}

function playGame() {
  drawBackground();
  ship.show();
  ship.move();
  // show barriers
  for (let i = 0; i < barriers.length; i++) {
    barriers[i].show();
  }
  // Show and move the aliens
  let edge = false;
  for (let i = 0; i < aliens.length; i++) {
    aliens[i].show();
    aliens[i].move();
    if (aliens[i].x > width - 20 || aliens[i].x < 20) {
      edge = true;
    }
  }
  // check for collision
  if (edge) {
    for (let j = 0; j < aliens.length; j++) {
      aliens[j].shiftDown();
    }
  }

  // if(points % 50 == 0 && points != 0) {
  //     bonusActiveCount++;
  // }

  // for(let i = 0; i < bonusActiveCount; i++) {
  //   bonus = new bounusAlien(width, 25, alien5, 50);
  //   bounusAliens.push(bonus);
  // }

  // console.log(bonusActiveCount);
  // if(bonusActiveCount > 0) {
  //   bounusAliens[bonusActiveCount - 1].show();
  //   bounusAliens[bonusActiveCount - 1].move();
  // }
  // display the lasers
  for (let las = 0; las < lasers.length; las++) {
    lasers[las].show();
    lasers[las].move();
    // check for collision
    for (let ali = 0; ali < aliens.length; ali++) {
      if (lasers[las].hits(aliens[ali])) {
        lasers[las].remove();
        points = points + aliens[ali].pts;
        aliens.splice(ali, 1); // removes alien from array
      }
    } // end of alien loop
    // check for collision with bonus alien
    for (let b = 0; b < bounusAliens.length; b++) {
      if (lasers[las].hits(bounusAliens[b])) {
        lasers[las].remove();
        points = points + bounusAliens[b].pts;
        bounusAliens.splice(b, 1); // removes alien from array
      }
    } // end of bonus alien loop
    // Does not currently work
    // check for collision with barriers
    for (let bar = 0; bar < barriers.length; bar++) {
      if (barriers[bar].hasCollision(lasers[las])) {
        barrierHits++;
        lasers[las].remove();
        console.log("barrier hit", barrierHits);
      }
    } // end of barrier loop
  } // end of laser loop #1

  // loop through lasers; remove lasers with flag
  for (let i = lasers.length - 1; i >= 0; i--) {
    if (lasers[i].toDelete) {
      lasers.splice(i, 1);
    }
  } // end of laser loop #2
  updateHUD();

   // check for level up
   if (aliens.length === 0) {
     lvlCount++;
     incrementLevel(lvlCount);
   }
  //check for game over
}

function incrementLevel(lvlCount) {
  if(lvlCount === 1) {
    level1();
 }
 if (lvlCount === 2) {
   level2();
 } else if (lvlCount === 3) {
   level3();
 }
}

// 90 points
function level1() {
  // create the bottom row of aliens
  let startX = 80;
  let startY = 100;
  for (let i = 0; i < 6; i++) {
    aliens[i] = new Alien(i * startX + 80, startY, alien1a, alien1b, 5);
  }
  // create the top row of aliens
  startY = 50;
  let offset = 0;
  for (let j = 6; j < 12; j++) {
    aliens[j] = new Alien(offset * startX + 80, startY, alien2a, alien2b, 10);
    offset++;
  }
}

// 180 points
function level2() {
  // create the bottom row of aliens
  let startX = 80;
  let startY = 150;
  for (let i = 0; i < 6; i++) {
    aliens[i] = new Alien(i * startX + 80, startY, alien1a, alien1b, 5);
  }
  // create the middle row of aliens
  startY = 100;
  let offset = 0;
  for (let j = 6; j < 12; j++) {
    aliens[j] = new Alien(offset * startX + 80, startY, alien3a, alien3b, 15);
    offset++;
  }
  // create the top row of aliens
  offset = 0;
  startY = 50;
  for (let k = 12; k < 18; k++) {
    aliens[k] = new Alien(offset * startX + 80, startY, alien2a, alien2b, 10);
    offset++;
  }
}

// 210 points
function level3() {
  // create the bottom row of aliens
  let startX = 80;
  let startY = 150;
  for (let i = 0; i < 6; i++) {
    aliens[i] = new Alien(i * startX + 80, startY, alien1a, alien1b, 5);
  }
  // create the middle row of aliens
  startY = 100;
  let offset = 0;
  for (let j = 6; j < 12; j++) {
    aliens[j] = new Alien(offset * startX + 80, startY, alien3a, alien3b, 15);
    offset++;
  }
  // create the top row of aliens
  offset = 0;
  startY = 50;
  for (let k = 12; k < 18; k++) {
    aliens[k] = new Alien(offset * startX + 80, startY, alien4a, alien4b, 20);
    offset++;
  }
}

function setup() {
  createCanvas(600, 450);
  frameRate(10);
  imageMode(CENTER);
  Game();
  //GameState = "Start";
}

function draw() {
  background(0);
  if (game.state === GameState.Start) {
    gameStart();
  } else if (game.state === GameState.Playing) {
    playGame();
  } else if (game.state === GameState.GameOver) {
    gameOver();
  }
} // end of draw function

function mousePressed() {
  if (game.state === GameState.Start) {
    game.state = GameState.Playing;
  }
}


function keyReleased() {
  ship.setDir(0);
}

function keyPressed() {
  if (key === " ") {
    let laser = new Laser(ship.x + 30, ship.y - 20);
    lasers.push(laser);
  }
  if (keyCode === RIGHT_ARROW) {
    ship.setDir(1);
  } else if (keyCode === LEFT_ARROW ) {
    ship.setDir(-1);
  }
}

function updateHUD() {
  fill(255);
  text("Points: " + points, 10, 20);
  text("Aliens Remaining: " + aliens.length, 90, 20);
  text("Lives: " + lives, 250, 20);
}
function gameOver() {
  fill("white");
  textSize(72);
  textAlign(CENTER);
  text("GAME OVER", width / 2, height / 2);
  noLoop();
}

function gameStart() {
  fill("white");
  textSize(50);
  textAlign(CENTER);
  text("Space Invader", width / 2, height / 3);
  text("Press The Mouse to Start", width / 2, height / 2);
  noLoop();
}

let numStars = 50;
function drawBackground() {
  color1 = "gold";
  color2 = "white";
  fill(color1);
  noStroke();
  for (let i = 0; i < numStars; i++) {
    let diameter = random(0, 5);
    let xPos = random(height, 0);
    let yPos = random(width, 0);
    ellipse(xPos, yPos, diameter, diameter);
  }

  fill(color2);
  noStroke();
  for (let i = 0; i < numStars; i++) {
    let diameter = random(0, 5);
    let xPos = random(height, 0);
    let yPos = random(width, 0);
    ellipse(xPos, yPos, diameter, diameter);
  }
}
