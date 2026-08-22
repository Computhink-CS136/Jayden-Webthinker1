// function setup() {
//     createCanvas(400, 400);
//     background(220)
// }
// let x = 200
// let y = 200
// function draw() {
//     background(220)
//        if (keyIsDown(UP_ARROW)) {
//         y -= 2;
//     }
//     if (keyIsDown(DOWN_ARROW)) {
//         y += 2;
//     }
//     if (keyIsDown(RIGHT_ARROW)) {
//         x  += 2;
//     }
//     if (keyIsDown(LEFT_ARROW)) {
//         x  -= 2;
//     }
//     if (keyCode === 32) {
//         let col = random(0, 255);
//         fill(col);
//     }

//     y = constrain(y, 50, 350 - 50);
//     x = constrain(x, 50, 350 - 50);
//     rect(x, y, 50, 50);
// }

let speed = 5;
let x = 100;
let y = 200;
let soundEffect, bgMusic, staticImage;

function preload() {
    soundEffect = loadSound('assets/pop.mp3');
    bgMusic = loadSound('assets/bossaNova.mp3');
    staticImage = loadImage('assets/pico-a.png');
}

function setup() {
    createCanvas(400, 400);
    bgMusic.loop();
}

function draw() {
    background("lightblue")
    image(staticImage, x, y, 100, 100);
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
    if (x === 400 || x === 0 || y === 400 || y === 0 ) {
        popSound.play();
        background("red")
    }
    y = constrain(y, 0, width - 100);
    x = constrain(x, 0, height - 100);
}

function keyPressed() {
    if (keyCode === 32) {
        soundEffect.play();
    }
}
