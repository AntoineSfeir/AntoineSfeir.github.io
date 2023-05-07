class Laser {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.radius = 5; // radius 
        this.d = this.radius * 2; // diameter
        this.toDelete = false; // flag 
    }

    show() {
        if (this.type == "enemy") {
            noStroke();
            fill("red");
            ellipse(this.x, this.y, this.d - 2.5, this.d + 5);
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
    offscreen() {
        if (this.x > width || this.x < 0) {
            return true;
        } else {
            return false;
        }
    }
}