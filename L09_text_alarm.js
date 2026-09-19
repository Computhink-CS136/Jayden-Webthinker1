let hr;
let min;
let sec;

function setup() {
    createCanvas(600, 400);
    textAlign(CENTER, CENTER);
    textSize(40);
    fill("rgb(20, 70, 190)");
}

function draw() {
    background(0)
    hr = hour();
    min = minute();
    sec = second();

    timeString = nf(hr, 2) + ":" + nf(min, 2) + ":" + nf(sec, 2)
        text(timeString, width / 2, height / 2);
}