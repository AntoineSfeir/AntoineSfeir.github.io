//Antoine Sfeir
//CSC2463
//example2
  function setup() {
    createCanvas(500, 600);
    background('white');
  }
  
  function draw() {
    background(255);
    noStroke();

    //red
    fill(255, 0, 0, 100);
    ellipse(width/2, 200, 275, 275);
    //blue
    fill(0, 0, 255, 100);
    ellipse(150, 375, 275, 275);
    //green
    fill(0, 255, 0, 100);
    ellipse(355, 375, 275, 275);
    
    
    
  }

