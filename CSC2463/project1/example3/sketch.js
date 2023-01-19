//Antoine Sfeir
//CSC2463
//example3
function setup() {
    createCanvas(600, 300);
    background(0);
}

function draw() {

    //ghost
    //body
    fill('red');
    rect(350, 150, 226, 125);
    //head
    noStroke();
    ellipse(463, 150, 225, 225);
    //eyes
    fill('white');
    ellipse(400, 150, 60, 60);
    ellipse(525, 150, 60, 60);
    fill('blue');
    ellipse(400, 150, 30, 30);
    ellipse(525, 150, 30, 30);


    //pac-man
    //body
    fill('yellow');
    ellipse(150, 170, 225, 225);
    //mouth
    fill('black');
    triangle( 10, 250, 10, 50, 150, 170)

}
