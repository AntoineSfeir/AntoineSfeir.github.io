
class bounusAlien {
    constructor(x, y, img, pointValue) {
        this.x = x;
        this.y = y;
        this.w = 50;
        this.h = 30;
        this.alive = true;
        this.img = img;
        this.pts = pointValue;
        this.radius = 20; // for collison detection
        this.xdir = -2.25;
        this.toDelete = false;
    }

    show() {
        if (this.alive) {
            image(this.img, this.x, this.y, this.w, this.h); 
        }
    }

    move() {
        this.x += this.xdir;
    }
    remove() {
        this.toDelete = true;
    }

}