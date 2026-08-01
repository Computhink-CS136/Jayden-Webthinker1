let shapeColor = fill(random(0, 255), random(0, 255), random(0, 255));

function setup() {
    createCanvas(400, 400);
    background(220);
}

function draw() {
    fill(shapeColor);
    circle(200, 200, 80);
}

function mousePressed() {
    shapeColor = fill(random(0, 255), random(0, 255), random(0, 255));
}

function mouseReleased() {
    shapeColor = fill(random(0, 255), random(0, 255), random(0, 255));
}