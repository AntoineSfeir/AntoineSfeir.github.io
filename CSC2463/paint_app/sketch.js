let lastX, lastY;
let color = 'black';

function setup() {
  createCanvas(800, 600);
}

function mousePressed() {
  lastX = mouseX;
  lastY = mouseY;
}

function mouseDragged() {
  strokeWeight(5);
  stroke(color);
  line(lastX, lastY, mouseX, mouseY);
  lastX = mouseX;
  lastY = mouseY;
}

function draw() {
  noStroke();
  //paint palette
  fill("red");
  rect(0, 0, 50, 50);
  fill("orange");
  rect(0, 50, 50, 50);
  fill("yellow");
  rect(0, 100, 50, 50);
  fill("#00ff00");
  rect(0, 150, 50, 50);
  fill("#00FFFF");
  rect(0, 200, 50, 50);
  fill("blue");
  rect(0, 250, 50, 50);
  fill("magenta");
  rect(0, 300, 50, 50);
  fill("#8B4513");
  rect(0, 350, 50, 50);
  fill("white");
  rect(0, 400, 50, 50);
  fill("black");
  rect(0, 450, 50, 50);


  //color selection
  if (mouseX < 50 && mouseY < 50) {
    if (mouseIsPressed) {
      color = 'red';
    }
  }
  if (mouseX < 50 && mouseY < 100 && mouseY > 50) {
    if (mouseIsPressed) {
      color = "orange";
    }
  }
  if (mouseX < 50 && mouseY < 150 && mouseY > 100) {
    if (mouseIsPressed) {
      color = "yellow";
    }
  }
  if (mouseX < 50 && mouseY < 200 && mouseY > 150) {
    if (mouseIsPressed) {
      color = "#00ff00";
    }
  }
  if (mouseX < 50 && mouseY < 250 && mouseY > 200) {
    if (mouseIsPressed) {
      color = "#5C4033";
    }
  }
  if (mouseX < 50 && mouseY < 300 && mouseY > 250) {
    if (mouseIsPressed) {
      color = "blue";
    }
  }
  if (mouseX < 50 && mouseY < 350 && mouseY > 300) {
    if (mouseIsPressed) {
      color = "magenta";
    }
  }
  if (mouseX < 50 && mouseY < 400 && mouseY > 350) {
    if (mouseIsPressed) {
      color = "#8B4513";
    }
  }
  if (mouseX < 50 && mouseY < 450 && mouseY > 400) {
    if (mouseIsPressed) {
      color = "white";
    }
  }
  if (mouseX < 50 && mouseY < 500 && mouseY > 450) {
    if (mouseIsPressed) {
      color = "black";
    }
  }
}
