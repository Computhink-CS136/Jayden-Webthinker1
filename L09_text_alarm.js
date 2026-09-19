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
    hr = hr();
    min = min();
    sec = sec();

    text(hour, width / 2, height / 2)
    text(minute)
}