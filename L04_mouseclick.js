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

// function setup() {
//     createCanvas(400, 400);
//     background(220);
// }
// function mouseMoved() {
//     let randomCol = color(random(0, 255), random(0, 255), random(0, 255));
//     fill(randomCol)
//     ellipse(mouseX, mouseY, 10, 10);
// }
// function setup() {
//     createCanvas(400, 400);
//     background(220);
// }
// let prevMouseX = mouseX
// let circleSize = 50
// function mouseMoved() {
//     if (prevMouseX < mouseX) {
//         circleSize++
//      } else {
//         circleSize--
//      }
//     background(220);
//     ellipse(200, 200, circleSize, circleSize);
// }
// function setup() {
//     createCanvas(400, 400);
//     background(220);
// }
// function mouseMoved() {
//     ellipse(200, 200, mouseX, mouseY);
// }
// function setup() {
//     createCanvas(400, 400);
//     background(220);
// }
// function mouseMoved() {
//     background(220);
//     circle(200, 200, mouseX);
// }
function setup() {
    createCanvas(400, 400);
    background(220);
}
function mouseDragged() {
    for (let i = 0; i < 5; i++) {
        let randomSize = random(10, 30)
        let randomMouseX = random(mouseX-10)
    }
    let randomCol = color(random(0, 255), random(0, 255), random(0, 255));
    fill(randomCol)
    let randomSize = random(10, 30)
    noStroke()
    circle(mouseX, mouseY, randomSize);
}