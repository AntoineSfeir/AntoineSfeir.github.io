class PowerUp {
    constructor(x, y, type, shieldImg) {
        this.x = x;
        this.y = y;
        this.w = 25;
        this.h = 25;
        this.currentTime = millis();
        this.radius = 25; // radius 
        this.d = this.radius * 2; // diameter
        this.toDelete = false; // flag 
        this.type = type;
        this.currentImg = "A";
        this.alive = true;
        this.die = false;
        this.frameIndex = 0;
        this.moving = false;
        this.shieldImg = shieldImg;
    }

    show() {
        if (this.type == "shield") {
           image(shieldImg, this.x, this.y, this.w, this.h);
        } else {
            
            ellipse(this.x, this.y, this.w, this.h);
            //Text("1UP", this.x, this.y);
        } 
    }

    move(){
        this.y += 5;
    }

    
    remove() {
        this.toDelete = true;
    }

    offscreen() {
        if (this.y > height - 150 || this.y < 275) {
            return true;
        } else {
            return false;
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

}