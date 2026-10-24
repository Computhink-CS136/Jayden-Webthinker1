let playerX = 100;
let playerY;
let playerSize = 30;
let velocity = 0;
let isGrounded = false;
let spikesX = [];
let spikeWidth = 20;
let spikeHeight = 30;
let spikeSpeed = 5;

function setup() {
    createCanvas(600, 400);
    textAlign(CENTER, CENTER);
    playerY = height - playerSize;


    for (let i = 0; i < 3; i++) {
        spikesX.push(width + i * 300);
    }
}

function draw() {
    background(0);

    velocity += 0.8;
    playerY += velocity;

    if (playerY >= height - playerSize) {
        playerY = height - playerSize;
        isGrounded = true;
        velocity = 0;
    } else {
        isGrounded = false;
    }
    
    fill(0, 255, 0);
    rect(playerX, playerY, playerSize, playerSize);
    fill(255, 0, 255);
    for (let i = 0; i < spikesX.length; i++) {
        spikesX[i] -= spikeSpeed;

        if (spikes[i] < - spikeWidth) {
            spikesX[i] = width + random(100, 300);
        }
        triangle(spikesX[i], height, spikesX[i] + spikeWidth / 2, height - spikeHeight, spikes[i] + spikeWidth, height);
    }
}

function keyPressed() {
    if (key === " " && isGrounded === true) {
        velocity = -12;
    }
}