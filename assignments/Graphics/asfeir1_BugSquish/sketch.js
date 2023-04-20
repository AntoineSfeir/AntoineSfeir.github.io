//Antoine Sfeir
//CSC 2463
let spriteSheet;
let walkingAnimation;
let deltaTime = 0;
let spriteSheetFilenames = ["spider.png"];
let deadSpider;
let spriteSheets = [];
let animations = [];

let synth = new Tone.PolySynth().toMaster();
let dSynth = new Tone.PolySynth();

let lowpass = new Tone.Filter(800, "lowpass").toMaster();
dSynth.connect(lowpass);

const speedUp = new Tone.Sequence(
  (time, note) => {
    synth.triggerAttackRelease(note, "4n", time);
  },
  [["C4", "E4", "G4"],
  ["F4", "A4", "C5"],
  ["G4", "B4", "D5"],
  ["A4", "C5", "E5"]]
);

const endGameMelody = new Tone.Sequence(
  (time, note) => {
    dSynth.triggerAttackRelease(note, "2n", time);
  },
 [ "C3", "G2", "C2", "G1"]
);

const bgMelody = new Tone.Sequence(
  (time, note) => {
    dSynth.triggerAttackRelease(note, "4n", time);
  },
  ['C4', 'E4', 'G4', 'B4']
);

const startGameMelody = new Tone.Sequence(
  (time, note) => {
    dSynth.triggerAttackRelease(note, "4n", time);
  },
  ["C4", "E4", "G4", "C5", "G4", "E4", "C4",
  "C4", "E4", "G4", "C5", "G4", "E4", "C4",
  "C4", "D4", "E4", "F4", "E4", "D4", "C4"]
);

const GameState = {
  Start: "Start",
  Playing: "Playing",
  GameOver: "GameOver",
};

let game = {
  score: 0,
  maxScore: 0,
  maxTime: 30,
  elapsedTime: 0,
  totalSprites: 100,
  state: GameState.Start,
  targetSprite: 2 ,
};

let soundFX;

function preload() {
  for (let i = 0; i < spriteSheetFilenames.length; i++) {
    spriteSheets[i] = loadImage("assets/" + spriteSheetFilenames[i]);
  }
  deadSpider = loadImage("assets/spiderWalk/spider3.png");
  soundFX = new Tone.Players({
    "hit": "soundFX/splat.mp3",
    "miss": "soundFX/miss.mp3",
  }).toMaster();
}



function setup() {
  createCanvas(400, 400);
  imageMode(CENTER);
  angleMode(DEGREES);
  frameRate(60);
  soundFX.player = function(name) {
    return soundFX.get(name);
  };
  reset();
}

function reset() {
  game.elapsedTime = 0;
  game.score = 0;
  game.totalSprites = random(30, 40);
  
  Tone.Transport.stop("0");
  startGameMelody.start();
  Tone.Transport.start("+8n");

  animations = [];
  for (let i = 0; i < game.totalSprites; i++) {
    animations[i] = new WalkingAnimation(
      random(spriteSheets),
      32,
      32,
      random(0, 400),
      random(0, 400),
      6,
      random(0.5, 1),
      3,
      random([0, 5])
    );
  }
}

function draw() {
  switch (game.state) {
    case GameState.Playing:
      endGameMelody.stop();
      startGameMelody.stop();
      bgMelody.start();
      background(220);
      for (let i = 0; i < animations.length; i++) {
        animations[i].draw();
      }
      if(game.score > 5){
        bgMelody.stop();
        speedUp.start();
        for (let i = 0; i < animations.length; i++) {
          animations[i].moving *= 1.005;
        }
        if(game.score > 10) {
          for (let i = 0; i < animations.length; i++) {
            animations[i].moving *= 1.005;
          }
        }
      }
      fill(0);
      textSize(40);
      text(game.score, 20, 40);
      let currentTime = game.maxTime - game.elapsedTime;
      deltaTime = millis() - (game.previousTime || millis());
      game.elapsedTime += deltaTime / 1000;
      game.previousTime = millis();
      text(ceil(currentTime), 300, 40);
      if (currentTime < 0) game.state = GameState.GameOver;
      break;
    case GameState.GameOver:
      bgMelody.stop();
      speedUp.stop();
      endGameMelody.start();
      game.maxScore = max(game.score, game.maxScore);
      background(0);
      fill(255);
      textSize(40);
      textAlign(CENTER);
      text("Game Over!", 200, 200);
      textSize(35);
      text("Score: " + game.score, 200, 270);
      text("Max Score: " + game.maxScore, 200, 320);
      break;
    case GameState.Start:
      bgMelody.stop();
      speedUp.stop();
      startGameMelody.start();
      background(0);
      fill(255);
      textSize(50);
      textAlign(CENTER);
      text("BigSquish", 200, 200);
      textSize(30);
      text("Press Any Key to Start", 200, 300);
      break;
  }
}

