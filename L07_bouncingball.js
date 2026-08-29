let picoImage;
let popSound;

function preload() {
    picoImage = loadImage("assets/pico-a.png")
    popSound = loadSound("assets/pop.mp3")
}

function setup() {
    createCanvas(600, 400);
}

function draw() {
    background("gray");
if (keyIsDown(UP_ARROW)) {
        y -= speed;
    }
    if (keyIsDown(DOWN_ARROW)) {
        y += speed;
    }
    if (keyIsDown(RIGHT_ARROW)) {
        x  += speed;
    }
    if (keyIsDown(LEFT_ARROW)) {
        x  -= speed;
    }
    if (x === 400 - 100 || x === 0 || y === 400  - 100|| y === 0 ) {
    }
    y = constrain(y, 0, width - 100);
    x = constrain(x, 0, height - 100);
    image(staticImage, x, y, 100, 100);
}