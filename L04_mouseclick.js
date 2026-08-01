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
    shapeColor = 'red';
}

function mouseReleased() {
    shapeColor = '';
}