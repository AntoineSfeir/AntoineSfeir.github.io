class Alien {
  constructor(x, y, imgA, imgB, explosionImages, pointValue) {
    this.x = x;
    this.y = y;
    this.w = 38;
    this.h = 30;
    this.alive = true;
    this.die = false;
    this.explosionImages = explosionImages;
    this.imgA = imgA;
    this.imgB = imgB;
    this.currentImg = "A";
    this.pts = pointValue;
    this.radius = 20; // for collison detection
    this.xdir = 1;
    this.bullets = [];
    this.frameIndex = 0;
  }

  show() {
    if (this.alive) {
      if (this.currentImg === "A") {
        image(this.imgA, this.x, this.y, this.w, this.h);
      }
      if (this.currentImg === "B") {
        image(this.imgB, this.x, this.y, this.w, this.h);
      }
    } 

  }

  update() {
    if (this.die && this.frameIndex < this.explosionImages.length) {
        // Display explosion animation for all frames in the array
        image(this.explosionImages[this.frameIndex], this.x, this.y, this.w, this.h);
        this.frameIndex++;
      } else {
        // Reset frameIndex and mark alien as dead
        this.frameIndex = 0;
        this.alive = false;
        this.die = false;
      }
  }
  
  explode() {
    this.frameIndex = 0;
    this.alive = false;
    this.die = true;
  }

  move() {
    this.x += this.xdir;
    // image animation
    if (this.currentImg === "A") {
      this.currentImg = "B";
    } else {
      this.currentImg = "A";
    }
  }

  shiftDown() {
    this.xdir *= -1;
    this.y += 20;
    if (this.y > height - 100) {
      // game over
      console.log("game over");
    }
  }
}
