// let picoImage;
// let popSound;

// function preload() {
//     picoImage = loadImage("assets/pico-a.png")
//     popSound = loadSound("assets/pop.mp3")
// }

// function setup() {
//     createCanvas(600, 400);
// }
// let picoWidth = 100;
// let speed = 5;
// let x = 100;
// let y = 200;
// function draw() {
//     background("gray");
//     if (keyIsDown(UP_ARROW)) {
//         y -= speed;
//     }
//     if (keyIsDown(DOWN_ARROW)) {
//         y += speed;
//     }
//     if (keyIsDown(RIGHT_ARROW)) {
//         x  += speed;
//     }
//     if (keyIsDown(LEFT_ARROW)) {
//         x  -= speed;
//     }
//     y = constrain(y, 0, height - 100);
//     x = constrain(x, 0, width - 100);
//     image(picoImage, x, y, picoWidth, 100);
// }
// function keyPressed() {
//     if (keyCode === 32) {
//         popSound.play();
//         picoWidth = 50;
//     }
// }

// function keyReleased() {
//     if (keyCode=== 32) {
//         picoWidth = 100;
//     }
// }
let ballx = 300;
let bally = 200;
let ballsize = 50;
let ballSpeedx = 30;
let ballSpeedY = 30;
function setup() {
    createCanvas(600, 400);
}

function draw() {
    background(220);
    ballx += ballSpeedx;
    bally += ballSpeedy;
    if (ballx <= 0 || ballx >= width) {
        ballSpeedx *= -1;
    }
    if (bally <= 0 || bally >= height) {
        ballSpeedy *= -1;
    }
    noStroke();
    fill(67, 194, 50);
    circle(ballx, bally, ballsize);
}

