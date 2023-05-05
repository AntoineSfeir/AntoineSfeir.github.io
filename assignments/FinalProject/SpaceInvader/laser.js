class Laser {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.time = 500;
        this.currentTime = millis();
        this.r = 5; // radius 
        this.d = this.r * 2; // diameter
        this.toDelete = false; // flag 
    }

    show() {
        if (this.type == "enemy") {
            noStroke();
            fill("red");
            ellipse(this.x, this.y, this.d, this.d);
        } else {
            noStroke();
            fill(255, 0, 255); // pink 
            ellipse(this.x, this.y, this.d, this.d);
        }
    }

    move() {
        if (this.type == "enemy") {
            this.y = this.y + 20; // up on the y-axis
        } else {
            this.y = this.y - 20;
        }
    }

    hits(alien) {
        // distance function measures the distance between two points
        let dx = dist(this.x, this.y, alien.x, alien.y);
        if (dx < this.r + alien.radius) {
            return true;
        } else {
            return false;
        }
    }

    remove() {
        this.toDelete = true;
    }
    offscreen() {
        if (this.x > width || this.x < 0) {
          return true;
        } else {
          return false;
        }
      }
}