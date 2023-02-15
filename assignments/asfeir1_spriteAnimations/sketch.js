// Antoine Sfeir
// CSC 2463
let ninjaSpriteSheet;
let guySpriteSheet;
let bg;
let ninjaWalkingAnimation;
let guyWalkingAnimation;

let spriteSheetFileNames = ["Guy.png", "Ninja.png"];
let spriteSheets = [];
let animations = [];

//loads assets from images folder
function preload() {
  bg = loadImage("images/backgrounds/background.png");
  for (var i = 0; i < spriteSheetFileNames.length; i++) {
    spriteSheets[i] = loadImage(
      "images/spriteSheets/" + spriteSheetFileNames[i]
    );
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  for (var i = 0; i < spriteSheets.length; i++) {
    animations[i] = new walkAnimation(
      spriteSheets[i],
      30,
      30,
      width / 2 + i * 100,
      height - 500,
      9
    );
  }
}

function draw() {
  //push();
  //background(bg);
  //pop();
  
  background(220);
  for (var i = 0; i < animations.length; i++) { animations[i].draw() };
}

function keyPressed() {
  for(var i = 0; i < animations.length; i++) {
    animations[i].keyPressed(RIGHT_ARROW, LEFT_ARROW);
  }
}

function keyReleased() {
  for(var i = 0; i < animations.length; i++) {
    animations[i].keyReleased(RIGHT_ARROW, LEFT_ARROW);
  }
}

class walkAnimation {
  constructor(
    sprite_Sheet,
    sw,
    sh,
    dx,
    dy,
    animationLength,
    offsetX = 0,
    offsetY = 0
  ) {
    this.sprite_sheet = sprite_Sheet;
    this.sw = sw;
    this.sh = sh;
    this.dx = dx;
    this.dy = dy;
    this.x = 0;
    this.y = 0;
    this.animationLength = animationLength;
    this.currentFrame = 0;
    this.moving = 0;
    this.xDir = 1;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
  }

  draw() {
    this.x = this.moving != 0 ? this.currentFrame % this.animationLength : 0;
    push();
    translate(this.dx, this.dy);
    scale(this.xDir, 1);

    image(
      this.sprite_sheet,
      0,
      0,
      this.sw,
      this.sh,
      this.x * this.sw + this.offsetX,
      this.y * this.sh + this.offsetY,
      this.sw,
      this.sh
    );
    pop();
    //updates sprite animation for each frame
    if (frameCount % 6 == 0) {
      this.currentFrame++;
    }

    this.dx += this.moving;

    //always sprites to wrap around the window
    if (this.dx < 0) {
      this.dx = windowWidth;
    } else if (this.dx > windowWidth) {
      this.dx = 0;
    }
  }

  //sprite movement
  keyPressed(right, left) {
    if (keyCode === right) {
      this.moving = 1;
      this.xDir = 1;
      this.currentFrame = 1;
    } else if (keyCode === left) {
      this.moving = -1;
      this.xDir = -1;
      this.currentFrame = 1;
    }
  }

  keyReleased(right, left) {
    if (keyCode === right || keyCode === left) {
      this.moving = 0;
      this.currentFrame = 1;
    }
  }
}