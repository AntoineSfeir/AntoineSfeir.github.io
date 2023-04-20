var ship;
var flowers = [];
var drops = [];

function setup() {
    createCanvas(600, 400);
    ship = new Ship();
    for(var i = 0; i < 6; i++) {
        drops[i] = new Drop(ship.x, ship.y);
    }
    for(var i = 0; i < 6; i++) {
        flowers[i] = new Flower(i*80+80, 60);
    }
}

function draw() {
    background(51);
    ship.show();
    for(var i = 0; i < flowers.length; i++) {
        flowers[i].show();
    }
    for(var i = 0; i < drops.length; i++) {
        drops[i].show();
        drops[i].move();
    }
}

function keyPressed() {
    if(key === ' ') {
        var drop = new Drop(ship.x, ship.y);
        drops.push(drop);
    }
    if(keyCode === RIGHT_ARROW) {
        ship.move(1);
    } 
    else if(keyCode === LEFT_ARROW) {
        ship.move(-1);
    }
}

