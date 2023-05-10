class Rocket {
    constructor(x, y, img, explosions) {
        this.x = x;
        this.y = y;
        this.w = 18;
        this.h = 20;
        this.currentTime = millis();
        this.radius = 10; // radius 
        this.d = this.radius * 2; // diameter
        this.toDelete = false; // flag 
        this.explosions = explosions; // initialize the explosions property
        this.img = img;
        this.currentImg = "A";
        this.alive = true;
        this.die = false;
        this.frameIndex = 0;
        this.moving = true;
    }

    show() {
        image(this.img, this.x, this.y, this.w, this.h);
    }

    move(target) {
        let dx = dist(this.x, this.y, target.x, target.y);
        if (dx - 70 < this.radius + target.radius || this.y > height - 200) {
            this.y += 20;
        } else {
            let dir = createVector(target.x - this.x, target.y - this.y);
            dir.normalize();
            dir.mult(10);
            // Update the position of the rocket
            this.x += dir.x;
            this.y += dir.y;
        }

    }

    fall() {
        this.moving = false;
    }

    hits(target) {
        // distance function measures the distance between two points
        let dx = dist(this.x, this.y, target.x, target.y);
        if (dx < this.radius + target.radius) {
            return true;
        } else {
            return false;
        }
    }

    remove() {
        this.toDelete = true;
    }

    update() {
        if (this.die && this.frameIndex < this.explosions.length) {
            // Display explosion animation for all frames in the array
            image(this.explosions[this.frameIndex], this.x, this.y, this.w, this.h);
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

    offscreen() {
        if (this.y > height - 150 || this.x > width - 150 || this.x < 150) {
            return true;
        } else {
            return false;
        }
    }

}