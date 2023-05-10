class Ship {
    constructor() {
        this.x = width / 2;
        this.y = height - 150;
        this.width = 60;
        this.radius = 35;
        this.height = 15;
        this.xdir = 0;
        this.hit = false;
        this.sheildOn = false;
    }

    show() {
        if(this.hit && !this.sheildOn) {
            fill('red');
            noStroke();
            rect(this.x, this.y, this.width, this.height);
            rect(this.x + 20, this.y - 10, 20, 10);
            this.hit = false;
        } else if(this.sheildOn){
            fill('green');
            noStroke();
            rect(this.x, this.y, this.width, this.height);
            rect(this.x + 20, this.y - 10, 20, 10);
            fill('blue');
            ellipse(this.x, this.y, this.radius, this.radius);
        } else {
            fill('green');
            noStroke();
            rect(this.x, this.y, this.width, this.height);
            rect(this.x + 20, this.y - 10, 20, 10);
        }
    }

    move() {
        this.x += this.xdir * 10;
        if (this.x > width - 130) {
            this.x = 130;
        } else if (this.x < 100) {
            this.x = width - 130;
        }
    }

    setDir(dir) {
        this.xdir = dir;
    }

    isHit() {
        this.hit = true;
    }
    removeSheild() {
        this.sheildOn = false;
    }
    addSheild() {
        this.sheildOn = true;
    }
    
    sheildActive() {
        return this.sheildOn;
    }
}