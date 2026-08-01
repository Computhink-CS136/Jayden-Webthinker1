// let shapeColor = 'blue';

// function setup() {
//     createCanvas(400, 400);
//     background(220);
// }

// function draw() {
//     fill(shapeColor);
// }

// function mousePressed() {
//     let randomCol = color(random(0, 255), random(0, 255), random(0, 255));
//     fill(randomCol);
//     circleSize = random(100);
//     ellipse(200, 200, 80, 80);
// }

// function mouseReleased() {
//     shapeColor = 'blue';
//     ellipse(200, 200, 80)
// }

// let shapeColor = 'white';
// function mousePressed() {
//     let randomCol = color(random(0, 255), random(0, 255), random(0, 255));
//     fill(randomCol);
//     circleSize = random(100);
//     ellipse(200, 200, 80, 80);
// }

// function mouseReleased() {
//     shapeColor = 'white';
//     ellipse(200, 200, 80, 80)
// }

function setup() {
    createCanvas(400, 400);
    background(220);
}
function mouseMoved() {
    let randomCol = color(random(0, 255), random(0, 255), random(0, 255));
    fill
    ellipse(mouseX, mouseY, 10, 10);
}