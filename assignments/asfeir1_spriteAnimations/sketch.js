
let photoDirectory = "images/guy/";
let guy_sprites = [];
let guy, stand, idle;



function preload() {
    idle = loadImage("images/guy/idle.png");
    for (let i = 0; i <= 7; i++) {
        guy_sprites[i] = loadImage(
            photoDirectory + "walk" + i + ".png"
        );
    }
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    guy_sprites.scale = 0.5;

    guy = createSprite(width / 2, height / 2);

    guy.addImage('idle', idle);
    
    let guy_animation = guy.addAnimation(
        "walking",
        guy_sprites[0],
        guy_sprites[1],
        guy_sprites[2],
        guy_sprites[3],
        guy_sprites[4],
        guy_sprites[5],
        guy_sprites[6],
        guy_sprites[7],
    );

    guy_animation.frameDelay = 4;
    

}

function draw() {
    background(200);

    if (guy.position.x < 0) {
        guy.position.x = windowWidth;
    } else if (guy.position.x > windowWidth) {
        guy.position.x = 0;
    }

    if (keyIsDown(LEFT_ARROW)) {
        guy.mirrorX(-1);
        guy.setSpeed(3, 180);
        guy.changeAnimation("walking");
        guy.animation.play();
    } else if (keyIsDown(RIGHT_ARROW)) {
        guy.mirrorX(1);
        guy.setSpeed(3, 0);
        guy.changeAnimation("walking");
        guy.animation.play();
    } 
    if(!keyIsDown(LEFT_ARROW) && !keyIsDown(RIGHT_ARROW)) {
        guy.setSpeed(0, 180);
        guy.changeAnimation('idle');
    }
    drawSprites();
}


