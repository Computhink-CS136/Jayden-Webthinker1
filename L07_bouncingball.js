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
let ballSpeedx = 5;
let ballSpeedY = 5;
function setup() {
    createCanvas(600, 400);
    background(220);
}

function draw() {
    ballx += ballSpeedx;
    bally += ballSpeedY;
    if (ballx <= 0 || ballx >= width) {
        ballSpeedx *= -1;
        fill(random(255), random(255), random(255));
    }
    if (bally <= 0 || bally >= height) {
        ballSpeedY *= -1;
        fill(random(255), random(255), random(255));
    }
    noStroke();
    circle(ballx, bally, ballsize);
}

