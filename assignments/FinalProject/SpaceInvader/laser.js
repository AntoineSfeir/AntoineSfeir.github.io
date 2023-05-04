class Laser {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.r = 5; // radius 
        this.d = this.r * 2; // diameter
        this.toDelete = false; // flag 
    }

    show() {
        noStroke();
        fill(255, 0, 255); // pink 
        ellipse(this.x, this.y, this.d, this.d);
    }

    move() {
        this.y = this.y - 20; // up on the y-axis
    }

    hits(alien) {
        // distance function measures the distance between two points
        let dx = dist(this.x, this.y, alien.x, alien.y);
        if(dx < this.r + alien.radius) {
            return true;
        } else {
            return false;
        }
    }

    remove() {
        this.toDelete = true;
    }
}