function keyPressed() {
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

function mousePressed() {
  switch (game.state) {
    case GameState.Playing:
      for (let i = 0; i < animations.length; i++) {
        let contains = animations[i].contains(mouseX, mouseY);
        if (contains) {
          if (animations[i].moving != 0) {
            soundFX.player("hit").start();
            animations[i].stop();
            if (animations[i].spritesheet === spriteSheets[game.targetSprite]) {
              game.score += 1;
           } else game.score += 1;
          } 
       } else {
         soundFX.player("miss").start();
       }
     }
      break;
    case GameState.GameOver:
      reset();
      game.state = GameState.Playing;
      break;
  }
}

class WalkingAnimation {
  constructor(
    spritesheet,
    sw,
    sh,
    dx,
    dy,
    animationLength,
    speed,
    framerate,
    vertical = false,
    offsetX = 0,
    offsetY = 0
  ) {

    this.spritesheet = spritesheet;
    this.sw = sw;
    this.sh = sh;
    this.dx = dx;
    this.dy = dy;
    this.u = 0;
    this.v = 0;
    this.animationLength = animationLength;
    this.currentFrame = 0;
    this.moving = 1;
    this.xDirection = 1;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.speed = speed;
    this.framerate = framerate * speed;
    this.vertical = vertical;
  }

  draw() {
    this.u =
      this.moving != 0 ? this.currentFrame % this.animationLength : this.u;
    push();
    translate(this.dx, this.dy);
    if (this.vertical) rotate(90);
    scale(this.xDirection, 1);
    image(
      this.spritesheet,
      0,
      0,
      this.sw,
      this.sh,
      this.u * this.sw + this.offsetX ,
      this.v * this.sh + this.offsetY ,
      this.sw,
      this.sh
    );
    pop();
    let proportionalFramerate = round(frameRate() / this.framerate);
    if (frameCount % proportionalFramerate == 0) {
      this.currentFrame++;
    }
    if (this.vertical) {
      this.dy += this.moving * this.speed;
      this.move(this.dy, this.sw / 4, height - this.sw / 4);
    } else {
      this.dx += this.moving * this.speed;
      this.move(this.dx, this.sw / 4, width - this.sw / 4);
    }
  }

  move(position, lowerBounds, upperBounds) {
    if (position > upperBounds) {
      this.moveLeft();
    } else if (position < lowerBounds) {
      this.moveRight();
    }
  }

  moveRight() {
    this.moving = 1;
    this.xDirection = 1;
    this.v = 0;
  }

  moveLeft() {
    this.moving = -1;
    this.xDirection = -1;
    this.v = 0;
  }

  keyPressed(right, left) {
    if (keyCode === right) {
      this.currentFrame = 1;
    } else if (keyCode === left) {
      this.currentFrame = 1;
    }
  }

  keyReleased(right, left) {
    if (keyCode === right || keyCode === left) {
      this.moving = 0;
    }
  }

  contains(x, y) {
    rect(-30,-20,20,30);
    let insideX = x >= this.dx - 16 && x <= this.dx + 16;
    let insideY = y >= this.dy - 16 && y <= this.dy + 16;
    return insideX && insideY;
  }

  stop() {
    this.moving = 0;
    this.u = 6;
    this.v = 0;
  }
}
//https://antoinesfeir.github.io/assignments/Graphics/asfeir1_BugSquish/index.html 