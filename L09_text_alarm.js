// let hr;
// let min;
// let sec;
// let timeString;

// function setup() {
//     createCanvas(600, 400);
    // textAlign(CENTER, CENTER);
    // textSize(40);
    // fill("rgb(20, 70, 190)");
// }

// function draw() {
//     background(0)
//     hr = hour();
//     min = minute();
//     sec = second();

//     timeString = nf(hr, 2) + ":" + nf(min, 2) + ":" + nf(sec, 2)
//     text(timeString, width / 2, height / 2);
// }

// let intervalId;
// let x = 0;

// function setup() {
//     createCanvas(600, 400);
//     intervalId = setInterval(drawCircle, 10);
// }

// function draw() {
//     // background(0);
// }

// function drawCircle() {
//     clear();
//     circle(x, 50, 20);
//     x += 10;
//     if (x > 200) {
//         x = 0;
//     }
// }
// function mousePressed() {
//     clearInterval(intervalId);
// }

let intervalId;
let countdown = 5;
function setup() {
    createCanvas(600, 400);
    intervalId = setInterval(countdown, 1000);
}
function draw() {
    background(150);
}
function mousePressed() {

}
function updateCountdown() {

}
