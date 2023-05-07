class Ship {
    constructor() {
        this.x = width / 2;
        this.y = height - 10;
        this.width = 60;
        this.radius = 30;
        this.height = 15;
        this.xdir = 0;
        this.hit = false;
    }

    show() {
        if(this.hit) {
            fill('red');
            noStroke();
            rect(this.x, this.y, this.width, this.height);
            rect(this.x + 20, this.y - 10, 20, 10);
            this.hit = false;
        } else {
            fill('green');
            noStroke();
            rect(this.x, this.y, this.width, this.height);
            rect(this.x + 20, this.y - 10, 20, 10);    
        }
    }

    move() {
        this.x += this.xdir * 10;
        if (this.x > width) {
            this.x = 0 - this.width;
        } else if (this.x < 0 - this.width) {
            this.x = width;
        }
    }

    setDir(dir) {
        this.xdir = dir;
    }

    isHit() {
        this.hit = true;
    }
}