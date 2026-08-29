let picoImage;
let popSound;

function preload() {
    picoImage = loadImage("assets/pico-a.png")
    popSound = loadSound("assets/pop.mp3")
}

function setup() {
    createCanvas(600, 400);
}
let speed = 5;
let x = 100;
let y = 200;
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
    y = constrain(y, 0, height);
    x = constrain(x, 0, width);
    image(picoImage, x, y, 100, 100);
}