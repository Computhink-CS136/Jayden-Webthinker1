let hr;
let min;
let sec;

function setup() {
    createCanvas(600, 400);
    textAlign(CENTER, CENTER);
    TextSize(40);
    fill("rgb(20, 70, 190)");
}

function draw() {
    background(0)
    hr = hr();
    min = min();
    sec = sec();

    text(hour, width / 2, height / 2);
    text(minute, width / 2, height / 2 + 50);
    text(sec, width / 2, height / 2 + 100);
}