let shapeColor = 'blue';

function setup() {
    createCanvas(400, 400);
    background(220);
}

function draw() {
    fill(shapeColor);
    circle(200, 200, 80);
}

function mousePressed() {
    let randomCol = color(random(0, 255), random(0, 255), random(0, 255));
    fill(randomCol);
    noStroke();
    circleSize = random(100)
    circle()
}

function mouseReleased() {
    shapeColor = 'blue';
}