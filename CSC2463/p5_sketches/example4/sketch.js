//Antoine Sfeir
//CSC2463
//example4
function setup() {
    createCanvas(500, 500);
    background('darkBlue');
}

function draw() {

    //initial circle
    noStroke();
    fill('white');
    ellipse(250, 250, 280, 280);

    //2nd circle
    fill('green');
    ellipse(250, 250, 270, 270);

    //intial star
    fill('white');
    push();
    translate(0, 0);
    rotate(radians(17));
    star(310, 165, 150, 60, 5);
    pop();

    //2nd star
    fill('red');
    push();
    translate(0, 0);
    rotate(radians(17));
    star(310, 165, 135, 50, 5);
    pop();
}

function star(x, y, radius1, radius2, npoints) {
    //Gives the angle between each point of the star.
    let angle = TWO_PI / npoints;
    //Gives the angle between the inner and outer points of the star.
    let halfAngle = angle / 2.0;
    beginShape();
    //iterate through the angle of the full circle.
    for (let a = 0; a < TWO_PI; a += angle) {
        let sx = x + cos(a) * radius2;
        let sy = y + sin(a) * radius2;
        vertex(sx, sy);
        sx = x + cos(a + halfAngle) * radius1;
        sy = y + sin(a + halfAngle) * radius1;
        vertex(sx, sy);
    }
    endShape(CLOSE);
}
