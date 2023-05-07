
class bonusAlien {
    constructor(x, y, img, explosionImages, pointValue) {
        this.x = x;
        this.y = y;
        this.w = 50;
        this.h = 30;
        this.radius = 25;
        this.alive = true;
        this.explosionImages = explosionImages;
        this.img = img;
        this.pts = pointValue;
        this.radius = 20; // for collison detection
        this.xdir = -2.25;
        this.toDelete = false;
        this.bullets = [];
        this.frameIndex = 0;
    }

    show() {
        if (this.alive) {
            image(this.img, this.x, this.y, this.w, this.h);
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
    }

    changeDir() {
        this.xdir *= -1;
    }
    remove() {
        this.toDelete = true;
    }

}