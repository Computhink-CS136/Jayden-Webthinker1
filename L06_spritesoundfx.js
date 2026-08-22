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
//     if (keyIsDown(SPACEBAR)) {
//         let col = random(0, 255);
//         fill(col);
//     }

//     y = constrain(y, 50, 350 - 50);
//     x = constrain(x, 50, 350 - 50);
//     rect(x, y, 50, 50);
// }

let soundEffect, bgMusic, staticImage;

function preload() {
    soundEffect = loadSound('assets/pop.mp3')
    mgMusic = loadSound('assests/bossNova.mp3')
    staticImage = loadImage('assets/pico-a.png')
}

function setup() {
    createCanvas(200, 200);
}